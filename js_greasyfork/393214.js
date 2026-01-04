// ==UserScript==
// @name         四川大学课程中心兼容助手
// @namespace    SCUCourseCenterHelper
// @version      0.1
// @description  虽然只有一行代码，但是希望帮助没有IE的用户使用四川大学课程中心，关于无法提交作业的问题可以参考我博客上的解决方案。
// @author       IzaiahSun
// @include      http://cc.scu.edu.cn/G2S/Showsystem/Index.aspx
// @grant        unsafeWindow
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/393214/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E5%85%BC%E5%AE%B9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/393214/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E5%85%BC%E5%AE%B9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('menubg')[0].removeAttribute('style');
    // Your code here...
})();