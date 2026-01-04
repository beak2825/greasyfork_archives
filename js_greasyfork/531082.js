// ==UserScript==
// @name         t.me Open in Web Telegram K for Firefox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script allows you to open t.me links in Web Telegram K in Firefox
// @author       jugami1
// @match        https://t.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531082/tme%20Open%20in%20Web%20Telegram%20K%20for%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/531082/tme%20Open%20in%20Web%20Telegram%20K%20for%20Firefox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Function to get channel ID */
    function getChannelId(url) {
        return url.replace(/^https:\/\/t\.me\//, "");
    }
    /* Get the current location */
    const currentUrl = window.location.href;
    /* Get channel ID from the current location */
    const channelId = getChannelId(currentUrl);
    /* Find the button that takes you to the desktop client */
    const desktopClient = document.querySelector('.tgme_page_action');
    /* Add a new button below to go to the web client */
    if (desktopClient) {
        const webClient = document.createElement('div');
        webClient.classList.add('tgme_page_action', 'tgme_page_web_action');
        webClient.innerHTML = `<a class="tgme_action_button_new tgme_action_web_button" href="https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3D${channelId}"><span class="tgme_action_button_label">Open in Web</span></a>`;
        desktopClient.insertAdjacentElement('afterend', webClient);
    }
    /* Hide channel preview link in t.me */
    const previewLink = document.querySelector('.tgme_page_context_link_wrap');
    previewLink.style.display = 'none';
})();