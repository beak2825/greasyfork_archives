// ==UserScript==
// @name        🦅Long live president Camacho🦅
// @namespace   StephenP
// @match       https://www.whitehouse.gov/*
// @match       http://www.whitehouse.gov/*
// @match       https://*.gov/*
// @match       http://*.gov/*
// @version     1.0
// @author      StephenP
// @license     MIT
// @description We're in 2515 and the USA president is Dwayne Elizondo Mountain Dew Herbert Camacho. The script corrects the american government sites that still show Trump as the current president with Camacho.
// @downloadURL https://update.greasyfork.org/scripts/527855/%F0%9F%A6%85Long%20live%20president%20Camacho%F0%9F%A6%85.user.js
// @updateURL https://update.greasyfork.org/scripts/527855/%F0%9F%A6%85Long%20live%20president%20Camacho%F0%9F%A6%85.meta.js
// ==/UserScript==
/*
  Original script by JoinSummer (https://greasyfork.org/users/907515-joinsummer)
  Original script page: https://greasyfork.org/scripts/495283
*/
(function() {
    'use strict';

    const replacements = new Map([
        ['Donald Trump', 'Dwayne Camacho'],
        ['Donald J. Trump', 'Dwayne Elizondo Mountain Dew Herbert Camacho'],
        ['Trump', 'Camacho'],
    ]);


    function replaceText(node) {
      console.log(node.nodeType,node.nodeValue)
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            replacements.forEach((value, key) => {
                const regex = new RegExp(key, 'g');
                text = text.replace(regex, value);
            });
            node.nodeValue = text;
        } else {
            node.childNodes.forEach(replaceText);
        }
    }

    replaceText(document.body);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                replaceText(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

