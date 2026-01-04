// ==UserScript==
// @name         YouTube - 首页自适应
// @namespace    http://tampermonkey.net/
// @version      1.5.6
// @description  实现YouTube首页自适应(5/4/3/2/1)布局
// @author       Ferrari
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/?*
// @exclude      https://www.youtube.com/watch*
// @exclude      https://www.youtube.com/results*
// @exclude      https://www.youtube.com/shorts/*
// @exclude      https://www.youtube.com/channel/*
// @exclude      https://www.youtube.com/c/*
// @exclude      https://www.youtube.com/feed/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534458/YouTube%20-%20%E9%A6%96%E9%A1%B5%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/534458/YouTube%20-%20%E9%A6%96%E9%A1%B5%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 严格检查是否在首页
    function isYouTubeHomepage() {
        // 确保当前路径是根目录或者只包含查询参数
        const isRootPath = location.pathname === '/';
        
        // 确保不是其他页面类型
        const isNotWatchPage = !location.pathname.includes('/watch');
        const isNotSearchPage = !location.pathname.includes('/results');
        const isNotShortsPage = !location.pathname.includes('/shorts');
        const isNotChannelPage = !location.pathname.includes('/channel') && !location.pathname.includes('/c/');
        const isNotFeedPage = !location.pathname.includes('/feed');
        
        return isRootPath && isNotWatchPage && isNotSearchPage && isNotShortsPage && isNotChannelPage && isNotFeedPage;
    }

    // 如果不是首页，立即退出
    if (!isYouTubeHomepage()) {
        console.log('YouTube首页自适应: 不在首页，脚本未启动');
        return;
    }
    
    console.log('YouTube首页自适应: 在首页，脚本启动');

    const CONFIG = {
        MAX_ITEMS_PER_ROW: 5,
        MIN_ITEMS_PER_ROW: 1,
        ITEM_MIN_WIDTH: 260,
        ITEM_PREFERRED_WIDTH: 300,
        SIDEBAR_WIDTH_EXPANDED: 240,
        SIDEBAR_WIDTH_COLLAPSED: 72,
        GUTTER_SIZE: 16,
        SIDE_PADDING: 24,
        SHORTS_BLOCKED: 'yt-shorts-blocked'
    };

    let lastAppliedColumns = 0;
    let stylesInitialized = false;
    let lastWindowWidth = window.innerWidth;
    let initialStylesApplied = false;

    const getShortsHiddenState = () => {
        const gmValue = GM_getValue('hideShortsFlag');
        if (gmValue !== undefined) {
            localStorage.setItem(CONFIG.SHORTS_BLOCKED, gmValue);
            return gmValue;
        }
        return localStorage.getItem(CONFIG.SHORTS_BLOCKED) === 'true';
    };

    let hideShortsFlag = getShortsHiddenState();

    GM_registerMenuCommand(hideShortsFlag ? '显示YouTube Shorts' : '隐藏YouTube Shorts', toggleShorts);

    let shortsStyle = null;

    function toggleShorts() {
        hideShortsFlag = !hideShortsFlag;

        GM_setValue('hideShortsFlag', hideShortsFlag);
        localStorage.setItem(CONFIG.SHORTS_BLOCKED, hideShortsFlag);

        const status = hideShortsFlag ? '已隐藏' : '已显示';
        alert(`YouTube Shorts ${status}，页面将刷新以应用更改`);

        window.location.reload();
    }

    function applyShortsVisibility() {
        if (!shortsStyle) {
            shortsStyle = document.createElement('style');
            shortsStyle.id = 'yt-shorts-visibility';
            document.head.appendChild(shortsStyle);
        }

        if (hideShortsFlag) {
            shortsStyle.textContent = `
                ytd-rich-section-renderer,
                ytd-reel-shelf-renderer,
                ytd-shorts,
                ytd-mini-guide-entry-renderer[endpoint*="shorts"],
                ytd-guide-entry-renderer[endpoint*="shorts"] {
                    display: none !important;
                }
            `;
        } else {
            shortsStyle.textContent = '';
        }
    }

    function adjustLoadingSkeletons(skeletonElements, columns) {
        if (!skeletonElements.length) {
            return;
        }

        skeletonElements.forEach((element, index) => {
            if (!element) {
                return;
            }

            try {
                if (element.tagName === 'YTD-CONTINUATION-ITEM-RENDERER') {
                    element.style.width = '100%';
                    element.style.margin = '0';
                    element.style.padding = '0';
                    element.style.display = 'block';
                    element.style.overflow = 'hidden';

                    const spinner = element.querySelector('tp-yt-paper-spinner, yt-loading-icon');
                    if (spinner) {
                        spinner.style.margin = '16px auto';
                        spinner.style.display = 'block';
                    }

                    if (element.hasAttribute('elements-per-row') || element.parentElement?.tagName === 'YTD-RICH-GRID-RENDERER') {
                        element.setAttribute('elements-per-row', columns);
                    }

                    element.style.setProperty('--ytd-rich-grid-items-per-row', columns, 'important');
                    element.style.setProperty('--ytd-rich-grid-posts-per-row', columns, 'important');

                    const lastRow = document.querySelector('ytd-rich-grid-row:last-child');
                    if (lastRow) {
                        lastRow.style.marginBottom = '0';
                        element.style.marginTop = '0';
                    }

                    const contentsContainer = document.querySelector('ytd-rich-grid-renderer #contents');
                    if (contentsContainer) {
                        contentsContainer.style.padding = `0 ${CONFIG.GUTTER_SIZE/2}px`;
                    }
                } else {
                    createSkeletonGrid(element, columns, 3);

                    if (element.hasAttribute('elements-per-row') || element.tagName === 'YTD-RICH-GRID-RENDERER') {
                        element.setAttribute('elements-per-row', columns);
                    }

                    const lastRow = document.querySelector('ytd-rich-grid-row:last-child');
                    if (lastRow) {
                        lastRow.style.marginBottom = '0';
                        element.style.marginTop = '0';
                    }
                }
            } catch (error) {
            }
        });
    }

    function createSkeletonGrid(container, columns, rows) {
        if (!container) return;

        try {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            container.style.display = 'grid';
            container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            container.style.gridTemplateRows = `repeat(${rows}, auto)`;
            container.style.gap = `${CONFIG.GUTTER_SIZE}px`;
            container.style.padding = `0 ${CONFIG.GUTTER_SIZE/2}px`;
            container.style.width = '100%';
            container.style.boxSizing = 'border-box';

            container.style.setProperty('--ytd-rich-grid-items-per-row', columns, 'important');
            container.style.setProperty('--ytd-rich-grid-posts-per-row', columns, 'important');
            container.style.setProperty('--ytd-rich-grid-shorts-per-row', columns, 'important');
            container.style.setProperty('--ytd-rich-grid-slim-items-per-row', columns, 'important');

            if (
                container.id === 'continuation-skeleton' ||
                container.classList?.contains('rich-grid-skeleton-content') ||
                container.classList?.contains('rich-shelf-videos') ||
                container.id === 'skeleton'
            ) {
                const totalItems = columns * rows;
                for (let i = 0; i < totalItems; i++) {
                    const item = createSkeletonItem();
                    if (item) {
                        container.appendChild(item);
                    }
                }
            }
        } catch (error) {
        }
    }

    function createSkeletonItem() {
        const item = document.createElement('div');
        item.className = 'rich-shelf-video';
        item.style.width = '100%';
        item.style.margin = '0';
        item.style.borderRadius = '12px';
        item.style.overflow = 'hidden';

        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-container';
        thumbnail.style.width = '100%';
        thumbnail.style.aspectRatio = '16/9';
        thumbnail.style.backgroundColor = '#e0e0e0';
        thumbnail.style.borderRadius = '12px';
        thumbnail.style.marginBottom = '12px';
        item.appendChild(thumbnail);

        const details = document.createElement('div');
        details.className = 'video-details-container';
        details.style.width = '100%';

        const titleLine = document.createElement('div');
        titleLine.className = 'skeleton-line';
        titleLine.style.height = '12px';
        titleLine.style.width = '100%';
        titleLine.style.backgroundColor = '#e0e0e0';
        titleLine.style.borderRadius = '6px';
        titleLine.style.marginBottom = '8px';
        details.appendChild(titleLine);

        const channelLine = document.createElement('div');
        channelLine.className = 'skeleton-line';
        channelLine.style.height = '12px';
        channelLine.style.width = '60%';
        channelLine.style.backgroundColor = '#e0e0e0';
        channelLine.style.borderRadius = '6px';
        channelLine.style.marginBottom = '8px';
        details.appendChild(channelLine);

        item.appendChild(details);
        return item;
    }

    function adjustSkeletonItems(columns) {
        const skeletonElements = document.querySelectorAll(
            '#home-page-skeleton .rich-grid-skeleton-content, ' +
            '#home-page-skeleton .rich-shelf-videos, ' +
            '#search-page-skeleton .rich-shelf-videos, ' +
            'ytd-browse[page-subtype="home"] #skeleton .rich-shelf-videos, ' +
            'ytd-browse[page-subtype="home"] #skeleton .rich-grid-skeleton-content, ' +
            'ytd-browse[page-subtype="subscriptions"] #skeleton .rich-shelf-videos, ' +
            'ytd-browse[role="main"] #skeleton .rich-shelf-videos, ' +
            'ytd-search #skeleton .rich-shelf-videos'
        );

        const loadingSkeletonElements = document.querySelectorAll(
            'ytd-rich-grid-renderer #continuation-skeleton, ' +
            'ytd-rich-grid-renderer .rich-grid-skeleton-content, ' +
            '#contents ytd-continuation-item-renderer, ' +
            'ytd-rich-grid-renderer [role="progressbar"], ' +
            'ytd-browse[role="main"] #continuations, ' +
            'ytd-browse .loading-skeleton'
        );

        if (skeletonElements.length > 0) {
            skeletonElements.forEach((element) => {
                createSkeletonGrid(element, columns, 3);
            });
        }

        if (loadingSkeletonElements.length > 0) {
            adjustLoadingSkeletons(loadingSkeletonElements, columns);
        }
    }

    function adjustRegularSkeletons(skeletonElements, columns) {
        skeletonElements.forEach(element => {
            createSkeletonGrid(element, columns, 3);
        });
    }

    function detectScrollLoading() {
        let lastScrollY = window.scrollY;
        let scrollTimer;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);

            const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 800;

            if (scrolledToBottom) {
                const loadingSkeletons = document.querySelectorAll(
                    'ytd-rich-grid-renderer #continuation-skeleton, ' +
                    'ytd-rich-grid-renderer .rich-grid-skeleton-content, ' +
                    '#contents ytd-continuation-item-renderer, ' +
                    'ytd-rich-grid-renderer [role="progressbar"], ' +
                    'ytd-browse[role="main"] #continuations, ' +
                    'ytd-browse .loading-skeleton'
                );

                if (loadingSkeletons.length > 0) {
                    const columns = calculateOptimalColumns();
                    adjustLoadingSkeletons(loadingSkeletons, columns);

                    styleLoadingAreas(columns);
                }
            }

            scrollTimer = setTimeout(() => {
                if (window.scrollY !== lastScrollY) {
                    lastScrollY = window.scrollY;

                    setTimeout(() => {
                        adjustLayout();
                    }, 300);
                }
            }, 200);
        });
    }

    function styleLoadingAreas(columns) {
        const loadingAreas = [
            ...document.querySelectorAll('#contents ytd-continuation-item-renderer'),
            ...document.querySelectorAll('ytd-rich-grid-renderer #continuation-skeleton'),
            ...document.querySelectorAll('ytd-rich-grid-renderer .rich-grid-skeleton-content')
        ];

        if (loadingAreas.length === 0) return;

        loadingAreas.forEach(area => {
            area.style.width = '100%';
            area.style.margin = '0';
            area.style.padding = '0';
            area.style.boxSizing = 'border-box';

            area.style.setProperty('--ytd-rich-grid-items-per-row', columns, 'important');
            area.style.setProperty('--ytd-rich-grid-posts-per-row', columns, 'important');

            const lastRow = document.querySelector('ytd-rich-grid-row:last-child');
            if (lastRow) {
                lastRow.style.marginBottom = '0';
                area.style.marginTop = '0';
            }

            const spinner = area.querySelector('tp-yt-paper-spinner, yt-loading-icon');
            if (spinner) {
                spinner.style.margin = '16px auto';
                spinner.style.display = 'block';
            }
        });

        const contentsContainer = document.querySelector('ytd-rich-grid-renderer #contents');
        if (contentsContainer) {
            contentsContainer.style.padding = `0 ${CONFIG.GUTTER_SIZE/2}px`;
        }
    }

    function handleSkeletonPreload() {
        const skeletonObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    const addedNodes = Array.from(mutation.addedNodes);

                    for (const node of addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (
                            node.id === 'skeleton' ||
                            node.querySelector?.('#skeleton') ||
                            node.classList?.contains('rich-grid-skeleton-content') ||
                            node.id === 'home-page-skeleton' ||
                            node.id === 'continuation-skeleton'
                        ) {
                            const columns = calculateOptimalColumns();
                            createSkeletonGrid(node, columns, 3);
                        }
                    }
                }
            }
        });

        skeletonObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function earlyInterceptSkeleton() {
        const originalCreateElement = document.createElement;

        document.createElement = function(...args) {
            const element = originalCreateElement.apply(document, args);

            if (args[0].toLowerCase() === 'div') {
                setTimeout(() => {
                    if (
                        element.id === 'skeleton' ||
                        element.id === 'home-page-skeleton' ||
                        element.id === 'continuation-skeleton' ||
                        element.classList?.contains('rich-grid-skeleton-content')
                    ) {
                        const columns = calculateOptimalColumns();
                        createSkeletonGrid(element, columns, 3);
                    }
                }, 0);
            }

            return element;
        };
    }

    function injectInitialStyles() {
        if (initialStylesApplied) return;

        const columns = calculateOptimalColumns();

        const initialStyle = document.createElement('style');
        initialStyle.id = 'yt-grid-initial-styles';
        initialStyle.textContent = `
            ytd-rich-grid-renderer {
                elements-per-row: ${columns} !important;
                --ytd-rich-grid-items-per-row: ${columns} !important;
                --ytd-rich-grid-posts-per-row: ${columns} !important;
                --ytd-rich-grid-shorts-per-row: ${columns} !important;
                --ytd-rich-grid-slim-items-per-row: ${columns} !important;
                --ytd-rich-grid-game-cards-per-row: ${columns} !important;
                --ytd-rich-grid-mini-game-cards-per-row: ${columns} !important;
                --ytd-rich-grid-item-max-width: none !important;
                --ytd-rich-grid-item-min-width: ${CONFIG.ITEM_MIN_WIDTH}px !important;
            }

            #home-page-skeleton .rich-shelf-videos,
            #home-page-skeleton .rich-grid-skeleton-content,
            #search-page-skeleton .rich-shelf-videos,
            ytd-browse[page-subtype="home"] #skeleton,
            ytd-browse[page-subtype="subscriptions"] #skeleton,
            ytd-browse[role="main"] #skeleton,
            ytd-search #skeleton,
            ytd-rich-grid-renderer #continuation-skeleton,
            ytd-rich-grid-renderer .rich-grid-skeleton-content {
                display: grid !important;
                grid-template-columns: repeat(${columns}, 1fr) !important;
                grid-template-rows: repeat(3, auto) !important;
                gap: ${CONFIG.GUTTER_SIZE}px !important;
                width: 100% !important;
                padding: 0 ${CONFIG.GUTTER_SIZE/2}px !important;
                box-sizing: border-box !important;
                margin-bottom: 16px !important;
                --ytd-rich-grid-items-per-row: ${columns} !important;
                --ytd-rich-grid-posts-per-row: ${columns} !important;
                --ytd-rich-grid-shorts-per-row: ${columns} !important;
                --ytd-rich-grid-slim-items-per-row: ${columns} !important;
            }

            ytd-rich-grid-renderer #continuation-skeleton,
            ytd-rich-grid-renderer .rich-grid-skeleton-content {
                margin-top: 0 !important;
                padding-top: 0 !important;
                border-top: none !important;
            }

            #home-page-skeleton .rich-shelf-video,
            #search-page-skeleton .video-card,
            ytd-browse[page-subtype="home"] #skeleton .rich-shelf-video,
            ytd-browse[page-subtype="subscriptions"] #skeleton .rich-shelf-video,
            ytd-browse[role="main"] #skeleton .rich-shelf-video,
            ytd-search #skeleton .video-card,
            ytd-rich-grid-renderer #continuation-skeleton .rich-shelf-video,
            ytd-rich-grid-renderer .rich-grid-skeleton-content .rich-shelf-video {
                width: 100% !important;
                margin: 0 !important;
                height: auto !important;
                box-sizing: border-box !important;
                border-radius: 12px !important;
                overflow: hidden !important;
                transition: opacity 0.3s ease !important;
            }

            .skeleton-line {
                height: 12px !important;
                background-color: #e0e0e0 !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
            }

            #home-page-skeleton .thumbnail-container,
            #home-page-skeleton .video-details-container,
            #search-page-skeleton .thumbnail-container,
            #search-page-skeleton .video-details-container,
            ytd-browse #skeleton .thumbnail-container,
            ytd-browse #skeleton .video-details-container,
            ytd-search #skeleton .thumbnail-container,
            ytd-search #skeleton .video-details-container,
            ytd-rich-grid-renderer #continuation-skeleton .thumbnail-container,
            ytd-rich-grid-renderer #continuation-skeleton .video-details-container,
            ytd-rich-grid-renderer .rich-grid-skeleton-content .thumbnail-container,
            ytd-rich-grid-renderer .rich-grid-skeleton-content .video-details-container {
                width: 100% !important;
                border-radius: 12px !important;
                overflow: hidden !important;
            }

            ytd-rich-grid-row:last-of-type {
                margin-bottom: 0 !important;
            }

            ytd-rich-grid-row {
                --ytd-rich-grid-items-per-row: ${columns} !important;
                --ytd-rich-grid-posts-per-row: ${columns} !important;
                --ytd-rich-grid-shorts-per-row: ${columns} !important;
                --ytd-rich-grid-slim-items-per-row: ${columns} !important;
            }
        `;

        document.head.appendChild(initialStyle);
        initialStylesApplied = true;

        lastAppliedColumns = columns;

        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                updateDOMAttributes(columns);
            }, 0);
        });
    }

    function calculateOptimalColumns() {
        const windowWidth = window.innerWidth;

        const contentWidth = getActualContentWidth();

        const maxPossibleColumns = Math.floor(contentWidth / CONFIG.ITEM_MIN_WIDTH);

        const preferredColumns = Math.floor(contentWidth / CONFIG.ITEM_PREFERRED_WIDTH);

        let finalColumns;

        if (contentWidth >= 1400) {
            finalColumns = 5;
        } else if (contentWidth >= 1100) {
            finalColumns = 4;
        } else if (contentWidth >= 800) {
            finalColumns = 3;
        } else if (contentWidth >= 500) {
            finalColumns = 2;
        } else {
            finalColumns = 1;
        }

        finalColumns = Math.max(
            CONFIG.MIN_ITEMS_PER_ROW,
            Math.min(finalColumns, CONFIG.MAX_ITEMS_PER_ROW, maxPossibleColumns)
        );

        return finalColumns;
    }

    function getActualContentWidth() {
        const contentContainer = document.querySelector(
            'ytd-rich-grid-renderer #contents, ' +
            'ytd-two-column-browse-results-renderer #primary, ' +
            '.ytd-rich-grid-renderer'
        );

        if (contentContainer && contentContainer.clientWidth > 50) {
            return contentContainer.clientWidth - (CONFIG.GUTTER_SIZE * 2);
        }

        const windowWidth = window.innerWidth;
        let contentWidth = windowWidth;

        const isMiniguideMode = document.documentElement.hasAttribute('miniguide');
        const isSidebarCollapsed = document.documentElement.getAttribute('menu-expanded') === 'false';

        if (windowWidth > 1000) {
            if (isMiniguideMode || isSidebarCollapsed) {
                contentWidth -= (CONFIG.SIDEBAR_WIDTH_COLLAPSED + CONFIG.SIDE_PADDING);
            } else {
                contentWidth -= (CONFIG.SIDEBAR_WIDTH_EXPANDED + CONFIG.SIDE_PADDING);
            }
        } else {
            contentWidth -= (CONFIG.SIDEBAR_WIDTH_COLLAPSED + CONFIG.SIDE_PADDING/2);
        }

        contentWidth -= CONFIG.SIDE_PADDING;

        return contentWidth;
    }

    function initializeStyles() {
        if (stylesInitialized) return;

        const baseStyle = document.createElement('style');
        baseStyle.id = 'yt-grid-base-styles';
        document.head.appendChild(baseStyle);

        const dynamicStyle = document.createElement('style');
        dynamicStyle.id = 'yt-grid-dynamic-styles';
        document.head.appendChild(dynamicStyle);

        stylesInitialized = true;
    }

    function applyGridLayout(columns) {
        if (columns === lastAppliedColumns && lastAppliedColumns !== 0 && stylesInitialized) {
            return;
        }

        if (!stylesInitialized) {
            initializeStyles();
        }

        lastAppliedColumns = columns;

        const baseStyle = document.getElementById('yt-grid-base-styles');
        const dynamicStyle = document.getElementById('yt-grid-dynamic-styles');

        if (baseStyle && !baseStyle.textContent) {
            baseStyle.textContent = `
                ytd-rich-item-renderer,
                ytd-grid-renderer ytd-grid-video-renderer,
                ytd-shelf-renderer,
                ytd-expanded-shelf-contents-renderer {
                    transition: width 0.2s ease, padding 0.2s ease, opacity 0.3s ease !important;
                }

                ytd-thumbnail {
                    width: 100% !important;
                    margin: 0 !important;
                }

                ytd-rich-item-renderer #content,
                ytd-rich-item-renderer #details,
                ytd-rich-item-renderer #meta,
                ytd-grid-video-renderer #content,
                ytd-grid-video-renderer #details,
                ytd-grid-video-renderer #meta {
                    width: 100% !important;
                }

                ytd-rich-grid-renderer[use-legacy-style-for-rich-grid],
                ytd-rich-grid-row {
                    --ytd-rich-grid-items-per-row: ${columns} !important;
                    --ytd-rich-grid-posts-per-row: ${columns} !important;
                    --ytd-rich-grid-shorts-per-row: ${columns} !important;
                    --ytd-rich-grid-slim-items-per-row: ${columns} !important;
                    --ytd-rich-grid-game-cards-per-row: ${columns} !important;
                    --ytd-rich-grid-mini-game-cards-per-row: ${columns} !important;

                    --ytd-rich-grid-item-max-width: none !important;
                    --ytd-rich-grid-item-min-width: ${CONFIG.ITEM_MIN_WIDTH}px !important;
                }

                #home-page-skeleton .rich-shelf-videos,
                #home-page-skeleton .rich-grid-skeleton-content,
                #search-page-skeleton .rich-shelf-videos,
                ytd-browse[page-subtype="home"] #skeleton .rich-shelf-videos,
                ytd-browse[page-subtype="home"] #skeleton .rich-grid-skeleton-content,
                ytd-browse[page-subtype="subscriptions"] #skeleton .rich-shelf-videos,
                ytd-browse[role="main"] #skeleton .rich-shelf-videos,
                ytd-search #skeleton .rich-shelf-videos,
                ytd-rich-grid-renderer #continuation-skeleton,
                ytd-rich-grid-renderer .rich-grid-skeleton-content {
                    display: grid !important;
                    gap: ${CONFIG.GUTTER_SIZE}px !important;
                    width: 100% !important;
                    padding: 0 ${CONFIG.GUTTER_SIZE/2}px !important;
                    box-sizing: border-box !important;
                    grid-template-columns: repeat(${columns}, 1fr) !important;
                    grid-template-rows: repeat(3, auto) !important;
                }

                ytd-continuation-item-renderer {
                    width: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    display: block !important;
                }

                ytd-continuation-item-renderer yt-loading-icon,
                ytd-continuation-item-renderer tp-yt-paper-spinner {
                    margin: 16px auto !important;
                    display: block !important;
                }

                ytd-rich-grid-renderer #contents {
                    padding: 0 ${CONFIG.GUTTER_SIZE/2}px !important;
                }
            `;
        }

        if (dynamicStyle) {
            dynamicStyle.textContent = `
                ytd-rich-grid-renderer,
                ytd-rich-grid-row,
                ytd-rich-section-renderer,
                ytd-quad-section-renderer,
                ytd-expanded-shelf-contents-renderer {
                    --ytd-rich-grid-items-per-row: ${columns} !important;
                    --ytd-rich-grid-posts-per-row: ${columns} !important;
                    --ytd-rich-grid-shorts-per-row: ${columns} !important;
                    --ytd-rich-grid-slim-items-per-row: ${columns} !important;
                    --ytd-rich-grid-game-cards-per-row: ${columns} !important;
                    --ytd-rich-grid-mini-game-cards-per-row: ${columns} !important;
                }

                ytd-rich-item-renderer,
                ytd-grid-video-renderer,
                ytd-compact-video-renderer,
                ytd-grid-movie-renderer,
                ytd-grid-playlist-renderer,
                ytd-grid-channel-renderer {
                    width: calc(100% / ${columns}) !important;
                    max-width: none !important;
                    min-width: ${CONFIG.ITEM_MIN_WIDTH}px !important;
                    margin: 0 !important;
                    padding: 0 ${CONFIG.GUTTER_SIZE/2}px ${CONFIG.GUTTER_SIZE}px !important;
                    box-sizing: border-box !important;
                }

                ytd-rich-grid-row {
                    margin-bottom: ${CONFIG.GUTTER_SIZE}px !important;
                }

                ytd-rich-grid-renderer #continuation-skeleton,
                ytd-rich-grid-renderer .rich-grid-skeleton-content {
                    grid-template-columns: repeat(${columns}, 1fr) !important;
                    grid-template-rows: repeat(3, auto) !important;
                }

                ytd-continuation-item-renderer {
                    margin-top: 0 !important;
                    padding-top: 0 !important;
                    border-top: none !important;
                }

                ytd-rich-grid-row:last-child {
                    margin-bottom: 0 !important;
                }
            `;

            adjustSkeletonItems(columns);
        }

        updateDOMAttributes(columns);
    }

    function updateDOMAttributes(columns) {
        const renderers = document.querySelectorAll('ytd-rich-grid-renderer');

        renderers.forEach(renderer => {
            renderer.setAttribute('elements-per-row', columns);

            renderer.style.setProperty('--ytd-rich-grid-items-per-row', columns, 'important');
            renderer.style.setProperty('--ytd-rich-grid-posts-per-row', columns, 'important');
            renderer.style.setProperty('--ytd-rich-grid-shorts-per-row', columns, 'important');
            renderer.style.setProperty('--ytd-rich-grid-slim-items-per-row', columns, 'important');
            renderer.style.setProperty('--ytd-rich-grid-game-cards-per-row', columns, 'important');
            renderer.style.setProperty('--ytd-rich-grid-mini-game-cards-per-row', columns, 'important');

            renderer.style.setProperty('--ytd-rich-grid-item-max-width', 'none', 'important');
            renderer.style.setProperty('--ytd-rich-grid-item-min-width', `${CONFIG.ITEM_MIN_WIDTH}px`, 'important');
        });

        const rows = document.querySelectorAll('ytd-rich-grid-row');
        rows.forEach(row => {
            row.style.setProperty('--ytd-rich-grid-items-per-row', columns, 'important');
            row.style.setProperty('--ytd-rich-grid-posts-per-row', columns, 'important');
            row.style.setProperty('--ytd-rich-grid-shorts-per-row', columns, 'important');
            row.style.setProperty('--ytd-rich-grid-slim-items-per-row', columns, 'important');
        });

        const skeletons = document.querySelectorAll('#continuation-skeleton, .rich-grid-skeleton-content');
        skeletons.forEach(skeleton => {
            skeleton.style.setProperty('--ytd-rich-grid-items-per-row', columns, 'important');
            skeleton.style.setProperty('--ytd-rich-grid-posts-per-row', columns, 'important');
        });
    }

    function detectViewChanges() {
        const targetNode = document.body;

        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['elements-per-row', 'style']
        };

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (node.tagName === 'YTD-RICH-GRID-RENDERER' ||
                            node.querySelector?.('ytd-rich-grid-renderer')) {
                            const columns = lastAppliedColumns || calculateOptimalColumns();
                            updateDOMAttributes(columns);
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'elements-per-row' ||
                        mutation.attributeName === 'style') {
                        const target = mutation.target;

                        if (target.tagName === 'YTD-RICH-GRID-RENDERER') {
                            const columns = lastAppliedColumns || calculateOptimalColumns();
                            if (target.getAttribute('elements-per-row') != columns) {
                                setTimeout(() => {
                                    updateDOMAttributes(columns);
                                    adjustLayout();
                                }, 10);
                            }
                        }
                    }
                }
            }
        });

        observer.observe(targetNode, config);
    }

    function handleVideoLoading() {
        const skeletonObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (
                            node.id === 'continuation-skeleton' ||
                            node.classList?.contains('rich-grid-skeleton-content')
                        ) {
                            setTimeout(() => {
                                const columns = calculateOptimalColumns();
                                createSkeletonGrid(node, columns, 3);
                                updateDOMAttributes(columns);

                                const lastRow = document.querySelector('ytd-rich-grid-row:last-child');
                                if (lastRow) {
                                    lastRow.style.marginBottom = '0';
                                    node.style.marginTop = '0';
                                    node.style.paddingTop = '0';
                                }
                            }, 0);
                        }
                    }

                    for (const node of mutation.removedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (
                            node.id === 'continuation-skeleton' ||
                            node.classList?.contains('rich-grid-skeleton-content')
                        ) {
                            setTimeout(() => {
                                adjustLayout();
                            }, 50);
                        }
                    }
                }
            }
        });

        skeletonObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        const contentObserver = new MutationObserver((mutations) => {
            let newContentAdded = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (node.tagName === 'YTD-RICH-ITEM-RENDERER' ||
                            node.tagName === 'YTD-RICH-GRID-ROW' ||
                            node.querySelector?.('ytd-rich-item-renderer')) {
                            newContentAdded = true;
                            break;
                        }
                    }

                    for (const node of mutation.removedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (node.id === 'continuation-skeleton' ||
                            node.classList?.contains('rich-grid-skeleton-content')) {
                            newContentAdded = true;
                            break;
                        }
                    }
                }

                if (newContentAdded) break;
            }

            if (newContentAdded) {
                setTimeout(() => {
                    adjustLayout();
                }, 100);
            }
        });

        const contentContainer = document.querySelector('ytd-app');
        if (contentContainer) {
            contentObserver.observe(contentContainer, {
                childList: true,
                subtree: true
            });
        }

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateDOMAttributes(lastAppliedColumns || calculateOptimalColumns());
            }, 150);
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    adjustLayout();
                    updateDOMAttributes(lastAppliedColumns || calculateOptimalColumns());
                }, 300);
            }
        });
    }

    function adjustLayout() {
        const columns = calculateOptimalColumns();
        applyGridLayout(columns);
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function initialize() {
        injectInitialStyles();

        handleSkeletonPreload();

        handleVideoLoading();

        applyShortsVisibility();

        adjustLayout();

        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth !== lastWindowWidth) {
                lastWindowWidth = window.innerWidth;
                adjustLayout();
            }
        }, 150));

        detectViewChanges();

        detectScrollLoading();

        document.addEventListener('yt-navigate-finish', () => {
            setTimeout(() => {
                applyShortsVisibility();
                adjustLayout();
            }, 300);
        });

        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            setTimeout(() => {
                applyShortsVisibility();
                adjustLayout();
            }, 300);
        };

        window.addEventListener('popstate', () => {
            setTimeout(() => {
                applyShortsVisibility();
                adjustLayout();
            }, 300);
        });

        setInterval(() => {
            adjustLayout();
        }, 2000);
    }

    earlyInterceptSkeleton();

    injectInitialStyles();

    applyShortsVisibility();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();