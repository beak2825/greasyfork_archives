// ==UserScript==
// @name         YouTube Music - Fix Tab Title
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Fix YouTube Music Tab Title
// @match        https://music.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467439/YouTube%20Music%20-%20Fix%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/467439/YouTube%20Music%20-%20Fix%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Variable to store the last played song title
  let lastPlayedSongTitle = '';

  // Function to get the title element
  function getTitleElement() {
    var titleElement;

    // Gotten by right clicking on the element in developer tools and selecting "Copy Selector"
    const selectors = [
      "#contents > ytmusic-editable-playlist-detail-header-renderer > ytmusic-responsive-header-renderer > h1 > yt-formatted-string",
      "#contents > ytmusic-editable-playlist-detail-header-renderer > ytmusic-responsive-header-renderer > h2 > yt-formatted-string",
      "#contents > ytmusic-responsive-header-renderer > h1 > yt-formatted-string",
      "#contents > ytmusic-responsive-header-renderer > h2 > yt-formatted-string",
      "#header > ytmusic-detail-header-renderer > div > div.metadata.style-scope.ytmusic-detail-header-renderer > h2 > yt-formatted-string",
      "#header > ytmusic-editable-playlist-detail-header-renderer > ytmusic-detail-header-renderer > div > div.metadata.style-scope.ytmusic-detail-header-renderer > h2 > yt-formatted-string",
      "#header > ytmusic-header-renderer > h1 > yt-formatted-string",
      "#header > ytmusic-header-renderer > h2 > yt-formatted-string",
      "#header > ytmusic-immersive-header-renderer > div > div > div > h1 > yt-formatted-string",
      "#header > ytmusic-immersive-header-renderer > div > div > div > yt-formatted-string.title.style-scope.ytmusic-immersive-header-renderer",
      "#header > ytmusic-visual-header-renderer > div > div > div.metadata.style-scope.ytmusic-visual-header-renderer > h2 > yt-formatted-string",
      "#suggestion-cell-0x0 > span",
    ]

    for (let i = 0; i < selectors.length; i++) {
      titleElement = document.querySelector(selectors[i])
      if (titleElement && isElementVisible(titleElement)) {
        return titleElement;
      }
    }
    return null;
  }

  function isElementVisible(element) {
    // Check if the element has width and height
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;

    // Check if the element is displayed
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

    return true;
  }

  // Function to set the tab title
  function setTabTitle(force) {
    if (document.title.endsWith("YouTube Music")) {
      document.title = document.title.replace("YouTube Music", "YTM");
    }
    if (!force && document.title !== 'YTM') {
      return;
    }

    var titleElement = getTitleElement();

    if (titleElement) {
      const songTitle = titleElement.textContent.trim();
      if (songTitle == 'Songs') {
        // Take first artist name.
        titleElement = document.querySelector("#contents > ytmusic-responsive-list-item-renderer:nth-child(1) > div.flex-columns.style-scope.ytmusic-responsive-list-item-renderer > div.secondary-flex-columns.style-scope.ytmusic-responsive-list-item-renderer > yt-formatted-string:nth-child(1)")
        if (titleElement) {
          document.title = titleElement.textContent.trim() + " Songs";
          return;
        }
      }
      if (songTitle !== '') {
        lastPlayedSongTitle = songTitle;
        document.title = songTitle;
      } else {
        document.title = lastPlayedSongTitle;
      }
    } else {
      let curUrl = window.location.href;
      if (curUrl.includes("search?")) {
        let url = new URL(curUrl);
        let query = url.searchParams.get('q');
        if (query) {
          document.title = "\"" + query + "\" Search Results";
          return;
        }
      }

      switch (curUrl) {
        case 'https://music.youtube.com/':
          document.title = 'Home';
          break;
        case 'https://music.youtube.com/library':
          document.title = 'Library';
          break;
        case 'https://music.youtube.com/library/playlists':
          document.title = 'Playlists';
          break;
        case 'https://music.youtube.com/library/songs':
          document.title = 'Songs';
          break;
        case 'https://music.youtube.com/library/albums':
          document.title = 'Albums';
          break;
        case 'https://music.youtube.com/library/artists':
          document.title = 'Artists';
          break;
        case 'https://music.youtube.com/library/podcasts':
          document.title = 'Podcasts';
          break;
        case 'https://music.youtube.com/explore':
          document.title = 'Explore';
          break;
        default:
          document.title = 'YTM';
      }
    }
  }

  function setTabTitleWhenSongPlaying() {
    const playPauseButton = document.querySelector("#play-pause-button");
    if (playPauseButton && playPauseButton.title === 'Pause') {
      document.title = document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string").textContent + " - " +
        document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a:nth-child(1)").textContent
    }
  }

  function addEventListeners() {
    // Check on page load
    window.addEventListener('load', () => setTabTitle(true));

    // Check when navigation finishes
    window.addEventListener('yt-navigate-finish', () => setTabTitle(true));

    // Check on transition end
    document.addEventListener('transitionend', (event) => {
      if (event.target.id === 'progress' ||
          (event.target.classList && Array.from(event.target.classList).includes('ytmusic-immersive-header-renderer'))) {
        setTabTitle(true);
      }
    }, true);

    // Set up a regular check every second
    setInterval(setTabTitleWhenSongPlaying, 1000);
  }

  addEventListeners();

  var lastTitle = document.title;
  var lastUrl = window.location.href;

  function checkChanges() {
    var newTitle = document.title;
    var newUrl = window.location.href;

    if (newTitle !== lastTitle) {
      lastTitle = newTitle;
      setTabTitle();
    }

    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      setTabTitle(true);
    }
  }

  // Add an event listener to check for title and URL changes
  var changeObserver = new MutationObserver(checkChanges);
  changeObserver.observe(document, { childList: true, subtree: true });
})();