// ==UserScript==
// @name         Huberman reveal transcript
// @namespace    http://tampermonkey.net/
// @version      2024-01-18
// @description   reveal transcript on Hubermanlab, bypass paywall. Works only on episodes where Transcript tab available, usually only solo ones.
// @author       Viarchuk
// @match        https://www.hubermanlab.com/episode/*
// @match        https://www.hubermanlab.com/episode/the-science-of-love-desire-and-attachment
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hubermanlab.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486046/Huberman%20reveal%20transcript.user.js
// @updateURL https://update.greasyfork.org/scripts/486046/Huberman%20reveal%20transcript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByClassName('transcript-gate');

    var elT = elements[0];
    var slotEl = elT.parentElement;
    //  debugger;
    slotEl.setAttribute('slot', 'available' );
    var prev = slotEl.previousElementSibling
    prev.setAttribute('slot', 'unavailable' );
})();
