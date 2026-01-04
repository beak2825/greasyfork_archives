// ==UserScript==
// @name         fxp anti-delete PMs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  recovers deleted messages in PMs
// @author       You
// @match        https://www.fxp.co.il/private_chat.php?do=showpm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=co.il
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476628/fxp%20anti-delete%20PMs.user.js
// @updateURL https://update.greasyfork.org/scripts/476628/fxp%20anti-delete%20PMs.meta.js
// ==/UserScript==


// basic message utils
const getContentForPmId = (pmId) => {
    return new Promise((resolve, reject) => {
       $.get('https://www.fxp.co.il/private.php?do=showpm&pmid=' + pmId).then((resp) => {
           // user-agent dependant?
            const content = /<blockquote class="postcontent restore"\s+>(.*?)<\/blockquote>/gs.exec(resp);
            resolve(content[1]);
       }, (err) => {
         reject(err);
       });
    });
}

const textIdToElem = (textId) => {
    return $('[data-text-id=' + textId + ']');
}

const getPmId = (pmElem) => {
    return  pmElem.attr('id').substring(3)
}

const isDeleted = (pmElem) => {
    return pmElem.find('.deleted-message').length;
}

const designMessage = (pmClass) => {
    const messageAlign = pmClass.hasClass('left-top') ? 'left-top-alt' : 'right-top-alt';

     pmClass.removeClass('tri-right')
            .removeClass('right-top')
            .removeClass('left-top')
            .removeClass('talk-bubble');

    pmClass.addClass('talk-bubble-alt')
            .addClass('tri-right-alt')

    pmClass.addClass(messageAlign);
}

// restore
const restoreMessage = (pmElem) => {
    const pmId = getPmId(pmElem);

    getContentForPmId(pmId).then((content) => {
        const pmClass = $('#pm_' + pmId);
        const talk = pmElem.find('.talktext');
        const corrected = getCorrectMessageInLive({
            message: content
        });

        talk.find('.deleted-message').remove();
        talk.append('<p>' + corrected.trim() + '</p>');

        designMessage(pmClass);
    });
}


// core
const prepare = () => {
    // lazy to use GM resources
    $(`<style type='text/css'>
        .talk-bubble-alt {
            margin-top: 10px;
            display: inline-block;
            position: relative;
            min-width: 115px;
            width: auto;
            height: auto;
            background-color: #EE4B2B;
            max-width: 90%;
            word-wrap: break-word;
            clear: both;
            box-shadow: -1px 1px .5px rgba(0,0,0,.33);
            -moz-box-shadow: -1px 1px .5px rgba(0,0,0,.33);
            -webkit-box-shadow: -1px 1px .5px rgba(0,0,0,.33)
        }

        .right-top-alt {
            margin-right: 17px;
            float: right;
            background-color: #EE4B2B
        }

        .right-top-alt .talktext .date {
            left: 28px
        }

        .right-top-alt .talktext .read,.right-top-alt .talktext .unread,.right-top-alt .talktext .loading {
            background-size: 16px;
            width: 16px;
            height: 16px;
            position: absolute;
            left: 12px;
            bottom: 3px;
            background-repeat: no-repeat
        }

        .left-top-alt {
            margin-left: 17px;
            float: left
        }

        .tri-right-alt.left-top:after {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            left: -10px;
            right: auto;
            top: 0;
            bottom: auto;
            border: 10px solid;
            border-color: #fff transparent transparent transparent
        }

        .tri-right-alt.right-top:after {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            left: auto;
            right: -10px;
            top: 0;
            bottom: auto;
            border: 10px solid;
            border-color: #def5cd transparent transparent transparent
        }

        .talk-bubble.deleted:after {
            content: " ";
            border-color: #EE4B2B transparent transparent transparent;
        }

        .talk-bubble.deleted {
            background-color: #EE4B2B;
        }
    </style>`).appendTo('head');
}

// hook socket listeners & etc
const hook = () => {
    const func = (data) => {
        const elem = textIdToElem(data);

        designMessage(elem);
    }

    const listeners = socket.listeners('lisendeletemessage');
    for (let i = 0; i < listeners.length; ++i) {
        listeners[i] = func;
    }
    window.updateMessageDeletedFromShowPmIframe = func;

    // ugly way
    window.getMorePrivateMessage = () => {
        $.ajax({
            type: "GET",
            url: 'private_chat.php?do=showpm&pmid=' + pmid_chat + '&startwith=' + counter_get_more_pm + '&only_li=1&web=1',
            dataType: 'json',
            success: function(data) {
                'use strict';

                var last_pm_id = $($('.talk-bubble')[0]).attr('id');
                $('.chat-data').prepend(data.lis);
                enumMessages();
                $('.talk-bubble').removeClass('waitforload');
                $('.chat-data').prepend($('#load-more-message'));
                playerfxp();
                setTimeout(function() {}, 100);
                counter_get_more_pm = counter_get_more_pm + 50;
                if (data.havemore == "no") {
                    $('#load-more-message').remove();
                }
                $('.chat-data').prepend($('.holder-title'));
                $('html, body').scrollTop($("#" + last_pm_id).offset().top - $('.menu').outerHeight() - 10);
            }
        });
    }
}

const enumMessages = () => {
    $('.talk-bubble:has(.deleted-message)').each((_, obj) => {
        // ignore
        const textId = obj.getAttribute('data-text-id');
        const elem = textIdToElem(textId);

        restoreMessage(elem);
    });
}

const main = () => {
    prepare();

    enumMessages();

    hook();
}

main();