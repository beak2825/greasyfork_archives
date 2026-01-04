// ==UserScript==
// @name         Copy Plex token
// @namespace    http://tampermonkey.net/
// @version      2024-05-12
// @description  Adds a button with which you can copy your plex access token to your clipboard
// @license MIT
// @author       Bastian Ganze
// @match        https://app.plex.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plex.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494694/Copy%20Plex%20token.user.js
// @updateURL https://update.greasyfork.org/scripts/494694/Copy%20Plex%20token.meta.js
// ==/UserScript==

(function() {
    'use strict';
        function createCopyButton() {
        // Get the user actions list
        const userActions = document.querySelector('[class*="NavBar-container"] > div:nth-child(2)');
            console.log(userActions);
        if (!userActions) {
            setTimeout(createCopyButton, 200);
            return;
        }

        if (userActions) {
            // Create the download button
            var downloadButton = document.createElement('a');
            downloadButton.textContent = 'Copy Access Token';
            downloadButton.style.cursor = 'pointer';
             downloadButton.style.marginRight = "16px";
            downloadButton.style.borderRadius = "4px";
            downloadButton.style.backgroundColor = "rgb(229, 160, 13)";
            downloadButton.style.minHeight = "28px";
            downloadButton.style.color = "rgb(28, 28, 28)";
            downloadButton.style.lineHeight = "0";
            downloadButton.style.display = "flex";
            downloadButton.style.alignItems = "center";
            downloadButton.style.fontWeight = "600";
            downloadButton.style.padding = "0 12px";

            // Add click event listener to the download button
            downloadButton.addEventListener('click', function() {
                const copyText = localStorage.getItem("myPlexAccessToken");
                if (!copyText) {
                    console.error("Could not find any token, wtf!?");
                }
                navigator.clipboard.writeText(copyText).then(() => {
                    alert(`${copyText} copied to clipboard`);
                },(err) => {
                    console.error('Failed to copy Plex ID to clipboard copy');
                    console.error(err);
                });
            });


            // Append the list item to the user actions list
            userActions.prepend(downloadButton);
        }
    }

    window.addEventListener('load', function() {
          console.log("wat");
        createCopyButton();
    });
})();