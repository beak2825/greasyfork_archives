// ==UserScript==
// @name         Hordes.io - A draft of beer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Just a normal beer
// @author       WindyHills
// @match        https://hordes.io/play
// @grant        none
// @license      Proprietary - Do not redistribute without permission! or something else. you understand.
// @downloadURL https://update.greasyfork.org/scripts/533254/Hordesio%20-%20A%20draft%20of%20beer.user.js
// @updateURL https://update.greasyfork.org/scripts/533254/Hordesio%20-%20A%20draft%20of%20beer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        performance: false // Change to "true" to performance mode
    };

    const srcMappings = {
        "/data/items/misc/misc4_q0.avif?v=8822612": "https://i.ibb.co/bQJDc9d/beer-barley.png",
        "/data/items/misc/misc4_grey.avif?v=8822612": "https://i.ibb.co/0yR7r21/beer-barley-grey.png"
    };

    const textMappings = {
        "Large HP Potion": "Beer",
        "A potion flask containing a red liquid, healing you as you drink it.":
            "An artisan beer with a taste that lingers on your palate! Enjoy it between your adventures to relax and unwind, but be careful—too much might leave you a bit dizzy!",
        "1000 HP recovered": "+2 Nausea"
    };

    function updateImages() {
        for (const [original, replacement] of Object.entries(srcMappings)) {
            const imgs = document.querySelectorAll(`img[src="${original}"]`);
            imgs.forEach(img => {
                if (img.src !== replacement) img.src = replacement;
            });
        }
    }

    function replaceText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            let replaced = node.nodeValue;
            for (const [original, replacement] of Object.entries(textMappings)) {
                if (replaced.includes(original)) {
                    replaced = replaced.replace(original, replacement);
                }
            }
            if (replaced !== node.nodeValue) {
                node.nodeValue = replaced;
            }
        }
    }

    function main() {
        updateImages();
        replaceText();
    }

    let observer;

    if (config.performance) {
        let debounceTimer;
        const debouncedMain = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(main, 30);
        };

        observer = new MutationObserver(debouncedMain);
    } else {
        observer = new MutationObserver(main);
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();