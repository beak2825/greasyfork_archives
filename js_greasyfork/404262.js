// ==UserScript==
// @name         FreeHostForum. Too much smiles hide.
// @namespace    FreeHostForum
// @version      0.5
// @description  Trolls are not welcome here.
// @author       Flk
// @match        https://forum.wbfree.net/*
// @grant        none
// @require
// @downloadURL https://update.greasyfork.org/scripts/404262/FreeHostForum%20Too%20much%20smiles%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/404262/FreeHostForum%20Too%20much%20smiles%20hide.meta.js
// ==/UserScript==

const emoBlacklist = [':mad:', ':confused:', ':cool:', ':eek:', ':oops:', ':rolleyes:', 'o_O', ':@popcorn:'];

(function() {
    'use strict';

    let count = hideTrollQuotedMessages() + hideTrollMessages();

    if (count != 0) {
        removeDoubles();
        reportResult(count);
    }
})();

function hideTrollQuotedMessages() {
    let quote = $(".pageContent .messageList .message article");
    return hideContent(quote, true);
}

function hideTrollMessages() {
    let content = $(".pageContent .messageList li");
    return hideContent(content, false);
}

function hideContent(content, isQuoted) {
    let messagesCount = 0;

    for (let i = 0; i < content.length; i++) {
        let emoCount = 0;
        let emos = $(content[i]).find("img.mceSmilieSprite,img.mceSmilie");

        for (let j = 0; j < emos.length; j++) {
            if (emoBlacklist.includes($(emos[j]).attr('alt'))) {
                emoCount++;
            }
        }

        if (emoCount > 2 || emos.length > 7 || (emoCount > 1 && emos.length/emoCount > 0.49)) {
            messagesCount++;

            if (isQuoted) {
                $(content[i]).parent().parent().parent().attr('data-sepukked', '1');
                $(content[i]).parent().parent().parent().html("Sepukked...");
            }
            else {
                $(content[i]).html("Sepukked...");
                $(content[i]).attr('data-sepukked', '1');
            }
        }
    }

    return messagesCount;
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
