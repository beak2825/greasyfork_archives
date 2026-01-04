// ==UserScript==
// @name         YouTube Chat Extender
// @namespace    https://greasyfork.org/users/696211-ctl2
// @version      0.1
// @description  Hides all non-chat chat-box elements.
// @author       Callum Latham
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430339/YouTube%20Chat%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/430339/YouTube%20Chat%20Extender.meta.js
// ==/UserScript==

const CONFIG_USER = {
    'REMOVE_HEADER': true,
    'REMOVE_TICKER': true,
    'REMOVE_HIDER': true
};

const CONFIG_DEV = {
    'REMOVE_HEADER': window => window.document.body.querySelector('yt-live-chat-header-renderer'),
    'REMOVE_TICKER': window => window.document.body.querySelector('#ticker'),
    'REMOVE_HIDER': window => window.frameElement.parentElement.querySelector('#show-hide-button')
};

(() => {
    if (window.frameElement.id !== 'chatframe') {
        return;
    }

    window.addEventListener('load', () => {
        for (const [key, doHide] of Object.entries(CONFIG_USER)) {
            if (doHide) {
                const element = CONFIG_DEV[key](window);

                element.style.display = 'none';
            }
        }
    });
})();
