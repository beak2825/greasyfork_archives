// ==UserScript==
// @name                Wikipedia 2 Wikiwand (zh)
// @description         Redirect Wikipedia to Wikiwand for a modern browsing experience.
// @description:zh-CN   重定向 Wikipedia 页面到 Wikiwand 以获得现代的浏览体验
// @description:zh-TW   重定向 Wikipedia 頁面到 Wikiwand 以獲得現代的瀏覽體驗
// @version             1.0.2
// @namespace           https://github.com/maboloshi/UserScripts
// @icon                https://www.wikiwand.com/favicon.ico
// @include             http*://*.wikipedia.org/*/*
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/376885/Wikipedia%202%20Wikiwand%20%28zh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376885/Wikipedia%202%20Wikiwand%20%28zh%29.meta.js
// ==/UserScript==
var language =  navigator.language ? navigator.language.toLowerCase() : 'zh'
window.location.replace(document.location.href.replace(/https?:\/\/([\w-]+)\.wikipedia\.org\/[\w-]+/, 'https://www.wikiwand.com/'+ language));
