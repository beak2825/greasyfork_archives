// ==UserScript==
// @name         fsm 个人信息下拉框调整
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  目前这个下拉框有样式问题，稍微调了一下
// @author       IITII
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://fsm.name/*
// @icon         https://avatars.githubusercontent.com/u/33705067?v=4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466757/fsm%20%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF%E4%B8%8B%E6%8B%89%E6%A1%86%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/466757/fsm%20%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF%E4%B8%8B%E6%8B%89%E6%A1%86%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==


(async function () {
    'use strict';
    jQuery("ul[class*='dropdown-menu']:contains('个人')").css({ left: 'initial', right: 0 })
})();