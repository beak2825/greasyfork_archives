// ==UserScript==
// @name         twitch theme
// @namespace    omega skibidi toilet 69696969
// @version      0.0.5
// @description  rahhhh
// @author       skibidi
// @match        *://*.twitch.tv/*
// @grant        none
// @license      MIT; https://mit-license.org/
// @downloadURL https://update.greasyfork.org/scripts/539408/twitch%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/539408/twitch%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = `
:root {
    --color-background-base: #42425b !important;
    --color-background-body: #545474 !important;
    --color-background-float: #545475 !important;
    --color-background-tag-default: #70709a !important;
    --color-text-tag: #4c00a0 !important;
    --color-text-base: #fff !important;
    --color-text-alt-2: #fff !important;
    --color-background-alt: #42425b !important;
    --color-background-button-secondary-default: #545475 !important;
}
.shSEm {
    --color-background-base: #42425b !important;
}
.kZtCIs, .kHFZLM {
    background-color: #545474 !important;
}
.channel-root__info .channel-info-content, .kjJPRk .top-nav, .cjHedp {
    background-color: #42425b !important;
}
.simplebar-content, .bHXUdg, .igZqfU {
    background-color: #545474 !important;
}
.iUOyOR, .kRwpQS, .GHFzH {
    --color-background-alt-2: #545474 !important;
}
.jMqYrH {
    --color-background-alt: #42425b !important;
}
.EtOcK {
    --color-background-alt: #545474 !important;
}
.jHLEAt {
    --color-background-alt-2: #42425b !important;
}
`;
    var elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
})();