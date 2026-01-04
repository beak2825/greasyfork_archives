// ==UserScript==
// @name         破解IT1352网站微信扫码
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  比之前简单了很多
// @author       You
// @match        https://www.it1352.com/*.html
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=it1352.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451457/%E7%A0%B4%E8%A7%A3IT1352%E7%BD%91%E7%AB%99%E5%BE%AE%E4%BF%A1%E6%89%AB%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/451457/%E7%A0%B4%E8%A7%A3IT1352%E7%BD%91%E7%AB%99%E5%BE%AE%E4%BF%A1%E6%89%AB%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() =>{
        $.cookie('olduser', '1', { domain: 'it1352.com', expires: 15 });
        $('#chkinfo').fadeIn(100);
        $('#chkinfo').html('登录成功，请稍后..').addClass('tipok').removeClass('tiperr');
        setTimeout("$('#pop').fadeOut();", 1000);
        window.location.reload();
    },5000)
    // Your code here...
})();