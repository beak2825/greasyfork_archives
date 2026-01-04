// ==UserScript==
// @name         Paja Emotes
// @namespace    http://twitch.tv/pajalockk
// @version      1.0
// @description  nowe emotki
// @author       czlowiek_enigma
// @match        https://www.twitch.tv/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374870/Paja%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/374870/Paja%20Emotes.meta.js
// ==/UserScript==

const EMOTES = {
    ZBICC2: "https://cdn.discordapp.com/attachments/503937117915709455/516717601770962947/zbicc2.png",
    ZBICC: "https://i.imgur.com/867dRfJ.png",
    pajaIEGG: "https://cdn.discordapp.com/attachments/503937117915709455/514493756305571851/lysol.png",
    PajaEZ: "https://cdn.discordapp.com/attachments/503937117915709455/514492152735334402/pajaez.png",
    AciabaKwas: "https://cdn.discordapp.com/attachments/503937117915709455/513409634589999105/aciaba_kwas.png",
};

var last_handled_message_index = 0;

(function() {
    'use strict';

    setInterval(handleMessage, 50);
})();

function handleMessage() {
    var children = $('div[role="log"] div.chat-line__message');
    var elements = children.slice(last_handled_message_index, children.length);

    elements.each(function() {
        let div = $(this);
        if(div.children('.text-fragment').length === 0) {
            return;
        }

        div.children('.text-fragment').each(function() {
            let span = $(this);

            let html = span.html();
            let splitted = html.split(' ');

            for(let i = 0; i < splitted.length; i++) {
                $.each(EMOTES, function(k, v) {
                    if(splitted[i] == k) {
                        splitted[i] = `<span data-a-target="emote-name"><img style="height: 32px;" class="chat-image chat-line__message--emote tw-inline-block" src="${v}" alt="${k}"></span>`;
                    }
                });
            }

            span.html(splitted.join(' '));
        })
    });
    last_handled_message_index = children.length;
}