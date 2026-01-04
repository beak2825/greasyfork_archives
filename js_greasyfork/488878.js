// ==UserScript==
// @name        Youtube Downloader
// @namespace   http://tampermonkey.net/
// @version     2.1.5
// @description Download MP4, MP3 HIGH QUALITY without external services and more.
// @author      Memi
// @match       https://*.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/488878/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/488878/Youtube%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function loadScript() {
    console.log('Script running by: Memi');

    const downloadExternal = `
      <style>
        .external_link {
          background-color: green;
          border-radius: 20px;
          padding: 8px 16px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .external_link:hover {
          background-color: darkgreen;
        }
      </style>
      <button title="External Download" type="button" class="external_link">
        <span style="font-weight: bold;">Download</span>
      </button>
    `;

    // Find the like button
    const likeButton = document.querySelector('.style-scope.ytd-menu-renderer');
    if (likeButton) {
      // Insert the download button after the like button
      likeButton.insertAdjacentHTML('afterend', downloadExternal);
    }

    const externalLink = document.querySelector('.external_link');
    if (externalLink) {
      externalLink.onclick = () => {
        const urlParams = new URLSearchParams(window.location.search); // URL parameters
        let videoId = urlParams.get('v');
        window.open(
          `https://www.y2mate.com/convert-youtube/${videoId}`,
          'popUpWindow',
          'height=800,width=1000,left=50%,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=yes,location=no,directories=yes,status=no'
        );
      };
    }
  }

  setTimeout(() => {
    loadScript();
  }, 3000);
})();
