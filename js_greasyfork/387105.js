// ==UserScript==
// @name         ZhihuHE
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Headline editor for zhihu
// @author       YaliKiWi
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387105/ZhihuHE.user.js
// @updateURL https://update.greasyfork.org/scripts/387105/ZhihuHE.meta.js
// ==/UserScript==

//Headline_Editor
(function () {
    'use strict';
    document.title='首页_洛谷||计算机科学教育新生态';
    document.querySelector("link[rel='shortcut icon']").href = "https://www.luogu.org/favicon.ico";
    document.querySelector("link[rel*='icon']").href = "https://www.luogu.org/favicon.ico";
})();