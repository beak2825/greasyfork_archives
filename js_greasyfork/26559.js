// ==UserScript==
// @name         Aliexpress URL Cleaner
// @version      0.4
// @description  Removes unnecessary parameters from Aliexpress URLs
// @match        *://*.aliexpress.com/*
// @namespace    https://greasyfork.org/users/168
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/26559/Aliexpress%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/26559/Aliexpress%20URL%20Cleaner.meta.js
// ==/UserScript==


function whenReady() {
    return new Promise((resolve) => {
        function completed() {
            document.removeEventListener('DOMContentLoaded', completed);
            window.removeEventListener('load', completed);
            resolve();
        }

        if (document.readyState === 'complete'
            || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', completed);
            window.addEventListener('load', completed);
        }
    });
}


whenReady().then(() => {

    let reg = /((?:https?:)?\/\/(?:\w+\.)?aliexpress\.com\/(?:store\/product\/[^\/]+\/[0-9_]+|item\/(?:[^\/]+\/)?[0-9_]+)\.html)(\?[^#\r\n]+)?(#.+)?/i;

    function toCanonical(original) {
        let match = original.match(reg);
        if (match) {
            return match[1] + (match[3] || '');
        }
        return null;
    }


    // For current tab URL.
    let canonical = toCanonical(window.location.href);
    if (!canonical) {
        let link = document.querySelector('head > link[rel=canonical]');
        if (link) {
            canonical = toCanonical(link.href + window.location.hash);
        }
    }
    if (canonical) {
        window.history.replaceState(history.state, document.title, canonical);
    }


    // For static html links.
    document.querySelectorAll('a').forEach((e) => {
        let canonical = toCanonical(e.href);
        if (canonical) {
            e.href = canonical;
        }
    });


    // For lazy-loaded links.
    let observer = new MutationObserver(function (mutationsList) {
        for (let i = 0; i < mutationsList.length; i++) {
            const mutation = mutationsList[i];
            const addedNodes = mutation.addedNodes;
            for (let j = 0; j < addedNodes.length; j++) {
                cleanAndTraverse(addedNodes[j]);
            }
            if (mutation.type === 'attributes') {
                cleanNodeHref(mutation.target)
            }
        }
    });

    function cleanAndTraverse(root) {
        cleanNodeHref(root);
        let children = root.children;
        if (children) {
            for (let k = 0; k < children.length; k++) {
                cleanAndTraverse(children[k]);
            }
        }
    }

    function cleanNodeHref(elem) {
        if (elem.tagName === 'A') {
            const original = elem.href;
            const canonical = toCanonical(elem.href);
            if (canonical && original !== canonical) {
                elem.href = canonical;
            }
        }
    }

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
    });
});