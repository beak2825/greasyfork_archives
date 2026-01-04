// ==UserScript==
// @name         Mirrored.to - Block malicious redirects
// @version      03-07-25
// @description  Block malicious redirects in mirrored.to.
// @author       HayaoMiyazaki
// @match        https://www.mirrored.to/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1122886
// @downloadURL https://update.greasyfork.org/scripts/541552/Mirroredto%20-%20Block%20malicious%20redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/541552/Mirroredto%20-%20Block%20malicious%20redirects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAddEventListener = document.addEventListener;
    document.addEventListener = function(type, listener, options) {
        if (type === 'click' && listener.name === 'pop') {
            return;
        }
        originalAddEventListener.apply(document, arguments);
    };
})();