// ==UserScript==
// @name         Amazon-Ranking-Laplace
// @namespace    http://github.com/ArmanJR
// @version      0.1
// @description  Re-calculating Amazon ranks based on Laplace's rule of succession
// @author       Arman
// @match        https://www.amazon.com/*/dp/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443773/Amazon-Ranking-Laplace.user.js
// @updateURL https://update.greasyfork.org/scripts/443773/Amazon-Ranking-Laplace.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            var xpath = '//*[@id="acrPopover"]/span[1]/a/i[1]/span';
            var ratingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var rating = parseFloat(ratingElement.innerHTML.split("o")[0]);
            var xpath2 = '//*[@id="acrCustomerReviewText"]';
            var numElement = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var num = parseFloat(numElement.innerHTML.replace(',', '').split("r")[0]);var first = rating + (5 - rating) / (num + 1);
            var second = first + (1 - first) / (num + 2);
            document.querySelector('#averageCustomerReviews').innerHTML += ' &nbsp;<span style="color:red;">' + second.toString().substr(0, 4) + ' ';
        }
    }
})();