// ==UserScript==
// @name         腾 讯 视 频 详 情 页 
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  腾 讯 视 频 详 情 页 zyf
// @author       hahahaha
// @include http*://v.qq.com/*
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438714/%E8%85%BE%20%E8%AE%AF%20%E8%A7%86%20%E9%A2%91%20%E8%AF%A6%20%E6%83%85%20%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/438714/%E8%85%BE%20%E8%AE%AF%20%E8%A7%86%20%E9%A2%91%20%E8%AF%A6%20%E6%83%85%20%E9%A1%B5.meta.js
// ==/UserScript==

function run(){
    var realLink=location.href;
    //alert("我是一个警告框！");

    var myurl;

    myurl=realLink.split("cover/")[1].split("/")[0].split(".html")[0]
    myurl="https://v.qq.com/detail/m/"+ myurl + ".html"
    //alert(myurl);
    var block;
	block=document.querySelector('.player_title');
    

    var mamaLink1=document.createElement('a');
    mamaLink1.href=myurl
    mamaLink1.innerText="\n 腾 讯 视 频 详 情 页"
    block.appendChild(mamaLink1);
    
}



setTimeout(function() { run(); }, 2000);



