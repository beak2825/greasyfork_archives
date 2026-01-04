// ==UserScript==
// @name         Twitch 2019 Classic Dark Theme
// @namespace    https://brandongiesing.com
// @version      1.0
// @description  Theme for September 2019 Twitch Redesign that restores the old Dark Mode Colors.
// @author       Brandon Giesing
// @grant        none
// @match       https://*.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/390542/Twitch%202019%20Classic%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/390542/Twitch%202019%20Classic%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
'use strict'
document.body.insertAdjacentHTML('beforeend', `<style>
:root {
    --color-userstyle-darkpurple-sidebar: #0f0d12;
    --color-userstyle-lightpurple-search: #6233a3;
}

.tw-root--theme-dark body {
    background-color: var(--color-twitch-purple-1)!important;
}

.tw-c-background-base {
    background-color: var(--color-twitch-purple-5)!important;
}

.tw-root--theme-dark .side-nav__overlay-wrapper {
    background-color: var(--color-userstyle-darkpurple-sidebar)!important;
}

.side-nav {
    background-color: var(--color-userstyle-darkpurple-sidebar)!important;
    color: var(--color-hinted-grey-15)!important;
}

.tw-root--theme-dark .channel-root__right-column {
    background-color: var(--color-userstyle-darkpurple-sidebar)!important;
}

.tw-root--theme-dark .chat-room {
    background-color: var(--color-userstyle-darkpurple-sidebar)!important;
}

.tw-root--theme-dark .channel-header {
    background-color: var(--color-twitch-purple-1)!important;
}

.tw-border-t {
    border-top: 1px solid var(--color-userstyle-darkpurple-sidebar)!important;
}

.tw-border-l {
    border-left: 1px solid var(--color-userstyle-darkpurple-sidebar)!important;
}

.tw-border-b {
    border-bottom: 1px solid var(--color-userstyle-darkpurple-sidebar)!important;
}

.tw-animated-glitch-logo__body {
    fill: var(--color-hinted-grey-15)!important;
}

.tw-animated-glitch-logo__face {
    fill: var(--color-twitch-purple-5)!important;
}

.tw-animated-glitch-logo__eyes {
    fill: var(--color-hinted-grey-15)!important;
}

.tw-root--theme-dark .carousel-metadata {
    background: var(--color-twitch-purple-4)!important;
}

.tw-root--theme-dark .carousel-metadata--fadeout {
    background: var(--color-twitch-purple-4)!important;
}

a[class="carousel-metadata--top-text tw-ellipsis tw-interactive tw-link"] {
    color: var(--color-hinted-grey-11)!important;
}

p[class="carousel-metadata--top-text tw-ellipsis tw-strong"] {
    color: var(--color-hinted-grey-15)!important;
}
</style>`)
})();