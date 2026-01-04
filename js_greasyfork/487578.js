// ==UserScript==
// @name         Twitter old icon
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Customize Twitter with a monkey theme
// @author       cygaar
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://pbs.twimg.com/media/GGmfzX_bUAAUUFw?format=png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487578/Twitter%20old%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/487578/Twitter%20old%20icon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('%cTwitter Old Icon:注入中', 'background: yellow; color: red;');
    const monkeyIconUrl = "https://pbs.twimg.com/media/GGmfzX_bUAAUUFw?format=png";

    // 設定網頁圖標
    function setFavicon() {
        const favicon = document.querySelector("link[rel~='icon']");
        if (!favicon) {
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = monkeyIconUrl;
            document.head.appendChild(link);
        } else if (favicon.href !== monkeyIconUrl) {
            favicon.href = monkeyIconUrl;
        }
    }

    // 設定 Web 應用程式圖示
    function setWebAppIcon() {
        const appIcon = document.querySelector('[aria-label="X"]');
        if (appIcon) {
            const container = appIcon.children[0];
            if (container) {
                container.innerHTML = ""; // 清空內容
                const monkeyIcon = document.createElement("img");
                monkeyIcon.src = monkeyIconUrl;
                monkeyIcon.width = 42;
                monkeyIcon.height = 42;
                container.appendChild(monkeyIcon);
            }
        }
    }

    // 等待特定元素出現
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化
    setFavicon();
    setWebAppIcon();

    // 每隔五秒檢查一次 Web 應用程式圖示
    setInterval(setWebAppIcon, 5000);

    // 監控頁面加載過程並更新 favicon
    waitForElement("head", setFavicon);
    waitForElement('[aria-label="X"]', setWebAppIcon);

    // 更改網站標題
    const titleObserver = new MutationObserver(() => {
        const title = document.querySelector('title');
        if (title && title.innerText.endsWith('X')) {
            title.innerText = title.innerText.slice(0, -1) + 'Twitter';
        }
    });

    waitForElement('title', (title) => titleObserver.observe(title, { childList: true }));
})();
