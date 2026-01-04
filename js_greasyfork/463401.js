// ==UserScript==
// @name         Get javdb.com AV Num
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://javdb.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463401/Get%20javdbcom%20AV%20Num.user.js
// @updateURL https://update.greasyfork.org/scripts/463401/Get%20javdbcom%20AV%20Num.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand('抓', ()=>{
        var a=document.querySelectorAll("strong")
        var result="";
        for(let i=0;i<a.length;i++){
            let t=a[i].parentElement.innerText;
            if(t.indexOf("-")==-1) continue;
            t=t.replace(" ","\t",1)
            result += t+"\n";
        }
        GM_setClipboard(result, "text");
        speak("video num clipboard")
    });
    function speak(msgText) {
        var msg = new SpeechSynthesisUtterance(msgText);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    }
})();