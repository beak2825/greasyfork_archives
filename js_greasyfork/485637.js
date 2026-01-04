// ==UserScript==
// @name         Porkbun Helper
// @namespace    https://greasyfork.org/en/users/22079-hntee
// @version      2024-01-25
// @description  Remove Porkbun unavailable domains
// @description:en  Remove Porkbun unavailable domains.
// @author       hntee
// @match        https://porkbun.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485637/Porkbun%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/485637/Porkbun%20Helper.meta.js
// ==/UserScript==

var debug = false;

(function() {
    'use strict';
    // Your code here...
    window.addEventListener("load", filterBad ,false);
    observeDomChange();
})();

function observeDomChange() {
    var MutationObserver = window.MutationObserver;
    var myObserver       = new MutationObserver (mutationHandler);
    var obsConfig        = {
        childList: true, attributes: true,
        subtree: true,   attributeFilter: ['mainsrp-itemlist']
    };
    myObserver.observe (document, obsConfig);
    function mutationHandler (mutationRecords) {
        filterBad();
    }
}

function filterBad() {
    $(".unavailableDomain").parent().parent().parent().remove();

}
