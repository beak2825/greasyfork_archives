// ==UserScript==
// @name         Stop Reddit tracking your clicks
// @namespace    https://reddit.com/
// @version      1
// @description  Prevents reddit from modifying outbound links when you click them.
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36429/Stop%20Reddit%20tracking%20your%20clicks.user.js
// @updateURL https://update.greasyfork.org/scripts/36429/Stop%20Reddit%20tracking%20your%20clicks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var el = function(html) {
        var e = document.createElement('div');
        e.innerHTML = html;
        return e.removeChild(e.firstChild);
    };

    function main() {
        for(var a of document.getElementsByTagName('a')) {
            if (a.hasAttribute('data-href-url')) {
                var b = el('<a />');
                b.href = a.getAttribute('data-href-url');
                b.classList = a.classList;
                b.setAttribute('title', a.getAttribute('title'));
                b.setAttribute('tabindex', a.getAttribute('tabindex'));
                b.innerHTML = a.innerHTML;
                b.setAttribute('rel', 'noreferrer');
                a.parentNode.insertBefore(b, a);
                a.remove();
            }
        }
    }

    main();
    window.addEventListener('neverEndingLoad', main);
})();