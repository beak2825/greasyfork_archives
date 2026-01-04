// ==UserScript==
// @name         复制净化
// @namespace    https://github.com/holll
// @version      0.1
// @description  禁止网页劫持复制功能添加版权信息
// @author       hollc
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483080/%E5%A4%8D%E5%88%B6%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483080/%E5%A4%8D%E5%88%B6%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function disableCopyLink() {
        document.oncopy = null;
    }

    // 使用window.onload确保页面完全加载完成后执行脚本
    window.onload = disableCopyLink;
})();
