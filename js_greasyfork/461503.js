// ==UserScript==
// @name         Glasmy auto-click click here
// @namespace    http://sagaryadav.com/
// @version      0.2
// @description  copy element!
// @author       You
// @match        https://www.glasmy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glasmy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461503/Glasmy%20auto-click%20click%20here.user.js
// @updateURL https://update.greasyfork.org/scripts/461503/Glasmy%20auto-click%20click%20here.meta.js
// ==/UserScript==

window.addEventListener('load', sleepLikeaBaby)

function sleepLikeaBaby() {
    setTimeout(startProgram, 100);
}

function doClicking(thisElement) {
    thisElement.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: 'smooth'
    });
    thisElement.style.color = '#FFA500'; // Orange color hex
    thisElement.style.font = '40px';
    thisElement.target = '_top';
    window.open(thisElement.href);
}

var insertLink = "";


function startProgram () {
    let allLinks = document.getElementsByTagName('a');
    for (let a in allLinks) {
        if(allLinks[a].target == '_blank' && allLinks[a].innerText != "" && (allLinks[a].href.includes("udemy") || (allLinks[a].href.includes("udacity") ))) {
            if (allLinks[a].innerText == 'Click Here') {
                doClicking(allLinks[a])
            }
        }
    }
}
