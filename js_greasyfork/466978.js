// ==UserScript==
// @name         notion-audio-loop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search all the audio element on the notion page, and set the "loop" attribute to true.
// @author       You
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466978/notion-audio-loop.user.js
// @updateURL https://update.greasyfork.org/scripts/466978/notion-audio-loop.meta.js
// ==/UserScript==


//check every 300ms
//if we found any audio element, set the lop attribute to true
const intervalID = setInterval(_ => {
    var x = document.querySelectorAll("audio");

    for(var i = 0; i < x.length; i++){
        if(x[i].loop != true){
            console.log("Set audio's loop attribute to true");
            x[i].loop = true;
            //let the user know that the loop is actived (can be tell from the appearance)
            x[i].style.width = "95%";
        }
    }
}, 300);