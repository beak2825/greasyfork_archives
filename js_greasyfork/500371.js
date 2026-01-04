// ==UserScript==
// @name         wlk专业升级网站汉化
// @namespace    qiege
// @version      1.0
// @description  只汉化链接到wowhead的部分
// @author       R
// @match        https://www.wow-professions.com/wotlk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wow-professions.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500371/wlk%E4%B8%93%E4%B8%9A%E5%8D%87%E7%BA%A7%E7%BD%91%E7%AB%99%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/500371/wlk%E4%B8%93%E4%B8%9A%E5%8D%87%E7%BA%A7%E7%BD%91%E7%AB%99%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.body.innerHTML = document.body.innerHTML.replace(/wotlk/g, 'wotlk/cn')

})();