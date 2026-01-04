// ==UserScript==
// @name        Hamster Kombat Desktop
// @namespace   https://violentmonkey.github.io
// @version     1.1.0
// @description Allow Hamster Kombat to run on Telegram Web and optionally open it in a new tab.
// @author      limbonux
// @match       https://web.telegram.org/*
// @license     GPLv3
// @grant       none
// @icon        https://hamsterkombat.io/images/icons/hamster-coin.png
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/500080/Hamster%20Kombat%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/500080/Hamster%20Kombat%20Desktop.meta.js
// ==/UserScript==

/**
 * @typedef {Object} FragmentObject
 * @property {string} tgWebAppData - The authentication data for the Telegram web app.
 * @property {("android"|"android_x"|"ios")} tgWebAppPlatform - The current platform of the Telegram web app.
 * @property {string} tgWebAppThemeParams - The theme parameters for the Telegram web app.
 * @property {string} tgWebAppVersion - The version of the Telegram web app.
 */

(() => {
    "use strict";

    /**
     * Parse the URL fragment into an object.
     * @param {string} fragment - The URL fragment.
     * @returns {FragmentObject} The parsed fragment object.
     */
    const parseFragment = (fragment) => Object.fromEntries(new URLSearchParams(fragment).entries());

    /**
     * Serialize the object into a URL fragment string.
     * @param {FragmentObject} obj - The object to serialize.
     * @returns {string} The serialized fragment string.
     */
    const serializeFragment = (obj) => new URLSearchParams(obj).toString();

    /**
     * Get the icon content from the icon code.
     * @param {string} icon - The icon code.
     * @returns {string} The icon content.
     */
    const getIconContent = (icon) => String.fromCharCode(Number.parseInt(icon, 16));

    /**
     * Handle adding the menu item for version A.
     * @param {URL} url - The URL to be opened in a new tab.
     */
    const addMenuItemVersionA = (url) => {
        const menu = document.querySelector(".modal-header .menu-container");
        if (!menu || menu.querySelector(".new-menu-item")) return;

        const menuItem = `
            <div class="MenuItem compact new-menu-item" role="menuitem" tabindex="0">
                <i class="icon icon-open-in-new-tab"></i>
                Open in New Tab
            </div>
        `;

        menu.insertAdjacentHTML("beforeend", menuItem);

        menu.lastElementChild.addEventListener("click", () => window.open(url.href, "_blank"));
    };

    /**
     * Handle adding the menu item for version K.
     * @param {URL} url - The URL to be opened in a new tab.
     */
    const addMenuItemVersionK = (url) => {
        const menuToggleButton = document.querySelector(".popup-header .btn-icon.rp.btn-menu-toggle");
        if (!menuToggleButton) return;

        // Add menu item on menu icon click because the dropdown is dynamically created.
        menuToggleButton.addEventListener("click", () => {
            const menu = document.querySelector(".popup-header .btn-menu");
            if (!menu || menu.querySelector(".new-menu-item")) return;

            const menuItem = `
                <div class="btn-menu-item rp-overflow new-menu-item">
                    <span class="tgico btn-menu-item-icon">${getIconContent("e9a3")}</span>
                    <span class="i18n btn-menu-item-text">Open in New Tab</span>
                </div>
            `;

            menu.insertAdjacentHTML("beforeend", menuItem);

            menu.lastElementChild.addEventListener("click", () => window.open(url.href, "_blank"));
        });
    };

    /**
     * Add a new menu item to open the iframe URL in a new tab.
     * @param {URL} url - The URL to open in a new tab.
     */
    const addOpenInNewTabMenuItem = (url) => {
        if (location.pathname.startsWith("/a/")) {
            addMenuItemVersionA(url);
        } else if (location.pathname.startsWith("/k/")) {
            addMenuItemVersionK(url);
        }
    };

    /**
     * Manipulate the iframe src to allow running the web app on Telegram Web.
     * @param {HTMLIFrameElement} iframe - The iframe element.
     */
    const handleIframe = (iframe) => {
        if (!iframe) return;

        const url = new URL(iframe.src);
        const fragmentObject = parseFragment(url.hash.substring(1));
        fragmentObject.tgWebAppPlatform = "android";
        delete fragmentObject.tgWebAppThemeParams; // Remove unnecessary parameter.

        url.hash = serializeFragment(fragmentObject);
        iframe.src = url.href;

        addOpenInNewTabMenuItem(url);
    };

    /**
     * Handle mutations and process the iframe for the web app popup.
     * @param {MutationRecord[]} mutations - List of mutations observed.
     */
    const mutationCallback = (mutations) => {
        for (const { addedNodes, target } of mutations) {
            if (addedNodes.length !== 1) continue;

            if (target.id === "portals" || addedNodes[0].classList.contains("popup-web-app")) {
                const iframe = target.querySelector("iframe");
                handleIframe(iframe);
            }
        }
    };

    // Set up MutationObserver to monitor for relevant changes.
    const observer = new MutationObserver(mutationCallback);
    const parentElement = document.getElementById("portals") || document.body; // Get the parent element for A or K.

    if (parentElement) {
        observer.observe(parentElement, { childList: true });
    }
})();
