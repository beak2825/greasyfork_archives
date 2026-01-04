// ==UserScript==
// @name         PixelPlace User Finder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A way to find a user on PixelPlace. Just enter their username in the textbox on the bottom of your screen and press the Find User button. [NOTE] This script is completely useless and made out of boredom.
// @author       PeanutTale
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457830/PixelPlace%20User%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/457830/PixelPlace%20User%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.style.position = 'fixed';
    textBox.style.bottom = '0';
    textBox.style.left = '50%';
    textBox.style.marginBottom = '10px';
    textBox.style.transform = 'translateX(-50%)';
    textBox.style.height = '50px';
    textBox.style.border = '1px solid black';
    textBox.style.backgroundColor = '#ccc';
    textBox.style.borderRadius = '5px';
    document.body.appendChild(textBox);
    var button = document.createElement('button');
    button.innerHTML = 'Find User';
    button.style.position = 'fixed';
    button.style.bottom = '0';
    button.style.left = '57%';
    button.style.transform = 'translateX(-50%)';
    button.style.marginLeft = '10px';
    button.onclick = function() {
        var url = window.location.href;
        var urlParts = url.split('#');
        var newUrl = 'https://pixelplace.io/7-pixels-world-war' + '#user=' + textBox.value;
        window.location.href = newUrl;
        location.reload();
    }
    document.body.appendChild(button);
    
    if (window.location.href == 'https://pixelplace.io/forums/') {
        document.body.removeChild(button);
        document.body.removeChild(textBox);
    }
})();