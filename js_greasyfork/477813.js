// ==UserScript==
// @name         永辉-OA显示下班时间
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  永辉-OA显示下班时间信息
// @author       xugr
// @match        https://kq-hrec.yonghui.cn/pub/index.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/477813/%E6%B0%B8%E8%BE%89-OA%E6%98%BE%E7%A4%BA%E4%B8%8B%E7%8F%AD%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/477813/%E6%B0%B8%E8%BE%89-OA%E6%98%BE%E7%A4%BA%E4%B8%8B%E7%8F%AD%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {

    setTimeout(function(){
      show();
    },3000);
    
})();

function show(){
    'use strict';

    var d1 = document.getElementsByClassName('rightBox');
    var d2 = d1[0].getElementsByTagName("div");
    var d3 = d2[0].getElementsByTagName("div");
    var start = d3[0].innerText;
    var hour = parseInt(start.split(":")[0]);
    var min = parseInt(start.split(":")[1]);
    //8:30-18:00 相隔9小时30分钟
    min = min + 30;
    if(min >= 60){
        min = min - 60;
        hour += 1;
    }
    var showMin = ""+min;
    if(min < 10){
      showMin = "0"+min;
    }
    var showHour = hour + 9;

    var end = "下班时间："+ showHour + ":" + showMin;
    d3[0].innerText = start + "        " + end;
}