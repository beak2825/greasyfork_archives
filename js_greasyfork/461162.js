// ==UserScript==
// @name         HI3 Elysian Realm Builds Site Checkboxes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds checkboxes to that interactive ER site
// @author       You
// @match        https://risbi0.github.io/Elysian-Realm/
// @icon         https://risbi0.github.io/Elysian-Realm/static/favicon/favicon.ico
// @grant        none
// @license      MIL
// @downloadURL https://update.greasyfork.org/scripts/461162/HI3%20Elysian%20Realm%20Builds%20Site%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/461162/HI3%20Elysian%20Realm%20Builds%20Site%20Checkboxes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addCheckboxes() {
        for (let x of document.querySelectorAll(".guide-content")) {
            x.style.height = "100%"
        }

        var signets = document.querySelectorAll(".main-tbl > tbody > tr, .secondary-tbl > tbody > tr, .optional-tbl > tbody > tr")

        for (let x of signets) {
            let checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.style.height = 'inherit'
            if (x.querySelectorAll("input").length == 0) {
                x.appendChild(checkbox)
            }
        }
        setTimeout(addCheckboxes, 1000)
    }

    window.addEventListener('load', function () {
        setTimeout(addCheckboxes, 1000)
    }, false);

})();
