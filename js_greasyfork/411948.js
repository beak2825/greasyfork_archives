// ==UserScript==
// @name     GeekHub via X
// @namespace geekhub.com
// @version  3
// @description  Change comment 'via' value
// @author       dallaslu
// @match        https://geekhub.com/*
// @match        https://www.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411948/GeekHub%20via%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/411948/GeekHub%20via%20X.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    let via = '🍋';

    function changeVia() {
        let uaField = document.getElementById('comment_ua');
        if (uaField && uaField.value !== via) {
            uaField.value = via;
        }
    }

    let observer = new MutationObserver(function(doc, observer) {
    	changeVia();
    });

    observer.observe(document, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });

    changeVia();
})();