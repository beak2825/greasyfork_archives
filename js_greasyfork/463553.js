// ==UserScript==
// @name         FreeSound Shortcuts (New)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Up/Down to play sample, Enter to Open page, R to replay, Space to play/pause. Doesn't work on new UI.
// @author       houkanshan
// @match        https://freesound.org/*
// @icon         https://freesound.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463553/FreeSound%20Shortcuts%20%28New%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463553/FreeSound%20Shortcuts%20%28New%29.meta.js
// ==/UserScript==
//
// GistID: 316b7cc64a84e7d564f4ce70289948f3

(function() {
    'use strict';
    const allSoundEls = [...document.querySelectorAll('.sample_player_small')];
    const soundCount = allSoundEls.length;
    let currentSoundIndex = -1;
    let currentEl;

    if (!soundCount) {
        console.log('found no sound, return');
        return;
    }
    console.log('found', soundCount, 'sounds');

    // append style
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = `
    [data-current-playing] { overflow: initial; display: flex; justify-content: space-between; position: relative; }
    [data-current-playing]::after { content: ''; position: absolute; inset: -10px; pointer-events: none; border-radius: 0 4px 4px 4px; border: 2px solid #71a9ff; }
    [data-current-playing] .metadata {
        position: absolute; bottom: 100%; left: -10px; margin-bottom: 10px; width: 300px; white-space: pre-line;
        display: flex;
        color: white;
        line-height: 1;
    }
    [data-current-playing] .metadata a {
        color: inherit;
        border-radius: 4px 4px 0 0;
        width: max-content;
        overflow: hidden;
        background: black;
        font-size: 0;
        text-align: center;
    }
    [data-current-playing] .metadata a::before {
        font-size: 10px;
        padding: 2px 10px;
        display: block;
    }
    .mp3_file { background: green !important; }
    .ogg_file { background: orange !important; }
    .mp3_file::before { content: 'mp3'; }
    .ogg_file::before { content: 'ogg'; }
    .metadata :is(.spectrum, .duration, .waveform) { display: none };
    `;

    function turnPage(step /* 1 or -1*/) {
        const stepName = step > 0 ? 'next' : 'previous';
        const link = document.querySelector(`.${stepName}-page a`);
        link?.click();
    }

    function play(index, { autoTurnPage } = {}) {
        if (autoTurnPage) {
            if (index < 0) return turnPage(-1);
            if (index >= soundCount) return turnPage(1);
        }

        index = Math.min(soundCount - 1, Math.max(0, index));
        currentSoundIndex = index;

        // clean up style
        document.querySelectorAll('[data-current-playing]').forEach(el => {
            el.toggleAttribute('data-current-playing', false);
            const playBtn = el.querySelector('a.play');
            if (playBtn.classList.contains('on')) {
                playBtn.click();
            }
        });

        // add style
        currentEl = allSoundEls[index];
        currentEl.toggleAttribute('data-current-playing', true);
        currentEl.scrollIntoView({ block: 'center', behavior: 'smooth' });

        // play (click the timeline so we can always replay from the beginning)
        currentEl.querySelector('.background').click();

        // make link downloadable
        currentEl.querySelectorAll('.metadata a').forEach(el => {
            el.download = '';
            el.target = '_blank';
        });

        // I can read the audio file and play it directly but then there'll be no visual indicator (e.g. progress bar).
    }

    document.addEventListener('keydown', e => {
        console.log('keydown', e.key);
        if (e.altKey || e.metaKey || e.shiftKey || e.ctrlKey) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'j':
                return play(currentSoundIndex + 1, { autoTurnPage: true });
            case 'ArrowUp':
            case 'k':
                return play(currentSoundIndex - 1, { autoTurnPage: true });
            case 'r':
                return play(currentSoundIndex);
            case 'Enter':
                return currentEl?.querySelector('.title').click();
            case 'Space':
                return currentEl?.querySelector('a.play')?.click();
        }
    });

})();