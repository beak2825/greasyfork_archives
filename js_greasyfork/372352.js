// ==UserScript==
// @name         Direct Links to Twitter Media Embeds
// @namespace    http://bifrost.me
// @version      1.0
// @description  Generates a small link directly to the source of Twitter media embeds (Youtube, Twitch clips, etc.)
// @match        https://twitter.com/*
// @grant        none
// @require		 https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/372352/Direct%20Links%20to%20Twitter%20Media%20Embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/372352/Direct%20Links%20to%20Twitter%20Media%20Embeds.meta.js
// ==/UserScript==

var documentHeight = '';

// Monitor the height of the window to detect when new tweets have been dynamically loaded
function heightWatcher() {
    if (documentHeight != document.body.scrollHeight) {
        addLinks();
    }
    documentHeight = document.body.scrollHeight;
    setTimeout(function(){heightWatcher();}, 3000);
};

function addLinks() {
    $('div.card-type-player').each(function() {
        if ($(this).attr('link-added')) {
            return;
        }
        const src = $(this).attr('data-card-url');
        $(this).before('<a href=\"' + src + '\">→</a>');
        $(this).attr('link-added', true)
    });
};

(function() {
    'use strict';

    heightWatcher();
})();