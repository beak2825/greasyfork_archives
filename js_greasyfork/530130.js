// ==UserScript==
// @name         Replace Kick Embed with Channel Page and Enable Theatre Mode
// @namespace    kick.com
// @version      1.8.2
// @description  Replaces Kick embed with a full channel page and enables theatre mode on Kick.com only when loaded as an embed replacement
// @author       Ignelious
// @match        *://player.kick.cx/*
// @match        *://kick.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/530130/Replace%20Kick%20Embed%20with%20Channel%20Page%20and%20Enable%20Theatre%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530130/Replace%20Kick%20Embed%20with%20Channel%20Page%20and%20Enable%20Theatre%20Mode.meta.js
// ==/UserScript==

let chatButtonVisible = GM_getValue('kickChatButtonVisible', false);
GM_registerMenuCommand('Toggle chat button visibility', () => {
    chatButtonVisible = !chatButtonVisible;
    GM_setValue('kickChatButtonVisible', chatButtonVisible);

    alert('Refresh for changes to take effect.');
});

let liveInformationVisible = GM_getValue('kickLiveInformationVisible', false);
GM_registerMenuCommand('Toggle live information visibility', () => {
    liveInformationVisible = !liveInformationVisible;
    GM_setValue('kickLiveInformationVisible', liveInformationVisible);

    alert('Refresh for changes to take effect.');
});

if (window.location.host.includes("player.kick.cx")) {
    // Code for the embed page: Replace the Kick player with a full channel page
    const observer = new MutationObserver(() => {
        const playerContainer = document.querySelector(".video-container");
        if (playerContainer) {
            // Extract channel information from the URL
            const channelUrl = window.location.href;
            console.log("Channel URL:", channelUrl);
            const splitURL = channelUrl.split("/");
            const channelId = splitURL[splitURL.length - 1]; // Assumes URL is like: https://player.kick.cx/{channelId}
            console.log("Channel ID:", channelId);

            // Create an iframe for the full Kick channel page
            const iframe = document.createElement("iframe");
            iframe.src = `https://kick.com/${channelId}`;
            iframe.style.width = "100%";
            iframe.style.height = "100vh"; // Full viewport height
            iframe.style.border = "none";

            // Replace the embed with the full channel page
            playerContainer.innerHTML = "";
            playerContainer.appendChild(iframe);

            if (!liveInformationVisible) {
                GM_addStyle(`
                .live-informations {
                  display: none !important;
                }
              `);
            }

            // Stop observing and mark that we replaced the embed
            observer.disconnect();
            GM_setValue("embedReplaced", true);
        }
    });
    observer.observe(document.body, {
        subtree: true,
        childList: true,
    });
} else if (window.location.host.includes("kick.com")) {
    // Code for kick.com: Only run if the embed was replaced and the referrer indicates it came from player.kick.cx
    const embedReplacedValue = GM_getValue("embedReplaced", false);
    if (embedReplacedValue && document.referrer.includes("player.kick.cx")) {
        console.log("Embed replacement detected via referrer. Enabling theatre mode...");
        const observer2 = new MutationObserver(() => {
            const el = document.querySelector('[data-sidebar]');
            el.dataset.sidebar = 'false';
            el.dataset.chat = 'false';
            el.dataset.theatre = 'true';

            if (!chatButtonVisible) {
                GM_addStyle(`
                [data-theatre-mode-container] .z-controls > button {
                  display: none !important;
                }
              `);
            }

            GM_addStyle(`
              [data-sidebar] > .w-xvw {
                padding-top: unset !important;
              }

              #channel-content .watermark-container {
                display: none !important;
              }
            `);

            observer2.disconnect();
            // Clear the flag so subsequent direct visits to kick.com don't trigger theatre mode
            GM_setValue("embedReplaced", false);
        });
        observer2.observe(document.body, {
            subtree: true,
            childList: true,
        });
    }
}