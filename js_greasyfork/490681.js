// ==UserScript==
// @name         Удаление отзывов с маркета
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove market_block_reviews from lzt.market
// @author       steamuser
// @match        https://lzt.market/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490681/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D0%BE%D0%B2%20%D1%81%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490681/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D0%BE%D0%B2%20%D1%81%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var checkExist = setInterval(function() {
        var feedbackElement = document.getElementById('feedback-all');
        if (feedbackElement) {
            feedbackElement.parentNode.removeChild(feedbackElement);
            clearInterval(checkExist);
        }
    }, 1); // checks every 500ms
})();
