// ==UserScript==
// @name         Only Illegal Aliens
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Replaces leftist terminology with "illegal alien" on all websites
// @author       adamlproductions
// @match        *://*
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533978/Only%20Illegal%20Aliens.user.js
// @updateURL https://update.greasyfork.org/scripts/533978/Only%20Illegal%20Aliens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const phrases = [
        'illegal migrant',
        'undocumented immigrant',
        'illegal immigrant',
        'undocumented person',
        'unauthorized migrant',
        'non-citizen',
        'noncitizen',
        'unauthorized immigrant',
        'migrant',
        'undocumented'
    ];

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const regex = new RegExp(
        phrases.map(phrase => `\\b${escapeRegex(phrase)}(s?)\\b`).join('|'),
        'gi'
    );

    function isEditableElement(node) {
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                if (tagName === 'input' || tagName === 'textarea') {
                    return true;
                }
                if (node.hasAttribute('contenteditable') && node.getAttribute('contenteditable') !== 'false') {
                    return true;
                }
            }
            node = node.parentNode;
        }
        return false;
    }

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!isEditableElement(node)) {
                let text = node.textContent;
                text = text.replace(regex, (match, ...groups) => {
                    const pluralIndicator = match[match.length - 1];
                    console.log("pluralIndicator:", pluralIndicator);
                    return pluralIndicator === 's' ? 'illegal aliens*' : 'illegal alien*';
                });
                node.textContent = text;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            if (tagName !== 'script' && tagName !== 'style' && tagName !== 'input' && tagName !== 'textarea' && !node.hasAttribute('contenteditable')) {
                for (let child of node.childNodes) {
                    replaceText(child);
                }
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                replaceText(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    replaceText(document.body);
})();