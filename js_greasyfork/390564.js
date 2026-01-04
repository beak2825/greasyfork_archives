// ==UserScript==
// @name 2019 Twitch Old Dark Mode Enabler
// @version 1.0
// @description Sets twitch' new darkmode into eye friendly darkmode.
// @author NeRo
// @homepage https://greasyfork.org/de/scripts/390564-2019-twitch-old-dark-mode-enabler
// @grant none
// @include http://*.twitch.tv/*
// @include https://*.twitch.tv/*
// @exclude http://api.twitch.tv/*
// @exclude https://api.twitch.tv/*
// @exclude https://clips.twitch.tv/*
// @exclude http://tmi.twitch.tv/*
// @exclude https://tmi.twitch.tv/*
// @exclude http://*.twitch.tv/*/dashboard
// @exclude https://*.twitch.tv/*/dashboard
// @exclude http://chatdepot.twitch.tv/*
// @exclude https://chatdepot.twitch.tv/*
// @exclude http://im.twitch.tv/*
// @exclude https://im.twitch.tv/*
// @exclude http://platform.twitter.com/*
// @exclude https://platform.twitter.com/*
// @exclude http://www.facebook.com/*
// @exclude https://www.facebook.com/*
// @namespace https://greasyfork.org/users/380090
// @downloadURL https://update.greasyfork.org/scripts/390564/2019%20Twitch%20Old%20Dark%20Mode%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/390564/2019%20Twitch%20Old%20Dark%20Mode%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
    addGlobalStyle('.simplebar-scroll-content { color: rgb(252, 15, 15)!important; }');
    addGlobalStyle('.chat-input { background-color: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.chat-room__content { background-color: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.rooms-header { background-color: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.tw-root--theme-dark {--color-background-body: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.tw-root--theme-dark {--color-background-alt: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.chat-input__textarea:focus { background-color: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.channel-info-bar { background-color: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.simplebar-scroll-content { background-color: rgb(15, 15, 15)!important; color: rgb(255,255,255)!important }');
    addGlobalStyle('.channel-panels { background-color: rgb(30, 30, 30)!important; }');
    addGlobalStyle('.channel-root { background-color: rgb(30, 30, 30)!important; }');
    addGlobalStyle('.text-fragment { color: rgb(255,255,255)!important; }');
    addGlobalStyle('h5 { color: rgb(255,255,255)!important; }');
    addGlobalStyle('h2 { color: rgb(255,255,255)!important; }');
    addGlobalStyle('.mention-fragment { color: rgb(255,255,255)!important; }');
    addGlobalStyle('.mention-fragment--recipient { color: rgb(10,10,10)!important; font-weight: 600!important; }');
    addGlobalStyle('title { color: rgb(255,255,255)!important; }');
    addGlobalStyle('p { color: rgb(255,255,255)!important; }');
    addGlobalStyle('li { color: rgb(255,255,255)!important; }');
    addGlobalStyle('#carousel-description { color: rgb(255,255,255)!important; }');
    addGlobalStyle('.side-nav__scrollable_content { background-color: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.tw-textarea:focus { background-color: rgb(15, 15, 15)!important; }');
    addGlobalStyle('.top-nav__menu { color: rgb(119,44,232)!important; }');
    addGlobalStyle('.tw-root--theme-dark body { background-color: #2f3136 !important; }');
    addGlobalStyle('.tw-root--theme-dark .chat-room { background: #212126 !important; }');
    addGlobalStyle('.tw-root--theme-dark .channel-root__right-column { background: #18181b !important; }');
    addGlobalStyle('.tw-root--theme-dark {--color-background-base: rgb(100, 65, 164)!important; }');
    addGlobalStyle('.tw-root--theme-dark { --color-background-accent: #4b367c !important; }');
    addGlobalStyle('.tw-root--theme-dark { --color-background-button-primary-default: #4b367c !important; }');
    addGlobalStyle('.tw-root--theme-dark { --color-background-accent-alt-2: #4b367c !important; }');
    addGlobalStyle('.tw-root--theme-dark .chat-viewers__pane { background: #212126 !important; )');
})();