// ==UserScript==
// @name         Pixelarity  HTML5up Full download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Downloads all of the themes once you're logged in on pixelarity.com
// @author       acfaruk
// @match        https://pixelarity.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelarity.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443450/Pixelarity%20%20HTML5up%20Full%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/443450/Pixelarity%20%20HTML5up%20Full%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let header = document.getElementById('header')
    let button = document.createElement('button')
    button.innerText = "Download All"

    button.addEventListener('click', () => {
        let items = document.getElementById('items')
        let themes = items.getElementsByTagName('article')
        let i = 0

        var millisecondsToWait = 15000;
        var interval = setInterval(function() {
            if (themes[i]) {
                window.open('https://pixelarity.com/' + themes[i].id + '/download/html');
            } else {
                clearInterval(interval);
            }
            i++;
        }, millisecondsToWait);

    });
    header.appendChild(button)

})();