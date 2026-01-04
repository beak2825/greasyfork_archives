// ==UserScript==
// @name         LZTConversationsMute
// @namespace    Melonium/LZT
// @version      2.0
// @description  Отключаем уведомления с диалогов
// @author       MeloniuM
// @license      MIT
// @match        *://zelenka.guru/*
// @match        *://lzt.market/*
// @match        *://lolz.guru/*
// @match        *://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/466942/LZTConversationsMute.user.js
// @updateURL https://update.greasyfork.org/scripts/466942/LZTConversationsMute.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var mutedList = localStorage.getItem('conversationsMuted')? localStorage.getItem('conversationsMuted').split(',').map(Number) : [];
    //Стильно, модно, молодёжно
    $("<style>").prop("type", "text/css").html(".conversationItem .avatar .conversationMute{position: absolute; background-color: rgb(39, 39, 39); border-radius: 50%; border: 1px solid rgb(17 17 17); text-align: center; line-height: 16px; top: 3px; left: 34px; height: 16px; width: 16px; display: inline-block; z-index: 1}").appendTo("head");
    const lang = XenForo.visitor.language_id - 1;
    const phrases = {
        'mute': (lang? 'Откл. уведомления': 'Mute alerts'),
        'unmute': (lang? 'Вкл. уведомления': 'Unmute alerts')
        };

    XenForo.conversationMuteButton = function($button) {
        $button.on('click', function(e){
            e.preventDefault();
            let $target = $(e.target);
            let id = $target.data('id');
            let isMuted = muteToggle(id, $('#conversation-' + id + ' .avatar .conversationMute'));
            $target.text(phrases[(isMuted? 'unmute': 'mute')]);
        })
    }
    XenForo.register(".conversationMuteButton", "XenForo.conversationMuteButton");

    function addIcon($target){
        let show = true;
        let id = $target.attr('data-cid');
        if (!mutedList.includes(Number(id))) show = false;
        //выбор иконки
        const i = $(`<i class="fa fa-volume-mute conversationMute"></i>`);
        if (!show) i.hide();

        i.on('click', function(event) {//быстрый размут
            event.preventDefault();
            event.stopPropagation();

            let id = $(event.target).closest('.conversationItem').attr('data-cid');
            let isMuted = muteToggle(id, $(event.target));
            //меняем текст на кнопке в менюшке
            $('.conversationMuteButton[data-id="' + id + '"]').text(phrases[(isMuted? 'unmute': 'mute')]);
        });

        if (!$target.find('.avatar .conversationMute').length) $target.find('.avatar').append(i);
    }

    function muteToggle(id, icon){
        let muted = true;
        mutedList = localStorage.getItem('conversationsMuted')? localStorage.getItem('conversationsMuted').split(',').map(Number) : [];
        if (!mutedList.includes(Number(id))){
            //отключаем уведы
            mutedList.push(Number(id))
            icon.show();
        }else{
            //включаем уведы
            mutedList.splice(mutedList.indexOf(Number(id)),1)
            icon.hide();
            muted = false;
        }
        localStorage.setItem('conversationsMuted', mutedList.join(','));
        return muted;// значение после изменений
    }

    if (window.location.pathname.startsWith('/conversations')){
        $("<style>").prop("type", "text/css").html(".conversationItem .avatar.fa.fa-volume-mute::before {position: absolute; background-color: rgb(39, 39, 39); border-radius: 50%; border: 1px solid rgb(17 17 17); text-align: center; line-height: 16px; top: 3px; left: 34px; height: 16px; width: 16px; display: inline-block; z-index: 1}").appendTo("head");

        //при смене позиции диалога в списке 'XenForoActivate' не вызывается, поэтому используем 'DOMNodeInserted'
        $(document).on('DOMNodeInserted', '.conversationItem:not(:has(.conversationMute))', function(e){
            const $target = $(e.target);
            addIcon($(e.target));
        });

        $(document).bind('PopupMenuShow', function(e){
            let $menu = e.$menu
            let $context = $($menu.context);
            if ($context.is('.RecipientsPopup') || !$context.closest('.membersAndActions').length) return;
            if ($menu.find('.conversationMuteButton').length) return;
            mutedList = localStorage.getItem('conversationsMuted')? localStorage.getItem('conversationsMuted').split(',').map(Number) : [];
            let phrase = phrases[(mutedList.includes(Im.conversationId)? 'unmute': 'mute')];
            $menu.find(".secondaryContent, .blockLinksList").append('<a class="item control conversationMuteButton MenuCloser" data-id="' + Im.conversationId + '">' + phrase + '</a>').xfActivate();
        });

        $('#ConversationListItems').find('.conversationItem:not(:has(.conversationMute))').each(function(index){
            addIcon($(this));
        });
    }else{

        $(window).on('load', function(){
            let s;
            const m = (s = window).Im || (s.Im = {});

            const notification = $('html').data('Im.Notification');
            if (!notification) return;
            notification.displayNotification_old = notification.displayNotification;
            notification.displayNotification = (data) => {
                if (mutedList.includes(data.conversation_id) && !location.pathname.startsWith('/conversations')){
                    notification.handledNotifications.add(data.message.message_id);
                    if (!m.newMessageCache[data.conversationId]) {
                        m.newMessageCache.push(data.conversationId);
                    }
                    var popup = $("#ConversationsMenu.Menu").data("XenForo.PopupMenu");
                    if (popup) popup.reload();//Обновление счетчика сообщений в меню в шапке сайта
                    return;
                }
                return notification.displayNotification_old(data);
            }
        });
    };
    //синхронизация между вкладками
    $(window).bind('storage', function (e) {
        if(e.originalEvent.key !== 'conversationsMuted') return;
        mutedList = e.originalEvent.newValue;

        if (window.location.pathname.startsWith('/conversations')){
            let [newValue, oldValue] = [e.originalEvent.newValue.split(','), e.originalEvent.oldValue.split(',')];
            let del = true;//айди удалился
            let arrA, arrB;
            if (newValue.length > oldValue.length){
                del = false;//добавился новый айди
                //если новое значение больше, фильтровать будем
                arrA = newValue;
                arrB = oldValue;
            }else{
                //если новое значение больше, значит айди удалился
                arrA = oldValue;
                arrB = newValue;
            }
            //получим элементы из массива A, которых нет в массиве B.
            let ids = arrA.filter(x => !arrB.includes(x));
            //в теории их может быть больше 1
            ids.forEach((id) => {
                $('.conversationMuteButton[data-id="' + id + '"]').text(phrases[(!del? 'unmute': 'mute')]);//смена текста на кнопке в меню
                $('#conversation-' + id + ' .avatar .conversationMute')[!del? 'show': 'hide']();//скрытие/показ иконки на аве
            })
        }
    });
})();