// ==UserScript==
// @name         Youtube Playlist Duration Calculator (Forked)
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  Calculate the duration of a playlist and display it next to the number of videos. Also detects and displays video playback speed.
// @author       HellFiveOsborn (Forked from DenverCoder1)
// @icon         https://i.imgur.com/FwUCnbF.png
// @source       https://greasyfork.org/pt-BR/scripts/407457-youtube-playlist-duration-calculator
// @match        https://www.youtube.com/playlist?list=*
// @match        https://www.youtube.com/watch?v=*&list=*
// @match        https://www.youtube.com/watch?v=*
// @exclude      https://www.youtube.com/shorts/*
// @exclude      https://www.youtube.com/
// @exclude      https://www.youtube.com/feed/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522366/Youtube%20Playlist%20Duration%20Calculator%20%28Forked%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522366/Youtube%20Playlist%20Duration%20Calculator%20%28Forked%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Converts a time string in the format "HH:MM:SS" or "MM:SS" or "SS" to the total number of seconds.
   *
   * @param {string} timeString - The time string to convert, formatted as "HH:MM:SS", "MM:SS", or "SS".
   * @returns {number} The total number of seconds represented by the input time string.
   */
  function timeToSeconds(timeString) {
    const parts = timeString.split(':').map(Number).reverse(); // Split by ':' and reverse the array
    let seconds = 0;
    if (parts[0]) seconds += parts[0]; // Add seconds
    if (parts[1]) seconds += parts[1] * 60; // Add minutes converted to seconds
    if (parts[2]) seconds += parts[2] * 3600; // Add hours converted to seconds
    return seconds;
  }

  /**
   * Calculate the duration of a playlist
   *
   * @returns {string} Duration of the playlist in a human readable format
   */
  function calculateDuration() {
    // get data object stored on Youtube's website
    const data = window.ytInitialData;

    // Extracts the two main content structures from the data object using destructuring.
    const { twoColumnBrowseResultsRenderer, twoColumnWatchNextResults } = data.contents || {};

    // Safely access nested properties with optional chaining to avoid runtime errors
    const browseContents = twoColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content;

    // Attempt to get the playlist content from the watch next results
    const watchNextContents = twoColumnWatchNextResults?.playlist?.playlist;

    // Try to extract the list of videos from one of the known content structures.
    const vids = browseContents?.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents[0]?.playlistVideoListRenderer?.contents
              || watchNextContents?.contents;

    // Calculate the total duration of all videos in seconds
    const seconds = vids.reduce(function (x, y) {
      const videoRenderer = y.playlistVideoRenderer || y.playlistPanelVideoRenderer;
      if (!videoRenderer) return x;

      // If 'lengthSeconds' is available and valid, use it directly
      if (!isNaN(videoRenderer.lengthSeconds)) {
        return x + parseInt(videoRenderer.lengthSeconds);
      }
      // If 'lengthText.simpleText' is available, convert it to seconds
      else if (videoRenderer.lengthText?.simpleText) {
        return x + timeToSeconds(videoRenderer.lengthText.simpleText);
      }
      // If neither is available, return the current total
      return x;
    }, 0);

    // divide by 60 and round to get the number of minutes
    const minutes = Math.round(seconds / 60);

    // if there is at least 1 hour, display hours and minutes, otherwise display minutes and seconds.
    const durationString =
      minutes >= 60 // if minutes is 60 or more
        ? Math.floor(minutes / 60) + "h " + (minutes % 60) + "m" // calculate hours and minutes
        : Math.floor(seconds / 60) + "m " + (seconds % 60) + "s"; // calculate minutes and seconds

    return durationString;
  }

  /**
   * Append the duration to the playlist metadata
   */
  function appendDurationToPlaylistMetadata() {
    const metadataRow = document.querySelectorAll('div.yt-content-metadata-view-model-wiz__metadata-row')[3]
    if (!metadataRow) return;

    const durationString = calculateDuration();

    // Create a new span for the duration
    const durationSpan = document.createElement('span');
    durationSpan.className = 'yt-core-attributed-string yt-content-metadata-view-model-wiz__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color';
    durationSpan.setAttribute('dir', 'auto');
    durationSpan.setAttribute('role', 'text');
    durationSpan.textContent = durationString;
    durationSpan.style.color = '#ff0'; // Highlight color

    // Add a delimiter before the duration
    const delimiterSpan = document.createElement('span');
    delimiterSpan.className = 'yt-content-metadata-view-model-wiz__delimiter';
    delimiterSpan.setAttribute('aria-hidden', 'true');
    delimiterSpan.textContent = '•';

    // Append the delimiter and duration to the metadata row
    metadataRow.appendChild(delimiterSpan);
    metadataRow.appendChild(durationSpan);

    console.debug('Duration of playlist:', durationString);
  }

  /**
   * Append the duration to the playlist header when watching a video in a playlist
   */
  function appendDurationToPlaylistHeader() {
    const headerDescription = document.querySelectorAll('div#publisher-container')[2];
    if (!headerDescription) return;

    waitForElement('.html5-video-container > video').then(() => {
      const videoElement = document.querySelector('.html5-video-container > video');
      if (!videoElement) return;

      const speed = videoElement.playbackRate;
      const durationString = calculateDuration();

      // Calculate the adjusted duration if playback speed is not 1x
      const totalSeconds = parseInt(durationString.split(' ').reduce((acc, val) => {
        if (val.includes('h')) acc += parseInt(val) * 3600;
        if (val.includes('m')) acc += parseInt(val) * 60;
        if (val.includes('s')) acc += parseInt(val);
        return acc;
      }, 0));

      const adjustedDuration = speed !== 1 ? totalSeconds / speed : totalSeconds;

      // Format adjusted duration into hours, minutes, and seconds
      const hours = Math.floor(adjustedDuration / 3600);
      const minutes = Math.floor((adjustedDuration % 3600) / 60);
      const seconds = Math.floor(adjustedDuration % 60);

      // Create a human-readable string
      const formattedDuration =
        hours > 0
          ? `${hours}h ${minutes.toString().padStart(2, '0')}m`
          : `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

      // Remove the previous duration if it exists
      if (document.querySelector('#playlist-duration-calculated')) {
        // If the duration is the same, don't update
        if (document.querySelector('#playlist-duration-calculated').textContent === formattedDuration) return;

        document.querySelector('#playlist-duration-calculated').remove();
      }

      console.debug('Playback speed:', speed);
      console.debug('Duration of playlist:', durationString);
      console.debug('Adjusted duration:', formattedDuration);

      // Create a new span for the duration
      const durationSpan = document.createElement('div');
      durationSpan.className = 'index-message-wrapper style-scope ytd-playlist-panel-renderer';
      durationSpan.id = 'playlist-duration-calculated';
      durationSpan.setAttribute('dir', 'auto');
      durationSpan.setAttribute('role', 'text');
      durationSpan.textContent = `${formattedDuration}`;
      durationSpan.style.marginLeft = '5px'; // Add margin to the left
      durationSpan.style.color = '#ff0'; // Highlight color

      // Append the duration to the header description
      headerDescription.appendChild(durationSpan);
    });
  }

  /**
   * Detect video playback speed and display calculated duration
   */
  function detectPlaybackSpeed() {
    const videoElement = document.querySelector('.html5-video-container > video');
    if (!videoElement) return;

    const speed = videoElement.playbackRate;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    // Only display if playback speed is not 1x
    if (speed !== 1) {
      const calculatedDuration = (duration - currentTime) / speed;

      const timeWrapper = document.querySelector('.ytp-time-wrapper');
      if (!timeWrapper) return;

      let calculatedDurationElement = timeWrapper.querySelector('.ytp-time-duration-calculed');
      if (!calculatedDurationElement) {
        calculatedDurationElement = document.createElement('span');
        calculatedDurationElement.className = 'ytp-time-duration-calculed';
        calculatedDurationElement.style.color = '#ff0'; // Highlight color
        timeWrapper.appendChild(calculatedDurationElement);
      }

      const minutes = Math.floor(calculatedDuration / 60);
      const seconds = Math.floor(calculatedDuration % 60);
      calculatedDurationElement.textContent = ` (${minutes}:${seconds.toString().padStart(2, '0')})`;
      return calculatedDurationElement;
    } else {
      // Remove the calculated duration if speed is back to 1x
      const calculatedDurationElement = document.querySelector('.ytp-time-duration-calculed');
      if (calculatedDurationElement) {
        calculatedDurationElement.remove();
      }
      return null;
    }
  }

  /**
   * Wait for an element using an observer
   *
   * @param {string} selector Selector to wait for
   *
   * @see https://stackoverflow.com/a/61511955
   */
  function waitForElement(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver((_) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  /**
   * Check if the current page is a playlist or a single video
   */
  function isPlaylistOrVideoPage() {
    const url = window.location.href;
    return (
      url.includes('/playlist?list=') || // Playlist page
      url.includes('/watch?v=') // Single video page
    );
  }

  // Only run the script on playlist or single video pages
  if (isPlaylistOrVideoPage()) {
    setTimeout(() => {
      if (window.location.href.includes('/playlist?list=')) {
        // Append duration to playlist metadata
        waitForElement('.yt-content-metadata-view-model-wiz__metadata-row').then(() => {
          appendDurationToPlaylistMetadata()
        });
      } else if (window.location.href.includes('/watch?v=')) {
        // Append duration to playlist header when watching a video in a playlist
        if (window.location.href.includes('list=')) {
          waitForElement('div#publisher-container').then(() => {
            setInterval(appendDurationToPlaylistHeader, 1500);
          });
        }

        // Detect playback speed and update calculated duration periodically
        setInterval(detectPlaybackSpeed, 1000);
      }
    }, 1500);
  }
})();