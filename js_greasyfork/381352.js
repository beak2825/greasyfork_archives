// ==UserScript==
// @name         阿里云es优化
// @namespace    https://jeff.wtf/
// @version      0.1
// @description  try to take over the world!
// @author       sljeff
// @match        https://elasticsearch-cn-hangzhou.console.aliyun.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381352/%E9%98%BF%E9%87%8C%E4%BA%91es%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/381352/%E9%98%BF%E9%87%8C%E4%BA%91es%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        var dom = document.getElementsByClassName('wind-rc-app-layout-content')[0]
        dom.style.overflowY = 'hidden'
    }
})();