// ==UserScript==
// @name         LZTNickAnonimazer
// @namespace    MeloniuM/LZT
// @version      1.3
// @description  Добавляет кнопку скрытия username собеседника
// @author       MeloniuM
// @license MIT
// @match        *://zelenka.guru/conversations*
// @match        *://lzt.market/conversations*
// @match        *://lolz.guru/conversations*
// @match        *://lolz.live/conversations*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
////////// /@//require      //https://zelenka.guru // /js/jquery/jquery-2.1.4.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js 
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467748/LZTNickAnonimazer.user.js
// @updateURL https://update.greasyfork.org/scripts/467748/LZTNickAnonimazer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //if (localStorage.getItem('lzthack_conversations_dialog_anonymity_enable') == null) localStorage.setItem('lzthack_conversations_dialog_anonymity_enable', '0');
    //if (localStorage.getItem('lzthack_conversations_dialog_anonymity_enable') != '1') return;
    function change_anonymity_random() {
        let random = Math.floor(Math.random() * 10) + 1;
        localStorage.setItem('lzthack_conversations_dialog_anonymity_random', random);
        return random;
    }
    const random = (localStorage.getItem('lzthack_conversations_dialog_anonymity_random') == null)? change_anonymity_random(): localStorage.getItem('lzthack_conversations_dialog_anonymity_random');

    function selectColor(number) {
        const hue = number * 137.508; // use golden angle approximation
        return `hsl(${hue},50%,75%)`;
    }

    function get_span(color = "rgb(149,149,149)", width = "120px"){
        var span = $("<span class='nickhide'>");
        // задание стилей
        span.css({
            "background-color": color,
            "border-radius": "5px",
            "width": width,
            "display": 'inline-block',
            "padding": '5px',
            "margin-right": '5px'
        });
        return span;
    }

    function hide_username(item){
        let color = selectColor(item.attr('data-cid') + random);
        let username = item.find('.username');
        let lastmessage = item.find('.last-message .muted');

        let span = (item.find('.title .nickhide').length == 0)? get_span(color): item.find('.title .nickhide').first();
        let span2 = (item.find('.last-message .nickhide').length == 0)? get_span("rgb(149,149,149)", "60px"): item.find('.last-message .nickhide').first();

        if (localStorage.getItem('lzthack_conversations_dialog_anonymity') == '1'){
            username.hide();
            lastmessage.hide();
        }else{
            span.hide();
            span2.hide();
        }

        if(item.find('.title .nickhide').length == 0) username.parent().prepend(span);
        if(item.find('.last-message .nickhide').length == 0) lastmessage.parent().prepend(span2);
    }

    //синхронизация между вкладками
    $(window).bind('storage', function (e) {
        if(e.originalEvent.key == 'lzthack_' + 'conversations_dialog_anonymity'){
            let i = $('.hidenickbutton .conversationControl');
            if (e.originalEvent.newValue == '1'){
                $('.nickhide').show();
                $('.conversationItem .username, .conversationItem .last-message .muted').hide();
                i.removeClass('fa-eye-slash');
                i.addClass('fa-eye');
            }else{
                $('.nickhide').hide();
                $('.conversationItem .username, .conversationItem .last-message .muted').show();
                i.removeClass('fa-eye');
                i.addClass('fa-eye-slash');
            }
        }
    });

    let turn = true;
    let button = false;
    function start_hide(){
        if (turn){
            let controls = $("div.conversation-controls");
            if (controls.length != 0){
                let a;
                let eye = (localStorage.getItem('lzthack_conversations_dialog_anonymity') == '1') ? 'fa-eye': 'fa-eye-slash';
                if ($('.hidenickbutton').length == 0){
                    a = $('<a class="hidenickbutton"><i class="fa ' + eye + ' conversationControl" aria-hidden="true"></a>');
                    a.css({'margin-left': '10px', 'color': 'rgb(148, 148, 148)'});

                }else{
                    a = $('.hidenickbutton');
                }

                if (!button){
                    $(a.find('i')).on('click', function(event){
                        let target = $(event.target);
                        if (localStorage.getItem('lzthack_conversations_dialog_anonymity') == '1'){
                            $('.nickhide').hide();
                            $('.conversationItem .username, .conversationItem .last-message .muted').show();
                            target.removeClass('fa-eye');
                            target.addClass('fa-eye-slash');
                            localStorage.setItem('lzthack_conversations_dialog_anonymity', '0')
                        }else{
                            $('.nickhide').show();
                            $('.conversationItem .username, .conversationItem .last-message .muted').hide();
                            target.removeClass('fa-eye-slash');
                            target.addClass('fa-eye');
                            localStorage.setItem('lzthack_conversations_dialog_anonymity', '1');
                        }
                    })
                    controls.append(a);
                    button = true;
                }


            }

            let items = $('#ConversationListItems').find('.conversationItem');
            items.each(function() {
                hide_username($(this));
            });
            if (items.length != 0){
                //добавляем евент обновления списка
                $('#ConversationListItems').bind('DOMNodeInserted', function(e){
                    if ($(e.target).hasClass('conversationItem')){
                        hide_username($(e.target));
                    }
                });

                turn = false;
                return;
            }
        }
        requestAnimationFrame(start_hide);
    }
    requestAnimationFrame(start_hide);
})();