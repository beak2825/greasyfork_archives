// ==UserScript==
// @name         Reload Until Valid
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Reload google meets until the meeting starts
// @author       Alan Yu
// @grant        none
// @include      https://meet.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/426373/Reload%20Until%20Valid.user.js
// @updateURL https://update.greasyfork.org/scripts/426373/Reload%20Until%20Valid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function load(){
        var dest;
        var code = window.location.href
        if(code.includes("https://meet.google.com/_meet")){
            code = code.slice(window.location.href.indexOf("alias=")+"alias=".length)
            if(code == window.location.href){
                dest = window.location.href
            }
            else{
                dest = "https://meet.google.com/lookup/" + code.replaceAll("&authuser=0", "").replaceAll("%26authuser%3D0", "")
            }
        }
        else{
            dest = window.location.href
        }
        var reload = setInterval(function(){
            if(document.documentElement.innerHTML.includes("Return to home screen")&&!document.documentElement.innerText.includes("Ready to join")){
                window.location.href = dest
            }
            else{
                clearInterval(reload);
                return "Job finished"
            }
        }, 3000);
    }
    console.log(load());
})();