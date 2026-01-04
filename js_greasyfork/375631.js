// ==UserScript==
// @name         English Moodle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Always redirect moodle to the english site
// @author       Abraham Murciano
// @match        https://moodle.jct.ac.il
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375631/English%20Moodle.user.js
// @updateURL https://update.greasyfork.org/scripts/375631/English%20Moodle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    if(url.indexOf('?lang=en') < 0 && url.indexOf('&lang=en') < 0){
        var prefix = (url.indexOf('?') < 0 ? '?' : '&');
        window.location.href += prefix + 'lang=en';
    }
})();