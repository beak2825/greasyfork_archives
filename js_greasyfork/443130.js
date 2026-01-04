// ==UserScript==
// @name         Codeforces-Hide-Problem-Tags
// @namespace    http://github.com/armanjr/Codeforces-Hide-Problem-Tags
// @version      0.2
// @description  Hide problem tags to avoid spoiling solutions
// @author       ArmanJR
// @match        https://codeforces.com/problemset*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443130/Codeforces-Hide-Problem-Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/443130/Codeforces-Hide-Problem-Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var getUrl = window.location;
    if (getUrl.pathname.split('/')[2] == 'problem') {
        var xpath = "//div[contains(text(),'Problem tags')]";
        var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        matchingElement.parentElement.style.display = 'none';
    }
    else {
        const collection = document.getElementsByClassName('id');
        for (let i = 0; i < collection.length; i++) {
            collection[i].nextElementSibling.children[1].style.display = 'none';
        }
    }
})();