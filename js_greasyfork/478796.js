// ==UserScript==
// @name        国医通1- tcmce.cn
// @namespace   Violentmonkey Scripts
// @match       http://www.tcmce.cn/member/taskList.* 
// @grant       none
// @version     1.0
// @author      liang
// @description 2022/3/10 下午4:05:44
// @downloadURL https://update.greasyfork.org/scripts/478796/%E5%9B%BD%E5%8C%BB%E9%80%9A1-%20tcmcecn.user.js
// @updateURL https://update.greasyfork.org/scripts/478796/%E5%9B%BD%E5%8C%BB%E9%80%9A1-%20tcmcecn.meta.js
// ==/UserScript==
window.onload=(function () {
   setTimeout(function () {
    var length = document.getElementsByClassName("kc-block2-1-right").length
    var kc = document.getElementsByClassName("kc-block2-1-right")
    for(i=0;i<length;i++){
      var zt =  kc[i].innerText
      if(zt == "未学习"|| zt == "学习中"){
           kc[i].click();
        }
    }
},1000)
              }
)();
