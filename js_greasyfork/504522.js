// ==UserScript==
// @name         AO3 Cancel Confirmation
// @version      1.0.0
// @description  Add a confirmation prompt to cancel buttons.
// @namespace    https://greasyfork.org/en/users/1353885-akira123
// @author       Akira123
// @match        http*://archiveofourown.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504522/AO3%20Cancel%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/504522/AO3%20Cancel%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict'

    function addConfirmation(button) {
        button.addEventListener('click', e => {
            if (!confirm('Are you sure you want to cancel?')) {
                e.preventDefault()
                e.stopPropagation()
            }
        }, true)
    }

    const cancelSelectors = [
        'input[name="cancel_button"]', // Post or edit work page
        'a[href*="cancel_comment_reply"]', // Comment reply
        'a[name="comment_cancel"]' // Floating comment in inbox
    ].join()

    const cancelButtons = document.querySelectorAll(cancelSelectors)
    cancelButtons.forEach(addConfirmation)

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const newCancelButtons = node.querySelectorAll(cancelSelectors)
                    newCancelButtons.forEach(addConfirmation)
                }
            })
        })
    })
    observer.observe(document.body, { childList: true, subtree: true })
})()