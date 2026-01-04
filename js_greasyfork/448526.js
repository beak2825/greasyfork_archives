// ==UserScript==
// @name         Fucking CSDN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  like the name of this script ..
// @author       J
// @match        https://blog.csdn.net/*/article/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448526/Fucking%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/448526/Fucking%20CSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("csdn-toolbar")?.setAttribute("style","display:none;");
    document.getElementById("toolBarBox")?.setAttribute("style","display:none;");
    document.getElementsByClassName("blog_container_aside")[0].innerHTML="<span></span>";
    document.getElementsByClassName("csdn-side-toolbar")[0].setAttribute("style","display:none;");
    var leveTwo = document.getElementById("blogColumnPayAdvert")?.setAttribute("style","display:none");
    document.getElementsByTagName("main")[0].setAttribute("style","width:100%;margin:0;")
    var newElHtml = "";
    var nickName = document.getElementsByClassName("follow-nickName ")[0];
    var path = nickName.getAttribute("href");
    var txt = nickName.innerHTML;
    newElHtml+="<span style='height: 20px;background-color: #3271ae;color:#ffffff;padding: 4px;font-size: 12px;font-weight: bold;border-radius: 5px;margin: 0 5px;'>Author：<a style='color:#ffffff;' href=''"+path+"''>"+txt+"</a></span>";
    var timeTxt = document.getElementsByClassName("time")[0].innerHTML;
    var time = timeTxt.substring(8,timeTxt.length-8);
    newElHtml+="<span style='height: 20px;background-color: #007175;color:#ffffff;padding: 4px;font-size: 12px;font-weight: bold;border-radius: 5px;margin: 0 5px;'>PostTime："+time+"</span>";
    var readCount = document.getElementsByClassName("read-count")[0].innerHTML;
    newElHtml+="<span style='height: 20px;background-color: #d23918;color:#ffffff;padding: 4px;font-size: 12px;font-weight: bold;border-radius: 5px;margin: 0 5px;' >ReadCount："+readCount+"</span>";
    var tags = document.getElementsByClassName("tag-link");
    if(tags.length > 0){
        newElHtml +="<span style='height: 20px;background-color: #d9883d;color:#ffffff;padding: 4px;font-size: 12px;font-weight: bold;border-radius: 5px;margin: 0 5px;' > Tags:";
        for (let i = 0; i < tags.length; i++) {
            var href = tags[i].getAttribute("href");
            var t = tags[i].innerHTML;
            newElHtml+="<a style='border: 1px solid #fff;color: white;border-radius: 3px;padding: 1px;margin: 0 5px;' href='"+href+"'>"+t+"</a>";
        }
        newElHtml +="</span>";
    }
    var el = document.getElementsByClassName("article-info-box")[0];
    el.innerHTML=newElHtml;
    el.setAttribute('style','background-color:rgba(0,0,0,0);');
    document.getElementsByClassName("article-header-box")[0].setAttribute('style','border-bottom:0;');
})();