// ==UserScript==
// @name         Meeting Joiner
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically mute camera and join google meets
// @author       Alan Yu
// @grant        none
// @include      https://meet.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/426372/Meeting%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/426372/Meeting%20Joiner.meta.js
// ==/UserScript==

(function() {
    'use strict';
function join(){
    //If the window is closed, set window name in local storage
    window.onbeforeunload = function(){
        window.opener.postMessage(window.location.href+","+window.name, "*");
    }
    //A bunch of onmessage stuff
    window.onmessage = function(message){
        if(message.data == "leave"){
            //Don't post message on close
            window.onbeforeunload = function(){}
            //Try closing window
            window.close();
        }
        if(message.data == "audioEnded"){
            document.querySelector('[data-tooltip="Turn off microphone (ctrl + d)"]').click();
        }
        if(message.data == "setJoinTimestamp"){
            localStorage.setItem("joinedTimestamp", Date.now()/1000);
        }
    }
    //check if on meet homepage
    if(!(document.querySelector('div.cmvVG')==null)){
        //kill the script
        return "You are on the homepage";
    }
    var loop = setInterval(function(){
        try{
            //mute cam
            document.querySelector('[aria-label="Turn off camera (ctrl + e)"]').click();
            //mute mic
            document.querySelector('[aria-label="Turn off microphone (ctrl + d)"]').click();
            //only if button is there
            if(document.documentElement.innerText.includes("Join now")){
                //join meeting
                document.querySelector('[jsname="Qx7uuf"]').click();
            }
        }
        catch{
            //only if button is there
            if(document.documentElement.innerText.includes("Join now")){
                //join meeting
                document.querySelector('[jsname="Qx7uuf"]').click();
            }
        }
        finally{
            //check if in meeting
            if(!(document.querySelector('[aria-label="Leave call"]')==null)){
                //stop clicking
                clearInterval(loop)
                //kill the script
                return "You are in the meeting";
            }
        }
    }, 100);
}
var checkready = setInterval(function(){
    if(document.readyState == "complete" && document.hasFocus()){
        console.log(join());
        document.querySelector("title").innerText = document.querySelector("title").innerText.replaceAll(" -- YOU MUST FOCUS TAB TO JOIN", "")
        clearInterval(checkready)
    }
    else if(!(document.hasFocus()||document.querySelector("title").outerHTML.includes(" -- YOU MUST FOCUS TAB TO JOIN"))){
        document.querySelector("title").innerText = document.querySelector("title").innerText + " -- YOU MUST FOCUS TAB TO JOIN"
    }
    else{
        console.log("DOCUMENT STATE: " + document.readyState);
    }
}, 100);
})();