// ==UserScript==
// @name         DataSpark WM link fetcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get WM links from DataSpark and replace it to it's search results.
// @author       Zuivram
// @include      /\https:\/\/dataspark\.co\/products\/\d+/
// @match        https://dataspark.co/products/search?search=*
// @icon         https://www.google.com/s2/favicons?domain=dataspark.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429986/DataSpark%20WM%20link%20fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/429986/DataSpark%20WM%20link%20fetcher.meta.js
// ==/UserScript==

var idSelector = document.querySelector("#page-content-wrapper > div.row.pl-4.pr-4.mb-3.d-flex > div:nth-child(1) > div > div > div > div.col-xl-9.col-lg-9.col-md-9.col-xs-10.pl-0.ml-3.mr-2.pr-5.ucard-2 > div > p:nth-child(4) > span");

(function() {
    'use strict';

    try {
        var uri = `https://walmart.com/ip/${idSelector.textContent.match(/\d+/)[0]}`;

        var a = document.createElement('a')
        a.href = uri;
        a.textContent = uri;
        a.target = '_blank';

        idSelector.appendChild(a);
    } catch (r) {
        (function timeout() {
            setTimeout(function () {
                var productSearch = document.querySelectorAll('#block-gavias-tico-content > div > div > div > div > div > div.views-field.views-field-title-1 > span > a');

                productSearch.forEach(function(el) {
                    if (el.href.startsWith('/')) return

                    fetch(el.href)
                        .then(res => res.blob())
                        .then(blob => blob.text())
                        .then(text => {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(text, 'text/html');
                            var walUri = doc.querySelector("#page-content-wrapper > div.row.pl-4.pr-4.mb-3.d-flex > div:nth-child(1) > div > div > div > div.col-xl-9.col-lg-9.col-md-9.col-xs-10.pl-0.ml-3.mr-2.pr-5.ucard-2 > div > p:nth-child(4) > span");

                            el.href = `https://walmart.com/ip/${walUri.textContent.match(/\d+/)[0]}`;
                            el.target = '_blank';
                            el.style.color = '#0071dc';
                            el.textContent = 'View @ WM';
                        });
                });
                timeout();
            }, 1000);
        })();
    }
})();
