// ==UserScript==
// @name         jlpt登录优化插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动补全账号密码,直接显示验证码，输入完验证码自动登录功能
// @author       Faxlok
// @match        https://jlpt.neea.edu.cn/index.do*
// @match        https://jlpt.neea.cn/index.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423773/jlpt%E7%99%BB%E5%BD%95%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/423773/jlpt%E7%99%BB%E5%BD%95%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
var imgCode = document.querySelector("[name=chkImgCode]");
new MutationObserver(function (mutations, observer) {
  mutations.forEach(function(mutation) {
    var chkImgDiv = document.getElementById('chkImgDiv');
    if(chkImgDiv.style.display!='block'){
        chkImgDiv.style.display='block';
        if(document.getElementById('loginDiv').style.display!='none'){getChkimgAjax('loginDiv');}
        if(document.querySelector("[name=ksIDNO]").value == ""){
            document.querySelector("[name=ksIDNO]").value="这里填入你的身份证";
            document.querySelector("[name=ksPwd]").value="这里填入你的密码";//不用担心你的身份证和密码会泄露，害怕的话可以使用完后再改
            imgCode.focus();
        };
    }
      imgCode.oninput = function (e) {
          //if(e.keyCode == 13)login(document.forms[0]);
          if(imgCode.value.length == 4)login(document.forms[0]);
       }
  });
}).observe(document.querySelector('#layer'), {'attributes':true});
})();