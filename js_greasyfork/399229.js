// ==UserScript==
// @name         Pyg自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.chinapyg.com/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/399229/Pyg%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/399229/Pyg%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var q=function(){
        unsafeWindow.Icon_selected("kx");
        var d=document.querySelector("#qiandao > div > table.tfm > tbody > tr:nth-child(1) > td > label:nth-child(2) > input[type=radio]")
        d.click()
        var e=document.querySelector("#qiandao > p > button")
        e.click()
        location.href="https://www.chinapyg.com"
    }
    var a=document.getElementById("um")
    var b=document.querySelector("#um > p:nth-child(2) > a:nth-child(14)")
    console.log(b)
    var t=b.getAttribute("id")
    if ( t!="jakyge_zanzhu4" ){
        b.click()
        setTimeout(q, 5000)
    }
    else{
        console.log("您已签到")
    }

    //unsafeWindow.Icon_selected("kx")
    // Your code here...
})();