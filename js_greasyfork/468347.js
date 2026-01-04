// ==UserScript==
// @name         Change to Brisbane Timezone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  to change timezone to brisbane for forex market hours
// @author       You
// @match        https://www.babypips.com/tools/forex-market-hours
// @icon         https://www.google.com/s2/favicons?sz=64&domain=babypips.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468347/Change%20to%20Brisbane%20Timezone.user.js
// @updateURL https://update.greasyfork.org/scripts/468347/Change%20to%20Brisbane%20Timezone.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        console.log("Script Running")
        const header = document.querySelector("body > div.site-content > div.layout.layout-two-column-wide > div > section.calculator > div > section > div > header > h2").innerHTML = 'WORKING'
        const btn = document.querySelector("body > div.site-content > div.layout.layout-two-column-wide > div > section.calculator > div > section > div > div > div > div.Timezone-module__container___BAO2a.index-module__timezone___HaMSH > div > button").click()
        setTimeout(() => {
            const brisbane = document.querySelector("#SelectPicker1-opt-28 > div").click()
        },200)
        try {
            const closeBtn = document.querySelector("body > div.contribute-overlay.b > section > header > button").click()
        } catch(e) {
            console.log("No Donate button to click so not clicking button")
        }
    },1000)
})();