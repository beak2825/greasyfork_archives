// ==UserScript==
// @name         f-puzzles extra shorcuts
// @namespace    crul-scripts
// @version      0.1
// @description  Adds 3 NumKeyPad shortcuts for f-puzzles.com
// @author       Crul
// @match        https://www.f-puzzles.com/*
// @match        http://f-puzzles.com/*
// @match        https://f-puzzles.com/*
// @match        http://www.f-puzzles.com/*
// @icon         https://icons.duckduckgo.com/ip2/f-puzzles.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428270/f-puzzles%20extra%20shorcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/428270/f-puzzles%20extra%20shorcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (changeLog.indexOf("Version 1.11.2") != 16)
        alert("Version has changed");

    document.addEventListener('keydown', function (ev) {

        if (ev.code == "NumpadMultiply") {
            undo();
            return;
        }

        var nextMode;
        if (ev.code == "NumpadEnter") {
            switch (enterMode) {
                case "Normal":
                    nextMode = "Corner";
                    break;
                case "Corner":
                    nextMode = "Center";
                    break;
                case "Center":
                    nextMode = "Highlight";
                    break;
                case "Highlight":
                    nextMode = "Normal";
                    break;
                default:
                    nextMode = "Normal";
            }
        }

        if (ev.code == "NumpadAdd") {
            switch (enterMode) {
                case "Normal":
                    nextMode = "Highlight";
                    break;
                case "Corner":
                    nextMode = "Normal";
                    break;
                case "Center":
                    nextMode = "Corner";
                    break;
                case "Highlight":
                    nextMode = "Center";
                    break;
                default:
                    nextMode = "Normal";
            }
        }

        if (nextMode) {
            setEnterMode(nextMode);
			createSidebars();
            onInputEnd();
        }
    });

})();