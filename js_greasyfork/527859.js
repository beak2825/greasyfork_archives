// ==UserScript==
// @name         ReloadGmailExternalMails
// @namespace    https://vitotafuni.com/
// @version      1.0
// @description  Download all external email account on Gmail
// @author       Vito Tafuni
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @match        https://mail.google.com/mail/*
// @grant        none
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527859/ReloadGmailExternalMails.user.js
// @updateURL https://update.greasyfork.org/scripts/527859/ReloadGmailExternalMails.meta.js
// ==/UserScript==

(function() {
    function findByText(needle, haystack = document) {

        return [...haystack.querySelectorAll('*')].reduce(
            (acc, val) => {
                for (const {
                    nodeType,
                    textContent,
                    parentElement
                } of val.childNodes) {
                    if (nodeType === 3 && textContent.includes(needle) && !(parentElement.tagName === 'SCRIPT')) acc.push(parentElement);
                }
                return acc;
            }, []
        );
    }

    findByText("Scarica posta ora").forEach(function(i,j){ i.click(); });
})();