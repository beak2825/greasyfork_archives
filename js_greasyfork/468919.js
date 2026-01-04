// ==UserScript==
// @name         Move Tag Posts Count
// @version      1.6
// @description  Moves the tag's posts count after the tag name on a webpage with specific elements.
// @match      https://chan.sankakucomplex.com/post*
// @match      https://chan.sankakucomplex.com/*/post*
// @match      https://chan.sankakucomplex.com/*/post/*
// @match      https://chan.sankakucomplex.com/?*tags*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1104432

// @downloadURL https://update.greasyfork.org/scripts/468919/Move%20Tag%20Posts%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/468919/Move%20Tag%20Posts%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('div[id^="tag_container"]').forEach(div => {
        const span = document.createElement('span')

        span.style.color = 'grey'
        span.innerHTML = ' ' + transformNumber(div.querySelector('.tooltip').innerHTML.match(/Posts: <span data-count="(\d*)">/i)[1])
        div.insertBefore(span, div.querySelector('a').nextSibling)
    });

    function transformNumber(numberString) {

        const numberParts = numberString.trim().split(/(\d+\.?\d*)([KMB])?/);
        let number = parseFloat(numberParts[1]);
        const suffix = numberParts[2];

        if (suffix === 'K') {
            number *= 1000;
        } else if (suffix === 'M') {
            number *= 1000000;
        }

        return number.toLocaleString("ro-RO", {
            useGrouping: true
        });
    }
})();