// ==UserScript==
// @name                Disable terrible github actions run search
// @namespace           https://github.com/bigwheel
// @version             0.1
// @description         Disable terrible github actions run search. I hate it.
// @author              kbigwheel
// @match               https://github.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469469/Disable%20terrible%20github%20actions%20run%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/469469/Disable%20terrible%20github%20actions%20run%20search.meta.js
// ==/UserScript==
 
window.addEventListener('load', function() {
    document.getElementsByClassName("js-checks-log-search-input")[0].removeAttribute('data-hotkey');
}, false);