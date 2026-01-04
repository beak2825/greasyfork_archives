// ==UserScript==
// @name         VK no reactions
// @name:ru      Вконтакте без реакций
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Removes reactions from vk.com
// @description:ru  Убирает реакции с сайта vk.com и возвращает обычные лайки
// @author       dark1103
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?domain=vk.com
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430553/VK%20no%20reactions.user.js
// @updateURL https://update.greasyfork.org/scripts/430553/VK%20no%20reactions.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function modify_likes(){
        $('[data-section-ref="reactions-menu-mount"]').remove();
        $('.post_content:not(.like_fixed)').each(function(){
            $(this).addClass('like_fixed');
            var likes = $(this).find('.ReactionsPreview');
            likes.find('.ReactionsPreview__items').hide();
            var container = $(this).find('.PostButtonReactions');

            var likes_count = $(this).find('.PostBottomActionExtraReactionsPreview');
            var like_icon = $(this).find('._like_button_icon:nth(0)');

            var array = $(likes_count).find('.ReactionsPreview').toArray();

            for(var i = 0;i < array.length;i++){
                array[i].onclick = undefined;
            }

            $(likes_count).insertAfter(like_icon);
            $('._like_button_label').hide();
        });
    }
    modify_likes();

    $('body').on('DOMNodeInserted', '#content', function(e) {
        //console.log(e);
        if(e.target.classList.contains('feed_row') || e.target.classList.contains('post_content')){
            modify_likes();
        }
    });

})();