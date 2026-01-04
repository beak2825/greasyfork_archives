// ==UserScript==
// @name         破除考试资料网
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  try to take over the world!
// @author       You
// @match        *://www.ppkao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373004/%E7%A0%B4%E9%99%A4%E8%80%83%E8%AF%95%E8%B5%84%E6%96%99%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/373004/%E7%A0%B4%E9%99%A4%E8%80%83%E8%AF%95%E8%B5%84%E6%96%99%E7%BD%91.meta.js
// ==/UserScript==

(function() {
 var Days = 30; 
 var exp = new Date(); 
 exp.setTime(exp.getTime() + Days*24*60*60*1000); 
 document.cookie="PPKAO=PPKAOSTID=&PPKAOCEID=&PPKAOSJID=&UserName=&EDays=; domain=ppkao.com;expires="+exp.toGMTString()+";path=/";     
})();

document.oncontextmenu = function(){
    return true;
}
$(".ss").remove();
$(".tm-bottom a").mousedown(function(){
    var str = $(this).attr("onclick");
    var reg = /[/].*?\d{5,7}/;
    var temp = "http:" + str.match(reg)[0];
    $(this).attr({
        "rel":"",
        "href":temp,
        "target":"_blank",
        "onclick":""
    });
});