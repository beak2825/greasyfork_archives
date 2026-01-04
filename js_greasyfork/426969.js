// ==UserScript==
// @name         HostLoc自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.1
// @description  HostLoc auto Login
// @include      https://*.hostloc.com/*
// @include      https://hostloc.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426969/HostLoc%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/426969/HostLoc%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function () {
  //将function函数赋值给onload对象
  window.onload = function ()
  {   
    document.cookie="hkCM_2132_widthauto=1;domain=hostloc.com;path=/;";
    document.querySelector("#lsform > div > div.y.pns > table > tbody > tr:nth-child(2) > td.fastlg_l > button").click();
  }
})();

