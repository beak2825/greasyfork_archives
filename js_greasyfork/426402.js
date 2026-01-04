// ==UserScript==
// @name         Page Title Editor
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  Permanently edit document.title on any site! Press Ctrl+Alt+= to set, Ctrl+Alt+Backspace to revert to original title.
// @author       Balint Sotanyi
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426402/Page%20Title%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/426402/Page%20Title%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var title_original = document.title, titles = localStorage.getItem('pte_titles') === null ? {} : JSON.parse(localStorage.getItem('pte_titles'));
    if (titles[window.location.pathname] !== undefined) {
        document.title = titles[window.location.pathname];
    }
    window.addEventListener('keydown', function(e) {
        if (e.code == 'Equal' && e.ctrlKey && e.altKey) {
            var t = prompt('document.title = ', titles[window.location.pathname] !== undefined ? titles[window.location.pathname] : document.title);
            if (t === null || t === '') return;
            document.title = t;
            titles[window.location.pathname] = t;
            localStorage.setItem('pte_titles', JSON.stringify(titles));
            e.preventDefault();
        }
        if (e.code == 'Backspace' && e.ctrlKey && e.altKey) {
            document.title = title_original;
            titles = titles.filter(e => e != window.location.pathname);
            localStorage.setItem('pte_titles', JSON.stringify(titles));
            e.preventDefault();
        }
    });
})();