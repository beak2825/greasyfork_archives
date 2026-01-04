// ==UserScript==
// @name         whatfontis premium (fixed 2025)
// @namespace    
// @version      1.2
// @description  Removes blurred text and premium blockers on WhatFontIs
// @match        https://www.whatfontis.com/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @grant        GM_info
// @author       drhouse (fix by ChatGPT)
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/546696/whatfontis%20premium%20%28fixed%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546696/whatfontis%20premium%20%28fixed%202025%29.meta.js
// ==/UserScript==
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
    // remove premium banners / blocked sections
    $(".premium, .blur, .aboutinlist, .adblock, .border-bottom-dotted, .bg-light").remove();

    // remove blur effect everywhere
    $("[class*='blur']").removeClass("blur");

    // remove blocking modal/popups repeatedly
    setInterval(function () {
        $(".modal.show, .fade.show").each(function () {
            $(this).find("button.close, button, .btn-close").first().click();
        });
    }, 1000);

    // show hidden buttons / results
    $("button[disabled], .premium-hidden, .locked").removeAttr("disabled").show();

    // replace premium sample preview with real font preview (fallback)
    let altPreview = $(".font-control .col-16.p-3.pt-3").first();
    if (altPreview.length) {
        $(".font-control .row.mb-5 div:nth-child(2)").replaceWith(altPreview.clone());
    }
})(jQuery);
