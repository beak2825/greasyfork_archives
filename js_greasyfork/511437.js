// ==UserScript==
// @name         BiliCleaner
// @namespace    https://greasyfork.org/scripts/511437/
// @description  隐藏B站动态瀑布流中的广告、评论区广告、充电内容以及美化首页
// @version      1.36
// @author       chemhunter
// @match        *://t.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://message.bilibili.com/*
// @connect      www.gitlabip.xyz
// @connect      hub.gitmirror.com
// @connect      raw.githubusercontent.com
// @grant        GM_registerMenuCommand
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @license      GPL-3.0 License
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/511437/BiliCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/511437/BiliCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 新增：声明全局变量 ---
    let keywordRegex, keywordRegexGlobal, biliAdWordsConfig, whiteList, messageDiv;
    let commentAppObserver, dynamicPanelObserver, panelCardObserver, setupIntervalId;
    let lastPathname = '';
    let hiddenAdCount = 0;
    let lastActiveUpName = null;
    let setMainWidth = false;

    const defaultConfig = {
        keywordStr: `淘宝|京东|天猫|补贴|折扣|福利|专属|下单|运(费?)险|[领惠叠]券|[低特好底保降差性]价`,
        biliAdLinks: ['taobao.com', 'tb.cn', 'jd.com', 'pinduodilo.com','zhuanzhuan.com', 'mall.bilibili.com', 'gaoneng.bilibili.com'],
        time: 0
    };

    async function fetchConfigFromGit() {
        let lastError = null;
        const gitSource = ['www.gitlabip.xyz', 'hub.gitmirror.com', 'raw.githubusercontent.com']; //github镜像加速及源地址
        const jsonFile = '/chemhunter/biliadskip/refs/heads/main/biliadwordslinks.json';

        for (const source of gitSource) {
            const url = `https://${source}${jsonFile}?t=${Date.now()}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {throw new Error(`HTTP错误! 状态码: ${response.status}`)};
                const text = await response.text();
                try {
                    const configData = JSON.parse(text);
                    log(`✅ 从git镜像: ${source} 获取到广告基础配置`);
                    return configData;
                } catch (parseError) { throw new Error(`JSON解析失败: ${parseError.message}`); }
            } catch (error) { lastError = error; continue;}
        }

        throw new Error(`所有镜像源均无法访问: ${lastError?.message || '未知错误'}`);
    }

    async function getConfigWithFallback(maxRetries = 2) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const res = await fetchConfigFromGit();
                return res;
            } catch (error) {
                console.error(`尝试 ${attempt} 失败:`, error.message);
                if (attempt === maxRetries) {
                    console.warn('⚠️ 所有尝试均失败，使用默认配置');
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 500 * attempt));
            }
        }
        return;
    }

    async function getAdWordsConfig() {
        try {
            const localConfigStr = localStorage.getItem("localConfig");
            const localConfig = localConfigStr ? JSON.parse(localConfigStr) : null;
            const lastUpdateTime = localConfig && localConfig.time || 0;
            if ( Date.now() - lastUpdateTime >= 3600 * 24 * 1000) {
                const res = await getConfigWithFallback();
                if (res) {
                    log(`⚙️ 配置信息:`, res);
                    biliAdWordsConfig = {
                        ...res,
                        keywordStr: Object.values(res.keywordStr).join('|'),
                        time: Date.now()
                    };
                    localStorage.setItem("localConfig", JSON.stringify(biliAdWordsConfig));
                }
            } else {
                log(`读取本地广告词缓存`);
                biliAdWordsConfig = {...localConfig};
                if (!biliAdWordsConfig.time) {
                    biliAdWordsConfig = defaultConfig;
                }
            }
        } catch (error) {
            console.error("获取广告词配置失败:", error);
        }
        keywordRegex = new RegExp(biliAdWordsConfig.keywordStr.replace(/\s+/g, ''), 'i');
        keywordRegexGlobal = new RegExp(biliAdWordsConfig.keywordStr.replace(/\s+/g, ''), 'gi');
    }

    function log(...args) {
        console.log('[BiliCleaner] ', ...args);
    }

    function hideItem(element) {
        if (element && element.style.display !== 'none') {
            element.style.display = 'none';
        }
    }

    function showMessage(msg) {
        messageDiv.textContent = msg;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    function hideUnwantedElements() {
        // 分组规则：按页面类型
        const rules = {
            common: [
                'li.v-popover-wrap.left-loc-entry', //上方导航条末尾，可能是广告/节日/专题
                'ul.left-entry > li.v-popover-wrap:last-child', // 上方导航条最后的“下载客户端”
                'ul.right-entry > .vip-wrap', //顶部右侧 大会员按钮
            ],
            video: [
                ".video-page-game-card-small", //右侧栏推荐视频列表上方广告
                '.video-page-special-card-small', //右侧卡片栏混入的特殊卡片链接
                '.video-share-wrap', // 视频页面分享按钮
                '.video-card-ad-small', // 弹幕列表下方 视频卡片形式的小广告
                '.slide-ad-exp', //右侧上方弹幕列表下方的广告块
                '.ad-report.strip-ad', // 视频下方 广告上报/“不喜欢”按钮
                '.activity-m-v1', //评论区上方活动推广条
                '.bili-mini-mask', // 视频区域的登录提示遮罩
            ],
            dynamic: [
                'bili-dyn-home--member .right',
                '.bili-dyn-banner', //动态右侧社区公告
                //'aside.right > section > .bili-dyn-banner',
                //'.bili-dyn-search-trendings',//动态右侧热搜，毫无营养
                '.reply-notice', //动态页面评论区上方提醒条
                ".bili-dyn-version-control__reminding", //动态页面新版导航提醒
            ],
            live: [
                "gift-control-vm", //直播界面下方送礼栏
                ".gift-control-section", //直播界面下方送礼栏
                '.room-info-ctnr', //直播界面下面推荐直播4x2
                '.gift-menu-root', //直播窗口内礼物列表
                'rank-list-vm', //直播界面上方榜单
                '.rank-list-section', //直播界面上方榜单
                'rank-list-ctnr-box .tab-content.ts-dot-2',
                '.app-body .player-and-aside-area .aside-area .chat-history-panel .chat-items .chat-item.gift-item', //直播聊天栏礼物
            ]
        };

        const { hostname, pathname } = location;
        const isVideoPage = pathname.startsWith('/video/');
        const isDynamicPage = hostname === 't.bilibili.com' || pathname.startsWith('/opus/');
        const isLivePage = hostname === 'live.bilibili.com' || pathname.startsWith('/live/');

        let selectorsToApply = [...rules.common];

        if (isVideoPage) {
            selectorsToApply.push(...rules.video);
        } else if (isDynamicPage) {
            selectorsToApply.push(...rules.dynamic);
        } else if (isLivePage) {
            selectorsToApply.push(...rules.live);
            /*
            const parentElement = document.getElementById('rank-list-vm');
            const childElement = document.getElementById('rank-list-ctnr-box');
            const scrollbarHeight = document.getElementById('.ps__scrollbar-y-rail');
            if ( scrollbarHeight ) scrollbarHeight.style.height = '432px';

            if (parentElement && childElement) {
                let height = parseFloat(window.getComputedStyle(childElement).height);
                if (!parentElement.dataset.heightModified) {
                    height = height / 3 - 1;
                }
                parentElement.style.height = `${height}px`;
                childElement.style.height = `${height}px`;
                parentElement.dataset.heightModified = 'true';
            } 
            */
        }

        for (const selector of selectorsToApply) {
            const element = document.querySelector(selector);
            if (element) {
                if (selector === '.bili-mini-mask') {
                    if (window.getComputedStyle(element).display !== 'none') {
                        hideItem(element);
                    }
                } else {
                    hideItem(element);
                }
            }
        }
    }

    // 检查评论区置顶广告
    function checkCommentTopAdsOld() {
        const commentAds = document.querySelectorAll('.dynamic-card-comment .comment-list.has-limit .list-item.reply-wrap.is-top');
        commentAds.forEach(comment => {
            const links = comment.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && biliAdWordsConfig.biliAdLinks.some(blocked => href.includes(blocked))) {
                    hideItem(comment);
                    log('评论区置顶广告+1(链接)')
                    return true;
                }
            });
        });
        return false;
    }

    // 新版本动态 commentapp or  bili-dyn-comment
    // 旧版本动态 dynamic-card-comment
    function checkCommentsForAds() {

        const dynCommentOldVersion = document.querySelector('.dynamic-card-comment');
        if (dynCommentOldVersion) {
            const result = checkCommentTopAdsOld();
            if (result) {
                hiddenAdCount++;
            }
            return result;
        }

        const commentsContainer = document.querySelector('#commentapp > bili-comments') || document.querySelector('.bili-dyn-comment > bili-comments');
        if (commentsContainer && commentsContainer.shadowRoot) {

            const headerElement = commentsContainer.shadowRoot.querySelector("#header > bili-comments-header-renderer");
            if (headerElement && headerElement.shadowRoot) {
                const noticeElement = headerElement.shadowRoot.querySelector("#notice > bili-comments-notice");
                if (noticeElement && noticeElement.shadowRoot) {
                    const closeElement = noticeElement.shadowRoot.querySelector("#close");
                    if (closeElement) {
                        log("评论区横条，自动关闭");
                        closeElement.click();
                    }
                }
            }

            const thread = commentsContainer.shadowRoot.querySelector('bili-comment-thread-renderer');
            if (thread && window.getComputedStyle(thread).display !== 'none' && thread.shadowRoot) {
                const commentRenderer = thread.shadowRoot.querySelector('#comment');
                if (commentRenderer && commentRenderer.shadowRoot) {
                    const richText = commentRenderer.shadowRoot.querySelector('#content > bili-rich-text');
                    if (richText && richText.shadowRoot) {
                        const contentsElement = richText.shadowRoot.querySelector('#contents');
                        if (contentsElement) {
                            let foundAd;
                            const links = contentsElement.querySelectorAll('a');
                            links.forEach(link => {
                                const href = link.getAttribute('href');
                                if (href && biliAdWordsConfig.biliAdLinks.some(blocked => href.includes(blocked))) {
                                    foundAd = true;
                                }
                            });

                            if (!foundAd) {
                                const commentText = contentsElement.textContent.trim();
                                foundAd = findAdwords(commentText)
                            }

                            if (foundAd) {
                                //log('发现广告：', contentText);
                                hideItem(thread);
                                hiddenAdCount++;
                                log('评论区置顶广告 +1')
                                window.MyObserver.disconnect();
                                let message = `隐藏广告 x ${hiddenAdCount}`;
                                showMessage(message);
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    function findAdwords(text) {
        const notAd = ['评论','评论区','产品']
        const matches = text.match(keywordRegexGlobal);
        if (!matches) return false;
        return matches.some(match => !notAd.includes(match));
    }

    function processFeedCards() {
        const adSpans = document.querySelectorAll('span.bili-video-card__stats--text');
        adSpans.forEach(span => {
            if (span.textContent.trim() === '广告') {
                const targetCard = span.closest('.bili-feed-card') || span.closest('.feed-card');
                if (targetCard) {
                    hideItem(targetCard);
                }
            }
        });

        const allFeedCards = document.querySelectorAll('.feed-card');
        allFeedCards.forEach(card => {
            const hasVideoWrap = card.querySelector('.bili-video-card__wrap');
            if (!hasVideoWrap) {
                hideItem(card);
                return;
            }
        });
    }

    function logCurrentActiveUp() {
        if (window.location.hostname === 't.bilibili.com') {
            const upListContainer = document.querySelector('.bili-dyn-up-list__window');
            if (!upListContainer) {
                return;
            }

            const activeUpElement = document.querySelector('.bili-dyn-up-list__item.active .bili-dyn-up-list__item__name');
            let currentActiveUpName = null;

            if (activeUpElement) {
                currentActiveUpName = activeUpElement.textContent.trim();
            } else {
                // 检查是否是“全部动态”被激活
                const allDynamicActive = document.querySelector('.bili-dyn-up-list__item.active .bili-dyn-up-list__item__face.all');
                if (allDynamicActive) {
                    currentActiveUpName = '全部动态';
                }
            }

            // 只有当当前激活的UP主与上次不同时才输出日志
            if (currentActiveUpName && currentActiveUpName !== lastActiveUpName) {
                const inWhiteList = whiteList.includes(currentActiveUpName)? " (白名单)" : '';
                console.log(
                    `[BiliCleaner] UP: %c${currentActiveUpName}${inWhiteList}`,
                    'background: #009688; color: #fff; padding: 2px 5px; border-radius: 2px; font-weight: bold;'
                );
                lastActiveUpName = currentActiveUpName;
            } else if (!currentActiveUpName && lastActiveUpName !== null) {
                lastActiveUpName = null;
            }
        } else {
            if (lastActiveUpName !== null) {
                lastActiveUpName = null;
            }
        }
    }

    function checkForContentToHide() {
        let hiddenChargeCount = 0;
        let hiddenAdCount = 0;
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        hideUnwantedElements()

        //B站首页
        if (hostname === 'www.bilibili.com' && !pathname.startsWith('/video/')) {
            // 处理 feed 卡片
            processFeedCards()

            // 隐藏推广的 feed 卡片
            const floorCards = document.querySelectorAll('.floor-single-card');
            floorCards.forEach(card => {
                hideItem(card);
            });

            //隐藏首页大屏
            const targetElement = document.querySelector('.recommended-swipe');
            hideItem(targetElement);

            //动态和个人空间页面
        } else if (hostname === 't.bilibili.com' || hostname === 'space.bilibili.com') {
            if (hostname === 't.bilibili.com') {
                logCurrentActiveUp();
                if (!setMainWidth) {
                    const dynMain = document.querySelector('.bili-dyn-home--member > main')
                    if (dynMain) {
                        const currentWidth = parseInt(getComputedStyle(dynMain).width, 10);
                        dynMain.style.width = (currentWidth + 175) + 'px';
                        setMainWidth = true;
                    }
                }
            }
            checkCommentsForAds();

            const items = document.querySelectorAll('.bili-dyn-list__item');
            items.forEach(item => {
                if (window.getComputedStyle(item).display !== 'none') {
                    const titleElement = item.querySelector('.bili-dyn-title');
                    if (titleElement && whiteList.includes(titleElement.textContent.trim())) {
                        return;
                    }

                    function isAdItem(item) {
                        return item.querySelector('bili-dyn-card-goods, dyn-goods');
                    }

                    function isChargeItem(item) {
                        if (item.querySelector('.dyn-blocked-mask, .bili-dyn-upower-common, .bili-dyn-upower-lottery, .dyn-icon-badge__renderimg.bili-dyn-item__iconbadge, .bili-dyn-card-common')) return true;
                        const badge = item.querySelector('.bili-dyn-card-video__badge');
                        if (badge && /专属|抢先看/.test(badge.textContent)) return true;
                        const lotteryTitle = item.querySelector('.dyn-upower-lottery__title');
                        if (lotteryTitle && lotteryTitle.textContent.includes('专属')) return true;
                        return false;
                    }

                    if (isAdItem(item)) {
                        hideItem(item);
                        log('广告卡片 +1');
                        hiddenAdCount++;
                        return;
                    }

                    if (isChargeItem(item)) {
                        const titleElement = item.querySelector('.bili-dyn-card-video__title');
                        if (titleElement) {
                            const videoTitle = titleElement.textContent.trim();
                            log(`充电专属 +1: \n ----->"${videoTitle}"`);
                        } else {
                            log(`充电专属 +1`);
                        }
                        hideItem(item);
                        hiddenChargeCount++;
                        return;
                    }

                    // 辅助函数：在指定容器中检查广告并隐藏
                    function checkAndHideAd(container, type) {
                        const richtext = container.querySelector('.bili-rich-text .bili-rich-text__content')?.textContent?.trim();
                        if ( richtext ) {
                            const foundAd = findAdwords(richtext);
                            if (foundAd) {
                                log(`广告关键词 +1(${type}) \n ----> ${richtext.slice(0,30)}`);
                                hideItem(item);
                                hiddenAdCount++;
                                return true;
                            }
                        }
                        return false;
                    }

                    const contentDiv = item.querySelector('.bili-dyn-content');
                    if (!contentDiv) return;

                    // 尝试在转发内容中查找
                    const origContent = contentDiv.querySelector('.bili-dyn-content__orig.reference');
                    if (origContent) {
                        if (checkAndHideAd(origContent, '转发')) return;
                    }

                    // 尝试在原创内容中查找
                    if (checkAndHideAd(contentDiv, '原创')) return;

                    const spans = item.querySelectorAll('span');
                    spans.forEach(span => {
                        const dataUrl = span.getAttribute('data-url');
                        if (dataUrl && biliAdWordsConfig.biliAdLinks.some(blocked => dataUrl.includes(blocked))) {
                            hideItem(item);
                            log('广告链接 +1')
                            hiddenAdCount++;
                        } else if (span.textContent.includes('专属')) {
                            hideItem(item);
                            log('充电专属 +1')
                            hiddenChargeCount++;
                            return;
                        }
                    });

                    const disabled = item.querySelector('.uncheck.disabled');
                    if (disabled) {
                        hideItem(item);
                        log('过期预约');
                        return;
                    }
                }
            });
            //视频页面
        } else if (pathname.startsWith('/video/BV')) {
            if (!checkCommentsForAds()) {
                setTimeout(() => {
                    checkCommentsForAds();
                }, 2000);
            }
        }

        let message = '';
        if (hiddenChargeCount > 0) {
            message += `隐藏充电 x ${hiddenChargeCount} `;
        }
        if (hiddenAdCount > 0) {
            message += `隐藏广告 x ${hiddenAdCount} `;
        }
        if (message) {
            showMessage(message.trim());
        } else {
            logCurrentActiveUp();
        }
    }

    // 元素是否可见
    function isVisible(el) {
        return el && el.offsetParent !== null;
    }

    /** 过滤单个动态卡片链接 */
    function filterSingleDynamicLink(linkElement) {
        //if (!isVisible(linkElement)) return;
        const title = linkElement.getAttribute('title') || '';
        const tagSpan = linkElement.querySelector('.all-in-one-article-title > .article-tag');
        const isArticle = tagSpan && tagSpan.textContent.trim() === '专栏';
        if (isArticle && keywordRegex.test(title)) {
            const authorElement = linkElement.querySelector('.user-name a[title]');
            const author = authorElement ? authorElement.getAttribute('title') : '未知作者';
            log(`🚫 [动态弹窗] 广告卡片: 「${author}」- ${title.slice(0, 20)}...`);
            linkElement.style.display = 'none';
        }
    }

    function watchDynamicAllPanel() {
        if (setupIntervalId) clearInterval(setupIntervalId);
        const containerObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    const panel = node.matches('.dynamic-all') ? node : node.querySelector('.dynamic-all');
                    if (panel) {
                        log('✅ dynamic-all 面板已插入');
                        panel.querySelectorAll('a[data-mod="top_right_bar_window_dynamic"]').forEach(filterSingleDynamicLink);
                        if (panelCardObserver) panelCardObserver.disconnect();
                        panelCardObserver = new MutationObserver(cardMutations => {
                            for (const cardMutation of cardMutations) {
                                for (const addedCard of cardMutation.addedNodes) {
                                    if (addedCard.nodeType === 1 && addedCard.matches('a[data-mod="top_right_bar_window_dynamic"]')) {
                                        filterSingleDynamicLink(addedCard);
                                    }
                                }
                            }
                        });

                        panelCardObserver.observe(panel, { childList: true });
                        break;
                    }
                }

                // 2. 处理节点移除的情况
                for (const node of mutation.removedNodes) {
                    if (node.nodeType !== 1) continue;
                    if ((node.matches('.dynamic-all') || node.querySelector('.dynamic-all')) && panelCardObserver) {
                        log('⚪️ dynamic-all 面板已移除');
                        panelCardObserver.disconnect();
                        panelCardObserver = null;
                        break;
                    }
                }
            }
        });

        let attemptCount = 0;
        const maxAttempts = 20;
        log('⏳ 查找“动态”按钮容器...');
        setupIntervalId = setInterval(() => {
            const allRightEntryItems = document.querySelectorAll('.right-entry > li.v-popover-wrap');
            let dynamicButtonContainer = null;
            for (const item of allRightEntryItems) {
                const link = item.querySelector('a[href*="t.bilibili.com"]');
                const textSpan = item.querySelector('.right-entry-text');
                if (link && textSpan && textSpan.textContent.trim() === '动态') {
                    dynamicButtonContainer = item;
                    break;
                }
            }
            if (dynamicButtonContainer) {
                clearInterval(setupIntervalId);
                setupIntervalId = null;
                containerObserver.observe(dynamicButtonContainer, { childList: true, subtree: true });
                log('✅ 设定导航栏“动态”观察器');
            } else {
                attemptCount++;
                if (attemptCount >= maxAttempts) {
                    clearInterval(setupIntervalId);
                    setupIntervalId = null;
                    log(`❌查找“动态”按钮容器超时 ，观察器未能启动`);
                }
            }
        }, 500);
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function initObserver() {
        const mainObserver = new MutationObserver(debounce(checkForContentToHide, 250));
        mainObserver.observe(document.body,{ childList: true, subtree: true, });//attributes: true, attributeFilter: ['class']
        return mainObserver;
    }

    function restartMainObserver() {
        log('页面内容更新，重启观察器');
        if (window.MyObserver) {
            window.MyObserver.disconnect();
        }
        const mainObserver = initObserver();
        window.MyObserver = mainObserver;
    }

    // 监听 commentapp 元素的变化
    function initCommentAppObserver() {
        const commentApp = document.querySelector('#commentapp');
        if (commentApp) {
            commentAppObserver = new MutationObserver(restartMainObserver);
            commentAppObserver.observe(commentApp, { childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
            log('启动观察commentapp');
        }
    }


    /** 显示白名单管理菜单*/
    async function whiteListMenu() {

        // 添加到白名单
        function addToWhiteList(upId) {
            if (!whiteList.includes(upId)) {
                whiteList.push(upId);
                localStorage.setItem('biliUpWhiteList', JSON.stringify(whiteList));
                updateWhiteListDisplay();
            } else {
                alert(`${upId} 已在白名单中`);
            }
        }

        // 从白名单中移除
        function removeFromWhiteList(upId) {
            const index = whiteList.indexOf(upId);
            if (index !== -1) {
                whiteList.splice(index, 1);
                localStorage.setItem('biliUpWhiteList', JSON.stringify(whiteList));
                updateWhiteListDisplay();
            } else {
                alert(`${upId} 不在白名单中`);
            }
        }

        // 更新白名单显示
        function updateWhiteListDisplay() {
            const listDisplay = document.getElementById('whiteListDisplay');
            if (listDisplay) {
                listDisplay.textContent = whiteList.join(', ') || '白名单为空';
            }

            const currentUserRow = document.getElementById('bili-current-up-display');
            const upInfo = getUpInfo();
            if (currentUserRow) {
                if (upInfo && upInfo.name) {
                    currentUserRow.innerHTML = `当前页面UP主: <b style="color: #00a1d6;">${upInfo.name}</b>`;
                } else {
                    currentUserRow.innerHTML = '';
                }
            }

            // 2. 【核心新增】更新“添加/移除当前页UP”按钮的状态
            const currentUpBtn = document.getElementById('bili-add-current-up-btn');
            if (currentUpBtn) {
                const upInfo = getUpInfo();
                if (upInfo && upInfo.name) {
                    currentUpBtn.style.display = '';
                    if (whiteList.includes(upInfo.name)) {
                        currentUpBtn.textContent = `移除当前UP`;
                        currentUpBtn.style.backgroundColor = '#e74c3c'; // 红色
                    } else {
                        currentUpBtn.textContent = `添加当前UP`;
                        currentUpBtn.style.backgroundColor = '#2eac31'; // 绿色
                    }
                } else {
                    currentUpBtn.style.display = 'none';
                }
            }
        }

        function getUpInfo() {
            const isSpacePage = window.location.href.match(/space.bilibili.com\/(\d+)/);
            const isVideoPage = window.location.href.includes('/video/BV');
            const container = isSpacePage ? document.querySelector('.upinfo__main') : document.querySelector('.up-panel-container');

            if (isVideoPage) {
                // 单个UP主的情况
                const singleUp = container.querySelector('.up-detail .up-detail-top .up-name');
                if (singleUp) {
                    const clone = singleUp.cloneNode(true);
                    clone.querySelectorAll('span').forEach(span => span.remove());
                    const name = clone.textContent.trim();

                    const href = singleUp.getAttribute('href');
                    const idMatch = href.match(/space\.bilibili\.com\/(\d+)/);
                    const id = idMatch ? idMatch[1] : null;

                    return { name, id};

                } else {
                    //多个UP的情况
                    const allMemberCards = container.querySelectorAll('.membersinfo-upcard');
                    const firstUpCard = allMemberCards[0];
                    if (firstUpCard) {
                        const nameElement = firstUpCard.querySelector('.staff-name');
                        const name = nameElement ? nameElement.textContent.trim() : null;
                        const idElement = firstUpCard.querySelector('a[href*="space.bilibili.com"]');
                        const href = idElement ? idElement.getAttribute('href') : null;
                        const id = href ? href.match(/\/\/space\.bilibili\.com\/(\d+)/)?.[1] : null;
                        return { name, id};
                    }
                }
            }
            return null;
        }

        const UpWhiteListContainer = document.createElement('div');
        UpWhiteListContainer.id = 'UpWhiteListContainer';
        UpWhiteListContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        padding: 20px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        z-index: 10000;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;

        const Title = document.createElement('h3');
        Title.textContent = `手动管理白名单（跳过检测）`;
        Title.style.cssText = 'text-align: center; margin-bottom: 20px; font-weight: bold; cursor: move; user-select: none;';
        UpWhiteListContainer.appendChild(Title);

        const toggleUpRow = document.createElement('div');
        toggleUpRow.style.cssText = `display: flex; align-items: center; margin-bottom: 10px; gap: 10px;`;

        const toggleUpLabel = document.createElement('label');
        toggleUpLabel.textContent = '添加/移除UP主:';
        toggleUpLabel.style.cssText = `flex-shrink: 0;`;

        // 为“执行”按钮绑定智能的切换逻辑
        const handleToggle = () => {
            const upName = toggleUpInput.value.trim();
            if (!upName) return;
            if (whiteList.includes(upName)) {
                removeFromWhiteList(upName);
            } else {
                addToWhiteList(upName);
            }
            toggleUpInput.value = '';
        };

        const toggleUpInput = document.createElement('input');
        toggleUpInput.type = 'text';
        toggleUpInput.id = 'toggleUpInput';
        toggleUpInput.placeholder = '输入UP主昵称';
        toggleUpInput.style.cssText = 'flex-grow: 1; min-width: 200; max-width: 240px; border: 1px solid #ccc;';
        toggleUpInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') handleToggle();
        });

        const toggleButton = createButton('执行', handleToggle);
        toggleButton.style.minWidth = '80px';

        toggleUpRow.appendChild(toggleUpLabel);
        toggleUpRow.appendChild(toggleUpInput);
        toggleUpRow.appendChild(toggleButton);
        UpWhiteListContainer.appendChild(toggleUpRow);

        // 白名单列表显示区域
        const listDiv = document.createElement('div');
        listDiv.id = 'whiteListDisplay';
        listDiv.style.cssText = `
        text-align: left;
        color: #30b688;
        margin: 20px 0;
        padding: 5px;
        border: 1px dashed #ccc;
        border-radius: 5px;
        font-size: 14px;
        word-break: break-word;
        max-height: 150px;
        overflow-y: auto;`;
        listDiv.textContent = whiteList.join(', ') || '白名单为空';
        UpWhiteListContainer.appendChild(listDiv);

        const currentUpInfo = getUpInfo();
        if (currentUpInfo && currentUpInfo.name) {
            const currentUserRow = document.createElement('div');
            currentUserRow.id = 'bili-current-up-display';
            currentUserRow.style.cssText = `text-align: center; font-size: 16px; color: #555; margin: 5px 0; padding: 5px;`;
            UpWhiteListContainer.appendChild(currentUserRow);
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; justify-content: center; margin: 10px 0; gap: 10px';

        function createButton(text, onClick) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `padding: 3px 3px; border: 1px solid #ccc; background: #f0f0f0; border-radius: 4px; cursor: pointer; font-size: 14px;`;
            if (onClick) button.onclick = onClick;
            return button;
        }

        const finishButton = createButton('关闭界面', () => {
            document.body.removeChild(UpWhiteListContainer);
        })

        if (currentUpInfo && currentUpInfo.name) {
            const upName = currentUpInfo.name;
            const toggleCurrentUpButton = document.createElement('button');
            toggleCurrentUpButton.id = 'bili-add-current-up-btn';
            toggleCurrentUpButton.style.cssText = `color: white; padding: 4px 5px; margin: 0 5px; border: none; border-radius: 4px;`;
            toggleCurrentUpButton.addEventListener('click', () => {
                if (whiteList.includes(upName)) {
                    removeFromWhiteList(upName);
                } else {
                    addToWhiteList(upName);
                }
            });
            buttonContainer.appendChild(toggleCurrentUpButton);
        }

        buttonContainer.appendChild(finishButton);
        UpWhiteListContainer.appendChild(buttonContainer);
        document.body.appendChild(UpWhiteListContainer);

        updateWhiteListDisplay();
    }

    function prepareForWork() {
        // 初始化白名单
        const oldList = localStorage.getItem('whiteList');
        if (oldList) {localStorage.setItem('biliUpWhiteList', oldList);localStorage.removeItem('whiteList');}
        whiteList = JSON.parse(localStorage.getItem('biliUpWhiteList')) || [];
        // 注册菜单命令
        GM_registerMenuCommand("UP白名单", whiteListMenu);

        //创建提醒元素
        messageDiv = document.createElement('div');
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '5px',
            zIndex: '9999',
            display: 'none'
        });
        document.body.appendChild(messageDiv);

        lastPathname = window.location.pathname;
    }

    function reinitializeAllObservers() {
        log('执行观察器初始化...');

        // 1. 断开所有可能存在的旧观察器
        if (window.MyObserver) window.MyObserver.disconnect();
        if (commentAppObserver) commentAppObserver.disconnect();
        if (dynamicPanelObserver) dynamicPanelObserver.disconnect();

        // 2. 重新运行所有初始化逻辑
        window.MyObserver = initObserver();
        initCommentAppObserver();
        watchDynamicAllPanel();
        checkForContentToHide();
    }

    // 导航观察器 ---
    function setupNavigationObserver() {
        const observer = new MutationObserver(() => {
            const currentPathname = window.location.pathname;
            if (!lastPathname || currentPathname !== lastPathname) {
                if (lastPathname) log(`检测到页面导航: ${lastPathname} -> ${currentPathname}`);
                lastPathname = currentPathname;
                debounce(reinitializeAllObservers, 1500)();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        log('✅ 主导航观察器已启动');
    }

    async function initApp() {
        log('脚本加载，初始化');
        await getAdWordsConfig();
        prepareForWork();
        reinitializeAllObservers();
        setupNavigationObserver();
    }

    initApp().catch(console.error);
})();
