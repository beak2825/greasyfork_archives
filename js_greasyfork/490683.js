// ==UserScript==
// @name         RoQuotes
// @namespace    http://tampermonkey.net/
// @version      2024-03-23
// @description  Bring back roblox quotes to profiles! Put in your roblox about q"Text you want" to add quotes to your profile. (Only shows if you have the userscript)
// @author       lxvdev
// @license      MIT
// @match        https://www.roblox.com/users/*/profile*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @downloadURL https://update.greasyfork.org/scripts/490683/RoQuotes.user.js
// @updateURL https://update.greasyfork.org/scripts/490683/RoQuotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    var ChangeNameLayout=true
    var NameInParentheses=false
    var HideUsernameIfSameAsDisplayName=false // Not stable, wouldn't recommend using it.
    var DisableQuotes=false // Why would you disable this, right?
    // End of settings

    function injectCSS(css) {
        var styleElement = document.createElement('style');
        styleElement.innerHTML = css;

        document.head.appendChild(styleElement);
    }

    // Thanks Kris Lachance
    // https://www.basedash.com/blog/waiting-for-an-element-to-exist-with-javascript
    function onElementAvailable(selector, callback) {
        const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
            observer.disconnect();
            callback();
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    var NameLayout = `
        .header-names {
            display: flex;
            align-items: end;
        }
        .profile-display-name {
            margin-bottom: 8px;
        }
        .profile-display-name {
            font-size: 16px !important;
        }
        .profile-name-button {
            padding: 0px !important;
        }

        .tooltip-container {
            margin-right: 8px;
            order: 1;
        }
    `;

    if (ChangeNameLayout) {
        injectCSS(NameLayout);
    }

    if (NameInParentheses) {
        onElementAvailable(".profile-display-name", () => {
            var name = document.querySelector('.profile-display-name');
            name.textContent = "(" + name.textContent + ")";
            name.classList.remove("font-caption-body")
        });
    }

    if (HideUsernameIfSameAsDisplayName) {
        onElementAvailable(".profile-display-name", () => {
            var name = document.querySelector('.profile-display-name');
            var displayname = document.querySelector('.profile-name');

            if (name.textContent.substring(1) === displayname.textContent) {
                name.style.display = 'none';
            }
        });
    }

    if (!DisableQuotes) {
        // Quote handle
        onElementAvailable(".header-names", () => {
            // Create quote div
            var quotesDiv = document.createElement('div');
            quotesDiv.className = "header-quote text";

            // Insert quote div
            var namesDiv = document.querySelector(".header-names");
            namesDiv.insertAdjacentElement("afterend", quotesDiv);

            // Set quote content
            onElementAvailable(".profile-about-content-text", () => {
                var profileDesc = document.querySelector('.profile-about-content-text');

                var regex = /\n*q"([^"]*)"/;

                var match = profileDesc.textContent.match(regex);

                if (match && match.length > 1) {
                    var extractedText = match[1];
                    quotesDiv.textContent = '"' + extractedText + '"';
                    profileDesc.textContent = profileDesc.textContent.replace(regex, '');
                } else {
                    //do smth
                }
            });
        })
    }
})(); // Welcome to the end of the script! What brings you here?
