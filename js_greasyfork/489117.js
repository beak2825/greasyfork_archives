// ==UserScript==
// @name         Dominion Bugs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Describes known bugs that might occur in your Dominion games
// @author       Personman
// @match        *://dominion.games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489117/Dominion%20Bugs.user.js
// @updateURL https://update.greasyfork.org/scripts/489117/Dominion%20Bugs.meta.js
// ==/UserScript==

(async ()=>{
    await import("https://jseakle.github.io/dominion-bugs/bugs.js").then((bugs_module) => {
    'use strict';

    // Change this to the class name you want to monitor
    const targetClassName = 'text-counter'
    var time = performance.now()
    var newtime = null
    var first = true

    // Create a new MutationObserver instance
    const observer = new MutationObserver(function(mutations) {
        var game_started = false;
        mutations.forEach(function(mutation) {


            // Check if any new nodes were added
            if (mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];

                    // Check if the added node or any of its children have the target class
                    if (nodeOrChildHasClass(node, targetClassName)) {
                        game_started = true
                        break;
                    }
                }

            }

        });
        if(game_started) {
            setTimeout(maybe_detect, 100)
        }
    });

    function maybe_detect() {
        newtime = performance.now()
        if((!first && newtime - time < 8000) || document.getElementsByClassName('new-turn-line').length) {
            return
        }
        first = false
        time = newtime
        bugs_module.detect_bugs()
    }
    // Helper function to check if a node or any of its children have a particular class
    function nodeOrChildHasClass(node, className) {
        if (node.nodeType == 1) {
            if (node.classList.contains(className)) {
                return true;
            }

            // Check children recursively
            for (let i = 0; i < node.children.length; i++) {
                if (nodeOrChildHasClass(node.children[i], className)) {
                    return true;
                }
            }
        }

        return false;
    }

    // Start observing the entire document
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})})();
