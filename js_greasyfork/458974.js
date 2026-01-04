// ==UserScript==
// @name         discogs/copy-info-for-wantlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy the stats to the clipboard
// @author       You
// @match        https://www.discogs.com/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discogs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458974/discogscopy-info-for-wantlist.user.js
// @updateURL https://update.greasyfork.org/scripts/458974/discogscopy-info-for-wantlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn = document.getElementsByClassName('button_3lXdg grey_1js2e button_3lhp0')[1];

    btn.addEventListener("click", function() {
        // Find the element containing the text to be copied
        var textToCopy = document.getElementById("release-stats");

        // Create a temporary textarea element to copy the text
        var tempTextArea = document.createElement("textarea");
        tempTextArea.value = textToCopy.innerText.replace("Statistics","").replace(/[<]br[^>]*[>]/gi,"").trim();
        document.body.appendChild(tempTextArea);
        tempTextArea.select();

        // Copy the text to the clipboard
        document.execCommand("copy");

        // Remove the temporary textarea element
        document.body.removeChild(tempTextArea);
    });
})();
