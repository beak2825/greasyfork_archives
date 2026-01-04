// ==UserScript==
// @name         Egg Cave Arrow Number Navigator
// @namespace    http://tampermonkey.net/
// @version      2024-10-30
// @description  yippee no more carpal tunnel
// @author       Lakinom
// @match        https://dragcave.net/locations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dragcave.net
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/530898/Egg%20Cave%20Arrow%20Number%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/530898/Egg%20Cave%20Arrow%20Number%20Navigator.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let is_not_event = (document.querySelector("a[href='/locations/7-event']") === null);
    //console.log(is_not_event);
    let habitats = ["5-alpine", "1-coast", "2-desert", "3-forest", "4-jungle", "6-volcano", "7-event"];
    let hab_last = 6;
    if(is_not_event) hab_last--;
    let cur_url = window.location.href;
    let cur_hab = cur_url.slice(31); //remove https://dragcave.net/locations/ so we can compare to habitats array
    let hab_i = habitats.findIndex(hab => hab === cur_hab);
    //console.log(hab_i);

    const controller = new AbortController();

    window.addEventListener(
        "keydown",
        (event) => {
            if (event.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }

            switch (event.key) {
                case "1":
                    window.location.href = "https://dragcave.net/locations/5-alpine";
                    break;
                case "2":
                    window.location.href = "https://dragcave.net/locations/1-coast";
                    break;
                case "3":
                    window.location.href = "https://dragcave.net/locations/2-desert";
                    break;
                case "4":
                    window.location.href = "https://dragcave.net/locations/3-forest";
                    break;
                case "5":
                    window.location.href = "https://dragcave.net/locations/4-jungle";
                    break;
                case "6":
                    window.location.href = "https://dragcave.net/locations/6-volcano";
                    break;
                case "7":
                    if (!is_not_event) window.location.href = "https://dragcave.net/locations/7-event";
                    break;
                case "ArrowLeft":
                    if(hab_i>0)
                    {
                        controller.abort();
                        window.location.href = "https://dragcave.net/locations/"+habitats[hab_i-1];
                    }
                    break;
                case "ArrowRight":
                    if(hab_i<hab_last)
                    {
                        controller.abort();
                        window.location.href = "https://dragcave.net/locations/"+habitats[hab_i+1];
                    }
                    break;
                default:
                    return; // Quit when this doesn't handle the key event.
            }

            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
        },
        true,
    );


})();