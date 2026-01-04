// ==UserScript==
// @name                Wikipedia to Wikiwand
// @name:zh-CN          Wikipedia to Wikiwand
// @name:zh-TW          Wikipedia to Wikiwand
// @namespace           https://github.com/showchi/TamperMonkeyScripts
// @version             0.2
// @description         Redirect Wikipedia to Wikiwand for a modern browsing experience.
// @description:zh-CN   重定向 Wikipedia 页面到 Wikiwand 以获得现代的浏览体验
// @description:zh-TW   重定向 Wikipedia 頁面到 Wikiwand 以獲得現代的瀏覽體驗
// @author              Jade Worths
// @license             MIT
// @supportURL          https://github.com/showchi/TamperMonkeyScripts/blob/main/WikipediaToWikiwand.user.js
// @match               http*://*.wikipedia.org/*/*
// @icon                https://www.wikiwand.com/favicon.ico
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/452951/Wikipedia%20to%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/452951/Wikipedia%20to%20Wikiwand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wikiLocale = new RegExp('\/\/(.*).wikipedia');
    var url = window.location.href;
    if (wikiLocale.test(url)) {
        var host = window.location.host;
        var language = host.split('.')[0];
        window.location.replace(url.replace(/[^\s]*\.wikipedia\.org\/[\w-]+/, 'https://www.wikiwand.com/'+ language));
    }
})();