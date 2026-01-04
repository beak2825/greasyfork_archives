// ==UserScript==
// @name         LZTToggleRead
// @namespace    MeloniuM/LZT
// @version      1.1
// @description  Mark conversation as unread
// @author       MeloniuM
// @match        https://lolz.live/conversations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543727/LZTToggleRead.user.js
// @updateURL https://update.greasyfork.org/scripts/543727/LZTToggleRead.meta.js
// ==/UserScript==
(function () {
    'use strict';
    $(document).bind('PopupMenuShow', function (e) {
        let $menu = e.$menu;
        let $context = $menu.data('XenForo.PopupMenu').$container;
        // Исключаем лишние контексты
        if ($context.is('.RecipientsPopup') || !$context.closest('.membersAndActions').length) return;
        // Не добавляем кнопку, если она уже есть
        if ($menu.find('.conversationToggleRead').length) return;
        // Добавляем кнопку "Пометить как непрочитанное"
        $menu.find(".secondaryContent, .blockLinksList").append(`
     <a class="item control conversationToggleRead MenuCloser">
    <span class="Svg-Icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l9 6 9-6M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 6 9-6" />
        </svg>
    </span>
    Пометить как не прочитанное
</a>`).xfActivate();
    });
    $(document).on('click', '.conversationToggleRead', function (e) {
        e.preventDefault();
        let conversationId = Im.conversationId;
        $('#Conversations').data('Im.Start').goToConversationList();
        XenForo.ajax(`/conversations/${conversationId}/toggle-read`, {
            _xfConfirm: 1
        }, function (response) {
            if (response && !response.error) {
                $(`#conversation-${conversationId}`).addClass('unread');
            }
        });
    });
})();