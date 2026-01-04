// ==UserScript==
// @name         10 Minute Mail No Ad Message
// @namespace    https://kapifrost.github.io/
// @version      1.0
// @description  no more 10 min mail ad message
// @author       kapifrost
// @match        https://10minutemail.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=10minutemail.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496093/10%20Minute%20Mail%20No%20Ad%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/496093/10%20Minute%20Mail%20No%20Ad%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalDocQuerySelector = document.querySelector;
    document.querySelector = function(selector) {
        if (selector === '#cmp_bait') {
            return document.createElement('div');
        }
        originalDocQuerySelector.apply(this, arguments);
    };

    Object.defineProperty(document.body.style, 'overflowY', {
        set: function() {
            console.error('10 Minute Mail No Ad Message by kapifrost');
        },
        get: function() {
            return '10 Minute Mail No Ad Message by kapifrost';
        },
        configurable: false,
        enumerable: false
    });
})();