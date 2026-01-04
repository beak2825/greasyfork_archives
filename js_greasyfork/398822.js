// ==UserScript==
// @name         Emoji Suggester Wipe Out
// @namespace    https://outlook.office.com
// @version      1.0
// @description  Remove this annoying emoji suggestions from Outlook mail composer
// @author       Doc Davluz
// @match        https://outlook.office.com/mail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398822/Emoji%20Suggester%20Wipe%20Out.user.js
// @updateURL https://update.greasyfork.org/scripts/398822/Emoji%20Suggester%20Wipe%20Out.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
    'esversion: 6';

    const contentPaneDiscovererCallback = function(documentMutationList, documentationPaneObserver) {
        const matchingMutationRecords = documentMutationList.filter(mutationRecord => documentMutationList.type != "childList"
            && mutationRecord.target.parentElement
            && mutationRecord.target.parentElement.tagName == "BODY");
        if (!matchingMutationRecords) {
            return;
        }

        const emojiPickerSuggestions = document.getElementById('emojiPickerSuggestions');

        if (!emojiPickerSuggestions) {
            return;
        }
        emojiPickerSuggestions.parentElement.parentElement.remove();
    }

    const documentObserverConfig = {
        attributes: false,
        childList: true,
        subtree: true
    };
    const documentObserver = new MutationObserver(contentPaneDiscovererCallback);
    const documentObserverRegistration = documentObserver.observe(document, documentObserverConfig);
})();