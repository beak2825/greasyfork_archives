// ==UserScript==
// @name         callback hooker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hook and debug any element with any event
// @author       You
// @match        *
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389422/callback%20hooker.user.js
// @updateURL https://update.greasyfork.org/scripts/389422/callback%20hooker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.hookElement = function(element, event) {
        var originCB = element[event];
        function hooker(argumentList) {
            debugger;
            var ret = originCB.apply(this, argumentList);
            return ret;
        }
        element[event] = hooker;
    }
})();