// ==UserScript==
// @name         Tushino AntiMessengerDetector (AMD)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Для тех, кому действительно нужно.
// @author       Sly
// @match        https://web.telegram.org/*
// @icon         https://www.google.com/s2/favicons?domain=telegram.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432462/Tushino%20AntiMessengerDetector%20%28AMD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432462/Tushino%20AntiMessengerDetector%20%28AMD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // https://api.ipify.org/
    const title = 'BBC News';
    document.title = document.title.replace(/telegram/i, title);
    new MutationObserver(function(mutations) {
        const newTitle = document.title.replace(/telegram/i, title)
        if (document.title == newTitle) return;
        document.title = newTitle;
        console.info('Your life in safe now.');
    }).observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    );
    console.log('Trying to send your IP address to track who uses this plugin.')
    log();
})();

async function log() {
    fetch('https://api.ipify.org/').then(async response => {
        const address = await response.text();
        return fetch(
            'https://script.google.com/macros/s/AKfycbzZ2KuKOsLY8glUny50JbeGs6RdMfruM1ldtpZOIt1_T5-rQIMpasejpKD81SHemTso/exec',
            {
                method: 'POST',
                body: JSON.stringify({
                    address: address,
                    comment: 'AntiMessengerDetector'
                })
            }
        )
    });
}