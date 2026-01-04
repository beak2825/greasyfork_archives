// ==UserScript==
// @name         51ixuejiao辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.51ixuejiao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393616/51ixuejiao%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/393616/51ixuejiao%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
$(document).ready(function(){
    setTimeout(function(){
        $(window).off("blur");
        document.onselectstart = "";
        document.oncontextmenu = "";
        console.log("over");
    },500)
})