// ==UserScript==
// @name         AlternativeTo Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make the AlternativeTo website even better!
// @author       Al Boulley, al.boulley@gmail.com
// @match        https://alternativeto.net/software/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33487/AlternativeTo%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/33487/AlternativeTo%20Enhancer.meta.js
// ==/UserScript==

(function() {
    sortedItems = false;

    function sortAlternativesTo() {
        jQuery.fn.order = function(asc, fn) {
            fn = fn || function (el) {
                return $(el).text().replace(/^\s+|\s+$/g, '');
            };
            var T = asc !== false ? 1 : -1,
                F = asc !== false ? -1 : 1;
            this.sort(function (a, b) {
                a = fn(a);
                b = fn(b);
                if (a == b) return 0;
                return a < b ? F : T;
            });
            this.each(function (i) {
                this.parentNode.appendChild(this);
            });
        };

        if (!sortedItems) {
            listItems = $('#alternativeList li[id^="item-"]');
            listItems.order(false, function (el) {
                return parseInt($('.num', el).text());
            });
            sortedItems = true;
            statusComplete = '<li><h1 style="width:100%; background-color:#333; color:#3F3; padding:0.3em; font-size:3em; ';
            statusComplete += 'border:10px solid #3F3; text-align:center;">Alternatives Loaded &amp; Sorted!</h1></li>';
            listItems[0].insertAdjacentHTML('beforebegin', statusComplete);
        }
    }

    function initiateSort() {
        loadMore = $('#alternativeList button.btn-load-more');
        if (loadMore.length > 0) {
            loadMore.click();
            setTimeout(initiateSort, 4000);
        }
        setTimeout(sortAlternativesTo, 3000);
    }

    window.onload = initiateSort;
})();