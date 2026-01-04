// ==UserScript==
// @name         基金从业人员远程培训工具
// @namespace    https://github.com/shiba2046/greasemonkey-scripts
// @version      0.4
// @description  Prevent the video stop when lost focus
// @author       Pengus
// @match        https://peixun.amac.org.cn/*
// @icon         https://peixun.amac.org.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442859/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/442859/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('blur', function() {
        window.onblur = {}
    }, false);

})();