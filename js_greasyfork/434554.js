// ==UserScript==
// @name         Remove Exchange Button
// @namespace    heasleys.halloween
// @version      1.0
// @description  Remove the Exchange button on Halloween Basket so you don't accidently click it
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434554/Remove%20Exchange%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/434554/Remove%20Exchange%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {
        if ($(".exchange-action").length > 0) {
            $(".exchange-action").remove();
        }
    });
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
})();