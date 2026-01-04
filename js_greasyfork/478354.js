// ==UserScript==
// @name        fuck youtube
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @include     youtube.com/watch*
// @grant       none
// @version     1.1
// @author      minnie
// @description 10/20/2023, 7:59:28 PM
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478354/fuck%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/478354/fuck%20youtube.meta.js
// ==/UserScript==


// thank you for trying my code, i hope you find it helpful
// it is messy but it functions :D

window.onload = function() {
  script();
  setTimeout(script, 500); //may need to make this a higher number if you have slow internet!! this rerun script upon page reload
};

// // navigating youtube and re run script
// let initialURL = window.location.href;
// function checkURL() {
//   if (window.location.href !== initialURL) {
//     // if url has changed, re-run script
//     initialURL = window.location.href;
//     setTimeout(script, 500);
//   }
// }

// setInterval(checkURL, 500);


function script() {
const button = document.querySelector('button.ytp-large-play-button.ytp-button.ytp-large-play-button-red-bg');

const color = document.querySelector('yt-playability-error-supported-renderers');
color.style.cssText = 'background-color: transparent;'

const container = document.querySelector('div.style-scope.yt-playability-error-supported-renderers');
container.style.cssText = `
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0,0,0,0);
`;

container.innerHTML = ``;

let href = window.location.href;
let url = convertToEmbedURL(href);
let html = `
      <div style="margin-left: 2px; margin-top: 7px;" id="embed-google-map" style="height: 100%; width: 100%; max-width: 100%;">
        <embed class="frame" src="${url}" type="application/x-shockwave-flash" width="857" height="482" allowfullscreen="true">
    </div>
    <p></p>
`;

  container.innerHTML = html;
  button.click();
}


function convertToEmbedURL(link) {
    // Check if the input URL contains "youtube.com/watch?v="
    if (link.includes('youtube.com/watch?v=')) {
        // If it contains the correct format, extract the video ID
        const videoIdMatch = link.match(/[?&]v=([a-zA-Z0-9_-]+)/);
        if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            return `https://www.youtube.com/v/${videoId}?version=3&loop=1&modestbranding=1`;
        }
    }

    // Handle unrecognized URL format
    return null;
}

setTimeout(script, 3000); //