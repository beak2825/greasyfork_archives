// ==UserScript==
// @name         MathML Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button that copies MathML code to the clipboard.
// @author       Remakker
// @match        https://p2t.breezedeus.com/*
// @grant        GM_setClipboard
// @licence     MIT
// @downloadURL https://update.greasyfork.org/scripts/527225/MathML%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527225/MathML%20Copy%20Button.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const copyMathML = () => {
        const inputElement = document.querySelector('mjx-assistive-mml');
        if (!inputElement) return console.error("Cannot find the element containing MathML code!");
        GM_setClipboard(inputElement.innerHTML);
    };

    const applyStylesFromCSSRule = (targetElem, selector) => {
        Array.from(document.styleSheets).forEach(sheet => {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch (e) {
                return;
            }
            if (!rules) return;
            Array.from(rules).forEach(rule => {
                if (rule.type === CSSRule.STYLE_RULE && rule.selectorText === selector) {
                    for (let i = 0; i < rule.style.length; i++) {
                        const propertyName = rule.style[i];
                        const value = rule.style.getPropertyValue(propertyName);
                        const priority = rule.style.getPropertyPriority(propertyName);
                        targetElem.style.setProperty(propertyName, value, priority);
                    }
                }
            });
        });
    };

    const addCopyButton = () => {
        const originalButton = document.querySelector('#copyAsin');
        const newContainer = document.querySelector('#box');
        if (!originalButton || !newContainer) return console.error('Required element(s) not found');
        const newButton = originalButton.cloneNode(true);
        newButton.id = 'newButton';
        newButton.removeAttribute('data-clipboard-text');
        newButton.addEventListener("click", copyMathML);
        const specificSelector = ".Index_indexBox__s5lfQ .Index_index__GsKUn .Index_content__IDt4D > .Index_textAreaBox__ne32- .Index_copy__k5Mir";
        applyStylesFromCSSRule(newButton, specificSelector);
        newContainer.appendChild(newButton);
    };

    window.addEventListener('load', addCopyButton);
})();
