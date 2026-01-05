// ==UserScript==
// @name         mega dl button fix
// @version      0.2
// @match        https://mega.nz/*
// @description  switches the download buttons and colors the inline button red
// @grant        none
// @namespace https://greasyfork.org/users/29657
// @downloadURL https://update.greasyfork.org/scripts/16924/mega%20dl%20button%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/16924/mega%20dl%20button%20fix.meta.js
// ==/UserScript==

waitForButton();

function doEverything() {
    msbut = document.getElementsByClassName("with-megasync")[0];
    inbut = document.getElementsByClassName("throught-browser")[0];
    // msbut.style.display = "none";
    msbut.className = msbut.className.replace( /(?:^|\s)red(?!\S)/g , '' );
    inbut.className += " red";
    swapElements(msbut, inbut);
}

function waitForButton() {
    buttons = document.getElementsByClassName("throught-browser").length;
    
    if(buttons > 0) {
        doEverything();
    } else {
        setTimeout(waitForButton, 50);
    }
}

function swapElements(obj1, obj2) {
    // from http://stackoverflow.com/a/10717422/4504269
    var parent2 = obj2.parentNode;
    var next2 = obj2.nextSibling;
    if (next2 === obj1) {
        parent2.insertBefore(obj1, obj2);
    } else {
        obj1.parentNode.insertBefore(obj2, obj1);
        if (next2) {
            parent2.insertBefore(obj1, next2);
        } else {
            parent2.appendChild(obj1);
        }
    }
}