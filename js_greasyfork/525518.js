// ==UserScript==
// @name         334cratch
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  ChatGPTで生成しました。Scratch上の数字を334にします。
// @author       334nfz.
// @match        *://scratch.mit.edu/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525518/334cratch.user.js
// @updateURL https://update.greasyfork.org/scripts/525518/334cratch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const numberRegex = /[\d０-９]+|一|二|三|四|五|六|七|八|九|十|百|千|万|億|兆|京|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|trillion|quadrillion|ｏｎｅ|ｔｗｏ|ｔｈｒｅｅ|ｆｏｕｒ|ｆｉｖｅ|ｓｉｘ|ｓｅｖｅｎ|ｅｉｇｈｔ|ｎｉｎｅ|ｔｅｎ|ｅｌｅｖｅｎ|ｔｗｅｌｖｅ|ｔｈｉｒｔｅｅｎ|ｆｏｕｒｔｅｅｎ|ｆｉｆｔｅｅｎ|ｓｉｘｔｅｅｎ|ｓｅｖｅｎｔｅｅｎ|ｅｉｇｈｔｅｅｎ|ｎｉｎｅｔｅｅｎ|ｔｗｅｎｔｙ|ｔｈｉｒｔｙ|ｆｏｒｔｙ|ｆｉｆｔｙ|ｓｉｘｔｙ|ｓｅｖｅｎｔｙ|ｅｉｇｈｔｙ|ｎｉｎｅｔｙ|ｈｕｎｄｒｅｄ|ｔｈｏｕｓａｎｄ|ｍｉｌｌｉｏｎ|ｂｉｌｌｉｏｎ|ｔｒｉｌｌｉｏｎ|ｑｕａｄｒｉｌｌｉｏｎ/gi;

    function replaceNumbers(node) {
        if (node.nodeType === 3) { // テキストノードのみ対象
            node.nodeValue = node.nodeValue.replace(numberRegex, '334');
        } else if (node.nodeType === 1 && node.childNodes) {
            node.childNodes.forEach(replaceNumbers);
        }
    }

    function observeChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(replaceNumbers);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function interceptUserInput() {
        document.addEventListener('input', event => {
            if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
                let inputText = event.target.value;
                let matches = inputText.match(numberRegex);
                if (matches) {
                    let replacement = '334'.repeat(matches.length);
                    event.target.value = inputText.replace(numberRegex, replacement);
                }
            }
        });
    }

    replaceNumbers(document.body);
    observeChanges();
    interceptUserInput();
})();
