// ==UserScript==
// @name         Change the background color of Spotify lyrics.
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Spotifyの歌詞の背景色を変更するスクリプト。
// @author       telianghung@outlook.com
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498238/Change%20the%20background%20color%20of%20Spotify%20lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/498238/Change%20the%20background%20color%20of%20Spotify%20lyrics.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const fun = () =>{
         // 希望なcolor
        const active = '#fff';
        const inactive = '#000000';
        const passed = '#000000';
        const background = '#333333';
        const messaging = '#fff';

        if(!location.href.includes('https://open.spotify.com/lyrics')) return;

        const lyricsElement = document.querySelector('[aria-label="Spotify"][tabindex="-1"] > :first-child')

        if (!lyricsElement) return;


        const expected_css_text = `--lyrics-color-active: ${active}; --lyrics-color-inactive: ${inactive}; --lyrics-color-passed: ${passed}; --lyrics-color-background: ${background}; --lyrics-color-messaging: ${messaging};`;

        if (expected_css_text !==lyricsElement.style.cssText) {
            lyricsElement.style.cssText = expected_css_text
            console.log('background colorを変えた')
        }
    }

    setInterval(fun, 1000)
})();
