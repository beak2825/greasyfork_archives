// ==UserScript==
// @name         Torn iframe
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a small window to the bottom of the screen to open faction medical page
// @author       MoAlaa[2774213]
// @match        *://www.torn.com/*
// @exclude      *://www.torn.com/factions.php?step=profile&ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531442/Torn%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/531442/Torn%20iframe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent script from running inside iframe or if already initialized
    if (window.self !== window.top || document.getElementById('medicalIframeContainer')) return;

    // Create iframe container
    const container = document.createElement('div');
    container.id = 'medicalIframeContainer'; // Unique ID to prevent duplicates
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '100000';
    container.style.background = '#fff';
    container.style.border = 'none';
    container.style.borderRadius = '5px';
    container.style.padding = '0px';
    container.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    // Create iframe for faction medical page
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.torn.com/factions.php?step=your&type=1#/faction-armoury=undefined&start=0&sub=medical';
    iframe.style.width = '300px';
    iframe.style.height = '150px';
    iframe.style.border = 'none';
    iframe.style.background = '#fff';

    // Assemble the UI
    container.appendChild(iframe);
    document.body.appendChild(container);
})();