// ==UserScript==
// @name         Google Stadia - Force 4K VP9
// @namespace    https://chipwolf.uk
// @version      0.1
// @description  Forces 4K resolution and the VP9 codec on Google Stadia; especially useful for clarity on ultra widescreen monitors
// @author       Chip Wolf
// @match        *://stadia.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419906/Google%20Stadia%20-%20Force%204K%20VP9.user.js
// @updateURL https://update.greasyfork.org/scripts/419906/Google%20Stadia%20-%20Force%204K%20VP9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // source: https://gist.github.com/therocco/cfc98672d058496038755137611ea5c8

    // set local codec to VP9
    localStorage.setItem('video_codec_implementation_by_codec_key', '{"vp9":"ExternalDecoder"}');

    // set 4k dimensions and screen values
    let x = 3840;
    let y = 2160;
    let screen = [
        ['availHeight', y],
        ['availWidth', x],
        ['height', y],
        ['width', x]
    ];

    // force new screen resolution
    screen.forEach(([prop, value]) => {
        Object.defineProperty(window.screen, prop, {
            value,
            configurable: true
        });
    });
})();