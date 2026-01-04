// ==UserScript==
// @name         Eudic AD Remover
// @namespace    http://tampermonkey.net/
// @version      2024-12-29.1
// @description  try to remove the AD from the Eudic dictionary page
// @author       Tex
// @match        https://dict.eudic.net/dicts/en/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eudic.net
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519434/Eudic%20AD%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/519434/Eudic%20AD%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('div#bodycontent > div:nth-child(5) { display: none; }');
    GM_addStyle('div#bodycontent { padding: 0 20px; }');
})();