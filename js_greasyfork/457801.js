// ==UserScript==
// @name         Fishing Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  auto fishing
// @author       You
// @match        https://farmrpg.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457801/Fishing%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/457801/Fishing%20Script.meta.js
// ==/UserScript==

function reObserve(auto_button) {
    const Observe = (sel, opt, cb) => {
        const Obs = new MutationObserver((m) => [...m].forEach(cb));
        document.querySelectorAll(sel).forEach(el => Obs.observe(el, opt));
    };

    let last_found = "";
    function catchFish() {
        document.getElementsByClassName("catch")[0].click();
        setTimeout(() => {
            let catch_button = document.getElementsByClassName("fishcaught")[0];
            catch_button.click();
        }, Math.floor(Math.random() * 500) + 500);
    }

    Observe(".fish", {
        attributesList: ["style"],
        attributeOldValue: true,
    }, (m) => {
        if (!auto_button.checked) {
            return false;
        }
        let current_fish = m.target.classList
        if (current_fish.length > 2 && current_fish !== last_found) {
            last_found = current_fish;
            setTimeout(() => {
                catchFish()
            }, Math.floor(Math.random() * 100) + 500);
        }
    });
}

setTimeout(function() {
    (function() {
        'use strict';

        let auto_button = document.createElement('input');
        auto_button.textContent = "Catch Fish";
        auto_button.id = "catch_fish";
        auto_button.type = "checkbox";
        document.getElementsByClassName("navbar-inner navbar-on-center")[0].appendChild(auto_button);

        reObserve(auto_button)

    })();
}, 1000);