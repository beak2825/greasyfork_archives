// ==UserScript==
// @name         Youtube Music High Quality Video
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.2.2
// @description  Tries to set the video quality to 1440p on Youtube Music (or the highest available quality)
// @author       Alistair1231
// @match        https://music.youtube.com/watch*
// @icon         https://icons.duckduckgo.com/ip2/youtube.com.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535348/Youtube%20Music%20High%20Quality%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/535348/Youtube%20Music%20High%20Quality%20Video.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/535348-youtube-music-high-quality-video
// https://github.com/Alistair1231/my-userscripts/blob/master/youtube-music-high-quality-video.user.js

(function () {
  "use strict";
  /**
   *
   * @param {string} quality - The quality to set the video to. Can be one of the following:
   * auto / highres / hd2880 / hd2160 / hd1440 / hd1080 / hd720 / large / medium / small / tiny
   * If a quality is unavailable, it will be set to the next best quality.
   * On Youtube Music, videos seem to be limited to 1080p on the backend, but no harm in trying for more.
   * @returns
   */
  const setQuality = (quality) =>
    document.getElementById("movie_player").setPlaybackQualityRange(quality);

  const run = () => {
    if (document.getElementById("movie_player")) setQuality("hd1440");

    // create a MutationObserver to watch for new videos
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          // check if the video has changed
          const newElement = document.getElementById("movie_player");
          if (newElement) {
            setQuality("hd1440");
          }
        }
      }
    });
    // start observing the element for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  setTimeout(run, 2000);
})();
