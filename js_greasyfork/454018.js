// ==UserScript==
// @name         FascistDownvoterForReddit
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Down votes ukranian fascists on Reddit
// @author       APoreshaev
// @license MIT
// @match        https://www.reddit.com/r/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png
// @homepageURL  https://greasyfork.org/scripts/454018-fascistdownvoterforreddit/code/FascistDownvoterForReddit.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454018/FascistDownvoterForReddit.user.js
// @updateURL https://update.greasyfork.org/scripts/454018/FascistDownvoterForReddit.meta.js
// ==/UserScript==

/*
Anti-Fascist script for reddit

"Slava Ukraini" is a salute of Ukrainian nationalists. This script will down vote all posts that contains this phrase.

We are against the war, but it doesn't mean we should support the fascists.
*/
(function() {
    'use strict';
    console.log('FascistDownvoterForReddit has started');
    const fascistPattern = /(slava ukr)|(hero[iy]?am slava)|(героям слава)|(слава укра[иї]?ин)|(glory to ukrain)/gi;
    function downvoteFascists(document) {
        // for comments
        [...document.querySelectorAll('[data-testid=comment], [data-testid=post-comment-header]')]
            .filter((elm) => elm.innerText.match(fascistPattern))
            .forEach((fascistComment) => {
            const fascistName = fascistComment.parentElement.querySelector('a[data-testid=comment_author_link]');
            console.log(`a fascist has been found ${fascistName}`);
            fascistComment.parentElement.querySelectorAll('button[aria-label=downvote][aria-pressed=false]')
                .forEach((btn) => {
                console.log(`downvoting a fascist ${fascistName}`);
                btn.click();
            });
        });

        // for posts
        [...document.querySelectorAll('[data-testid=post-container]')]
            .filter((elm) => elm.innerText.match(fascistPattern))
            .forEach((fascistPost) => {
            const fascistTitle = fascistPost.querySelector('h3');
            console.log(`a fascist's post has been found "${fascistTitle.innerText}"`);
            fascistPost.querySelectorAll('button[aria-label=downvote][aria-pressed=false]')
                .forEach((btn) => {
                console.log(`downvoting the fascist's post`);
                btn.click();
            })
        });
    }

    var targetNode = document.body;
    if (targetNode) {
        var config = { childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    for(var node of mutation.addedNodes) {
                        if (node instanceof Element) {
                            downvoteFascists(node);
                        }
                    }
                }

            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    setTimeout(() => {
        downvoteFascists(document);
    }, 3000);

})();