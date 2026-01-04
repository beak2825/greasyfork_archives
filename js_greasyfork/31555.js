// ==UserScript==
// @name         For the goddess!
// @namespace    Kumokumoyeah
// @version      0.1
// @description  This was necessary.
// @author       You
// @match        https://community.wanikani.com/t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31555/For%20the%20goddess%21.user.js
// @updateURL https://update.greasyfork.org/scripts/31555/For%20the%20goddess%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var targetOfAffection = 'Kumirei';
    $('.topic-post').not('.topic-owner').find('[data-user-card="' + targetOfAffection + '"]').closest('.row').find('.like').click(); //page load
    $(window).scroll(function() {
        var targets = $('.topic-post').not('.topic-owner').find('[data-user-card="' + targetOfAffection + '"]').closest('.row').find('.like');
        if (targets.length > 0) {
            targets.click();
            console.log("Found " + targets.length + " " + targetOfAffection + " posts to like!");
        }
    });
})();