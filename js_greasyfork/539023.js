// ==UserScript==
// @name         Scratch Background dark theme.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes Scratch background to black
// @author       Unknow
// @match        https://scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539023/Scratch%20Background%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/539023/Scratch%20Background%20dark%20theme.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to change the background color of Scratch to black
    function changeBackgroundColor() {
        document.body.style.backgroundColor = 'black';
    }
 
    // This sets the background
    function blackimage() {
        const ChangeBackgroundUrl = 'https://imagehub.fun/image.php?id=X9VOZJ.png';
        const img = new Image();
        img.src = ChangeBackgroundUrl;
        img.style.display = 'none';
        document.body.appendChild(img);
    }

    // Sets the style to black, if the image doesn't work.
    function SetBlack() {
        const style = document.createElement('style');
        style.innerHTML = `
            body > img {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
 
    // Call the functions, makes the code work :)
    changeBackgroundColor();
    blackimage();
    SetBlack();
})();