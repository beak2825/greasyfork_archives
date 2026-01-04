// ==UserScript==
// @name         Farming Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  auto farming
// @author       You
// @match        https://farmrpg.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457865/Farming%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/457865/Farming%20Script.meta.js
// ==/UserScript==

setTimeout(function() {
    (function() {
        'use strict';

        let auto_button = document.createElement('input');
        auto_button.textContent = "Catch Fish";
        auto_button.id = "catch_fish";
        auto_button.type = "checkbox";
        document.getElementsByClassName("navbar-inner")[0].appendChild(auto_button);

        setInterval(function() {
            let plot = document.getElementsByClassName("cropitem itemimg i11")[0]
            console.log(plot.style.opacity)
            if (plot.style.opacity === "1" && auto_button.checked) {
                console.log("running")
                document.getElementsByClassName("harvestallbtn")[0].click()
                setTimeout(() => {
                    document.getElementsByClassName("plantallbtn")[0].click()
                }, Math.floor(Math.random() * 1000) + 500);
            }
        }, 1000);


    })();
}, 1000);