// ==UserScript==
// @name         TresDaos Reader
// @namespace    http://tampermonkey.net/
// @version      2025-02-09
// @description  Custom Viewer
// @author       AngelXex
// @match        https://tresdaos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tresdaos.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519373/TresDaos%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/519373/TresDaos%20Reader.meta.js
// ==/UserScript==


var temp = document.getElementsByClassName("adblock_title")[0];
temp = temp.parentElement.parentElement.parentElement.parentElement.parentElement;
temp.remove();

var ad1= document.getElementsByClassName("close-btn")[0].remove();
var ad2= document.getElementsByClassName("close-btn2")[0].remove();
var ad3= document.getElementsByClassName("scrollToTop")[0].remove();
var ad4= document.getElementsByClassName("rnavbot")[0].remove();


var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'FullScreen</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
const collection = document.getElementsByClassName("npv r");
collection[0].appendChild(zNode);




//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);


function ButtonClickAction (zEvent) {
openFullscreen();
}

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}