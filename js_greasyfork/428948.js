// ==UserScript==
// @name         Twitch, Simplify Chat
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Simplify for chat
// @author       You
// @match        https://twitch.tv/*
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM.addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/428948/Twitch%2C%20Simplify%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/428948/Twitch%2C%20Simplify%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM.addStyle(`
.persistent-player--theatre[data-a-player-state="theatre"] {
    width: 100% !important;
}

/* === background-color === */
.right-column--theatre.right-column--beside {
    .stream-chat-header,
    .channel-root__right-column,
    .channel-root__right-column > div,
    .chat-room-component-layout,
    .chat-room__content > div div,
    .chat-room {
        background-color: #0000 !important;
    }
    .tw-transition-group {
        background-color: var(--color-background-base) !important;
    }
    .chat-room__content .chat-input {
        [data-a-target="emote-picker"],
        [role="dialog"] {
            background-color: var(--color-background-base) !important;
        }
    }
}

/* === header footer margin === */
body {
    --right-column-full-width: 70rem;
    --right-column-outside-width: 30rem;
    --right-column-outside-margin: -30rem;
    --right-column-inside-width: 40rem;
}
.right-column--theatre.right-column--beside,
.right-column--theatre.right-column--beside .channel-root__right-column {
    width: var(--right-column-inside-width) !important;
}
.right-column--theatre.right-column--beside {
    padding: 50px 0 !important;
    height: 70% !important;
    min-height: 15vh !important;
}
.right-column--theatre.right-column--beside .right-column__toggle-visibility {
    margin-top: 50px;
    position: absolute;
}

/* ===  === */
.right-column--theatre.right-column--beside {
    .channel-root__right-column > div {
        border: none !important;
    }
    .chat-list--default,
    .chat-list--other {
        width: var(--right-column-full-width) !important;
        margin-left: var(--right-column-outside-margin);
    }
    .chat-line__no-background > div {
        display: flex !important;
        justify-content: flex-end;
        width: var(--right-column-full-width) !important;
    }
    .chat-line__timestamp,
    .chat-line__username-container {
        opacity: 0.2;
        transition: opacity ease 0.2s;
    }
    :hover .chat-line__timestamp,
    :hover .chat-line__username-container {
        opacity: 1;
    }
    .chat-line__no-background [aria-hidden] {
        display: none;
    }
    [data-a-target="chat-line-message-body"] {
        width: var(--right-column-inside-width) !important;
        padding-left: 2rem;
        text-shadow: 0 0 2px #000;
    }
    .chat-room__content > div:not(.chat-list--default, .chat-list--other) {
        opacity: 0.05;
        transition: opacity ease 0.2s;
    }
    :hover .chat-room__content > div:not(.chat-list--default, .chat-list--other) {
        opacity: 1;
    }
}
    `);
})();