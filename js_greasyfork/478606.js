// ==UserScript==
// @name                  Youtube AD Skipper 油管广告拦截跳过
// @name:zh-CN            Youtube AD Skipper 油管广告拦截跳过
// @namespace             http://tampermonkey.net/
// @version               0.10
// @description           Quickly skip video ads in Youtube. 快速跳过油管中的视频广告。
// @description:zh-CN     Quickly skip video ads in Youtube. 快速跳过油管中的视频广告。
// @icon                  https://www.gstatic.com/youtube/img/branding/favicon/favicon_144x144.png
// @author                gabe
// @license               MIT
// @match                 https://*.youtube.com/*
// @grant                 none
// @downloadURL https://update.greasyfork.org/scripts/478606/Youtube%20AD%20Skipper%20%E6%B2%B9%E7%AE%A1%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478606/Youtube%20AD%20Skipper%20%E6%B2%B9%E7%AE%A1%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SKIP_BUTTON = ".ytp-ad-skip-button, .ytp-ad-skip-button-modern";
  const AD_OVERLAY = ".ytp-ad-player-overlay, .ytp-ad-survey-player-overlay";
  const AD_INFO =
    ".ytp-ad-player-overlay-instream-info, .ytp-ad-survey-player-overlay-instream-info";

  function log() {
    return console.info("[Youtube AD Skipper]", ...arguments);
  }

  function sleep(delay = 500) {
    return new Promise(function (resolve) {
      const timer = setTimeout(function () {
        clearTimeout(timer);
        resolve();
      }, delay);
    });
  }

  function newTouch(el) {
    const rect = el.getBoundingClientRect();
    const x = (rect.left + rect.right) / 2;
    const y = (rect.top + rect.bottom) / 2;
    return new Touch({
      identifier: Date.now(),
      target: el,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      pageX: x + document.body.scrollLeft,
      pageY: y + document.body.scrollTop,
      radiusX: 10.0,
      radiusY: 10.0,
      rotationAngle: 0.0,
      force: 1,
    });
  }

  function newTouchEvent(touch, name) {
    return new TouchEvent(name, {
      cancelable: true,
      bubbles: true,
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
    });
  }

  function dispatchTouch(el) {
    const touch = newTouch(el);
    el.dispatchEvent(newTouchEvent(touch, "touchstart"));
    // el.dispatchEvent(newTouchEvent(touch, "touchmove"));
    el.dispatchEvent(newTouchEvent(touch, "touchend"));
  }

  async function skipAd(moviePlayer, adOverlay) {
    let i = 0;
    while (++i < 6) {
      if (i > 1) {
        adOverlay = moviePlayer.querySelector(AD_OVERLAY);
        if (!adOverlay) {
          log("skip done!!!");
          return;
        }
      }

      const skipButton = adOverlay.querySelector(SKIP_BUTTON);
      const isMobile = location.hostname === "m.youtube.com";
      if (skipButton) {
        if (isMobile) {
          dispatchTouch(skipButton);
          log("skip touch ->", i);
        } else {
          skipButton.click();
          log("skip click ->", i);
        }
      } else {
        const video = moviePlayer.getElementsByTagName("video")[0];
        video.currentTime = video.duration;
        log("skip play ->", i);
      }

      await sleep();
    }

    log("skip failed...");
  }

  let isBusying = false;
  const pageObserver = new MutationObserver(async function () {
    if (isBusying) {
      return;
    }

    try {
      isBusying = true;

      const moviePlayer = document.getElementById("movie_player");
      if (!moviePlayer) {
        return;
      }

      const adOverlay = moviePlayer.querySelector(AD_OVERLAY);
      if (!adOverlay) {
        return;
      }

      const adInfo = adOverlay.querySelector(AD_INFO);
      log("found ad:", adInfo && adInfo.innerText);
      await skipAd(moviePlayer, adOverlay);
    } catch (err) {
      log("got error:", err.message);
    } finally {
      isBusying = false;
    }
  });

  if (window.self !== window.top) {
    return;
  }

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  log("--- start ---");
})();
