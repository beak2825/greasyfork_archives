// ==UserScript==
// @name         notion width
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  makes equation inputs wide
// @author       TechnoStrife
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?domain=notion.so
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439634/notion%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/439634/notion%20width.meta.js
// ==/UserScript==

css(`.W-I-D-E {
    width: calc(100vw - 2 * 96px - 24px) !important;
}
.W-I-D-E > div > div {
    width: 100% !important;
}`);

(function() {
    'use strict';

    let target = document.querySelector('.notion-overlay-container.notion-default-overlay-container')
    const observer = new MutationObserver(function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.addedNodes.length != 0) {
                let node = mutation.target.querySelector('div[contenteditable="true"][placeholder="E = mc^2"], div[contenteditable="true"][placeholder^="|x| = "]')
                if (node !== null) {
                    node.parentElement.parentElement.parentElement.parentElement.classList.add('W-I-D-E')
                }
            }
        }
    })
    observer.observe(target, { childList: true, subtree: true })
})();

function css(text) {
    let elem = document.createElement('style')
    elem.innerText = text
    document.head.append(elem)
}