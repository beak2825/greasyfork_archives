// ==UserScript==
// @name         Return MSN Dislike
// @namespace    https://greasyfork.org/en/users/50-couchy
// @version      20241218
// @description  Unhide article dislikes on MSN news
// @author       Couchy
// @match        https://www.msn.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msn.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/478979/Return%20MSN%20Dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/478979/Return%20MSN%20Dislike.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function forceProp(name, value) {
        Object.defineProperty(Element.prototype, name, {
            enumerable: false,
            configurable: false,
            get: function() {
                return value;
            },
            set: function(data) {
                // Do nothing
            }
        });
    }
    forceProp("_hideDownVote", false);
    forceProp("_hideDownvoteCount", false);
    forceProp("_enableHeartIcon", false);
})();