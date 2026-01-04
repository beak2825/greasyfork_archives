// ==UserScript==
// @name         YouTube Thumbnail Viewer
// @namespace    https://greasyfork.org/en/users/1008366-trickyclock
// @version      1.1.1
// @description  Adds a button to view the thumbnail of a YouTube video!
// @author       TrickyClock
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457800/YouTube%20Thumbnail%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/457800/YouTube%20Thumbnail%20Viewer.meta.js
// ==/UserScript==

var showInDescription = true

function updateUrl(button) {
  // Get the video ID from the URL
  var videoId = window.location.href.split('v=')[1];
  var ampersandPosition = videoId.indexOf('&');
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }

  // Redirect to the thumbnail URL
  button.href = `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`;
}

function addButton() {
  var element = document.getElementById('below');
  if (showInDescription)
    element = document.getElementById("description-inline-expander").getElementsByTagName("ytd-structured-description-content-renderer")[0]
  if (element) {
    // Update the element
    if (!showInDescription)
      element.style.marginTop = '-4px';

    // If the element exists, check if the button has already been added
    var viewThumbnailButton = document.getElementById('view-thumbnail-button');
    if (!viewThumbnailButton) {
      // If the button does not exist, create it
      viewThumbnailButton = document.createElement('a');
      viewThumbnailButton.innerHTML = 'View Thumbnail';
      viewThumbnailButton.style.textDecoration = 'none';
      viewThumbnailButton.style.display = 'inline-block';
      viewThumbnailButton.style.marginTop = showInDescription ? '10px' : '6px';
      viewThumbnailButton.style.marginBottom = '-2px';
      viewThumbnailButton.style.color = 'var(--yt-spec-text-primary)';
      viewThumbnailButton.style.backgroundColor = 'var(--yt-spec-badge-chip-background)';
      viewThumbnailButton.style.border = 'none';
      viewThumbnailButton.style.padding = '6px 8px';
      viewThumbnailButton.style.fontSize = '14px';
      viewThumbnailButton.style.borderRadius = '16px'; //'8px';
      viewThumbnailButton.id = 'view-thumbnail-button';

      element.parentNode.insertBefore(viewThumbnailButton, element);
    }

    updateUrl(viewThumbnailButton);
  }
}

setInterval(() => {
  addButton();
}, 1000);