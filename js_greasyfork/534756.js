// ==UserScript==
// @name         WOD AFK Helper
// @version      1.1.2
// @description  1.自动激活最先结束地城的英雄；2.自动加速地城；3.每日访问一次仓库存放战利品；4.每日自动投票获取荣誉
// @author       purupurupururu
// @namespace    https://github.com/purupurupururu
// @match        *://*.world-of-dungeons.org/wod/spiel/settings/heroes.php*
// @match        *://*.world-of-dungeons.org/wod/spiel/hero/items.php*
// @icon         https://info.world-of-dungeons.org/wod/css/WOD.gif
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/534756/WOD%20AFK%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/534756/WOD%20AFK%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 解析时间字符串为时间戳
     * @param {string} text - 支持格式：
     *   1. "明天 02:34"
     *   2. "03:22"
     *   3. "今天 11:22"
     *   4. "你可以再次获得 5 : 明天 17:14"
     * @returns {number} 时间戳（毫秒）
     */
    function parseTime(text) {
        if ((/每日|立刻/).test(text)) return 0;
        // 匹配时间部分：可选前缀（今天/明天+空格） + 时间（HH:mm）
        const match = text.match(/(明天 |今天 )?(\d{2}:\d{2})$/);
        if (!match) throw new Error(`不支持的时间格式: '${text}'`);

        // 提取时间部分（如"02:34"）
        const [_, prefix, timeStr] = match;

        // 拆分小时和分钟
        const [hours, minutes] = timeStr.split(':');

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        // 处理"明天"的情况
        if (prefix === "明天 ") {
            date.setDate(date.getDate() + 1);
        }

        return date.getTime();
    }

    function formatTime(microSeconds) {
        const seconds = Math.floor(microSeconds / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    class Status {
        static DEPOSIT_SUCCESS = '入库成功';
        static DEPOSIT_PACKAGE_FULL = '背包满了';
        static DEPOSIT_PROCESSING = '入库中';

        static VOTE_QUERYING = '查询中';
        static VOTE_READY = '已准备好';
    }

    class ScriptStorageManager {

        static getDefaultValues() {
            const defaultValues = {
                scriptVersion: '1.1.2',
                actionName: HeroesPageManager.ACTION_DEFAULT,
                lastDepositDate: 0, // 最后入库的日期
                currentHeroIndex: 0, // 入库操作，当前操作的英雄列表索引
                checkReportTimestamp: 0, // 检查战报的时间
                overburdenedHeroes: [] // 战利品超载的英雄列表 {heroId, timestamp}
            };
            return defaultValues;
        }

        static set(key, value) {
            GM_setValue(key, value);
        }

        static get(key) {
            const currentVersion = GM_getValue('scriptVersion');
            const defaultValues = this.getDefaultValues();

            if (currentVersion !== defaultValues.scriptVersion) {
                const honoreeHeroId = GM_getValue('honoreeHeroId');
                const allKeys = GM_listValues().filter(k => k !== 'honoreeHeroId');
                allKeys.forEach(k => GM_deleteValue(k));
                if (honoreeHeroId !== undefined) {
                    GM_setValue('honoreeHeroId', honoreeHeroId);
                }
                GM_setValue('scriptVersion', defaultValues.scriptVersion);
            }
            return GM_getValue(key, defaultValues[key]);
        }

        static getAll() {
            const storedKeys = GM_listValues();
            const allValues = {};

            storedKeys.forEach(key => {
                allValues[key] = GM_getValue(key);
            });

            return allValues;
        }

        static deleteAll() {
            Object.keys(GM_listValues()).forEach(key => {
                GM_deleteValue(key);
            });
        }

        static getVersion() {
            return this.get('scriptVersion');
        }

        static getActionName() {
            return this.get('actionName');
        }

        static setActionName(value) {
            return this.set('actionName', value);
        }

        static getCheckReportTimestamp() {
            return this.get('checkReportTimestamp');
        }

        static setCheckReportTimestamp(value) {
            this.set('checkReportTimestamp', value);
        }

        static getHonoreeHeroId() {
            return this.get('honoreeHeroId');
        }

        static setHonoreeHeroId(value) {
            this.set('honoreeHeroId', value);
        }

        static getCurrentHeroIndex() {
            return this.get('currentHeroIndex');
        }

        static setCurrentHeroIndex(value) {
            this.set('currentHeroIndex', value);
        }

        static getLastDepositDate() {
            return this.get('lastDepositDate');
        }

        // 记录入库时间
        static recordDepositDate() {
            this.set('lastDepositDate', new Date().getDate());
        }

        static getOverburdenedHeroes() {
            return this.get('overburdenedHeroes');
        }

        // 添加超载英雄
        static markHeroAsOverburdened(heroId) {
            const heroes = this.get('overburdenedHeroes');
            const existingHero = heroes.find(h => h.heroId === heroId);
            if (existingHero) {
                existingHero.timestamp = Date.now();
            } else {
                heroes.push({
                    heroId,
                    timestamp: Date.now()
                });
            }
        }

        // 清除超载英雄标记（入库成功后、清理包裹后调用）
        static clearOverburdenedStatus(heroId) {
            const heroes = this.get('overburdenedHeroes').filter(
                h => h.heroId !== heroId
            );
            this.set('overburdenedHeroes', heroes);
        }
    }

    class HeroesPageManager {

        static ACTION_DEFAULT = 'default';
        static ACTION_DEPOSIT = 'deposit';
        static ACTION_VOTE = 'vote';

        static get ACTIONS() {
            return [
                HeroesPageManager.ACTION_DEPOSIT,
                HeroesPageManager.ACTION_VOTE,
            ];
        }

        constructor() {
            this.heroTable = new HeroTable(document.querySelector('table.content_table'));
            this.reduceBtn = document.querySelector('input[name="reduce_dungeon_time"]');
            this.submitBtn = document.querySelector('input[name="ok"]');
            this.actionName = ScriptStorageManager.getActionName();
        }

        execute() {
            this.runAction(this.actionName);
        }

        runAction(name) {
            switch (name) {
                case HeroesPageManager.ACTION_DEPOSIT:
                    return this.runDeposit();
                case HeroesPageManager.ACTION_VOTE:
                    return this.runVote();
                default:
                    return this.runDefault();
            }
        }

        runDefault() {
            if (!this.isHeroTablePage()) return;
            if (this.dungeonReduce()) return;
            this.dungeonMonitor();
            this.depositMonitor();
            this.voteMonitor();
        }

        dungeonMonitor() {
            const heroTable = this.heroTable;
            const minDungeonEndTimeRows = heroTable.find().whereClassIsNotMentor().whereMinDungeonEndTime().get();
            if (!this.areHeroesOnline(minDungeonEndTimeRows)) {
                this.setHeroesOnline(minDungeonEndTimeRows);
                return;
            }
            if (minDungeonEndTimeRows.length === 1 && !minDungeonEndTimeRows[0].isActive) {
                this.activeHero(minDungeonEndTimeRows[0]);
            }

            heroTable.addColumn(HeroTable.TH_DUNGEON_COUNTDOWN);
            const countdownColumnIndex = heroTable.indexOfTableHead(HeroTable.TH_DUNGEON_COUNTDOWN);
            heroTable.find().whereNextDungeonIsNull().get().forEach(
                row => row.showOn(countdownColumnIndex, HeroTable.DUNGEON_REQUIRE_TEXT)
            );
            const checkTimeout = () => {
                let countdown = minDungeonEndTimeRows[0].nextDungeon.endTimeCountdown();
                let countdownTimer = formatTime(countdown);
                if (countdown > 0) {
                    minDungeonEndTimeRows.forEach(row => row.showOn(countdownColumnIndex, countdownTimer));
                    setTimeout(checkTimeout, 1000);
                    return;
                }

                countdown = ScriptStorageManager.getCheckReportTimestamp() - Date.now();
                countdownTimer = formatTime(countdown);
                if (countdown > 0) {
                    minDungeonEndTimeRows.forEach(row => row.showOn(countdownColumnIndex, `${HeroTable.DUNGEON_STATUS_GENERATING_REPORT} ${countdownTimer}`));
                    setTimeout(checkTimeout, 1000);
                    return;
                }

                ScriptStorageManager.setCheckReportTimestamp(Date.now() + 60 * 1000);
                window.location.reload();
            }
            checkTimeout();
        }

        depositMonitor() {
            const hasDepositedToday = () => {
                return new Date().getDate() === ScriptStorageManager.getLastDepositDate();
            }
            const isTimeEnough = () => {
                const hero = this.heroTable.find().whereClassIsNotMentor().first();
                const countdown = hero.nextDungeon.endTimeCountdown();
                const timeCostPerHero = 5 * 60 * 1000;
                return countdown > timeCostPerHero * this.heroTable.findAll().length;
            }
            const canDeposit = () => {
                return !hasDepositedToday() && isTimeEnough();
            }
            if (canDeposit()) {
                ScriptStorageManager.setActionName(HeroesPageManager.ACTION_DEPOSIT);
                window.location.reload();
            }
        }

        voteMonitor() {
            const heroTable = this.heroTable;
            heroTable.addVoteCoumn(HeroTable.TH_VOTE);
            const voteColumnsIndex = heroTable.indexOfTableHead(HeroTable.TH_VOTE);
            const rows = heroTable.findAll();
            heroTable.dom.addEventListener('change', e => {
                if (e.target?.matches('input[name=vote]')) {
                    ScriptStorageManager.setHonoreeHeroId(e.target.value);
                    rows.forEach(row => row.showOn(voteColumnsIndex, '', {
                        selector: '.vote.countdown'
                    }));
                    window.location.reload();
                }
            })

            const honoreeHeroId = ScriptStorageManager.getHonoreeHeroId();
            const honoree = heroTable.find().byId(honoreeHeroId);
            if (honoree === undefined) {
                rows.forEach(row => row.showOn(voteColumnsIndex, Status.VOTE_QUERYING, {
                    selector: '.vote.countdown'
                }));
            } else {
                honoree.showOn(voteColumnsIndex, Status.VOTE_QUERYING, {
                    selector: '.vote.countdown'
                });
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: '/wod/spiel/rewards/vote.php',
                timeout: 2 * 60 * 1000,
                onload: (response) => {
                    try {
                        const votePage = this.getVoteServiceFromResponse(response);
                        const canVote = () => {
                            const hero = heroTable.find().whereClassIsNotMentor().whereNextDungeonIsNotNull().first();
                            const countdown = hero.nextDungeon.endTimeCountdown();
                            const timeCostPerUrl = 5 * 60 * 1000;
                            return countdown > timeCostPerUrl * votePage.findAll().length;
                        }
                        // 轮询检查倒计时
                        const checkTimeout = () => {
                            const event = votePage.findOneByMaxRewardTime();
                            const countdown = event.nextRewardTimeCountdown();

                            if (countdown > 0) {
                                // 更新倒计时显示
                                const displayText = formatTime(countdown);
                                if (honoree === undefined) {
                                    rows.forEach(row =>
                                        row.showOn(voteColumnsIndex, displayText, {
                                            selector: '.vote.countdown'
                                        })
                                    );
                                } else {
                                    honoree.showOn(voteColumnsIndex, displayText, {
                                        selector: '.vote.countdown'
                                    });
                                }

                                // 继续轮询
                                setTimeout(checkTimeout, 1000);
                                return;
                            }

                            // 倒计时结束，投票就绪
                            console.log('投票已准备好');
                            if (honoree === undefined) {
                                rows.forEach(row =>
                                    row.showOn(voteColumnsIndex, Status.VOTE_READY, {
                                        selector: '.vote.countdown'
                                    })
                                );
                            } else {

                                if (canVote()) {
                                    ScriptStorageManager.setActionName(HeroesPageManager.ACTION_VOTE);
                                    window.location.reload();
                                }
                            }
                        }

                        // 启动轮询
                        checkTimeout();

                    } catch (error) {
                        console.error("解析投票页面失败:", error);
                    }
                },
                onerror: (error) => {
                    console.error("请求投票页面失败:", error);
                },
                ontimeout: () => {
                    console.error("请求投票页面超时");
                }
            });
        }

        runDeposit() {
            const heroTable = this.heroTable;
            heroTable.addColumn(HeroTable.TH_DEPOSITE_STATUS);
            const rows = heroTable.find().whereClassIsNotMentor().get();
            const depositColIndex = heroTable.indexOfTableHead(HeroTable.TH_DEPOSITE_STATUS);

            console.group('开始入库战利品');
            const depositProcess = () => {
                const currentHeroindex = ScriptStorageManager.getCurrentHeroIndex();
                const currentHero = rows[currentHeroindex];
                console.log('当前英雄：', currentHero);
                console.log(`当前进度：${currentHeroindex}/${rows.length}`);

                // 检查是否完成所有英雄
                if (currentHeroindex >= rows.length) {
                    ScriptStorageManager.recordDepositDate();
                    ScriptStorageManager.setCurrentHeroIndex(0);
                    ScriptStorageManager.setActionName(HeroesPageManager.ACTION_DEFAULT);
                    window.location.reload();
                    return;
                }

                // 激活当前英雄
                if (!currentHero.isActive) {
                    this.activeHero(currentHero);
                    return;
                }

                // 更新已完成英雄的存储状态
                if (currentHeroindex > 0) {
                    rows.slice(0, currentHeroindex).forEach((row) => {
                        const status = ScriptStorageManager.getOverburdenedHeroes().some(obj => obj.heroId === row.id) ?
                            Status.DEPOSIT_PACKAGE_FULL : Status.DEPOSIT_SUCCESS;
                        row.showOn(depositColIndex, status);
                    });
                }

                // 显示存储状态
                currentHero.showOn(depositColIndex, Status.DEPOSIT_PROCESSING);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: '/wod/spiel/hero/items.php',
                    timeout: 5 * 60 * 1000,
                    onload: (response) => {
                        response.responseText;
                        const docItem = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const lastDepositTime = docItem.querySelectorAll('#main_content table.content_table tr')[2].querySelectorAll('td')[5].textContent.trim();
                        console.log('最后物品入库时间： ', lastDepositTime);
                        try {
                            const isPackageFull = response.responseText.includes(ItemsPageManager.PACKAGE_FULL_DESCRIPTION);

                            if (isPackageFull) {
                                currentHero.showOn(depositColIndex, Status.DEPOSIT_PACKAGE_FULL);
                                ScriptStorageManager.markHeroAsOverburdened(currentHero.sessionId);
                            } else {
                                currentHero.showOn(depositColIndex, Status.DEPOSIT_SUCCESS);
                                ScriptStorageManager.clearOverburdenedStatus(currentHero.sessionId);
                            }

                            ScriptStorageManager.setCurrentHeroIndex(currentHeroindex + 1);
                            depositProcess();
                        } catch (error) {
                            console.error("响应处理失败:", error);
                            currentHero.showOn(depositColIndex, "❌ 处理错误");
                            window.location.reload();
                        }
                    },
                    onerror: (error) => {
                        console.error("请求失败:", error);
                        currentHero.showOn(depositColIndex, "❌ 网络错误");
                        setTimeout(window.location.reload(), 3000);
                    },
                    ontimeout: () => {
                        console.error("请求超时");
                        currentHero.showOn(depositColIndex, "⏱️ 请求超时");
                        setTimeout(window.location.reload(), 3000);
                    }
                });
            };

            depositProcess();
        }

        runVote() {
            const heroTable = this.heroTable;
            heroTable.addTableHead(HeroTable.TH_VOTE);
            heroTable.findAll().forEach(row => row.addTd());
            const voteColumnsIndex = heroTable.indexOfTableHead(HeroTable.TH_VOTE);
            const honoree = heroTable.find().byId(ScriptStorageManager.getHonoreeHeroId());

            if (!honoree.isActive) {
                this.activeHero(honoree);
                return;
            }

            let totalFame = 0;
            let completed = 0;
            let success = 0;
            let failed = 0;
            let totalUrls = 0;

            const updateStatus = () => {
                honoree.showOn(
                    voteColumnsIndex,
                    `投票中 (${completed}/${totalUrls}) ${totalFame}<img src="/wod/css/skins/skin-4/images/icons/lang/cn/fame.gif" alt="荣誉">`, {
                        mode: 'html'
                    }
                );
            };

            const handleVoteResponse = (url, response) => {
                try {
                    const votePage = this.getVoteServiceFromResponse(response);
                    const event = votePage.findOneByTrackedRedirectionUrl(url);
                    console.log('handleVoteResponse', event);

                    if (event && event.fame) {
                        totalFame += event.fame;
                        console.log(`✅ 投票成功: ${url}, 获得 ${event.fame} 荣誉`);
                        success++;
                    } else {
                        console.warn(`⚠️ 未找到荣誉值: ${url}`, event);
                        failed++;
                    }
                } catch (e) {
                    console.error(`❌ 解析响应失败: ${url}`, e);
                    failed++;
                } finally {
                    completed++;
                    updateStatus();
                }
            };

            const handleVoteError = (url, error) => {
                console.error(`❌ 投票失败: ${url}`, error);
                failed++;
                completed++;
                updateStatus();
            };

            const checkCompletion = () => {
                if (completed >= totalUrls) {
                    const resultText = `完成 (成功:${success} 失败:${failed}) ${totalFame}<img src="/wod/css/skins/skin-4/images/icons/lang/cn/fame.gif" alt="荣誉">`;
                    honoree.showOn(voteColumnsIndex, resultText, {
                        mode: 'html'
                    });
                    ScriptStorageManager.setActionName(HeroesPageManager.ACTION_DEFAULT);

                    console.log('所有投票完成，3秒后刷新');
                    setTimeout(() => window.location.reload(), 3000);
                }
            };

            // 显示初始状态
            honoree.showOn(voteColumnsIndex, Status.VOTE_QUERYING);

            // 发起请求
            GM_xmlhttpRequest({
                method: 'GET',
                url: '/wod/spiel/rewards/vote.php',
                timeout: 1 * 60 * 1000,
                onload: (response) => {
                    try {
                        const votePage = this.getVoteServiceFromResponse(response);
                        const urls = votePage.findAll().map(event => event.trackedRedirectionUrl);
                        totalUrls = urls.length;
                        console.log(urls);
                        // 初始状态
                        updateStatus();

                        // 发起所有投票请求
                        urls.forEach(url => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: url,
                                timeout: 1 * 60 * 1000,
                                onload: (resp) => {
                                    handleVoteResponse(url, resp);
                                    checkCompletion();
                                },
                                onerror: (error) => {
                                    handleVoteError(url, error);
                                    checkCompletion();
                                },
                                ontimeout: () => {
                                    handleVoteError(url, new Error(`请求超时 (120s)`));
                                    checkCompletion();
                                }
                            });
                        });
                    } catch (e) {
                        console.error('解析投票页面失败:', e);
                        honoree.showOn(voteColumnsIndex, `❌ 解析错误: ${e.message}`);
                        setTimeout(() => window.location.reload(), 10 * 1000);
                    }
                },
                onerror: (error) => {
                    console.error('获取投票页面失败:', error);
                    honoree.showOn(voteColumnsIndex, `❌ 网络错误: ${error.statusText || error.message}`);
                    setTimeout(() => window.location.reload(), 10 * 1000);
                },
                ontimeout: () => {
                    console.error('获取投票页面超时');
                    honoree.showOn(voteColumnsIndex, '❌ 获取投票超时');
                    setTimeout(() => window.location.reload(), 10 * 1000);
                }
            });
        }

        getVoteServiceFromResponse(response) {
            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
            return new VoteService(doc);
        }

        activeHero(row) {
            row.radio.checked = true;
            this.submitBtn.click();
        }

        areHeroesOnline(rows) {
            return !rows.some(row => row.isOnline === false);
        }

        setHeroesOnline(rows) {
            this.heroTable.findAll().forEach(row => {
                row.deselected();
            });

            let lastHero = null;
            rows.forEach(row => {
                row.selected();
                if (row.isOwnerShipDirect) {
                    lastHero = row;
                }
            });

            ScriptStorageManager.checkReportTimestamp = 0;
            this.activeHero(lastHero);
        }

        isHeroTablePage() {
            return document.querySelector('input[name=uv_start]') ? true : false;
        }

        dungeonReduce(reload = true) {
            if (reload) {
                this._reduceBtnMonitor();
            }
            if (this.reduceBtn) {
                this.reduceBtn.click();
                return true;
            }
            return false;
        }

        _reduceBtnMonitor() {
            const reduce_URL = /\/wod\/ajax\/setPlayerSetting\.php?.+/;

            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url) {
                this._xhrId = Math.random().toString(36).slice(2, 9);
                this._requestUrl = url;
                console.log(`XHR初始化 [${this._xhrId}]`, method, url);
                return originalXHROpen.apply(this, arguments);
            };

            XMLHttpRequest.prototype.send = function(body) {
                const xhr = this;
                const url = xhr._requestUrl;

                console.log(`XHR发送请求 [${xhr._xhrId}]`, url);

                if (reduce_URL.test(url)) {
                    console.log(`匹配到目标请求 [${xhr._xhrId}]`, url);

                    xhr.addEventListener('readystatechange', function() {
                        console.log(`状态变化 [${xhr._xhrId}]`, {
                            readyState: xhr.readyState,
                            status: xhr.status,
                            headers: xhr.getAllResponseHeaders()
                        });

                        if (xhr.readyState === 4) {
                            console.log(`请求完成 [${xhr._xhrId}]`, {
                                status: xhr.status,
                                response: xhr.responseText,
                                headers: xhr.getAllResponseHeaders()
                            });

                            if (xhr.responseText.includes('END_OF_HEADER')) {
                                console.log(`检测到特殊标记 [${xhr._xhrId}]`);
                                setTimeout(() => {
                                    console.log(`执行页面刷新 [${xhr._xhrId}]`);
                                    location.reload();
                                }, 300);
                            }
                        }
                    });

                    xhr.addEventListener('error', function(e) {
                        console.log(`请求错误 [${xhr._xhrId}]`, e);
                    });

                    xhr.addEventListener('timeout', function(e) {
                        console.log(`请求超时 [${xhr._xhrId}]`, e);
                    });
                }

                return originalXHRSend.apply(this, arguments);
            };

            window.addEventListener('beforeunload', function() {
                console.log('页面即将刷新/关闭');
            });
        }
    }

    class HeroTable {

        static TH_DUNGEON_COUNTDOWN = '倒计时';
        static TH_VOTE = '投票奖励';
        static TH_DEPOSITE_STATUS = '入库状态';
        static DUNGEON_STATUS_GENERATING_REPORT = '等待结算';
        static DUNGEON_REQUIRE_TEXT = '未选择地城';

        constructor(dom) {
            this.dom = dom;
        }

        findAll() {
            return Array.from(this.dom.querySelectorAll('tr:not(.header)')).map(
                (row, index) => new HeroRow(row, index)
            );
        }

        find() {
            return new HeroTableQueryBuilder(this.findAll());
        }

        addTableHead(tableHead) {
            const headRow = this.dom.querySelector('tr.header');
            const th = document.createElement('th');
            th.textContent = tableHead;
            headRow.appendChild(th);
        }

        indexOfTableHead(name) {
            const headerRow = this.dom.querySelectorAll('tr.header th');
            if (!headerRow) return -1;
            const headers = Array.from(headerRow);
            const index = headers.findIndex(th => th.textContent.trim() === name);
            return index;
        }

        addColumn(tableHead) {
            this.addTableHead(tableHead);
            this.findAll().forEach(row => row.addTd());
        }

        addVoteCoumn(tableHead) {
            this.addTableHead(HeroTable.TH_VOTE);
            const rows = this.findAll();
            const nodes = (row) => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'vote';
                input.value = row.id;
                if (ScriptStorageManager.getHonoreeHeroId() === input.value) {
                    input.checked = true;
                }
                const span = document.createElement('span');
                span.className = 'vote countdown';
                return [input, span];
            }
            rows.forEach(row => row.addTd(nodes(row)));
        }
    }

    class HeroTableQueryBuilder {

        constructor(rows) {
            this.rows = rows;
        }

        byId(id) {
            return this.rows.find(row => row.id === id);
        }

        whereNextDungeonIsNull() {
            this.rows = this.rows.filter(row => !row.nextDungeon?.name);
            return this;
        }

        whereNextDungeonIsNotNull() {
            this.rows = this.rows.filter(row => row.nextDungeon?.name);
            return this;
        }

        whereMinDungeonEndTime() {
            if (this.rows.length === 0) return this;

            const minTime = Math.min(
                ...this.rows.map(row => row.nextDungeon?.estimatedTimestamp)
            );
            this.rows = this.rows.filter(
                row => row.nextDungeon?.estimatedTimestamp === minTime
            );
            return this;
        }

        whereClassIsNotMentor() {
            this.rows = this.rows.filter(row => row.class !== '导师');
            return this;
        }

        get() {
            return this.rows;
        }

        first() {
            return this.rows[0];
        }
    }

    class HeroRow {

        constructor(row, index) {
            this.dom = row;
            this.index = index;
            this.id = (() => {
                const aTag = this.dom.querySelector('td:first-child a');
                return new URL(aTag?.href).searchParams.get('id');
            })();
            this.radio = this.dom.querySelector('input[type=radio][name=FIGUR]');
            this.name = this.dom.querySelector('td:nth-child(1)').innerText.trim();
            this.class = this.dom.querySelector('td:nth-child(2)').innerText.trim();
            this.level = this.dom.querySelector('td:nth-child(3)').innerText.trim();
            const fourthTd = this.dom.querySelector('td:nth-child(4)');
            this.checkbox = fourthTd?.querySelector('input[type="checkbox"]');
            this.isActive = this.id === document.querySelector('input[type=hidden][name=session_hero_id]').value;
            this.isOwnerShipDirect = fourthTd?.querySelector('input[type="submit"]') ? false : true;
            this.isOnline = (() => {
                if (!this.isOwnerShipDirect) return true;
                return this.dom.querySelector('.hero_inactive') ? false : true;
            })();
            this.nextDungeon = new NextDungeon(this.dom.querySelector('td:nth-child(5)'));
        }

        get cells() {
            return this.dom.querySelectorAll('td');
        }

        selected() {
            if (this.checkbox) {
                this.checkbox.checked = true;
            }
        }

        deselected() {
            if (this.checkbox) {
                this.checkbox.checked = false;
            }
        }

        addTd(content = null, options = {}) {
            const td = document.createElement('td');

            if (options.className) {
                td.className = options.className;
            }

            if (options.attributes) {
                Object.entries(options.attributes).forEach(([key, value]) => {
                    td.setAttribute(key, value);
                });
            }

            if (content !== null && content !== undefined) {
                const processContent = (item) => {
                    if (item instanceof Node) {
                        return item;
                    }
                    if (typeof item === 'string' && item.startsWith('<')) {
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = item;
                        return wrapper.firstChild || document.createTextNode('');
                    }
                    return document.createTextNode(String(item));
                };

                if (Array.isArray(content)) {
                    content.forEach(item => {
                        const node = processContent(item);
                        td.appendChild(node);
                    });
                } else {
                    const node = processContent(content);
                    td.appendChild(node);
                }
            }

            this.dom.appendChild(td);
            return td;
        }


        /**
         * 在表格单元格或其子元素上显示内容
         *
         * @param {number} tdIndex - 目标单元格在 tdList 中的索引
         * @param {string|Node|null} content - 要显示的内容（支持HTML字符串或DOM节点）
         * @param {Object} [options={}] - 配置选项
         * @param {string} [options.selector=null] - CSS选择器，用于定位单元格内的子元素
         * @param {'text'|'html'|'replace'|'append'|'prepend'} [options.mode='html'] - 显示模式：
         *   - 'text': 作为纯文本插入（自动转义HTML标签）
         *   - 'html': 作为HTML解析插入（渲染标签）
         *   - 'replace': 替换整个目标元素
         *   - 'append': 在目标元素末尾插入
         *   - 'prepend': 在目标元素开头插入
         *
         * @example
         * // 案例1：在单元格内显示纯文本
         * showOn(0, 'Hello World', { mode: 'text' });
         *
         * @example
         * // 案例2：在特定子元素中渲染HTML
         * showOn(1, '<b>Strong</b> Text', {
         *   selector: '.content-area',
         *   mode: 'html'
         * });
         *
         * @example
         * // 案例3：替换整个子元素
         * const newNode = document.createElement('div');
         * newNode.textContent = 'Replaced';
         * showOn(2, newNode, {
         *   selector: '.old-element',
         *   mode: 'replace'
         * });
         */
        showOn(tdIndex, content, options = {}) {
            const td = this.cells[tdIndex];
            if (!td) {
                console.warn(`表格单元格索引 ${tdIndex} 不存在`);
                return;
            }

            const {
                selector = null,
                    mode = 'html'
            } = options;

            const target = selector ? td.querySelector(selector) : td;
            if (!target) {
                console.warn(`未找到匹配元素: ${selector || '单元格'}`);
                return;
            }

            if (content == null || content === '') {
                target.innerHTML = '';
                return;
            }

            const processContent = () => {
                // 5.1 已经是DOM节点直接返回
                if (content instanceof Node) return content;

                // 5.2 文本模式直接返回字符串
                if (mode === 'text') return String(content);

                // 5.3 HTML模式创建临时容器解析
                const container = document.createElement('div');
                container.innerHTML = content;

                // 返回解析后的DOM节点（多个节点时包裹在div中）
                return container.childNodes.length > 1 ?
                    container :
                    container.firstChild || "";
            };

            // 6. 安全执行DOM操作
            try {
                switch (mode) {
                    case 'text':
                        target.textContent = String(content);
                        break;

                    case 'html':
                        target.innerHTML = typeof content === 'string' ?
                            content :
                            "";
                        break;

                    case 'replace':
                        target.replaceWith(processContent());
                        break;

                    case 'append':
                        target.append(processContent());
                        break;

                    case 'prepend':
                        target.prepend(processContent());
                        break;

                    default:
                        throw new Error(`不支持的mode参数: ${mode}`);
                }
            } catch (error) {
                console.error('内容渲染失败:', error);
                target.innerHTML = '<span style="color:red">渲染错误</span>';
            }
        }
    }

    class NextDungeon {

        constructor(td) {
            this.dom = td;
            this.name = this.dom.getAttribute('onmouseover')?.match(/wodToolTip\(.*?,\s*'([^']*)'/)?.[1] || null;
            this.estimatedEndTime = this.dom.textContent.trim();
            this.estimatedTimestamp = parseTime(this.estimatedEndTime);
        }

        endTimeCountdown() {
            return this.estimatedTimestamp - Date.now();
        }
    }

    class ItemsPageManager {

        static PACKAGE_FULL_DESCRIPTION = '无法分出手来干别的事情';

        constructor() {
            this.sessionHeroId = document.querySelector('input[type=hidden][name=session_hero_id]');
            this.submitBtn = document.querySelectorAll('input[type=submit][name=ok]');
        }

        execute() {
            if (!document.body.textContent.includes(ItemsPageManager.PACKAGE_FULL_DESCRIPTION)) return;

            document.querySelector('#gadgettable-center-td').addEventListener('click', e => {
                if (e.target?.matches('input[name="ok"]')) {
                    ScriptStorageManager.clearOverburdenedStatus(this.sessionHeroId);
                }
            });
        }
    }

    class VoteService {

        constructor(doc) {
            if (!(doc instanceof Document)) {
                throw new Error('doc is not the global document object');
            }
            this.doc = doc;
        }

        findAll() {
            return Array.from(this.doc.querySelectorAll('div.vote.reward img')).map(img => new VoteEvent(img));
        }

        findOneByMaxRewardTime() {
            const maxRewardTime = Math.max(...this.findAll().map(event => event.nextRewardTimestamp));
            return this.findAll().find(event => event.nextRewardTimestamp === maxRewardTime);
        }

        findOneByTrackedRedirectionUrl(url) {
            return this.findAll().find(event => event.trackedRedirectionUrl === url);
        }
    }

    class VoteEvent {

        constructor(img) {
            this.dom = img;
            this.aTag = this.dom.closest('div.vote.reward').previousElementSibling.querySelector('a');
            this.banner = this.aTag.querySelector('img');
            this.trackedRedirectionUrl = this.extractJsUrls();
            this.nextRewardTimeStr = this.dom.closest('div.vote.reward').textContent;
            this.nextRewardTimestamp = parseTime(this.nextRewardTimeStr);
            this.fame = Number(this.dom.parentNode.innerHTML.match(/(\d+)<img/)[1]);
        }

        extractJsUrls() {
            const onclickAttr = this.aTag?.getAttribute('onclick');
            if (!onclickAttr) return null;
            const match = onclickAttr.match(/js_goto_url\('([^']+)'/);
            return match ? match[1] : null;
        }

        nextRewardTimeCountdown() {
            return this.nextRewardTimestamp - Date.now();
        }
    }

    class WOD {

        static #pageName;

        static get pageName() {
            if (!this.#pageName) {
                const path = window.location.pathname;
                const match = path.match(/\/([^\/]+?)\.php$/);
                const pageName = match ? match[1] : '';
                if (typeof pageName !== 'string' || pageName.length === 0) throw new Error('not support current page name');
                this.#pageName = pageName;
            }
            return this.#pageName;
        }

        static get classMap() {
            return {
                HeroesPageManager,
                ItemsPageManager,
            };
        }

        static AFK() {
            const className = this.pageName[0].toUpperCase() + this.pageName.slice(1) + 'PageManager';
            const DynamicClass = this.classMap[className];
            return new DynamicClass().execute();
        }
    }

    WOD.AFK();
})();