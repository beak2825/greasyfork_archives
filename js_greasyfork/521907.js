// ==UserScript==
// @name         美团KM新年装饰
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  为美团KM知识库添加新年装饰元素
// @author       yeye.w
// @match        https://km.sankuai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521907/%E7%BE%8E%E5%9B%A2KM%E6%96%B0%E5%B9%B4%E8%A3%85%E9%A5%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/521907/%E7%BE%8E%E5%9B%A2KM%E6%96%B0%E5%B9%B4%E8%A3%85%E9%A5%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 图片URL
    const LEFT_IMAGE_1 = 'https://s3plus-bj02.sankuai.com/sky-river/sky-uploads/su36s7uagmt4d6sb-chunjie.png';
    const LEFT_IMAGE_2 = 'https://s3plus-bj02.sankuai.com/sky-river/sky-uploads/su36s7uagmt4d6sb-chunjie.png';
    const RIGHT_IMAGE_1 = 'https://s3plus-bj02.sankuai.com/sky-river/sky-uploads/su36s7uagmt4d6sb-chunjie.png';
    const RIGHT_IMAGE_2 = 'https://s3plus-bj02.sankuai.com/sky-river/sky-uploads/su36s7uagmt4d6sb-chunjie.png';

    function init() {
        const style = document.createElement('style');
        style.textContent = `
            .lantern-container {
                position: fixed;
                top: -30px;
                left: 0;
                right: 0;
                height: 120px;
                display: flex;
                justify-content: space-between;
                z-index: 9999999;
                pointer-events: none;
                background: transparent;
            }

            .left-container, .right-container {
                display: flex;
                position: relative;
                width: 50%;
            }

            /* 最左侧图片 */
            .lantern-image-left-1 {
                position: absolute;
                left: 100px;
                width: 300px;
                height: 120px;
                background-image: url('${LEFT_IMAGE_1}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: left center;
                animation: floating 3s ease-in-out infinite;
                mix-blend-mode: multiply;
                opacity: 0.9;
            }

            /* 左侧第二个图片 */
            .lantern-image-left-2 {
                position: absolute;
                left: 300px;
                width: 300px;
                height: 120px;
                background-image: url('${LEFT_IMAGE_2}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: left center;
                animation: floating 3s ease-in-out infinite;
                animation-delay: 0.75s;
                mix-blend-mode: multiply;
                opacity: 0.9;
            }

            /* 右侧第一个图片 */
            .lantern-image-right-1 {
                position: absolute;
                right: 350px;
                width: 300px;
                height: 120px;
                background-image: url('${RIGHT_IMAGE_1}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: right center;
                animation: floating 3s ease-in-out infinite;
                mix-blend-mode: multiply;
                opacity: 0.9;
            }

            /* 最右侧图片 */
            .lantern-image-right-2 {
                position: absolute;
                right: 150px;
                width: 300px;
                height: 120px;
                background-image: url('${RIGHT_IMAGE_2}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: right center;
                animation: floating 3s ease-in-out infinite;
                animation-delay: 1.5s;
                mix-blend-mode: multiply;
                opacity: 0.9;
            }

            @keyframes floating {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
        `;

        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.documentElement.appendChild(style);
        }

        const oldContainer = document.querySelector('.lantern-container');
        if (oldContainer) {
            oldContainer.remove();
        }

        const lanternContainer = document.createElement('div');
        lanternContainer.className = 'lantern-container';

        // 创建左侧容器和图片
        const leftContainer = document.createElement('div');
        leftContainer.className = 'left-container';

        const leftImage1 = document.createElement('div');
        leftImage1.className = 'lantern-image-left-1';

        const leftImage2 = document.createElement('div');
        leftImage2.className = 'lantern-image-left-2';

        leftContainer.appendChild(leftImage1);
        leftContainer.appendChild(leftImage2);

        // 创建右侧容器和图片
        const rightContainer = document.createElement('div');
        rightContainer.className = 'right-container';

        const rightImage1 = document.createElement('div');
        rightImage1.className = 'lantern-image-right-1';

        const rightImage2 = document.createElement('div');
        rightImage2.className = 'lantern-image-right-2';

        rightContainer.appendChild(rightImage1);
        rightContainer.appendChild(rightImage2);

        // 添加到主容器
        lanternContainer.appendChild(leftContainer);
        lanternContainer.appendChild(rightContainer);

        if (document.body) {
            document.body.insertBefore(lanternContainer, document.body.firstChild);
        } else {
            setTimeout(init, 500);
            return;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    }).observe(document, { subtree: true, childList: true });
})();