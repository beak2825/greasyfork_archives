// ==UserScript==
// @name         HF Contract Color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       John Wick#1749 | https://hackforums.net/member.php?action=profile&uid=4567568
// @match        https://hackforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405336/HF%20Contract%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/405336/HF%20Contract%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colors = [
        {name: "Active Deal", color: "Yellow",},
        {name: "Completed", color: "Chartreuse",},
        {name: "Canceled", color: "Tomato",},
        {name: "Expired", color: "Crimson",},
    ];

    const entries = document.getElementsByTagName("td");
    [...entries].map(e => {
        const contract_type = colors.find(c => c.name == e.innerText);

        if (!contract_type) return;

        e.style.color = contract_type.color;
    });
})();