// ==UserScript==
// @name         Amazon Redirect UK
// @namespace    amazon-redirect-uk
// @author       SirGryphin
// @version      1.2
// @description  Redirects Amazon sites to Amazon.co.uk
// @match        https://*.amazon.com/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.com.be/*
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.cn/*
// @match        https://*.amazon.eg/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.sa/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.ae/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470656/Amazon%20Redirect%20UK.user.js
// @updateURL https://update.greasyfork.org/scripts/470656/Amazon%20Redirect%20UK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname !== 'www.amazon.co.uk') {
        window.location.replace(window.location.href.replace(/\/\/[^\/]+/, '//www.amazon.co.uk'));
    }
})();