// ==UserScript==
// @name         LZTHideCopyButton
// @namespace    MeloniuM/LZT
// @version      2.3
// @description  Расширение позволяет копировать соддержимое хайда по кнопке
// @author       MeloniuM
// @license      MIT
// @match        *://zelenka.guru/threads/*
// @match        *://lolz.guru/threads/*
// @match        *://lolz.live/threads/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466735/LZTHideCopyButton.user.js
// @updateURL https://update.greasyfork.org/scripts/466735/LZTHideCopyButton.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addButton($target) {
        const i = $('<i class="fa--xf far fa-paste HideCopy" data-phr="Содержимое было скопировано в буфер обмена" aria-hidden="true" style="margin-left: 5px"></i>');
        $target.append(i);
        i.on('click', function(event) {//при клике
            const hideContainer = $(event.target).closest('.bbCodeBlock.bbCodeQuote.bbCodeHide').find('.hideContainer').first();
            if (hideContainer.data('bbcode')){
                navigator.clipboard.writeText(hideContainer.data('bbcode')).then(function() {
                    event.target.classList.add("animated");
                    animateCSS(event.target, ["heartBeat", "mainc"]);
                    XenForo.alert(event.target.getAttribute("data-phr"), "", 5e3);
                });
                return;
            }
            const container = hideContainer.clone();
            container.find('.quoteExpand, .bbCodeHide .attribution.type').remove();//удаляем лишнее
            const re = /^(\[QUOTE\])([\s\S]*?)(\[\/QUOTE\])$/gm;

            XenForo.ajax('/editor/to-bb-code', {html: container.prop('outerHTML')}, function(ajaxData){
                const bbcode = ajaxData.bbCode.replace(re, "$2").trim() || '';
                navigator.clipboard.writeText(bbcode).then(function() {
                    event.target.classList.add("animated");
                    animateCSS(event.target, ["heartBeat", "mainc"]);
                    XenForo.alert(event.target.getAttribute("data-phr"), "", 5e3);
                });
                hideContainer.data('bbcode', bbcode);
            });
        })
    };

    $( document ).ready(function() {//при загрузке
        $('.bbCodeBlock.bbCodeQuote.bbCodeHide .attribution.type:not(:has( i.HideCopy))').each(function( index ) {
            addButton($( this ));
        });
    });

    $('.messageList').on('DOMNodeInserted', function(event) {//при добавлении сообщения
        if($(event.target).is('.comment, .message')) return;
        $(event.target).find('.bbCodeBlock.bbCodeQuote.bbCodeHide .attribution.type:not(:has( i.HideCopy))').each(function( index ) {
            addButton($( this ));
        });
    });
})();