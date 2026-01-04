// ==UserScript==
// @name         Partslink24 Anhängevorrichtung Finder VAG V2
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Findet und zeigt die Variablen für Anhängevorrichtung sowie Codes NI0, NI7, NI8 und NI9 auf partslink24.com an.
// @author       You
// @match        https://www.partslink24.com/p5/latest/p5.htm*
// @grant        none
// @license      RatorRamon
// @downloadURL https://update.greasyfork.org/scripts/497038/Partslink24%20Anh%C3%A4ngevorrichtung%20Finder%20VAG%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/497038/Partslink24%20Anh%C3%A4ngevorrichtung%20Finder%20VAG%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAndDisplayVariables() {
        const sourceCode = document.documentElement.innerHTML;
        const variablesToFind = ['1D0', '1D7', '1D8','1D9','#D0' , 'NI0', 'NI7', 'NI8', 'NI9'];
               let messages = [];
        let found1D0 = false;
        let foundNI0 = false;

        variablesToFind.forEach(variable => {
            let index = sourceCode.indexOf(variable);
            if (index !== -1) {
                if (variable === '1D0') {
                    found1D0 = true;
                }
                if (variable === 'NI0') {
                    foundNI0 = true;
                }
                const start = sourceCode.indexOf('<span class="p5_cell_content"', index);
                if (start !== -1) {
                    const titleStart = sourceCode.indexOf('title="', start) + 7;
                    const titleEnd = sourceCode.indexOf('"', titleStart);
                    if (titleStart !== -1 && titleEnd !== -1) {
                        const title = sourceCode.substring(titleStart, titleEnd);
                        if (!messages.includes(`${variable}: ${title}`)) {
                            messages.push(`${variable}: ${title}`);
                        }
                    }
                }
            }
        });

        if (messages.length > 0) {
            displayMessage(messages.join('\n\n'), found1D0, foundNI0);
        } else {
            displayMessage('', found1D0, foundNI0);
        }
    }

    function displayMessage(message, found1D0, foundNI0) {
        const existingNotification = document.getElementById('anhaengevorrichtungNotification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'anhaengevorrichtungNotification';
        notification.style.position = 'fixed';
        notification.style.top = '0';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = '#f2f2f2';
        notification.style.padding = '10px';
        notification.style.zIndex = '9999';
        notification.style.whiteSpace = 'pre-wrap';

        if (!found1D0) {
            notification.style.background = '#ffcccc'; // rot, wenn 1D0 nicht gefunden wird
        } else if (!foundNI0) {
            notification.style.background = '#ffcccc'; // gelb, wenn NI0 nicht gefunden wird
        }

        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(function() {
            notification.remove();
        }, 2000);
    }

    setInterval(findAndDisplayVariables, 2000);
})();