// ==UserScript==
// @name         Discord Modifications
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customizable Discord :l
// @author       Unknown Hacker
// @license      CC BY-NC
// @match        https://discord.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/535998/Discord%20Modifications.user.js
// @updateURL https://update.greasyfork.org/scripts/535998/Discord%20Modifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultIconURL = "/assets/28f89b5f78dd6f80.webp";
    const defaultTitle = "Discorda!";

    let iconURL = GM_getValue("iconURL", defaultIconURL);
    let customTitle = GM_getValue("customTitle", defaultTitle);

    GM_registerMenuCommand("Set Icon URL", () => {
        const newIconURL = prompt("Enter new icon URL:", iconURL);
        if (newIconURL) {
            GM_setValue("iconURL", newIconURL);
            location.reload();
        }
    });

    GM_registerMenuCommand("Set Custom Title", () => {
        const newTitle = prompt("Enter new page title:", customTitle);
        if (newTitle) {
            GM_setValue("customTitle", newTitle);
            location.reload();
        }
    });

    const appIconHTML = `<img src="${iconURL}" width="48" alt="App Icon" draggable="false">`;

    function hasTextContent(element) {
        return element.textContent.trim().length > 0;
    }

    function insertIcon() {
        const elements = document.querySelectorAll('.childWrapper__6e9f8.childWrapperNoHoverBg__6e9f8');

        elements.forEach((element) => {
            if (!element.querySelector(`img[src="${iconURL}"]`) && !hasTextContent(element)) {
                element.insertAdjacentHTML('beforeend', appIconHTML);
            }
        });
    }

    function updateTitle() {
        if (document.title !== customTitle) {
            document.title = customTitle;
        }
    }

    insertIcon();
    updateTitle();

    const observer = new MutationObserver(() => {
        insertIcon();
        updateTitle();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
