// ==UserScript==
// @name         Twitch Clip Quality
// @version      1.5
// @description  Automatically change twitch clip quality on embedded and native
// @author       ArsenicBismuth
// @match        https://clips.twitch.tv/*
// @grant        none
// @namespace    https://www.github.com/ArsenicBismuth
// @license BSD
// @downloadURL https://update.greasyfork.org/scripts/502397/Twitch%20Clip%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/502397/Twitch%20Clip%20Quality.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const quality = "480p" // The desired quality

    // Function to observe DOM changes
    function waitForElement(selector, modifyFn) {
        const observer = new MutationObserver((mutations, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                modifyFn(element)
                observer.disconnect() // Stop observing once the element is found
            }
        });

        observer.observe(document.body, { childList: true, subtree: true })
    }

    // Wait for targets to appear (multiple waitForElement are in parallel)
    let gear = null
    waitForElement("[data-a-target='player-settings-button']", (element) => {
        // Click gear
        element.click()
        gear = element
    })

    waitForElement("[data-a-target='player-settings-menu-item-quality']", (element) => {
        // Click quality
        element.click()
    })

    waitForElement("[name='player-settings-submenu-quality-option']", (element) => {
        // Find and choose quality
        const aTags = document.getElementsByTagName("label")
        let found = aTags[0]

        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == quality) {
                found = aTags[i]
                break
            }
        }
        found.click()
        gear.click() // Close the menu after
    })

})();