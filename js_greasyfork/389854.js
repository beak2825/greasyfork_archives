// ==UserScript==
// @name         CSDN_clean
// @namespace    CSDN_clean
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389854/CSDN_clean.user.js
// @updateURL https://update.greasyfork.org/scripts/389854/CSDN_clean.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //删除广告    
    var child= document.querySelector("body > div.pulllog-box");
    child && child.parentNode.removeChild(child);

    var child2 = document.querySelector("#kp_box_476 > div > div.light-box");
    child2 && child2.parentNode.removeChild(child2);

    var child3 = document.querySelector("#inlineFrameExample");
    child3 && child3.parentNode.removeChild(child3);

    var child4 = document.querySelector("#adContent");
    child4 && child4.parentNode.removeChild(child4);

    var child5 = document.querySelector("#asideFooter");
    child5 && child5.parentNode.removeChild(child5);

    var sideBar = document.querySelector('#mainBox > aside');
    sideBar && sideBar.parentNode.removeChild(sideBar);

    var header = document.querySelector("#csdn-toolbar")
    header && header.parentNode.removeChild(header)

    var child6 = document.querySelector("body > div.tool-box.vertical")
    child6 && child6.parentNode.removeChild(child6)
    
    let m = setInterval( () => {
        var child7 = document.querySelector("body > div:nth-child(41) > div")
        child7 && child7.parentNode.removeChild(child7) && clearInterval(m)    
    },3000)
    
    
    //点击阅读更多
    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);　　
    var readmore = document.querySelector("#mainBox > main > div.hide-article-box.hide-article-pos.text-center > a")　　　　　　　　　　　
    readmore && readmore.dispatchEvent(e);　　　
})();