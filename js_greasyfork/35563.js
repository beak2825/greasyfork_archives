// ==UserScript==
// @name         Primewire AutoFocus Search Field
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Does what it says on the tin
// @author       blackcat
// @match        http://www.primewire.is/*
// @match        http://www.primewire.ag/*
// @match        http://www.primewire.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35563/Primewire%20AutoFocus%20Search%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/35563/Primewire%20AutoFocus%20Search%20Field.meta.js
// ==/UserScript==

(function() {  
        document.getElementById("search_term").focus();
})();