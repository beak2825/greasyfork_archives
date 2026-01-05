// ==UserScript==
// @name         Keepa Extension
// @namespace    https://www.naviapps.com/
// @version      0.0.1
// @description  Keepa 拡張機能
// @author       Haruki Fukui
// @match        https://keepa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24129/Keepa%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/24129/Keepa%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body').on('click', '#tabAmazon > a', function () {
        $(this).attr('target', '_blank');
    });

    var target = document.body;
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            //console.log(mutation);
        });
    });
    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(target, config);
})();
