// ==UserScript==
// @name        rumble video channelName
// @namespace   Violentmonkey Scripts
// @match       https://rumble.com/v*
// @grant       none
// @version     1.01
// @author      copypastetada
// @license MIT
// @description created 8:37 PM 8/12/2021
// @downloadURL https://update.greasyfork.org/scripts/464263/rumble%20video%20channelName.user.js
// @updateURL https://update.greasyfork.org/scripts/464263/rumble%20video%20channelName.meta.js
// ==/UserScript==


var counter0 = 0;
var timer0 = setInterval(function(){
        //console.log("checkkkkkk");
        counter0 += 1;
        //check player presence 2023-02-09 11:21a
        if (document.querySelector("#videoPlayer") != null) {
            var channelName = document.querySelector(".media-heading-name");
            if (channelName) {
                //remove whitespace
                channelName = channelName.textContent.replace(/\s+/g,'');
                if (!~document.title.indexOf(channelName)) {
                    console.log(document.title+" > "+channelName);
                    document.title += " > "+channelName;
                    clearInterval(timer0);
                } else {
                    console.log("__channelName already in title.")
                    clearInterval(timer0);
                }
            } else {
                if (counter0 == 10) {
                    alert('__channelName query error.');
                    clearInterval(timer0);
                }
            }
        }
},1000)


