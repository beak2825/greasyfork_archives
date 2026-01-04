// ==UserScript==
// @name         Speedboats.io Skin Switcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A in-game skin switcher for speedboats.io!
// @author       DamienVesper
// @match        *://speedboats.io/*
// @match        *://*.speedboats.io/*
// @grant        GM_xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/383353/Speedboatsio%20Skin%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/383353/Speedboatsio%20Skin%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    LEGAL
     - All code licensed under the Apache 2.0 License. Code copyright 2019 by DamienVesper. All rights reserved.
     - All code reproductions must include the below insigna.
     - Any reproductions of this and other related works that are found to be in violence of this code will be reported and removed.
                         ____                                            _
     |\   \      /      |    |                                          |_|
     | \   \    /       |____|  __   __   __   __   __    __ __   __ __      __   __
     | /    \  /        |      |  | |  | |  | |  | |  |  |  |  | |  |  | |  |  | |  |
     |/      \/         |      |    |__| |__| |    |__|_ |  |  | |  |  | |  |  | |__|
                                            |                                       |
                                          __|                                     __|
    */

    function runtimeScript() {
        var skinButtons;
        setInterval(function(){skinButtons = document.querySelectorAll(`select > option`);});

        function keyController(e) {
            var skinChooserUI = document.querySelector(`#skinChooserUI > select`);
            var changeEvent = new Event(`change`);
            switch(e.keyCode) {
                case 49:
                    skinButtons[0].selected = true;
                    skinButtons[0].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 50:
                    skinButtons[1].selected = true;
                    skinButtons[1].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 51:
                    skinButtons[2].selected = true;
                    skinButtons[2].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 52:
                    skinButtons[3].selected = true;
                    skinButtons[3].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 53:
                    skinButtons[4].selected = true;
                    skinButtons[4].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 54:
                    skinButtons[5].selected = true;
                    skinButtons[5].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 55:
                    skinButtons[6].selected = true;
                    skinButtons[6].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 56:
                    skinButtons[7].selected = true;
                    skinButtons[7].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 57:
                    skinButtons[8].selected = true;
                    skinButtons[8].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 48:
                    skinButtons[9].selected = true;
                    skinButtons[9].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 79:
                    skinButtons[10].selected = true;
                    skinButtons[10].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                case 80:
                    skinButtons[11].selected = true;
                    skinButtons[11].click();
                    skinChooserUI.dispatchEvent(changeEvent);
                    break;
                default:
                    return;
            }
        }

        document.addEventListener(`keydown`, function(e){keyController(e)});
    }
    setTimeout(runtimeScript, 500);
})();