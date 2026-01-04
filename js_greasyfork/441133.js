// ==UserScript==
// @name         Arrow Keys navigate Marketplace
// @namespace    http://tampermonkey.net/
// @version      0.10
// @license      MIT
// @description  This script makes it so you can navigate marketplace with arrow keys between next and previous pages. It also attemps to remove duplicates from results(highly imperfect).
// @author       Aida Beorn
// @match        https://marketplace.secondlife.com/*
// @icon         https://www.google.com/s2/favicons?domain=secondlife.com
// @downloadURL https://update.greasyfork.org/scripts/441133/Arrow%20Keys%20navigate%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/441133/Arrow%20Keys%20navigate%20Marketplace.meta.js
// ==/UserScript==

function NextPage() {
	let next = document.getElementsByClassName('next_page')[0];
    if(next) {
        next.click();
    }
}

function PreviousPage() {
	let prev = document.getElementsByClassName('previous_page')[0];
    if(prev) {
        prev.click();
    }
}

function HandleKeyEvent(e) {
    switch(e.key) {
        case "ArrowRight":
            NextPage();
            break;
        case "ArrowLeft":
            PreviousPage();
            break;
    }
}


(function() {
    'use strict';

    let captureSupported = false;
    let passiveSupported = false;

    try {
        const options = {
            get capture() { // This function will be called when the browser
                //   attempts to access the capture property.
                captureSupported = true;
                return false;
            },
            get passive() { // This function will be called when the browser
                //   attempts to access the passive property.
                passiveSupported = true;
                return false;
            }
        };

        window.addEventListener("test", null, options);
        window.removeEventListener("test", null, options);
    } catch(err) {
        captureSupported = false;
        let passiveSupported = false;
    }

    const options = {
        capture: captureSupported,
        passive: passiveSupported
    };

    document.addEventListener('keyup', HandleKeyEvent, options);
    RemoveDuplicates();
})();



function RemoveDuplicates() {
    if(window.location.pathname !== "/products/search") {
        return;
    }


    let count = 0;
    let loopcount = 0;
    const maxDistance = 10;
    const filterGatcha = true;
    const filterDuplicates = true;
    const debuging = false;

    const gachaTerms = [
        "gacha",
        "rare",
        "common"
    ];

    const fragment = new DocumentFragment();
    const realDocument = document.getElementsByClassName('product-listing gallery')[0];

    const realList = Array.from(realDocument.childNodes);
    realList.forEach(v => {
        fragment.appendChild(v);
    });

    let items1 = Array.from(fragment.querySelectorAll('.gallery-item'));
    let items2;

    let start;
    let endItemFilter;
    let endGachaFilter;

    if(true) {
        start = new Date();
    }

    items1.forEach((item1, idx1) => {
        items2 = Array.from(fragment.querySelectorAll('.gallery-item'));
        items2.forEach((item2, idx2) => {
            if(idx1 !== idx2) {
                const levDistance = levenshteinDistance(item1.children[1].innerText, item2.children[1].innerText);
                if(levDistance < maxDistance && levDistance !== 0) {
                    if(debuging) {
                        console.log(`${item1.children[1].innerText}::${item2.children[1].innerText}::${levDistance}`);
                        //console.log(items1[idx1].children[1].innerText,items2[idx2].children[1].innerText);
                    }
                    item2.remove();
                    count++;
                }
                loopcount++;
            }
        })
    })

    if(true) {
        endItemFilter = new Date();
    }

    if(filterGatcha) {
        let items = Array.from(fragment.querySelectorAll('.gallery-item'));
        for(let j = 0; j < items.length; j++) {
            const item = items[j];
            const itemLower = item.children[1].innerText.toLowerCase();
            if (gachaTerms.some(v => itemLower.includes(v))) {
                if(debuging) {
                    console.log(itemLower);
                }
                item.remove();
                count++;
            }
            loopcount++;
        }
    }

    if(true) {
        endGachaFilter = new Date();

        console.log(`Items: ${endItemFilter - start}; Gacha: ${endGachaFilter - endItemFilter}`);
    }

    realDocument.appendChild(fragment);

    console.log(`Removed ${count} items in ${loopcount} iterations`);
}


// BEGIN js-levenstein
/* MIT License

Copyright (c) 2017 Gustaf Andersson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
function levenshteinDistance(a, b){
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    var len = vector.length - 1;

    for (; x < lb - 3;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = (x += 4);
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
};

function _min(d0, d1, d2, bx, ay)
  {
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
  }