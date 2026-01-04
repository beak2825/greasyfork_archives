// ==UserScript==
// @name         YouTube Volumer
// @namespace    me.nzws.us.yt_volumer
// @version      1.0.0
// @description  Add minor adjustment volume editor to youtube. Change with Enter.
// @author       nzws
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385628/YouTube%20Volumer.user.js
// @updateURL https://update.greasyfork.org/scripts/385628/YouTube%20Volumer.meta.js
// ==/UserScript==

function watcher() {
    const video = document.querySelector('video');
    const container = document.querySelector('#container.ytd-video-primary-info-renderer');
    const volumer = document.getElementById('me_nzws_us_yt_volumer');
    if (!container || volumer) return;

    const element = document.createElement('div');
    element.id = 'me_nzws_us_yt_volumer';
    element.style.marginBottom = '10px';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = parseInt(video.volume * 100 * 10) / 10;
    input.addEventListener('keypress', e => {
        if (e.keyCode === 13) {
            onChange(input.value);
        }
    });

    input.placeholder = 'Volume (0 ~ 100) / Change with Enter';
    input.title = 'Volume (0 ~ 100) / Change with Enter';
    input.style.width = '250px';
    input.style.maxWidth = '100%';

    element.appendChild(input);

    container.insertBefore(element, container.firstChild);
}

function onChange(value) {
    const video = document.querySelector('video');
    const volume = parseInt(value * 10) / 10 * 0.01;

    video.volume = volume;
}

(function() {
    setInterval(watcher, 1000);
})();