// ==UserScript==
// @name         Telegram.me Enhancer
// @namespace    n3tman
// @version      0.2
// @description  Removes t.me popup (proto url) for single posts, adds controls to videos, improves styles
// @author       n3tman
// @license      MIT
// @run-at       document-start
// @match        https://t.me/*
// @exclude      https://t.me/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t.me
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459089/Telegramme%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/459089/Telegramme%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cssCode = [
        '.tgme_head_wrap, .message_video_play, .message_video_duration { display: none !important; }',
        '.tgme_body_wrap { padding: 16px !important; }',
        '#widget_actions_wrap { position: static !important; margin: 0 auto !important; }',
        '#widget_actions { transition: none !important; max-width: 500px !important; border-radius: 16px !important; }',
        '.tgme_widget_message_video_player { pointer-events: none !important; }',
        '.tgme_widget_message_video { pointer-events: all !important; }'
    ].join('\n');
    GM_addStyle(cssCode);

    if (window.location.search) {
        addEventListener('DOMContentLoaded', function(event) {
            var pageVids = document.querySelectorAll('video');
            var origVid;

            if (pageVids.length > 1) {
                pageVids[0].remove();
                origVid = pageVids[1];
            }

            if (pageVids.length) {
                origVid = origVid ? origVid : pageVids[0];
                var copyVid = origVid.cloneNode();
                copyVid.controls = true;
                origVid.parentNode.replaceChild(copyVid, origVid);

                document.querySelector('.tgme_widget_message_video_player').onclick = function(event) {
                    event.preventDefault();
                    copyVid.paused ? copyVid.play() : copyVid.pause();
                }
            }
        });
    } else {
        unsafeWindow.protoUrl = '';
        unsafeWindow.setTimeout = function() {
            console.log('lol kek');
        }
    }
})();