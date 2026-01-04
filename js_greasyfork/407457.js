// ==UserScript==
// @name         Youtube Playlist Duration Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Calculate the duration of a playlist and display it next to the number of videos
// @author       DenverCoder1
// @match        https://www.youtube.com/playlist
// @include      *://youtube.com/playlist*
// @include      *://*.youtube.com/playlist*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407457/Youtube%20Playlist%20Duration%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/407457/Youtube%20Playlist%20Duration%20Calculator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Calculate the duration of a playlist
   *
   * @returns {string} Duration of the playlist in a human readable format
   */
  function calculateDuration() {
    // get data object stored on Youtube's website
    const data = window.ytInitialData;

    // locate the list of videos in the object
    const vids =
      data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0]
        .itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;

    // add up the lengths of each video in seconds
    const seconds = vids.reduce(function (x, y) {
      return x + (!isNaN(y.playlistVideoRenderer.lengthSeconds) ? parseInt(y.playlistVideoRenderer.lengthSeconds) : 0);
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
   * Append the duration to the playlist stats
   *
   * @param {HTMLElement} statsEl Element to append the duration after
   * @param {string} duration Duration of the playlist
   */
  function appendDurationToStats(statsEl, duration) {
    // create a new "yt-formatted-string" element
    const newStat = document.createElement("yt-formatted-string");

    // set it's class to match the other elements
    newStat.className = "style-scope ytd-playlist-sidebar-primary-info-renderer byline-item ytd-playlist-byline-renderer";

    // find the first child of the stats element (the number of videos) and insert the new element after it
    statsEl.after(newStat);

    // set the text of the new element to contain the duration
    newStat.innerText = duration;

    // make sure it is not hidden
    newStat.style.display = "inline-block";
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

	// add duration to stats when the stats appear
  waitForElement("#stats > yt-formatted-string:first-of-type, .metadata-stats > yt-formatted-string:first-of-type").then((statsEl) => {
    const durationString = calculateDuration();
    appendDurationToStats(statsEl, durationString);
  });

	// prevent ellipsis if line becomes too long to display
	document.head.insertAdjacentHTML("beforeend", `<style>.metadata-stats.ytd-playlist-byline-renderer { max-height: unset; -webkit-line-clamp: unset; }</style>`);
})();
