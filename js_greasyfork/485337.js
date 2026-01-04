// ==UserScript==
// @name         Marktplaats clickable user profile url in bids
// @namespace    https://greasyfork.org/en/users/1251054-djoey
// @version      0.3
// @description  make marktplaats bid username clickable
// @author       JustDjoey
// @match        https://www.marktplaats.nl/v/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marktplaats.nl
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485337/Marktplaats%20clickable%20user%20profile%20url%20in%20bids.user.js
// @updateURL https://update.greasyfork.org/scripts/485337/Marktplaats%20clickable%20user%20profile%20url%20in%20bids.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bids = window.__CONFIG__.listing.bidsInfo.bids;

    function createClickableLinks() {
        let bids_html = document.getElementsByClassName("BiddingList-content");
        Array.from(bids_html).forEach(function(element) {
            let price = element.getElementsByClassName('BiddingList-price')[0].innerText.replace(/\D/g, "");
            let username = element.children[0].textContent;
            let bid_info = bids.find(x => (x.value == price && x.user.nickname == username));
            let user = bid_info.user;

            element.children[0].innerHTML = '<a target="_blank" href="https://www.marktplaats.nl/u/' + user.nickname + '/' + user.id + '" >' + user.nickname + '</a>';
        });
    }

    function recheck() {
        setTimeout(createClickableLinks,250)
    }

    window.addEventListener('load', function() {
        createClickableLinks();

        if(document.getElementsByClassName('BiddingList-showMore')[0]) {
        document.getElementsByClassName('BiddingList-showMore')[0].children[0].addEventListener("click", recheck);
    }
    });

})();