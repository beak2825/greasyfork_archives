// ==UserScript==
// @name         Microsoft Bing Rewards 每日任务脚本
// @version      1.0.1
// @description  自动完成微软积分每日搜索任务
// @license      MIT
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @match        https://rewards.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.pearktrue.cn
// @namespace https://greasyfork.org/users/1161417
// @downloadURL https://update.greasyfork.org/scripts/543937/Microsoft%20Bing%20Rewards%20%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/543937/Microsoft%20Bing%20Rewards%20%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 仅在顶层框架运行
    if (window.top !== window.self) {
        return;
    }


    const initRewardsPoints = GM_getValue('initPoints', 0);
    const initDateStr = GM_getValue('initDate', '2025-06-09');
    const initData = new Date(initDateStr);
    initData.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - initData) / (1000 * 60 * 60 * 24));

    const keywordApi = 'https://api.pearktrue.cn/api/dailyhot/'; // 词条接口

    const rewardHost = 'https://rewards.bing.com'; // 积分页面
    const searchHost = 'https://www.bing.com'; // 搜索页面
    const pathnames = ['/', '/search']; // 触发搜索页面
    const autoRunSearch = '?runMode=auto&runKey=1362311'; // 自动触发任务参数

    const searchTimes = 40; // 自动搜索次数

    const searchDelaySecondsMin = 15; // 每次搜索最小延迟时间，单位秒
    const searchDelaySecondsMax = 30; // 每次搜索最大延迟时间，单位秒
    const searchDelaySecondsFirst = 3; // 首次搜索延迟时间，单位秒，设置为0时立即触发
    const closeTaskCardDelaySeconds = 0; // 搜索完成后弹窗自动关闭延迟时间，单位秒，设置为0时需手动关闭

    const searchSafeDelayTimes = 4; // 每搜索n次后触发长暂停
    const searchSafeDelaySeconds = 0 * 60; // 每次触发长暂停时长，单位秒

    const clickDelaySecondsFirst = 3; // 首次搜索延迟时间，单位秒

    const startBtn = true; // 是否在搜索框附近插入任务启动按钮
    const startBtnText = '获取积分'; // 任务启动按钮文本

    // 搜索词条库
    const searchKeySource = [
        { name: '贴吧', action: '百度贴吧' },
        { name: '微博', action: '微博热搜' },
        { name: '知乎', action: '知乎' },
        { name: '今日头条', action: '今日头条' },
        { name: 'B站', action: '哔哩哔哩' },
        { name: '酷安', action: '酷安' }
    ];

    // 默认词条
    const defaultKeywords = [
        '锦瑟无端五十弦','一弦一柱思华年',
        '庄生晓梦迷蝴蝶','望帝春心托杜鹃',
        '沧海月明珠有泪','蓝田日暖玉生烟',
        '此情可待成追忆','只是当时已惘然',

        '君不见黄河之水天上来', '奔流到海不复回',
        '君不见高堂明镜悲白发', '朝如青丝暮成雪',
        '人生得意须尽欢', '莫使金樽空对月',
        '天生我材必有用', '千金散尽还复来',
        '烹羊宰牛且为乐', '会须一饮三百杯',
        '岑夫子', '丹丘生', '将进酒', '杯莫停',
        '与君歌一曲', '请君为我倾耳听',
        '钟鼓馔玉不足贵', '但愿长醉不愿醒',
        '古来圣贤皆寂寞', '惟有饮者留其名',
        '陈王昔时宴平乐', '斗酒十千恣欢谑',
        '主人何为言少钱', '径须沽取对君酌',
        '五花马', '千金裘', '呼儿将出换美酒', '与尔同销万古愁'
    ];

    const timeKey = 'time'; // 时间戳
    const countKey = 'count'; // 计数器
    const pointsKey = 'points'; // 当日初始积分
    const searchPointsKey = 'searchPoints'; // 当日搜索任务初始积分
    const keywordsKey = 'search'; // 搜索词条
    const searchParamKey = 'param'; // 搜索参数

    // web worker
    let delayWorker = null; // 搜索任务
    let scrollWorker = null; // 模拟浏览

    GM_addStyle('#reward-task { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, .2); z-index: 99999; }');
    GM_addStyle('#reward-task > .reward-task-content { max-width: 460px; margin: calc(50vh - 32px) auto 0; padding: 20px; background-color: #ffffff; border: 1px solid #e4e7ed; border-radius: 20px; color: #303133; overflow: hidden; transition: 0.3s; box-shadow: 0px 0px 12px rgba(0,0,0,0.12); }');
    GM_addStyle('#reward-task > .reward-task-content > div { display: flex; flex-flow: row wrap; align-items: center; column-gap: 12px; }');
    GM_addStyle('#reward-task > .reward-task-content > div > .item { width: 160px; padding: 7px 0; }');
    GM_addStyle('#reward-task > .reward-task-content > div > .tips { padding: 7px 0; color: #E6A23C; }');
    GM_addStyle('#reward-task > .reward-task-content > div > .btn-wrap { flex-grow: 1; text-align: right; }');
    GM_addStyle('.reward-task-btn { display: inline-block; line-height: 1; white-space: nowrap; cursor: pointer; background: #fff; border: 1px solid #dcdfe6; -webkit-appearance: none; text-align: center; -webkit-box-sizing: border-box; box-sizing: border-box; outline: 0; margin: 0; -webkit-transition: .1s; transition: .1s; font-weight: 500; padding: 8px 16px; font-size: 14px; border-radius: 4px; color: #606266; background-color: #ffffff; border: 1px solid #dcdfe6; border-color: #dcdfe6; }');
    GM_addStyle('.reward-task-btn.warning { color: #fff; background-color: #ebb563; border-color: #ebb563; }');
    GM_addStyle('#ScopeRow { margin-top: 48px; }');

    // 注册菜单
    const registerMenuCommand = () => {
        // 启动搜索任务
        GM_registerMenuCommand('获取积分', () => {
            start();
        });

        // 停止任务
        GM_registerMenuCommand('停止', () => {
            stop();
            removeTaskCard();
        });

        // 更新词条
        GM_registerMenuCommand('更新词条', () => {
            new Promise((resolve, reject) => {
                let source = Math.floor(Math.random() * searchKeySource.length);
                queryKeywordList(source, resolve, reject);
            }).then( () => {
                alert('获取词条成功');
            }).catch( err => {
                alert('获取词条失败：' + err.message);
            });
        });

        // 生成随机词条
        GM_registerMenuCommand('生成随机词条', () => {
            const keywords = generateKeywordList(100);
            const today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            GM_setValue(keywordsKey, {
                time: today.getTime(),
                source: 0,
                keywords: keywords,
            });
        });
        // 设置初始积分和日期
        GM_registerMenuCommand('设置初始积分和日期', () => {
            const currentPoints = GM_getValue('initPoints', 0);
            const currentDate = GM_getValue('initDate', '2025-06-09');

            const newPointsStr = prompt('请输入初始积分（如 2000）：', currentPoints);
            const newDateStr = prompt('请输入初始日期（格式：YYYY-MM-DD）：', currentDate);

            if (newPointsStr !== null && newDateStr !== null) {
                const newPoints = parseInt(newPointsStr);
                if (!isNaN(newPoints) && /^\d{4}-\d{2}-\d{2}$/.test(newDateStr)) {
                    GM_setValue('initPoints', newPoints);
                    GM_setValue('initDate', newDateStr);
                    alert(`设置成功：\n积分：${newPoints}\n日期：${newDateStr}\n请刷新页面生效`);
                } else {
                    alert('输入格式不正确，请确保积分为数字，日期为YYYY-MM-DD格式');
                }
            }
        });
    };

    // 启动搜索任务
    const start = () => {
        GM_setValue(countKey, 1);
        GM_setValue(searchPointsKey, -1);
        search();
    };

    // 结束搜索任务
    const stop = () => {
        GM_setValue(countKey, 0);
        GM_setValue(searchPointsKey, -1);
        if (scrollWorker) {
            scrollWorker.postMessage({ type: "end" });
        }
    };

    // 跳转搜索页面并运行搜索任务
    const navigateToSearchPage = () => {
        location.href = searchHost + autoRunSearch;
    };

    // 搜索
    const search = () => {
        const count = GM_getValue(countKey);
        if (!count || count <= 0 || count > searchTimes + 1) {
            stop();
            return;
        }

        // 延迟时间
        const delay = count === 1 ? searchDelaySecondsFirst : Math.floor(Math.random() * (searchDelaySecondsMax - searchDelaySecondsMin + 1)) + searchDelaySecondsMin + (count % searchSafeDelayTimes !== 1 ? 0 : searchSafeDelaySeconds);

        // 添加任务进度卡片
        insertTaskCard(count - 1, delay, () => {
            // 获取词条
            getSearchInfo().then( keyword => {
                const queryInput = document.getElementById('sb_form_q');
                const param = `?q=${ encodeURIComponent(keyword) }&form=${ Math.random() > 0.4 ? 'QBLH' : 'QBRE' }&sp=-1&lq=0&pq=${ queryInput ? encodeURIComponent(queryInput.value) || '' : '' }&sc=0-0&qs=n&sk=&cvid=${ generateRandomString(32) }&ghsh=0&ghacc=0&ghpl=`;

                // 更新计数器
                GM_setValue(countKey, count+1);
                // 更新搜索参数
                GM_setValue(searchParamKey, param);

                // 触发搜索
                location.href = searchHost + '/search' + param;
            }).catch( err => {
                stop();
                removeTaskCard();
                alert('获取词条失败：' + err.message);
            });
        });

        if (count > searchTimes) {
            return;
        }

        // 模拟浏览网页
        pretendHuman();
    };

    // 获取词条
    const getSearchInfo = () => {
        return new Promise((resolve, reject) => {
            const today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            let source = Math.floor(Math.random() * searchKeySource.length);
            const saveConfig = GM_getValue(keywordsKey);
            // 当日缓存的搜索词还未用完
            if (saveConfig && saveConfig.time === today.getTime()) {
                if (saveConfig.keywords.length > 0) {
                    const keyword = saveConfig.keywords[0];
                    saveConfig.keywords.splice(0, 1);
                    GM_setValue(keywordsKey, saveConfig);
                    resolve(keyword);
                    return;
                } else {
                    source = (saveConfig.source + 1) % searchKeySource.length;
                }
            }

            // 更新词条
            queryKeywordList(source, resolve, reject);
        });
    };

    // 更新词条
    const queryKeywordList = (source, resolve, reject) => {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        // 获取新词条
        const queryKeyword = (config, retry) => {
            const param = 'title=' + searchKeySource[config.source].action;
            GM_xmlhttpRequest({
                method: 'GET',
                url: keywordApi + '?' + param,
                responseType: 'json',
                onload: response => {
                    console.log(response);
                    if (response.status !== 200 || !response.response) {
                        handleErr(new Error('调用Api失败'), retry, config);
                        return;
                    }

                    config.keywords = Array.from(new Set(response.response.data.map(item => searchKeySource[config.source].name + ' ' + item.title + ' ' + generateRandomString(3))));
                    config.keywords.splice(50);
                    const keyword = config.keywords[0];
                    config.keywords.splice(0, 1);
                    GM_setValue(keywordsKey, config);
                    resolve(keyword);
                },
                onerror: err => {
                    handleErr(err, retry, config);
                },
            });
        };

        // 失败处理，支持重试
        const handleErr = (err, retry, config) => {
            if (retry <= 0) {
                console.error(`获取词条[${ searchKeySource[config.source].name }]：失败终止`, err);
                //reject(err);
                config.keywords = generateKeywordList(100);
                const keyword = config.keywords[0];
                config.keywords.splice(0, 1);
                GM_setValue(keywordsKey, config);
                resolve(keyword);
                return;
            }

            console.warn(`获取词条[${ searchKeySource[config.source].name }]：失败重试[第${ searchKeySource.length - retry }次]`, err);
            setTimeout(() => {
                queryKeyword({
                    time: config.time,
                    source: (config.source + 1) % searchKeySource.length,
                    keywords: [],
                }, retry-1);
            }, 500);
        };

        // 获取新词条
        queryKeyword({
            time: today.getTime(),
            source: source,
            keywords: [],
        }, 0, searchKeySource.length - 1);
    };

    // 生成随机词条
    const generateKeywordList = (size) => {
        if (size <= 0) {
            return;
        }

        const keywords = [];
        for (let i = 0; i < defaultKeywords.length && keywords.length < size * 1.2; i++) {
            if (defaultKeywords[i].length < 3) {
                keywords.push(defaultKeywords[i]);
                continue;
            }

            let j = 0;
            while (j < defaultKeywords[i].length) {
                let z = Math.min(defaultKeywords[i].length, Math.floor(Math.random() * 3) + 2 + j);
                keywords.push(defaultKeywords[i].slice(j, z));
                j = z;
            }

            if (Math.random() >= 0.5) {
                keywords.push(generateRandomStringZh(5));
            }
        }

        return Array.from(new Set(keywords)).slice(0, size);
    };

    // 插入启动按钮
    const insertStartBtn = () => {
        if (document.getElementById('reward-task-start')) {
            document.getElementById('reward-task-start').remove();
        }
        if (!startBtn) {
            return;
        }
        // 获取搜索表单
        const queryForm = document.getElementById('sb_form');

        // 添加启动按钮
        const btn = document.createElement('button');
        btn.appendChild(document.createTextNode(startBtnText));
        btn.setAttribute('id', 'reward-task-start');
        btn.setAttribute('type', 'button');
        btn.classList.add('reward-task-btn');
        btn.style.setProperty('margin', '8px');
        btn.style.setProperty('padding', '8px 24px');
        btn.style.setProperty('border-radius', '24px');
        btn.onclick = () => {
            start();
        };

        // 首页表单会重置组件内容，需要等待几秒后再插入
        setTimeout( () => {
            queryForm.appendChild(btn);
        }, location.pathname !== '/' ? 0 : 5000);
    };

    // 插入搜索任务卡片
    const insertTaskCard = (times, delay, finish) => {
        removeTaskCard();

        // 添加搜索任务卡片
        const h = `<div id="reward-task">
            <div class="reward-task-content">
                <div>
                    <p id="reward-points" class="item">当前积分：${ getCurrPoints() }</p>
                    <p id="ppd" class="item">日均积分：${ ((getCurrPoints() - initRewardsPoints) / diffDays).toFixed(1) }</p>
                </div>
                <div>
                    <p id="task-points" class="item">本次获得积分：${ getTaskPoints() }</p>
                    <p id="task-today-points" class="item">当日获得积分：${ getTodayPoints() }</p>
                </div>
                <div>
                    <p class="item">进度：${ times } / ${ searchTimes }</p>
                    <p id="reward-task-delay" class="item">${ times >= searchTimes ? `已完成${ closeTaskCardDelaySeconds > 0 ? '，' + closeTaskCardDelaySeconds + '秒后自动关闭' : '' }` : `等待时间：${ delay } 秒 ` }</p>
                    <div class="btn-wrap">${ times >= searchTimes ? '<button id="reward-task-cancel" type="button" class="reward-task-btn warning">关闭</button>' : '<button id="reward-task-stop" type="button" class="reward-task-btn warning">停止</button>' }</div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeEnd', h);

        // 停止按钮
        const btnStop = document.querySelector('#reward-task-stop');
        if (btnStop) {
            btnStop.onclick = () => {
                stop();
                removeTaskCard();
            };
        }

        // 关闭按钮
        const btnCancel = document.querySelector('#reward-task-cancel');
        if (btnCancel) {
            btnCancel.onclick = () => {
                stop();
                removeTaskCard();
            };
        }

        // 任务完成，自动延迟关闭任务窗口
        if (times >= searchTimes && closeTaskCardDelaySeconds > 0) {
            setTimeout( () => {
                removeTaskCard();
            }, closeTaskCardDelaySeconds * 1000);
        }

        // 倒计时
        // 任务完成后再执行10次以便获取积分信息
        let remainDelay = times >= searchTimes ? 10 : delay;
        delayWorker = getWorker(getCountDown, { times: remainDelay });
        delayWorker.onmessage = e => {
            // 更新积分
            const domCurrPoints = document.getElementById('reward-points');
            const domTaskPoints = document.getElementById('task-points');
            const ppd = document.getElementById('ppd');
            const domTaskTodayPoints = document.getElementById('task-today-points');
            domCurrPoints.innerText = `当前积分：${ getCurrPoints() }`;
            domTaskPoints.innerText = `本次获得积分：${ getTaskPoints() }`;
            ppd.innerText = `日均积分：${ ((getCurrPoints() - initRewardsPoints) / diffDays).toFixed(1) }`;
            domTaskTodayPoints.innerText = `当日获得积分：${ getTodayPoints() }`;

            // 任务已完成
            if (times >= searchTimes) {
                return;
            }

            // 倒计时完成
            if (e.data.times === 0) {
                finish();
                return;
            }

            // 更新倒计时
            const domDelay = document.getElementById('reward-task-delay');
            if (!domDelay) {
                return;
            }
            domDelay.innerText = `等待时间：${ e.data.times } 秒`;
        };
        delayWorker.postMessage({ type: "start", interval: 1000 });
    };

    // 移除搜索任务卡片
    const removeTaskCard = () => {
        if (delayWorker) {
            delayWorker.postMessage({ type: 'end' });
        }
        if (!document.getElementById('reward-task')) {
            return;
        }
        document.getElementById('reward-task').remove();
    };

    // 模拟浏览网页
    const pretendHuman = () => {
        if (scrollWorker) {
            scrollWorker.postMessage({ type: "end" });
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // 启用定时器缓慢滑动到底部，期间随机触发停留和向上滑动，完成滑动到底部后再次滑动到顶部后停止滑动
        scrollWorker = getWorker(getCountDown, { times: 120 });
        scrollWorker.onmessage = e => {
            if (e.data.times === 0 || document.documentElement.scrollTop >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
                scrollWorker.postMessage({ type: "end" });
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            const number = Math.floor(Math.random() * 10) + 1;
            if (number < 3) {
                window.scrollTo({
                    top: document.documentElement.scrollTop - 200,
                    behavior: 'smooth'
                });
            } else if (number > 5) {
                window.scrollTo({
                    top: document.documentElement.scrollTop + 100,
                    behavior: 'smooth'
                });
            }
        };
        scrollWorker.postMessage({ type: "start", interval: 500 });
    };

    // 获取当前积分
    // 兼容PC端搜索页、积分页、移动端搜索页
    const getCurrPoints = () => {
        let pointsStr = '';

        const searchPagePointsWrap = document.querySelector('#rh_rwm .points-container');
        const rewardPagePointsWrap = document.querySelector('#balanceToolTipDiv.textAndIcon mee-rewards-counter-animation.ng-isolate-scope');
        const mobilePagePointsWrap = document.querySelector('#fly_id_rc');
        if (searchPagePointsWrap) {
            // PC端搜索页
            // 需要判断当前显示积分是否已完成计数器动画效果，根据完成情况从不同渠道获取积分值
            if (!searchPagePointsWrap.classList.contains('balance-animation')) {
                pointsStr = searchPagePointsWrap.innerText.trim();
            } else {
                pointsStr = document.documentElement.style.getPropertyValue('--rw-gp-balance-to');
            }
        } else if (rewardPagePointsWrap) {
            // 积分页
            // 需要判断当前显示积分是否已完成计数器动画效果，需完成后才可获取积分值
            const span = document.querySelector('#balanceToolTipDiv.textAndIcon mee-rewards-counter-animation.ng-isolate-scope span');
            if (span) {
                const v1 = rewardPagePointsWrap.innerText.trim().replace(/\D/g, '');
                const v2 = span.getAttribute('aria-label').trim().replace(/\D/g, '');
                pointsStr = v1 === v2 ? v1 : '';
            }
        } else if (mobilePagePointsWrap) {
            // 移动端搜索页
            pointsStr = mobilePagePointsWrap.innerText.trim();

            // 关闭菜单
            const menuClose = document.querySelector('#HBFlyoutClose');
            if (menuClose) {
                menuClose.click();
            }
        } else {
            // 尝试 移动端搜索页 开启菜单
            const menuOpen = document.querySelector('#mHamburger');
            if (menuOpen) {
                menuOpen.click();
            }
        }

        const points = parseInt(pointsStr);
        if (isNaN(points)) {
            return null;
        }
        return points;
    };

    // 计算已取得积分
    const getTaskPoints = () => {
        const currPoints = getCurrPoints();
        if (currPoints === null) {
            return 0;
        }

        let startPoints = GM_getValue(searchPointsKey);
        if (startPoints === -1) {
            GM_setValue(searchPointsKey, currPoints);
            return 0;
        }
        return currPoints - startPoints;
    };

    // 计算当日已取得积分
    const getTodayPoints = () => {
        const currPoints = getCurrPoints();
        if (currPoints === null) {
            return 0;
        }

        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        let startPoints = GM_getValue(pointsKey);
        if (GM_getValue(timeKey) !== today.getTime()) {
            GM_setValue(timeKey, today.getTime());
            GM_setValue(pointsKey, currPoints);
            return 0;
        }
        return currPoints - startPoints;
    };

    // 获取web worker
    function getWorker(worker, param) {
        const code = worker.toString();
        const blob = new Blob([`(${code})(${JSON.stringify(param)})`]);

        return new Worker(URL.createObjectURL(blob));
    }

    // 倒计时函数
    function getCountDown(param) {
        let _timer = null;
        let times = param.times;

        this.onmessage = e => {
            const data = e.data;
            if(data.type === 'start') {
                _timer = setInterval(() => {
                    times--;
                    this.postMessage({ times });
                    if (times <= 0) {
                        clearInterval(_timer);
                    }
                } , data.interval);
            } else if (data.type === 'end') {
                clearInterval(_timer);
            }
        };
    }

    // 生成指定长度随机字符串
    const generateRandomString = length => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    // 生成指定长度随机中文字符串
    const generateRandomStringZh = length => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += String.fromCodePoint(Math.floor(Math.random() * (40869 - 19968)) + 19968);
        }
        return result;
    };

    // 注册菜单
    registerMenuCommand();

    // 搜索页支持自动完成每日搜索
    if (pathnames.includes(location.pathname)) {
        insertStartBtn();

        // 判断是否正在运行搜索任务
        const searchParam = GM_getValue(searchParamKey);
        if (location.search === searchParam) {
            search();
            return;
        }

        // 判断是否触发搜索任务
        if (location.search === autoRunSearch) {
            start();
        }
        return;
    }
})();