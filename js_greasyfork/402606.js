// ==UserScript==
// @name         Market Item Value Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       Lemons
// @match        *://krunker.io/social.html*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402606/Market%20Item%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/402606/Market%20Item%20Value%20Calculator.meta.js
// ==/UserScript==

const krValues = [
    [300, 0.99],
    [600, 1.79],
    [2600, 2.49],
    [7000, 15.99],
    [20000, 34.99],
    [60000, 99.99]
];

const values = krValues.map(a => +(a[0] / a[1]).toFixed(2));

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            var c = node.children;
            if (c && c[2] && c[2].className === 'marketPrice') {
                var elem = c[2];

                var num = +elem.innerText.replace(/[^0-9]/g, '');

                var val = [].concat(krValues).sort((a, b) => {
                    var a1 = num - a[0];
                    var a2 = num - b[0];
                    return a1 - a2;
                });

                var index = krValues.findIndex(k => k[0] === val[0][0]);
                var value = (+(num / values[index]).toFixed(2)).toLocaleString();

                node.attributes.style.value += ';height:252px';
                node.insertAdjacentHTML('beforeend', `<div style="margin-top:37px;" class="marketPrice">$${value}<span style="color:#fff"> USD</span></div>`);
            }
        });
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});