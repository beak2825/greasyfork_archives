// ==UserScript==
// @name         YouTube Declutter Revamped
// @namespace    https://github.com/AidenRaaphorst/youtube-declutter
// @version      1.1
// @description  A better version of my terrible previous script. Removes the 'Join', 'Donate', 'Thank' & 'Clip' buttons below the video player.
// @author       Ardyon
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458983/YouTube%20Declutter%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/458983/YouTube%20Declutter%20Revamped.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const YT_VIDEO_URL_REGEX = new RegExp(".*:\/\/.*\.youtube\.com\/watch.*");
    let texts = [];
    const allowLogging = true;

    document.addEventListener("yt-page-data-updated", () => {
        if(!YT_VIDEO_URL_REGEX.test(location.href)) {
            return;
        }

        texts = getLangText(document.documentElement.lang);
        const videoButtons = document.querySelector("div#top-row.ytd-watch-metadata");

        removeButtons(videoButtons);
        observer.observe(videoButtons, {childList: true, subtree: true});
    });

    // Remove (maybe not all) buttons -> trigger observer -> remove rest of the buttons (just in case)
    const observer = new MutationObserver(mutations => {
        const videoButtons = document.querySelector("div#top-row.ytd-watch-metadata");
        removeButtons(videoButtons);
    });

    const removeButtons = (buttonsContainer) => {
        const sponsorButton = buttonsContainer.querySelector("div#sponsor-button");
        const downloadButton = buttonsContainer.querySelector("div#flexible-item-buttons ytd-download-button-renderer");
        const otherButtons = buttonsContainer.querySelectorAll("div#flexible-item-buttons ytd-button-view-model, div#flexible-item-buttons yt-button-view-model");
        let buttonText;

        if(sponsorButton) {
            buttonText = sponsorButton.innerText.toLowerCase();
            sponsorButton.remove();
            if(allowLogging) log(`Button removed: ${buttonText} (Sponsor)`);
        }

        if(downloadButton) {
            buttonText = downloadButton.innerText.toLowerCase();
            downloadButton.remove();
            if(allowLogging) log(`Button removed: ${buttonText} (Download)`);
        }

        otherButtons.forEach((button) => {
            buttonText = button.innerText.toLowerCase();
            const hasText = texts.some((text) => buttonText.includes(text));

            if(hasText) {
                button.remove();
                if(allowLogging) log(`Button removed: ${buttonText}`);
            }
        });
    };

    const getLangText = (lang) => {
        // Converts html lang property 'en-UK' to 'en' for example
        lang = lang.split("-")[0];

        // All lowercase
        switch(lang) {
            case "en": // English
                return [ "download", "thanks", "clip" ];

            case "nl": // Dutch
                return [ "downloaden", "bedankt", "fragment" ];

            case "de": // German
                return [ "herunterladen", "thanks", "clip" ];

            case "fr": // French
                return [ "télécharger", "merci", "extrait" ];

            case "es": // Spanish
                return [ "descargar", "gracias", "recortar", "clip" ];

            case "it": // Italian
                return [ "scarica", "grazie", "clip" ];

            case "pt": // Portuguese
                return [ "transferir", "obrigado", "clipe", "download", "valeu" ];

            default:
                return [ "download", "thanks", "clip" ];
        }
    };

    const log = (msg) => {
        // Prefix stuff is inspired by: https://greasyfork.org/en/scripts/423851-simple-youtube-age-restriction-bypass
        const prefix = `%cYT-Declutter-Revamped [${new Date().toLocaleTimeString()}]:`;
        const prefixStyle = 'background-color: #20968c; color: #000; font-size: 1.3em;';
        console.log(prefix, prefixStyle, msg);
    };

})();