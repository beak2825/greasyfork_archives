// ==UserScript==
// @name        Remove autocomplete=off
// @namespace   remove-autocomplete-off
// @version     2
// @description Removes the attribute autocomplete=off of forms and inputs.
// @grant none
// @include *
// @downloadURL https://update.greasyfork.org/scripts/24880/Remove%20autocomplete%3Doff.user.js
// @updateURL https://update.greasyfork.org/scripts/24880/Remove%20autocomplete%3Doff.meta.js
// ==/UserScript==

Array.prototype.forEach.call(document.querySelectorAll('[autocomplete]'), function(el){
    el.setAttribute('autocomplete', 'on');
});