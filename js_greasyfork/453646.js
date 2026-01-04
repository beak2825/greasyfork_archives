// ==UserScript==
// @name         电影天堂(https://m.dytt8.net/)非www,去遮罩层广告
// @namespace    haha
// @version      1.0
// @description  小白自己写的，电影天堂去遮罩层广告专用，自己测试可用，有需要的自取，不更新！
// @author       小白自用
// @match        https://m.dytt8.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453646/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%28https%3Amdytt8net%29%E9%9D%9Ewww%2C%E5%8E%BB%E9%81%AE%E7%BD%A9%E5%B1%82%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/453646/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%28https%3Amdytt8net%29%E9%9D%9Ewww%2C%E5%8E%BB%E9%81%AE%E7%BD%A9%E5%B1%82%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let count=0;
    let as = function(){
        var da = document.getElementById("ccc123");
        var aa = document.getElementById("HMcoupletDivright");
        var ba = document.getElementById("HMcoupletDivleft");
        var ca = document.getElementById("HMRichBox");
        var ww = document.getElementById("wrap-fixed");
        var xx = document.getElementsByClassName("hmcakes11")[0];
        var xx1 = document.getElementsByClassName("hmcakes112")[0].parentElement;
        console.log(aa );
        if(aa != null && ba!= null && ca!= null  && ww!= null){
            aa.style.display = 'none';
            ba.style.display = 'none';
            ca.style.display = 'none';
            da.style.display = 'none';
            ww.style.display = 'none';
            xx.style.display = 'none';
            xx1.style.display = 'none';
            clearInterval(ss);
        }
        count++;
        if(count>50){
           clearInterval(ss);
        }
   }
   let browserRedirect = function(){};
    var ss = setInterval(() => {
        setTimeout(as(), 0)
    }, 50)

})();