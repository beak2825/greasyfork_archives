// ==UserScript==
// @name         PTable Element Changer
// @namespace    http://tampermonkey.net/
// @version      2024-01-03
// @description  Simple Element Changer, made for my pookie
// @author       Gabi
// @match        https://ptable.com/*
// @license MIT 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ptable.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/483753/PTable%20Element%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/483753/PTable%20Element%20Changer.meta.js
// ==/UserScript==

document.addEventListener('keydown', (e) => {
    if(e.key==="c") {
        var element = parseInt(prompt('Select Element (1-118)'));
        var targetElement = document.querySelectorAll('[data-atomic]')[element-1];

        var targetText = parseInt(prompt('Change:  1: Number  2: Subtitle  3: Name  4: Weight'))

        var newTitle = prompt("Change To:")

        if(targetText==1) targetElement.childNodes[1].innerText=newTitle;
        if(targetText==2) targetElement.childNodes[3].innerText=newTitle;
        if(targetText==3) targetElement.childNodes[5].innerText=newTitle;
        if(targetText==4) targetElement.childNodes[7].innerText=newTitle;
    }
})