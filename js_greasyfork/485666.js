// ==UserScript==
// @name         Mark Found
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  Right click to mark items on Genshin Interactive Map as found.
// @author       Steven Culwell
// @match        https://act.hoyolab.com/ys/app/interactive-map/index.html*
// @icon         https://act.hoyolab.com/ys/app/interactive-map/mapicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485666/Mark%20Found.user.js
// @updateURL https://update.greasyfork.org/scripts/485666/Mark%20Found.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $ = (s) => {return document.querySelector(s)}
    function waitForElm(selector) {
        return new Promise(resolve => {
            if ($(selector)) {
                return resolve($(selector));
            }

            const observer = new MutationObserver(mutations => {
                if ($(selector)) {
                    observer.disconnect();
                    resolve($(selector));
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    waitForElm("canvas.leaflet-canvas-icon-layer").then((elm) => {
        elm.addEventListener("contextmenu", function(e) {
            elm.dispatchEvent(
                new MouseEvent(
                    "click", // or "mousedown" if the canvas listens for such an event
                    {
                        clientX: e.clientX,
                        clientY: e.clientY,
                        bubbles: true
                    }
                )
            );
            $(".map-popup__switch").click();
            $(".leaflet-popup-close-button").click()
            // setTimeout(() => {$(".leaflet-popup-close-button").click()}, 500)
        })
    })
})();