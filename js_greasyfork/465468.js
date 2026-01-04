// ==UserScript==
// @name         Don't Fade My Tree Background, Ancestry!
// @namespace    http://www.ancestry.com
// @version      0.11
// @description  Undoes a recent, moronic change to the Ancestry UI
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
// @downloadURL https://update.greasyfork.org/scripts/465468/Don%27t%20Fade%20My%20Tree%20Background%2C%20Ancestry%21.user.js
// @updateURL https://update.greasyfork.org/scripts/465468/Don%27t%20Fade%20My%20Tree%20Background%2C%20Ancestry%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
    .trGraphFaded {
        opacity: unset !important;
    }
` );

})();