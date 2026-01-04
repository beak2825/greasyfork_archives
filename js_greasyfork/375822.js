// ==UserScript==
// @name         PornPortalRemoveAds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove PornPortal Membersite ads
// @author       You
// @include      https://site-ma*
// @include      https://ma.fitnessrooms.com/*
// @require https://code.jquery.com/jquery-3.3.1.min.js

// @grant        none
//@run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/375822/PornPortalRemoveAds.user.js
// @updateURL https://update.greasyfork.org/scripts/375822/PornPortalRemoveAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //for all site
    waitForKeyElements ("a[href*=\"download\"]", actionFunction);

    //for babes
    waitForKeyElements (".flickity-viewport", removeBabesAds);
    waitForKeyElements ("iframe[src*=\"processor\"]", removeBabesIframe);

    //for fitnessRoom
    waitForKeyElements (".home-banner", removeFitnessRoomAds);
    waitForKeyElements (".trusted-partners-container", removeFitnessRoomAds2);

    //for mofos
    waitForKeyElements ("h2:contains('Trusted Partners')", removeMofosIframe);

})();

//// 請再自己加上這個 Greasy Fork不讓我用@require  https://gist.github.com/raw/2625891/waitForKeyElements.js


function actionFunction (jNode) {
        console.log("start script");

       $('a[href*="download"]').each(function() {
        $(this).remove();
    });
}

function removeBabesAds(){
    $(".flickity-viewport").parent().parent().remove();


}

function removeBabesIframe(){
    $("iframe").each(function() {
        $(this).parent().closest('section').remove();
    });
}

function removeFitnessRoomAds(){
    $(".home-banner").remove();
}
function removeFitnessRoomAds2(){
    $(".trusted-partners-container").remove();
}

function removeMofosIframe(){
    $("h2:contains('Trusted Partners')").parent().closest('section').remove();
}