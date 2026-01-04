// ==UserScript==
// @name         右键拖拽（滑动）页面
// @description  网友左右滑动需要依靠触控板，该脚本实现通过按住右键进行拖拽页面
// @version      1.0.4
// @match        http://ux.51baiwang.com/*
// @match        https://*.axshare.com/*
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/1363215
// @downloadURL https://update.greasyfork.org/scripts/511825/%E5%8F%B3%E9%94%AE%E6%8B%96%E6%8B%BD%EF%BC%88%E6%BB%91%E5%8A%A8%EF%BC%89%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/511825/%E5%8F%B3%E9%94%AE%E6%8B%96%E6%8B%BD%EF%BC%88%E6%BB%91%E5%8A%A8%EF%BC%89%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const queryMatch = {
        'axshare.com': 'html',
        'ux.51baiwang.com': '.screen-viewer',
    }
    const matchDomain = (host) => {
        return Object.keys(queryMatch).find(it => host.includes(it))
    }

    function bootstrap() {
        const key = matchDomain(location.host)
        const containerSelector = queryMatch[key]
        let count = 5
        let container = null
        const timer = setInterval(() => {
            container = document.querySelector(containerSelector)
            if(container){
                clearInterval(timer)
                initRightClickDrag(container)
            }
            count--
            if(count === 0){
                clearInterval(timer)
            }
        }, 1000)
    }

    function initRightClickDrag(container) {
        let isDragging = false;
        let startX, startY;
        let scrollX, scrollY;

        container.addEventListener('mousedown', (event) => {
            if (event.button === 2) {
                isDragging = true;
                startX = event.clientX;
                startY = event.clientY;
                scrollX = container.scrollLeft;
                scrollY = container.scrollTop;
            }
        });
        container.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;
                container.scrollLeft = scrollX - deltaX;
                container.scrollTop = scrollY - deltaY;
            }
        });
        container.addEventListener('mouseup', (event) => {
            if (event.button === 2) {
                isDragging = false;
            }
        });

        // 阻止呼出右键菜单
        container.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }
    // entry
    if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
        bootstrap()
    } else {
        document.addEventListener('DOMContentLoaded', bootstrap, false)
    }
})();