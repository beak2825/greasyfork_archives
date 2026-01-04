// ==UserScript==
// @name         Remove position fixed and sticky on top navbar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       DnAp
// @description  Decline top menu move on page
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373969/Remove%20position%20fixed%20and%20sticky%20on%20top%20navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/373969/Remove%20position%20fixed%20and%20sticky%20on%20top%20navbar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var maxDeep = 4;
    var replacePosition;
    var count = 0;

    replacePosition = function(element, deep) {
        if (['DIV', 'NAV', 'TABLE', 'SECTION'].indexOf(element.tagName) !== -1) {
            var css = window.getComputedStyle(element);
            var positionValue = css.position || "".replace(/\s/g, "").toLowerCase();
            if (positionValue === 'sticky') {
                element.style.position = 'static';
                count++;
                return;
            }

            if (positionValue === 'fixed' && parseInt(css.top || "0") === 0) {
                element.style.position = 'absolute';
                count++;
                return;
            }
        }
        deep++;
        if (deep >= maxDeep) {
            return;
        }

        for (var key = 0; key < element.children.length; key++) {
            replacePosition(element.children[key], deep);
        }
    };

    replacePosition(document.body, 0);
    console.warn("Remove position fixed for " + count + " elements");
})();
