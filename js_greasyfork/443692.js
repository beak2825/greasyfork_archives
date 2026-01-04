// ==UserScript==
// @name         Digikala-Rating-Laplace
// @namespace    http://github.com/ArmanJR
// @version      0.1
// @description  Re-calculating Digikala ratings based on Laplace's rule of succession
// @author       Arman and Sadaf
// @match        https://www.digikala.com/product*
// @icon         https://www.digikala.com/logo192.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443692/Digikala-Rating-Laplace.user.js
// @updateURL https://update.greasyfork.org/scripts/443692/Digikala-Rating-Laplace.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            var ratingElement = document.querySelectorAll('.InfoSection_infoSection__leftSection__wq25_ p.mr-1.text-body-2')[0];
            var rating = parseFloat(ratingElement.innerHTML.replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728)));
            var num = parseFloat(document.querySelectorAll('.InfoSection_infoSection__leftSection__wq25_ p.mr-1.text-caption.color-300')[0].innerHTML.replace('(', '').replace(')', '').replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728)));
            var first = rating + (5 - rating) / (num + 1);
            var second = first + (1 - first) / (num + 2);
            ratingElement.innerHTML += ' &nbsp;<span style="color:red;">' + second.toString().substr(0, 4).replace(/[0-9]/g, w => String.fromCharCode(w.charCodeAt(0) + 1728) ) + ' ';
        }
    }
})();