// ==UserScript==
// @name           fandomClear
// @description    Clear the Fandom.com layout for easy print.
// @description:ru Очищает макет Fandom.com для простой печати.
// @namespace      fandom
// @match          https://*.fandom.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @version        1.2
// @author         Nikolay Raspopov
// @license        MIT
// @icon           https://www.google.com/s2/favicons?domain=fandom.com&sz=32
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/446983/fandomClear.user.js
// @updateURL https://update.greasyfork.org/scripts/446983/fandomClear.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    $(document).ready( setTimeout( function(){
        $('.page-header__actions').append("<div class='clearIt' style='padding: 8px;'><button type='button'> 🧹 </button></div>");
        $('.clearIt').click( function() {
            $('*').contents().each( function(){
                if(this.nodeType === Node.COMMENT_NODE){
                    $(this).remove();
                }
            });
            $('script').remove();
            $('noscript').remove();
            $('iframe').remove();
            $('aside').remove();
            $('footer').remove();
            $('.top-ads-container').remove();
            $('.bottom-ads-container').remove();
            $('.ad-slot').remove();
            $('.ac-widget-placeholder').remove();
            $('.community-header-wrapper').remove();
            $('.fandom-community-header__background').remove();
            $('.fandom-sticky-header').remove();
            $('.notifications-placeholder').remove();
            $('.page-footer').remove();
            $('.page-side-tools').remove();
            $('.page-side-tools__wrapper').remove();
            $('.page-header__actions').remove();
            $('.page-header__meta').remove();
            $('.page-header__languages').remove();
            $('.page__right-rail').remove();
            $('.global-navigation').remove();
            $('.render-wiki-recommendations').remove();
            $('#mixed-content-footer').remove();
            $('#WikiaBar').remove();
            $('.global-footer').remove();
            $('.wikia-bar-collapse').remove();
            $('#highlight__main-container').remove();
            $('#highlight-portal-modal-container').remove();
            $('html, body, .main-container, .page__main').css({
                'background-color' : 'white',
            });
            $('.resizable-container, .main-container, .page').css({
                'max-width' : 'none',
                'min-width' : 'none',
                'margin' : 'auto',
                'padding' : 'unset',
                'width' : '100%',
            });
            $('.clearIt').remove(); // self-destruct
        });
    }, 2000 ) ); // revive delay
})();