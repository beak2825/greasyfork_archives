// ==UserScript==
// @name         河南工学院校园网自动登录（移动）
// @description  自动登录寝室内校园网，其他地方没试过
// @license 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/scripts.php
// @match        http://211.69.15.33:9999/portalReceiveAction.do?wlanuserip=10.50.109.167&wlanacname=HAIT-SR8808
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @downloadURL https://update.greasyfork.org/scripts/452911/%E6%B2%B3%E5%8D%97%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E7%A7%BB%E5%8A%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/452911/%E6%B2%B3%E5%8D%97%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E7%A7%BB%E5%8A%A8%EF%BC%89.meta.js
// ==/UserScript==
var username = "这里填账号";
var password = "这里填密码";
setInterval(function()
{
(function() {
    'use strict';
    document.getElementById("userName").value = username;
    document.getElementById("passwd").value = password;
    //document.getElementsByName('operator').value('@gxyyd').click('input');
    setRadioChecked('operator');
    document.getElementById("checkButton").click();

})();
function setRadioChecked(radioname){
   var obj = document.getElementsByName(radioname);
    for(var i=0;i<obj.length;i++){
      if(obj[i].value =='@gxyyd'){
          obj[i].checked = true;
          break;
      }
    }
}},500);