// ==UserScript==
// @name         Codeforces Verdict Hidden Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  The tool show codeforces submission status without which test case. For competitors practicing for the domjudge environment.
// @license      MIT
// @author       jakao
// @match        https://codeforces.com/*
// @icon         https://i.imgur.com/ldVBpM1.jpeg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505442/Codeforces%20Verdict%20Hidden%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/505442/Codeforces%20Verdict%20Hidden%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeOnTest() {
        console.log('?!?');
        let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            let textContent = node.nodeValue;
            let index = textContent.indexOf(' on test');

            if (index !== -1) {
                node.nodeValue = textContent.substring(0, index);
                nextNode = walker.nextNode();
                nextNode.nodeValue = "";
            }
            else{
                pretestIndex = textContent.indexOf(' on pretest');
                if (pretestIndex !== -1) {
                    node.nodeValue = textContent.substring(0, pretestIndex);
                    nextNode = walker.nextNode();
                    nextNode.nodeValue = "";
                }
            }
        }
        console.log('???');
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                removeOnTest();
            }
        });
    });
    console.log('!!!');

    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };

    removeOnTest();

    observer.observe(document.body, observerConfig);
})();