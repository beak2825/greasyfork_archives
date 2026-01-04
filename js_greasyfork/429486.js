// ==UserScript==
// @name         Lincoln Journal Star Ad-Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove annoying ads on Lincoln Journal Star
// @author       LukieBear
// @match        https://journalstar.com/*
// @icon         https://www.google.com/s2/favicons?domain=journalstar.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429486/Lincoln%20Journal%20Star%20Ad-Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/429486/Lincoln%20Journal%20Star%20Ad-Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#lee-registration-wall").remove();
    $("#lee-subscription-wall-modal").remove();
    $(".modal-backdrop").hide();
    $("#x-blox-asset-ad,#x-reveal-ad").remove();
    $('body,html').css('overflow','auto');
    $("body").removeClass("modal-open");
    $(".hidden_print").remove();
    $(".subscriber-ad").remove();
    $(".asset-breakout-container").remove();
    $(".container-breakout").remove();
    $("#article-related-bottom").remove();
    $("#pu-email-form-crime-email-article").remove();
    $("#x-blox-asset-ad").remove();

    var intervalId = window.setInterval(function(){
        console.log("removed all");
        $("#x-reveal-ad").remove();
        $(".top-leader-ad-col").remove();
        $("#spotim-specific").remove();
        $(".lee-sticky-ad").remove();
        $("#x-blox-asset-ad").remove();
        $('iframe').remove();
        $(".ad-col").remove();
        $("#tncms-region-front-second-c").remove();
    }, 500);

    // Your code here...
})();