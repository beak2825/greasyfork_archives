// ==UserScript==
// @name         MHScans Custom Reader
// @namespace    http://tampermonkey.net/
// @version      2024-07-20
// @description  Best Reader Mod for MHScans
// @author       AngelXex
// @match        https://mh.twobluescans.com/series/*/*/
// @icon         https://mh.twobluescans.com/wp-content/uploads/2017/10/512X512-150x150.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501238/MHScans%20Custom%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/501238/MHScans%20Custom%20Reader.meta.js
// ==/UserScript==


var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'FullScreen</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
const collection = document.getElementsByClassName("action-icon");
collection[0].appendChild(zNode);

const paddedit = document.getElementsByClassName("reading-content");
paddedit[0].style.padding = "0px";

const deltop = document.getElementsByClassName("go-to-top active");
deltop[0].remove();

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