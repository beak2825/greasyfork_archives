// ==UserScript==
// @name         LinuxDo论坛小涵自用脚本
// @namespace    https://linux.do/u/xiaohan17/summary
// @version      0.0.1
// @description  优化 linux.do 论坛布局动态加载；悬停链接后按空格弹窗预览(最小化/最大化/关闭)
// @license      GPL-3.0-or-later
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527768/LinuxDo%E8%AE%BA%E5%9D%9B%E5%B0%8F%E6%B6%B5%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527768/LinuxDo%E8%AE%BA%E5%9D%9B%E5%B0%8F%E6%B6%B5%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 1. 布局优化 & 动态内容监控 ====================
    const style = document.createElement('style');
    style.textContent = `
        /* ========== 论坛布局优化相关 ========== */
        /* 隐藏发帖者列 */
        .topic-list .topic-list-data.posters {
            display: none !important;
        }
        /* 隐藏浏览量和回复数列 */
        .topic-list .topic-list-data.views,
        .topic-list .topic-list-data.posts {
            display: none !important;
        }
        /* 强制显示主题列表表头 */
        .topic-list-header {
            display: table-header-group !important;
        }
        /* 统计图标样式 */
        .stats-icon {
            width: 14px;
            height: 14px;
            vertical-align: middle;
            margin-right: 2px;
        }
        .stats-count {
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
            color: #666;
            font-size: 12px;
        }
        .stats-container {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-left: 8px;
        }
        /* 让 show-more 按钮铺满一行、保持在正常文档流中 */
        .show-more.has-topics {
            position: relative !important;
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 0 10px 0 !important;
            border: 1px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .show-more.has-topics a {
            padding: 8px 15px;
            display: block;
            text-align: center;
            color: #0066cc !important;
            font-size: 14px;
            text-decoration: none !important;
        }
        .show-more.has-topics a:hover {
            background: #e9ecef;
            text-decoration: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function initializeEnhancedLayout() {
        // 生成统计容器(浏览量/回复数)
        function processStats(row) {
            if (row.dataset.statsProcessed) return;
            let anchor = row.querySelector('.discourse-tags');
            if (!anchor) {
                const badge = row.querySelector('.link-bottom-line .badge-category__wrapper');
                if (badge) {
                    anchor = badge;
                } else {
                    anchor = row.querySelector('.link-bottom-line');
                }
            }
            if (anchor && (!anchor.nextElementSibling || !anchor.nextElementSibling.classList.contains('stats-container'))) {
                const viewsCell = row.querySelector('.views');
                const postsCell = row.querySelector('.posts');
                const viewsCount = viewsCell?.querySelector('.number')?.textContent?.trim();
                const postsCount = postsCell?.querySelector('.number')?.textContent?.trim();
                if (viewsCount || postsCount) {
                    const statsContainer = document.createElement('div');
                    statsContainer.className = 'stats-container';
                    if (viewsCount) {
                        const viewsSpan = document.createElement('span');
                        viewsSpan.className = 'stats-count';
                        viewsSpan.innerHTML = `
                            <svg class="stats-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                              <path d="M512 237.568c-270.6432 0-409.6 274.432-409.6 274.432s104.8576 274.432 409.6 274.432c275.968 0 409.6-273.3568 409.6-273.3568S786.944 237.568 512 237.568z m0.6144 445.952c-98.9696 0-170.496-75.0592-170.496-171.52s71.68-171.52 170.496-171.52 170.496 75.008 170.496 171.52-71.68 171.52-170.496 171.52z m0-274.4832a102.9632 102.9632 0 1 0 102.4 102.9632 103.8336 103.8336 0 0 0-102.4-102.9632z" fill="#666666"/>
                            </svg>
                            ${viewsCount}
                        `;
                        statsContainer.appendChild(viewsSpan);
                    }
                    if (postsCount) {
                        const postsSpan = document.createElement('span');
                        postsSpan.className = 'stats-count';
                        postsSpan.innerHTML = `
                            <svg class="stats-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                              <path d="M356.126 735.19c22.654-3.926 42.96-4.366 63.686 1.068C449.358 744.006 480.312 748 512 748c173.682 0 310-119.278 310-260 0-140.722-136.318-260-310-260s-310 119.278-310 260c0 65.1 28.846 126.948 81.14 175.018 22.016 20.238 32.164 45.3 35.566 72.908a163.2 163.2 0 0 1 0.786 8.044c13.228-3.896 25.37-6.828 36.634-8.78zM512 838c-39.98 0-78.592-5.132-115.02-14.686-23.648-6.2-88.642 15.36-194.98 64.686 28.444-92.068 35.188-144.976 20.232-158.724C153.926 666.49 112 581.53 112 488c0-193.3 179.086-350 400-350s400 156.7 400 350-179.086 350-400 350z m-159-304c-24.852 0-45-20.148-45-45s20.148-45 45-45 45 20.148 45 45-20.148 45-45 45z m160 0c-24.852 0-45-20.148-45-45s20.148-45 45-45 45 20.148 45 45-20.148 45-45 45z m160 0c-24.852 0-45-20.148-45-45s20.148-45 45-45 45 20.148 45 45-20.148 45-45 45z" fill="#666666"/>
                            </svg>
                            ${postsCount}
                        `;
                        statsContainer.appendChild(postsSpan);
                    }
                    anchor.insertAdjacentElement('afterend', statsContainer);
                }
            }
            row.dataset.statsProcessed = 'true';
        }

        function processRowImmediate(row) {
            processStats(row);
        }

        function processAllRows() {
            const rows = document.querySelectorAll('.topic-list-item');
            rows.forEach(row => {
                processRowImmediate(row);
            });
        }

        function moveShowMoreAlert() {
            const showMore = document.querySelector('.show-more.has-topics');
            const topicTable = document.querySelector('.topic-list');
            if (showMore && topicTable && showMore.parentNode !== topicTable.parentNode) {
                topicTable.parentNode.insertBefore(showMore, topicTable);
            }
        }

        function handleShowMore() {
            const showMoreBtn = document.querySelector('.show-more.has-topics a');
            if (showMoreBtn && !showMoreBtn.dataset.listenerAdded) {
                showMoreBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        processAllRows();
                    }, 200);
                }, false);
                showMoreBtn.dataset.listenerAdded = 'true';
            }
        }

        function setupDynamicContentHandler() {
            const ioOptions = {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            };
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        processRowImmediate(entry.target);
                    }
                });
            }, ioOptions);

            function observeNewRows() {
                const rows = document.querySelectorAll('.topic-list-item:not([data-observed])');
                rows.forEach(row => {
                    io.observe(row);
                    row.dataset.observed = 'true';
                });
            }

            const mutationCallback = debounce((mutationsList) => {
                let shouldProcess = false;
                mutationsList.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList.contains('topic-list-item') ||
                                node.querySelector?.('.topic-list-item') ||
                                node.classList.contains('show-more') ||
                                node.querySelector?.('.show-more')) {
                                shouldProcess = true;
                            }
                        }
                    });
                });
                if (shouldProcess) {
                    moveShowMoreAlert();
                    observeNewRows();
                    processAllRows();
                    handleShowMore();
                }
            }, 300);

            const container = document.querySelector('.topic-list')?.parentNode || document.body;
            const mo = new MutationObserver(mutationCallback);
            mo.observe(container, {
                childList: true,
                subtree: true
            });

            return () => {
                io.disconnect();
                mo.disconnect();
            };
        }

        moveShowMoreAlert();
        processAllRows();
        handleShowMore();
        const cleanupDynamic = setupDynamicContentHandler();

        // 周期性检查
        const periodicCheck = setInterval(processAllRows, 2000);

        function onPopState() {
            moveShowMoreAlert();
            processAllRows();
            handleShowMore();
        }
        window.addEventListener('popstate', onPopState);

        window.addEventListener('unload', () => {
            cleanupDynamic();
            clearInterval(periodicCheck);
            window.removeEventListener('popstate', onPopState);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeEnhancedLayout, 100);
        });
    } else {
        setTimeout(initializeEnhancedLayout, 100);
    }

    // ==================== 2. 弹窗预览链接功能 ====================
    (function(){
        'use strict';

        // ========== A. 基础样式(遮罩层 & 弹窗容器) ==========
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            /* 遮罩层 */
            #custom-modal-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: none; /* 初始隐藏 */
                pointer-events: auto;
            }
            /* 弹窗容器(默认normal) - 放在 overlay 内 */
            #custom-modal {
                position: absolute;
                left: 10%;
                top: 10%;
                width: 80%;
                height: 80%;
                background: #fff;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                z-index: 10000; /* 保证弹窗本身在最前 */
            }
            /* 顶部header - 我们将使用flex布局，以便中间能放一个链接 */
            #custom-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between; /* 左右两边对齐 */
                height: 30px;
                background: #f0f0f0;
                padding: 0 10px;
                border-bottom: 1px solid #ddd;
                cursor: move;
            }
            #custom-modal-header .header-left a {
                margin: 0 20px;
                text-decoration: none;
                color: #0077AA;
            }
            #custom-modal-header .header-right button {
                background: none;
                border: none;
                font-size: 16px;
                margin-left: 8px;
                cursor: pointer;
            }
            /* iframe 区域 */
            #custom-modal iframe {
                flex-grow: 1;
                width: 100%;
                border: none;
                display: block;
            }
            /* 右下角拖拽手柄 */
            #custom-modal-resizer {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 16px;
                height: 16px;
                cursor: se-resize;
                background: transparent;
            }
        `;
        document.documentElement.appendChild(modalStyle);

        // ========== B. 全局变量与初始状态 ==========
        let currentState = 'normal'; // normal, minimized, maximized
        let overlay = null;
        let modal = null;
        let header = null;
        let iframe = null;
        let resizer = null;

        let linkXiaohan17 = null;

        let normalRect = {
            left: '10%',
            top: '10%',
            width: '80%',
            height: '80%'
        };

        // 随机跳转链接数组
        const linkTargets = [
            'https://linux.do/u/xiaohan17/summary',
            'https://www.violet17.com/'
        ];
        function getRandomLink() {
            const idx = Math.floor(Math.random() * linkTargets.length);
            return linkTargets[idx];
        }

        // ========== C. 打开弹窗(只在首次时创建DOM) ==========
        function openModal(url) {
            if (!overlay) {
                // 1) 遮罩层
                overlay = document.createElement('div');
                overlay.id = 'custom-modal-overlay';

                // 2) 弹窗
                modal = document.createElement('div');
                modal.id = 'custom-modal';

                // 3) header
                header = document.createElement('div');
                header.id = 'custom-modal-header';

                const headerLeft = document.createElement('div');
                headerLeft.className = 'header-left';

                // xiaohan17 链接(随机跳转)
                linkXiaohan17 = document.createElement('a');
                linkXiaohan17.textContent = 'xiaohan17';
                linkXiaohan17.href = '#';
                linkXiaohan17.target = '_blank';
                linkXiaohan17.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(getRandomLink(), '_blank');
                });
                headerLeft.appendChild(linkXiaohan17);

                // header右侧
                const headerRight = document.createElement('div');
                headerRight.className = 'header-right';

                // 按钮：最小化、最大化、关闭
                const btnMinimize = document.createElement('button');
                btnMinimize.innerHTML = '–';
                const btnMaximize = document.createElement('button');
                btnMaximize.innerHTML = '□';
                const btnClose = document.createElement('button');
                btnClose.innerHTML = '×';

                headerRight.appendChild(btnMinimize);
                headerRight.appendChild(btnMaximize);
                headerRight.appendChild(btnClose);

                // 组装 header
                header.appendChild(headerLeft);
                header.appendChild(headerRight);

                // 4) iframe
                iframe = document.createElement('iframe');

                // 5) 右下角拖拽
                resizer = document.createElement('div');
                resizer.id = 'custom-modal-resizer';

                modal.appendChild(header);
                modal.appendChild(iframe);
                modal.appendChild(resizer);
                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                // ---------- 按钮事件 ----------
                btnClose.addEventListener('click', () => {
                    closeModal();
                });
                btnMaximize.addEventListener('click', () => {
                    if (currentState === 'maximized') {
                        restoreToNormal();
                    } else if (currentState === 'minimized') {
                        restoreToNormal();
                    } else {
                        maximizeModal();
                    }
                });
                btnMinimize.addEventListener('click', () => {
                    if (currentState === 'minimized') {
                        restoreToNormal();
                    } else {
                        minimizeModal();
                    }
                });

                // ========== header拖动 ==========
                let isDragging = false;
                let dragOffsetX = 0;
                let dragOffsetY = 0;

                header.addEventListener('mousedown', (e) => {
                    if (currentState !== 'maximized') {
                        isDragging = true;
                        const rect = modal.getBoundingClientRect();
                        dragOffsetX = e.clientX - rect.left;
                        dragOffsetY = e.clientY - rect.top;
                    }
                });
                document.addEventListener('mousemove', (e) => {
                    if (isDragging && currentState !== 'maximized') {
                        e.preventDefault();
                        let newLeft = e.clientX - dragOffsetX;
                        let newTop = e.clientY - dragOffsetY;
                        modal.style.left = newLeft + 'px';
                        modal.style.top = newTop + 'px';
                    }
                });
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });

                // ========== 右下角拖拽大小 ==========
                let isResizing = false;
                let resizeStartX = 0;
                let resizeStartY = 0;
                let startWidth = 0;
                let startHeight = 0;

                resizer.addEventListener('mousedown', (e) => {
                    if (currentState === 'normal') {
                        e.preventDefault();
                        isResizing = true;
                        const rect = modal.getBoundingClientRect();
                        resizeStartX = e.clientX;
                        resizeStartY = e.clientY;
                        startWidth = rect.width;
                        startHeight = rect.height;
                    }
                });
                document.addEventListener('mousemove', (e) => {
                    if (isResizing && currentState === 'normal') {
                        e.preventDefault();
                        let newWidth = startWidth + (e.clientX - resizeStartX);
                        let newHeight = startHeight + (e.clientY - resizeStartY);
                        if (newWidth < 300) newWidth = 300;
                        if (newHeight < 150) newHeight = 150;
                        modal.style.width = newWidth + 'px';
                        modal.style.height = newHeight + 'px';
                    }
                });
                document.addEventListener('mouseup', () => {
                    isResizing = false;
                });
            }

            // 打开 => normal 状态
            currentState = 'normal';
            overlay.style.display = 'block';
            overlay.style.background = 'rgba(0,0,0,0.5)';
            overlay.style.pointerEvents = 'auto';

            modal.style.display = 'flex';
            modal.style.position = 'absolute';
            modal.style.left = normalRect.left;
            modal.style.top = normalRect.top;
            modal.style.width = normalRect.width;
            modal.style.height = normalRect.height;
            modal.style.borderRadius = '8px';

            if (iframe.src !== url) {
                iframe.src = url;
            }
            iframe.style.display = 'block';

            updateHeaderLinkVisibility();
        }

        function updateHeaderLinkVisibility() {
            if (!linkXiaohan17) return;
            if (currentState === 'normal' || currentState === 'maximized') {
                linkXiaohan17.style.display = 'inline-block';
            } else {
                linkXiaohan17.style.display = 'none';
            }
        }

        // ========== 关闭 ==========
        function closeModal() {
            if (!overlay) return;
            overlay.style.display = 'none';
        }

        // ========== 最大化 ==========
        function maximizeModal() {
            if (!modal) return;
            if (currentState === 'normal') {
                const rect = modal.getBoundingClientRect();
                normalRect.left = rect.left + 'px';
                normalRect.top = rect.top + 'px';
                normalRect.width = rect.width + 'px';
                normalRect.height = rect.height + 'px';
            }
            currentState = 'maximized';
            overlay.style.background = 'rgba(0,0,0,0.5)';
            overlay.style.pointerEvents = 'auto';

            modal.style.left = '0px';
            modal.style.top = '0px';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.borderRadius = '0';
            iframe.style.display = 'block';

            updateHeaderLinkVisibility();
        }

        // ========== 还原 normal ==========
        function restoreToNormal() {
            if (!modal) return;
            currentState = 'normal';
            overlay.style.background = 'rgba(0,0,0,0.5)';
            overlay.style.pointerEvents = 'auto';

            modal.style.display = 'flex';
            modal.style.position = 'absolute';
            modal.style.left = normalRect.left;
            modal.style.top = normalRect.top;
            modal.style.width = normalRect.width;
            modal.style.height = normalRect.height;
            modal.style.borderRadius = '8px';
            iframe.style.display = 'block';

            updateHeaderLinkVisibility();
        }

        // ========== 最小化 ==========
        function minimizeModal() {
            if (!modal) return;
            if (currentState === 'normal') {
                const rect = modal.getBoundingClientRect();
                normalRect.left = rect.left + 'px';
                normalRect.top = rect.top + 'px';
                normalRect.width = rect.width + 'px';
                normalRect.height = rect.height + 'px';
            }
            currentState = 'minimized';

            overlay.style.background = 'transparent';
            overlay.style.pointerEvents = 'none';

            modal.style.display = 'flex';
            modal.style.pointerEvents = 'auto';
            modal.style.position = 'absolute';
            modal.style.width = '300px';
            modal.style.height = '30px';
            modal.style.borderRadius = '4px';
            modal.style.left = (window.innerWidth - 310) + 'px';
            modal.style.top = (window.innerHeight - 40) + 'px';

            iframe.style.display = 'none';

            updateHeaderLinkVisibility();
        }

        // ========== 拦截空格按键，若非输入域则弹窗 ==========
        document.addEventListener('keydown', function(e) {
            // 如果正在输入框/文本域/可编辑内容中，就不阻止空格
            const tagName = e.target.tagName?.toLowerCase();
            const isEditable = e.target.isContentEditable;
            if (
                tagName === 'input' ||
                tagName === 'textarea' ||
                isEditable
            ) {
                return; // 让空格在输入时生效
            }

            // 否则执行弹窗逻辑
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();

                // 判断悬停的链接
                const hoveredElements = document.querySelectorAll(':hover');
                let hoveredLink = null;
                hoveredElements.forEach(el => {
                    if (el.tagName?.toLowerCase() === 'a' && el.href) {
                        hoveredLink = el;
                    }
                });
                if (hoveredLink) {
                    openModal(hoveredLink.href);
                }
            }
        }, false);

    })();
})();
