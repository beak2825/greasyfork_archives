// ==UserScript==
// @name         hypermood.space : Auto Claim (SCAM)
// @namespace    hypermood.space.auto.claim
// @version      1.4
// @description  https://ouo.io/2GYp0d
// @author       stealtosvra
// @match        https://hypermood.space/*
// @match        https://hypermood.fun/*
// @match        https://bh.hypermood.space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hypermood.space
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463057/hypermoodspace%20%3A%20Auto%20Claim%20%28SCAM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463057/hypermoodspace%20%3A%20Auto%20Claim%20%28SCAM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        const element = document.querySelector('.hole');
        if (element) {
            element.click();
            console.log("Clicked on Black Hole");

            setInterval(function() {
                const button = document.querySelector('button.button.relative.inline-block.primary.lg');
                if (button) {
                    button.click();
                } else {
                    console.error("Button not found");
                }

                const cursor = document.querySelector('.w-12.shrink-0.circle.animate-bounce.cursor-pointer');
                if (cursor) {
                    cursor.click();
                } else {
                    console.error("Element not found");
                }
            }, 5000);}
    }, 10000);

})();
