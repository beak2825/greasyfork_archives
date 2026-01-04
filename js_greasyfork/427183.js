// ==UserScript==
// @name         Route53 Truther
// @namespace    http://offby1.net/
// @version      0.1.1
// @description  Speak truth about Route53
// @author       Chris Rose
// @include     /^https:\/\/[a-z0-9.-]*console\.aws\.amazon\.com\/.*$/
// @include     /^https:\/\/[a-z0-9.-]*console\.amazonaws\.cn\/.*$/
// @include     /^https:\/\/[a-z0-9.-]*console\.amazonaws-us-gov\.com\/.*$/
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/427183/Route53%20Truther.user.js
// @updateURL https://update.greasyfork.org/scripts/427183/Route53%20Truther.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var MutationObserver = window.MutationObserver;
    var myObserver = new MutationObserver (mutationHandler);
    var obsConfig = {
        childList: true, attributes: true,
        subtree: true, attributeFilter: ['aria-expanded']
    };

    myObserver.observe(document, obsConfig);

})();

function mutationHandler(mutationRecords) {
    mutationRecords.forEach(m => {
        if (ready(m.target.nextElementSibling)) {
            makeAMove(rightThingWrongPlace(m.target.nextElementSibling), rightPlace(m.target.nextElementSibling));
        };
    });
//    if (ready()) {
//        makeAMove(rightThingWrongPlace(), rightPlace());
//    }
}

function ready(node) {
    return node &&
        node.getElementsByClassName("ico-networking").length == 1 &&
        node.getElementsByClassName("ico-networking")[0].parentElement.parentElement.getElementsByTagName("ol").length == 1 &&
        node.getElementsByClassName("ico-database").length == 1 &&
        node.getElementsByClassName("ico-database")[0].parentElement.parentElement.getElementsByTagName("ol").length == 1;
}

function rightThingWrongPlace(node) {
    var childrenOfTheWrongKind = node.getElementsByClassName("ico-networking")[0].parentElement.parentElement.getElementsByTagName("ol")[0].childNodes;
    return Array.from(childrenOfTheWrongKind).find(e => e.textContent == "Route 53");
}

function rightPlace(node) {
    return node.getElementsByClassName("ico-database")[0].parentElement.parentElement.getElementsByTagName("ol")[0];
}

function makeAMove(theThing, thePlace) {
    if (theThing === undefined || thePlace === undefined) {
        return;
    }

    thePlace.insertBefore(theThing, thePlace.firstChild);
}