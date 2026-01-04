// ==UserScript==
// @name         Gitlab - Hide html errors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide red html errors appearing on merge diffs
// @author       You
// @match        https://gitlab.niji.fr/*/diffs
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35182/Gitlab%20-%20Hide%20html%20errors.user.js
// @updateURL https://update.greasyfork.org/scripts/35182/Gitlab%20-%20Hide%20html%20errors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('glhe : init');

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function clean() {
        console.log('glhe : cleaning...');
        // get all .err classes
        var elements = document.querySelectorAll('.code.white .err');
        if(elements.length) {
            console.log('glhe : found ',elements.length, 'classes to remove');
            // and remove them
            elements.forEach(function(element) { element.classList.remove('err'); });
            // once it's done, no need do do it again
            window.removeEventListener('DOMSubtreeModified', cleanDebounced);
        }
    }

    var cleanDebounced = debounce(clean, 500);

    // when dom content change
    window.addEventListener('DOMSubtreeModified', cleanDebounced);
})();