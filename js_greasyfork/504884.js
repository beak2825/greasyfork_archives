// ==UserScript==
// @name         WME and LastPass Conflict Fixer
// @namespace    http://tampermonkey.net/
// @version      2024.08.24.1
// @description  Resolves conflicts between Waze Map Editor and LastPass.
// @author       SkyviewGuru
// @match        https://www.waze.com/*/editor?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504884/WME%20and%20LastPass%20Conflict%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/504884/WME%20and%20LastPass%20Conflict%20Fixer.meta.js
// ==/UserScript==

/* global $ */
(function() {
    'use strict';
    let total = 0;
    let conflictFixer = setInterval(function() {
        // Issue #1 - Elements with a disabled="false" attribute.
        // Explanation: The "disabled" attribute is deprecated, and is actually supposed to be a property. When used as an
        // attribute, it is always "true" whether set to anything or nothing. Evidently browsers generally do not necessarily
        // treat the element as disabled when set to false, but LastPass tries to enforce the HTML spec and locks up the
        // 'disabled="false"' element. This will scan for any matching elements and removes the inappropriate attribute use
        // from the elements, which in turn, keeps LastPass from trying to enforce the disabled state.

        // Track how many elements were found.
        let elements = $('[disabled="false"]').removeAttr('disabled').length;
        // Increment the total accordingly.
        total += elements;
        // If new elements were found, log the findings to the console.
        if(elements) console.warn(
            `[WME and LastPass Conflict Fixer] Fixed ${elements}${elements<total?' more ':' '}`+
            `element${elements>1?'s':''}${elements<total?`, for a total of ${total}`:''}.`
        );
    },25);
})();