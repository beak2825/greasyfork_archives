// ==UserScript==
// @name         Humble Bundle Bulk Redeemer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  "try to take over the world!"
// @author       You
// @match        https://www.humblebundle.com/downloads*
// @grant        none
// @license      UNLICENSE
// @downloadURL https://update.greasyfork.org/scripts/469783/Humble%20Bundle%20Bulk%20Redeemer.user.js
// @updateURL https://update.greasyfork.org/scripts/469783/Humble%20Bundle%20Bulk%20Redeemer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keysButton = document.createElement('a');

    keysButton.text = "Redeem all keys";
    //keysButton.target = "_blank";
    keysButton.classList = "button blue button-title";
    keysButton.setAttribute("onclick", "activateAllKeys(); return false;");

    window.addEventListener('load', function() {
        //keysButton.href = "#";
        document.getElementsByClassName('key-container wrapper')[0].prepend(keysButton);
        document.getElementsByClassName('multiselect-confirm')[0].prepend(keysButton);
    });

    window.activateAllKeys = function activateAllKeys()
    {
        window.open("https://store.steampowered.com/account/registerkey?key=" + getAllKeys(), "_blank");
    }

    function getAllKeys(){
        let keyslist = "";

        Array.from(document.getElementsByClassName('keyfield-value')).forEach(key => {
            var val = key.innerHTML
            if (val.includes("Reveal your") === false) {
                keyslist += val + ",";
            }
        });

        return keyslist;
    }
})();