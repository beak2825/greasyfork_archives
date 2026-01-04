// ==UserScript==
// @name         Wordle Warn on Already Used Letters
// @namespace    http://tampermonkey.net/
// @version      2024-02-07
// @description  When you type a letter that is confirmed absent in Wordle, this script will highlight it in red as a warning. Hopefully will help prevent dumb mistakes.
// @author       Glench
// @match        https://www.nytimes.com/games/wordle/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485981/Wordle%20Warn%20on%20Already%20Used%20Letters.user.js
// @updateURL https://update.greasyfork.org/scripts/485981/Wordle%20Warn%20on%20Already%20Used%20Letters.meta.js
// ==/UserScript==
    
(function() {
    'use strict';
    
    function on_DOM_change(selector, cb) {
        // Select the node that will be observed for mutations
        const targetNode = document.body;
    
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };
    
        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                var newNodes = mutation.addedNodes;
                if (newNodes.length == 0) {
                    if (mutation.target.matches(selector)) {
                        return cb(mutation.target)
                    }
                }
                var match = Array.from(newNodes).find(el => (el.matches && el.matches(selector)))
                if (!match) {
                    Array.from(newNodes).forEach(el => {
                        var children = el.querySelectorAll && el.querySelectorAll(selector)
                        if (children) {
                            children.forEach(cb)
                        }
                    })
                } else {
                    cb(mutation.target)
                }
            }
        };
    
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
    
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    
        Array.from(document.querySelectorAll(selector)).forEach(cb);
    }
    
    on_DOM_change('div[data-state="tbd"]', function(el) {
        const disallowed_letters = Array.from(document.querySelectorAll('div[data-state="absent"]')).map(x => x.innerText)
        const confirmed_letters = Array.from(document.querySelectorAll('div[data-state="correct"]')).map(x => x.innerText)
        const misplaced_letters = Array.from(document.querySelectorAll('div[data-state="present"]')).map(x => x.innerText)

        const letter = el.innerText;

        if (disallowed_letters.includes(letter) && !confirmed_letters.includes(letter) && !misplaced_letters.includes(letter)) {
            el.style.color = 'red';
        } else {
            el.style.removeProperty('color');
        }
    })

    // make sure when answer is submitted that the red warning is removed
    on_DOM_change('div[data-state="correct"], div[data-state="absent"], div[data-state="present"]', function(el) {
        el.removeAttribute('style');
    })

    
})();