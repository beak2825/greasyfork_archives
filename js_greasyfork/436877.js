// ==UserScript==
// @name         uui设计简化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除烦人的微信登陆与本身的广告
// @author       xingmingwo
// @match        https://uiiiuiii.com/*
// @icon         https://image.uisdc.com/wp-content/uploads/2018/05/uisdc-ico-apple.jpg
// @grant        none
// @require      http://code.jquery.com/jquery-migrate-1.2.1.min.js
// @run-at       document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/436877/uui%E8%AE%BE%E8%AE%A1%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436877/uui%E8%AE%BE%E8%AE%A1%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(($,w) => {
   w.onload= ()=>{
     // 移除登录页面
      if (uisdc) {
        uisdc.weChatLogined = 1;
        $('.mark').remove();
        $('#modal_login').remove();
    }
    // 移除广告
    let ashow = $('.spark_rm'), fbar = $('.footer-bar'), widget = $('.widget');
    [ashow, fbar, widget].forEach(v => {
        console.log(v);
        v.remove();
    });
 }
})(jQuery,window);