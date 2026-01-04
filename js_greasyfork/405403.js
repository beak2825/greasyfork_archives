// ==UserScript==
// @name         HF Auto Signature
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       John Wick#1749 | https://hackforums.net/member.php?action=profile&uid=4567568
// @match        https://hackforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405403/HF%20Auto%20Signature.user.js
// @updateURL https://update.greasyfork.org/scripts/405403/HF%20Auto%20Signature.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const signature=
`Hey,

PLACE_PREVIOUS_TEXT

Feel free to add me on discord: John Wick#1749

Best Regards,
The Continental`;

    const SPINTAX_PATTERN = /\{[^"\r\n\}]*\}/;
    const spin = (spun) => {
        var match;
        while (match = spun.match(SPINTAX_PATTERN)) {
            match = match[0];
            var candidates = match.substring(1, match.length - 1).split("|");
            spun = spun.replace(match, candidates[Math.floor(Math.random() * candidates.length)])
        }
        return spun;
    }

    const btn = document.createElement("button");
    btn.className = "button";
    btn.type = "button";
    btn.innerText = "Signature"

    btn.onclick = () => {
        const sig = signature.replace("PLACE_PREVIOUS_TEXT", document.getElementById("message").value);
        document.getElementById("message").value = spin(sig);
    };

    const path = `//input[contains(@value, "Post Reply") or contains(@value, "Send Message")]`;
    const reply = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    reply.parentElement.append(" ");
    reply.parentElement.appendChild(btn);
})();