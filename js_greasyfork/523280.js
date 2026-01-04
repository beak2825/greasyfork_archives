// ==UserScript==
// @name         OCFacilitation
// @name:zh-CN   OC协助工具
// @namespace    https://greasyfork.org/users/[daluo]
// @version      1.0.2.3
// @description  Make OC 2.0 easier for regular players
// @description:zh-CN  使普通玩家oc2.0更简单和方便
// @author       daluo
// @match        https://www.torn.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523280/OCFacilitation.user.js
// @updateURL https://update.greasyfork.org/scripts/523280/OCFacilitation.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const APIKey = "不使用冰蛙的大佬,替换成自己的apiKey,limit就可以";
    // =============== 配置管理 ===============
    const CONFIG = {
        API: {
            KEY: (() => {
                try {
                    // 尝试多种方式获取API Key
                    return localStorage.getItem("APIKey") || 
                           GM_getValue("APIKey")
                } catch (error) {
                    console.error('获取API Key失败:', error);
                    return APIKey
                }
            })(),
            URL: 'https://api.torn.com/v2/faction/crimes',
            PARAMS: { CATEGORY: 'available' }
        },
        UI: {
            LOAD_DELAY: 300,
            UPDATE_DEBOUNCE: 500,
            TIME_TOLERANCE: 2,
            SELECTORS: {
                WRAPPER: '.wrapper___U2Ap7',
                SLOTS: '.wrapper___Lpz_D',
                WAITING: '.waitingJoin___jq10k',
                TITLE: '.title___pB5FU',
                PANEL_TITLE: '.panelTitle___aoGuV',
                MOBILE_INFO: '.user-information-mobile___WjXnd'
            },
            STYLES: {
                URGENT: {
                    BORDER: '3px solid red',
                    COLOR: 'red'
                },
                STABLE: {
                    BORDER: '3px solid green',
                    COLOR: 'green'
                },
                EXCESS: {
                    BORDER: '3px solid yellow',
                    COLOR: 'blue'
                }
            }
        },
        TIME: {
            SECONDS_PER_DAY: 86400,
            HOURS_PER_DAY: 24,
            URGENT_THRESHOLD: 12,
            STABLE_THRESHOLD: 36
        }
    };

    // =============== 工具类 ===============
    class Utils {
        /**
         * 获取当前页签名称
         * @returns {string|null} 页签名称
         */
        static getCurrentTab() {
            const match = window.location.hash.match(/#\/tab=([^&]*)/);
            return match ? match[1] : null;
        }

        /**
         * 检查当前页面是否为OC页面
         * @returns {boolean}
         */
        static isOCPage() {
            return this.getCurrentTab() === 'crimes';
        }

        /**
         * 检查是否为移动端
         * @returns {boolean}
         */
        static isMobileDevice() {
            return document.querySelector(CONFIG.UI.SELECTORS.MOBILE_INFO) !== null;
        }

        /**
         * 获取当前时间戳（秒）
         * @returns {number}
         */
        static getNow() {
            return Math.floor(Date.now() / 1000);
        }

        /**
         * 防抖函数
         * @param {Function} func - 需要防抖的函数
         * @param {number} wait - 等待时间（毫秒）
         */
        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        /**
         * 检查URL是否包含factions.php
         * @returns {boolean} 是否为faction页面
         */
        static isFactionPage() {
            return window.location.pathname === '/factions.php';
        }

        static waitForElement(selector) {
            return new Promise(resolve => {
                const element = document.querySelector(selector);
                if (element) return resolve(element);

                const observer = new MutationObserver(mutations => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        resolve(element);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }

        static calculateTimeFromParts(days, hours, minutes, seconds) {
            return (days * CONFIG.TIME.SECONDS_PER_DAY) + 
                   (hours * 3600) + 
                   (minutes * 60) + 
                   seconds;
        }

        static async waitForWrapper() {
            const maxAttempts = 10;
            const interval = 1000; // 1秒

            for (let attempts = 0; attempts < maxAttempts; attempts++) {
                const wrapper = document.querySelector(CONFIG.UI.SELECTORS.WRAPPER);
                if (wrapper?.parentNode) {
                    return wrapper.parentNode;
                }
                await Utils.delay(interval);
            }
            throw new Error('无法找到wrapper元素');
        }

        static delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // =============== 数据模型 ===============
    /**
     * 任务物品需求类
     */
    class ItemRequirement {
        constructor(data) {
            this.id = data.id;
            this.is_reusable = data.is_reusable;
            this.is_available = data.is_available;
        }
    }

    /**
     * 用户信息类
     */
    class User {
        constructor(data) {
            if (!data) return null;
            this.id = data.id;
            this.joined_at = data.joined_at;
        }
    }

    /**
     * 任务槽位类
     */
    class Slot {
        constructor(data) {
            this.position = data.position;
            this.item_requirement = data.item_requirement ? new ItemRequirement(data.item_requirement) : null;
            this.user_id = data.user_id;
            this.user = data.user ? new User(data.user) : null;
            this.success_chance = data.success_chance;
        }

        /**
         * 检查槽位是否为空
         */
        isEmpty() {
            return this.user_id === null;
        }

        /**
         * 检查是否需要工具
         */
        requiresTool() {
            return this.item_requirement !== null;
        }
    }

    // 定义犯罪任务信息
    class Crime {
        constructor(data) {
            Object.assign(this, {
                id: data.id,
                name: data.name,
                difficulty: data.difficulty,
                status: data.status,
                created_at: data.created_at,
                initiated_at: data.initiated_at,
                ready_at: data.ready_at,
                expired_at: data.expired_at,
                slots: data.slots.map(slot => new Slot(slot)),
                rewards: data.rewards,
                element: null
            });
        }

        setElement(element) {
            this.element = element;
        }

        getSoltNum() {
            return this.slots.length;
        }

        getEmptycNum() {
            return this.slots.reduce((count, slot) => 
                count + (slot.user_id === null ? 1 : 0), 0);
        }

        getCurrentExtraTime() {
            if (this.ready_at === null) return 0;
            return this.ready_at - Utils.getNow();
        }

        getRunTime() {
            return Utils.getNow() - this.initiated_at;
        }

        // 判断crime是否缺人
        isMissingUser() {
            if (this.ready_at === null) return false;
            if (this.getCurrentExtraTime()/3600 <= CONFIG.TIME.URGENT_THRESHOLD && !this.isFullyStaffed()) {
                return true;
            }
            return false;
        }
        // 判断任务是否有人
        isUserd() {
            if (this.getEmptycNum() !== this.getSoltNum()) {
                return true;
            }
            return false;
        }

        // 判断任务是否满人
        isFullyStaffed() {
            if (this.getEmptycNum() == 0) {
                return true;
            }
            return false;
        }

        // 获取DOM信息  
        static getDOMInfo(element) {
            return {
                totalSlots: element.querySelectorAll(CONFIG.UI.SELECTORS.SLOTS).length,
                emptySlots: element.querySelectorAll(CONFIG.UI.SELECTORS.WAITING).length,
                timeElement: element.querySelector(CONFIG.UI.SELECTORS.TITLE)
            };
        }

        static calculateReadyAtTime(element) {
            const { timeElement, emptySlots } = this.getDOMInfo(element);
            const completionTimeStr = timeElement?.textContent?.trim();
            const completionTime = this.EstimateCompletionTime(completionTimeStr);
            return completionTime - emptySlots * CONFIG.TIME.SECONDS_PER_DAY;
        }

        static EstimateCompletionTime(timeStr) {
            if (!timeStr) return null;
            
            try {
                const [days, hours, minutes, seconds] = timeStr.split(':').map(Number);
                return Utils.getNow() + Utils.calculateTimeFromParts(days, hours, minutes, seconds);
            } catch (error) {
                console.error("计算完成时间失败:", error, timeStr);
                return null;
            }
        }
    }

    // =============== UI管理类 ===============
    class CrimeUIManager {
        /**
         * 更新所有犯罪任务的UI
         * @param {HTMLElement} crimeListContainer - 犯罪任务列表容器
         */
        static updateAllCrimesUI(crimeListContainer) {
            if (!crimeListContainer) return;

            // 获取所有crime元素并更新UI
            Array.from(crimeListContainer.children).forEach(element => {
                this.updateSingleCrimeUI(element);
            });
        }

        /**
         * 更新单个犯罪任务的UI
         * @param {HTMLElement} element - 犯罪任务元素
         */
        static updateSingleCrimeUI(element) {
            const crimeNameEl = element.querySelector(CONFIG.UI.SELECTORS.PANEL_TITLE);
            if (!crimeNameEl) return;

            // 获取DOM信息
            const { totalSlots, emptySlots } = Crime.getDOMInfo(element);
            const currentUsers = totalSlots - emptySlots;

            // 计算剩余时间
            const readyAt = Crime.calculateReadyAtTime(element);
            const now = Utils.getNow();
            const extraTimeHours = readyAt ? (readyAt - now) / 3600 : 0;

            // 清除旧的UI
            this.clearUI(element, crimeNameEl);
            
            // 添加新的状态信息
            if (currentUsers > 0) {
            this.addStatusInfo(element, crimeNameEl, {
                currentUsers,
                totalSlots,
                extraTimeHours,
                isFullyStaffed: emptySlots === 0
            });
        }
    }
        /**
         * 清除UI样式
         */
        static clearUI(element, crimeNameEl) {
            element.style.color = '';
            element.style.border = '';
            crimeNameEl.querySelectorAll('span[data-oc-ui]').forEach(span => span.remove());
        }

        /**
         * 添加状态信息
         */
        static addStatusInfo(element, crimeNameEl, stats) {
            const { currentUsers, totalSlots, extraTimeHours, isFullyStaffed } = stats;

            const statusSpan = document.createElement('span');
            statusSpan.setAttribute('data-oc-ui', 'status');
            statusSpan.textContent = `当前${currentUsers}人,共需${totalSlots}人。`;

            this.applyStatusStyle(element, statusSpan, extraTimeHours, isFullyStaffed);
            
            crimeNameEl.appendChild(document.createTextNode(' '));
            crimeNameEl.appendChild(statusSpan);
        }

        /**
         * 应用状态样式
         */
        static applyStatusStyle(element, statusSpan, extraTimeHours, isFullyStaffed) {
            // 基础样式
            statusSpan.style.padding = '4px 8px';
            statusSpan.style.borderRadius = '4px';
            statusSpan.style.fontWeight = '500';
            statusSpan.style.display = 'inline-block';
            statusSpan.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
            statusSpan.style.transition = 'all 0.2s ease';
            statusSpan.style.letterSpacing = '0.3px';

            // 检查是否为移动端
            const isMobile = document.querySelector('.user-information-mobile___WjXnd') !== null;
            statusSpan.style.fontSize = isMobile ? '10px' : '12px';

            if (extraTimeHours <= CONFIG.TIME.URGENT_THRESHOLD && !isFullyStaffed) {
                // 紧急状态
                element.style.border = CONFIG.UI.STYLES.URGENT.BORDER;
                statusSpan.style.background = 'linear-gradient(135deg, #ff4d4d 0%, #e60000 100%)';
                statusSpan.style.color = '#fff';
                statusSpan.style.border = '1px solid #cc0000';
                statusSpan.style.boxShadow = '0 1px 3px rgba(255,0,0,0.2)';
                
                const hours = Math.floor(extraTimeHours);
                const minutes = Math.floor((extraTimeHours % 1) * 60);
                statusSpan.innerHTML = isMobile 
                    ? `<span style="font-size:11px">⚠</span> ${hours}h${minutes}m`
                    : `<span style="font-size:14px;margin-right:4px">⚠</span>急需人手！还剩<strong style="font-weight:600">${hours}小时${minutes}分</strong>`;

            } else if (extraTimeHours <= CONFIG.TIME.STABLE_THRESHOLD) {
                // 稳定状态
                element.style.border = CONFIG.UI.STYLES.STABLE.BORDER;
                statusSpan.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                statusSpan.style.color = '#fff';
                statusSpan.style.border = '1px solid #3d8b40';
                statusSpan.style.boxShadow = '0 1px 3px rgba(0,255,0,0.1)';
                
                statusSpan.innerHTML = isMobile
                    ? `<span style="font-size:11px">✓</span> 配置正常`
                    : `<span style="font-size:14px;margin-right:4px">✓</span>人员配置合理`;

            } else {
                const extraUsers = Math.floor(extraTimeHours/24) - 1;
                if (extraUsers > 0) {
                    // 人员过剩状态
                    element.style.border = CONFIG.UI.STYLES.EXCESS.BORDER;
                    statusSpan.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
                    statusSpan.style.color = '#fff';
                    statusSpan.style.border = '1px solid #1565C0';
                    statusSpan.style.boxShadow = '0 1px 3px rgba(0,0,255,0.1)';
                    
                    statusSpan.innerHTML = isMobile
                        ? `<span style="font-size:11px">ℹ</span> 可调${extraUsers}人`
                        : `<span style="font-size:14px;margin-right:4px">ℹ</span>可调配 <strong style="font-weight:600">${extraUsers}</strong> 人至其他OC`;
                } else {
                    // 稳定状态
                    element.style.border = CONFIG.UI.STYLES.STABLE.BORDER;
                    statusSpan.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                    statusSpan.style.color = '#fff';
                    statusSpan.style.border = '1px solid #3d8b40';
                    statusSpan.style.boxShadow = '0 1px 3px rgba(0,255,0,0.1)';
                    
                    statusSpan.innerHTML = isMobile
                        ? `<span style="font-size:11px">✓</span> 配置正常`
                        : `<span style="font-size:14px;margin-right:4px">✓</span>人员配置合理`;
                }
            }

            // 添加悬停效果
            statusSpan.addEventListener('mouseover', () => {
                statusSpan.style.transform = 'translateY(-1px)';
                statusSpan.style.boxShadow = statusSpan.style.boxShadow.replace('3px', '4px');
            });

            statusSpan.addEventListener('mouseout', () => {
                statusSpan.style.transform = 'translateY(0)';
                statusSpan.style.boxShadow = statusSpan.style.boxShadow.replace('4px', '3px');
            });
        }
    }

    // =============== API管理类 ===============
    class APIManager {
        /**
         * 从API获取最新的犯罪数据
         * @returns {Promise<Object>} 犯罪数据
         */
        static async fetchCrimeData() {
            try {
                const response = await fetch(
                    `${CONFIG.API.URL}?key=${CONFIG.API.KEY}&cat=${CONFIG.API.PARAMS.CATEGORY}`
                );
                const data = await response.json();

                if (data.error) {
                    throw new Error(`API错误: ${data.error.error}`);
                }

                return {
                    crimes: data.crimes.map(crime => new Crime(crime)),
                    _metadata: data._metadata,
                    timestamp: Date.now()
                };
            } catch (error) {
                console.error('获取犯罪数据失败:', error);
                throw error;
            }
        }

        /**
         * 获取犯罪数据（优先使用缓存）
         * @returns {Promise<Object>} 犯罪数据
         */
        static async getCrimeData() {
            // 先尝试获取缓存的数据
            const cachedData = CacheManager.getCachedData();
            if (cachedData) {
                console.log('使用缓存的犯罪数据');
                return cachedData;  // 已经在getCachedData中重建了Crime对象
            }

            // 如果没有缓存或缓存过期，从API获取新数据
            console.log('从API获取新的犯罪数据');
            const newData = await this.fetchCrimeData();
            CacheManager.cacheData(newData);
            return newData;
        }

        /**
         * 从Torn API获取玩家基本信息
         * @returns {Promise<Object>} 玩家信息
         */
        static async fetchPlayerInfo() {
            try {
                const response = await fetch(`https://api.torn.com/user/?selections=basic&key=${CONFIG.API.KEY}`);
                const data = await response.json();
                if (data.error) {
                    throw new Error(`API错误: ${data.error.error}`);
                }

                return data;
            } catch (error) {
                console.error('获取玩家信息失败:', error);
                throw error;
            }
        }
    }

    // =============== 状态图标管理类 ===============
    class StatusIconManager {
        constructor(crimeInfo) {
            this.crimeInfo = crimeInfo;
        }

        /**
         * 检查是否为移动端
         * @returns {boolean}
         */
        isMobileDevice() {
            return document.querySelector('.user-information-mobile___WjXnd') !== null;
        }

        /**
         * 获取状态容器父元素
         * @returns {HTMLElement|null}
         */
        getStatusContainerParent() {
            if (this.isMobileDevice()) {
                return document.querySelector('.user-information-mobile___WjXnd');
            } else {
                return document.getElementsByClassName("status-icons___gPkXF")[0]?.parentNode;
            }
        }

        /**
         * 更新状态图标
         */
        updateStatusIcons(userId) {
            const containerParent = this.getStatusContainerParent();
            if (!containerParent) return;

            const ocStatusContainer = this.createStatusContainer();
            this.removeOldContainer();

            const userCrime = this.findUserCrime(userId);
            if (userCrime) {
                this.renderParticipatingStatus(ocStatusContainer, userCrime, userId);
            } else {
                this.renderNonParticipatingStatus(ocStatusContainer, userId);
            }

            // 移动端时添加额外的样式
            if (this.isMobileDevice()) {
                ocStatusContainer.style.margin = '10px 15px';
                ocStatusContainer.style.width = 'calc(100% - 30px)'; // 考虑左右margin
            }

            containerParent.appendChild(ocStatusContainer);
        }

        /**
         * 查找用户参与的犯罪任务
         */
        findUserCrime(userId) {
            return this.crimeInfo.crimes.find(crime => 
                crime.slots.some(slot => slot.user_id === userId)
            );
        }

        /**
         * 创建状态容器
         */
        createStatusContainer() {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.marginTop = '10px';
            container.id = 'oc-status-container';
            return container;
        }

        /**
         * 移除旧的状态容器
         */
        removeOldContainer() {
            const oldContainer = document.getElementById('oc-status-container');
            if (oldContainer) {
                oldContainer.remove();
            }
        }

        /**
         * 渲染参与中的状态
         */
        renderParticipatingStatus(container, userCrime, userId) {
            const slotIcons = this.createSlotIconsContainer();
            
            // 添加点击事件，跳转到对应的OC任务
            slotIcons.style.cursor = 'pointer';
            slotIcons.addEventListener('click', () => {
                window.location.href = `https://www.torn.com/factions.php?step=your#/tab=crimes&crimeId=${userCrime.id}`;
            });

            userCrime.slots.forEach(slot => {
                const icon = this.createSlotIcon(slot, userId);
                slotIcons.appendChild(icon);
            });
            container.appendChild(slotIcons);
        }

        /**
         * 渲染未参与的状态
         */
        renderNonParticipatingStatus(container, userId) {
            const notInOCContainer = this.createNotInOCContainer();
            const textSpan = this.createTextSpan();
            const targetCrime = this.findBestAvailableCrime();
            const joinLink = this.createJoinLink(targetCrime?.id || '', userId);

            notInOCContainer.appendChild(textSpan);
            notInOCContainer.appendChild(joinLink);
            container.appendChild(notInOCContainer);
        }

        /**
         * 创建slot图标容器
         */
        createSlotIconsContainer() {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.height = '17px';
            container.style.cursor = 'pointer';
            
            // 添加渐变背景和质感效果
            container.style.background = 'linear-gradient(to bottom, rgba(30,30,30,0.02) 0%, rgba(0,0,0,0.02) 100%)';
            container.style.border = '1px solid rgba(128, 128, 128, 0.2)';
            container.style.borderRadius = '3px';
            container.style.padding = '3px 5px 3px 0px';
            container.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.02)';
            
            // 添加悬停效果
            container.addEventListener('mouseover', () => {
                container.style.background = 'linear-gradient(to bottom, rgba(30,30,30,0.04) 0%, rgba(0,0,0,0.04) 100%)';
                container.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.03)';
                container.style.transition = 'all 0.2s ease';
            });

            container.addEventListener('mouseout', () => {
                container.style.background = 'linear-gradient(to bottom, rgba(30,30,30,0.02) 0%, rgba(0,0,0,0.02) 100%)';
                container.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.02)';
            });

            return container;
        }

        /**
         * 创建slot图标
         */
        createSlotIcon(slot, userId) {
            const icon = document.createElement('div');
            icon.style.width = '17px';
            icon.style.height = '17px';
            icon.style.borderRadius = '50%';
            icon.style.margin = '5px 10px 5px 0px';
            icon.style.boxSizing = 'border-box';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.position = 'relative';
            
            // 添加渐变和阴影效果
            if (slot.user) {
                // 已加入状态 - 绿色渐变
                icon.style.background = 'linear-gradient(135deg, #5cb85c 0%, #4CAF50 100%)';
                icon.style.border = '1px solid #45a049';
                icon.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.1)';
            } else {
                // 空位状态 - 灰色渐变
                icon.style.background = 'linear-gradient(135deg, #a4a4a4 0%, #9E9E9E 100%)';
                icon.style.border = '1px solid #888';
                icon.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.1)';
            }

            let progressInfo = '';
            if (slot.user) {
                progressInfo = `${slot.user_id} 在这`;
                if (slot.user_id === userId) {
                    this.addPlayerMarker(icon);
                }
            } else {
                progressInfo = '空位';
            }

            if (slot.item_requirement) {
                this.addToolMark(icon);
                progressInfo += '\n需要工具';
            }

            icon.title = progressInfo;

            // 添加悬停效果
            icon.addEventListener('mouseover', () => {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'all 0.2s ease';
                icon.style.boxShadow = slot.user 
                    ? 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)'
                    : 'inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.2)';
            });

            icon.addEventListener('mouseout', () => {
                icon.style.transform = 'scale(1)';
                icon.style.boxShadow = slot.user
                    ? 'inset 0 1px 1px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.1)'
                    : 'inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.1)';
            });

            // 创建自定义tooltip
            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.visibility = 'hidden';
            tooltip.style.backgroundColor = 'rgba(40, 40, 40, 0.95)';
            tooltip.style.color = '#fff';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.lineHeight = '1.4';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            tooltip.style.transform = 'translateY(-5px)';
            tooltip.style.transition = 'all 0.2s ease';

            // 设置tooltip内容
            let tooltipContent = slot.user 
                ? `<div style="font-weight:500">${slot.user_id} 在这</div>`
                : '<div style="color:#aaa">空位</div>';
            
            if (slot.item_requirement) {
                tooltipContent += `
                    <div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.1)">
                        <span style="color:#FFA000">⚠</span> 需要工具
                    </div>`;
            }
            tooltip.innerHTML = tooltipContent;

            // 添加tooltip显示/隐藏逻辑
            icon.addEventListener('mouseenter', (e) => {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
                
                // 计算位置
                const rect = icon.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            });

            icon.addEventListener('mouseleave', () => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-5px)';
            });

            document.body.appendChild(tooltip);
            icon.title = ''; // 移除默认tooltip
            return icon;
        }

        /**
         * 添加玩家标记
         */
        addPlayerMarker(icon) {
            const marker = document.createElement('span');
            marker.innerHTML = '★';
            marker.style.color = 'white';
            marker.style.fontSize = '10px';
            marker.style.textShadow = '0 0 1px #000';
            icon.appendChild(marker);
        }

        /**
         * 添加工具标记
         */
        addToolMark(icon) {
            const toolMark = document.createElement('div');
            toolMark.style.position = 'absolute';
            toolMark.style.bottom = '0';
            toolMark.style.right = '0';
            toolMark.style.width = '6px';
            toolMark.style.height = '6px';
            toolMark.style.backgroundColor = '#FFC107';
            toolMark.style.borderRadius = '50%';
            toolMark.style.border = '1px solid #FFA000';
            toolMark.style.transform = 'translate(25%, 25%)';
            icon.appendChild(toolMark);
        }

        /**
         * 创建未参加OC的容器
         */
        createNotInOCContainer() {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '5px';
            container.style.backgroundColor = '#F44336';
            container.style.padding = '3px 8px';
            container.style.borderRadius = '3px';
            container.style.marginBottom = '10px';
            return container;
        }

        /**
         * 创建提示文本
         */
        createTextSpan() {
            const textSpan = document.createElement('span');
            textSpan.textContent = '未加入oc，';
            textSpan.style.fontSize = '12px';
            textSpan.style.color = 'white';
            return textSpan;
        }

        /**
         * 查找最佳可用的犯罪任务
         */
        findBestAvailableCrime() {
            let targetCrime = this.crimeInfo.crimes.find(crime => 
                crime.isMissingUser()
            );

            if (!targetCrime) {
                const emptyCrimes = this.crimeInfo.crimes.filter(crime => 
                    !crime.isUserd()
                );

                if (emptyCrimes.length > 0) {
                    targetCrime = emptyCrimes.reduce((highest, current) => 
                        current.difficulty > highest.difficulty ? current : highest
                    );
                } else {
                    const availableCrimes = this.crimeInfo.crimes.filter(crime => 
                        crime.slots.some(slot => !slot.user)
                    );
                    targetCrime = availableCrimes.reduce((highest, current) => 
                        current.difficulty > highest.difficulty ? current : highest
                    );
                }
            }

            return targetCrime;
        }

        /**
         * 创建加入链接
         */
        createJoinLink(crimeId, userId) {
            const joinLink = document.createElement('a');
            joinLink.textContent = 'join';
            joinLink.href = `https://www.torn.com/factions.php?step=your#/tab=crimes&crimeId=${crimeId}`;
            joinLink.style.color = 'white';
            joinLink.style.textDecoration = 'underline';
            joinLink.style.fontSize = '13px';
            joinLink.style.fontWeight = 'bold';
            joinLink.style.textShadow = '0 0 1px rgba(255, 255, 255, 0.5)';
            joinLink.style.letterSpacing = '0.5px';

            this.addJoinLinkEffects(joinLink, userId);
            return joinLink;
        }

        /**
         * 添加加入链接效果
         */
        addJoinLinkEffects(joinLink, userId) {
            joinLink.addEventListener('mouseover', () => {
                joinLink.style.textShadow = '0 0 2px rgba(255, 255, 255, 0.8)';
                joinLink.style.transition = 'all 0.2s ease';
            });

            joinLink.addEventListener('mouseout', () => {
                joinLink.style.textShadow = '0 0 1px rgba(255, 255, 255, 0.5)';
            });

            joinLink.addEventListener('click', async () => {
                try {
                    const newData = await APIManager.fetchCrimeData();
                    this.crimeInfo = newData;
                    const playerInfo = await APIManager.fetchPlayerInfo();
                    this.updateStatusIcons(playerInfo.player_id);
                } catch (error) {
                    console.error('更新OC数据失败:', error);
                }
            });
        }
    }

    // =============== 主程序类 ===============
    class OCFacilitation {
        constructor() {
            this.crimeInfo = null;
            this.currentTab = null;
            this.isInitialized = false;
            this.isUpdating = false;
            this.observer = null;
            this.statusIconManager = null;
        }

        /**
         * 处理页面变化
         */
        async handlePageChange() {
            if (!Utils.isFactionPage() || !Utils.isOCPage()) {
                this.cleanup();
                return;
            }

            try {
                if (!this.crimeInfo) {
                    this.crimeInfo = await APIManager.fetchCrimeData();
                }
                
                const container = await Utils.waitForWrapper();
                await this.handleInitialUIUpdate(container);
                
                // 如果还没有设置观察器，设置它
                if (!this.observer) {
                    this.setupObserver(container);
                }
            } catch (error) {
                console.error('处理页面变化失败:', error);
            }
        }

        /**
         * 处理初始UI更新
         * @param {HTMLElement} container - 犯罪任务列表容器
         */
        async handleInitialUIUpdate(container) {
            await new Promise(resolve => setTimeout(resolve, CONFIG.UI.LOAD_DELAY));
            await this.updateCrimeListUI(container);
        }

        /**
         * 更新犯罪任务列表UI
         * @param {HTMLElement} container - 犯罪任务列表容器
         */
        async updateCrimeListUI(container) {
            if (this.isUpdating) return;

            try {
                this.isUpdating = true;
                CrimeUIManager.updateAllCrimesUI(container);
            } finally {
                this.isUpdating = false;
            }
        }

        /**
         * 设置观察器
         * @param {HTMLElement} container - 犯罪任务列表容器
         */
        setupObserver(container) {
            this.observer = new MutationObserver(Utils.debounce((mutations) => {
                const hasChildrenChanges = mutations.some(mutation => 
                    mutation.type === 'childList' && 
                    mutation.target === container
                );

                if (hasChildrenChanges) {
                    this.updateCrimeListUI(container)
                        .catch(error => console.error('更新犯罪任务UI失败:', error));
                }
            }, CONFIG.UI.UPDATE_DEBOUNCE));

            this.observer.observe(container, {
                childList: true,
                subtree: false,
                attributes: false,
                characterData: false
            });
        }

        /**
         * 清理资源
         */
        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            this.isUpdating = false;
        }

        /**
         * 初始化程序
         */
        async initialize() {
            try {
                await this.initializeData();
                await this.setupStatusIcons();
                await this.setupPageChangeListeners();
                
                this.isInitialized = true;
            } catch (error) {
                console.error('初始化失败:', error);
            }
        }

        /**
         * 初始化数据
         */
        async initializeData() {
            // 直接从API获取新数据
            this.crimeInfo = await APIManager.fetchCrimeData();
            this.statusIconManager = new StatusIconManager(this.crimeInfo);
        }

        /**
         * 设置UI
         */
        async setupStatusIcons() {
            // 获取玩家信息并更新状态图标
            const playerInfo = await APIManager.fetchPlayerInfo();
            this.statusIconManager.updateStatusIcons(playerInfo.player_id);
        }

        /**
         * 设置页面变化监听器
         */
        setupPageChangeListeners() {
            // 监听hash变化（页签切换）
            window.addEventListener('hashchange', () => this.handlePageChange());
            
            // 监听页面加载完成
            if (document.readyState === 'complete') {
                this.handlePageChange();
            } else {
                window.addEventListener('load', () => this.handlePageChange());
            }
        }
    }

    // 启动程序
    (() => {
        const app = new OCFacilitation();
        app.initialize();
        
        // 页面卸载时清理资源
        window.addEventListener('unload', () => {
            app.cleanup();
        });
    })();
})();
