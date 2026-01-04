// ==UserScript==
// @name         ISKIZ Extract Email from qTip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract email from qTip and display it below the username.
// @author       Aliev P.A.
// @match        *://iskiz.kmiac.ru/front/ticket.form.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473388/ISKIZ%20Extract%20Email%20from%20qTip.user.js
// @updateURL https://update.greasyfork.org/scripts/473388/ISKIZ%20Extract%20Email%20from%20qTip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('mouseover', function(event) {
        if(event.target.classList.contains('fa-info')) {
            // Get the corresponding qtip number
            const qtipNumber = event.target.getAttribute('data-hasqtip');

            // Waiting for the tooltip to be created by qtip
            setTimeout(function() {
                const qtipContentDiv = document.querySelector(`#qtip-${qtipNumber}-content`);
                if(qtipContentDiv) {
                    // Extracting email using a regex
                    const emailRegex = /Email-адрес<\/strong>:\s*([^<]+)/;
                    const match = emailRegex.exec(qtipContentDiv.innerHTML);
                    if(match && match[1]) {
                        const email = match[1];

                        // Create an element to hold the email and append it under the username
                        const emailElement = document.createElement('div');
                        emailElement.textContent = email;
                        emailElement.style.color = 'blue';
                        emailElement.style.marginTop = '5px';

                        const userNameElement = event.target.closest('.h_user_name');
                        if(userNameElement) {
                            const existingEmailElement = userNameElement.querySelector('.extracted-email');
                            if(existingEmailElement) {
                                existingEmailElement.remove(); // Remove any previous email
                            }
                            emailElement.classList.add('extracted-email');
                            userNameElement.appendChild(emailElement);
                        }
                    }
                }
            }, 500);  // Waiting for half a second. Adjust this if it's too fast or slow.
        }
    });
})();
