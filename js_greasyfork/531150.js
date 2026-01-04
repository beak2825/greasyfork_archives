// ==UserScript==
// @name         Cartel Empire - ceReplace
// @namespace    cartel.ovh
// @version      1.00
// @description  Replaces text globally in Cartel Empire (except in chat)
// @author       ZoomStop
// @match        https://cartelempire.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/531150/Cartel%20Empire%20-%20ceReplace.user.js
// @updateURL https://update.greasyfork.org/scripts/531150/Cartel%20Empire%20-%20ceReplace.meta.js
// ==/UserScript==
//
//  Define replacements below in Replace_Terms
//  On the left put the text to search, on the right put the text to replace the text on the left with
//  Add additional lines as needed following this format:
//  [ "Text To Search For", "Text to Replace With" ],
//

(function() { 'use strict'; 
    
    const Replace_Terms = [
        ["£","$"],
        ["Team 1", "✅ Team 1"],
        ["Team 2", "✅ Team 2"],
        ["Team 3", "✅ Team 3"],
        ["Team 4", "✅ Team 4"],
        ["Team 5", "✅ Team 5"],
    ];

    function replaceStringsOnPage() {
        $('*').contents().each(function () {
            if (this.nodeType === 3) {     
                if ($(this).closest('.chatContainer').length === 0) {
                    var nodeValue = this.nodeValue;
                    Replace_Terms.forEach(function (replacement) {
                        if (!nodeValue.includes(replacement[1])) {
                            nodeValue = nodeValue.replace(new RegExp(replacement[0], 'g'), replacement[1]);
                        }
                    });
                    this.nodeValue = nodeValue;
                }
            }
        });
    }

    function observeMutations() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && ($(node).hasClass("modal-backdrop") || $(node).hasClass("offerListWrapper"))) { 
                            replaceStringsOnPage();
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    $(document).ready(function() { 
        replaceStringsOnPage();
        observeMutations();
    });
})();