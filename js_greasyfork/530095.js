// ==UserScript==
// @name         British Converter
// @match        *://*.uk/*
// @match        *://*.co.uk/*
// @description  Replaces 'cookie' with 'biscuit' on UK sites
// @version      0.2
// @grant        none
// @namespace    https://elouan.xyz/biscuit
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530095/British%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/530095/British%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetWord = 'cookie';
    const replacementText = 'biscuit';

    const hostname = window.location.hostname;

    function replaceText(node) {
        if (node.nodeType === 3) {
            const regex = new RegExp(targetWord, 'gi');
            node.nodeValue = node.nodeValue.replace(regex, replacementText);
        } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceText(node.childNodes[i]);
            }
        }
    }

    if (hostname.includes(".uk")) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    replaceText(mutation.addedNodes[i]);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        document.addEventListener('DOMContentLoaded', () => {
            replaceText(document.body);
        });

        replaceText(document.body);
    }
})();