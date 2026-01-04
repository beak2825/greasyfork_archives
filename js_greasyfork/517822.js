// ==UserScript==
// @name         Add FB Download Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a download button to dynamically change the URL to mbasic and open it in a new tab.
// @author       You
// @match        *://*.facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517822/Add%20FB%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/517822/Add%20FB%20Download%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to create and append the button
    function addDownloadButton() {
        const buttonId = "customDownloadButton";
        const buttonClasses = "x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1xmf6yo x1e56ztr xzboxd6 x14l7nz5";
        const targetSelectors = [
            ".xygnafs > div:nth-child(1) > div:nth-child(1)", // Original target element
            ".xtp0wl1 > div:nth-child(2) > div:nth-child(2)" // New target element for video links
        ];

        targetSelectors.forEach((selector) => {
            const targetElement = document.querySelector(selector);

            if (targetElement && !targetElement.querySelector(`#${buttonId}`)) {
                // Create a button
                const button = document.createElement("button");
                button.id = buttonId;
                button.style.display = "flex";
                button.style.alignItems = "center";
                button.style.justifyContent = "center";
                button.style.border = "none";
                button.style.padding = "5px 5px";
                button.style.borderRadius = "100%";
                button.style.backgroundColor = "#663DA2";
                button.style.cursor = "pointer";
                button.style.position = "relative";
                button.style.marginLeft = "10px";
                button.style.width = "40px";
                button.style.height = "40px";

                // Add an SVG icon inside the button
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#fff" viewBox="0 0 24 24">
                        <path d="M5 20v-2h14v2H5Zm7-3-5-5 1.4-1.4 2.6 2.575V4h2v9.175L15.6 10.6 17 12l-5 5Z"/>
                    </svg>
                `;

                // Add click event to the button
                button.addEventListener("click", () => {
                    const currentUrl = window.location.href;
                    const modifiedUrl = currentUrl.replace("www.", "mbasic.");
                    window.open(modifiedUrl, "_blank");
                });

                // Create a wrapper div for button with the desired classes
                const div = document.createElement("div");
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.classList.add(...buttonClasses.split(" "));

                div.appendChild(button);
                targetElement.appendChild(div);
            }
        });
    }

    // Observe for changes in the DOM
    const observer = new MutationObserver(() => {
        addDownloadButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Try to add the button immediately if the elements already exist
    addDownloadButton();
})();
