// ==UserScript==
// @name         netflix x2 and x4 speed button
// @namespace    http://tampermonkey.net/
// @version      2024-06-26.1
// @description  add a x2 and a x4 button to netflix playback speed panel
// @author       vincent bruneau
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498914/netflix%20x2%20and%20x4%20speed%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/498914/netflix%20x2%20and%20x4%20speed%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var buttonN = document.createElement("button");
    buttonN.innerHTML = "x2";
    buttonN.setAttribute("onClick","document.querySelector('video').playbackRate = 2");

    var buttonNN = document.createElement("button");
    buttonNN.innerHTML = "x4";
    buttonNN.setAttribute("onClick","document.querySelector('video').playbackRate = 4");

    buttonN.style.cssText = "color: #000 !important";
    buttonNN.style.cssText = "color: #000 !important";

    let netspeedwindow = document.querySelector("[data-uia='playback-speed']");
    if(netspeedwindow !== "undefined" && netspeedwindow !== null) {
                netspeedwindow.appendChild(buttonN);
                netspeedwindow.appendChild(buttonNN);
            }

var mo = new MutationObserver((mo)=>{

    var netspeedwindow = document.querySelector("[data-uia='playback-speed']");

            if(netspeedwindow !== "undefined" && netspeedwindow !== null) {
                netspeedwindow.appendChild(buttonN);
                netspeedwindow.appendChild(buttonNN);
            }

    });

            mo.observe(document, {
                attributeOldValue: true,
                subtree: true,
            });
})();