// ==UserScript==
// @name         LZTHideStickyThreads
// @namespace    MeloniuM/LZT
// @version      1.2.1
// @description  Позволяет свернуть список закреплённых тем в разделе
// @author       MeloniuM
// @license GPLv3
// @match        https://zelenka.guru/forums/*
// @match        https://lolz.live/forums/*
// @match        https://zelenka.guru
// @match        https://lolz.live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @require      https://code.jquery.com/jquery-2.1.4.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467084/LZTHideStickyThreads.user.js
// @updateURL https://update.greasyfork.org/scripts/467084/LZTHideStickyThreads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let enabled = localStorage.getItem('hideStickyThreads');
    function check(){
        let loc = window.location.pathname;
        if (loc.startsWith('/forums/766/') || loc.startsWith('/forums/contests/')){
            requestAnimationFrame(check);
            return;
        }
        if ($('.discussionListItems .stickyThreads .discussionListItem').length != 0){
            if ($('.button.hideStickyThreads').length == 0){
                addButton(enabled);
            }
            if (enabled == 'true'){
                $('.discussionListItems .stickyThreads .discussionListItem:visible').hide();
            }
        }
        requestAnimationFrame(check);
    }
    function addButton(){
        let button, btn_text, span;
        button = $('<a class="button middle hideStickyThreads" style="width: 100%;"><span class="fas fa-chevron-down" style="position: absolute; right: 7px; top: 2px; text-align: center; width: 30px; line-height: 32px;"></span><p></p></a>');
        $('.discussionListItems').prepend(button);
        span = $('.hideStickyThreads span');
        $('.hideStickyThreads p').text((enabled == 'true'? 'Раскрыть закреплённые темы': 'Скрыть закрепленные темы'));
        span.css('transform', (enabled == 'true'? '':'rotate(180deg)'));
        $(button).on('click', function(e){
            if ($('.discussionListItems .stickyThreads .discussionListItem').is(':hidden')){
                $('.hideStickyThreads span').css('transform', 'rotate(180deg)');
                $('.discussionListItems .stickyThreads .discussionListItem').slideDown('normal');
                $('.hideStickyThreads p').text('Скрыть закреплённые темы');
                localStorage.setItem('hideStickyThreads', false);
                enabled = 'false';
            }else{
                $('.hideStickyThreads span').css('transform', '');
                $('.discussionListItems .stickyThreads .discussionListItem').slideUp('normal');
                $('.hideStickyThreads p').text('Раскрыть закреплённые темы');
                localStorage.setItem('hideStickyThreads', true);
                enabled = 'true';
            }
        });
    }
    requestAnimationFrame(check);

})();