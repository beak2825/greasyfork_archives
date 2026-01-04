// ==UserScript==
// @name         Qwant - Minimal theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show simpler Qwant
// @author       You
// @match        https://www.qwant.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35758/Qwant%20-%20Minimal%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/35758/Qwant%20-%20Minimal%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('qwmt : init');

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
        console.log('qwmt : cleaning...');
        // to hide
        var elements = document.querySelectorAll('.header, .header__text, .snippet, .footer');
        if(elements.length) {
            console.log('glhe : found ',elements.length, 'elements to hide');
            elements.forEach(function(element) { element.style.display = 'none'; });
            // custom
            document.querySelector('#home__event__img').style.maxHeight = '150px';
            // once it's done, no need do do it again
            window.removeEventListener('DOMSubtreeModified', cleanDebounced);
        }
    }

    var cleanDebounced = debounce(clean, 500);

    // when dom content change
    window.addEventListener('DOMSubtreeModified', cleanDebounced);

})();