// ==UserScript==
// @name         gidonline CSS
// @namespace    gidonline
// @version      0.1
// @description  Hides some ADs and unused elements
// @author       Anton
// @match        https://gidonline.xyz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445169/gidonline%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/445169/gidonline%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle([
    '#backim { display: none; }',
    '#headerline { display: none; }'
    ].join(' '));
})();