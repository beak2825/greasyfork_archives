// ==UserScript==
// @name         Discord.com = Home
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      CC BY-NC
// @description  Redirects Discord homepage to a user-defined page or default URL
// @author       Unknown Hacker
// @match        https://discord.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/524571/Discordcom%20%3D%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/524571/Discordcom%20%3D%20Home.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultRedirectUrl = "https://discord.com/channels/@me";

    const redirectUrl = GM_getValue("redirectUrl", defaultRedirectUrl);

    if (window.location.href === "https://discord.com/") {
        window.location.replace(redirectUrl);
    }

    GM_registerMenuCommand("Set Redirect URL", () => {
        const newUrl = prompt("Enter the new redirect URL:", redirectUrl);
        if (newUrl) {
            GM_setValue("redirectUrl", newUrl);
            alert(`Redirect URL has been set to: ${newUrl}`);
        }
    });

    GM_registerMenuCommand("Reset Redirect URL to Default", () => {
        GM_setValue("redirectUrl", defaultRedirectUrl);
        alert(`Redirect URL has been reset to the default: ${defaultRedirectUrl}`);
    });
})();
