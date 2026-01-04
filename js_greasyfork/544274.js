// ==UserScript==
// @name         SPL (SimplePatreonLoader)
// @author       IPV4
// @version      1.0
// @description  Loads Patreon-gated Vimeo videos
// @match        https://vimeo.com/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1500459
// @downloadURL https://update.greasyfork.org/scripts/544274/SPL%20%28SimplePatreonLoader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544274/SPL%20%28SimplePatreonLoader%29.meta.js
// ==/UserScript==

(function () {
  const currentUrl = window.location.href;
  const iframeElement = document.getElementsByClassName('iframe')[0];

  if (!iframeElement) return;

  // Try to extract video ID from the URL
  const videoId = currentUrl.length === 38
    ? currentUrl.slice(18, 27)
    : currentUrl.slice(-9);

  console.log("Video ID:", videoId);

  // Request the video from Vimeo
  GM_xmlhttpRequest({
    method: 'GET',
    url: `https://player.vimeo.com/video/${videoId}`,
    headers: { Referer: 'https://www.patreon.com' },
    responseType: 'blob',
    onload: function (response) {
      const blobUrl = URL.createObjectURL(response.response);

      // Replace body content with video
      document.body.innerHTML = '';
      document.body.style.backgroundColor = '#212121';
      document.body.style.color = '#ffffff';

      const iframe = document.createElement('iframe');
      iframe.src = blobUrl;
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';

      document.body.appendChild(iframe);
    }
  });
})();