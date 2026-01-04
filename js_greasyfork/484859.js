// ==UserScript==
// @name     Bilibili网页应用增强（强制所有操作在应用中打开，不跳转edge浏览器）
// @description  使用方法：【edge打开bilibili->右上角->"..."->应用->将此站点安装为应用】优化B站/哔哩哔哩/知乎作为网站应用安装后会跳转浏览器
// @version  1
// @author   Phoeky
// @match  https://*.bilibili.com/*
// @match  https://*.zhihu.com/*
// @namespace https://greasyfork.org/users/1247761
// @downloadURL https://update.greasyfork.org/scripts/484859/Bilibili%E7%BD%91%E9%A1%B5%E5%BA%94%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E6%93%8D%E4%BD%9C%E5%9C%A8%E5%BA%94%E7%94%A8%E4%B8%AD%E6%89%93%E5%BC%80%EF%BC%8C%E4%B8%8D%E8%B7%B3%E8%BD%ACedge%E6%B5%8F%E8%A7%88%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/484859/Bilibili%E7%BD%91%E9%A1%B5%E5%BA%94%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E6%93%8D%E4%BD%9C%E5%9C%A8%E5%BA%94%E7%94%A8%E4%B8%AD%E6%89%93%E5%BC%80%EF%BC%8C%E4%B8%8D%E8%B7%B3%E8%BD%ACedge%E6%B5%8F%E8%A7%88%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to change link's target to "_self"
    const changeLinkTarget = (link) => {
        link.setAttribute('target', '_self');
    };

    // Observe new nodes added to the document
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const links = mutation.addedNodes.flatMap((node) => {
                    if (node.tagName === 'A') {
                        return [node];
                    }
                    return node.getElementsByTagName('a');
                });

                links.forEach(changeLinkTarget);
            }
        });
    });

    // Start observing the document
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // Also change existing links on the page
    document.querySelectorAll('a').forEach(changeLinkTarget);

    // Wait for the page to load completely
    window.onload = () => {
        // Start observing the document after the page is loaded
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        // Also change existing links on the page after the page is loaded
        document.querySelectorAll('a').forEach(changeLinkTarget);
    };
})();