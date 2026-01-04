// ==UserScript==
// @name         Disable Supply Pack Gambling
// @namespace    http://tampermonkey.net/
// @version      2025-06-04
// @license      MIT
// @description  Remove the use button from supply packs in your inventory.
// @author       NichtGersti [3380912]
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538306/Disable%20Supply%20Pack%20Gambling.user.js
// @updateURL https://update.greasyfork.org/scripts/538306/Disable%20Supply%20Pack%20Gambling.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.insertAdjacentHTML("beforeend", `<style>.supply-pck-items [data-sort]:not([data-sort*='Parcel'],[data-sort*='Present']) .next-act { display:none !important; }</style>`);
})();