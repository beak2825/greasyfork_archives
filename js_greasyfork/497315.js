// ==UserScript==
// @name         Keep my money safe
// @namespace    Ziticca Script Library
// @version      1.0
// @description  Adds quick action buttons for bazaar closing and money depositing
// @author       Ziticca
// @license      MIT
// @match        https://www.torn.com/*
// @icon         https://www.torn.com/images/v2/loadouts/all_loadouts_default.svg
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497315/Keep%20my%20money%20safe.user.js
// @updateURL https://update.greasyfork.org/scripts/497315/Keep%20my%20money%20safe.meta.js
// ==/UserScript==

/* jshint esversion:9 */

(function () {
    'use strict';

    const styles = `
        .money-safe-span, .money-safe-button {
            display: flex;
        }
        .money-safe-button-warning {
            color: red;
        }
`;
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    if (isTampermonkeyEnabled) {
        GM_addStyle(styles);
    }
    let closeBazaarButton = false;
    const createCloseBazaarButton = function() {
        const closeLink = document.querySelector("a[class*='BazaarClosed']");
        if (closeLink) {
            const dropdown = document.querySelector("div[class^='dropdown']>button");
            console.log(dropdown);
            const link = document.createElement("div");
            link.className = "torn-btn money-safe-button";
            const buttonText = document.createElement("span");
            buttonText.className = "money-safe-span money-safe-button-warning";
            buttonText.textContent = "SET BAZAAR STATUS TO"
            link.appendChild(buttonText)
            link.appendChild(closeLink)
            const mainWrapper = document.querySelector(".content-wrapper");
            mainWrapper.prepend(link);
            closeBazaarButton = true;
        }
    }

    const createHelperButtons = function(mutations, observer) {
        mutations.forEach(function (mutation) {
            for (const node of mutation.addedNodes) {
                if (node.querySelector) {
                    if (!closeBazaarButton) {
                        createCloseBazaarButton();
                    }
                }
            }
        });
    }

    const createGoToBazaarButton = function() {
        console.log(window.location.href.indexOf("https://www.torn.com/bazaar.php"));
        if (window.location.href.indexOf("https://www.torn.com/bazaar.php") !== -1) {
            //createCloseBazaarButton();
            const mainWrapper = document.querySelector("#bazaarRoot");
            console.log(mainWrapper);
            const observer = new MutationObserver(createHelperButtons)
            observer.observe(mainWrapper, { attributes: true, childList: true, characterData: false, subtree: true });
        } else {
            const link = document.createElement("button");
            link.className = "torn-btn";
            link.innerHTML = '<a href="https://www.torn.com/bazaar.php">Bazaar</a>';
            const mainWrapper = document.querySelector(".content-wrapper");
            mainWrapper.prepend(link);
        }
        const vault = document.createElement("button");
        vault.className = "torn-btn";
        vault.innerHTML = '<a href="https://www.torn.com/properties.php#/p=options&tab=vault">VAULT</a>';
        const mainWrapper = document.querySelector(".content-wrapper");
        mainWrapper.prepend(vault);
    }

    createGoToBazaarButton();
})();