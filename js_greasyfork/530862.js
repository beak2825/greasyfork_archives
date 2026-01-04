// ==UserScript==
// @name         Discord Wrapper Modifier
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Modifies the .wrapper_cc5dd2 class only inside selected list items in Discord
// @author       You
// @match        https://discord.com/*
// @grant        none
// @license      MIT / Broadband. Not allowed for commercial use or for sharing / taking claim of product. We are legally allowed to sue on section 44.9 of the international Copyright act of 1994.
// @downloadURL https://update.greasyfork.org/scripts/530862/Discord%20Wrapper%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/530862/Discord%20Wrapper%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyWrapper() {
        let listItems = document.querySelectorAll('.listItemWrapper__91816.selected__91816');
        listItems.forEach(listItem => {
            let wrapper = listItem.querySelector('.wrapper_cc5dd2');
            if (wrapper) {
                console.log("Modifying wrapper:", wrapper);

                // Set opacity of all children to 0
                wrapper.querySelectorAll('*').forEach(child => {
                    child.style.opacity = "0";
                });

                // Add background image
                wrapper.style.backgroundImage = "url(https://i.imgur.com/FTckCa9.png)";
                wrapper.style.zIndex = "9999";
                wrapper.style.borderRadius = "10px";
                wrapper.style.backgroundSize = "contain";
                wrapper.style.backgroundRepeat = "no-repeat";
                wrapper.style.backgroundPosition = "center";
            }
        });
    }

    // Wait for elements to exist
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(selector)) {
                obs.disconnect();
                callback();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement('.listItemWrapper__91816.selected__91816', modifyWrapper);

    // Observe changes in Discord UI
    const observer = new MutationObserver(() => modifyWrapper());
    observer.observe(document.body, { childList: true, subtree: true });

})();
