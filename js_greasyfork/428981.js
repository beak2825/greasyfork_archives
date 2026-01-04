// ==UserScript==
// @name         AnimeHeaven Cinema + Smart Nav
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds Cinema Viewing to your AnimeHeaven experience. Smart navigation to go to Next & Prev Episodes.
// @author       5punk
// @match        https://animeheaven.pro/watch/*
// @icon         https://www.google.com/s2/favicons?domain=animeheaven.pro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428981/AnimeHeaven%20Cinema%20%2B%20Smart%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/428981/AnimeHeaven%20Cinema%20%2B%20Smart%20Nav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getLinks = () => {
        let listLinks = Array.from($('.tab-pane.show.active li a'));
        let links = listLinks.reduce((itr, e, i) => {
            if (e.className.includes("active")) {
                itr.previous = i > 0 ? listLinks[i - 1].href : null;
                itr.next = i < listLinks.length ? listLinks[i + 1].href : null;
            }
            return itr;
        }, {previous: null, next: null});
        return links;
    };

    const generateLink = (url, label, icon) => links.previous ? `<a id="pc-fav" href="${url}" style="position: relative; z-index: 100; color: #fff!important;" class="btn btn-sm btn-radius btn-secondary mr-2"><i class="fa ${icon} mr-2"></i>${label}</a>` : `<a id="pc-fav" href="${url}" class="btn btn-sm btn-radius btn-secondary mr-2 disabled"><i class="fa ${icon} mr-2"></i>${label}</a>`;
    // Your code here...

    const links = getLinks();

    const prevButton = generateLink(links.previous, "Previous Episode", "fa-step-backward");
    const nextButton = generateLink(links.next, "Next Episode", "fa-step-forward");

    var prevDiv = document.createElement("span");
    var nextDiv = document.createElement("span");
    prevDiv.innerHTML = prevButton;
    nextDiv.innerHTML = nextButton;

    $('.watching_player-control')[0].insertBefore(prevDiv, $('.watching_player-control')[0].firstChild);
    $(nextDiv).insertAfter($('#pc-comment')[0]);

    // turn off lights
    $('.detail_page.detail_page-style')[0].style = "display: none;";
    $('#main-wrapper .container')[0].style = "width: 100%; max-width: unset; padding: 0px;";
    $('#header')[0].style = "display: none;";
    $('.prebreadcrumb')[0].style = "display: none;";
    !Array.from($('#turn-off-light')[0].classList).includes("active") && $('#turn-off-light')[0].click();
})();