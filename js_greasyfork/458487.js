// ==UserScript==
// @name         Keep going
// @version      0.2
// @match        https://www.dropbox.com/sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dropbox.com
// @grant        none
// @license      MIT
// @description  simple script to keep changing tracks
// @namespace https://greasyfork.org/users/1012060
// @downloadURL https://update.greasyfork.org/scripts/458487/Keep%20going.user.js
// @updateURL https://update.greasyfork.org/scripts/458487/Keep%20going.meta.js
// ==/UserScript==

function checkIfFinished(event){
    var text = this.innerText;
    //console.log(text.split(" / ")[0] == text.split(" / ")[1]);
    if(text.split(" / ")[0] == text.split(" / ")[1]){
        this.removeEventListener("DOMSubtreeModified", checkIfFinished);
        setTimeout(() => {
            document.querySelectorAll("[aria-label='Successiva']")[0].click();
        }, 500);
        setTimeout(() => {
            document.querySelectorAll("[aria-label='Riproduci']")[0].click();
            document.getElementsByClassName("preview-box")[0].addEventListener('DOMNodeInserted', checkTime);
        }, 3000);
    }
}

function checkTime (event){
    var controls = document.querySelectorAll("[class*='videoControlsToolbar']");//'_toolbar-video-controls-row']");
    //console.log(controls.length);
    if(controls.length){
        this.removeEventListener('DOMNodeInserted', checkTime);
        controls = controls[0];
        controls.addEventListener("DOMSubtreeModified", checkIfFinished)
    }
}

(function() {
    setTimeout(() => {
        document.getElementsByClassName("preview-box")[0].addEventListener('DOMNodeInserted', checkTime);
    }, 2000);
})();