// ==UserScript==
// @name         RPS High Quality Images
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces low quality and low resolution images with their original
// @author       BlankedyBlank
// @license      GNU GPLv3
// @match        https://www.rockpapershotgun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394601/RPS%20High%20Quality%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/394601/RPS%20High%20Quality%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let images = document.getElementsByTagName("img");

    //Replaces normal article images, and most on site
    for (let i of images) {
        if (i.src.includes("/BROK/")) {
            i.removeAttribute("srcset")
            i.src = i.src.replace(/\/BROK\/.*$/, "")
        }
    }
}
)();