// ==UserScript==
// @name         CafeCoderStandingsColorizer
// @namespace    https://makutamoto.com/
// @version      0.3
// @description  Colorize the CafeCoder standings page.
// @author       Makutamoto
// @match        https://cafecoder.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411680/CafeCoderStandingsColorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/411680/CafeCoderStandingsColorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const colors = ['gray', 'brown', 'green', 'cyan', 'blue', 'yellow', 'orange', 'red'];
    const root = document.body;
    const options = {
        subtree: true,
        childList: true,
    };
    const observer = new MutationObserver((records) => {
        for(const record of records) {
            for(const node of record.addedNodes) {
                if(node.tagName === 'DIV') {
                    const users = node.querySelectorAll("table.standings__table tbody tr th");
                    if(users.length > 0) {
                        for(let user of users) {
                            fetch(`https://atcoder-badges.now.sh/api/rating/${user.innerText}`).then((data) => {
                                data.json().then((data) => {
                                    const rating = data.rating === null ? null : (data.rating.atcoder === null ? null : data.rating.atcoder);
                                    if(rating) user.style.color = colors[Math.min(7, Math.floor(rating / 400))];
                                })
                            });
                        }
                    }
                }
            }
        }
    });
    observer.observe(root, options);
})();
