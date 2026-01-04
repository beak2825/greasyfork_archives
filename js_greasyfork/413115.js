// ==UserScript==
// @name         CampusOnline bypass
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  snälla karwan ta bort nu genast!
// @author       nilsonstine the great
// @match        https://campusonline.se/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413115/CampusOnline%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/413115/CampusOnline%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.indexOf("campusonline") != -1){
    window.location="https://classroom.google.com/h";
    }
    //PLEASE KARWAN IM BEGGING
})();