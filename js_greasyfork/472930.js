// ==UserScript==
// @name         De-spamify FurAffinity Search
// @author       Vuccala
// @namespace    https://greasyfork.org/en/users/1148791-vuccala
// @version      0.63
// @description  Removes 99% of YCH/Reminder/Adoptables/etc. spam from FurAffinity searches by appending a carefully crafted negation string to the end of your search.
// @match        *://*.furaffinity.net/*
// @icon         https://archive.org/download/despamify-fa-icon/nogreed.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472930/De-spamify%20FurAffinity%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/472930/De-spamify%20FurAffinity%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

// This is the blacklist string that gets appended to your search. You can edit it to customize it.
    const customTag = "!@title "+
    "ych|ychs|reminder|rem|remind|adopt|adopts|adoptable|adoptables|slots|auction|raffle|stream|streaming|closed|sale|"+
    "commissions|comissions|(commission open)|(comms open)|(commission sheet)|(commission rates)|(commission prices)|(commission price)|(commission info)|(commission sale)|"+
    "(patreon exclusive)|(patreon preview)|(patreon teaser)|gumroad|"+
    "(price list)|(price sheet)|(price fix)|(price open)|(price offer)|(price fixed)|(price drop)";

//Note: the word "commissions" can be outright blocked since it's only ever used in spam,
//but the singular "commission" often isn't, so I blacklist it only when it appears in spammy terms like (commission open) and (commission rates) etc.

    const searchInputs = document.querySelectorAll('input[name="q"]');
    const searchForm = document.querySelectorAll('form[action="/search/"]');

    if (searchInputs.length > 0 && searchForm.length > 0) {
        searchForm.forEach((form, index) => {
            form.addEventListener('submit', function(event) {
                const currentValue = searchInputs[index].value.trim();
                if (currentValue && !currentValue.endsWith(customTag)) {
                    searchInputs[index].value = currentValue + ' ' + customTag;
                }
            });
        });
    }

// This removes the div that lists all the search terms you just searched for, because it's screen-length after all the negating search terms have been injected.

  const queryStatsDiv = document.getElementById("query-stats");
    if (queryStatsDiv) {
        queryStatsDiv.remove();
    }

})();