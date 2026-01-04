// ==UserScript==
// @name         Gewinnspiel - Wunderweib
// @version      0.1
// @description  Teilnahmebedingungen automatisch angeklickt
// @author       rabe85
// @match        http://gewinnspiel.wunderweib.de/*
// @match        https://gewinnspiel.wunderweib.de/*
// @match        http://gewinnspiel.intouch.wunderweib.de/*
// @match        https://gewinnspiel.intouch.wunderweib.de/*
// @match        http://gewinnspiel.tvmovie.de/*
// @match        https://gewinnspiel.tvmovie.de/*
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/369122/Gewinnspiel%20-%20Wunderweib.user.js
// @updateURL https://update.greasyfork.org/scripts/369122/Gewinnspiel%20-%20Wunderweib.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function gewinnspiel() {

        // Teilnahmebedingungen checked
        document.querySelector("input[name='entry[agree_to_terms]']").value = 1;
        document.getElementById('entry_agree_to_terms').checked = true;
        document.getElementById('submit_entry').disabled = false;

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        gewinnspiel();
    } else {
        document.addEventListener("DOMContentLoaded", gewinnspiel, false);
    }

})();