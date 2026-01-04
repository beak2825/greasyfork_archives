// ==UserScript==
// @name         Iflix Subtitles Fix for Firefox
// @icon         https://piay.iflix.com/app/favicon.ico
// @namespace    https://github.com/tkhquang
// @version      2.33
// @description  Subtitles fix for Firefox
// @author       Quang Trinh
// @license      MIT; https://raw.githubusercontent.com/tkhquang/userscripts/master/LICENSE
// @homepage     https://greasyfork.org/en/scripts/367324-iflix-subtitles-fix-for-firefox
// @match        http*://piay.iflix.com/*
// @run-at       document-start
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/367324/Iflix%20Subtitles%20Fix%20for%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/367324/Iflix%20Subtitles%20Fix%20for%20Firefox.meta.js
// ==/UserScript==

/* global GM_addStyle */

/*
 * arrive.js
 * v2.4.1
 * https://github.com/uzairfarooq/arrive
 * MIT licensed
 *
 * Copyright (c) 2014-2017 Uzair Farooq
 */

/*==================*
 * Reference: http://ronallo.com/demos/webvtt-cue-settings/
 * You can change the below variables to suite your needs.
 *==================*/

// ==Configuration==
const lineVTT = 14; //See reference
const minfontSize = "12px"; //Subtitles font-size won't scale smaller than this value
const fontSize = "3vmin"; //font-size = minfontSize + this value
const lineHeight = "150%"; //Better leave this as is - "normal" with lineVTT = 16
// ==Configuration==

// ==Codes
function styleSub() {
  "use strict";

  const css = `video::cue {
font-size: calc(${minfontSize} + ${fontSize}) !important;
line-height: ${lineHeight} !important;
}`;
  if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(css);
  } else {
    const node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    const heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      document.documentElement.appendChild(node);
    }
  }
  console.log("iSFix - Styling Done!");
}

function alterSub(activeSub) {
  "use strict";

  let activeCues = activeSub.cues;
  function lineCheck() {
    return Boolean(activeCues !== null && activeCues[0] !== undefined && activeCues[0].line === lineVTT);
  }
  if (activeCues !== null && activeCues[0].line !== lineVTT) {
    Object.keys(activeCues).forEach(function (i) {
      activeCues[i].line = lineVTT;
    });
    console.log("iSFix - Done setting lines!");
  }
  if (!lineCheck()) {
    console.log("iSFix - Current line value: " + activeCues[0].line);
    console.warn("iSFix - Unmodified lines => Try changing line value...");
    setTimeout(function () {
      alterSub(activeSub);
    }, 5000);
    return;
  }
  console.log("iSFix - Current line value: " + activeCues[0].line);
  console.log("iSFix - Passed!!!");
}

function getSubList(vidPlayer) {
  "use strict";

  const subList = vidPlayer[0].textTracks;
  function getSub() {
    return (function () {
      for (let sub of subList) {
        if (sub.mode === "showing") {
          return sub;
        }
      }
      return false;
    }());
  }
  subList.onchange = function () {
    console.log("iSFix - Subtitles onchange action");
    if (getSub()) {
      alterSub(getSub());
    }
  };
  setTimeout(function () {
    if (getSub()) {
      alterSub(getSub());
    }
  }, 10000);
}

function getVidState(vidPlayer) {
  "use strict";
  if (!(/^\/play/).test(window.location.pathname)) {
    return;
  }
  if (vidPlayer.length === 0 || vidPlayer[0] === undefined) {
    console.warn("iSFix - No video? Try getting it after 5s...");
    setTimeout(function () {
      getVidState(vidPlayer);
    }, 5000);
    return;
  }
  styleSub();
  getSubList(vidPlayer);
}

(function () {
  "use strict";

  document.arrive(".vimond-player-video", function () {
    console.log("iSFix - Video element available");
    setTimeout(function () {
      getVidState(document.getElementsByClassName("vimond-player-video"));
    }, 1000);
  });
}());
