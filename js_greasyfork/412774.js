// ==UserScript==
// @name         Twitch Remove Reruns Observer
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @version      1.2.3
// @description  Remove Reruns from Twitch (Following, Browse, Search, etc), works through Twitch non-reload redirection.
// @author       Delmain
// @license      Apache-2.0
// @match        *://www.twitch.tv/directory/category/asmr
// @match        *://go.twitch.tv/directory/category/asmr
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @downloadURL https://update.greasyfork.org/scripts/412774/Twitch%20Remove%20Reruns%20Observer.user.js
// @updateURL https://update.greasyfork.org/scripts/412774/Twitch%20Remove%20Reruns%20Observer.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';
    let rrTitleRegex = /\b\W?rr\b/i;
    let rerunTitleRegex = /\brerun\b/i;
    let rrCursiveTitleRegex = /\W?𝓡𝓡/i;
    let rerunTagCount = 0;
    let rrRemovedCount = 0;

    function removeMain(node) {
        let rerunCards = $(node).find(".stream-type-indicator--rerun");
        if (rerunCards.length) {
            rerunCards.each(function(i, v) {
                findAndRemoveCard(v);
                console.log("Rerun Indicator Card Removed #" + ++rerunTagCount);
            });
        }

        $(node).find("h3").filter(function(i, v) {
            if(testAndRemove(rrTitleRegex, v)) {
                return;
            }
            if(testAndRemove(rerunTitleRegex, v)) {
                return;
            }
            if(testAndRemove(rrCursiveTitleRegex, v)) {
                return;
            }
        });
    }

    function testAndRemove(re, v) {
        let match = re.test(v.textContent);
            if(match) {
                findAndRemoveCard(v);
                console.log("Rerun Title Card Removed #" + ++rrRemovedCount + ": " + v.textContent);
                return true;
            }
        return false;
    }

    function findAndRemoveCard(n) {
        // New hotness (maybe?)
        let card = $(n).closest('[style*="order"]');
        if (typeof(card) !== "undefined") {
            if (card.length > 0) {
                card.remove();
                return;
            }
        }

        card = $(n).closest('.tw-transition');
        if (typeof(card) !== "undefined") {
            if (card.length > 0) {
                card.remove();
                return;
            }
        }

        // Old method that might still work sometimes...
        card = $(n).closest(".tw-mg-b-2");
        if (typeof(card) !== "undefined") {
            if (card.parent(".tw-flex-wrap").length > 0) {
                card.remove();
            } else if (card.parent("[data-target]").length > 0) {
                card.parent().remove();
            } else if (card.parent()[0].classList.length === 0) {
                card.remove();
            } else {
                debugger;
            }
            return;
        }
    }

    $(document).ready(function() {
        var rootNode = document.getElementById('root');

        if(rootNode) {
            var config = { childList: true, subtree: true };
            var callback = function(mutationsList) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for(let node of mutation.addedNodes) {
                            removeMain(node);
                        }
                    }
                }
            };
            var observer = new MutationObserver(callback);
            observer.observe(rootNode, config);
            console.log('Observer deployed.');
        }
    });
})();