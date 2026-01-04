// ==UserScript==
// @name        TGS Egitim Atlama
// @namespace   Violentmonkey Scripts
// @match       *://academy.tgs.aero/Elearning/*
// @grant       GM_addStyle
// @version     0.1
// @author      -
// @description 07.12.2020 17:19:48
// @downloadURL https://update.greasyfork.org/scripts/421932/TGS%20Egitim%20Atlama.user.js
// @updateURL https://update.greasyfork.org/scripts/421932/TGS%20Egitim%20Atlama.meta.js
// ==/UserScript==

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'ATLA</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
  var video = document.querySelector("video");
  console.log(video.duration);
  video.currentTime = video.duration;
  video.play();
}


//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               fixed;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             red;
        border:                 2px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );