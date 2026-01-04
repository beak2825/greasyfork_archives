// ==UserScript==
// @name         Eggplant for Ancestry
// @namespace    http://www.ancestry.com
// @version      0.1.2
// @description  Once again makes available the best Ancestry tree background color ever offered, Plum.
// @author       Thadius Wynter
// @match        https://www.ancestry.com/family-tree/tree/*
// @match        https://www.ancestry.com.au/family-tree/tree/*
// @match        https://www.ancestry.co.uk/family-tree/tree/*
// @match        https://www.ancestry.ca/family-tree/tree/*
// @match        https://www.ancestry.de/family-tree/tree/*
// @match        https://www.ancestry.it/family-tree/tree/*
// @match        https://www.ancestry.fr/family-tree/tree/*
// @match        https://www.ancestry.se/family-tree/tree/*
// @match        https://www.ancestry.mx/family-tree/tree/*
// @icon64URL    https://i.imgur.com/hoNlFrW.png
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461324/Eggplant%20for%20Ancestry.user.js
// @updateURL https://update.greasyfork.org/scripts/461324/Eggplant%20for%20Ancestry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
    .bgColor1 {
        background-color: #655585 !important;
    }
` );

})();