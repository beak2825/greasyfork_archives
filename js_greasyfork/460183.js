// ==UserScript==
// @name         eslint-rules-obvious
// @version      0.1
// @author       Finn
// @description  Obviously show correct and incorrect rules demo.
// @namespace    https://github.com/Germxu
// @match        https://eslint.org/*/rules/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eslint.org
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @compatible   Chrome Latest
// @compatible   Firefox Latest
// @downloadURL https://update.greasyfork.org/scripts/460183/eslint-rules-obvious.user.js
// @updateURL https://update.greasyfork.org/scripts/460183/eslint-rules-obvious.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const eslint_style = `
    div.incorrect pre{
       background: darkred!important;
    }
    div.correct pre{
       background: darkgreen!important;
    }
    `
GM_addStyle(eslint_style)
})();