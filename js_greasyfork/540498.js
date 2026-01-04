// ==UserScript==
// @name         知乎隐藏标题+伪装标签
// @version      1.0.0
// @namespace    Violentmonkey Scripts
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/p/*
// @grant        none
// @description  隐藏知乎大字标题、广告栏，伪装成办公网页，支持子页面动态加载。
// @downloadURL https://update.greasyfork.org/scripts/540498/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%2B%E4%BC%AA%E8%A3%85%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/540498/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98%2B%E4%BC%AA%E8%A3%85%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(() => {
    const selectorsToRemove = [
        '.QuestionHeader',
        '.AppHeader',
        '.ColumnPageHeader',
        '.AdvertImg',
        '.Question-sideColumn',
        '.css-1qyytj7',
        '.Pc-feedAd-new',
        '.RichContent-cover-inner',
        '.RichContent-cover',
        '.Card AuthorCard',
        '.ecommerce-ad-box',
        '.origin_image zh-lightbox-thumb lazy',
        '.content_image',
        '.RichText-ADLinkCardContainer',
        '.Reward'
    ];

    const fakeTitle = "ChatGPT";
    const fakeIcon = "https://chat.openai.com/favicon.ico";

    function removeElements() {
        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        });
    }

    function observeDOM() {
        const observer = new MutationObserver(() => {
            removeElements();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function changeFavicon(url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = url;
    }

    function updateTitleAndFavicon() {
        if (document.title !== fakeTitle) {
            document.title = fakeTitle;
        }
        changeFavicon(fakeIcon);
    }

    function monitorRouteChanges() {
        let lastUrl = location.href;

        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                // 子页面加载完成后重新处理
                setTimeout(() => {
                    removeElements();
                    updateTitleAndFavicon();
                }, 500); // 延迟一点点，等待 DOM 加载
            }
        }).observe(document.body, { childList: true, subtree: true });

        // fallback保险机制，防止SPA不触发
        setInterval(updateTitleAndFavicon, 1000);
    }

    function removeAllImages() {
        function removeZhihuFigures() {
            document.querySelectorAll('figure').forEach(figure => {
                if (
                    figure.querySelector('img.origin_image') ||
                    figure.className.includes('origin_image')
                ) {
                    figure.remove();
                }
            });
        }

        // 初始清理
        removeZhihuFigures();

        // 监听动态图片加载
        const observer = new MutationObserver(() => {
            removeZhihuFigures();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }


    function init() {
        removeElements();
        observeDOM();
        updateTitleAndFavicon();
        monitorRouteChanges();
        removeAllImages();
    }

    init();
})();
