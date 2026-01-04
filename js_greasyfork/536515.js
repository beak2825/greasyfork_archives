// ==UserScript==
// @name         中文维基自动繁转简
// @namespace    http://tampermonkey.net/
// @version      20250520.1
// @description  中文维基繁体转简体
// @author       leone
// @match        https://zh.wikipedia.org/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536515/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E8%87%AA%E5%8A%A8%E7%B9%81%E8%BD%AC%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/536515/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E8%87%AA%E5%8A%A8%E7%B9%81%E8%BD%AC%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    if (document.URL.includes('zh.wikipedia.org/wiki/')) {
        window.location.replace(document.URL.replace(/https:\/\/zh\.wikipedia\.org\/wiki\/(.*)/, 'https://zh.wikipedia.org/zh-cn/$1'));
    }
})();