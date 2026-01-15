// ==UserScript==
// @name 增強漫畫櫃 (記憶列表捲動版)
// @namespace http://tampermonkey.net/
// @version 1.5
// @description 漫畫櫃自動隐藏頂部元素、中鍵捲動頁面、圖片高寬調整、自動切換上下一章、更改cookie、簡易觸控手勢、Backspace及觸控下滑在漫畫頁面時回目錄，在目錄時回進入目錄之前（支援更新/排行/連載列表位置記憶）
// @license MIT
// @match *://www.manhuagui.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/528611/%E5%A2%9E%E5%BC%B7%E6%BC%AB%E7%95%AB%E6%AB%83%20%28%E8%A8%98%E6%86%B6%E5%88%97%E8%A1%A8%E6%8D%B2%E5%8B%95%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528611/%E5%A2%9E%E5%BC%B7%E6%BC%AB%E7%95%AB%E6%AB%83%20%28%E8%A8%98%E6%86%B6%E5%88%97%E8%A1%A8%E6%8D%B2%E5%8B%95%E7%89%88%29.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // 禁用 tbBox.live
    function disableTbBoxLive() {
        $('#tbBox').off && $('#tbBox').off();
        $('#tbBox').die && $('#tbBox').die();
    }

    $(document).ready(disableTbBoxLive);

    new MutationObserver(() => {
        $('#tbBox').length && disableTbBoxLive();
    }).observe(document.body, { childList: true, subtree: true });
})(window.jQuery);

(function() {
    'use strict';

    const LIST_STATE_KEY = 'manga_list_state';

    // --- 列表頁：記錄與恢復捲動位置 ---
    function handleListState() {
        const currentUrl = window.location.href;
        const isListPage = /manhuagui\.com\/(update|rank|list\/lianzai)\//.test(currentUrl);

        if (isListPage) {
            // 恢復位置
            const savedState = JSON.parse(localStorage.getItem(LIST_STATE_KEY));
            if (savedState && savedState.url === currentUrl) {
                // 等待圖片載入後再捲動，確保高度正確
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        window.scrollTo(0, savedState.scrollPos);
                        console.log('已恢復捲動位置:', savedState.scrollPos);
                    }, 300);
                });
            }

            // 記錄位置 (滾動時更新)
            window.addEventListener('scroll', () => {
                const state = {
                    url: window.location.href,
                    scrollPos: window.scrollY
                };
                localStorage.setItem(LIST_STATE_KEY, JSON.stringify(state));
            }, { passive: true });
        }
    }
    handleListState();

    // 滑鼠中鍵捲動頁面（優化版）
    let isMiddleButtonPressed = false;
    let [lastX, lastY] = [0, 0];

    document.addEventListener('mousedown', e => {
        if (e.button === 1) {
            isMiddleButtonPressed = true;
            document.body.style.cursor = 'grab';
            [lastX, lastY] = [e.clientX, e.clientY];
            e.preventDefault();
        }
    });

    document.addEventListener('mouseup', e => {
        if (e.button === 1) {
            isMiddleButtonPressed = false;
            document.body.style.cursor = 'default';
        }
    });

    document.addEventListener('mousemove', e => {
        if (isMiddleButtonPressed) {
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            window.scrollBy(-deltaX * 1.5, -deltaY * 4); // 調整滑動速度
            [lastX, lastY] = [e.clientX, e.clientY];
        }
    });

    const url = window.location.href;
    if (url.includes('html') && url.includes('/comic/')) {
        //改變css style
        const style = document.createElement('style');
        style.textContent = `
            html { overflow: overlay; }
            .notice-bar .notice{ width:initial; float: initial; }
            .w998, .w728, .w980, .chapter, .chapter-list, .latest-list, .latest-list ul, .contList, .book-list ul, .cmt-cont, .cover-list, .tbCenter { width:100%; }
            .w860 { float:left; }
            .tbCenter { border:0px; background-color: transparent; }
            .footer-cont { width:100%; padding: 0; }
            .sub-btn { width:980px; margin:0px auto; }
        `;
        document.head.appendChild(style);

        // 隱藏頁面元素
        const elementsToHide = ['.header-inner', '.title', '.main-btn', '.w980.clearfix.sub-btn'];
        const header = document.querySelector('.header');
        const headerHeight = '50px';

        if (header) {
            Object.assign(header.style, {
                position: 'absolute', top: '0', left: '0', width: '100%', height: headerHeight,
                display: 'block', opacity: '0', zIndex: '1', marginBottom: '0'
            });

            [...elementsToHide, '.header'].forEach(selector => {
                const el = document.querySelector(selector);
                el && el.addEventListener('mouseover', () => toggleHeaderVisibility(true));
                el && el.addEventListener('mouseout', () => toggleHeaderVisibility(false));
            });

            elementsToHide.forEach(selector => {
                const el = document.querySelector(selector);
                el && (el.style.display = 'none');
            });
        }

        function toggleHeaderVisibility(show) {
            header.style.opacity = show ? '1' : '0';
            elementsToHide.forEach(selector => {
                const el = document.querySelector(selector);
                el && (el.style.display = show ? 'block' : 'none');
            });
            header.style.height = show ? '34px' : headerHeight;
            header.style.position= show ? 'relative' : 'absolute';
        }

        // 動態改變圖片大小 (resizeImage)
        function resizeImage() {
            const img = document.getElementById('mangaFile');
            const images = document.querySelectorAll('#mangaMoreBox img');
            if (!img || !img.complete) return;

            const [windowHeight, windowWidth] = [window.innerHeight, window.innerWidth];
            const adjustedWidth = (windowHeight / img.naturalHeight) * img.naturalWidth;

            if (img.naturalHeight > img.naturalWidth && windowHeight > 1.5*windowWidth) {
                img.style.width = `${windowWidth}px`;
                img.style.height = 'auto';
                images.forEach(img => {
                    img.style.width = `${windowWidth}px`;
                    img.style.height = 'auto';
                });
                document.body.style.width = `${windowWidth}px`;
                header.style.width = '100%';
            } else if (typeof pVars !== 'undefined' && pVars.curFunc == 3) { // 下拉模式
                img.style.width = (img.naturalWidth > windowWidth || windowHeight > 1.5*windowWidth) ? `${windowWidth}px` : 'auto';
                img.style.height = 'auto';
                images.forEach(i => {
                    i.style.width = (i.naturalWidth > windowWidth || windowHeight > 1.5*windowWidth) ? `${windowWidth}px` : 'auto';
                    i.style.height = 'auto';
                });
            } else if (img.naturalHeight > 2.5*img.naturalWidth) { // 條漫
                img.style.height = 'auto';
                img.style.width = 'auto';
                document.body.style.width = '100%';
                header.style.width = `100%`;
            } else if (img.naturalHeight > windowHeight || img.naturalHeight > img.naturalWidth || adjustedWidth < windowWidth) {
                img.style.height = `${windowHeight}px`;
                img.style.width = 'auto';
                document.body.style.width = '100%';
                header.style.width = `100%`;
            } else if (img.naturalWidth > windowWidth) {
                img.style.height = 'auto';
                img.style.width = 'auto';
                document.body.style.width = `${img.naturalWidth}px`;
                header.style.width = `${img.naturalWidth}px`;
            } else {
                img.style.height = 'auto';
                img.style.width = 'auto';
                document.body.style.width = '100%';
                header.style.width = `100%`;
            }
        }

        new MutationObserver(resizeImage).observe(document.body, { childList: true, subtree: true });
        window.addEventListener('load', resizeImage);

        // 自動捲動到右側大圖 (日漫)
        function scrollToRightIfNeeded() {
            const viewportWidth = window.innerWidth;
            document.querySelectorAll('img').forEach(img => {
                if (img.complete && img.offsetWidth > viewportWidth) {
                    setTimeout(() => window.scrollTo({ left: document.documentElement.scrollWidth }), 50);
                }
            });
        }
        window.addEventListener('load', scrollToRightIfNeeded);
        new MutationObserver(scrollToRightIfNeeded).observe(document.body, { childList: true, subtree: true });

        // 自動上下一章
        new MutationObserver(() => {
            const okButton = document.querySelector('.pb-ok');
            okButton && okButton.click();
        }).observe(document.body, { childList: true, subtree: true });

        // 最後一頁自動回到目錄
        new MutationObserver(() => {
            const backLink = document.querySelector('.tip-alert a');
            if (backLink) backLink.click();
        }).observe(document.body, { childList: true, subtree: true });

    } else {
        document.querySelectorAll('a[target]').forEach(link => { link.setAttribute('target', '_self'); });
    }

    // --- 歷史紀錄邏輯 ---
    if (!sessionStorage.getItem('urlHistory')) {
        sessionStorage.setItem('urlHistory', JSON.stringify([]));
    }
    function updateHistory() {
        const currentUrl = window.location.href;
        let historyArr = JSON.parse(sessionStorage.getItem('urlHistory'));
        if (historyArr[historyArr.length - 1] !== currentUrl) {
            historyArr.push(currentUrl);
            sessionStorage.setItem('urlHistory', JSON.stringify(historyArr));
        }
    }
    function findPreviousInstanceStep() {
        const currentUrl = window.location.href;
        let historyArr = JSON.parse(sessionStorage.getItem('urlHistory'));
        for (let i = historyArr.length - 2; i >= 0; i--) {
            if (historyArr[i] === currentUrl) {
                if (i > 0) return (i - 1) - (historyArr.length - 1);
                break;
            }
        }
        return null;
    }
    updateHistory();
    window.addEventListener('popstate', updateHistory);
    (function(h) {
        const pushState = h.pushState;
        h.pushState = function() {
            pushState.apply(h, arguments);
            updateHistory();
        };
    })(window.history);

    // --- Backspace 與 觸控手勢 邏輯 ---
    function goBackLogic() {
        const currentUrl = window.location.href;
        const matchHtml = currentUrl.match(/(https?:\/\/[^/]+\/comic\/\d+)\/.*html.*/);
        const matchNumber = currentUrl.match(/(https?:\/\/[^/]+\/comic\/\d+)\/?$/);

        if (matchHtml) {
            // 漫畫頁面：回目錄
            window.location.href = matchHtml[1] + '/';
        } else if (matchNumber) {
            // 目錄頁面：優先回記錄的列表頁 (Update/Rank/List)
            const savedState = JSON.parse(localStorage.getItem(LIST_STATE_KEY));
            if (savedState && savedState.url) {
                console.log('跳轉回記憶列表:', savedState.url);
                window.location.href = savedState.url;
            } else {
                // 無紀錄則使用原有歷史跳轉
                const steps = findPreviousInstanceStep();
                if (steps !== null) history.go(steps);
            }
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !e.target.isContentEditable && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            goBackLogic();
        }
    });

    // 觸控手勢
    let startX = 0, startY = 0, dragLength = 150, isSingleTouch = false;
    window.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            isSingleTouch = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            isSingleTouch = false;
        }
    }, false);

    window.addEventListener('touchend', e => {
        if (isSingleTouch && e.changedTouches.length === 1 && e.touches.length === 0) {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX, deltaY = endY - startY;
            const currentUrl = window.location.href;
            const matchHtml = currentUrl.match(/(https?:\/\/[^/]+\/comic\/\d+)\/.*html.*/);

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                if (window.scrollY === 0 && deltaY > dragLength) {
                    goBackLogic(); // 下滑執行返回邏輯
                }
            } else if (matchHtml) {
                if (window.scrollX === 0 && deltaX > dragLength) {
                    const btn = Array.from(document.querySelectorAll('.btn-red.prev')).find(b => b.textContent.trim() === '上一页');
                    btn && btn.click();
                } else if ((window.innerWidth + window.scrollX) >= document.body.scrollWidth && deltaX < -dragLength) {
                    const btn = Array.from(document.querySelectorAll('.btn-red.next')).find(b => b.textContent.trim() === '下一页');
                    btn && btn.click();
                }
            }
        }
    }, false);

    // 提示與 Cookie
    const insertTip = (container) => {
        const ol = container.querySelector('ol');
        if (ol && !ol.querySelector('.backspace-tip')) {
            const newLi = document.createElement('li');
            newLi.className = 'backspace-tip';
            newLi.innerHTML = '<strong>回上层：</strong>Backspace键 / 頂部下滑';
            ol.appendChild(newLi);
        }
    };
    setTimeout(() => document.querySelectorAll('div.shadow.tip-cont').forEach(insertTip), 3000);
    new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('shadow') && node.classList.contains('tip-cont')) insertTip(node);
        }));
    }).observe(document.body, { childList: true, subtree: true });

    document.cookie = 'country=CN; path=/; domain=.manhuagui.com; expires=' + new Date(Date.now() + 7 * 864e5).toUTCString();
})();