// ==UserScript==
// @name         工时破解脚本2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://gs-scgl.hnisi.com.cn/scpt/gzl/filltask/fillTask.xhtml?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28839/%E5%B7%A5%E6%97%B6%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC2.user.js
// @updateURL https://update.greasyfork.org/scripts/28839/%E5%B7%A5%E6%97%B6%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("input[value='保存']").attr('onclick','');
    $("input[value='保存并新增']").attr('onclick','');
    // Your code here...
})();