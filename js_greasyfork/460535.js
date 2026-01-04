// ==UserScript==
// @name         Thumbsnap Auto-Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  title says all
// @author       ded
// @match        https://thumbsnap.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thumbsnap.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460535/Thumbsnap%20Auto-Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/460535/Thumbsnap%20Auto-Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.match("/f/")) {
        var ogImage = document.createElement("BUTTON");
        var t = document.createTextNode("Open Original Image");
        ogImage.onclick = function()
        {
            const collection = document.getElementsByClassName("thepic");
            window.location.href = collection[0].src;
        }
        ogImage.appendChild(t);
        document.getElementById("top").appendChild(ogImage);
    }

    if (!window.location.href.match("/f/") && !window.location.href.match("/i/")) {
        window.location.href = "https://thumbsnap.com/f/" + window.location.href.split("/")[3]
    }
})();