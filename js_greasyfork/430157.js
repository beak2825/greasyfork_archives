// ==UserScript==
// @name         百度贴吧广告过滤登录去除（优化版）
// @namespace    noting
// @version      0.8.12
// @description  贴吧广告过滤,自动关闭登录弹窗，解决广告闪烁问题
// @author       Time
// @match        *://tieba.baidu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430157/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E7%99%BB%E5%BD%95%E5%8E%BB%E9%99%A4%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/430157/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E7%99%BB%E5%BD%95%E5%8E%BB%E9%99%A4%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const options = {
        expensionName: "百度贴吧广告过滤登录去除",
        interval: 500,
        development: false,
        isDomRemove: false,
        showAds: false,
        isCollapsed: false,
        matchingHost: "tieba.baidu.com",
        loginDomId: "tiebaCustomPassLogin",
        adTextClass: "label_text",
        adText: "广告",
        feedbackEmail: "tieba-filter-feedback@example.com",
        storageKey: "tiebaAdFilterPanelPosition",
        collapseStorageKey: "tiebaAdFilterPanelCollapsed",
        blockListStorageKey: "tiebaBlockedUsers",
        adIds: [
            "pagelet_frs-aside/pagelet/fengchao_ad",
            "banner_pb_customize",
            "plat_recom_carousel"
        ],
        scoringText:"如果觉得好用麻烦在油猴给个好评亲！！！",
        adClasses: [
            "fengchao-wrap-feed",
            "head_banner",
            "head_ad_pop",
            "l_banner",
            "j_couplet",
            "card_banner",
            "bus-top-activity-wrap",
            "rec_left",
            "ylh-ad-container"
        ],
        userSelectors: {
            threadAuthor: '.p_author_name',
            replyAuthor: '.d_name',
            threadContainer: '.j_thread_list',
            replyContainer: '.l_post'
        },
        page:{
            container:"pb_list_pager",
            down:"下一页",
            up:"上一页"
        },
        panelStyle: {
            width: "240px",
            minHeight: "400px",
            collapsedHeight: "45px",
            top: "120px",
            left: "15px",
            zIndex: 9999,
            border: "1px solid #e5e7eb",
            borderColor: "#e5e7eb",
            bgColor: "#ffffff",
            shadow: "0 4px 12px rgba(0,0,0,0.08)",
            headerBg: "#2563eb",
            headerColor: "#ffffff",
            textColor: "#374151",
            subTextColor: "#6b7280",
            checkboxSize: "16px",
            btnBg: "#f3f4f6",
            btnHoverBg: "#e5e7eb",
            btnRadius: "4px",
            marginBottom: "12px",
            padding: "12px"
        },
        // 防闪烁配置
        preHideStyle: 'display: none !important; visibility: hidden !important;',
        mutationObserverOptions: {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: false
        },
        preBlockSelectors: [
            'div[id^="fengchao_"]',
            'div[class*="ad-"]',
            'div[class*="banner"]',
            'div[class*="ads"]',
            'div[class*="promotion"]',
            'div[data-ad]',
            'iframe[src*="ad"]',
            'img[src*="ad"]'
        ]
    };

    // 工具函数 - 日志输出
    const logger = {
        log: (...args) => {
            if (options.development) {
                console.log(`[${options.expensionName}]`, ...args);
            }
        },
        error: (...args) => {
            console.error(`[${options.expensionName}]`, ...args);
        }
    };

    // 样式工具 - 处理预隐藏样式
    const StyleUtil = {
        // 提前注入全局隐藏样式
        injectPreHideStyles() {
            try {
                // 检查是否已注入
                if (document.getElementById('ad-pre-hide-style')) return;

                const style = document.createElement('style');
                style.id = 'ad-pre-hide-style';
                style.textContent = `
                    /* 预隐藏已知广告容器 */
                    #${options.loginDomId},
                    ${options.adIds.map(id => `#${id.replace(/\//g, '\\/')}`).join(',')},
                    ${options.adClasses.map(cls => `.${cls}`).join(',')},
                    ${options.preBlockSelectors.join(',')},
                    [data-ad-type], [ad-data], [ad-type], [data-ads] {
                        ${options.preHideStyle}
                    }
                `;
                // 优先插入到head最前面
                if (document.head.firstChild) {
                    document.head.insertBefore(style, document.head.firstChild);
                } else {
                    document.head.appendChild(style);
                }
            } catch (ex) {
                logger.error("注入预隐藏样式失败:", ex);
            }
        },

        // 为单个元素添加预隐藏样式
        preHideElement(element) {
            if (!element || element.hasAttribute('data-ad-pre-hidden')) return;
            try {
                element.setAttribute('data-ad-pre-hidden', 'true');
                // 直接设置style，优先级最高
                element.style.cssText = options.preHideStyle + element.style.cssText;
            } catch (ex) {
                logger.error("预隐藏元素失败:", ex);
            }
        }
    };

    // 存储工具
    const StorageUtil = {
        savePosition: (position) => {
            try {
                const data = {
                    top: position.top,
                    left: position.left,
                    timestamp: Date.now()
                };
                localStorage.setItem(options.storageKey, JSON.stringify(data));
            } catch (ex) {
                logger.error("保存面板位置失败:", ex);
            }
        },

        getPosition: () => {
            try {
                const data = localStorage.getItem(options.storageKey);
                if (data) {
                    return JSON.parse(data);
                }
                return null;
            } catch (ex) {
                logger.error("获取面板位置失败:", ex);
                return null;
            }
        },

        saveCollapsedState: (isCollapsed) => {
            try {
                localStorage.setItem(options.collapseStorageKey, JSON.stringify({
                    isCollapsed,
                    timestamp: Date.now()
                }));
            } catch (ex) {
                logger.error("保存折叠状态失败:", ex);
            }
        },

        getCollapsedState: () => {
            try {
                const data = localStorage.getItem(options.collapseStorageKey);
                if (data) {
                    return JSON.parse(data);
                }
                return { isCollapsed: options.isCollapsed };
            } catch (ex) {
                logger.error("获取折叠状态失败:", ex);
                return { isCollapsed: options.isCollapsed };
            }
        },

        saveBlockedUsers: (users) => {
            try {
                localStorage.setItem(options.blockListStorageKey, JSON.stringify({
                    users: Array.from(users),
                    timestamp: Date.now()
                }));
            } catch (ex) {
                logger.error("保存屏蔽用户失败:", ex);
            }
        },

        getBlockedUsers: () => {
            try {
                const data = localStorage.getItem(options.blockListStorageKey);
                if (data) {
                    const parsed = JSON.parse(data);
                    return new Set(parsed.users || []);
                }
                return new Set();
            } catch (ex) {
                logger.error("获取屏蔽用户失败:", ex);
                return new Set();
            }
        }
    };

    // 广告管理模块（优化防闪烁）
    const AdManager = {
        detectedAds: new Set(),
        processedElements: new WeakSet(),

        immediateHide(element) {
            if (!element || this.processedElements.has(element)) return;

            try {
                this.processedElements.add(element);
                StyleUtil.preHideElement(element);
                element.classList.add('ad-filter-hidden');
                element.setAttribute('data-ad-hidden', 'true');
            } catch (ex) {
                logger.error("立即隐藏元素失败:", ex);
            }
        },

        isAdDetected: (element) => {
            return AdManager.detectedAds.has(element);
        },

        addAdElement(element) {
            if (!element || this.detectedAds.has(element) || !document.body.contains(element)) return;

            try {
                this.immediateHide(element);
                this.detectedAds.add(element);

                const observer = new MutationObserver((mutations) => {
                    if (!document.body.contains(element)) {
                        this.detectedAds.delete(element);
                        observer.disconnect();
                        return;
                    }

                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' &&
                           (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                            // 检查元素是否被重新显示
                            if (element.style.display !== 'none' || !element.classList.contains('ad-filter-hidden')) {
                                this.immediateHide(element);
                            }
                        }
                    });
                });

                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            } catch (ex) {
                logger.error("添加广告元素失败:", ex);
            }
        },

        handleAdElement: (element) => {
            if (!element || !element.style) return;

            try {
                if (options.showAds) {
                    element.style.display = "";
                    element.style.visibility = "";
                } else {
                    if (options.isDomRemove) {
                        if (document.body.contains(element)) {
                            element.remove();
                        }
                        this.detectedAds.delete(element);
                    } else if (element.style.display !== "none") {
                        this.immediateHide(element);
                    }
                }
            } catch (ex) {
                logger.error("处理广告元素出错:", ex);
            }
        },

        handleAllAds: () => {
            this.detectedAds.forEach(element => {
                this.handleAdElement(element);
            });
        },

        batchProcessElements(elements) {
            if (!elements || elements.length === 0) return;
            Array.from(elements).forEach(el => {
                this.addAdElement(el);
            });
        }
    };

    // 用户屏蔽模块
    const UserBlocker = {
        blockedUsers: StorageUtil.getBlockedUsers(),
        blockedElements: new Set(),

        addUser: (username) => {
            if (!username || UserBlocker.blockedUsers.has(username)) return false;

            UserBlocker.blockedUsers.add(username);
            StorageUtil.saveBlockedUsers(UserBlocker.blockedUsers);
            UserBlocker.detectAndBlock();
            return true;
        },

        removeUser: (username) => {
            if (!username || !UserBlocker.blockedUsers.has(username)) return false;

            UserBlocker.blockedUsers.delete(username);
            StorageUtil.saveBlockedUsers(UserBlocker.blockedUsers);
            UserBlocker.showBlockedElements(username);
            return true;
        },

        detectAndBlock: () => {
            if (UserBlocker.blockedUsers.size === 0) return;

            try {
                // 处理帖子
                const threadAuthors = document.querySelectorAll(options.userSelectors.threadAuthor);
                threadAuthors.forEach(authorEl => {
                    const username = authorEl.textContent.trim();
                    if (UserBlocker.blockedUsers.has(username)) {
                        const threadEl = authorEl.closest(options.userSelectors.threadContainer);
                        if (threadEl && !UserBlocker.blockedElements.has(threadEl)) {
                            UserBlocker.blockElement(threadEl, username, 'thread');
                        }
                    }
                });

                // 处理回复
                const replyAuthors = document.querySelectorAll(options.userSelectors.replyAuthor);
                replyAuthors.forEach(authorEl => {
                    const username = authorEl.textContent.trim();
                    if (UserBlocker.blockedUsers.has(username)) {
                        const replyEl = authorEl.closest(options.userSelectors.replyContainer);
                        if (replyEl && !UserBlocker.blockedElements.has(replyEl)) {
                            UserBlocker.blockElement(replyEl, username, 'reply');
                        }
                    }
                });
            } catch (ex) {
                logger.error("检测并屏蔽用户内容失败:", ex);
            }
        },

        blockElement: (element, username, type) => {
            if (!element) return;

            try {
                element.__originalDisplay = element.style.display;
                element.__blockedBy = username;
                element.__blockedType = type;
                element.style.display = "none";
                UserBlocker.blockedElements.add(element);
                logger.log(`已屏蔽${type === 'thread' ? '帖子' : '回复'} (作者: ${username})`);
            } catch (ex) {
                logger.error("屏蔽元素失败:", ex);
            }
        },

        showBlockedElements: (username) => {
            UserBlocker.blockedElements.forEach(element => {
                if (element.__blockedBy === username) {
                    try {
                        element.style.display = element.__originalDisplay || "";
                        UserBlocker.blockedElements.delete(element);
                    } catch (ex) {
                        logger.error("显示被屏蔽元素失败:", ex);
                    }
                }
            });
        },

        getBlockedList: () => {
            return Array.from(UserBlocker.blockedUsers);
        },

        clearAll: () => {
            const users = UserBlocker.getBlockedList();
            users.forEach(username => {
                UserBlocker.removeUser(username);
            });
        }
    };

    // 检测器模块
    const Detector = {
        highPriorityObserver: null,

        initHighPriorityDetector() {
            try {
                this.detectAndHideExistingAds();

                this.highPriorityObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;

                            if (this.isAdNode(node)) {
                                AdManager.immediateHide(node);
                                AdManager.addAdElement(node);
                            } else {
                                this.findAdsInSubtree(node);
                            }
                        });
                    });
                });

                this.highPriorityObserver.observe(document.documentElement, options.mutationObserverOptions);
                return this.highPriorityObserver;
            } catch (ex) {
                logger.error("初始化高优先级检测器失败:", ex);
                return null;
            }
        },

        isAdNode(node) {
            try {
                if (options.adIds.includes(node.id)) return true;

                const classList = Array.from(node.classList);
                if (classList.some(cls => options.adClasses.includes(cls))) return true;

                if (node.classList.contains(options.adTextClass) &&
                    node.innerText.trim() === options.adText) return true;

                return options.preBlockSelectors.some(selector => {
                    try {
                        return node.matches(selector);
                    } catch (e) {
                        return false;
                    }
                });
            } catch (ex) {
                logger.error("检查广告节点失败:", ex);
                return false;
            }
        },

        findAdsInSubtree(node) {
            try {
                // 检查登录弹窗
                const loginEl = node.querySelector(`#${options.loginDomId}`);
                if (loginEl) AdManager.addAdElement(loginEl);

                // 检查广告id
                options.adIds.forEach(id => {
                    const el = node.querySelector(`#${id.replace(/\//g, '\\/')}`);
                    if (el) AdManager.addAdElement(el);
                });

                // 检查广告类名
                options.adClasses.forEach(cls => {
                    const els = node.getElementsByClassName(cls);
                    AdManager.batchProcessElements(els);
                });

                // 检查广告文本标记
                const adTextEls = node.getElementsByClassName(options.adTextClass);
                Array.from(adTextEls).forEach(el => {
                    if (el.innerText.trim() === options.adText) {
                        const adContainer = el.closest('div, section, article');
                        if (adContainer) AdManager.addAdElement(adContainer);
                    }
                });
            } catch (ex) {
                logger.error("在子树中查找广告失败:", ex);
            }
        },

        detectAndHideExistingAds() {
            try {
                // 处理登录弹窗
                const loginEl = document.getElementById(options.loginDomId);
                if (loginEl) AdManager.addAdElement(loginEl);

                // 处理id广告
                options.adIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) AdManager.addAdElement(el);
                });

                // 处理类名广告
                options.adClasses.forEach(cls => {
                    const els = document.getElementsByClassName(cls);
                    AdManager.batchProcessElements(els);
                });

                // 处理文本标记广告
                const adTextEls = document.getElementsByClassName(options.adTextClass);
                Array.from(adTextEls).forEach(el => {
                    if (el.innerText.trim() === options.adText) {
                        const adContainer = el.closest('div, section, article');
                        if (adContainer) AdManager.addAdElement(adContainer);
                    }
                });
            } catch (ex) {
                logger.error("检测并隐藏现有广告失败:", ex);
            }
        },

        detectAll() {
            this.detectAndHideExistingAds();
            UserBlocker.detectAndBlock();
        }
    };

    // 分页工具模块
    const PaginationTool = {
        findPageLink: (targetText) => {
            try {
                const pagerContainer = document.getElementsByClassName(options.page.container)[0];
                if (!pagerContainer) {
                    logger.log("未找到分页容器");
                    return null;
                }

                const linkElements = pagerContainer.getElementsByTagName('a');
                for (let link of linkElements) {
                    if (link.textContent.trim() === targetText) {
                        return link;
                    }
                }

                logger.log(`未找到文本为"${targetText}"的链接`);
                return null;
            } catch (ex) {
                logger.error("查找分页链接出错:", ex);
                return null;
            }
        },

        triggerPageClick: (targetText) => {
            const targetLink = PaginationTool.findPageLink(targetText);
            if (targetLink) {
                try {
                    targetLink.click();
                    logger.log(`已触发"${targetText}"点击`);
                    return true;
                } catch (ex) {
                    logger.error("触发分页点击失败:", ex);
                }
            }
            return false;
        },

        updateButtonStates: (prevBtn, nextBtn) => {
            try {
                const hasPrev = PaginationTool.findPageLink(options.page.up) !== null;
                prevBtn.disabled = !hasPrev;
                prevBtn.style.opacity = hasPrev ? "1" : "0.6";
                prevBtn.style.cursor = hasPrev ? "pointer" : "not-allowed";

                const hasNext = PaginationTool.findPageLink(options.page.down) !== null;
                nextBtn.disabled = !hasNext;
                nextBtn.style.opacity = hasNext ? "1" : "0.6";
                nextBtn.style.cursor = hasNext ? "pointer" : "not-allowed";
            } catch (ex) {
                logger.error("更新分页按钮状态失败:", ex);
            }
        }
    };

    // 控制面板模块
    const ControlPanel = {
        panelElement: null,
        contentElement: null,
        collapseButton: null,
        isProgrammaticMove: false,
        blockedUsersListEl: null,
        blockUserInput: null,

        createPanel: () => {
            try {
                const savedCollapseState = StorageUtil.getCollapsedState();
                options.isCollapsed = savedCollapseState.isCollapsed;

                // 创建面板容器
                const panel = document.createElement("div");
                panel.id = "ad-filter-panel";

                const savedPos = StorageUtil.getPosition();
                const topPos = savedPos ? `${savedPos.top}px` : options.panelStyle.top;
                const leftPos = savedPos ? `${savedPos.left}px` : options.panelStyle.left;

                panel.style.cssText = `
                    position: fixed;
                    width: ${options.panelStyle.width};
                    min-height: ${options.isCollapsed ? options.panelStyle.collapsedHeight : options.panelStyle.minHeight};
                    height: auto;
                    top: ${topPos};
                    left: ${leftPos};
                    z-index: ${options.panelStyle.zIndex};
                    border: ${options.panelStyle.border};
                    border-radius: 6px;
                    background-color: ${options.panelStyle.bgColor};
                    box-shadow: ${options.panelStyle.shadow};
                    overflow: hidden;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    transition: all 0.2s ease;
                `;

                // 面板头部
                const header = document.createElement("div");
                header.className = "panel-header";
                header.style.cssText = `
                    padding: ${options.panelStyle.padding};
                    background-color: ${options.panelStyle.headerBg};
                    color: ${options.panelStyle.headerColor};
                    font-size: 15px;
                    font-weight: 500;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;

                // 折叠/展开按钮
                const collapseBtn = document.createElement("button");
                collapseBtn.id = "collapse-btn";
                collapseBtn.innerHTML = options.isCollapsed ? "▷" : "▽";
                collapseBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: ${options.panelStyle.headerColor};
                    font-size: 16px;
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    opacity: 0.9;
                    transition: transform 0.2s ease;
                `;
                collapseBtn.title = options.isCollapsed ? "展开面板" : "折叠面板";
                ControlPanel.collapseButton = collapseBtn;

                header.innerHTML = `
                    <span>${options.expensionName}</span>
                    <span class="panel-version" style="font-size: 12px; opacity: 0.9;">v0.8.12</span>
                `;
                header.appendChild(collapseBtn);

                // 面板内容区
                const content = document.createElement("div");
                content.className = "panel-content";
                content.style.cssText = `
                    padding: ${options.panelStyle.padding};
                    color: ${options.panelStyle.textColor};
                    font-size: 14px;
                    display: ${options.isCollapsed ? "none" : "block"};
                    transition: all 0.2s ease;
                `;
                ControlPanel.contentElement = content;

                // 广告显示/隐藏开关
                const adToggleGroup = document.createElement("div");
                adToggleGroup.style.cssText = `
                    display: flex;
                    align-items: center;
                    margin-bottom: ${options.panelStyle.marginBottom};
                    padding-bottom: ${options.panelStyle.marginBottom};
                    border-bottom: 1px solid #f3f4f6;
                `;
                const adToggle = document.createElement("input");
                adToggle.type = "checkbox";
                adToggle.id = "ad-toggle";
                adToggle.checked = options.showAds;
                adToggle.style.cssText = `
                    width: ${options.panelStyle.checkboxSize};
                    height: ${options.panelStyle.checkboxSize};
                    margin-right: 8px;
                    cursor: pointer;
                `;
                const adToggleLabel = document.createElement("label");
                adToggleLabel.htmlFor = "ad-toggle";
                adToggleLabel.textContent = "显示广告（默认隐藏）";
                adToggleLabel.style.cursor = "pointer";
                adToggleGroup.append(adToggle, adToggleLabel);

                // 广告删除方式
                const deleteModeGroup = document.createElement("div");
                deleteModeGroup.style.cssText = `
                    display: flex;
                    align-items: center;
                    margin-bottom: ${options.panelStyle.marginBottom};
                    padding-bottom: ${options.panelStyle.marginBottom};
                    border-bottom: 1px solid #f3f4f6;
                `;
                const deleteModeToggle = document.createElement("input");
                deleteModeToggle.type = "checkbox";
                deleteModeToggle.id = "delete-mode-toggle";
                deleteModeToggle.checked = options.isDomRemove;
                deleteModeToggle.style.cssText = `
                    width: ${options.panelStyle.checkboxSize};
                    height: ${options.panelStyle.checkboxSize};
                    margin-right: 8px;
                    cursor: pointer;
                `;
                const deleteModeLabel = document.createElement("label");
                deleteModeLabel.htmlFor = "delete-mode-toggle";
                deleteModeLabel.innerHTML = `
                    彻底删除广告（默认隐藏）<br>
                    <span style="font-size: 12px; color: ${options.panelStyle.subTextColor}; margin-top: 2px; display: block;">
                    注：彻底删除可减少页面占用，但可能影响部分页面布局
                    </span>
                `;
                deleteModeLabel.style.cursor = "pointer";
                deleteModeGroup.append(deleteModeToggle, deleteModeLabel);

                // 吧友屏蔽功能区
                const userBlockGroup = document.createElement("div");
                userBlockGroup.style.cssText = `
                    margin-bottom: ${options.panelStyle.marginBottom};
                    padding-bottom: ${options.panelStyle.marginBottom};
                    border-bottom: 1px solid #f3f4f6;
                `;
                const blockTitle = document.createElement("div");
                blockTitle.style.cssText = `
                    font-size: 13px;
                    margin-bottom: 8px;
                    color: ${options.panelStyle.subTextColor};
                `;
                blockTitle.textContent = "吧友屏蔽";

                // 添加用户输入框和按钮
                const addUserContainer = document.createElement("div");
                addUserContainer.style.cssText = "display: flex; gap: 4px; margin-bottom: 8px;";
                const blockUserInput = document.createElement("input");
                blockUserInput.id = "block-user-input";
                blockUserInput.placeholder = "输入用户名";
                blockUserInput.style.cssText = `
                    flex: 1;
                    padding: 6px 8px;
                    font-size: 13px;
                    border: 1px solid #ddd;
                    border-radius: ${options.panelStyle.btnRadius};
                `;
                ControlPanel.blockUserInput = blockUserInput;

                const addUserBtn = document.createElement("button");
                addUserBtn.textContent = "添加";
                addUserBtn.style.cssText = `
                    padding: 0 8px;
                    background-color: ${options.panelStyle.btnBg};
                    border: none;
                    border-radius: ${options.panelStyle.btnRadius};
                    color: ${options.panelStyle.textColor};
                    font-size: 13px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                `;
                addUserBtn.onmouseover = () => {
                    addUserBtn.style.backgroundColor = options.panelStyle.btnHoverBg;
                };
                addUserBtn.onmouseout = () => {
                    addUserBtn.style.backgroundColor = options.panelStyle.btnBg;
                };

                // 绑定添加用户事件
                addUserBtn.addEventListener('click', () => {
                    const username = blockUserInput.value.trim();
                    if (username) {
                        if (UserBlocker.addUser(username)) {
                            blockUserInput.value = "";
                            ControlPanel.updateBlockedUsersList();
                            alert(`已添加屏蔽: ${username}`);
                        } else {
                            alert("该用户已在屏蔽列表中");
                        }
                    }
                });

                // 回车添加用户
                blockUserInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        addUserBtn.click();
                    }
                });

                // 屏蔽列表容器
                const blockedListContainer = document.createElement("div");
                blockedListContainer.style.cssText = `
                    max-height: 120px;
                    overflow-y: auto;
                    font-size: 13px;
                    border: 1px solid #f0f0f0;
                    border-radius: 4px;
                    padding: 4px;
                    margin-bottom: 8px;
                `;

                // 屏蔽列表
                const blockedUsersList = document.createElement("ul");
                blockedUsersList.style.cssText = `
                    list-style: none;
                    margin: 0;
                    padding: 0;
                `;
                ControlPanel.blockedUsersListEl = blockedUsersList;
                blockedListContainer.appendChild(blockedUsersList);

                // 清空按钮
                const clearBlockListBtn = document.createElement("button");
                clearBlockListBtn.textContent = "清空屏蔽列表";
                clearBlockListBtn.style.cssText = `
                    width: 100%;
                    padding: 4px 0;
                    background-color: #fee2e2;
                    border: none;
                    border-radius: ${options.panelStyle.btnRadius};
                    color: #dc2626;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                `;
                clearBlockListBtn.onmouseover = () => {
                    clearBlockListBtn.style.backgroundColor = "#fecaca";
                };
                clearBlockListBtn.onmouseout = () => {
                    clearBlockListBtn.style.backgroundColor = "#fee2e2";
                };
                clearBlockListBtn.addEventListener('click', () => {
                    if (confirm("确定要清空所有屏蔽用户吗？")) {
                        UserBlocker.clearAll();
                        ControlPanel.updateBlockedUsersList();
                    }
                });

                addUserContainer.append(blockUserInput, addUserBtn);
                userBlockGroup.append(blockTitle, addUserContainer, blockedListContainer, clearBlockListBtn);

                // 分页快捷操作区
                const paginationGroup = document.createElement("div");
                paginationGroup.style.cssText = `
                    margin-bottom: ${options.panelStyle.marginBottom};
                    padding-bottom: ${options.panelStyle.marginBottom};
                    border-bottom: 1px solid #f3f4f6;
                `;
                const paginationTitle = document.createElement("div");
                paginationTitle.style.cssText = `
                    font-size: 13px;
                    margin-bottom: 8px;
                    color: ${options.panelStyle.subTextColor};
                `;
                paginationTitle.textContent = "分页快捷操作";
                const pageBtnContainer = document.createElement("div");
                pageBtnContainer.style.cssText = "display: flex; gap: 8px;";
                const prevPageBtn = document.createElement("button");
                prevPageBtn.id = "prev-page-btn";
                prevPageBtn.textContent = options.page.up;
                prevPageBtn.style.cssText = `
                    flex: 1;
                    padding: 8px 0;
                    background-color: ${options.panelStyle.btnBg};
                    border: none;
                    border-radius: ${options.panelStyle.btnRadius};
                    color: ${options.panelStyle.textColor};
                    font-size: 13px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                `;
                const nextPageBtn = document.createElement("button");
                nextPageBtn.id = "next-page-btn";
                nextPageBtn.textContent = options.page.down;
                nextPageBtn.style.cssText = `
                    flex: 1;
                    padding: 8px 0;
                    background-color: ${options.panelStyle.btnBg};
                    border: none;
                    border-radius: ${options.panelStyle.btnRadius};
                    color: ${options.panelStyle.textColor};
                    font-size: 13px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                `;
                prevPageBtn.onmouseover = () => {
                    if (!prevPageBtn.disabled) {
                        prevPageBtn.style.backgroundColor = options.panelStyle.btnHoverBg;
                    }
                };
                prevPageBtn.onmouseout = () => {
                    if (!prevPageBtn.disabled) {
                        prevPageBtn.style.backgroundColor = options.panelStyle.btnBg;
                    }
                };
                nextPageBtn.onmouseover = () => {
                    if (!nextPageBtn.disabled) {
                        nextPageBtn.style.backgroundColor = options.panelStyle.btnHoverBg;
                    }
                };
                nextPageBtn.onmouseout = () => {
                    if (!nextPageBtn.disabled) {
                        nextPageBtn.style.backgroundColor = options.panelStyle.btnBg;
                    }
                };
                pageBtnContainer.append(prevPageBtn, nextPageBtn);
                paginationGroup.append(paginationTitle, pageBtnContainer);

                // 反馈邮件区域
                const feedbackGroup = document.createElement("div");
                feedbackGroup.style.cssText = `
                    margin-bottom: ${options.panelStyle.marginBottom};
                    padding-bottom: ${options.panelStyle.marginBottom};
                    border-bottom: 1px solid #f3f4f6;
                `;
                const feedbackTitle = document.createElement("div");
                feedbackTitle.style.cssText = `
                    font-size: 13px;
                    margin-bottom: 8px;
                    color: ${options.panelStyle.subTextColor};
                `;
                feedbackTitle.textContent = "反馈与建议";
                const feedbackBtn = document.createElement("a");
                feedbackBtn.href = `mailto:${options.feedbackEmail}?subject=贴吧广告过滤插件反馈&body=请描述您遇到的问题或建议...`;
                feedbackBtn.textContent = "发送邮件反馈";
                feedbackBtn.style.cssText = `
                    display: block;
                    width: 100%;
                    padding: 8px 0;
                    background-color: ${options.panelStyle.btnBg};
                    border: none;
                    border-radius: ${options.panelStyle.btnRadius};
                    color: #2563eb;
                    font-size: 13px;
                    cursor: pointer;
                    text-align: center;
                    text-decoration: none;
                    transition: background-color 0.2s ease;
                `;
                feedbackBtn.onmouseover = () => {
                    feedbackBtn.style.backgroundColor = options.panelStyle.btnHoverBg;
                };
                feedbackBtn.onmouseout = () => {
                    feedbackBtn.style.backgroundColor = options.panelStyle.btnBg;
                };
                feedbackGroup.append(feedbackTitle, feedbackBtn);

                // 手动刷新广告检测
                const refreshBtn = document.createElement("button");
                refreshBtn.id = "refresh-ad-detect";
                refreshBtn.textContent = "手动刷新广告检测";
                refreshBtn.style.cssText = `
                    width: 100%;
                    padding: 8px 0;
                    background-color: ${options.panelStyle.btnBg};
                    border: none;
                    border-radius: ${options.panelStyle.btnRadius};
                    color: ${options.panelStyle.textColor};
                    font-size: 13px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    margin-bottom: ${options.panelStyle.marginBottom};
                `;
                refreshBtn.onmouseover = () => {
                    refreshBtn.style.backgroundColor = options.panelStyle.btnHoverBg;
                };
                refreshBtn.onmouseout = () => {
                    refreshBtn.style.backgroundColor = options.panelStyle.btnBg;
                };

                // 统计信息显示
                const statsContainer = document.createElement("div");
                statsContainer.style.cssText = `
                    font-size: 12px;
                    color: ${options.panelStyle.subTextColor};
                    text-align: right;
                    padding-top: 8px;
                    border-top: 1px dashed #f3f4f6;
                `;

                const adCount = document.createElement("div");
                adCount.id = "ad-count";
                adCount.textContent = `已过滤广告：${AdManager.detectedAds.size} 个`;

                const blockedCount = document.createElement("div");
                blockedCount.id = "blocked-count";
                blockedCount.textContent = `已屏蔽用户：${UserBlocker.getBlockedList().length} 个`;

                statsContainer.append(adCount, blockedCount);

                // 用户评分区
                const scoreContainer = document.createElement("div");
                scoreContainer.style.cssText = `
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    margin-top: 10px;
                `;

                const customerScoring = document.createElement("label");
                customerScoring.id = "customer-scoring";
                customerScoring.textContent = `${options.scoringText}`;
                customerScoring.style.cssText = `
                    display: inline-block;
                    animation: marquee 15s linear infinite;
                    color: #e63946;
                    font-weight: bold;
                    font-size: 13px;
                `;

                // 添加跑马灯动画样式
                const styleSheet = document.createElement("style");
                styleSheet.textContent = `
                    @keyframes marquee {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                    }
                `;
                document.head.appendChild(styleSheet);
                scoreContainer.appendChild(customerScoring);

                // 组装内容区
                content.append(adToggleGroup, deleteModeGroup, userBlockGroup,
                              paginationGroup, feedbackGroup, refreshBtn, statsContainer , scoreContainer);
                panel.append(header, content);
                document.body.appendChild(panel);
                ControlPanel.panelElement = panel;

                // 初始化屏蔽用户列表显示
                ControlPanel.updateBlockedUsersList();

                // 绑定事件
                ControlPanel.bindEvents(adToggle, deleteModeToggle, refreshBtn,
                                      adCount, blockedCount, prevPageBtn, nextPageBtn);

                // 初始化拖拽
                ControlPanel.initDrag();

                // 初始化存储同步
                ControlPanel.initStorageSync();

                // 面板hover效果
                panel.onmouseover = () => {
                    panel.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
                };
                panel.onmouseout = () => {
                    panel.style.boxShadow = options.panelStyle.shadow;
                };

                return panel;
            } catch (ex) {
                logger.error("创建控制面板失败:", ex);
                return null;
            }
        },

        updateBlockedUsersList: () => {
            const listEl = ControlPanel.blockedUsersListEl;
            if (!listEl) return;

            try {
                listEl.innerHTML = "";

                const blockedUsers = UserBlocker.getBlockedList();
                if (blockedUsers.length === 0) {
                    const emptyItem = document.createElement("li");
                    emptyItem.style.cssText = "padding: 4px; color: #9ca3af; text-align: center;";
                    emptyItem.textContent = "暂无屏蔽用户";
                    listEl.appendChild(emptyItem);
                    return;
                }

                blockedUsers.forEach(username => {
                    const listItem = document.createElement("li");
                    listItem.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 4px; border-bottom: 1px solid #f3f4f6;";

                    const usernameSpan = document.createElement("span");
                    usernameSpan.textContent = username;
                    usernameSpan.style.cssText = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";

                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "×";
                    removeBtn.style.cssText = `
                        width: 18px;
                        height: 18px;
                        border: none;
                        border-radius: 50%;
                        background-color: #ef4444;
                        color: white;
                        font-size: 12px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0;
                        margin-left: 4px;
                    `;
                    removeBtn.title = `取消屏蔽 ${username}`;
                    removeBtn.addEventListener('click', () => {
                        if (UserBlocker.removeUser(username)) {
                            ControlPanel.updateBlockedUsersList();
                            document.getElementById("blocked-count").textContent =
                                `已屏蔽用户：${UserBlocker.getBlockedList().length} 个`;
                        }
                    });

                    listItem.append(usernameSpan, removeBtn);
                    listEl.appendChild(listItem);
                });

                document.getElementById("blocked-count").textContent =
                    `已屏蔽用户：${blockedUsers.length} 个`;
            } catch (ex) {
                logger.error("更新屏蔽用户列表失败:", ex);
            }
        },

        toggleCollapse: () => {
            try {
                const panel = ControlPanel.panelElement;
                const content = ControlPanel.contentElement;
                const collapseBtn = ControlPanel.collapseButton;

                options.isCollapsed = !options.isCollapsed;

                if (options.isCollapsed) {
                    panel.style.minHeight = `${options.panelStyle.collapsedHeight}`;
                    content.style.display = "none";
                    collapseBtn.innerHTML = "▷";
                    collapseBtn.title = "展开面板";
                } else {
                    panel.style.minHeight = `${options.panelStyle.minHeight}`;
                    content.style.display = "block";
                    collapseBtn.innerHTML = "▽";
                    collapseBtn.title = "折叠面板";
                }

                StorageUtil.saveCollapsedState(options.isCollapsed);
            } catch (ex) {
                logger.error("切换折叠状态失败:", ex);
            }
        },

        syncCollapseState: (newState) => {
            if (options.isCollapsed === newState.isCollapsed) return;

            try {
                options.isCollapsed = newState.isCollapsed;
                const panel = ControlPanel.panelElement;
                const content = ControlPanel.contentElement;
                const collapseBtn = ControlPanel.collapseButton;

                if (options.isCollapsed) {
                    panel.style.minHeight = `${options.panelStyle.collapsedHeight}`;
                    content.style.display = "none";
                    collapseBtn.innerHTML = "▷";
                    collapseBtn.title = "展开面板";
                } else {
                    panel.style.minHeight = `${options.panelStyle.minHeight}`;
                    content.style.display = "block";
                    collapseBtn.innerHTML = "▽";
                    collapseBtn.title = "折叠面板";
                }
            } catch (ex) {
                logger.error("同步折叠状态失败:", ex);
            }
        },

        bindEvents: (adToggle, deleteModeToggle, refreshBtn, adCount, blockedCount, prevPageBtn, nextPageBtn) => {
            try {
                // 绑定折叠按钮事件
                ControlPanel.collapseButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    ControlPanel.toggleCollapse();
                });

                // 广告显示/隐藏切换
                adToggle.addEventListener('change', (e) => {
                    options.showAds = e.target.checked;
                    AdManager.handleAllAds();
                    adCount.textContent = `已过滤广告：${AdManager.detectedAds.size} 个`;
                });

                // 广告删除模式切换
                deleteModeToggle.addEventListener('change', (e) => {
                    options.isDomRemove = e.target.checked;
                    AdManager.handleAllAds();
                });

                // 手动刷新广告检测
                refreshBtn.addEventListener('click', () => {
                    refreshBtn.textContent = "检测中...";
                    refreshBtn.disabled = true;
                    Detector.detectAll();
                    AdManager.handleAllAds();
                    setTimeout(() => {
                        refreshBtn.textContent = "手动刷新广告检测";
                        refreshBtn.disabled = false;
                        adCount.textContent = `已过滤广告：${AdManager.detectedAds.size} 个`;
                        blockedCount.textContent = `已屏蔽用户：${UserBlocker.getBlockedList().length} 个`;
                        PaginationTool.updateButtonStates(prevPageBtn, nextPageBtn);
                    }, 1000);
                });

                // 定时更新统计信息和分页按钮状态
                setInterval(() => {
                    adCount.textContent = `已过滤广告：${AdManager.detectedAds.size} 个`;
                    blockedCount.textContent = `已屏蔽用户：${UserBlocker.getBlockedList().length} 个`;
                    PaginationTool.updateButtonStates(prevPageBtn, nextPageBtn);
                }, 3000);

                // 上一页按钮点击事件
                prevPageBtn.addEventListener('click', () => {
                    if (!prevPageBtn.disabled) {
                        PaginationTool.triggerPageClick(options.page.up);
                        prevPageBtn.disabled = true;
                        setTimeout(() => {
                            PaginationTool.updateButtonStates(prevPageBtn, nextPageBtn);
                        }, 1000);
                    }
                });

                // 下一页按钮点击事件
                nextPageBtn.addEventListener('click', () => {
                    if (!nextPageBtn.disabled) {
                        PaginationTool.triggerPageClick(options.page.down);
                        nextPageBtn.disabled = true;
                        setTimeout(() => {
                            PaginationTool.updateButtonStates(prevPageBtn, nextPageBtn);
                        }, 1000);
                    }
                });

                // 初始更新分页按钮状态
                PaginationTool.updateButtonStates(prevPageBtn, nextPageBtn);
            } catch (ex) {
                logger.error("绑定面板事件失败:", ex);
            }
        },

        initDrag: () => {
            const panel = ControlPanel.panelElement;
            if (!panel) return;

            const dragHandle = panel.querySelector(".panel-header");
            if (!dragHandle) return;

            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            let isDragging = false;

            try {
                dragHandle.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    isDragging = true;

                    panel.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                    panel.style.transition = "box-shadow 0.1s ease";

                    pos3 = e.clientX;
                    pos4 = e.clientY;

                    document.addEventListener('mousemove', dragMove);
                    document.addEventListener('mouseup', dragEnd);
                });

                const dragMove = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();

                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;

                    const newTop = panel.offsetTop - pos2;
                    const newLeft = panel.offsetLeft - pos1;
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    // 限制在视口内
                    const constrainedTop = Math.max(0, Math.min(newTop, viewportHeight - panel.offsetHeight));
                    const constrainedLeft = Math.max(0, Math.min(newLeft, viewportWidth - panel.offsetWidth));

                    panel.style.top = `${constrainedTop}px`;
                    panel.style.left = `${constrainedLeft}px`;

                    if (!ControlPanel.isProgrammaticMove) {
                        StorageUtil.savePosition({
                            top: constrainedTop,
                            left: constrainedLeft
                        });
                    }
                };

                const dragEnd = () => {
                    isDragging = false;
                    panel.style.boxShadow = options.panelStyle.shadow;
                    panel.style.transition = "box-shadow 0.2s ease";

                    document.removeEventListener('mousemove', dragMove);
                    document.removeEventListener('mouseup', dragEnd);
                };
            } catch (ex) {
                logger.error("初始化拖拽功能失败:", ex);
            }
        },

        initStorageSync: () => {
            const panel = ControlPanel.panelElement;
            if (!panel) return;

            try {
                window.addEventListener('storage', (e) => {
                    if (e.key === options.storageKey) {
                        try {
                            const newPos = JSON.parse(e.newValue);
                            if (!newPos) return;

                            ControlPanel.isProgrammaticMove = true;
                            panel.style.top = `${newPos.top}px`;
                            panel.style.left = `${newPos.left}px`;

                            setTimeout(() => {
                                ControlPanel.isProgrammaticMove = false;
                            }, 100);
                        } catch (ex) {
                            logger.error("同步面板位置失败:", ex);
                        }
                    }
                    else if (e.key === options.collapseStorageKey) {
                        try {
                            const newState = JSON.parse(e.newValue);
                            if (newState) {
                                ControlPanel.syncCollapseState(newState);
                            }
                        } catch (ex) {
                            logger.error("同步折叠状态失败:", ex);
                        }
                    }
                    else if (e.key === options.blockListStorageKey) {
                        try {
                            const newList = JSON.parse(e.newValue);
                            if (newList && newList.users) {
                                UserBlocker.blockedUsers = new Set(newList.users);
                                ControlPanel.updateBlockedUsersList();
                                UserBlocker.detectAndBlock();
                            }
                        } catch (ex) {
                            logger.error("同步屏蔽列表失败:", ex);
                        }
                    }
                });
            } catch (ex) {
                logger.error("初始化存储同步失败:", ex);
            }
        }
    };

    // 初始化函数
    const init = () => {
        try {
            if (window.location.host.indexOf(options.matchingHost) === -1) {
                logger.log("不匹配目标网站，脚本不执行");
                return;
            }

            // 1. 优先注入预隐藏样式
            StyleUtil.injectPreHideStyles();

            // 2. 启动高优先级检测器
            const highPriorityObserver = Detector.initHighPriorityDetector();

            // 3. 创建控制面板
            ControlPanel.createPanel();

            // 4. 启动常规检测循环
            const checkInterval = setInterval(() => {
                if (document.readyState === 'unloaded') {
                    clearInterval(checkInterval);
                    if (highPriorityObserver) highPriorityObserver.disconnect();
                    return;
                }
                Detector.detectAll();
                AdManager.handleAllAds();
            }, options.interval * 2);

            window.addEventListener('beforeunload', () => {
                clearInterval(checkInterval);
                if (highPriorityObserver) highPriorityObserver.disconnect();
            });

            logger.log("优化版脚本初始化完成，已启用防闪烁机制");
        } catch (ex) {
            logger.error("脚本初始化失败:", ex);
        }
    };

    // 启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
