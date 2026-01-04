// ==UserScript==
// @name         LZT_MemberCardReportButton
// @namespace    MeloniuM/LZT
// @version      1.1
// @description  Add Report Button to member card
// @author       MeloniuM
// @license      
// @match        http*://zelenka.guru/*
// @match        http*://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487383/LZT_MemberCardReportButton.user.js
// @updateURL https://update.greasyfork.org/scripts/487383/LZT_MemberCardReportButton.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let title = !(XenForo.visitor.language_id -1 )? 'Report user - {nickname}' : 'Жалоба на пользователя {nickname}'
    let message = !(XenForo.visitor.language_id -1 )? '1. Offender\'s nickname and profile link: https://zelenka.guru/members/{member_id}/\n2. Brief description of the complaint:\n3. Evidence:': '1. Никнейм нарушителя и ссылка на профиль: https://zelenka.guru/members/{member_id}/\n2. Краткое описание жалобы:\n3. Доказательства:'

    $(document).on('XFOverlay', function(e){
        let $overlay = e.overlay.getOverlay();
        if (!$overlay.is('.memberCard')) return;
        let popup = $overlay.find('.top .right .Popup.fl_r').data('XenForo.PopupMenu');
        if (popup.$menu.find('.blockLinksList:has(.LZTReportButton)').length) return;
        let member_id = $overlay.find('.memberCardInner').attr('id').substr(10);
        let nickname = $overlay.find('.usernameAndStatus .username').first().text().trim();
        let href = "forums/801/create-thread?title={title}&message={message}";
        let tamplates = {'{title}': title, '{message}': message, '{nickname}': nickname, '{member_id}': member_id};
        for (let x in tamplates) {
            href = href.replace(x, tamplates[x]);
        }
        popup.addToMenu('<li><a class="LZTReportButton" target="_blank" href="'+ encodeURI(href) +'">' + (!(XenForo.visitor.language_id -1 )? 'Report': 'Пожаловаться') + '</a></li>')
    });
})();