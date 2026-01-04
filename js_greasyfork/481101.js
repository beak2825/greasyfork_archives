// ==UserScript==
// @name         WME Rapid UR Reply
// @description  Shortcut keys to answer URs with the F8 key and closes them with the F9 -- also, F8 can approve PURs and lock at L3.
// @author       TxAgBQ
// @version      2025120902
// @namespace    <https://greasyfork.org/en/users/820296-txagbq/>
// @icon         <https://www.google.com/s2/favicons?sz=64&domain=waze.com>
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481101/WME%20Rapid%20UR%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/481101/WME%20Rapid%20UR%20Reply.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    function insertCommentViaShadowDOM(textToInsert) {
        const textareaHosts = document.querySelectorAll('wz-textarea');
        for (const host of textareaHosts) {
            const shadow = host.shadowRoot;
            if (!shadow) continue;

            const textarea = shadow.querySelector('textarea');
            if (!textarea) continue;

            textarea.focus();
            textarea.value = textToInsert;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }
        return false;
    }

    function clickSendButton() {
        // New method: Use more specific path to find the send button
        const sendBtnHost = document.querySelector('div.conversation-view form.new-comment-form wz-button.send-button');
        if (sendBtnHost && sendBtnHost.shadowRoot) {
            const actualButton = sendBtnHost.shadowRoot.querySelector('button');
            if (actualButton) {
                actualButton.click();
                return true;
            }
        }
        
        // Alternative: Try within conversation context
        const conversationView = document.querySelector('div.conversation-view');
        if (conversationView) {
            const sendBtn = conversationView.querySelector('form.new-comment-form wz-button.send-button');
            if (sendBtn && sendBtn.shadowRoot) {
                const actualButton = sendBtn.shadowRoot.querySelector('button');
                if (actualButton) {
                    actualButton.click();
                    return true;
                }
            }
        }
        
        // Fallback to old selector in case the UI varies
        const sendBtn = document.querySelector("#panel-container .mapUpdateRequest .body .conversation .new-comment-form .send-button");
        if (sendBtn) {
            sendBtn.click();
            return true;
        }
        
        return false;
    }

    function clickNextButton() {
        console.log('clickNextButton called');
        // Try specific path first
        const nextBtn = document.querySelector('div.footer--d1gls.actions div.navigation div.waze-plain-btn.next');
        if (nextBtn) {
            console.log('Clicking Next button (new selector)');
            nextBtn.click();
            return true;
        }
        
        // Fallback to old jQuery selector only if first method failed
        const $nextBtn = $('#panel-container .mapUpdateRequest .actions .navigation .waze-plain-btn');
        if ($nextBtn.length > 0) {
            console.log('Clicking Next button (old jQuery selector)');
            $nextBtn.click();
            return true;
        }
        
        console.log('No Next button found');
        return false;
    }

    function sendAndNext() {
        // Clicks send
        clickSendButton();

        // Clicks Next (for open URs)
        setTimeout(() => {
            clickNextButton();
        }, 100);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'F8') {
            // Inserts this text
            //let textToInsert = "I got your map issue report.  What issue did you experience? \n\nWould you please tell us your destination EXACTLY as selected in Waze? Click on 'Where to?' then scroll down to see recent destinations.  Include both the bold name and address underneath, with city. If it's spelled out, spell it out. If it's abbreviated, abbreviate it.  How to find your recent destination: <https://www.youtube.com/watch?v=PExNTIQfJI8>  \n\nWe don't receive email replies so please respond in the Waze inbox.";

            // First insert the text (if line is not commented out)
            if (typeof textToInsert !== 'undefined') {
                insertCommentViaShadowDOM(textToInsert);
            }

            // Always send and move to next after a short delay (whether text was inserted or not)
            setTimeout(sendAndNext, 250);

            // Approves PUR then sets to lock level 2
            // Click Add and edit
            setTimeout(() => {
                $('#panel-container .place-update-edit .actions .controls-container label[for="approved-true"]').click();
                // Clicks Next (for open PURs) - Commented out because sendAndNext already clicks Next
                // setTimeout(() => {
                //     clickNextButton();
                // }, 100);
            }, 500);
        }

        if (event.key === 'F9') {
            // Inserts this text
            // Comment to close out report
            let textToInsert = "You asked us to help you with a Map Issue report but you didn't respond back with the info we need to fix your problem, so we'll infer everything is okay and close your request. \n\nIf you were reporting a closure, the quickest way to get closures on the map is to use the Report > Closure feature built into the Waze. <https://support.google.com/waze/answer/13753511> \n\nIf you believe Waze should automatically detect closures on its own, rather than routing you into them, you can vote here <https://waze.uservoice.com/forums/59223-waze-suggestion-box/suggestions/47051794-autodetect-closures-and-closed-roads>";

            if (insertCommentViaShadowDOM(textToInsert)) {
                setTimeout(() => {
                    // Clicks send
                    clickSendButton();

                    // Clicks NI
                    setTimeout(() => {
                        // New method: Use specific path to find the NI label
                        let niClicked = false;
                        const niLabel = document.querySelector('div.footer--d1gls.actions form.controls-container label[for="state-not-identified"]');
                        if (niLabel) {
                            niLabel.click();
                            niClicked = true;
                        }
                        
                        // Fallback to old selector only if not clicked yet
                        if (!niClicked) {
                            const $niLabel = $('#panel-container .mapUpdateRequest .actions .controls-container label[for|="state-not-identified"]');
                            if ($niLabel.length > 0) {
                                $niLabel.click();
                            }
                        }

                        // Clicks Next (for open URs)
                        setTimeout(() => {
                            clickNextButton();
                        }, 100);
                    }, 100);
                }, 250);
            }
        }
    });
})();