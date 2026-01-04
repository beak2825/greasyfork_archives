// ==UserScript==
// @name         Unblur search results on up.codes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       scuzz
// @match        https://up.codes/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405039/Unblur%20search%20results%20on%20upcodes.user.js
// @updateURL https://update.greasyfork.org/scripts/405039/Unblur%20search%20results%20on%20upcodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("results_locked_msg_anchor_container").remove();

    var elems = document.querySelectorAll(".result_locked");

    [].forEach.call(elems, function(el) {
        el.classList.remove("result_locked");
    });
})();