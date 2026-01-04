// ==UserScript==
// @name         Netflix Volume and Time Mouse Controlled
// @namespace    PoKeRGT
// @version      2.00
// @description  Volume/Time mouse control for Netflix
// @author       PoKeRGT
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @run-at       document-ready
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493042/Netflix%20Volume%20and%20Time%20Mouse%20Controlled.user.js
// @updateURL https://update.greasyfork.org/scripts/493042/Netflix%20Volume%20and%20Time%20Mouse%20Controlled.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.netflixVolumeMouseControl = false;

  const getPlayer = () => {
    try {
      const nApi = netflix.appContext.state.playerApp.getAPI();
      const videoPlayer = nApi.videoPlayer;
      if (videoPlayer && videoPlayer.getVideoPlayerBySessionId && videoPlayer.getAllPlayerSessionIds) {
        const allSessionIds = videoPlayer.getAllPlayerSessionIds();
        const watchSessionIds = allSessionIds.filter(sid => sid.startsWith('watch-'));
        if (watchSessionIds.length > 0) {
          return videoPlayer.getVideoPlayerBySessionId(watchSessionIds[0]);
        } else if (allSessionIds.length > 0) {
          return videoPlayer.getVideoPlayerBySessionId(allSessionIds[0]);
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  const moveToPosition = (player, timeMillis) => {
    player.seek(timeMillis);
  }

  const limitRange = (minValue, maxValue, n) => {
    return Math.max(minValue, Math.min(maxValue, n));
  }

  const handleMouseWheelEvent = (player, event) => {
    const videos = document.getElementsByTagName('video');
    const videoTag = (videos && videos.length === 1 ? videos[0] : null);
    const rect = videoTag.getBoundingClientRect();
    const width = videoTag.offsetWidth;
    const height = videoTag.offsetHeight;
    const x = event.clientX - rect.left; //x position within the element.
    const y = event.clientY - rect.top; //y position within the element.
    // console.log("Left? : " + x + " ; Top? : " + y + ".");

    if ((width / 2) > x) {
      // console.log('isLeft');
      if (event.deltaY < 0) {
        const currVolume = player.getVolume();
        player.setVolume(limitRange(0, 1, currVolume + 0.1))
      } else {
        const currVolume = player.getVolume();
        player.setVolume(limitRange(0, 1, currVolume - 0.1))
      }
    } else {
      // console.log('isRight');
      if (event.deltaY < 0) {
        const newPosition = player.getCurrentTime() + 10000.0;
        moveToPosition(player, limitRange(0, player.getDuration(), newPosition));
      } else {
        const newPosition = player.getCurrentTime() - 10000.0;
        moveToPosition(player, limitRange(0, player.getDuration(), newPosition));
      }
    }
  }

  const init = () => {
    if (location.href.includes('/watch/')) {
      const player = getPlayer();

      if (player) {
        if (!window.netflixVolumeMouseControl) {
          console.log('Appending mouse control')
          document.body.addEventListener('wheel', handleMouseWheelEvent.bind(null, player), { passive: false });
          window.netflixVolumeMouseControl = true;
        } else {
          console.log('Event handler already added')
        }
      } else {
        console.log('No player found!')
      }
    } else {
      document.body.removeEventListener('wheel', handleMouseWheelEvent, { passive: false });
      window.netflixVolumeMouseControl = false;
      console.log('Not watching. Event removed')
    }
  }

  // Set up a mutation observer to watch for url change to detect navigation
  var previousUrl = location.href;
  var observer = new MutationObserver(function (mutations) {
    // If URL changes...
    if (location.href !== previousUrl) {
      previousUrl = location.href;

      console.log(`New URL: ${location.href}`);
      setTimeout(() => {
        init();
      }, 5000);

    }
  });

  // Mutation observer setup
  const config = { subtree: true, childList: true };
  setTimeout(() => {
    init();
  }, 5000);
  observer.observe(document, config);
})();