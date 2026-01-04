// ==UserScript==
// @name         LZTConversOnlineMembers
// @namespace    MeloniuM/LZT
// @version      2.3.3
// @description  Shows the count of conversation members online
// @author       MeloniuM
// @license      MIT
// @match        https://zelenka.guru/conversations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479393/LZTConversOnlineMembers.user.js
// @updateURL https://update.greasyfork.org/scripts/479393/LZTConversOnlineMembers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".conversationRecipient .isOnline{\
        content: '';\
        background-color: rgb(0, 186, 120);\
        border-radius: 50%;\
        border: 3px solid rgb(39, 39, 39);\
        height: 10px;\
        width: 10px;\
        display: inline-block;\
        text-align: center;\
        margin: auto 2px;\
    }")

    let timerId;
    let Im_ = $('#Conversations').data('Im.Start');
    Im_.sendRequest = function (data, useVisitorChannel = false) {
        $.ajax({
            url: 'https://' + Im.host + '/pub?id=' + (useVisitorChannel ? Im.visitorChannelId : Im.dialogChannelId),
            method: 'POST',
            dataType: 'json',
            data: data,
            contentType: "application/json",
            global: false,
        }).done(function( data ) {
            updateSubscribers(data, )
        });
    }

    function updateSubscribers(data){
        clearTimeout(timerId);
        if (!$('.membersAndActions').length) return;
        //диалог с юзером
        let isOnline = $('.conversationRecipient .isOnline');
        if (isOnline.length) {
            (data.subscribers > 1) ? isOnline.show() : isOnline.hide();
        }
        //беседа
        let RecipientsPopup = $('.membersAndActions .RecipientsPopup').first();
        if (!RecipientsPopup.length) return;
        let $menu = RecipientsPopup.data('XenForo.PopupMenu')?.$menu;
        if (!$menu) return;
        let textNode = RecipientsPopup.find('a[rel="Menu"]')[0].childNodes[0];
        textNode.nodeValue = data.subscribers + '/' + $menu.find('.mainc.lastOnline').length + '/' + $menu.find('.lastOnline').length + ' ' + textNode.nodeValue.split(' ')[1];
        timerId = setTimeout(function(){
            if (!$('.membersAndActions').length) return;
            //Im_.sendRequest("{}");
            get();
        }, 10000)
    }

    //GET не отправляется слушателям, а значит не спамит в сокет
    function get(){
        $.ajax({
            url: 'https://' + Im.host + '/pub?id=' + Im.dialogChannelId,
            method: 'GET',
            dataType: 'json',
            contentType: "application/json",
            global: false,
        }).done(function( data ) {
            updateSubscribers(data)
        });
    }

    function init(){
        if ($('.conversationRecipient').length && $('.conversationRecipient:has(.isOnline)')) {
            let isOnline = $('<div class="isOnline Tooltip" title="Собеседник в чате">');
            isOnline.hide();
            $('.conversationRecipient').prepend(isOnline).xfActivate();
            Im_.sendRequest("{}");
            $('.RecipientsPopup').addClass('Tooltip').attr('title', 'в чате/в сети/всего');
            XenForo.create('XenForo.Tooltip', $('.RecipientsPopup'));
        }
    }

    XenForo.LZTConversOnlineMembers = function(){
        init();
    }

    XenForo.register('.imDialog .simpleRedactor', 'XenForo.LZTConversOnlineMembers')

    init();
})();