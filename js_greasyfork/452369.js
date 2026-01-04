// ==UserScript==
// @name         Discogs/Listing/sort-by-estimated-price
// @namespace    https://greasyfork.org/en/scripts/390720/
// @version      0.1
// @description  sort by price but it works
// @author       denlekke
// @match        https://www.discogs.com/sell/*
// @match        https://www.discogs.com/seller/*
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/452369/DiscogsListingsort-by-estimated-price.user.js
// @updateURL https://update.greasyfork.org/scripts/452369/DiscogsListingsort-by-estimated-price.meta.js
// ==/UserScript==

(function() {

    var sort_by_price = function(a, b) {
        return a.getElementsByClassName('converted_price')[0].innerText.split('$')[1].split(' ')[0].localeCompare(b.getElementsByClassName('converted_price')[0].innerText.split('$')[1].split(' ')[0]);
    }
    var node_list = $("#pjax_container > table > tbody > tr").get();
    node_list.sort(sort_by_price);
    for (var i = 0; i < node_list.length; i++) {
        node_list[i].parentNode.appendChild(node_list[i]);
    }

})();