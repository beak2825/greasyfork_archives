// ==UserScript==
// @name YouTube End Time Display
// @namespace YouTube End Time Display
// @version 1.0.0
// @description Displays the actual end time of YouTube videos next to the time display
// @author DumbGPT
// @match https://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/534822/YouTube%20End%20Time%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/534822/YouTube%20End%20Time%20Display.meta.js
// ==/UserScript==

(function() {
'use strict';

let etaElement = null;
let updateInterval = null;

function init() {
if (location.href.includes('youtube.com/watch')) {
const timeDisplay = document.querySelector('.ytp-time-display');
if (timeDisplay) {
setupEtaDisplay(timeDisplay);
} else {
setTimeout(init, 1000);
}
}
}

function setupEtaDisplay(timeDisplay) {
if (etaElement) {
etaElement.remove();
}

etaElement = document.createElement('span');
etaElement.id = 'yt-eta-display';

const timeDisplayStyleRef = timeDisplay.querySelector('.ytp-time-current') || timeDisplay;
const timeStyles = window.getComputedStyle(timeDisplayStyleRef);

etaElement.style.fontFamily = timeStyles.fontFamily;
etaElement.style.fontSize = timeStyles.fontSize;
etaElement.style.color = timeStyles.color;
etaElement.style.fontWeight = timeStyles.fontWeight;
etaElement.style.pointerEvents = 'none'; 

timeDisplay.appendChild(etaElement);

const video = document.querySelector('video');
if (video) {
updateEtaDisplay(video);

if (updateInterval) {
clearInterval(updateInterval);
}
updateInterval = setInterval(() => updateEtaDisplay(video), 1000);

video.addEventListener('seeking', () => updateEtaDisplay(video));
video.addEventListener('ratechange', () => updateEtaDisplay(video));
} else {
setTimeout(() => {
const newVideo = document.querySelector('video');
if (newVideo) setupEtaDisplay(timeDisplay);
}, 1000);
}
}

function updateEtaDisplay(video) {
if (!video || !video.duration || isNaN(video.duration) || !etaElement) return;

const isLive = document.querySelector('.ytp-live') !== null || video.duration === Infinity;
if (isLive) {
etaElement.textContent = "";
return;
}

const remainingTime = video.duration - video.currentTime;

const now = new Date();
const endTime = new Date(now.getTime() + (remainingTime * 1000 / video.playbackRate));

const hours = endTime.getHours().toString().padStart(2, '0');
const minutes = endTime.getMinutes().toString().padStart(2, '0');

etaElement.textContent = ` | ETA ${hours}:${minutes}`;
}

let lastUrl = location.href;
const observer = new MutationObserver(() => {
if (location.href !== lastUrl) {
lastUrl = location.href;

if (updateInterval) {
clearInterval(updateInterval);
updateInterval = null;
}

if (etaElement) {
etaElement.remove();
etaElement = null;
}

setTimeout(init, 1000);
}
});

observer.observe(document.body, { childList: true, subtree: true });

init();

window.addEventListener('beforeunload', () => {
if (updateInterval) {
clearInterval(updateInterval);
}
if (observer) {
observer.disconnect();
}
});
})();
