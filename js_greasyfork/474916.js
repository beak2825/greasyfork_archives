// ==UserScript==
// @name         LZTConversTypingUniq
// @namespace    MeloniuM/LZT
// @version      1.0
// @description  Show uniq in conversations typing status
// @author       MeloniuM
// @license      MIT
// @match        https://zelenka.guru/conversations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474916/LZTConversTypingUniq.user.js
// @updateURL https://update.greasyfork.org/scripts/474916/LZTConversTypingUniq.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Im_ = $('#Conversations').data('Im.Start');
    Im_.eventTypingMessage = function(e) {
            let username;
            if ($('a.username.conversationRecipientUsername').length){//из названия беседы
                username = $('a.username.conversationRecipientUsername').first().clone();
            }else{//из списка участников
                let $menu = $('.membersAndActions .fl_r .Popup').first().data('XenForo.PopupMenu').$menu;
                username = $menu.find('li:has(img[alt="' +e.username +'"])').find('.username').clone();
            }

            e.username = XenForo.htmlspecialchars(e.username);
            if (e.username == username.text()) {
                e.username = username.prop('outerHTML');
            }

            e.user_id !== XenForo.visitor.user_id && this.getDialogElement(Im.conversationId).length && (this.timeout && clearTimeout(this.timeout),
            this.$typingNotice.length && this.$typingNotice.find(".Content").html(e.username + " " + this.$typingNotice.data("phrase")),
            1 !== parseInt(this.$typingNotice.css("opacity"), 10) && this.$typingNotice.css("opacity", 1),
            this.timeout = setTimeout((function() {
                this.$typingNotice.css("opacity", 0)
            }
            ).bind(this), 4e3))
        }
})();