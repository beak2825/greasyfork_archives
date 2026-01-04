// ==UserScript==
// @name         破解我爱学习网站需要扫码获取验证码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  破解我爱学习网站需要扫码获取验证码，引入了jquery
// @author       You
// @match        https://www.5axxw.com/questions/content/322d1x
// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5axxw.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452851/%E7%A0%B4%E8%A7%A3%E6%88%91%E7%88%B1%E5%AD%A6%E4%B9%A0%E7%BD%91%E7%AB%99%E9%9C%80%E8%A6%81%E6%89%AB%E7%A0%81%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/452851/%E7%A0%B4%E8%A7%A3%E6%88%91%E7%88%B1%E5%AD%A6%E4%B9%A0%E7%BD%91%E7%AB%99%E9%9C%80%E8%A6%81%E6%89%AB%E7%A0%81%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(() => {
        $('#gzh-mask').hide();
        $('#gzh-modal').hide();
        window.open(data.addr, 'nWin-19092', 'location=no,toolbar=no,scrollbars=yes,menubar=no,top=200,left=100,width=800,height=500');
    },5000)
})();