// ==UserScript==
// @name         Destiny.gg Black Tag Font Modifier
// @namespace    https://destiny.gg/
// @version      1.0
// @description  Change font of black-tagged messages to Times New Roman on destiny.gg
// @author       Rasmus
// @match        https://www.destiny.gg/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542748/Destinygg%20Black%20Tag%20Font%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/542748/Destinygg%20Black%20Tag%20Font%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .msg-tagged-black {
            font-family: 'Comic Sans MS', bold, sans-serif !important;
        }
    `);
})();
