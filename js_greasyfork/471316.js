// ==UserScript==
// @name         Wide Poe
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Wider chat area for Poe
// @author       emuyia
// @license      Apache-2.0
// @match        https://poe.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471316/Wide%20Poe.user.js
// @updateURL https://update.greasyfork.org/scripts/471316/Wide%20Poe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var chatWidth = '80%'; // Set this value to whatever you like!

    function modifyChatArea() {
        var elements = [
            {selector: '.ChatPageMainFooter_footerInner__BEj26', style: 'width', value: chatWidth},
            {selector: '.ChatMessagesView_infiniteScroll__vk3VX', style: 'width', value: chatWidth},
            {selector: '.InfiniteScroll_container__PHsd4', style: 'width', value: chatWidth},
            {selector: '.ChatMessagesView_emptyView__HqDf7', style: 'max-width', value: 'none'},
            {selector: '.Message_botMessageBubble__aYctV', style: 'max-width', value: 'none'},
            {selector: '.Message_humanMessageBubble__DtRxA', style: 'max-width', value: 'none'},
        ];

        for (var i = 0; i < elements.length; i++) {
            // Use querySelectorAll to get all matching elements
            var els = document.querySelectorAll(elements[i].selector);
            // Iterate over all matching elements
            for (var j = 0; j < els.length; j++) {
                var el = els[j];
                if (el) {
                    el.style[elements[i].style] = elements[i].value;
                }
            }
        }
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == 'childList') {
                modifyChatArea();
            }
        });
    });

    observer.observe(document, { childList: true, subtree: true });

    modifyChatArea();
})();
