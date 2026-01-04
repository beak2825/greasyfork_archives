// ==UserScript==
// @name         Instant cai replies (url params)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds some params to cai chats
// @match        https://beta.character.ai/chat*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460621/Instant%20cai%20replies%20%28url%20params%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460621/Instant%20cai%20replies%20%28url%20params%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    const pattern = /https:\/\/beta\.character\.ai\/chat\?.+/;
    if (pattern.test(url) && !url.includes('stream_animation_chunk_size=0&stream_animation_chunk_delay=0')) {
        const newUrl = `${url}&stream_animation_chunk_size=0&stream_animation_chunk_delay=0`;
        window.location.href = newUrl;
    }
})();