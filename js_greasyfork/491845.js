// ==UserScript==
// @name         DLsite自动复制RJ号
// @version      1.01
// @description  打开DLsite的作品网址时自动复制RJ号
// @author       LC2808
// @match        https://www.dlsite.com/maniax/work/=/product_id/*
// @namespace https://greasyfork.org/users/1284881
// @downloadURL https://update.greasyfork.org/scripts/491845/DLsite%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6RJ%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/491845/DLsite%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6RJ%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;

    var regex = /\/(RJ\d+)\.html/;
    var match = currentURL.match(regex);

    if (match && match.length > 1) {
        var productCode = match[1];

        navigator.clipboard.writeText(productCode).then(function() {
            console.log('Copied RJ code to clipboard: ' + productCode);
        }, function(err) {
            console.error('Unable to copy RJ code to clipboard: ', err);
        });
    } else {
        console.log('No RJ code found in URL.');
    }
})();
