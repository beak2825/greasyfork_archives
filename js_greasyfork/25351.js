// ==UserScript==
// @name         Vk Recent Smiles Panel
// @namespace    https://vk.com
// @version      0.1
// @description  USABILITY
// @author       Efog
// @match        https://vk.com/*
// @unmatch      https://vk.com/notifier.php*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25351/Vk%20Recent%20Smiles%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/25351/Vk%20Recent%20Smiles%20Panel.meta.js
// ==/UserScript==

(() => {
    'use strict';

    setInterval(() => {
        if (/\/notifier.php/.test(location.href))
            return;

        if (!/\/im\?sel/.test(location.href))
            return;

        var panel = $('#recent-smiles');
        if (panel.length === 0) {
            console.info('Adding recent smiles...');

            var btn = $('._emoji_btn');

            panel = $('<div id="recent-smiles"></div>').appendTo($('.im-chat-input--txt-wrap'));
            Emoji.show(btn[0], null);

            setTimeout(() => {
                Emoji.hide(btn[0], null);

                setTimeout(() => {
                    smile(panel);

                    panel.css({
                        float: 'right',
                        marginTop: '10px'
                    });
                });
            }, 50);
        }
    }, 100);

    setInterval(() => {
        if (/\/notifier.php/.test(location.href))
            return;

        var panel = $('#recent-smiles');
        if (panel.length) {
            smile(panel);
        }
    }, 5000);

    function smile(panel) {
        var recent = $('.emoji_cat_title_helper[data-id="-1"]').eq(0).next('.emoji_smiles_row').children();

        setTimeout(() => {
            if (!/\/im\?sel/.test(location.href))
                return;

            var recent = $('.emoji_cat_title_helper[data-id="-1"]').eq(0).next('.emoji_smiles_row').children().clone(true);
            recent.each((i, emoji) => {
                emoji = $(emoji);
                emoji.attr('onmousedown', 'Emoji.shownId = data(domPN($(".emoji_smile._emoji_btn")[0]), "optId"); ' + emoji.attr('onmousedown').replace('return cancelEvent(event);', 'Emoji.shownId = false; return cancelEvent(event);'));
            });

            panel.html('').append(recent.slice(0, 10));
        });
    }
})();