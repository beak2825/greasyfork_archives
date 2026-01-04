// ==UserScript==
// @name         更改bing和copilot的字体
// @namespace    http://tampermonkey.net/
// @version      2024-03-01
// @description  更改bing和copilot的字体,以解决使用日本代理访问，搜索中文，匹配到Arial Unicode MS字体导致显示的很难看
// @author       cl1107
// @match        https://copilot.microsoft.com/
// @match        https://www.bing.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488685/%E6%9B%B4%E6%94%B9bing%E5%92%8Ccopilot%E7%9A%84%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/488685/%E6%9B%B4%E6%94%B9bing%E5%92%8Ccopilot%E7%9A%84%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.documentElement.style.setProperty('--cib-font-text', "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol','Noto Color Emoji'");
})();