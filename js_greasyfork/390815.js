// ==UserScript==
// @name         乞丐88
// @namespace    https://www.twitch.tv/uzra
// @version      1.0.1
// @description  try to take over the world!
// @author       SDxBacon
// @match        https://www.twitch.tv/uzra*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/390815/%E4%B9%9E%E4%B8%9088.user.js
// @updateURL https://update.greasyfork.org/scripts/390815/%E4%B9%9E%E4%B8%9088.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('head').append( $('<style type="text/css">').html('.chat-line__message { display: none !important };') )
    const shitwords = ["RPGAyaya", "RPGBukka", "RPGBukkaNoo", "RPGEmpty", "RPGEpicStaff", "RPGEpicSword", "RPGFei", "RPGFireball", "RPGGhosto", "RPGHP", "RPGMana", "RPGOops", "RPGPhatLoot", "RPGSeven", "RPGShihu", "RPGStaff", "RPGTreeNua", "RPGYonger"];
    const intervalCallback = function() {
        const $chats = $('div.chat-line__message:not(".isTrashTalkChecked")')
        if ($chats.length <= 0) return;
        $chats.each((i, chat) => {
            const $chat = $(chat);
            $chat.addClass('isTrashTalkChecked');

            let isSafeTalk = false;
            let talks = '';
            //console.log($chat);
            $chat.find('span.text-fragment').each((_, span) => {
                const $span = $(span);
                talks += $span.html();
            });

            const split = talks.split(' ');
            if (split && split.length > 0) {
                if (split.includes('乞丐認證測試')) {
                    return;
                }
                const countShitTalkeAppears = _.remove(split, function(n) { return shitwords.includes(n); });
                if (countShitTalkeAppears.length < 3) {
                    $chat.attr('style', 'display: block !important');
                }
            }
        });
    }
    // Your code here...
    setInterval(intervalCallback, 500);
})();