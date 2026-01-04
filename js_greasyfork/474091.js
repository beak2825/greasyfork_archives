// ==UserScript==
// @name         LZTLinkPreview
// @namespace    MeloniuM/LZT
// @version      1.1
// @description  Add preview overlay to more links in the Zelenka.guru
// @author       MeloniuM
// @license      MIT
// @match        http*://zelenka.guru/*
// @match        http*://lolz.live/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474091/LZTLinkPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/474091/LZTLinkPreview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [
        '.forum_list .text_Ads',//в рекламе спика раздела
        '.thread_view',//в темах
        '.ImViewContent, .conversationMessages',//в диалогах
        '.profilePage .messageSimpleList',//в профиле
    ];

    function addPreview(elem){
        $(elem).addClass('PreviewTooltip');
        const url = new URL(elem.href);
        $(elem).attr('data-previewurl', url.pathname.slice(1, -1) + '/preview');
        XenForo.PreviewTooltip($(elem));
    }

    $(document).ready(function(){
        if (!$('div#PreviewTooltip').length){
            $('.pageContent').append($('<div id="PreviewTooltip"><div class="previewContent"><span class="PreviewContents">Загрузка...</span></div></div>'));
        }

        $(selectors.join()).find('a[href$="/"]:not(.PreviewTooltip, [href*="?"])').filter('[href^="/threads/"], [href^="https://zelenka.guru/threads/"], [href^="https://lolz.live/threads/"]').each(function(index){
            addPreview(this);
        });
    });

    $(selectors.join()).on('DOMNodeInserted', function(event) {//при добавлении сообщения //.find('a[href^="https://zelenka.guru/threads/"], a[href^="https://lolz.live/threads/]"').filter('a[href$="/"]:not(.PreviewTooltip)')
        $(event.target).find('a[href$="/"]:not(.PreviewTooltip, [href*="?"])').filter('[href^="https://zelenka.guru/threads/"], [href^="https://lolz.live/threads/"]').each(function( index ) {
            if ($(this).closest('.chat2-inputBox, .LolzteamEditorSimple').length) return;
            addPreview(this);
        });
    });
})();