// ==UserScript==
// @name         Geenstijl add remover
// @namespace    https://www.geenstijl.nl/
// @version      0.8
// @description  Remove adds articles from Geenstijl.nl
// @author       Rick van der Staaij
// @require      http://code.jquery.com/jquery-latest.min.js
// @include      https://www.geenstijl.nl/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/377698/Geenstijl%20add%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/377698/Geenstijl%20add%20remover.meta.js
// ==/UserScript==

var cleaning = false;

function removeAddArticles() {
    let cleanCounter = 0;
    $('article').each(function() {
        if ($(this).find(".compost-warn:contains('Ingezonden mededeling')").length > 0) {
            cleanCounter++;
            $(this).attr("style", "display: none !important");
        }
    });
    if (cleanCounter > 0) {
        console.log('[Geenstijl add killer] Removed ' + cleanCounter + ' spam cards.');
    }
}

function removePromoBlocks() {
    console.log('[Geenstijl add killer] Cleaning crap.');
    $('.article-premium-promotion-block, .pgAdWrapper, .become-premium, .modal-float-in, .not-a-pixel, div[data-page="site_index.homepage"], .afctr-wrapper').attr("style", "display: none !important");
}

function clean() {
    if (cleaning) {
        return;
    }

    console.log('CLEANING');

    cleaning = true;

    removePromoBlocks();
    removeAddArticles();

    setTimeout(() => {
        cleaning = false;
        console.log('Done.');
    }, 100);
}

(function() {
    'use strict';

    console.log('[Geenstijl add killer] Killing spam...');
    clean();

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        clean();
    });

    observer.observe(document, {
        subtree: true,
        attributes: true,
    });

    $( document ).ready(function() { clean(); });
    $( window ).on( "load", function() { clean(); });
})();