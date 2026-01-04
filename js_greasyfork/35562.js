// ==UserScript==
// @name         KissAnime AutoFocus Search Field
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Does what it says on the tin
// @author       blackcat
// @match        http://kissanime.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35562/KissAnime%20AutoFocus%20Search%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/35562/KissAnime%20AutoFocus%20Search%20Field.meta.js
// ==/UserScript==

(function() {  
        document.getElementById("keyword").focus();
})();