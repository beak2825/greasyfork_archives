// ==UserScript==
// @name        bitchute video channelName
// @namespace   Violentmonkey Scripts
// @match       http*://www.bitchute.com/*
// @grant       none
// @version     1.0
// @author      copypastetada
// @license     MIT
// @description created 10/23/2020, 2:21:00 AM
// @downloadURL https://update.greasyfork.org/scripts/464261/bitchute%20video%20channelName.user.js
// @updateURL https://update.greasyfork.org/scripts/464261/bitchute%20video%20channelName.meta.js
// ==/UserScript==

//listen to plyrmin.js video ready event
document.addEventListener("ready",function(e){
    //console.log('aaa',e);
    if(!!~location.pathname.indexOf('/video')) {
        var channelName = document.querySelector(".channel-banner .name").textContent;
        //changed to alert only when  channelName query fails -- 2021-03-22 1:39p
        if (channelName) {
            if (!~document.title.indexOf(channelName)) {
                document.title += " > "+channelName;
            } else {
                console.log("__channelName already in title.")
            }
        } else {
            alert('__channelName query problem.');
        }
    }
})
