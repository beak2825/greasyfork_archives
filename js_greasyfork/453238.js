// ==UserScript==
// @name         KameSame Tae Kim Vocab Filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds filter for Tae Kim Vocab from his Grammar Guide
// @author       Timberpile
// @match        http*://www.kamesame.com/app/lessons
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/453238/KameSame%20Tae%20Kim%20Vocab%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/453238/KameSame%20Tae%20Kim%20Vocab%20Filter.meta.js
// ==/UserScript==

(() => {
    'use strict';

    setTimeout(() => {
        const word_dump = document.querySelector('.word-dump');
        if (word_dump) {
            const input = document.createElement('textarea');
            input.style = "width:100%;";
            input.placeholder = "Tae Kim Vocabs Input"
            word_dump.before(input);

            input.onchange = (value) => {
                const result = [];

                // "\u3040-\u30ff\uff66-\uff9f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff" ... A Japanese Character
                const matches = input.value.matchAll(/([\u3040-\u30ff\uff66-\uff9f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+)\s?(?:【[\u3040-\u30ff\uff66-\uff9f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+】)?\s?-/gm);

                for (const match of matches) {
                    result.push(match[1])
                }

                word_dump.value = result
            };
        }
    }, 2000);

})();