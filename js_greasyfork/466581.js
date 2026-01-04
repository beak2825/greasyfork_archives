// ==UserScript==
// @name         RCD-Torn
// @namespace    **Imperatriz[2683794]**
// @version      1.0
// @description  Remove Crimes Description Torn
// @match        https://www.torn.com/crimes.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466581/RCD-Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/466581/RCD-Torn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const eeh_observer = new MutationObserver(function(mutations) {
    if (!typeof jQuery) {
        return;
    }

    var ulElement = document.querySelector('ul.desc.info.t-blue-cont.h');
    if (ulElement) {
        ulElement.parentNode.removeChild(ulElement);
    }
});

eeh_observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

})();
