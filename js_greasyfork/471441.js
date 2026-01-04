// ==UserScript==
// @name         WhatsApp Web Archived Remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the Archived row from WhatsApp Web
// @author       Dequei
// @match        https://web.whatsapp.com/
// @icon         https://web.whatsapp.com/img/favicon/1x/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471441/WhatsApp%20Web%20Archived%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/471441/WhatsApp%20Web%20Archived%20Remover.meta.js
// ==/UserScript==
(function() {
    'use strict';


    function removeArchivedRow() {

        console.info('Archived row remove: start');

        const archivedRow = document.getElementById('pane-side');

        if (archivedRow) {

            const buttonArchived = document.getElementById('pane-side').children[0];

            if (document.getElementById('pane-side').children[0]?.innerText.toLowerCase().includes('archiv')) {

                document.getElementById('pane-side').children[0].style.display = 'none';

                console.info('Archived row remove: done');
            }


        } else {
            failedInfo();
        }
    }

    function waitForElement(querySelector, timeout) {
        return new Promise((resolve, reject) => {
            var timer = false;
            if (document.querySelectorAll(querySelector).length) return resolve();
            const observer = new MutationObserver(() => {
                if (document.querySelectorAll(querySelector).length) {
                    observer.disconnect();
                    if (timer !== false) clearTimeout(timer);
                    return resolve();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            if (timeout) timer = setTimeout(() => {
                observer.disconnect();
                reject();
            }, timeout);
        });
    }

    function failedInfo() {
        console.info('Archived row remove: failed');
    }

    waitForElement("#pane-side", 60000).then(function() {
        removeArchivedRow();
    }).catch(() => {
        failedInfo();
    });



})();
