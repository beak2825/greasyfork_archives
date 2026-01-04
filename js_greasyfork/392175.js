// ==UserScript==
// @description     When playing a Facebook video, this script stores the current time (minus ten seconds) so that when the page is refreshed (be-it after reopening the browser or manual refresh) or after it gets reset due to bad internet connection, the video resumes from where it stopped.
// @name            Facebook - Video Resume
// @namespace       https://www.facebook.com
// @include         https://www.facebook.com/*
// @version         3
// @grant    				GM.getValue
// @grant    				GM.setValue
// @grant    				GM.notification
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/392175/Facebook%20-%20Video%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/392175/Facebook%20-%20Video%20Resume.meta.js
// ==/UserScript==

const {max, floor} = Math;

const interval = 2e3;
var intervalId;
const rewind = 10;

window.eval(`const _wr = (type) => {
    const orig = history[type];
    return function() {
        const rv = orig.apply(this, arguments);
        const e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');
`);

String.prototype.firstMatch = function(regexp) {
  const match = this.match(regexp);
  return match && match[1];
}

const isVideoPath = (location) => /\/.*\/videos(\/.*)?\/\d+/.test(location.pathname) || /v=\d+/.test(location.search);
var location = window.location;

const getVideoId = () => location.pathname.firstMatch(/\/.*\/videos(?:\/.*)?\/(\d+)/) || location.search.firstMatch(/v=(\d+)/);
const getTimeKey = () => `${getVideoId()}fb-video`;
const setTime = (time) => GM.setValue(getTimeKey(), time);
const getTime = () => GM.getValue(getTimeKey());


const initialize = (video) => {
  console.debug(getTimeKey(), video);
  if (video) {
    getTime().then(time => {
      video.currentTime = time;
    });


    intervalId = setInterval(() => {
      const time = max(0, floor(video.currentTime) - rewind);
      //console.debug(time);
      setTime(time);
    }, interval);



    video.addEventListener('error', (e) => {
      clearInterval(intervalId);
      setTimeout(() => initialize(video), 1e3);
    });

    video.addEventListener('ended', (e) => {
      setTime(0);
    });
  }
}

if (isVideoPath(location)) {
	initialize(document.querySelector('video'));
}

const pathChanged = (e) => {
  location = window.location;
  clearInterval(intervalId);
}

new MutationObserver(ms => {
  const nodes = ms.flatMap(m => Array.from(m.addedNodes)).filter(n => n.querySelector)
  const video = nodes.map(n => n.querySelector('video')).find(v => v);
  if (isVideoPath(location) && video) {
    console.debug(video);
    clearInterval(intervalId);
		initialize(video);
  }
}).observe(document.body, {childList: true, subtree: true});

window.addEventListener('pushState', pathChanged);
window.addEventListener('replaceState', pathChanged);
window.addEventListener('popstate', pathChanged);

window.addEventListener('beforeunload', (e) => clearInterval(intervalId));