// ==UserScript==
// @name         LZT_RandomMessage
// @namespace    MeloniuM/LZT
// @version      1.0
// @description  RandomMessage on big threads
// @author       MeloniuM
// @match        https://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491500/LZT_RandomMessage.user.js
// @updateURL https://update.greasyfork.org/scripts/491500/LZT_RandomMessage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("<style>").prop("type", "text/css").html(".RandomMessage {background-color: rgb(34 51 40) !important;};").appendTo("head");


    $(document).ready(function(){
        let pages = $('.PageNav nav:has(.currentPage[rel="start"]) a');
        if (pages.length > 1) {
            let page = pages[Math.floor(Math.random() * (pages.length - 2) + 2)];
            XenForo.ajax(page.href, {}, function(ajaxData) {
                if (!XenForo.hasResponseError(ajaxData)) {
                    let messages = $(ajaxData.templateHtml).filter('.message');
                    let message = $(messages[Math.floor(Math.random() * messages.length)]);
                    message.addClass('RandomMessage');
                    message.xfInsert('appendTo', '#messageList', 'xfFadeIn', 0).xfActivate();
            }
            })
        }
    })
})();