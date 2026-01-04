// ==UserScript==
// @name         Mastodon Streamer Mode
// @namespace    me.nzws.us.mastodon-streamer-mode
// @version      1.0.0
// @description  Hide Private or Direct posting from Mastodon timeline
// @author       nzws
// @match        https://don.nzws.me/*
// @match        https://mstdn.jp/*
// @match        https://mastodon.cloud/*
// @match        https://pawoo.net/*
// @match        https://best-friends.chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387433/Mastodon%20Streamer%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/387433/Mastodon%20Streamer%20Mode.meta.js
// ==/UserScript==

const css = document.createElement('style');
css.innerHTML = `
.status__wrapper-private, .status__wrapper-direct {
    display: none
}
`;
document.head.appendChild(css);

window.onload = () => {
    'use strict';
    const mastodon = document.querySelector('.app-body #mastodon');
    if (!mastodon) return;

    const composeForm = document.querySelector('.compose-form');
    const div = document.createElement('div');
    div.textContent = 'Streamer Mode is Enabled';
    div.style.margin = '5px 0';
    div.style.padding = '5px 0';
    div.style.background = 'purple';
    div.style.color = 'white';
    div.style.textAlign = 'center';

    composeForm.appendChild(div);
};