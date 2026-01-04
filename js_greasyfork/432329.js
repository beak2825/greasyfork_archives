// ==UserScript==
// @name         暨南大学 JNU 免验证
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除暨南大学JNU相关网站滑动认证
// @author       611
// @match        https://icas.jnu.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432329/%E6%9A%A8%E5%8D%97%E5%A4%A7%E5%AD%A6%20JNU%20%E5%85%8D%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432329/%E6%9A%A8%E5%8D%97%E5%A4%A7%E5%AD%A6%20JNU%20%E5%85%8D%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
//id :   captcha
    // 在认证页面删除captcha节点，从而避免无意义认证
    document.getElementById('captcha').remove();
    // Your code here...
})();