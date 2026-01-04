// ==UserScript==
// @name         Audible Search Helper
// @namespace    rocka84.audible-search-helper
// @version      0.1
// @description  Audible Search addons
// @author       rocka84
// @match        https://www.audible.de/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370543/Audible%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370543/Audible%20Search%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseResults(resultNodes) {
        var results = [];
        resultNodes.forEach(function(result) { results.push(parseResultNode(result)) });
        return results;
    }

    function parseResultNode(node) {
        var result = {};
        result.node = node;
        result.name = node.querySelector('.bc-heading').innerText;
        result.price = parseFloat(node.querySelector('.adblBuyBoxPrice').innerText.replace(/.*: /,'').replace(',','.'));
        //console.log(result.name, result.price);
        return result;
    }

    function sortResults(results) {
        return results.sort(sortByPrice);
    }

    function sortByPrice(resultA, resultB) {
        if (resultA.price == resultB.price) return 0;
        return resultA.price > resultB.price ? 1 : -1;
    }

    function sortNodes(results) {
        results.forEach(function(result) {
            result.node.parentNode.appendChild(result.node);
        });
    }

    var results = parseResults(document.querySelectorAll('.productListItem')),
        sortedResults = sortResults(results)

    sortNodes(sortedResults);


})();