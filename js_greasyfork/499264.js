// ==UserScript==
// @name         Remove Appscript Disturbing pop-up
// @namespace    fiverr.com/web_coder_nsd
// @version      0.3
// @description  Remove the "You're currently signed in as..." dialog element if it exists on the Google Apps Script projects page
// @author       Noushad Bhuiyan
// @icon         https://www.gstatic.com/script/favicon.ico
// @match        https://script.google.com/u/*/home/projects/*
// @match        https://script.google.com/home/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499264/Remove%20Appscript%20Disturbing%20pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/499264/Remove%20Appscript%20Disturbing%20pop-up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified dialog element
    const removeDialogElement = () => {
        const dialogElement = document.querySelector('[role="dialog"][aria-labelledby=":0"]');
        if (dialogElement) {
            dialogElement.remove();
            console.log("Dialog element removed");
        }
    };

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Check if the target node is the body element or a descendant of the body
            if (mutation.target === document.body || document.body.contains(mutation.target)) {
                // Remove the dialog element if it exists
                removeDialogElement();
                if(document.querySelector('.asc_FolderRoot')){
                    document.querySelector('.asc_FolderRoot').style.background = 'black'
                    document.querySelector('.asc_FolderRoot').style.color = 'aqua'
                }
            }
        });
    });

    // Configuration for the MutationObserver
    const config = { childList: true, subtree: true };

    // Start observing mutations in the DOM
    observer.observe(document.body, config);

    // Initial check to remove the dialog element if it exists when the script is loaded
    removeDialogElement();
})();
