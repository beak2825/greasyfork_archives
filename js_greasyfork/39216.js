// ==UserScript==
// @name         Twitch Emotes Killer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Stops emotes spam (Blocks chat messages that contains emotes only)
// @author       haab
// @match        https://www.twitch.tv/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/39216/Twitch%20Emotes%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/39216/Twitch%20Emotes%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        $(".chat-line__message:visible:not(.tek-checked)").each(function(_, msg) {
            var m = $(msg);
            if(m.find('span[data-a-target="chat-message-text"]').length == 0) {
                m.hide();
            }
            else {
                var t = $('span[data-a-target="chat-message-text"]', m);
                if(t.filter(function() {
                    return $(this).find('span').length > 0 || $(this).text().trim() == "";
                }).length == t.length) {
                    m.hide();
                }
            }
            m.addClass('tek-checked');
        });
    }, 2);
})();