// ==UserScript==
// @name         GoForTheTicket !
// @namespace    smlW
// @version      2.3
// @description  抢票一条龙 讲坛不用愁!
// @author       smlW
// @match        *://*.jinshuju.net/f/*
// @match        *://*.lingxi360.com/f?*
// @icon         https://github.com/fluidicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397233/GoForTheTicket%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/397233/GoForTheTicket%20%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var name = "";       //姓名
    var number = "";     //学号
    var hour = 18;       //抢票开始的小时(记得校正电脑本地时间)
    var minute = 0;      //开始的分钟(一般都是整点吧)

    var obj = document.getElementsByTagName("input");
    var url = document.domain;
    if (url.indexOf("jinshuju") != -1 && obj.length !=0){
        obj[2].value = name;
        obj[3].value = number;
        obj[7].checked = true;
        document.getElementById("new_entry").submit();
    }
    else if(url.indexOf("lingxi") != -1 && obj.length !=0){
        obj[10].value = name;
        obj[11].value = number;
        document.getElementById("lingxi_form").submit();
    }

    setInterval(
        function(){
            var d=new Date();
            if(d.getHours()==hour&&d.getMinutes()==minute&&d.getSeconds()==1){
                location.reload(true);}
        },1000);
})();