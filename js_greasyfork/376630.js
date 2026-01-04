// ==UserScript==
// @name         Amazon short url
// @namespace    https://puac.de/
// @version      0.2.0
// @description  Replaces the current Amazon product URL in the address bar with a shorter version.
// @author       Hans Puac
// @match        https://www.amazon.ae/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.cn/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.com.be/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.com.tr/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.eg/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.pl/*
// @match        https://www.amazon.sa/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.sg/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376630/Amazon%20short%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/376630/Amazon%20short%20url.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var asin = document.getElementById('ASIN');

    if (asin) {
        var url = document.location.protocol + '//' + document.location.host + '/dp/' + asin.value;

        if (url === document.location.href) {
            return;
        }

        window.history.replaceState(null, null, url);
    }
})();
