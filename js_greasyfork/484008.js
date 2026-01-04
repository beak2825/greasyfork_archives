
// ==UserScript==
// @name         /r/manga cubari
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  Adds basic cubari redirect button
// @author       ZackMapleStory
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484008/rmanga%20cubari.user.js
// @updateURL https://update.greasyfork.org/scripts/484008/rmanga%20cubari.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function handleNewItems(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                try{
                    const currentNode = mutation.addedNodes["0"];
                    if (currentNode.tagName.toLowerCase() == "img") {
                        const parentNode = currentNode.closest('div[data-testid]');
                        if (parentNode.querySelector('#cubariRedirect') == null) {
                            let btn = document.createElement("BUTTON");
                            let text = document.createTextNode("View on Cubari");
                            btn.id = 'cubariRedirect';
                            btn.appendChild(text);
                            btn.onclick = () => {
                                const parentId = parentNode.id.split('_')[1]
                                window.open('https://cubari.moe/read/reddit/' + parentId + '/1/1/')
                            }
                            parentNode.appendChild(btn);
                        }
                    }
                }
                catch(e){
                }
            }
        }
    }

    const observerOptions = {
        childList: true,
        subtree: true,
    };

    const observer = new MutationObserver(handleNewItems);
    observer.observe(document.body, observerOptions);
}) ();