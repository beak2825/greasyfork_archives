// ==UserScript==
// @name 增強漫畫櫃
// @namespace http://tampermonkey.net/
// @version 1.4
// @description 漫畫櫃自動隐藏頂部元素、中鍵捲動頁面、圖片高寬調整、自動切換上下一章、更改cookie、簡易觸控手勢、Backspace及觸控下滑在漫畫頁面時回目錄，在目錄時回進入目錄之前
// @license MIT
// @match *://www.manhuagui.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/528611/%E5%A2%9E%E5%BC%B7%E6%BC%AB%E7%95%AB%E6%AB%83.user.js
// @updateURL https://update.greasyfork.org/scripts/528611/%E5%A2%9E%E5%BC%B7%E6%BC%AB%E7%95%AB%E6%AB%83.meta.js
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
if (url.includes('html')&&url.includes('/comic/')) {
    //改變css style
    const style = document.createElement('style');
    style.textContent = `
        html {
            overflow: overlay;
        }
        .notice-bar .notice{
            width:initial;
            float: initial;
        }
        .w998, .w728, .w980, .chapter, .chapter-list, .latest-list, .latest-list ul, .contList, .book-list ul, .cmt-cont, .cover-list, .tbCenter {
            width:100%;
        }
        .w860 {
            float:left;
        }
        .tbCenter {
            border:0px;
            background-color: transparent;
        }
        .footer-cont {
            width:100%;
            padding: 0;
        }
        .sub-btn {
            width:980px;
            margin:0px auto;
        }
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

        // 頁面載入時先隱藏元素
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

    // 動態改變圖片大小
    function resizeImage() {
        const img = document.getElementById('mangaFile');
        const images = document.querySelectorAll('#mangaMoreBox img');
        if (!img || !img.complete) return;

        const [windowHeight, windowWidth] = [window.innerHeight, window.innerWidth];
        const adjustedWidth = (windowHeight / img.naturalHeight) * img.naturalWidth;
        if (img.naturalHeight > img.naturalWidth && windowHeight > 1.5*windowWidth) {
            // 圖片高度大於圖片寬度且視窗寬度大於1.5倍視窗高度
            img.style.width = `${windowWidth}px`;
            img.style.height = 'auto';
/*          let style = document.getElementById('mangaStyle');

            if (!style) {
                style = document.createElement('style');
                style.id = 'mangaStyle';
            document.head.appendChild(style);
            }
            style.textContent = `
                #mangaMoreBox img {
                    width: ${windowWidth}px;
                    height: auto;
                }
            `;*/

            // 設定下拉模式的mangaMoreBox
            images.forEach(img => {
                img.style.width = `${windowWidth}px`;
                img.style.height = 'auto';
            });
            document.body.style.width = `${windowWidth}px`;
            header.style.width = '100%';
//        } else if (img.naturalHeight > windowHeight && adjustedWidth > windowWidth) {
            // 高度大於視窗高度且調整過圖片寬度大於視窗寬度，將圖片高度設為視窗高度且header, .main-nav .main-bar為調整過寬度
//            img.style.height = `${windowHeight}px`;
//            img.style.width = 'auto';
//            document.body.style.width = `${adjustedWidth}px`;
//            header.style.width = `${adjustedWidth}px`;
        } else if (pVars.curFunc==3) {
            // 下拉模式
            if (img.naturalWidth > windowWidth || windowHeight > 1.5*windowWidth) {
                img.style.width = `${windowWidth}px`;
            } else {
                img.style.width = 'auto';
            }
            img.style.height = 'auto';
            // 設定下拉模式的mangaMoreBox
            images.forEach(img => {
                if (img.naturalWidth > windowWidth || windowHeight > 1.5*windowWidth) {
                    img.style.width = `${windowWidth}px`;
                } else {
                    img.style.width = 'auto';
                }
                img.style.height = 'auto';
            });
        } else if (img.naturalHeight > 2.5*img.naturalWidth) {
            // 條漫為auto
            img.style.height = 'auto';
            img.style.width = 'auto';
            document.body.style.width = '100%';
            header.style.width = `100%`;
        } else if (img.naturalHeight > windowHeight || img.naturalHeight > img.naturalWidth || adjustedWidth < windowWidth) {
            // 圖片高度大於視窗高度和圖片寬度，將圖片高度設為視窗高度
            img.style.height = `${windowHeight}px`;
            img.style.width = 'auto';
            document.body.style.width = '100%';
            header.style.width = `100%`;
        } else if (img.naturalWidth > windowWidth) {
            // 圖片寬度度大於視窗寬度，將header, .main-nav .main-bar為圖片寬度
            img.style.height = 'auto';
            img.style.width = 'auto';
            document.body.style.width = `${img.naturalWidth}px`;
            header.style.width = `${img.naturalWidth}px`;
        } else {
            // 其他情況，auto
            img.style.height = 'auto';
            img.style.width = 'auto';
            document.body.style.width = '100%';
            header.style.width = `100%`;
        }
    }

    new MutationObserver(resizeImage).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', resizeImage);

    // 自動捲動到右側大圖
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
        document.querySelectorAll('a[target]').forEach(link => {link.setAttribute('target', '_self');});
}
    //⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇記錄歷史頁面給Backspace回到漫畫的前一頁用⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
    // 初始化 sessionStorage 中的歷史記錄陣列
    if (!sessionStorage.getItem('urlHistory')) {
        sessionStorage.setItem('urlHistory', JSON.stringify([]));
    }
    // 更新歷史記錄
    function updateHistory() {
        const currentUrl = window.location.href;
        let history = JSON.parse(sessionStorage.getItem('urlHistory'));
        if (history[history.length - 1] !== currentUrl) { // 避免重複記錄相同 URL
            history.push(currentUrl);
            sessionStorage.setItem('urlHistory', JSON.stringify(history));
            console.log('Updated history:', history);
        }
    }
    // 查找上一個與當前 URL 相同的記錄的上一筆，並計算步數
    function findPreviousInstanceStep() {
        const currentUrl = window.location.href;
        let history = JSON.parse(sessionStorage.getItem('urlHistory'));
        console.log('Current history:', history);
        console.log('Current URL:', currentUrl);
    // 從倒數第二筆開始查找上一個與當前 URL 相同的記錄
        for (let i = history.length - 2; i >= 0; i--) {
            if (history[i] === currentUrl) {
                console.log('Found previous match at index:', i, 'URL:', history[i]);
                    if (i > 0) { // 確保有上一筆
                        const targetIndex = i - 1;
                        const currentIndex = history.length - 1;
                        const steps = targetIndex - currentIndex;
                        console.log('Target index:', targetIndex, 'Target URL:', history[targetIndex], 'Current index:', currentIndex, 'Steps:', steps);
                        return steps;
                    }
                console.log('No prior entry before match');
                break;
            }
        }
        console.log('No previous match found');
        return null;
    }

    // 在頁面加載時更新歷史記錄
    updateHistory();

    // 監聽 URL 變化
    window.addEventListener('popstate', updateHistory);
    window.addEventListener('hashchange', updateHistory);

    // 覆蓋 pushState
    (function(history) {
        const pushState = history.pushState;
        history.pushState = function(state) {
            pushState.apply(history, arguments);
            updateHistory();
        };
    })(window.history);
/*
    // 輪詢檢查 URL 變化（應對未觸發事件的情況）
    let lastUrl = window.location.href;
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            console.log('Detected URL change via polling:', currentUrl);
            updateHistory();
            lastUrl = currentUrl;
        }
    }, 500); // 每 500ms 檢查一次*/
    //⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆記錄歷史頁面給Backspace回到漫畫的前一頁用⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆

    // backspace回到上一層
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !e.target.isContentEditable && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const currentUrl = window.location.href;
            const matchHtml = currentUrl.match(/(https?:\/\/[^/]+\/comic\/\d+)\/.*html.*/);
            const matchNumber = currentUrl.match(/(https?:\/\/[^/]+\/comic\/\d+)\/?$/);

            if (matchHtml) {
                window.location.href = matchHtml[1] + '/';
            } else if (matchNumber) {
                //回到漫畫的前一頁
                const steps = findPreviousInstanceStep();
                if (steps !== null) {
                    console.log('Executing history.go(' + steps + ')');
                    history.go(steps);
                } else {
                    console.log('No valid step to go back');
                }

//                const rootUrl = matchNumber[1].replace(/\/comic\/\d+\/?$/, '/update/');
//                window.location.href = rootUrl;
            }
        }
    });
    //插入li
    const insertTip = (container) => {
        const ol = container.querySelector('ol');
        if (ol && !ol.querySelector('.backspace-tip')) { // 防止重複插入
            const newLi = document.createElement('li');
            newLi.className = 'backspace-tip';
            newLi.innerHTML = '<strong>回上层：</strong>Backspace键';
            ol.appendChild(newLi);
        }
    };

    const observeAndInsert = () => {
        const tipContainers = document.querySelectorAll('div.shadow.tip-cont');
        tipContainers.forEach(insertTip);
    };

    // 使用 setTimeout 確保 DOM 完全載入後執行
    setTimeout(observeAndInsert, 3000);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('shadow') && node.classList.contains('tip-cont')) {
                    insertTip(node);
                }
            });
        });
    });

    // 漫畫頁面時觸控手勢控制
    let startX = 0;
    let startY = 0;
    let dragLength = 150;
    let isSingleTouch = false;

    window.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) { // Only trigger for single touch
            isSingleTouch = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            isSingleTouch = false;
        }
    }, false);

    window.addEventListener('touchend', function(e) {
        if (isSingleTouch && e.changedTouches.length === 1 && e.touches.length === 0) { // Ensure only single touch ends
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            const currentUrl = window.location.href;
            const matchHtml = currentUrl.match(/(https?:\/\/[^/]+\/comic\/\d+)\/.*html.*/);
            const matchNumber = currentUrl.match(/(https?:\/\/[^/]+\/comic\/\d+)\/?$/);

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                if (window.scrollY === 0 && deltaY > dragLength) {
                    if (matchHtml) {
                        window.location.href = matchHtml[1] + '/';
                    } else if (matchNumber) {
                        //回到漫畫的前一頁
                        const steps = findPreviousInstanceStep();
                        if (steps !== null) {
                            console.log('Executing history.go(' + steps + ')');
                            history.go(steps);
                        } else {
                            console.log('No valid step to go back');
                        }
//                        const rootUrl = matchNumber[1].replace(/\/comic\/\d+\/?$/, '/update/');
//                        window.location.href = rootUrl;
                    }
                }
            } else {
                if (window.scrollX === 0 && deltaX > dragLength && matchHtml) {
                    const prevButton = Array.from(document.querySelectorAll('.btn-red.prev')).find(btn => btn.textContent.trim() === '上一页');
                    if (prevButton) {
                        prevButton.click();
                    }
                } else if ((window.innerWidth >= document.body.scrollWidth || (window.innerWidth + window.scrollX) >= document.body.scrollWidth) && deltaX < -dragLength && matchHtml) {
                    const nextButton = Array.from(document.querySelectorAll('.btn-red.next')).find(btn => btn.textContent.trim() === '下一页');
                    if (nextButton) {
                        nextButton.click();
                    }
                }
            }
        }
    }, false);

    observer.observe(document.body, { childList: true, subtree: true });
    // 修改 cookie
    const targetCookie = 'country=CN; path=/; domain=.manhuagui.com; expires=' + new Date(Date.now() + 7 * 864e5).toUTCString();
    document.cookie = targetCookie;
})();
