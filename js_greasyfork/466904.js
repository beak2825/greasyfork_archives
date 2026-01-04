// ==UserScript==
// @name         LZTMobileFollowersShow
// @namespace    Melonium/LZT
// @version      1.1
// @description  Отображает блок подписок и подписчиков в мобильной версии форума
// @author       Melonium
// @license      MIT
// @match        *://zelenka.guru/*
// @match        *://lzt.market/*
// @match        *://lolz.guru/*
// @match        *://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466904/LZTMobileFollowersShow.user.js
// @updateURL https://update.greasyfork.org/scripts/466904/LZTMobileFollowersShow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ready(function() {
        if(!$('.profilePage')) return;
        if($('.section.membersOnline .avatarList').is(':hidden')){
            $('.section.membersOnline .avatarList').slideUp()
            $('.section.membersOnline').slideDown()
        }
        $('.section.membersOnline h3').on('click', function(e){
            let avatarList = $(e.target).closest('.section.membersOnline').find('.avatarList')
            if(avatarList.is(':hidden')){
                avatarList.slideDown()
            }else{
                avatarList.slideUp()
            }
        })
    })
})();