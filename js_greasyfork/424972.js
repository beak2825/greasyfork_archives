// ==UserScript==
// @name:en-US          Coolapk open in app
// @name                在酷安 APP 中打开
// @namespace           coolapk
// @version             0.0.4
// @description:en-US   Fix Open Coolapk APP from Web
// @description         修复从 Coolapk 网页调起 APP 客户端
// @license             MIT
// @author              wherewhere
// @match               *://coolapk.com/*
// @match               *://*.coolapk.com/*
// @icon                https://static.coolapk.com/static/web/v8/img/under_logo.png
// @grant               unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/424972/%E5%9C%A8%E9%85%B7%E5%AE%89%20APP%20%E4%B8%AD%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/424972/%E5%9C%A8%E9%85%B7%E5%AE%89%20APP%20%E4%B8%AD%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    function toApp() {
        open("coolmarket:/" + location.pathname);
    }

    const script = document.createElement('script');
    script.type = "text/javascript";
    script.textContent = toApp;
    const element = document.head || document.body || document.documentElement;
    element.appendChild(script);

    const href = "coolmarket:/" + location.pathname;
    const opens = document.getElementsByClassName("app-open");
    for (let i = 0; i < opens.length; i++) {
        const open = opens[i];
        if (open instanceof HTMLAnchorElement) {
            open.href = href;
            open.removeAttribute("onclick");
        }
    }
})();