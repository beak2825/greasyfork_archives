// ==UserScript==
// @name        Fluid Mastodon
// @description Mastodon, taking all available width, assuming 3 columns (mastodon.technology, mastodon.social and w3c.social only; fork for other domains)
// @namespace   https://tripu.info/
// @version     0.3.2
// @include     http://mastodon.technology/*
// @include     https://mastodon.technology/*
// @include     http://mastodon.social/*
// @include     https://mastodon.social/*
// @include     http://w3c.social/*
// @include     https://w3c.social/*
// @license     MIT
// @supportURL  https://tripu.info/
// @author      tripu
// @downloadURL https://update.greasyfork.org/scripts/30240/Fluid%20Mastodon.user.js
// @updateURL https://update.greasyfork.org/scripts/30240/Fluid%20Mastodon.meta.js
// ==/UserScript==

console.debug('[Fluid Mastodon] Start');

(() => {
    'use strict';
    if (document && document.getElementsByTagName && document.createElement) {
        var head = document.getElementsByTagName('head');
        if (head && 1 === head.length) {
            const style = document.createElement('style');
            head = head[0];
            style.innerText = `
                .columns-area > .drawer,
                .columns-area > .column,
                .columns-area > .column__wrapper {
                    width: 33%;
                }
                .columns-area > .column__wrapper > .column {
                    width: 100%;
                }
            `;
            head.appendChild(style);
            console.debug('[Fluid Mastodon] ✓ Done');
        } else {
            console.debug('[Fluid Mastodon] ✗ No head');
        }
    } else {
        console.debug('[Fluid Mastodon] ✗ No document');
    }
})();

console.debug('[Fluid Mastodon] End');
