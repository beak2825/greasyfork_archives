// ==UserScript==
// @name         Trump Renamer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replace every instance of "Trump" in webpage text with a random humorous insult
// @author       You
// @match        *://*/*
// @grant        none\
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544447/Trump%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/544447/Trump%20Renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacements = [
        "Onion-Eyed Flap Dragon",
        "Leather-Faced Piss Jar",
        "Mangled Apricot Hellbeast",
        "Bawbag-Eyed Fuck Bumper",
        "Toupéd Fucktrumpet",
        "Knuckle-Brained Fart Lozenge",
        "Degenerate Corned Beef Face Syrup Wearing Wankstain",
        "Rug Wearing Thunder Nugget",
        "Cock Juggling Thundercunt",
        "Gerbil-Headed, Woodstained, Haunted Spunktrumpet",
        "Spatchcocked Turdwaffle"
    ];

    // Functional helper to get a random element from an array
    const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

    // Replace "trrump" in a string with a random replacement
    const replaceTrumps = text =>
        text.replace(/trump/gi, () => randomFromArray(replacements));

    // Walk the DOM and replace text nodes
    const walk = node => {
        if (node.nodeType === 3) { // Text node
            node.nodeValue = replaceTrumps(node.nodeValue);
        } else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE" && node.nodeName !== "TEXTAREA" && node.nodeName !== "INPUT") {
            Array.from(node.childNodes).forEach(walk);
        }
    };

    // Initial run
    walk(document.body);

    // Optionally, handle dynamically added content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            Array.from(mutation.addedNodes)
                .filter(n => n.nodeType === 1)
                .forEach(walk);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
