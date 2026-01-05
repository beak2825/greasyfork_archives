// ==UserScript==
// @name         gxb-auto-next
// @namespace    http://www233.herokuapp.com/index.php/archives/13/
// @version      0.2
// @description  jie fang shuang shou#(huaji)
// @author       Aonshuy
// @match        https://sdjzu.class.gaoxiaobang.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/16536-waitforkeyelements/code/waitForKeyElements.js?version=103451
// @downloadURL https://update.greasyfork.org/scripts/27130/gxb-auto-next.user.js
// @updateURL https://update.greasyfork.org/scripts/27130/gxb-auto-next.meta.js
// ==/UserScript==




waitForKeyElements (
    "div.progress"
    , commentCallbackFunction
);
//--- Page-specific function to do what we want when the node is found.
function commentCallbackFunction () {
    setInterval(function() {
        var b=document.querySelector('i.gxb-next-blue');
        var a=document.querySelector('span.video-percent').innerHTML;
        if(a=="100"){b.click();}
    },3000)
}
