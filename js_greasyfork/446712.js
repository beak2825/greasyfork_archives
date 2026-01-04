// ==UserScript==
// @name           habrClear
// @description    Clear the Habr.com layout for easy print.
// @description:ru Очищает макет Habr.com для простой печати.
// @namespace      habr
// @match          https://habr.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @version        1.1
// @author         Nikolay Raspopov
// @license        MIT
// @icon           http://habr.com/favicon.ico
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/446712/habrClear.user.js
// @updateURL https://update.greasyfork.org/scripts/446712/habrClear.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    $(document).ready( setTimeout( function(){
        $('.tm-header__container').append("<div class='clearIt' style='padding-left: 8px; padding-right: 8px;'><button type='button'> 🧹 </button></div>");
        $('.clearIt').click( function() {
            $('script').remove();
            $('noscript').remove();
            $('iframe').remove();
            $('.tm-header').remove();
            $('.tm-page__sidebar').remove();
            $('.tm-company-profile-card').remove();
            $('.tm-page-progress-bar').remove();
            $('.tm-page__header').remove();
            $('.tm-footer-menu').remove();
            $('.tm-footer').remove();
            $('.tm-base-layout__header').remove();
            $('.tm-article-sticky-panel').remove();
            $('.tm-article-presenter__footer').remove();
            $('.tm-article-presenter__meta').remove();
            $('.persona').remove();
            $('.tm-scroll-top').remove();
            $('.v-portal').remove();
            $('.Vue-Toastification__container').remove();
            $('.vue-portal-target').remove();
            $('.pswp').remove();
            $('html, body, .tm-layout__wrapper, .tm-layout, .tm-layout__container, .tm-page, .tm-page-width, .tm-page__wrapper, .tm-page__main').css({
                'background-color' : 'white',
            });
            $('.article-formatted-body table td').css({
                'border-color' : 'black',
            });
            $('.tm-page, .tm-page-width, .tm-page__main, .tm-article-presenter').css({
                'max-width' : 'none',
                'min-width' : 'none',
                'margin' : 'auto',
                'padding' : 'unset',
            });
            $('.clearIt').remove(); // self-destruct
        });
    }, 2000 ) ); // revive delay
})();
