// ==UserScript==
// @name         Old YouTube Studio Restorer (Pre-Jun 2024)
// @namespace    https://greasyfork.org/users/yourname
// @version      1.0
// @description  Restores the old YouTube Studio button styles and layout (pre-June 2024)
// @author       YourName
// @match        https://studio.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/6d82a3a2/img/favicon_32x32.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534716/Old%20YouTube%20Studio%20Restorer%20%28Pre-Jun%202024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534716/Old%20YouTube%20Studio%20Restorer%20%28Pre-Jun%202024%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customStyles = document.createElement("style");
    customStyles.textContent = `
        ytcp-button[type="outline-filled"] {
            padding-left: 16px;
            padding-right: 16px;
        }

        ytcp-header:not([modern]) #create-icon.ytcp-header {
            color: var(--ytcp-text-primary-inverse);
        }

        #create-icon paper-ripple.ytcp-button {
            color: var(--ytcp-call-to-action-raised-ripple);
        }
    `;
    customStyles.classList.add("custom-yt-studio-styles");
    customStyles.type = "text/css";
    document.querySelector("html").appendChild(customStyles);

    const ytStudioInterval = setInterval(() => {
        document.querySelectorAll("[modern]").forEach(el => {
            el.removeAttribute("modern");
        });
    }, 100);
})();