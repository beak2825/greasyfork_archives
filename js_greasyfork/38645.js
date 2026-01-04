// ==UserScript==
// @name     DI.fm tracks on demand
// @description Adds audio player to individual track pages.
// @namespace http://darkdaskin.tk/
// @version  2
// @grant    none
// @include  https://www.di.fm/*
// @downloadURL https://update.greasyfork.org/scripts/38645/DIfm%20tracks%20on%20demand.user.js
// @updateURL https://update.greasyfork.org/scripts/38645/DIfm%20tracks%20on%20demand.meta.js
// ==/UserScript==

function isTrackPage() {
    return location.pathname.match(/\/tracks\/\d+/);
}

function insertPlayer () {
    const eventBusScriptTag = [...document.querySelectorAll('script')].filter(e => e.innerHTML.match(/TrackDetailApp/))[0];
    if (!eventBusScriptTag) return;

    const trackData = JSON.parse(eventBusScriptTag.innerHTML.match(/\{.*?(\{.*\}).*?\}/)[1]);
    const mediaUrl = trackData.track.content.assets[0].url;

    const audioTag = document.createElement('audio');
    audioTag.src = mediaUrl;
    audioTag.controls = true;
    audioTag.style.display = 'block';
    audioTag.style.width = '100%';
    audioTag.id = 'track-on-demand';
    document.querySelector('.detail-wrap').appendChild(audioTag);
}

// When page is loaded directly
if (isTrackPage()) insertPlayer();

// When page is loaded via AJAX
var observer = new MutationObserver(mutations => {
    const isContentAreaAdded = mutations.some(m => [...m.addedNodes].some(e => e.classList && e.classList.contains('content-area')));
    if (isContentAreaAdded && isTrackPage() && !document.querySelector('#track-on-demand')) insertPlayer();
});
observer.observe(document.querySelector('#content-wrap'), {childList: true});
