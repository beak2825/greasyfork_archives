// ==UserScript==
// @name         facebook - Blur Contacts and Chat Pop-ups
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Facebook - Blur contacts and Kill chat pop-ups using MutationObserver
// @author       Ru
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495656/facebook%20-%20Blur%20Contacts%20and%20Chat%20Pop-ups.user.js
// @updateURL https://update.greasyfork.org/scripts/495656/facebook%20-%20Blur%20Contacts%20and%20Chat%20Pop-ups.meta.js
// ==/UserScript==
// ==/UserScript==

function cleanTitle() {
    const regex = /^\(.*\) /;
    if (document.title.match(regex) != null) {
        document.title = document.title.replace(regex, '');
    }
}

(function() {
    'use strict';

    function blurContactsAndChats() {
        const contactList = document.querySelector(".xwib8y2 ul");
        const chatPopups = document.querySelectorAll('div[data-visualcompletion="ignore"]');

        var checkbox = document.getElementById("blurCheckbox");

        if (!checkbox) {
            const flexContainer = document.createElement("div");
            flexContainer.style.display = "flex";
            flexContainer.style.alignItems = "center";
            flexContainer.style.margin = "15px";

            checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "blurCheckbox";
            checkbox.checked = false;

            function toggleBlur() {
                if (checkbox.checked) {
                    if (contactList) contactList.style.filter = "blur(7px)";
                    chatPopups.forEach(chat => {
                        chat.style.filter = "blur(7px)";
                    });
                } else {
                    if (contactList) contactList.style.filter = "";
                    chatPopups.forEach(chat => {
                        chat.style.filter = "";
                    });
                }
            }

            checkbox.addEventListener("change", toggleBlur);

            const label = document.createElement("label");
            label.textContent = "Blur Contacts and Chats";
            label.htmlFor = "blurCheckbox";
            label.style.marginLeft = "5px";

            flexContainer.appendChild(checkbox);
            flexContainer.appendChild(label);

            if (contactList) contactList.parentElement.prepend(flexContainer);

            toggleBlur();
        }
    }

    function observeMutations() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "childList") {
                    blurContactsAndChats();
                }
            });
        });

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(document, config);
    }

    window.addEventListener("load", observeMutations);
})();
