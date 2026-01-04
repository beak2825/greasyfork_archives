// ==UserScript==
// @name         FreeHostForum. Trolls hide.
// @namespace    FreeHostForum
// @version      0.6
// @description  Trolls are not welcome here.
// @author       Flk
// @match        https://forum.wbfree.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/404419/FreeHostForum%20Trolls%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/404419/FreeHostForum%20Trolls%20hide.meta.js
// ==/UserScript==
// не надо: @require      https://code.jquery.com/jquery-1.11.0.min.js

// Прописать тут ники в кавычках, через запятую.
const trolls = ['nickname1', 'nickname2'];

(function() {
    'use strict';

    let count = 0;

    for (let i = 0; i < trolls.length; i++) {
        count += removeQuotes(trolls[i]) + removeContent(trolls[i]);
    }

    if (count != 0) {
        removeDoubles();
        reportResult(count);
    }
})();

function removeQuotes(nick) {
    let quote = $(".pageContent .messageList .message article").find("[data-author='" + nick + "']");

    for (let i = 0; i < quote.length; i++) {
        $(quote[i]).parent().parent().parent().parent().parent().attr('data-sepukked', '1');
        $(quote[i]).parent().parent().parent().parent().parent().html("Sepukked...");
    }

    return quote.length;
}

function removeContent(nick) {
    let content = $(".pageContent .messageList li[data-author='" + nick + "']");

    for (let i = 0; i < content.length; i++) {
        $(content[i]).html("Sepukked...");
        $(content[i]).attr('data-sepukked', '1');
    }

    return content.length;
}

function removeDoubles() {
    let content = $(".pageContent .messageList li");
    let prevMatch = false;

    for (let i = 0; i < content.length; i++) {
        if ($(content[i]).data('sepukked') == '1') {
            if (prevMatch) {
                $(content[i]).remove();
            }

            prevMatch = true;
        }
        else {
            prevMatch = false;
        }
    }
}

function reportResult(count) {
    const reportHideTimeout = 2000;
    const fadeoutDuration = 1000;

    let bkgStyle = 'width: 100%; height: 50px; text-align: center; background-color: #222; position: fixed; bottom: 0; opacity: 0.8;';
    let style = 'width: 100%; height: 50px; font-weight: 800; text-align: center; position: fixed; bottom: 0; display: table;';

    let hint = $('<div class="trollreport">'
                 + '<div style="' + bkgStyle + '">'
                 + ' </div><div style="' + style + '">'
                 + '  <span style="display: table-cell; vertical-align: middle; color: #fff;">Sepukked '+ (count)
                 + ' записей.</span></div></div>');

    hint.appendTo('body');

    setTimeout(function() {
        $('.trollreport').fadeOut(fadeoutDuration);
        setTimeout(function() {
            $('.trollreport').remove();
        }, fadeoutDuration);
    }, reportHideTimeout);
}
