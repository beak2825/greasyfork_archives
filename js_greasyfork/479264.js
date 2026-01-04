// ==UserScript==
// @name         Twitch Auto Theater and Statistics
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Auto theater Twitch video and show statistics
// @author       JoseBaGra
// @match        *.twitch.tv/*
// @match        twitch.tv/*
// @match        https://twitch.tv/*
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://twitch.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479264/Twitch%20Auto%20Theater%20and%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/479264/Twitch%20Auto%20Theater%20and%20Statistics.meta.js
// ==/UserScript==
const videoStatsTheatreClass = 'video-stats-theatre';
const videoStatsPlayerControlsVisible = 'video-stats-player-controls-vissible';
const videoStatsVolumeSliderFullWidth = 'video-stats-volume-full-width';

const style = `<style id="xCustomCSS" type="text/css" class="stylus">
:root {
    --zindex: 1;
}
.${videoStatsTheatreClass} {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99999;
    font-weight: bold;
    opacity:0.7;
    zoom:0.9;
    pointer-events: none;
    padding: 10px;
}
.${videoStatsPlayerControlsVisible} {
  padding-left: 70px;
}
.${videoStatsVolumeSliderFullWidth} {
  padding-left: 190px;
}
</style>`;

const videoStatsQuery =
  '.metadata-layout__support + div > div:nth-child(2) div div div';
const videoPlayerQuery = '.video-player__container';
const theatreModeButtonQuery = '[aria-label="Theatre Mode (alt+t)"]';
const videoPlayerTheatreClass = 'video-player__container--theatre';
const videoPlayerControlsClass = '.player-controls';
const volumeSliderClass = '.volume-slider__slider-container';
const sevenTVStylesheetID = '#seventv-stylesheet';

const stylesIntervalID = setInterval(() => {
  if (!document.getElementById('xCustomCSS')) {
    document.body.insertAdjacentHTML('afterend', style);
    clearInterval(stylesIntervalID);
  }
}, 200);

const videoObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      const videoStats = document.querySelector(videoStatsQuery);
      if (videoStats) {
        if (mutation.target.classList.contains(videoPlayerTheatreClass)) {
          videoStats.classList.add(videoStatsTheatreClass);
        } else {
          videoStats.classList.remove(videoStatsTheatreClass);
        }
      }
    }
  });
});

const videoPlayerControlsObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-a-visible') {
      const videoStats = document.querySelector(videoStatsQuery);
      const videoPlayerControls = document.querySelector(
        videoPlayerControlsClass,
      );
      if (videoPlayerControls && videoStats) {
        if (videoPlayerControls.dataset.aVisible === 'true') {
          videoStats.classList.add(videoStatsPlayerControlsVisible);
        } else {
          videoStats.classList.remove(videoStatsPlayerControlsVisible);
        }
      }
    }
  });
});

const volumeSliderObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'aria-hidden') {
      const videoStats = document.querySelector(videoStatsQuery);
      const volumeSlider = document.querySelector(volumeSliderClass);
      if (volumeSlider && videoStats) {
        if (volumeSlider.getAttribute('aria-hidden') !== 'true') {
          videoStats.classList.add(videoStatsVolumeSliderFullWidth);
        } else {
          videoStats.classList.remove(videoStatsVolumeSliderFullWidth);
        }
      }
    }
  });
});

const createObsever = setInterval(() => {
  const videoPlayer = document.querySelector(videoPlayerQuery);
  const videoPlayerControls = document.querySelector(videoPlayerControlsClass);
  const volumeSlider = document.querySelector(volumeSliderClass);
  if (videoPlayer) {
    videoObserver.observe(videoPlayer, { attributes: true });
    videoPlayerControlsObserver.observe(videoPlayerControls, {
      attributes: true,
    });
    volumeSliderObserver.observe(volumeSlider, { attributes: true });
    clearInterval(createObsever);
  }
}, 200);

const waitForNewVideoStatsForAddTheTheatreClass = (videoStats) => {
  const newVideoStats = document.querySelector(videoStatsQuery);
  if (newVideoStats !== videoStats) {
    newVideoStats.classList.add(videoStatsTheatreClass);
    return;
  }
  setTimeout(waitForNewVideoStatsForAddTheTheatreClass, 0, videoStats);
};

const enterTheaterMode = setInterval(() => {
  const videoStats = document.querySelector(videoStatsQuery);
  const sevenTVStylesheet = document.querySelector(sevenTVStylesheetID);
  if (videoStats) {
    clearInterval(enterTheaterMode);
    document.querySelector(theatreModeButtonQuery).click();
    waitForNewVideoStatsForAddTheTheatreClass(videoStats);

    if (sevenTVStylesheet) {
      setInterval(() => {
        const videoPlayer = document.querySelector(videoPlayerQuery);
        const videoStats = document.querySelector(videoStatsQuery);
        if (videoPlayer.classList.contains(videoPlayerTheatreClass)) {
          videoStats.classList.add(videoStatsTheatreClass);
        } else {
          videoStats.classList.remove(videoStatsTheatreClass);
        }
      }, 1000 * 60); // 1000ms & 60 = 60 seconds
    }
  }
}, 200);
