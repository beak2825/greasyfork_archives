// ==UserScript==
// @name         Replace BatChest with AYAYA
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces BatChest twitch chat emotes with AYAYA
// @author       gami
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
// @downloadURL https://update.greasyfork.org/scripts/436300/Replace%20BatChest%20with%20AYAYA.user.js
// @updateURL https://update.greasyfork.org/scripts/436300/Replace%20BatChest%20with%20AYAYA.meta.js
// ==/UserScript==

// Fork of Corrodias' Larger Twitch Emotes script (https://greasyfork.org/en/scripts/419584-larger-twitch-emotes)

(function() {
    'use strict';

    var scriptName = 'Replace BatChest with AYAYA';
    var ayayaSrc = "https://cdn.betterttv.net/frankerfacez_emote/162146/";
    var batChest = "BatChest";

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
                        if(node.getAttribute("alt") == batChest) {
                           runReplace(node);
                        }
                    }
                    var emotes = node.querySelectorAll('.chat-line__message--emote');
                    emotes.forEach((emote) => {
                        if(emote.getAttribute("alt") == batChest) {
                            runReplace(emote);
                        }
                    });
                });
            };
        };
        var observer = new MutationObserver(callback);
        observer.observe(chat, { childList: true, subtree: true });
        console.log(`[${scriptName}] Chat line observer added.`);
    }

    function runReplace(emote) {
        emote.src = ayayaSrc + "1";
        emote.srcset = ayayaSrc + "2 2x, " + ayayaSrc + "4 4x";
    }

    function onReady(element, callback) {
        if (element.readyState!='loading') callback();
        else element.addEventListener('DOMContentLoaded', callback);
    }
})();