// ==UserScript==
// @name         Neptun current semester
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Selects the current semester after page load
// @author       You
// @match        https://hallgato.neptun.elte.hu/main.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404537/Neptun%20current%20semester.user.js
// @updateURL https://update.greasyfork.org/scripts/404537/Neptun%20current%20semester.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('select current year')
    const options = document.querySelectorAll("[value='70620']");
    if (options) {
        options.forEach(o => {o.selected="selected"});
    }
    // Your code here...
})();