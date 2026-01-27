// ==UserScript==
// @name         关注列表导出
// @namespace    https://github.com/yourname
// @version      1.3
// @description  [安全增强+历史保护]并发优化+智能暂停+防误触+无痕模式
// @author       YourName
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      weibo.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/plugin/relativeTime.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540942/%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540942/%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    dayjs.extend(dayjs_plugin_relativeTime);

    const CONFIG = {
        API_PATH: location.host.includes('weibo.com')
            ? '/ajax/friendships/friends'
            : '/api/ajax/friendships/friends',
        API_ENDPOINTS: {
            WEIBO_LIST: {
                PRIMARY: '/ajax/statuses/mymblog',
                BACKUP: [
                    '/ajax/statuses/usermblog',
                    '/ajax/profile/usermblog'
                ]
            },
            USER_PROFILE: {
                PRIMARY: '/ajax/profile/info',
                BACKUP: [
                    '/ajax/profile/detail',
                    '/ajax/profile/basic'
                ]
            }
        },
        REQUEST_HEADERS: {
            ACCEPT: [
                'application/json, text/plain, */*',
                'application/json, text/javascript, */*; q=0.01',
                'application/json, text/html, application/xml;q=0.9'
            ],
            ACCEPT_LANGUAGE: [
                'zh-CN,zh;q=0.9,en;q=0.8',
                'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
                'en-US,en;q=0.9,zh-CN;q=0.8'
            ],
            USER_AGENTS: [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
            ],
            ACCEPT_ENCODING: [
                'gzip, deflate, br',
                'gzip, deflate',
                'br'
            ],
            CONNECTION: [
                'keep-alive',
                'close'
            ],
            SEC_FETCH_DEST: ['document', 'empty'],
            SEC_FETCH_MODE: ['navigate', 'cors', 'no-cors'],
            SEC_FETCH_SITE: ['same-origin', 'same-site', 'cross-site'],
            SEC_CH_UA_PLATFORM: ['"Windows"', '"macOS"', '"Linux"'],
            SEC_CH_UA_MOBILE: ['?0', '?1']
        },
        BUTTON_STYLE: `
            position: fixed;
            bottom: 100px;
            right: 30px;
            z-index: 9999;
            padding: 12px 16px;
            background: linear-gradient(145deg, #ff6b6b, #fda085);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
            border: none;
            font-size: 14px;
            transition: transform 0.3s ease-in-out;
            width: 160px;
            text-align: center;
            height: 42px;
            line-height: 18px;
        `,
        TEXTAREA_STYLE: `
            position: fixed;
            bottom: 160px;
            right: 30px;
            z-index: 9998;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 300px;
            height: 200px;
            resize: none;
            display: none;
            font-size: 14px;
            line-height: 1.5;
        `,
        SWITCH_BUTTON_STYLE: `
            position: fixed;
            bottom: 150px;
            right: 30px;
            z-index: 9999;
            padding: 12px 16px;
            background: linear-gradient(145deg, #3498db, #2980b9);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
            border: none;
            font-size: 14px;
            transition: transform 0.3s ease-in-out;
            width: 160px;
            text-align: center;
            height: 42px;
            line-height: 18px;
        `,
        PROGRESS_STYLE: `
            position: fixed;
            bottom: 60px;
            right: 30px;
            z-index: 9999;
            padding: 8px 8px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 8px;
            font-size: 12px;
            width: 140px;
            text-align: center;
            line-height: 1.2;
        `,
        DATE_FORMAT: 'YYYY.M.D',
        MIN_DELAY: 1500,
        MAX_DELAY: 5000,
        MAX_CONCURRENT: 3,
        MAX_RETRY: 7,
        PAGE_SIZE: 20,
        EXPORT_FORMATS: {
            HTML: 'HTML',
            CSV: 'CSV'
        },
        CACHE_EXPIRY: 30 * 60 * 1000,
        HISTORY_EXPIRY: 180 * 24 * 60 * 60 * 1000
    };

    class WeiboFollowExporter {
        constructor() {
            this.userId = this.extractUserId();
            this.exportButton = null;
            this.progressText = null;
            this.isExporting = false;
            this.currentProgress = 0;
            this.totalFollows = 0;
            this.failedPages = [];
            this.controller = new AbortController();
            this.isManualMode = false;
            this.manualTextarea = null;
            this.switchButton = null;
            this.cache = {
                userInfo: new Map(),
                weiboData: new Map(),
                lastUpdate: new Map()
            };
            this.exportFormat = CONFIG.EXPORT_FORMATS.HTML;
            this.formatSelector = null;
            this.lastErrorTime = 0;
            this.errorCount = 0;
            this.pauseMultiplier = 1;
            this.showRemoved = GM_getValue('showRemoved', true);
            this.stealthMode = false;
            this.stealthCheckbox = null;

            this.cleanupHistoryData();
            setInterval(() => {
                this.cleanupHistoryData();
            }, 24 * 60 * 60 * 1000);

            this.registerMenuCommands();
            this.init();
            this.bindPageUnload();
        }

        registerMenuCommands() {
            const showRemovedText = this.showRemoved ? '隐藏减少关注' : '显示减少关注';
            GM_registerMenuCommand(showRemovedText, () => {
                this.showRemoved = !this.showRemoved;
                GM_setValue('showRemoved', this.showRemoved);
                const newText = this.showRemoved ? '隐藏减少关注' : '显示减少关注';
                GM_notification({
                    title: '设置已更新',
                    text: `减少关注显示: ${this.showRemoved ? '开启' : '关闭'}`,
                    timeout: 2000
                });
            });
        }

        cleanupHistoryData() {
            const historyKey = `followHistory_${this.userId}`;
            const historyData = GM_getValue(historyKey, { timestamp: 0, users: {} });

            if (Date.now() - historyData.timestamp > CONFIG.HISTORY_EXPIRY) {
                historyData.users = {};
                historyData.timestamp = Date.now();
                GM_setValue(historyKey, historyData);
            }
        }

        extractUserId() {
            const followMatch = location.pathname.match(/\/u\/page\/follow\/(\d+)/);
            if (followMatch) return followMatch[1];
            const classicMatch = location.pathname.match(/\/(\d+)\/follow/);
            return classicMatch ? classicMatch[1] : 'unknown';
        }

        async init() {
            if (document.querySelector('#weiboExportBtn')) return;
            this.createSwitchButton();
            this.createManualTextarea();
            this.createExportButton();
            this.createProgressText();
            if (location.pathname.includes('/follow')) {
                this.createStealthModeCheckbox();
            }
            this.addPageListener();
        }

        createExportButton() {
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: flex-end;
            `;

            const formatContainer = document.createElement('div');
            formatContainer.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 5px;
                background: white;
                padding: 5px 8px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 5px;
                opacity: 0;
                transform: translateY(-5px);
                transition: all 0.3s ease;
                z-index: 10000;
                font-size: 12px;
            `;

            const formatLabel = document.createElement('span');
            formatLabel.textContent = '格式';
            formatLabel.style.color = '#666';

            this.formatSelector = document.createElement('select');
            this.formatSelector.style.cssText = `
                padding: 3px 6px;
                border: 1px solid #ddd;
                border-radius: 3px;
                outline: none;
                cursor: pointer;
                font-size: 12px;
            `;

            Object.values(CONFIG.EXPORT_FORMATS).forEach(format => {
                const option = document.createElement('option');
                option.value = format;
                option.textContent = format;
                this.formatSelector.appendChild(option);
            });

            formatContainer.appendChild(formatLabel);
            formatContainer.appendChild(this.formatSelector);

            this.exportButton = document.createElement('button');
            this.exportButton.id = 'weiboExportBtn';
            this.exportButton.textContent = '导出关注列表';
            this.exportButton.style = CONFIG.BUTTON_STYLE;
            this.exportButton.onclick = () => this.startExport();

            container.onmouseenter = () => {
                this.exportButton.style.transform = 'scale(1.05)';
                formatContainer.style.opacity = '1';
                formatContainer.style.transform = 'translateY(0)';
            };

            container.onmouseleave = () => {
                this.exportButton.style.transform = 'scale(1)';
                formatContainer.style.opacity = '0';
                formatContainer.style.transform = 'translateY(-5px)';
            };

            container.appendChild(formatContainer);
            container.appendChild(this.exportButton);
            document.body.appendChild(container);
        }

        createSwitchButton() {
            this.switchButton = document.createElement('button');
            this.switchButton.id = 'weiboSwitchBtn';
            this.switchButton.textContent = '手动输入模式';
            this.switchButton.style = CONFIG.SWITCH_BUTTON_STYLE;
            this.switchButton.onclick = () => {
                if (!location.pathname.includes('/follow')) {
                    this.toggleTextarea();
                } else {
                    this.toggleMode();
                }
            };
            this.switchButton.onmouseover = () => this.switchButton.style.transform = 'scale(1.05)';
            this.switchButton.onmouseout = () => this.switchButton.style.transform = 'scale(1)';
            document.body.appendChild(this.switchButton);
        }

        createManualTextarea() {
            this.manualTextarea = document.createElement('textarea');
            this.manualTextarea.id = 'weiboIdTextarea';
            this.manualTextarea.placeholder = '每行输入一个微博用户链接，可附带【备注】信息\n例如：\nhttps://weibo.com/u/1234567【备注信息】';
            this.manualTextarea.style = CONFIG.TEXTAREA_STYLE;
            document.body.appendChild(this.manualTextarea);
        }

        createStealthModeCheckbox() {
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                bottom: 210px;
                right: 30px;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 5px;
                background: rgba(255, 255, 255, 0.9);
                padding: 6px 10px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                font-size: 12px;
                color: #333;
            `;

            this.stealthCheckbox = document.createElement('input');
            this.stealthCheckbox.type = 'checkbox';
            this.stealthCheckbox.id = 'weiboStealthMode';
            this.stealthCheckbox.style.cssText = `
                width: 14px;
                height: 14px;
                cursor: pointer;
                margin: 0;
            `;
            this.stealthCheckbox.checked = this.stealthMode;
            this.stealthCheckbox.onchange = () => {
                this.stealthMode = this.stealthCheckbox.checked;
            };

            const label = document.createElement('label');
            label.htmlFor = 'weiboStealthMode';
            label.textContent = '无痕模式';
            label.style.cssText = `
                cursor: pointer;
                white-space: nowrap;
                font-size: 12px;
                color: #666;
            `;

            container.appendChild(this.stealthCheckbox);
            container.appendChild(label);
            document.body.appendChild(container);
        }

        toggleMode() {
            const willSwitchToAuto = this.isManualMode;
            if (!location.pathname.includes('/follow') && willSwitchToAuto) {
                alert('只有在关注列表页面才能使用自动获取模式');
                return;
            }

            this.isManualMode = !this.isManualMode;
            if (location.pathname.includes('/follow')) {
                this.exportButton.style.display = 'block';
                this.exportButton.textContent = this.isManualMode ? '导出手动输入列表' : '导出关注列表';
                this.switchButton.textContent = this.isManualMode ? '手动输入模式' : '自动获取模式';

                if (this.isManualMode) {
                    this.toggleTextarea();
                } else {
                    this.manualTextarea.style.display = 'none';
                    this.manualTextarea.value = '';
                }
            } else {
                if (this.isManualMode) {
                    this.exportButton.style.display = 'block';
                    this.exportButton.textContent = '导出手动输入列表';
                } else {
                    this.exportButton.style.display = 'none';
                    this.manualTextarea.style.display = 'none';
                }
            }
        }

        toggleTextarea() {
            const isVisible = this.manualTextarea.style.display === 'block';
            this.manualTextarea.style.display = isVisible ? 'none' : 'block';
            if (this.exportButton) {
                this.exportButton.style.display = isVisible ? 'none' : 'block';
                this.exportButton.textContent = '导出手动输入列表';
            }
            if (isVisible) {
                this.manualTextarea.value = '';
            }
        }

        async startExport() {
            if (this.isExporting) return;

            const confirmExport = confirm('确定开始导出吗？导出过程中请不要关闭页面。');
            if (!confirmExport) return;

            if (this.isManualMode) {
                await this.startManualExport();
            } else {
                if (this.userId === 'unknown') {
                    alert('请先进入关注列表页面');
                    return;
                }
                await this.startAutoExport();
            }
        }

        async startManualExport() {
            if (!this.manualTextarea.value.trim()) {
                alert('请输入至少一个有效的微博用户链接');
                return;
            }

            const lines = this.manualTextarea.value.split('\n').filter(line => line.trim());
            const idsWithRemark = [];

            for (const line of lines) {
                const idMatch = line.match(/https:\/\/weibo\.com\/u\/(\d+)/);
                const remarkMatch = line.match(/【(.*?)】/);
                if (idMatch) {
                    const id = idMatch[1];
                    const remark = remarkMatch ? remarkMatch[1] : '';
                    idsWithRemark.push({ id, remark });
                }
            }

            if (idsWithRemark.length === 0) {
                alert('请输入至少一个有效的微博用户链接');
                return;
            }

            try {
                this.isExporting = true;
                if (this.manualTextarea) this.manualTextarea.style.display = 'none';
                if (this.switchButton) this.switchButton.style.display = 'none';
                this.updateButtonText('正在获取数据...');
                this.showProgressText();

                const total = idsWithRemark.length;
                let data = [];

                for (let i = 0; i < idsWithRemark.length; i++) {
                    const { id, remark } = idsWithRemark[i];
                    this.updateProgressText(`正在获取第 ${i + 1}/${total} 个用户信息...`);

                    try {
                        const [userInfo, weiboData] = await Promise.all([
                            this.fetchUserInfoWithRetry(id),
                            this.fetchWeiboDataWithRetry(id)
                        ]);

                        if (userInfo) {
                            const currentFollowers = parseInt(userInfo.followers_count) || 0;
                            const followersChange = await this.getFollowersChange(id, currentFollowers);
                            const backupPostTime = userInfo.status?.created_at;
                            const lastPost = this.parseLastPost(weiboData) || backupPostTime;

                            data.push({
                                order: i + 1,
                                name: userInfo.screen_name,
                                id: id,
                                url: `https://weibo.com/u/${id}`,
                                followers_count: this.formatFollowers(currentFollowers),
                                followers_raw: currentFollowers,
                                avatar: userInfo.avatar_hd || userInfo.avatar_large || userInfo.profile_image_url,
                                remark: remark,
                                last_post: lastPost,
                                change: followersChange.text,
                                change_raw: followersChange.value
                            });
                        }
                    } catch (error) {
                        console.error(`获取用户 ${id} 信息失败:`, error);
                    }

                    await this.randomDelay();
                }

                if (data.length > 0) {
                    await this.exportFile(data);
                    GM_notification({
                        title: '导出完成',
                        text: `成功导出 ${data.length} 条数据`,
                        timeout: 5000
                    });
                } else {
                    throw new Error('没有成功获取任何用户数据，请检查输入的链接是否正确');
                }
            } catch (error) {
                alert(`导出失败：${error.message}`);
            } finally {
                this.isExporting = false;
                this.updateButtonText(this.isManualMode ? '导出手动输入列表' : '导出关注列表');
                this.hideProgressText();
                if (this.manualTextarea) this.manualTextarea.style.display = this.isManualMode ? 'block' : 'none';
                if (this.switchButton) this.switchButton.style.display = 'block';
                this.controller = new AbortController();
            }
        }

        isCacheValid(key, type) {
            const lastUpdate = this.cache.lastUpdate.get(`${type}_${key}`);
            return lastUpdate && (Date.now() - lastUpdate) < CONFIG.CACHE_EXPIRY;
        }

        getCachedData(key, type) {
            if (this.isCacheValid(key, type)) {
                return this.cache[type].get(key);
            }
            return null;
        }

        setCacheData(key, type, data) {
            this.cache[type].set(key, data);
            this.cache.lastUpdate.set(`${type}_${key}`, Date.now());
        }

        async fetchUserInfoWithRetry(id, retryCount = 0) {
            const cachedData = this.getCachedData(id, 'userInfo');
            if (cachedData) {
                return cachedData;
            }

            try {
                const response = await this.fetchUserProfile(id);
                if (response?.data?.user) {
                    this.setCacheData(id, 'userInfo', response.data.user);
                    return response.data.user;
                }
                throw new Error('获取用户信息失败');
            } catch (error) {
                if (retryCount < CONFIG.MAX_RETRY) {
                    await this.smartPause(retryCount);
                    return this.fetchUserInfoWithRetry(id, retryCount + 1);
                }
                throw error;
            }
        }

        async fetchWeiboDataWithRetry(id, retryCount = 0) {
            const cachedData = this.getCachedData(id, 'weiboData');
            if (cachedData) {
                return cachedData;
            }

            try {
                const response = await this.fetchWeiboData(id);
                if (response?.data?.list) {
                    this.setCacheData(id, 'weiboData', response);
                    return response;
                }
                throw new Error('获取微博数据失败');
            } catch (error) {
                if (retryCount < CONFIG.MAX_RETRY) {
                    await this.smartPause(retryCount);
                    return this.fetchWeiboDataWithRetry(id, retryCount + 1);
                }
                return null;
            }
        }

        async smartPause(retryCount) {
            const now = Date.now();
            if (now - this.lastErrorTime < 30000) {
                this.errorCount++;
            } else {
                this.errorCount = 1;
            }
            this.lastErrorTime = now;

            if (this.errorCount >= 3) {
                this.pauseMultiplier = Math.min(this.pauseMultiplier * 2, 8);
            }

            const baseDelay = 2000 * (retryCount + 1);
            const extraDelay = Math.random() * 1000;
            const finalDelay = baseDelay * this.pauseMultiplier + extraDelay;

            console.log(`智能暂停: ${Math.round(finalDelay)}ms (倍率: ${this.pauseMultiplier}x)`);
            await new Promise(resolve => setTimeout(resolve, finalDelay));
        }

        parseLastPost(weiboData) {
            if (!weiboData?.data?.list) return null;
            const validPosts = weiboData.data.list.filter(post => !post.isTop);
            return validPosts[0]?.created_at || null;
        }

        async getFollowersChange(uid, currentCount) {
            const key = `followers_${uid}`;
            const prevData = GM_getValue(key, null);

            if (!prevData) {
                GM_setValue(key, {
                    count: currentCount,
                    timestamp: Date.now()
                });
                return {
                    value: 0,
                    text: '无',
                    color: '#999999'
                };
            }

            const change = currentCount - prevData.count;

            GM_setValue(key, {
                count: currentCount,
                timestamp: Date.now()
            });

            return {
                value: change,
                text: change === 0 ? '-' : (change > 0 ? `+${change}` : `${change}`),
                color: change > 0 ? '#2ecc71' : change < 0 ? '#e74c3c' : '#999999'
            };
        }

        async startAutoExport() {
            try {
                this.isExporting = true;
                if (this.manualTextarea) this.manualTextarea.style.display = 'none';
                if (this.switchButton) this.switchButton.style.display = 'none';

                this.failedPages = [];
                this.updateButtonText('正在获取总数...');
                this.totalFollows = await this.getTotalFollows();

                const totalPages = Math.ceil(this.totalFollows / CONFIG.PAGE_SIZE);
                const avgTimePerRequest = this.stealthMode ? 2 : 4;
                const concurrentRequests = CONFIG.MAX_CONCURRENT;
                const estimatedTime = Math.ceil((totalPages * avgTimePerRequest) / concurrentRequests);

                if (!confirm(`准备导出 ${this.totalFollows} 个关注，预计需要 ${estimatedTime} 秒（约${Math.ceil(estimatedTime/60)}分钟），继续吗？`)) {
                    this.isExporting = false;
                    this.updateButtonText('导出关注列表');
                    return;
                }

                this.updateButtonText('开始导出...');
                this.showProgressText();
                this.updateProgressText('正在准备数据...');
                this.currentProgress = 0;
                this.updateProgressText(`导出: 0/${this.totalFollows} | 0%`);

                const data = await this.fetchAllData(this.totalFollows);
                await this.exportFile(data);

                if (this.failedPages.length > 0) {
                    alert(`导出完成，但有 ${this.failedPages.length} 页数据获取失败：${this.failedPages.join(',')}`);
                }

                GM_notification({
                    title: '导出完成',
                    text: `成功导出 ${data.length} 条数据`,
                    timeout: 5000
                });
            } catch (error) {
                alert(`导出失败：${error.message}`);
            } finally {
                this.isExporting = false;
                this.updateButtonText('导出关注列表');
                this.hideProgressText();
                if (this.manualTextarea) this.manualTextarea.style.display = this.isManualMode ? 'block' : 'none';
                if (this.switchButton) this.switchButton.style.display = 'block';
                this.controller = new AbortController();
            }
        }

        async getTotalFollows() {
            const data = await this.fetchAPI(1);
            if (!data || !data.total_number) throw new Error('无法获取关注总数');

            const historyKey = `followHistory_${this.userId}`;
            let historyData = GM_getValue(historyKey, { timestamp: 0, users: {} });

            if (!historyData.users || Object.keys(historyData.users).length === 0) {
                historyData.users = {};
                historyData.timestamp = Date.now();

                data.users.forEach(user => {
                    historyData.users[user.idstr] = {
                        name: user.screen_name,
                        remark: user.remark || '',
                        url: `https://weibo.com/u/${user.idstr}`,
                        addedTime: Date.now(),
                        removed: false
                    };
                });

                GM_setValue(historyKey, historyData);
            }

            return data.total_number;
        }

        async fetchAllData(total) {
            const totalPage = Math.ceil(total / CONFIG.PAGE_SIZE);
            let result = [];
            let currentPage = 1;
            let processedCount = 0;

            while (currentPage <= totalPage) {
                const pagesToFetch = Array.from(
                    { length: Math.min(CONFIG.MAX_CONCURRENT, totalPage - currentPage + 1) },
                    (_, i) => currentPage + i
                );

                this.updateProgressText(
                    `导出: ${processedCount}/${total} | ${Math.floor((processedCount/total)*100)}%`
                );

                const pageResults = await Promise.allSettled(
                    pagesToFetch.map(page =>
                        this.fetchWithRetry(page)
                            .then(async data => {
                                if (data?.users) {
                                    processedCount += data.users.length;
                                    this.currentProgress = processedCount;
                                    this.updateProgressText(
                                        `导出: ${processedCount}/${total} | ${Math.floor((processedCount/total)*100)}%`
                                    );
                                    return this.processPageConcurrent(data.users, page);
                                }
                                return [];
                            })
                    )
                );

                currentPage += pagesToFetch.length;

                for (const res of pageResults) {
                    if (res.status === 'fulfilled') {
                        result.push(...res.value);
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 200));
            }

            result.sort((a, b) => a.order - b.order);
            return result;
        }

        async fetchWithRetry(page, retryCount = 0) {
            try {
                const backoffDelay = Math.pow(2, retryCount) * 1000;
                await new Promise(r => setTimeout(r, backoffDelay));

                return await this.fetchAPI(page);
            } catch (error) {
                console.error(`第 ${page} 页尝试 ${retryCount + 1} 次失败：`, error);
                if (retryCount < CONFIG.MAX_RETRY) {
                    await this.smartPause(retryCount);
                    return this.fetchWithRetry(page, retryCount + 1);
                }
                this.failedPages.push(page);
                return { users: [] };
            }
        }

        async getLastPost(uid) {
            if (this.stealthMode) return null;

            try {
                const data = await this.fetchWeiboData(uid);
                if (data?.data?.list) {
                    const validPosts = data.data.list.filter(post => !post.isTop);
                    return validPosts[0]?.created_at || null;
                }
                return null;
            } catch (error) {
                console.error('获取微博列表失败:', error);
                return null;
            }
        }

        async getLastPostFromProfile(uid) {
            if (this.stealthMode) return null;

            try {
                const data = await this.fetchUserProfile(uid);
                return data?.status?.created_at || null;
            } catch (error) {
                console.error('获取用户信息失败:', error);
                return null;
            }
        }

        randomDelay() {
            const delay = Math.random() * (CONFIG.MAX_DELAY - CONFIG.MIN_DELAY) + CONFIG.MIN_DELAY;
            return new Promise(r => setTimeout(r, delay));
        }

        async processPageConcurrent(users, page) {
            const processed = await Promise.all(
                users.map(async (user, index) => {
                    const result = await this.processUser(user, page, index);
                    return result;
                })
            );
            return processed.filter(item => item !== null);
        }

        async processUser(user, page, index) {
            const dynamicDelay = Math.random() * (CONFIG.MAX_DELAY - CONFIG.MIN_DELAY) + CONFIG.MIN_DELAY;
            await new Promise(r => setTimeout(r, dynamicDelay));

            const currentFollowers = user.followers_count;
            const followersChange = await this.getFollowersChange(user.idstr, currentFollowers);

            let lastPost = null;
            if (!this.stealthMode) {
                const [lastPost1, lastPost2] = await Promise.allSettled([
                    this.getLastPost(user.idstr),
                    this.getLastPostFromProfile(user.idstr)
                ]);

                lastPost = [
                    lastPost1.status === 'fulfilled' ? lastPost1.value : null,
                    lastPost2.status === 'fulfilled' ? lastPost2.value : null
                ].find(t => t && dayjs(t).isValid());
            }

            return {
                order: (page - 1) * CONFIG.PAGE_SIZE + index + 1,
                name: user.screen_name,
                remark: user.remark || '',
                url: `https://weibo.com/u/${user.idstr}`,
                id: user.idstr,
                followers_count: this.formatFollowers(currentFollowers),
                followers_raw: currentFollowers,
                change: followersChange.text,
                change_raw: followersChange.value,
                avatar: this.randomizeAvatar(user.avatar_hd),
                last_post: lastPost || null
            };
        }

        randomizeAvatar(url) {
            if (!url) return '';
            const timestamp = Date.now();
            return url.includes('?')
                ? `${url}&_rnd=${timestamp}`
                : `${url}?_rnd=${timestamp}`;
        }

        randomArrayElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }

        getRandomHeaders() {
            const headers = {
                'Referer': location.href,
                'User-Agent': this.randomArrayElement(CONFIG.REQUEST_HEADERS.USER_AGENTS),
                'Accept': this.randomArrayElement(CONFIG.REQUEST_HEADERS.ACCEPT),
                'Accept-Language': this.randomArrayElement(CONFIG.REQUEST_HEADERS.ACCEPT_LANGUAGE),
                'Accept-Encoding': this.randomArrayElement(CONFIG.REQUEST_HEADERS.ACCEPT_ENCODING),
                'Connection': this.randomArrayElement(CONFIG.REQUEST_HEADERS.CONNECTION),
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            };

            if (Math.random() > 0.3) {
                headers['Sec-Fetch-Dest'] = this.randomArrayElement(CONFIG.REQUEST_HEADERS.SEC_FETCH_DEST);
                headers['Sec-Fetch-Mode'] = this.randomArrayElement(CONFIG.REQUEST_HEADERS.SEC_FETCH_MODE);
                headers['Sec-Fetch-Site'] = this.randomArrayElement(CONFIG.REQUEST_HEADERS.SEC_FETCH_SITE);
                headers['Sec-Ch-Ua-Platform'] = this.randomArrayElement(CONFIG.REQUEST_HEADERS.SEC_CH_UA_PLATFORM);
                headers['Sec-Ch-Ua-Mobile'] = this.randomArrayElement(CONFIG.REQUEST_HEADERS.SEC_CH_UA_MOBILE);
            }

            return headers;
        }

        async fetchAPI(page) {
            const randomParam = `&_rnd=${Date.now()}`;
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://weibo.com${CONFIG.API_PATH}?page=${page}${randomParam}`,
                    headers: this.getRandomHeaders(),
                    signal: this.controller.signal,
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                const data = JSON.parse(res.responseText);
                                data.ok === 1 ? resolve(data) : reject(new Error('API响应异常'));
                            } catch (e) {
                                reject(new Error('数据解析失败'));
                            }
                        } else {
                            reject(new Error(`HTTP ${res.status}`));
                        }
                    },
                    onerror: (err) => reject(err),
                    onabort: () => reject(new Error('用户中止请求'))
                });
            });
        }

        async fetchUserProfile(uid) {
            if (this.stealthMode) return { data: { user: { screen_name: '未知用户' } } };

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://weibo.com${CONFIG.API_ENDPOINTS.USER_PROFILE.PRIMARY}?uid=${uid}`,
                    headers: this.getRandomHeaders(),
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                const response = JSON.parse(res.responseText);
                                resolve(response);
                            } catch (e) {
                                reject('用户信息解析失败');
                            }
                        } else {
                            reject(`HTTP ${res.status}`);
                        }
                    },
                    onerror: reject
                });
            });
        }

        async fetchWeiboData(uid) {
            if (this.stealthMode) return { data: { list: [] } };

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://weibo.com${CONFIG.API_ENDPOINTS.WEIBO_LIST.PRIMARY}?uid=${uid}&page=1&feature=0`,
                    headers: this.getRandomHeaders(),
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                const data = JSON.parse(res.responseText);
                                resolve(data);
                            } catch (e) {
                                reject('微博数据解析失败');
                            }
                        } else {
                            reject(`HTTP ${res.status}`);
                        }
                    },
                    onerror: reject
                });
            });
        }

        formatFollowers(num) {
            if (!num && num !== 0) return '0粉';
            return num > 10000
                ? `${(num / 10000).toFixed(1)}万粉`
                : `${num}粉`;
        }

        async exportFile(data) {
            this.exportFormat = this.formatSelector.value;
            const timestamp = dayjs().format(CONFIG.DATE_FORMAT);
            const prefix = this.isManualMode ? '自填导出' : this.userId;
            const filename = `${prefix}-${timestamp}`;

            const currentUserIdSet = new Set(data.map(user => user.id));
            const previousKey = `previousExport_${this.userId}`;
            const previousUserIdSet = new Set(GM_getValue(previousKey, []));

            const removedIds = [...previousUserIdSet].filter(id => !currentUserIdSet.has(id));

            const historyKey = `followHistory_${this.userId}`;
            let historyData = GM_getValue(historyKey, { timestamp: 0, users: {} });

            this.removedUsers = removedIds.map(id => {
                const user = historyData.users[id] || {};
                return {
                    id: id,
                    name: user.name || '未知用户',
                    url: user.url || `https://weibo.com/u/${id}`,
                    remark: user.remark || ''
                };
            });

            data.forEach(user => {
                historyData.users[user.id] = {
                    name: user.name,
                    remark: user.remark,
                    url: user.url,
                    addedTime: Date.now(),
                    removed: false,
                    followers: user.followers_raw,
                    lastExport: Date.now()
                };
            });

            removedIds.forEach(id => {
                if (historyData.users[id]) {
                    historyData.users[id].removed = true;
                    historyData.users[id].removedTime = Date.now();
                }
            });

            historyData.timestamp = Date.now();
            GM_setValue(historyKey, historyData);

            GM_setValue(previousKey, [...currentUserIdSet]);

            if (this.exportFormat === CONFIG.EXPORT_FORMATS.CSV) {
                await this.exportCSV(data, filename);
            } else {
                await this.exportHTML(data, filename);
            }
        }

        async exportCSV(data, filename) {
            const csvContent = data.map((user, index) => {
                const formattedFans = this.formatFollowers(user.followers_raw);
                const remarkDisplay = user.remark ? `【${user.remark}】` : '';
                const changeText = user.change === '-' ? '' : (user.change_raw > 0 ? `（+${user.change_raw}）` : `（${user.change_raw}）`);
                const url = `https://weibo.com/u/${user.id}`;
                return `(${user.order}) "${user.name}" ${remarkDisplay} ${url}===${formattedFans}${changeText}`;
            }).join('\n');

            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, `${filename}.csv`);
        }

        async exportHTML(data, filename) {
            const generateRemovedSection = () => {
                if (!this.showRemoved || !this.removedUsers || this.removedUsers.length === 0) return '';

                return `
        <div class="removed-section">
            <div class="removed-header">
                <h2 style="margin: 0;">减少的关注（${this.removedUsers.length}人）</h2>
                <div class="removed-count">这些用户已从你的关注列表中消失</div>
            </div>
            <table class="removed-table">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>昵称</th>
                        <th>备注</th>
                        <th>主页链接/ID</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.removedUsers.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${this.escapeHtml(item.name)}</td>
                            <td>${item.remark ? this.escapeHtml(item.remark) : '-'}</td>
                            <td>
                                <a href="${item.url}" target="_blank">访问主页</a>
                                <div class="user-id">ID: ${this.escapeHtml(item.id)}</div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
            };

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>微博关注列表导出 - ${this.userId}</title>
    <style>
        * { font-family: "Microsoft YaHei", Arial, sans-serif; }
        .container { max-width: 1600px; margin: 20px auto; padding: 20px; }
        h1 { color: #2c3e50; text-align: center; margin-bottom: 20px; }
        .unit-switch {
            margin-left: 15px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #2196F3;
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .search-container {
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
        }
        .search-box {
            flex: 1;
            padding: 12px 20px;
            border: 2px solid #3498db;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }
        .search-box:focus {
            border-color: #2ecc71;
            box-shadow: 0 0 8px rgba(46, 204, 113, 0.3);
        }
        .info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .info-center {
            text-align: center;
            flex: 1;
        }
        .unit-switch {
            margin-right: 20px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        th {
            background: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            cursor: pointer;
            position: relative;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
        }
        tr:hover { background: #f5f6fa; }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover { text-decoration: underline; }
        .followers {
            color: #e67e22;
            font-weight: bold;
        }
        .remark { color: #27ae60; }
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        .change.positive { color: #2ecc71; }
        .change.negative { color: #e74c3c; }
        .change.neutral { color: #999999; }
        .change.none { color: #999999; font-style: italic; }
        .user-id {
            color: #95a5a6;
            font-size: 0.9em;
            margin-top: 2px;
        }
        .last-post { color: #7f8c8d; min-width: 120px; }
        th .arrow {
            display: inline-block;
            margin-left: 4px;
            font-weight: normal;
            opacity: 0.8;
            vertical-align: baseline;
        }
        .follower-filter {
            display: inline-block;
            margin-right: 15px;
        }
        #followerFilter {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 12px;
            width: 120px;
        }
        .removed-section {
            margin: 30px 0;
            padding: 20px;
            background: #fff6f6;
            border-left: 4px solid #e74c3c;
            border-radius: 4px;
        }
        .removed-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .removed-count {
            color: #e74c3c;
            font-weight: bold;
        }
        .removed-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .removed-table th {
            background: #fdecea;
            color: #c0392b;
        }
        .removed-table td, .removed-table th {
            padding: 10px;
            border: 1px solid #f5cccc;
            text-align: left;
        }
        .removed-table tr:hover { background: #fef0ef; }
    </style>
</head>
<body>
    <div class="container">
        <h1>微博关注列表导出</h1>

        <div class="search-container">
            <input type="text"
                   class="search-box"
                   placeholder="搜索昵称/备注/ID..."
                   oninput="searchTable(this.value)">
            <div class="update-time">变动获取时间：${this.formatChangeTime(Date.now())}</div>
        </div>

        <div class="info">
            <div>用户ID：${this.userId}</div>
            <div class="info-center">导出时间：${dayjs().format('YYYY年MM月DD日 HH:mm')}</div>
            <div class="follower-filter">
                <select id="followerFilter" onchange="filterByFollowers(this.value)" style="padding: 5px; border-radius: 4px; border: 1px solid #ccc; font-size: 12px;">
                    <option value="all">全部粉丝数</option>
                    <option value="0-1000">粉丝数0-1千</option>
                    <option value="1000-2000">粉丝数1-2千</option>
                    <option value="2000-5000">粉丝数2-5千</option>
                    <option value="5000-10000">粉丝数5千-1万</option>
                    <option value="10000-50000">粉丝数1万-5万以下</option>
                    <option value="50000+">粉丝数5万以上</option>
                </select>
            </div>
            <div class="unit-switch">
                <span>单位转换/万</span>
                <label class="switch">
                    <input type="checkbox" id="unitToggle" onchange="toggleUnit()">
                    <span class="slider"></span>
                </label>
            </div>
            <div>总计：${data.length} 人</div>
        </div>
        <table id="followTable">
            <thead>
                <tr>
                    <th>头像</th>
                    <th>序号</th>
                    <th onclick="sortTable(2, 'string')">昵称 <span class="arrow" id="nameArrow"></span></th>
                    <th onclick="sortTable(3, 'remark')">备注 <span class="arrow" id="remarkArrow"></span></th>
                    <th>主页链接/ID</th>
                    <th onclick="sortTable(5, 'timestamp')">上次发博 <span class="arrow" id="timeArrow"></span></th>
                    <th onclick="sortTable(6, 'followers')">粉丝量 <span class="arrow" id="followersArrow"></span></th>
                    <th onclick="sortTable(7, 'change')">粉丝变动 <span class="arrow" id="changeArrow"></span></th>
                    <th onclick="sortTable(8, 'order')">关注顺序 <span class="arrow" id="orderArrow"></span></th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item, index) => `
                    <tr>
                        <td><img class="avatar" src="${item.avatar}" alt=""></td>
                        <td>${index + 1}</td>
                        <td>${this.escapeHtml(item.name)}</td>
                        <td class="remark" data-has-remark="${item.remark ? '1' : '0'}">${item.remark ? this.escapeHtml(item.remark) : '-'}</td>
                        <td>
                            <a href="${item.url}" target="_blank">访问主页</a>
                            <div class="user-id">ID: ${this.escapeHtml(item.id)}</div>
                        </td>
                        <td class="last-post" data-timestamp="${item.last_post ? new Date(item.last_post).getTime() : 0}">
                            ${this.formatTime(item.last_post)}
                        </td>
                        <td class="followers" data-followers="${item.followers_raw}">${item.followers_raw.toString().replace(/\B(?=(\d{4})+(?!\d))/g, ',')}</td>
                        <td class="change ${item.change === '无' ? 'none' : item.change_raw > 0 ? 'positive' : item.change_raw < 0 ? 'negative' : 'neutral'}"
                            data-change="${item.change_raw}">
                            ${item.change}
                        </td>
                        <td data-order="${item.order}">${item.order}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        ${generateRemovedSection()}

    </div>
    <script>
        let currentSort = { column: null, type: 'number', direction: 1 };
        let showInWan = false;

        function formatNumber(num) {
            if (showInWan) {
                if (num >= 10000) {
                    return Math.floor(num / 10000) + '万';
                }
                return num;
            } else {
                let str = num.toString();
                let result = '';
                for (let i = str.length - 1; i >= 0; i--) {
                    if ((str.length - 1 - i) % 4 === 0 && i !== str.length - 1) {
                        result = ',' + result;
                    }
                    result = str[i] + result;
                }
                return result;
            }
        }

        function toggleUnit() {
            showInWan = document.getElementById('unitToggle').checked;
            const followers = document.querySelectorAll('.followers');
            followers.forEach(cell => {
                const num = parseInt(cell.dataset.followers);
                cell.textContent = formatNumber(num);
            });
        }

        function updateArrows(column) {
            document.querySelectorAll('.arrow').forEach(arrow => arrow.innerHTML = '');
            const arrowElement = document.getElementById(column + 'Arrow');
            if (arrowElement) {
                arrowElement.innerHTML = currentSort.direction === 1 ? '↑' : '↓';
            }
        }

        function getCompareValue(cell, dataType) {
            switch(dataType) {
                case 'timestamp':
                    return parseInt(cell.dataset.timestamp) || 0;
                case 'followers':
                    return parseInt(cell.dataset.followers) || 0;
                case 'change':
                    return parseInt(cell.dataset.change) || 0;
                case 'order':
                    return parseInt(cell.dataset.order) || 0;
                case 'remark':
                    const hasRemark = cell.dataset.hasRemark === '1';
                    const remarkText = cell.textContent.trim();
                    return hasRemark ? remarkText : 'zzz' + remarkText;
                case 'string':
                default:
                    return cell.textContent.trim().toLowerCase();
            }
        }

        function sortTable(columnIndex, dataType) {
            const table = document.getElementById('followTable');
            const tbody = table.tBodies[0];
            const rows = Array.from(tbody.rows);

            if (currentSort.column === columnIndex) {
                currentSort.direction *= -1;
            } else {
                currentSort.column = columnIndex;
                currentSort.direction = 1;
                currentSort.type = dataType;
            }

            rows.sort((a, b) => {
                const aVal = getCompareValue(a.cells[columnIndex], dataType);
                const bVal = getCompareValue(b.cells[columnIndex], dataType);
                return (aVal > bVal ? 1 : -1) * currentSort.direction;
            });

            tbody.innerHTML = '';
            rows.forEach((row, index) => {
                row.cells[1].textContent = index + 1;
                tbody.appendChild(row);
            });

            const columnNames = ['','','name','remark','','time','followers','change','order'];
            updateArrows(columnNames[columnIndex]);
        }

        function searchTable(query) {
            query = query.toLowerCase();
            const rows = document.querySelectorAll('#followTable tbody tr');
            rows.forEach(row => {
                const name = row.cells[2].textContent.toLowerCase();
                const remark = row.cells[3].textContent.toLowerCase();
                const id = row.cells[4].querySelector('.user-id').textContent.toLowerCase();
                row.style.display =
                    name.includes(query) ||
                    remark.includes(query) ||
                    id.includes(query) ? '' : 'none';
            });
        }

        function filterByFollowers(range) {
            const rows = document.querySelectorAll('#followTable tbody tr');
            rows.forEach(row => {
                const followers = parseInt(row.querySelector('.followers').dataset.followers) || 0;
                let shouldShow = true;

                switch(range) {
                    case '0-1000':
                        shouldShow = followers >= 0 && followers < 1000;
                        break;
                    case '1000-2000':
                        shouldShow = followers >= 1000 && followers < 2000;
                        break;
                    case '2000-5000':
                        shouldShow = followers >= 2000 && followers < 5000;
                        break;
                    case '5000-10000':
                        shouldShow = followers >= 5000 && followers < 10000;
                        break;
                    case '10000-50000':
                        shouldShow = followers >= 10000 && followers < 50000;
                        break;
                    case '50000+':
                        shouldShow = followers >= 50000;
                        break;
                    case 'all':
                    default:
                        shouldShow = true;
                }

                row.style.display = shouldShow ? '' : 'none';
            });
        }
    </script>
</body>
</html>
            `;

            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            saveAs(blob, `${filename}.html`);
        }

        formatTime(timeStr) {
            if (!timeStr) return '-';
            const date = dayjs(timeStr);
            return date.isValid() ? date.format('YYYY年M月D日HH:mm:ss') : '-';
        }

        escapeHtml(text) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        createProgressText() {
            this.progressText = document.createElement('div');
            this.progressText.style = CONFIG.PROGRESS_STYLE;
            this.progressText.style.display = 'none';
            document.body.appendChild(this.progressText);
        }

        updateButtonText(text) {
            if (this.exportButton) {
                this.exportButton.textContent = text;
                this.exportButton.style.opacity = this.isExporting ? '0.7' : '1';
            }
        }

        showProgressText() {
            this.progressText && (this.progressText.style.display = 'block');
        }

        hideProgressText() {
            this.progressText && (this.progressText.style.display = 'none');
        }

        updateProgressText(text) {
            if (!this.progressText) return;
            this.progressText.textContent = text;
        }

        addPageListener() {
            let lastPath = location.pathname;
            setInterval(() => {
                if (location.pathname !== lastPath) {
                    lastPath = location.pathname;
                    this.userId = this.extractUserId();
                }
            }, 1000);
        }

        bindPageUnload() {
            window.addEventListener('beforeunload', (e) => {
                if (this.isExporting) {
                    e.preventDefault();
                    e.returnValue = '正在导出数据，确定要离开吗？';
                    this.controller.abort();
                    GM_notification({
                        title: '导出已中止',
                        text: '页面关闭导致导出中断',
                        timeout: 3000
                    });
                }
            });
        }

        formatChangeTime(timestamp) {
            if (!timestamp) return '-';
            const now = Date.now();
            const diff = now - timestamp;
            const hours = Math.floor(diff / (1000 * 60 * 60));

            if (hours < 24) {
                return `${hours}小时前`;
            } else {
                return dayjs(timestamp).format('YYYY年M月D日HH:mm');
            }
        }
    }

    if (location.host.includes('weibo.com')) {
        const exporter = new WeiboFollowExporter();

        if (!location.pathname.includes('/follow')) {
            if (exporter.exportButton) {
                exporter.exportButton.style.display = 'none';
            }
            if (exporter.progressText) {
                exporter.progressText.style.display = 'none';
            }
            exporter.isManualMode = true;
            if (exporter.manualTextarea) {
                exporter.manualTextarea.style.display = 'none';
            }
            if (exporter.switchButton) {
                exporter.switchButton.textContent = '手动输入模式';
            }
        }
    }
})();