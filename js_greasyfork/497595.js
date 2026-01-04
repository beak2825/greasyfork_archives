// ==UserScript==
// @name         Deal versturen waarschuwing
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Stable version
// @author       You
// @match        https://*.socialdeal.nl/bureaublad/goedkeuren.php*
// @match        https://*.socialdeal.be/bureaublad/goedkeuren.php*
// @match        https://*.socialdeal.de/bureaublad/goedkeuren.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=socialdeal.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497595/Deal%20versturen%20waarschuwing.user.js
// @updateURL https://update.greasyfork.org/scripts/497595/Deal%20versturen%20waarschuwing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const triggerwords = ["niet versturen", "hoeft niet verstuurd", "hoeft niet verzonden", "hoeft geen voorbeeld", "niet sturen", "spontaan copy", "spontaancopy", "geen dp", "niet bellen of versturen", "presentatie goedgekeurd"];
    const chatmainiframe = document.querySelector('#chatmain');

    chatmainiframe.onload = (event) => {

        const chatmain = chatmainiframe.contentWindow.document;
        const chat = chatmain.querySelector('iframe#chat').contentWindow.document;

        checkversturen(chat);

    }

    function checkversturen(chat) {
        const messages = chat.querySelectorAll('a[name*="book"]');
        let i_message = 0;
        let foundtriggerword = false;

        while (i_message < messages.length && !foundtriggerword) {

            const text = messages[i_message].querySelector('td[height="99%"] > font').textContent.toLowerCase();
            let i_triggerword = 0;

            while (i_triggerword < triggerwords.length && !foundtriggerword) {
                if (text.includes(triggerwords[i_triggerword])) {
                    foundtriggerword = true;
                    messages[i_message].parentElement.removeAttribute('bgcolor');
                    messages[i_message].parentElement.style = "background-color: rgb(255, 120, 120); border: 3px solid rgb(255 0 0);";
                    const buttonNietMailen = document.querySelector('button[name="nietmailen"]');
                    buttonNietMailen.style.border = "4px solid rgb(0 128 0)";
                    const tbody = document.querySelector('form[action*="goedkeuren.php"][id*="formId"]').closest('tbody');
                    const HTMLwarning = '<tr><td colspan="2" align="center"><div style="display: block; background-color: rgb(255, 120, 120); width: 95%; padding: 10px 0px; border-radius: 10px; font-size: 16px;">LET OP: deal hoeft mogelijk niet (meer) verstuurd te worden, zie chat.</div></td></tr>';
                    tbody.insertAdjacentHTML('beforeend', HTMLwarning)
                }
                i_triggerword++;
            }
            i_message++;
        }

    }

})();