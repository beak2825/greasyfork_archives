// ==UserScript==
// @name         TypingClub bindings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Implement TypingClub premium bindings
// @author       LeReverandNox
// @match        https://www.typingclub.com/sportal/push_results_display/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388728/TypingClub%20bindings.user.js
// @updateURL https://update.greasyfork.org/scripts/388728/TypingClub%20bindings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // keys
    const homeKey = 'h';
    const resetKey = 'r';
    const nextKey = 'f';

    document.addEventListener("keydown", (e) => {
        // buttons
        const home = document.getElementById("res_menu").children[0];
        const reset = document.getElementById("res_menu").children[1];
        const next = document.getElementById("res_menu").children[2];

        e.preventDefault();

        if (e.ctrlKey && e.key == homeKey) home.click();
        else if (e.ctrlKey && e.key == resetKey) reset.click();
        else if (e.ctrlKey && e.key == nextKey) next.click();

    });
})();