// ==UserScript==
// @name         RPG Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://farmrpg.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457680/RPG%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/457680/RPG%20Script.meta.js
// ==/UserScript==

function reObserve() {
    const Observe = (sel, opt, cb) => {
        const Obs = new MutationObserver((m) => [...m].forEach(cb));
        document.querySelectorAll(sel).forEach(el => Obs.observe(el, opt));
    };

    Observe("#consoletxt", {
        characterData: true,
        childList: true,
    }, (m) => {
        let found = false
        let images = document.querySelectorAll("img");
        for (let image of images) {
            if (image.style.border === "1px solid gray") {
                image.style.border = "1px solid red";
                image.style.filter = "";
                found = true;
            }
        }
        if (found) {
            alert("An item is full");
        }
    });
}

setTimeout(function() {
    (function() {
        'use strict';

        var currentPath = window.location.pathname;
        setInterval(() => {
            if(window.location.href !== currentPath) {
                currentPath = window.location.href;
                reObserve();
            }
        }, 500);

    })();
}, 1000);