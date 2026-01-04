// ==UserScript==
// @name         SPOTIFY ADBLOCKER
// @namespace    https://tampermonkey.net/
// @version      1.5
// @description  no annoying spotify ads >:|
// @author       snoopti
// @match        https://*.spotify.com/*
// @grant        none
// @run-at       document-start
// @license MIT  https://github.com/snoopti/SpotifyAdBlocker/blob/main/LICENSE
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @downloadURL https://update.greasyfork.org/scripts/501822/SPOTIFY%20ADBLOCKER.user.js
// @updateURL https://update.greasyfork.org/scripts/501822/SPOTIFY%20ADBLOCKER.meta.js
// ==/UserScript==

!(async function () {
  async function queryAsync(query) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const element = document.querySelector(query);
        if (element) {
          clearInterval(interval);
          return resolve(element);
        }
      }, 250);
    });
  }

  function inject({ ctx, fn, middleware, transform }) {
    const original = ctx[fn];
    ctx[fn] = function () {
      if (!middleware || middleware.call(this, ...arguments) !== false) {
        const result = original.call(this, ...arguments);
        return transform ? transform.call(this, result, ...arguments) : result;
      }
    };
  }

  const nowPlayingBar = await queryAsync(".now-playing-bar");
  const playButton = await queryAsync(
    "button[title=Play], button[title=Pause]"
  );

  let audio;

  inject({
    ctx: document,
    fn: "createElement",
    transform(result, type) {
      if (type === "audio") {
        audio = result;
      }
      return result;
    },
  });

  let playInterval;
  new MutationObserver(() => {
    const link = document.querySelector(".now-playing > a");

    if (link) {
      if (!audio) {
        return;
      }

      if (!playButton) {
        return;
      }

      audio.src = "";
      playButton.click();
      if (!playInterval) {
        playInterval = setInterval(() => {
          if (
            !document.querySelector(".now-playing > a") &&
            playButton.title === "Pause"
          ) {
            clearInterval(playInterval);
            playInterval = null;
          } else {
            playButton.click();
          }
        }, 500);
      }
    }
  }).observe(nowPlayingBar, {
    characterData: true,
    childList: true,
    attributes: true,
    subtree: true,
  });
})();

(function () {
  "use strict";

  function removeElementsByClassName(className) {
    let elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  removeElementsByClassName(
    "ButtonInner-sc-14ud5tc-0 ksgXuD encore-over-media-set"
  );

  removeElementsByClassName(
    "ButtonInner-sc-14ud5tc-0 kNmeGH encore-inverted-light-set Upqw01TOXETOmR5Td7Dj"
  );

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      removeElementsByClassName(
        "ButtonInner-sc-14ud5tc-0 ksgXuD encore-over-media-set"
      );
      removeElementsByClassName(
        "ButtonInner-sc-14ud5tc-0 kNmeGH encore-inverted-light-set Upqw01TOXETOmR5Td7Dj"
      );
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
