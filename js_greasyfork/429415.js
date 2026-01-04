// ==UserScript==
// @name         Youtube live comments regex filter
// @name:ru      Youtube фильтр комментариев трансляций
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Filter youtube live comments. Removes comments with japanese characters by default.
// @description:ru Фильтрует комментарии youtube трансляций. По умолчанию скрывает комментарии с японскими иероглифами.
// @author       dark1103
// @include      https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/429415/Youtube%20live%20comments%20regex%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/429415/Youtube%20live%20comments%20regex%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var reg = /^.*([一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[々〆〤]+).*$/u;

    $('yt-live-chat-app').find('YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER').each(function(e){
        var target = $(e.target);
        target.find('#message').each(function(ee){
            var text = $(this).text();
            if(reg.test(text)){
                target.hide();
            }
        });
    });


    $('yt-live-chat-app').bind("DOMSubtreeModified", function(e) {
        var target = $(e.target);
        if(target.prop("tagName") === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER'){
            target.find('#message').bind("DOMSubtreeModified", function(ee) {
                var text = $(this).text();
                if(reg.test(text)){
                    target.hide();
                }
            });
        }
    });
})();