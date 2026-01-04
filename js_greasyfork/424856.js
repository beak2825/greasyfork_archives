// ==UserScript==
// @name         pku教学网直接跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  PKU 教学网跳转iaaa登陆
// @match        https://course.pku.edu.cn/
// @match        https://course.pku.edu.cn/webapps/login/
// @icon         https://www.google.com/s2/favicons?domain=pku.edu.cn
// @downloadURL https://update.greasyfork.org/scripts/424856/pku%E6%95%99%E5%AD%A6%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/424856/pku%E6%95%99%E5%AD%A6%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
//var now_url = window.location.href;
//if (now_url=="https://course.pku.edu.cn/") {
window.location.replace("https://course.pku.edu.cn/webapps/bb-sso-bb_bb60/login.html")
//}

    // Your code here...
})();