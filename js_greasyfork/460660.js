// ==UserScript==
// @name         Få A i alle fag
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hvem trenger vel noe annet en A?
// @author       You
// @match        https://fsweb.no/studentweb/resultater.jsf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fsweb.no
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460660/F%C3%A5%20A%20i%20alle%20fag.user.js
// @updateURL https://update.greasyfork.org/scripts/460660/F%C3%A5%20A%20i%20alle%20fag.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var karakterFelt = document.querySelectorAll(".infoLinje span")
    karakterFelt.forEach(felt => {
        if (felt.innerText.match("[ABCDEF]")){
            felt.innerText = "A";
        }
    })
})();