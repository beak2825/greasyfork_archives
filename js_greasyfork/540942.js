// ==UserScript==
// @name          关注列表导出
// @namespace    https://github.com/yourname
// @version      1.2
// @description  [箭头修复+固定序号]三重发博时间获取+并发优化+反爬增强
// @author       YourName
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
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
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
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
        MIN_DELAY: 500,  // 增加最小延迟时间
        MAX_DELAY: 3000, // 增加最大延迟时间
        MAX_CONCURRENT: 5,
        MAX_RETRY: 5,
        PAGE_SIZE: 20,
        EXPORT_FORMATS: {
            HTML: 'HTML',
            CSV: 'CSV'
        },
        CACHE_EXPIRY: 30 * 60 * 1000, // 缓存有效期30分钟
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
            this.init();
            this.bindPageUnload();
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

            // 创建格式选择器
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

            // 创建导出按钮
            this.exportButton = document.createElement('button');
            this.exportButton.id = 'weiboExportBtn';
            this.exportButton.textContent = '↓ 导出关注列表';
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
                    // 在非关注页面，直接切换输入框显示状态
                    this.toggleTextarea();
                } else {
                    // 在关注页面，切换自动/手动模式
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

        toggleMode() {
            // 检查是否要切换到自动模式（当前是手动模式，且点击切换按钮）
            const willSwitchToAuto = this.isManualMode;

            // 在非关注页面时，如果要切换到自动模式，立即阻止并提示
            if (!location.pathname.includes('/follow') && willSwitchToAuto) {
                alert('只有在关注列表页面才能使用自动获取模式');
                return;
            }

            // 正常切换模式
            this.isManualMode = !this.isManualMode;

            // 在关注页面时
            if (location.pathname.includes('/follow')) {
                this.exportButton.style.display = 'block';
                this.exportButton.textContent = this.isManualMode ? '导出手动输入列表' : '↓ 导出关注列表';
                this.switchButton.textContent = this.isManualMode ? '手动输入模式' : '自动获取模式';

                if (this.isManualMode) {
                    // 切换到手动模式时，显示输入框
                    this.toggleTextarea();
                } else {
                    // 切换到自动模式时，隐藏输入框并清空内容
                    this.manualTextarea.style.display = 'none';
                    this.manualTextarea.value = '';
                }
            } else {
                // 在非关注页面时
                if (this.isManualMode) {
                    // 切换到手动模式时，显示导出按钮，但不显示输入框
                    this.exportButton.style.display = 'block';
                    this.exportButton.textContent = '导出手动输入列表';
                } else {
                    // 隐藏所有元素
                    this.exportButton.style.display = 'none';
                    this.manualTextarea.style.display = 'none';
                }
            }
        }

        toggleTextarea() {
            const isVisible = this.manualTextarea.style.display === 'block';
            this.manualTextarea.style.display = isVisible ? 'none' : 'block';

            // 同步显示/隐藏导出按钮
            if (this.exportButton) {
                this.exportButton.style.display = isVisible ? 'none' : 'block';
                this.exportButton.textContent = '导出手动输入列表';
            }

            // 隐藏时清空内容
            if (isVisible) {
                this.manualTextarea.value = '';
            }
        }

        async startExport() {
            if (this.isExporting) return;

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
                // 隐藏手动输入相关元素
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
                this.updateButtonText(this.isManualMode ? '导出手动输入列表' : '↓ 导出关注列表');
                this.hideProgressText();
                // 导出完成后重新显示手动输入相关元素
                if (this.manualTextarea) this.manualTextarea.style.display = this.isManualMode ? 'block' : 'none';
                if (this.switchButton) this.switchButton.style.display = 'block';
                this.controller = new AbortController();
            }
        }

        // 检查缓存是否有效
        isCacheValid(key, type) {
            const lastUpdate = this.cache.lastUpdate.get(`${type}_${key}`);
            return lastUpdate && (Date.now() - lastUpdate) < CONFIG.CACHE_EXPIRY;
        }

        // 从缓存获取数据
        getCachedData(key, type) {
            if (this.isCacheValid(key, type)) {
                return this.cache[type].get(key);
            }
            return null;
        }

        // 设置缓存数据
        setCacheData(key, type, data) {
            this.cache[type].set(key, data);
            this.cache.lastUpdate.set(`${type}_${key}`, Date.now());
        }

        async fetchUserInfoWithRetry(id, retryCount = 0) {
            // 先检查缓存
            const cachedData = this.getCachedData(id, 'userInfo');
            if (cachedData) {
                return cachedData;
            }

            try {
                const response = await this.fetchUserProfile(id);
                if (response?.data?.user) {
                    // 设置缓存
                    this.setCacheData(id, 'userInfo', response.data.user);
                    return response.data.user;
                }
                throw new Error('获取用户信息失败');
            } catch (error) {
                if (retryCount < CONFIG.MAX_RETRY) {
                    await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
                    return this.fetchUserInfoWithRetry(id, retryCount + 1);
                }
                throw error;
            }
        }

        async fetchWeiboDataWithRetry(id, retryCount = 0) {
            // 先检查缓存
            const cachedData = this.getCachedData(id, 'weiboData');
            if (cachedData) {
                return cachedData;
            }

            try {
                const response = await this.fetchWeiboData(id);
                if (response?.data?.list) {
                    // 设置缓存
                    this.setCacheData(id, 'weiboData', response);
                    return response;
                }
                throw new Error('获取微博数据失败');
            } catch (error) {
                if (retryCount < CONFIG.MAX_RETRY) {
                    await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
                    return this.fetchWeiboDataWithRetry(id, retryCount + 1);
                }
                return null;
            }
        }

        parseLastPost(weiboData) {
            if (!weiboData?.data?.list) return null;
            const validPosts = weiboData.data.list.filter(post => !post.isTop);
            return validPosts[0]?.created_at || null;
        }

        async getFollowersChange(uid, currentCount) {
            const key = `followers_${uid}`;
            const prevData = GM_getValue(key, null);

            // 如果没有历史数据，保存当前数据并返回"无"
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

            // 有历史数据，计算变化值
            const change = currentCount - prevData.count;

            // 更新数据
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
                // 隐藏手动输入相关元素
                if (this.manualTextarea) this.manualTextarea.style.display = 'none';
                if (this.switchButton) this.switchButton.style.display = 'none';

                this.failedPages = [];
                this.updateButtonText('正在获取总数...');
                this.totalFollows = await this.getTotalFollows();

                // 修改预估时间计算逻辑
                const totalPages = Math.ceil(this.totalFollows / CONFIG.PAGE_SIZE);
                const avgTimePerRequest = 3; // 每个请求平均3秒
                const concurrentRequests = CONFIG.MAX_CONCURRENT;
                const estimatedTime = Math.ceil((totalPages * avgTimePerRequest) / concurrentRequests);

                if (!confirm(`准备导出 ${this.totalFollows} 个关注，预计需要 ${estimatedTime} 秒（约${Math.ceil(estimatedTime/60)}分钟），继续吗？`)) {
                    this.isExporting = false;
                    this.updateButtonText('↓ 导出关注列表');
                    return;
                }

                this.updateButtonText('开始导出...');
                this.showProgressText();
                this.updateProgressText('正在准备数据...');

                // 添加初始进度显示
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
                this.updateButtonText('↓ 导出关注列表');
                this.hideProgressText();
                // 导出完成后重新显示手动输入相关元素
                if (this.manualTextarea) this.manualTextarea.style.display = this.isManualMode ? 'block' : 'none';
                if (this.switchButton) this.switchButton.style.display = 'block';
                this.controller = new AbortController();
            }
        }

        async getTotalFollows() {
            const data = await this.fetchAPI(1);
            if (!data || !data.total_number) throw new Error('无法获取关注总数');
            return data.total_number;
        }

        async fetchAllData(total) {
            const totalPage = Math.ceil(total / CONFIG.PAGE_SIZE);
            let result = [];
            let currentPage = 1;
            let processedCount = 0;
            let lastProgressUpdate = 0;

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
                                    // 立即更新进度
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

                // 减少延迟时间，让进度更新更快
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            result.sort((a, b) => a.order - b.order);
            return result;
        }

        async fetchWithRetry(page, retryCount = 0) {
            try {
                // 使用指数退避延迟
                const backoffDelay = Math.pow(2, retryCount) * 1000;
                await new Promise(r => setTimeout(r, backoffDelay));

                return await this.fetchAPI(page);
            } catch (error) {
                console.error(`第 ${page} 页尝试 ${retryCount + 1} 次失败：`, error);
                if (retryCount < CONFIG.MAX_RETRY) {
                    await new Promise(r => setTimeout(r, 2000 * (retryCount + 1)));
                    return this.fetchWithRetry(page, retryCount + 1);
                }
                this.failedPages.push(page);
                return { users: [] };
            }
        }

        async getLastPost(uid) {
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
            try {
                const data = await this.fetchUserProfile(uid);
                return data?.status?.created_at || null;
            } catch (error) {
                console.error('获取用户信息失败:', error);
                return null;
            }
        }

        normalizeTime(rawTime) {
            const mappings = {
                '今天': dayjs().format('YYYY-MM-DD'),
                '昨天': dayjs().subtract(1, 'day').format('YYYY-MM-DD')
            };
            Object.entries(mappings).forEach(([key, val]) => {
                rawTime = rawTime.replace(key, val);
            });
            return dayjs(rawTime).isValid() ? dayjs(rawTime).format('YYYY-MM-DD HH:mm:ss') : null;
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
            // 增加更随机的延迟策略
            const dynamicDelay = Math.random() * (CONFIG.MAX_DELAY - CONFIG.MIN_DELAY) + CONFIG.MIN_DELAY;
            await new Promise(r => setTimeout(r, dynamicDelay));

            const currentFollowers = user.followers_count;
            const followersChange = await this.getFollowersChange(user.idstr, currentFollowers);

            const [lastPost1, lastPost2] = await Promise.allSettled([
                this.getLastPost(user.idstr),
                this.getLastPostFromProfile(user.idstr)
            ]);

            const lastPost = [
                lastPost1.status === 'fulfilled' ? lastPost1.value : null,
                lastPost2.status === 'fulfilled' ? lastPost2.value : null
            ].find(t => t && dayjs(t).isValid());

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

            // 随机添加安全相关的请求头
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
            // 根据模式设置不同的文件名前缀
            const prefix = this.isManualMode ? '自填导出' : this.userId;
            const filename = `${prefix}-${timestamp}`;

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
            display: flex;
            align-items: center;
            gap: 5px;
            margin-right: 15px;
        }
        .follower-input {
            width: 50px; /* 缩小输入框宽度 */
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 12px;
            text-align: center;
            /* 移除上下箭头 */
            -moz-appearance: textfield;
        }
        .follower-input::-webkit-outer-spin-button,
        .follower-input::-webkit-inner-spin-button {
            -webkit-appearance: none; /* 移除Webkit浏览器的上下箭头 */
            margin: 0;
        }
        .follower-unit {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 12px;
            width: 50px;
        }
        .apply-btn {
            padding: 5px 10px;
            margin-left: 5px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .apply-btn:hover {
            background: #2980b9;
        }
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
            <!-- 修改后的粉丝数筛选控件：恢复单位选择 -->
            <div class="follower-filter">
                <input type="number" min="0" class="follower-input" id="minFollower" placeholder="最小值" oninput="applyCustomFilter()">
                <select class="follower-unit" id="minUnit" onchange="applyCustomFilter()">
                    <option value="1">个</option> <!-- 默认选择"个" -->
                    <option value="1000">千</option>
                    <option value="10000">万</option>
                </select>
                <span>-</span>
                <input type="number" min="0" class="follower-input" id="maxFollower" placeholder="最大值" oninput="applyCustomFilter()">
                <select class="follower-unit" id="maxUnit" onchange="applyCustomFilter()">
                    <option value="1000">千</option> <!-- 默认选择"千" -->
                    <option value="1">个</option>
                    <option value="10000">万</option>
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
                    // 有备注的排在前面，相同情况下按备注文本排序
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

        // 修改后的粉丝筛选函数：添加单位转换
        function applyCustomFilter() {
            const minInput = document.getElementById('minFollower').value;
            const maxInput = document.getElementById('maxFollower').value;
            const minUnit = parseInt(document.getElementById('minUnit').value) || 1;
            const maxUnit = parseInt(document.getElementById('maxUnit').value) || 1000;

            const min = minInput ? parseInt(minInput) * minUnit : 0;
            const max = maxInput ? parseInt(maxInput) * maxUnit : Number.MAX_SAFE_INTEGER;

            const rows = document.querySelectorAll('#followTable tbody tr');
            rows.forEach(row => {
                const followers = parseInt(row.querySelector('.followers').dataset.followers) || 0;
                const shouldShow = followers >= min && followers <= max;
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
            window.addEventListener('beforeunload', () => {
                if (this.isExporting) {
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

    // 在所有微博页面都初始化
    if (location.host.includes('weibo.com')) {
        const exporter = new WeiboFollowExporter();

        // 只在关注页面显示自动导出相关按钮
        if (!location.pathname.includes('/follow')) {
            if (exporter.exportButton) {
                exporter.exportButton.style.display = 'none';
            }
            if (exporter.progressText) {
                exporter.progressText.style.display = 'none';
            }
            // 默认为手动模式，但不显示输入框
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