// ==UserScript==
// @name         Steam Make Collections Links
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @version      0.1
// @description  Make the list of collections into clickable links because onclick is stupid
// @author       Delmain
// @match        https://steamcommunity.com/workshop/filedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463199/Steam%20Make%20Collections%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/463199/Steam%20Make%20Collections%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAllMatches(xpath) {
        let matches = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        let nodes = [];
        let node = {};
        while(node = matches.iterateNext()) {
            nodes.push(node);
        }
        return nodes;
    }

    let xpath = "//div[@class='detailBox']//div[@class='parentCollection']";
    let nodes = getAllMatches(xpath);
    nodes.forEach(function(node) {
        let link = node.getAttribute("onclick").split("'")[1];
        let parent = node.parentElement;
        parent.removeChild(node);
        let newA = document.createElement("a");
        newA.href = link;
        newA.appendChild(node);
        parent.appendChild(newA);
    });
})();