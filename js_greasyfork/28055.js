// ==UserScript==
// @name         选课提醒
// @namespace    https://osu.ppy.sh/u/376831
// @version      0.1
// @description  选课提醒1
// @author       wcx19911123
// @match        http://192.168.240.168/xuanke/sele_count1.asp?course_no=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28055/%E9%80%89%E8%AF%BE%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/28055/%E9%80%89%E8%AF%BE%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!==null)return  unescape(r[2]); return null;
}
function text(e){
    var t = "";
    //如果传入的是元素，则继续遍历其子元素
    //否则假定它是一个数组
    e = e.childNodes || e;
    //遍历所有子节点
    for(var  j= 0; j < e.length; j++){
        //如果不是元素，追加其文本值
        //否则，递归遍历所有元素的子节点
        t += e[j].nodeType != 1 ? e[j].nodeValue : text(e[j].childNodes);
    }
    //返回区配的文本
    return t;
}
function cycle(s){
    if(s === null || s.length < 2){
        return s;
    }else{
        return s.slice(1, s.length) + s.slice(0, 1);
    }
}
(function() {
    'use strict';
    var body = document.getElementsByTagName("body")[0];
    body.onblur=function(){};
    var eventId = null;
    var lastCanChoose = GetQueryString("can") || "false";
    var canChooseTimes = Number(GetQueryString("times")) || 0;
    var isBixiu = Number(GetQueryString("bx")) || 0;
    var str = text(body);
    var title = str.slice(0, str.indexOf("选课情况"));
    var number = window.location.href.slice(window.location.href.indexOf("=")+1, window.location.href.length);
    var allNum = Number(str.slice(str.indexOf("主选学生限制人数：")+9, str.indexOf("主选学生限制人数：")+11));
    var currNum = Number(str.slice(str.indexOf("主选学生已选人数：")+9, str.indexOf("主选学生已选人数：")+11));
    if(currNum < allNum){
        document.title = "▁▂▃▅▆▇▆▅▃▂";
        eventId = setInterval(function(){
            document.title = cycle(document.title);
        }, 100);
        if(lastCanChoose == "false"){
            canChooseTimes++;
            window.open("edu_main.asp?xq=20162&course_no="+number+"&bx="+isBixiu);
            Notification.requestPermission();
            var notify = new Notification("抢课啦！", {body:title+","+number,icon:"https://img.clipartfest.com/4c774bbe88648c271ecb8aa422256b29_exclamation-mark-red-clip-art-clipart-exclamation-mark-free_300-300.png",sound:"http://telecom.26923.com/download/ring/000/102/2fdbd1f0dfed368bde1184b5a2cc0add.mp3"});
        }
        lastCanChoose = "true";
    }else{
        clearInterval(eventId);
        setTimeout(function(){
            document.title = '_____________';
        }, 150);
        lastCanChoose = "false";
    }
    setTimeout(function(){
        if(window.location.href.indexOf("can") == -1){
            window.location.href = window.location.href+"&can="+lastCanChoose+"&bx="+isBixiu+"&times="+canChooseTimes;
        }else{
            window.location.href = window.location.href.slice(0, window.location.href.indexOf("&can=")+5) + lastCanChoose+"&bx="+isBixiu+"&times="+canChooseTimes;
        }
    }, 60000);
})();