// ==UserScript==
// @name         youtube新标签页打开🙌😁😁😁
// @namespace    476321082_js
// @version      1.4.2
// @description  支持首页，搜索，频道，个人主页等在新标签打开，你懂的
// @author       neoWorld
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466230/youtube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%F0%9F%99%8C%F0%9F%98%81%F0%9F%98%81%F0%9F%98%81.user.js
// @updateURL https://update.greasyfork.org/scripts/466230/youtube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%F0%9F%99%8C%F0%9F%98%81%F0%9F%98%81%F0%9F%98%81.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const updateAnchorElements = function () {
        const anchorElements = document.querySelectorAll("a[href^='/']");

        anchorElements.forEach((anchorElement) => {
            anchorElement.setAttribute("target", "_blank");
            anchorElement.addEventListener("click", (e) => {
                e.stopPropagation();
                return false;
            });
        });
    };

    const getSelectorAtCurPath = function () {
        const htmlElement = document.querySelector("html");

        return globalVars.selectorPathMap[htmlElement.getAttribute("href")] || {
            observeEle: "#page-manager",
            aEle: "a[href^='/']",
        };
    };

    const initObserver = function (selector) {
        const observeEle = document.querySelector(selector.observeEle);
        if (!observeEle) return;

        new MutationObserver(() => {
            updateAnchorElements();
        }).observe(observeEle, {
            childList: true,
            subtree: true, // 监视子孙节点
        });
    };

    const watchPathChange = function (cb = () => { }) {
        window.addEventListener("popstate", cb, true);

    };


    // init
    const globalVars = {
        selectorPathMap: {
            "/": {
                observeEle: "#page-manager",
                aEle: "a[href^='/']",
            },
            "/results": {
                observeEle: "#page-manager",
                aEle: "a[href^='/']",
            },
            "/channel": {
                observeEle: "#page-manager",
                aEle: "a[href^='/'], ytd-grid-playlist-renderer a[href^='/'], #channel a[href^='/']",
            },
            "/watch": {
                observeEle: "#page-manager",
                aEle: "a[href^='/'], ytd-video-owner-renderer a[href^='/']",
            },
            "/playlist": {
                observeEle: "#page-manager",
                aEle: "#content a[href^='/']",
            },
            "/user": {
                observeEle: "#page-manager",
                aEle: "a[href^='/']",
            },
            "/c": {
                observeEle: "#page-manager",
                aEle: "ytd-grid-playlist-renderer a[href^='/'], #dismissible a[href^='/']",
            },
            "/feed": {
                observeEle: "#page-manager",
                aEle: "a[href^='/']",
            },
        },
        initPath: window.location.href,
        intervalDefaultTimes: 10,
        intervalTimes: 10,
    };
    const selector = getSelectorAtCurPath();
    window.onload = () => {
        initObserver(selector);
        updateAnchorElements();
    };

    watchPathChange(() => {
        initObserver(selector);
        updateAnchorElements();
    });

})();
