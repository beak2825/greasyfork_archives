// ==UserScript==
// @name         Bunpro: Disable Undo on SRS 11 reviews
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Disables the undo button on the last SRS stage
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396182/Bunpro%3A%20Disable%20Undo%20on%20SRS%2011%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/396182/Bunpro%3A%20Disable%20Undo%20on%20SRS%2011%20reviews.meta.js
// ==/UserScript==

(function() {
    var $ = window.$;

    const disable_srs = 11; // Disables undo on all items at and above this srs level
    $('html')[0].addEventListener('new-review-item', ()=>{
        var srs = $('.srs-tracker')[0].innerText.split(' ')[1];
        var button_moved = $('head .oops-button').length;
        if (srs >= disable_srs && !button_moved) $('head').append($('.oops-button'));
        else if (srs < disable_srs && button_moved) $('.undo-button').before($('.oops-button'));
    });
})();
