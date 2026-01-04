// ==UserScript==
// @name         Notebook Font Changer
// @namespace    http://tampermonkey.net/
// @version      2.1.20
// @description  Changes the font of the Notebook to sans for better spacing and reading
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @source       https://greasyfork.org/en/scripts/383115-notebook-font-changer
// @downloadURL https://update.greasyfork.org/scripts/383115/Notebook%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/383115/Notebook%20Font%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //console.log('Script Started')

    GM_addStyle(`.notebook-text {font-family: monospace !important; font-size: 11px !important;}`);

    let intervalId = setInterval(lookForNotebook, 500);
    let contentIntervalId = 0;

    function lookForNotebook() {
        //let target = document.querySelector('.edit-note_1Cvo5');
        let notebook = document.querySelector('.chat-box-notebook_1JE1u');

        //console.log("notebookContent:");
        //console.log(notebookContent);
        if (notebook) {
            startObserver(notebook);
            clearInterval(intervalId);
        }
    }

    function startObserver(notebook) {
        //console.log("Observer Started");
        let observer = new MutationObserver(function(mutations) {
            //console.log("Mutations:");
            //console.log(mutations);
            mutations.forEach(function(mutation) {
                //console.log("localName");
                //console.log(mutation.target.localName);
                if ((mutation.target.className.indexOf("chat-box-notebook_1JE1u") > -1) || (mutation.target.className.indexOf("chat-box-content_2C5UJ") > -1)) {
                    //console.log("Got the text");
                    //mutation.target.classList.add('notebook-text');
                    if (contentIntervalId === 0) {
                        document.querySelector('.chat-box-notebook_1JE1u').classList.add("notebook-text");
                        contentIntervalId = setInterval(lookForContent, 500);
                    }
                }
            });
        });
        let config = { childList: true, subtree: true };
        observer.observe(notebook, config);
    }

    function lookForContent() {
        let notebookContent = document.querySelector('.edit-note_1Cvo5');

        if (notebookContent) {
            notebookContent.classList.add("notebook-text");
            clearInterval(contentIntervalId);
            contentIntervalId = 0;
        }
    }
})();