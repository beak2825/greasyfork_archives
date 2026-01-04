// ==UserScript==
// @name         PinkSeaMobile Userscript
// @namespace    https://github.com/Driftini/pinkseamobile
// @version      1.0.1
// @description  Complementary userscript for my userstyle to improve drawing on PinkSea from mobile devices
// @author       Driftini (https://github.com/Driftini)
// @match        https://pinksea.art/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinksea.art
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523400/PinkSeaMobile%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/523400/PinkSeaMobile%20Userscript.meta.js
// ==/UserScript==

function can_load() {
    return document.location.href.endsWith("/paint") || document.location.href.endsWith("/paint/");
}

function load(direct = false) {
    /*
     *  "direct" determines whether or not:
     *      - /paint was loaded through a refresh or from the browser URL bar ()
     *      - /paint was loaded from another page in PinkSea
     */

	const BETA_NOTE = "\n\nNOTE: Mobile support is officially coming to PinkSea!\nIt is recommended to try it on beta.pinksea.art/paint, as it already offers features this userscript does not.\nOnce mobile support comes out of beta on PinkSea, this userscript will be deprecated."

    try {
        setTimeout(() => {
            document.getElementById("tegaki-ctrlgrp-layers").setAttribute("tabindex", -1);
            document.getElementById("tegaki-ctrlgrp-color").setAttribute("tabindex", -1);

            let msg = "The PinkSea mobile userscript should have loaded successfully!"
            if (!direct)
                msg += "\n\nUpon closing this message, you will be prompted to enter a canvas size."
            alert(msg+BETA_NOTE);

            if (!direct)
                document.querySelector("#tegaki-menu-bar>.tegaki-mb-btn:nth-child(1)").click()
        }, 500);
    }
    catch (e) {
        alert("The PinkSea mobile userscript has attempted to load, but failed.\n\n" + e + BETA_NOTE);
    }
}

(function () {
    'use strict';

    if (can_load())
        load(true);
    else {
        // Copying the original method to not make the code
        // freak out over too much recursion
        let rs = history.replaceState;

        // Allow the script to react to the URL change
        history.replaceState = function () {
            rs.apply(history, arguments);

            // really overrelying on setTimeout here
            setTimeout(() => {
                if (can_load())
                    load(false);
            }, 1000);
        };
    }
})();
