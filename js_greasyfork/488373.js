// ==UserScript==
// @name         Autodarts reorganize input buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Reorganize the input buttons from 1 till 20 
// @author       Senne
// @match        *//:autodarts.io/lobbies/*
// @match        *autodarts.io/lobbies/*
// @match        *autodarts.io/*
// @match        *play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/488373/Autodarts%20reorganize%20input%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/488373/Autodarts%20reorganize%20input%20buttons.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = {
    childList: true, attributes: true,
    subtree: true, attributeFilter: ['class']
};

myObserver.observe(document, obsConfig);

function mutationHandler(mutationRecords) {

    mutationRecords.forEach(function (mutation) {

        if (mutation.type == "childList" &&
        typeof mutation.addedNodes == "object" &&
        mutation.addedNodes.length
        ) {
            for (var J = 0, L = mutation.addedNodes.length; J < L; ++J) {
                checkForCSS_Class(mutation.addedNodes[J]);
            }
        }
        else if (mutation.type == "attributes") {
            checkForCSS_Class(mutation.target);
        }
    });
}
function checkForCSS_Class(node) {
    //-- Only process element nodes
    if (node.classList.value === "chakra-stack css-ul22ge" || node.classList.value === "chakra-stack css-oyptjf" || node.classList.value === "css-8uwqda") {
        console.log(node.classList.value);
        var elements = node.getElementsByClassName("css-10pg9sb");
        Array.from(elements).forEach(row => reverse(row));
    }
}

function reverse(node) {
    var divs = node.children;
    var i = divs.length - 1;

    for (; i--;) {
        node.appendChild(divs[i])
    }
}