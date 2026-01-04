// ==UserScript==
// @name         让知乎网页跟随系统主题
// @description  读取系统主题并将知乎的主题设置为对应主题
// @namespace    http://tampermonkey.net/
// @author       Jako
// @icon         https://static.zhihu.com/static/favicon.ico
// @version      0.2
// @match        https://*.zhihu.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457876/%E8%AE%A9%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/457876/%E8%AE%A9%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function ()
{
    "use strict";

    var systemIsDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var webIsDarkTheme = document.getElementsByTagName("html")[0].getAttribute("data-theme") == "dark";

    if (systemIsDarkTheme != webIsDarkTheme)
    {
        if (systemIsDarkTheme)
        { window.location.href = window.location.href + "?theme=dark"; }
        else
        {
            window.location.href = window.location.href + "?theme=light";
        }
    }
})();