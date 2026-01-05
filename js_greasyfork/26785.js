// ==UserScript==
// @name        VK recent Emoji
// @namespace   vk.com
// @description Показывает недавние смайлы под полем ввода сообщения
// @include      *://vk.com/*
// @version     1.2.3
// @require 		https://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26785/VK%20recent%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/26785/VK%20recent%20Emoji.meta.js
// ==/UserScript==

window.vkre_installed = false;
window.vkre_interval = setInterval(function () {
    if(window.location.href.split('/')[3].split('?')[0] == 'im' && $('.vkre_emojibar').length == 0) {
        $('._emoji_btn').trigger('mouseover').trigger('mouseout');
        lastEmoji = $('.emoji_cat_title_helper').eq(0).next('.emoji_smiles_row').html();
        $('._im_chat_input_parent').after('<div style="margin-left:57px;" class="vkre_emojibar emoji_smiles_row">' + lastEmoji + '</div>');
        $('.vkre_emojibar .emoji_smile_cont').removeAttr('onclick');
        $('.vkre_emojibar .emoji_smile_cont').on('click', function (e) {
            emojiId = $(e.currentTarget).attr('onmousedown').split(',')[1].split('\'')[1];
            Emoji.addEmoji(0, emojiId, '');
        });
    }
}, 1000);