// ==UserScript==
// @name         HitSquadGodfather YouTube live stream chat spammer
// @namespace    https://greasyfork.org/en/users/160457-stan60250
// @version      1.3.1
// @description  HitSquadGodfather YouTube live stream chat spammer.
// @author       Maple(stan60250)
// @match        https://www.youtube.com/watch?v=ROGXSZgHzCg*
// @match        https://www.youtube.com/live_chat?v=ROGXSZgHzCg*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441345/HitSquadGodfather%20YouTube%20live%20stream%20chat%20spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/441345/HitSquadGodfather%20YouTube%20live%20stream%20chat%20spammer.meta.js
// ==/UserScript==

var SPAM_MESSAGE = ['hello', ':yt:', '!points'];
var IDLE_SECONDS_MIN = 60;
var IDLE_SECONDS_MAX = 300;
var STARTUP_DELAY_SECONDS = 10;

var UNICODE_SUN = '\u2600\ufe0f';
var UNICODE_MOON = '\ud83c\udf19';

(function() {
    'use strict';

    var spam_timer = STARTUP_DELAY_SECONDS;
    setInterval( function(){
        if(spam_timer <= 0) {
            spam_timer = getRandomInt(IDLE_SECONDS_MIN, IDLE_SECONDS_MAX);

            var url = window.location.href;
            if(url) {
                if(url.indexOf('/live_chat?') > -1) {
                    sendChat(document);
                } else if(url.indexOf('/watch?') > -1) {
                    var iframe = document.getElementById('chatframe');
                    var chatFrame = iframe ? (iframe.contentDocument || iframe.contentWindow.document) : null;
                    sendChat(chatFrame);
                }
            }

            console.log('wait ' + spam_timer + ' secs...');
        } else {
            setTitle('Wait ' + spam_timer + ' sec' + (spam_timer > 1 ? 's' : ''));
            spam_timer -= 1;
        }
    }, 1000);

})();

function sendChat(chatFrame) {
    if(chatFrame) {
        var chat_input = chatFrame.querySelector('div#input');
        var chat_submit = chatFrame.querySelector('#send-button > yt-button-renderer > a');
        if(chat_input && chat_submit) {
            var msg = SPAM_MESSAGE[Math.floor(Math.random() * SPAM_MESSAGE.length)];
            console.log('spam:' + msg);
            setTitle('Spam: ' + msg);
            chat_input.focus();
            chat_input.textContent = msg;
            chat_input.dispatchEvent(new Event('input', {bubles:true, cancelable:true}));
            chat_submit.click();
        } else {
            console.error('unable to find chat component');
        }
    } else {
        console.error('unable to find chat iframe');
    }
}

function setTitle(text) {
    document.title = (document.visibilityState === 'visible' ? UNICODE_SUN : UNICODE_MOON) + ' ' + text;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}