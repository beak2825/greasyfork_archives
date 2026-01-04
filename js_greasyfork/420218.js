// ==UserScript==
// @name         柳州江畔文章审核脚本
//此脚本来自     柳州职业技术学院  电子信息工程学院  计算机应用技术3班  邱绍倡
// @namespace    *://*.http://manager.ihuaben.com/safetyaudit/auditList?type=11/*
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match       *://*.manager.ihuaben.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420218/%E6%9F%B3%E5%B7%9E%E6%B1%9F%E7%95%94%E6%96%87%E7%AB%A0%E5%AE%A1%E6%A0%B8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420218/%E6%9F%B3%E5%B7%9E%E6%B1%9F%E7%95%94%E6%96%87%E7%AB%A0%E5%AE%A1%E6%A0%B8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {

let btn = document.querySelector(".btn-success");

        document.addEventListener('keyup',function(e){
            if(e.keyCode==70){       //70为键盘F键的键码，其他键盘的键码可以百度自己修改，如空格键为32，就把70改为32


setTimeout(function () {

btn.click();
   }, 1000);     //按键延迟1000为1000毫秒，1000毫秒=1秒，这个也是可以自行修改的

       }
   })
})();



    // 这里就是处理的事件
