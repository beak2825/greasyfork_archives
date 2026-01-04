// ==UserScript==
// @name         继续教育跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autodo
// @author       Hui
// @match        https://jsxx.gdedu.gov.cn/uc/store/courseRegister
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468531/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468531/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.title = '课程超市') {
        console.log('被退出，重新进')
        window.location.href = document.querySelector('a.u-btn-normal').getAttribute('href');
        document.title='课程学习'
    }
    // Your code here...
})();