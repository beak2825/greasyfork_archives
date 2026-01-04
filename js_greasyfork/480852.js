// ==UserScript==
// @name         深信服堡垒机自动登录
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  深信服堡垒机自动登录脚本，使用前需要将<深信服IP><用户名><密码>等参数替换为实际的值
// @author       WK
// @match        https://<深信服IP>/fort/login
// @match        https://<深信服IP>/fort/
// @match        https://<深信服IP>/fort/operation/sso/sso-rdp2-pwd-fill?accountType=*
// @icon         https://<深信服IP>/fort/trust/version/sxf/trust/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480852/%E6%B7%B1%E4%BF%A1%E6%9C%8D%E5%A0%A1%E5%9E%92%E6%9C%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/480852/%E6%B7%B1%E4%BF%A1%E6%9C%8D%E5%A0%A1%E5%9E%92%E6%9C%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    var path = window.location.pathname;
    if(path.indexOf("login")>-1){
      //登录页自动登录
      var username = "<用户名>";
      var pwd = sm3("<密码>");
      //$("#username").val('');
      //$("#pwd").val(sm3(''));
      //$("#do_login").click();
      $.ajax({
      cache: !1,
      type: "POST",
      url: window.top.ctx + "login/do_login",
      dataType: "text",
      data: "loginRandom=" + 100 * Math.random()+"&username=" + username + "&flag=2&pwd="+pwd,
      async: !0,
      success: function (data) {

      }
      })
    }else if(path.indexOf("fort")>-1){
      //显示密码本
      $("#body1").prepend("<button id='loadPwd'onclick='loadPwd()' style='position: absolute;top: 10px;right: 50px;z-index:999;background: blue;color:white;'>密码本</button>");
      var pwdBook = '<script>function loadPwd(){$("#body1").prepend("<p id=\'pwd_t\' style=\'position: absolute;bottom: 50px;left: 50px;z-index:999;background: white;\'>' +
      'User:<br>' +
      'Administrator<br>' +
      'root<br>' +
      'user1<br><br>' +
      'Pwd:<br>' +
      'aaaaa<br>' +
      'bbbbb<br>' +
      'ccccc<br>' +
      'ddddd'+
      '</p>");}</script>';
     $("head").prepend(pwdBook);
    }
})();