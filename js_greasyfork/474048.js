// ==UserScript==
// @name        Amazon Sponsored Products dimmer
// @namespace   https://greasyfork.org/en/users/1029987-mrienstra
// @author      mrienstra
// @version     0.0.1
// @license     MIT
// @description Dims sponsored products on Amazon.com, based on https://greasyfork.org/en/scripts/388822-amazon-sponsored-products-remover
// @match       https://www.amazon.cn/*
// @match       https://www.amazon.in/*
// @match       https://www.amazon.co.jp/*
// @match       https://www.amazon.com.sg/*
// @match       https://www.amazon.com.tr/*
// @match       https://www.amazon.ae/*
// @match       https://www.amazon.fr/*
// @match       https://www.amazon.de/*
// @match       https://www.amazon.it/*
// @match       https://www.amazon.nl/*
// @match       https://www.amazon.es/*
// @match       https://www.amazon.co.uk/*
// @match       https://www.amazon.ca/*
// @match       https://www.amazon.com.mx/*
// @match       https://www.amazon.com/*
// @match       https://www.amazon.com.au/*
// @match       https://www.amazon.com.br/*
// @match       https://smile.amazon.com/*
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/474048/Amazon%20Sponsored%20Products%20dimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/474048/Amazon%20Sponsored%20Products%20dimmer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css, id) {
        if (document.getElementById(id)) return;
        const head = document.querySelector('head');
        if (!head) return;
        const style = document.createElement('style');
        style.id = id;
        style.innerText = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
        .AdHolder,
        [class*="_adPlacements"],
        [data-cel-widget*="adplacements"],
        [data-cel-widget="dp-ads-center-promo_feature_div"],
        [class*="spSponsored"],
        [data-video-type="sponsored"],
        [id*=-advertising-],
        .celwidget:has([data-adfeedbackdetails]):not(:has(.celwidget)),
        .celwidget:has(.s-widget-sponsored-label-text):not(:has(.celwidget)),
        #discovery-and-inspiration_feature_div
            {
                opacity: 0.3 !important;
                /* or if you'd prefer to hide completely: */
                /* display: none !important; */
            }
    `, 'amazon_sponsored_products_dimmer');
})();