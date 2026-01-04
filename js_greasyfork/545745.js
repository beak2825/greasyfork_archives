// ==UserScript==
// @name         BetterDiscord Web Injector (it doesnt work stop downloading it)
// @namespace    youtube.com
// @version      1.0
// @description  Inject BetterDiscord scripts into Discord web client
// @author       YourName
// @match        https://discord.com/*
// @match        https://canary.discord.com/*
// @match        https://ptb.discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545745/BetterDiscord%20Web%20Injector%20%28it%20doesnt%20work%20stop%20downloading%20it%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545745/BetterDiscord%20Web%20Injector%20%28it%20doesnt%20work%20stop%20downloading%20it%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of your hosted BetterDiscord web build bundle or script
    const betterDiscordScriptUrl = "https://yourcdn.com/path/to/betterdiscord.bundle.js";

    // Wait for Discord app container to load
    function waitForApp() {
        if (document.querySelector("#app-mount")) {
            injectBetterDiscord();
        } else {
            setTimeout(waitForApp, 500);
        }
    }

    // Inject script tag to load BetterDiscord
    function injectBetterDiscord() {
        if (document.getElementById("betterdiscord-inject")) return; // prevent double inject

        const script = document.createElement("script");
        script.id = "betterdiscord-inject";
        script.src = betterDiscordScriptUrl;
        script.type = "text/javascript";
        script.async = false;
        script.onload = () => console.log("BetterDiscord injected!");
        script.onerror = () => console.error("Failed to load BetterDiscord script.");

        document.head.appendChild(script);
    }

    waitForApp();
})();
