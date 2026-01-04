// ==UserScript==
// @name         automatically_input_id
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sso.apps.openu.ac.il/login?T_PLACE=https://sheilta.apps.openu.ac.il/pls/dmyopt2/sheilta.main
// @grant GM.setValue
// @grant GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/416272/automatically_input_id.user.js
// @updateURL https://update.greasyfork.org/scripts/416272/automatically_input_id.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var inp = document.querySelector("input#p_mis_student");
    var subm = document.querySelector("input[type='submit']");

    if(inp.value == "") {
        var id = await GM.getValue("student_id")
        if (!id) {
            id = prompt("Enter your ID to automatically input it on each page load and automatically log in")
            GM.setValue("student_id", id)
        }
        inp.value = id
        subm.click()
    }
})();