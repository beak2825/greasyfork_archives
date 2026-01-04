// ==UserScript==
// @name        Youtube Playback Manuplation
// @namespace   Violentmonkey Scripts
// @match        *://*.youtube.com/*
// @grant       none
// @version     2.0
// @author      imxitiz
// @license     GNU GPLv3 
// @description Apr 7, 2024, 4:02:48 PM
//  - Version 2.0 (Apr 7 2024 4:02:48 PM): Added functionality to remember playback speed across sessions using cookies. Defaults to the saved playback speed if available, otherwise defaults to 2.25x playback speed.
//  - Version 1.0 (Apr 1 2024 7:15:44 PM): Initial release with basic playback manipulation features.
// @downloadURL https://update.greasyfork.org/scripts/491483/Youtube%20Playback%20Manuplation.user.js
// @updateURL https://update.greasyfork.org/scripts/491483/Youtube%20Playback%20Manuplation.meta.js
// ==/UserScript==



(function () {
  "use strict";

  let savedPlaybackRate = getCookie("youtubePlaybackRate");

  function waitForKeyElements(
    selectorOrFunction,
    callback,
    waitOnce,
    interval,
    maxIntervals
  ) {
    if (typeof waitOnce === "undefined") {
      waitOnce = true;
    }
    if (typeof interval === "undefined") {
      interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
      maxIntervals = -1;
    }
    var targetNodes =
      typeof selectorOrFunction === "function"
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
      targetNodes.forEach(function (targetNode) {
        var attrAlreadyFound = "data-userscript-alreadyFound";
        var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
        if (!alreadyFound) {
          var cancelFound = callback(targetNode);
          if (cancelFound) {
            targetsFound = false;
          } else {
            targetNode.setAttribute(attrAlreadyFound, true);
          }
        }
      });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
      maxIntervals -= 1;
      setTimeout(function () {
        waitForKeyElements(
          selectorOrFunction,
          callback,
          waitOnce,
          interval,
          maxIntervals
        );
      }, interval);
    }
  }

  // Actual code starts here
  let funcDone = false;
  const titleElemSelector = "div#title.style-scope.ytd-watch-metadata";
  const colors = ["#072525", "#287F54", "#C22544"]; // https://www.schemecolor.com/wedding-in-india.php
  if (!funcDone) window.addEventListener("yt-navigate-start", addSpeeds);

  if (document.body && !funcDone) {
    waitForKeyElements(titleElemSelector, addSpeeds);
  }

  function addSpeeds() {
    if (funcDone) return;

    let bgColor = colors[0];
    let moreSpeedsDiv = document.createElement("div");
    moreSpeedsDiv.id = "more-speeds";

    for (let i = 0.25; i < 16; i += 0.25) {
      if (i >= 1) {
        bgColor = colors[1];
      }
      if (i > 4) {
        i += 0.75;
      }
      if (i > 8) {
        i++;
        bgColor = colors[2];
      }

      let btn = document.createElement("button");
      btn.style.backgroundColor = bgColor;
      btn.style.marginRight = "4px";
      btn.style.border = "1px solid #D3D3D3";
      btn.style.borderRadius = "2px";
      btn.style.color = "#ffffff";
      btn.style.cursor = "pointer";
      btn.style.fontFamily = "monospace";
      btn.textContent =
        "×" +
        (i.toString().substr(0, 1) == "0"
          ? i.toString().substr(1)
          : i.toString());
      btn.addEventListener("click", () => {
        document.getElementsByTagName("video")[0].playbackRate = i;
        document.cookie = "youtubePlaybackRate=" + i;
      });
      moreSpeedsDiv.appendChild(btn);
    }

    let titleElem = document.querySelector(titleElemSelector);
    titleElem.after(moreSpeedsDiv);

    if (savedPlaybackRate) {
      changePlayBackRate(parseFloat(savedPlaybackRate));
    } else {
      changePlayBackRate(2.25);
    }

    funcDone = true;
  }

  function changePlayBackRate(speed) {
    try {
      // make default Playback Rate 2.25
      document.getElementsByTagName("video")[0].playbackRate = speed;
    } catch (error) {
      setTimeout(changePlayBackRate, 2000, speed);
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
})();
