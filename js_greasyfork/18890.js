// ==UserScript==
// @name         cloud.mail.ru ad blocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  blocks ads
// @author       mail.ru group
// @match        https://cloud.mail.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18890/cloudmailru%20ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/18890/cloudmailru%20ad%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var worked = false;
    $(document).on("DOMNodeInserted",function(e){
        if (!worked && $(".b-layout__col_1_2").length) {
            var headBlockerFunc = function(e){
                var bread = $('#breadcrumbs');
                if (!bread.length) return;
                var prev;
                while (true) {
                    prev = bread.prev();
                    if (!prev.length) break;
                    prev.remove();
                }
            };
            $(".b-layout__col_2_2").on("DOMCharacterDataModified", headBlockerFunc);
            $(".b-layout__col_2_2").on("DOMNodeInserted", headBlockerFunc);
            $(".b-layout__col_1_2").on("DOMNodeInserted",function(e){
                var children = $(".b-layout__col_1_2").children();
                if (children[5]) children[5].remove();
            });
            var previewBlockerFunc = function() {
                var wrapper = this;
                $(wrapper).find('> div:not([class])').remove();
            };
            $('div.preview__wrapper-inner').on('DOMNodeInserted', function(e) {
                var wrapper = e.target;
                previewBlockerFunc.call(wrapper);
            });
            previewBlockerFunc.call($('div.preview__wrapper-inner'));
            worked = true;
        }
    });
})();