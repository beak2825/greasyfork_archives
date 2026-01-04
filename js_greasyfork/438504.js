// ==UserScript==
// @name         开启花瓣搜索(PetalSearch)浅色模式
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  华为新发布的 花瓣搜索(PetalSearch)，由于深色模式显示效果目前并不太友好，有待优化，所以在该网站强制启用浅色模式
// @author       ITXiaoPang
// @match        https://petalsearch.com/*
// @icon         https://www.google.com/s2/favicons?domain=petalsearch.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438504/%E5%BC%80%E5%90%AF%E8%8A%B1%E7%93%A3%E6%90%9C%E7%B4%A2%28PetalSearch%29%E6%B5%85%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/438504/%E5%BC%80%E5%90%AF%E8%8A%B1%E7%93%A3%E6%90%9C%E7%B4%A2%28PetalSearch%29%E6%B5%85%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.classList.remove('dark');
})();