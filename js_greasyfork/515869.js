// ==UserScript==
// @name         Remove Anonymous Checkboxes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes anonymous listing checkboxes
// @author       Weav3r
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @downloadURL https://update.greasyfork.org/scripts/515869/Remove%20Anonymous%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/515869/Remove%20Anonymous%20Checkboxes.meta.js
// ==/UserScript==

(() => {
    const removeCheckboxes = () => 
        Array.from(document.getElementsByClassName('checkboxWrapper___YnT5u'))
            .forEach(el => el.remove());

    removeCheckboxes();
    new MutationObserver(removeCheckboxes).observe(document.body, {
        childList: true,
        subtree: true
    });
})();