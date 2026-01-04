// ==UserScript==
// @name        精能电子自动上网拨号 
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       http://10.168.200.1/ac_portal/default/pc.html*
// @grant       none
// @version     1.0
// @author      饶云
// @description 2022/5/10 下午2:53:22
// @downloadURL https://update.greasyfork.org/scripts/444784/%E7%B2%BE%E8%83%BD%E7%94%B5%E5%AD%90%E8%87%AA%E5%8A%A8%E4%B8%8A%E7%BD%91%E6%8B%A8%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/444784/%E7%B2%BE%E8%83%BD%E7%94%B5%E5%AD%90%E8%87%AA%E5%8A%A8%E4%B8%8A%E7%BD%91%E6%8B%A8%E5%8F%B7.meta.js
// ==/UserScript==

var IDNumber;
var Passswd;
IDNumber = "JN4007";      //此处请换成自己的工号，别把我挤下去了 谢谢！
Passwd = "123456";

window.onload=function()
{ 
  setTimeout(function()
  {
      var idNum =document.getElementById('password_name');
      var passwd =document.getElementById('password_pwd');
      idNum.value = IDNumber;
      passwd.value = Passwd;
    
      var btnLogin =document.getElementById('password_submitBtn');
      btnLogin.click();
    
  },700);
}