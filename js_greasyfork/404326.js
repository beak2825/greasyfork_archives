// ==UserScript==
// @name         FreeHostForum. Too much smiles hide by user.
// @namespace    FreeHostForum
// @version      0.1
// @description  Trolls are not welcome here.
// @author       Flk
// @match        https://forum.wbfree.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404326/FreeHostForum%20Too%20much%20smiles%20hide%20by%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/404326/FreeHostForum%20Too%20much%20smiles%20hide%20by%20user.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const users = ['--usd-'];

    let count = 0;

    for (let i = 0; i < users.length; i++) {
        count += hideTrollQuotedMessages(users[i]) + hideTrollMessages(users[i]);
    }


    if (count != 0) {
        removeDoubles();
        reportResult(count);
    }
})();

function hideTrollQuotedMessages(user) {
    let quote = $(".pageContent .messageList .message article");
    let count = 0;

    for (let i = 0; i < quote.length; i++) {
        if ($(quote[i]).find("[data-author='" + user + "']").length != 0) {
            if ($(quote[i]).find("img.mceSmilieSprite").length > 2) {
                count++;
                $(quote[i]).parent().parent().parent().attr('data-sepukked', '1');
                $(quote[i]).parent().parent().parent().html("Sepukked...");
            }
        }
    }

    return count;
}

function hideTrollMessages(user) {
    let content = $(".pageContent .messageList li[data-author='" + user + "']");
    let count = 0;

    for (let i = 0; i < content.length; i++) {
        if ($(content[i]).find("img.mceSmilieSprite").length > 2) {
            count++;
            $(content[i]).html("Sepukked...");
            $(content[i]).attr('data-sepukked', '1');
        }
    }

    return count;
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
