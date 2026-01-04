// ==UserScript==
// @name         虎牙免登陆（修复版）
// @namespace    https://greasyfork.org/
// @version      1.2.0
// @description  虎牙免登陆看高清
// @author       smzh369
// @match        *://www.huya.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.5.0.min.js
// @license      GPL V3
// @downloadURL https://update.greasyfork.org/scripts/385220/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E9%99%86%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/385220/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E9%99%86%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  $(document).ready(function(){
    localStorage.loginTipsCount = -1e+35;
    $('#player-login-tip-wrap').remove();
    VPlayer.prototype.checkLogin(true);
    console.log(VPlayer);
  });
})();
