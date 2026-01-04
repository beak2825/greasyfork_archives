// ==UserScript==
// @name         Youtube - hide "Download" and other buttons under video
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Hide "Share", "Download", "Clip", "Thanks" and "Save" buttons under video.
// @author       Deltaspace
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440416/Youtube%20-%20hide%20%22Download%22%20and%20other%20buttons%20under%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/440416/Youtube%20-%20hide%20%22Download%22%20and%20other%20buttons%20under%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const btag = 'ytd-button-renderer';
    const dtag = 'ytd-download-button-renderer';
    const buttonNames = ['Share', 'Clip', 'Thanks', 'Save'];
    function setMode(mode) {
        const buttons = document.getElementsByTagName(btag);
        const downloadButtons = document.getElementsByTagName(dtag);
        function modifyButton(button) {
            if (mode === 'true') {
                button.setAttribute('hidden', '');
            } else {
                button.removeAttribute('hidden');
            }
        }
        if (downloadButtons.length > 0) {
            modifyButton(downloadButtons[0]);
        }
        for (const button of buttons) {
            if (button.id === 'submit-button') {
                continue;
            }
            for (const buttonName of buttonNames) {
                if (button.innerHTML.includes(buttonName)) {
                    modifyButton(button);
                    break;
                }
            }
        }
    }
    let mode = window.localStorage.getItem('hide-buttons');
    setMode(mode);
    document.addEventListener('keydown', (e) => {
        if (e.key == '`') {
            mode = (mode === 'true') ? 'false' : 'true';
            window.localStorage.setItem('hide-buttons', mode);
            setMode(mode);
        }
    });
    const btnObserver = new MutationObserver(() => setMode(mode));
    const divObserver = new MutationObserver((_, observer) => {
        const menuDiv = document.querySelector('div#menu-container');
        if (menuDiv !== null) {
            observer.disconnect();
            setMode(mode);
            btnObserver.observe(menuDiv, {
                subtree: true,
                childList: true
            });
        }
    });
    divObserver.observe(document, {
        subtree: true,
        childList: true
    });
})();