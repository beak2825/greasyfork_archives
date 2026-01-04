// ==UserScript==
// @name        LectureTube Downloader - tuwien.ac.at
// @namespace   Violentmonkey Scripts
// @match       https://oc-presentation.ltcc.tuwien.ac.at/engage/theodul/ui/core.html
// @grant       none
// @version     1.0
// @author      -
// @description Adds a simple Download button to save LectureTube videos with one click
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415735/LectureTube%20Downloader%20-%20tuwienacat.user.js
// @updateURL https://update.greasyfork.org/scripts/415735/LectureTube%20Downloader%20-%20tuwienacat.meta.js
// ==/UserScript==

$(document).ready(function () {
  const timer = setInterval(function () {
    const videoRefs = document.getElementsByTagName('video');
    const controlButtons = document.getElementById('dropdownControlsButtons');
    if (videoRefs.length > 0 && controlButtons) {
      clearInterval(timer);
      const videoSrc = videoRefs[0].currentSrc;
      const videoType = videoSrc.substring(videoSrc.lastIndexOf('.'), videoSrc.length);
      const videoTitle = document.getElementById('engage_basic_description_title').innerHTML + videoType;
      controlButtons.appendChild(createDownloadButton(videoSrc, videoTitle));
    }
  }, 5000);
});

function createDownloadButton(src, title) {
  const button = document.createElement('a');
  button.setAttribute('class', 'btn btn-default');
  button.setAttribute('href', src);
  button.setAttribute('type', 'button');
  button.setAttribute('download', title);
  button.innerHTML = 'Download';
  return button;
}