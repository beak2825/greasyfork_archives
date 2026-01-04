// ==UserScript==
// @name         Autofill for HSD(哈商大校园网自动填充账户密码)
// @namespace    https://www.cnblogs.com/Tenerome/
// @version      0.1
// @description  Auto fill account and password for HSD school net
// @author       Tenerome
// @include      http://172.17.100.10*
// @icon         https://gitee.com/tenerome/data/raw/master/pic/hsd32.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452501/Autofill%20for%20HSD%28%E5%93%88%E5%95%86%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E6%88%B7%E5%AF%86%E7%A0%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452501/Autofill%20for%20HSD%28%E5%93%88%E5%95%86%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E6%88%B7%E5%AF%86%E7%A0%81%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        f1.DDDDD.value="Your account";
        f1.upass.value="Your password";
    },700);

})();