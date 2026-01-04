// ==UserScript==
// @name Search Drachenwald OP
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Adds a context menu item to search for a persona in the OP.
// @author Leif Ershag
// @match *://*/*
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/495314/Search%20Drachenwald%20OP.user.js
// @updateURL https://update.greasyfork.org/scripts/495314/Search%20Drachenwald%20OP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function submitSearchForm(query) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://op.drachenwald.sca.org/search';
        form.target = '_blank'; // Open form submission in a new tab

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'persona';
        input.value = query;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    function searchOp() {
        var name = window.getSelection().toString();
        submitSearchForm(name);
    }

    GM_registerMenuCommand('Search OP', function(x,y) {
        searchOp();
    });
})();