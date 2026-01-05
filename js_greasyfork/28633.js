// ==UserScript==
// @name         Greasyfork - DD/MM/YYYY
// @version      1.0.1
// @description  Changes the date to the european standard
// @author       Cpt_mathix
// @match        https://greasyfork.org/*
// @grant        none
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/28633/Greasyfork%20-%20DDMMYYYY.user.js
// @updateURL https://update.greasyfork.org/scripts/28633/Greasyfork%20-%20DDMMYYYY.meta.js
// ==/UserScript==

(function() {
    var elements = document.querySelectorAll('gf-relative-time');
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = new Date(elements[i].getAttribute("datetime")).toLocaleDateString("fr");
    }
})();

