// ==UserScript==
// @name         Hide Ad Panel in Outlook.com
// @namespace    http://prantlf.tk/
// @version      0.2
// @description  Hides the right sidebar with ads and stretches the e-mail body to take its place. Enable the beta version of Outlook!
// @author       prantlf@gmail.com
// @match        https://outlook.live.com/mail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29849/Hide%20Ad%20Panel%20in%20Outlookcom.user.js
// @updateURL https://update.greasyfork.org/scripts/29849/Hide%20Ad%20Panel%20in%20Outlookcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer;

    function removeAds(node) {
        console.log('[Hide Ad Panel in Hotmail] Hiding the ad panel.');
        var i = 3;
        while (i-- > 0) {
            node = node.parentElement;
            if (!node || node.tagName !== 'DIV') {
                console.log('[Hide Ad Panel in Hotmail] HTML structure does not match. Aborting.');
                observer.disconnect();
                return;
            }
        }
        node.style.display = 'none';
        observer.disconnect();
    }

    function checkNode(node) {
        var child;
        if (node instanceof HTMLElement && node.tagName === 'A' &&
            node.href === 'https://windows.microsoft.com/outlook/ad-free-outlook' &&
            node.parentElement && node.parentElement.tagName === 'SPAN') {
            removeAds(node.parentElement);
        }
    }

    function checkNodes(nodes) {
        var i, count, node, children, j, count2;
        if (nodes) {
            for (i = 0, count = nodes.length; i < count; ++i) {
                node = nodes[i];
                checkNode(node);
                if (node.querySelectorAll) {
                    children = node.querySelectorAll('a[target=_blank]');
                    for (j = 0, count2 = children.length; j < count2; ++j) {
                        checkNode(children[j]);
                    }
                }
            }
        }
    }

    observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var addedNodes = mutation.addedNodes,
                target = mutation.target;
            checkNodes(addedNodes);
            if (target) {
                checkNode(target);
            }
        });
    });

    var nodes = document;
    checkNodes(nodes);

    console.info('[Hide Ad Panel in Hotmail] Listenning to page changes.');
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();