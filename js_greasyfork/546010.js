// ==UserScript==
// @name         Enhanced Canvas for pawprint.ing
// @namespace    https://greasyfork.org/en/scripts/546010-enhanced-canvas-for-pawprint-ing/code
// @version      0.3
// @description  Canvas clear confirmation and full screen.
// @author       ban
// @match        https://pawprint.ing/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pawprint.ing
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/546010/Enhanced%20Canvas%20for%20pawprinting.user.js
// @updateURL https://update.greasyfork.org/scripts/546010/Enhanced%20Canvas%20for%20pawprinting.meta.js
// ==/UserScript==

// confirm
function wow () {
  if(confirm("Are you sure you would like to clear your canvas?")) {
    DrawingUtils.clearCanvas(document.getElementById('drawingCanvas'));
  }
}

const tB = document.querySelector('button[title="Clear"]');
tB.setAttribute("onclick","");
tB.addEventListener("click",wow);

//full screen

var dC //determine if profile or pawception
if (document.getElementById("drawContent") !== null) {
    dC = document.getElementById("drawContent").style;
} else {
    dC = document.getElementsByClassName("card-body p-2")[3].style;
}

const wp = document.getElementsByClassName("paint-container-wrapper")[0].style;
const mA = document.getElementsByClassName("main-area")[0].style;
var f = false;

function fs() {
    if(f == false){
        dC.position = "fixed";
        dC.left = 0;
        dC.top = 0;
        dC.width = "100vw";
        dC.height = "100vh";
        dC.zIndex = "10000";
        wp.height = "100%";
        wp.width = "100%";
        mA.height = "100%";
        mA.alignItems = "initial";
    } else {
        dC.position = "";
        dC.width = "";
        dC.height = "";
        dC.zIndex = "";
        wp.height = "";
        wp.width = "";
        mA.height = "";
        mA.alignItems = "";
    }
    f = !f;
}
//this code is disgusting but i don't feel like cleaning it up right now
const fsB = document.createElement("button");
fsB.textContent = "Expand";
fsB.addEventListener("click",fs);
document.getElementById("windowTitle").appendChild(fsB);

// hide alert
var ab = false;
const alrt = document.getElementsByClassName("alert alert-info")[0];
alrt.style.transition = "500ms cubic-bezier(0,.63,0,1)";
function hide() {
    if(ab == false) {
        alrt.style.maxHeight = "8px";
        alrt.style.padding = "0";
    } else {
        alrt.style.maxHeight = "";
        alrt.style.padding = "";
    }
    ab = !ab;
}
alrt.addEventListener("click",hide);