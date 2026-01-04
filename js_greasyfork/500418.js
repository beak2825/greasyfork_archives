// ==UserScript==
// @name         PixelDrain Bypass URLs Globally
// @namespace    SWScripts
// @version      v1.5
// @description  Convert all Original Pixeldrain Links to pd for Bypassing in any Page even Linked Buttons.
// @grant        none
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/500418/PixelDrain%20Bypass%20URLs%20Globally.user.js
// @updateURL https://update.greasyfork.org/scripts/500418/PixelDrain%20Bypass%20URLs%20Globally.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PIXELDRAIN_URL = /https?:\/\/(www\.)?pixeldrain\.com\/u\/(.*?)/g;
    const REPLACEMENT_URL = 'https://pd.cybar.xyz/';

    let enableRedirect = GM_getValue('enableRedirect', true);
    let enableTextReplacement = GM_getValue('enableTextReplacement', true);

    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE && enableTextReplacement) {
            if (PIXELDRAIN_URL.test(node.textContent)) {
                node.textContent = node.textContent.replace(PIXELDRAIN_URL, (match, p1, p2) => {
                    return REPLACEMENT_URL + p2;
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceTextInNode);

            if (node.tagName === 'A' && node.href && enableTextReplacement && PIXELDRAIN_URL.test(node.href)) {
                node.href = node.href.replace(PIXELDRAIN_URL, (match, p1, p2) => REPLACEMENT_URL + p2);
            }
        }
    }

    function checkAndReplaceText() {
        if (enableTextReplacement) {
            replaceTextInNode(document.body);
        }
    }

    function handleMutations(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    replaceTextInNode(node);
                });
            }
        });
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(handleMutations);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function checkIfPixeldrainRedirect() {
        if (enableRedirect) {
            const currentUrl = window.location.href;
            if (PIXELDRAIN_URL.test(currentUrl) && /\/u\//.test(currentUrl)) {
                window.location.href = currentUrl.replace(PIXELDRAIN_URL, (match, p1, p2) => REPLACEMENT_URL + p2);
            }
        }
    }

    GM_registerMenuCommand("Redirect PixelDrain Page (Currently " + (enableRedirect ? "Enabled" : "Disabled") + ")", () => {
        enableRedirect = !enableRedirect;
        GM_setValue('enableRedirect', enableRedirect);
        alert("Redirect is now " + (enableRedirect ? "Enabled" : "Disabled"));
    });

    GM_registerMenuCommand("Links Replacement (Currently " + (enableTextReplacement ? "Enabled" : "Disabled") + ")", () => {
        enableTextReplacement = !enableTextReplacement;
        GM_setValue('enableTextReplacement', enableTextReplacement);
        alert("Text Replacement is now " + (enableTextReplacement ? "Enabled" : "Disabled"));
    });

    document.addEventListener('DOMContentLoaded', function() {
        checkIfPixeldrainRedirect();
        checkAndReplaceText();
        observeDOMChanges();
    });

    setInterval(checkAndReplaceText, 1000);
})();

