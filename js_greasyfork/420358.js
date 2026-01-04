// ==UserScript==
// @name         AutoKS-selector
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Book salplass på KS på 1-2-3
// @author       Endre Lem
// @match        https://tp.uio.no/ntnu/rombestilling/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420358/AutoKS-selector.user.js
// @updateURL https://update.greasyfork.org/scripts/420358/AutoKS-selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Velg «Plassbestilling»
    document.getElementById("main-focus").checked = true;

    // Hent lister
    function setSelectedIndex(s, v) {

    for ( var i = 0; i < s.options.length; i++ ) {

        if ( s.options[i].text == v ) {

            s.options[i].selected = true;

            return;

        }

    }

}

// Velg «Øya», «Kunnskapssenteret» og «Lesesal» i listene
setSelectedIndex(document.getElementById('area'),"Øya");
setSelectedIndex(document.getElementById('building'),"Kunnskapssenteret");
setSelectedIndex(document.getElementById('roomtype'),"Lesesal");



})();