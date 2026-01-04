// ==UserScript==
// @name         Streamer Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide forums, chats, messages from Torn for streaming
// @author       Heasley
// @match        https://www.torn.com/forums.php*
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514849/Streamer%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/514849/Streamer%20Mode.meta.js
// ==/UserScript==
removeChat(); //try to remove it quickly


var observer = new MutationObserver(function(mutations) {
    let url = location.href;
    if (url.includes('forums.php')) {
        removeForums();
    }
    if (url.includes('messages.php')) {
        removeMessages();
    }

    removeChat();
    if ($(".exchange-action").length > 0) {
        $(".exchange-action").remove();
    }
});
observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});



function removeChat() {
    $('#chatRoot').hide();
}

function removeMessages() {
    $('#masssell').remove();
    if ($('.wb-removed-messages').length == 0) {
        $('.container-header').after(`<div class="wb-removed-messages mt2">Streamer mode on</div>`);
    }
}

function removeForums() {
    $('.forum-wrap .forum-list li[data-href*="forums.php?p=forums&f=44&b=0&a=0"]').remove();
    $('.update-wrap > *:not(.dashboard.rating,.wb-update-wrap)').remove();
    if ($('.wb-update-wrap').length == 0) {
        $('.update-wrap').append(`

        <div class="title-black title-toggle active wb-update-wrap mt2" role="button">
                    Streamer mode on
                    </div>
        `);
    }
}