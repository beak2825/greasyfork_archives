// ==UserScript==
// @name         Larger Twitch Emotes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Doubles both the height and the width of emotes in Twitch chat. Uses the high-resolution images, if available.
// @author       Corrodias
//
// @include     http://twitch.tv/*
// @include     https://twitch.tv/*
// @include     http://*.twitch.tv/*
// @include     https://*.twitch.tv/*
//
// @exclude     http://api.twitch.tv/*
// @exclude     https://api.twitch.tv/*
//
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/419584/Larger%20Twitch%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/419584/Larger%20Twitch%20Emotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scriptName = 'Larger Twitch Emotes';
    var targetSize = '56px';

    console.log(`[${scriptName}] Loaded.`);
    onReady(document, function(event) {
        var chat = document.querySelector('.chat-scrollable-area__message-container');
        if (chat) {
            initialize(chat);
            return;
        }

        var callback = function(mutationsList, observer) {
            for (var mutation of mutationsList) {
                mutation.addedNodes.forEach((node) => {
                    var chat = (node.classList && node.classList.contains('chat-scrollable-area__message-container')) ? node : node.querySelector ? node.querySelector('.chat-scrollable-area__message-container') : null;
                    if (chat) {
                        initialize(chat);
                        // Disconnecting seemed to cause some problems, though I don't remember exactly when. It may have been on host/raid channel changes.
                        //observer.disconnect();
                        //console.log(`[${scriptName}] Chat panel observer removed.`);
                        return;
                    }
                });
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
        console.log(`[${scriptName}] Chat panel observer added.`);
    });

    function initialize(chat) {
        var callback = function(mutationsList, observer) {
            for (var mutation of mutationsList) {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('chat-line__message--emote')) {
                        runReplace(node);
                    }
                    var emotes = node.querySelectorAll('.chat-line__message--emote');
                    emotes.forEach((emote) => {
                        runReplace(emote);
                    });
                });
            };
        };
        var observer = new MutationObserver(callback);
        observer.observe(chat, { childList: true, subtree: true });
        console.log(`[${scriptName}] Chat line observer added.`);
    }

    function runReplace(emote) {
        let srcset = emote.srcset;
        if (srcset) {
            let match = srcset.match(/((https:)?[^\s]*?) 2x/);
            if (match && match.length > 0) {
                let x2url = match[1];
                //console.log(`[${scriptName}] Replacing emote ${srcset} with ${x2url}`);
                emote.removeAttribute('srcset');
                emote.src = x2url;
            }
        }
        emote.style.height = targetSize; // aspect ratio is preserved
        if (emote.classList && emote.classList.contains('ffz-emoji')) emote.style.width = targetSize;
        emote.style['image-rendering'] = 'pixelated';
    }

    function onReady(element, callback) {
        if (element.readyState!='loading') callback();
        else element.addEventListener('DOMContentLoaded', callback);
    }
})();
