// ==UserScript==
// @name         Autodarts shared board script
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto remove board user and auto 'use my board' on every user that joins
// @author       Senne
// @match        *//:autodarts.io/lobbies/*
// @match        *autodarts.io/lobbies/*
// @match        *autodarts.io/*
// @match        *play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/488372/Autodarts%20shared%20board%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/488372/Autodarts%20shared%20board%20script.meta.js
// ==/UserScript==

const username = "TEAL";

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

    if (node.classList !== undefined) {
        if (node.classList.value === "chakra-card css-9w33n0") {
            console.log(node.classList.value);
            var elements = node.getElementsByClassName("chakra-table css-5605sr");
            if (elements.length === 1) {
                var rows = elements[0].getElementsByClassName("css-0");
                Array.from(rows).forEach(row => deleteUser(row));
            }
        }
        else if (node.classList.value === "css-0") {
            deleteUser(node);
        }
    }
}

function deleteUser(node) {
    if (node.childNodes.length === 0) {
        return;
    }
    var name = node.getElementsByClassName("ad-ext-player-name")
    if (name.length === 0 || name == undefined) {
        return;
    }
    var nameNode = name[0].childNodes[0].childNodes[0].data;
    if (nameNode === username) {
        var deleteButtons = node.getElementsByClassName("chakra-button css-8zte6d");
        if (deleteButtons.length === 1) {
            deleteButtons[0].click();
        }
        else {
            deleteButtons = node.getElementsByClassName("chakra-button css-22xpxh");
            if (deleteButtons.length === 1) {
                deleteButtons[0].click();
            }
        }
    }
    else {
        var useBoard = node.getElementsByClassName("chakra-button css-1e89954");
        if (useBoard.length === 1) {
            useBoard[0].click();
        }
        else {
            useBoard = node.getElementsByClassName("chakra-button css-1wtemij");
            if (useBoard.length === 1) {
                useBoard[0].click();
            }
        }
    }
}