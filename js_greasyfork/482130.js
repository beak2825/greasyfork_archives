// ==UserScript==
// @name         X/ Twitter 视图优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  缩小 X 图片和视频尺寸，优化 X 作为 RSS 阅读器的体验，并在鼠标悬停时浮出动态效果。
// @author       404 KIDS SEE GHOSTS
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482130/X%20Twitter%20%E8%A7%86%E5%9B%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482130/X%20Twitter%20%E8%A7%86%E5%9B%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    // 添加自定义样式，包括鼠标悬停时的放大效果
    GM_addStyle(`
        .r-1ssbvtb {
            width: 50%;
            transition: transform 0.3s ease;
        }
        .r-1ssbvtb:hover {
            transform: scale(1.02);
            z-index: 1000;
        }
    `);

    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if(node.matches && node.matches('.r-1ssbvtb')) {
                        if(node.offsetWidth < 300) {
                            node.style.width = 'auto';
                        }
                    }
                });
            }
        }
    };

    // 设置 MutationObserver 以监视 DOM 变更
    const observer = new MutationObserver(callback);
    const targetNode = document.querySelector('#react-root');
    observer.observe(targetNode, { childList: true, subtree: true });
})();
