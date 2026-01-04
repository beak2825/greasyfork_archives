// ==UserScript==
// @name            Youtube Mobile Seekable
// @author          erogemaster225
// @namespace       http://www.example.url/to/your-web-site/
// @description     Put a good description in here
// @license         Creative Commons Attribution License
// @version            0.2
// @include         http*://m.youtube.com/*
// @grant        none
// @run-at           document-start
// @released        2006-04-17
// @updated         2006-04-19
// @compatible      Greasemonkey
// @downloadURL https://update.greasyfork.org/scripts/505720/Youtube%20Mobile%20Seekable.user.js
// @updateURL https://update.greasyfork.org/scripts/505720/Youtube%20Mobile%20Seekable.meta.js
// ==/UserScript==

setInterval(function() {
if (location.href.indexOf('/watch') != -1) {
let progressBar = document.querySelector('.ytm-progress-bar')
let player = document.querySelector('video.html5-main-video')
if (!progressBar.getAttribute('tagged') && player.getAttribute('src')) {
progressBar.addEventListener('click', function(event) {
  let boundingRect = progressBar.getBoundingClientRect();
  let clickPosition = event.clientX - boundingRect.left;
  let progressBarWidth = boundingRect.width;
  let percentage = (clickPosition / progressBarWidth);
  player.currentTime = Math.floor(percentage * player.duration);
});
progressBar.setAttribute('tagged', 'true');
console.log('tagged');
}
}
}, 2000);