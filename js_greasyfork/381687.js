// ==UserScript==
// @name         Embedded YouTube Video Quality Preference
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  Set initial video quality for embedded YouTube videos based on a set of preferred video qualities, as well as minimum and maximum video qualities (configured in the script).
// @match        *://www.youtube.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381687/Embedded%20YouTube%20Video%20Quality%20Preference.user.js
// @updateURL https://update.greasyfork.org/scripts/381687/Embedded%20YouTube%20Video%20Quality%20Preference.meta.js
// ==/UserScript==

(() => {

  //=== CONFIGURATION BEGIN ===

  //One or more video quality IDs. From most to least prioritized video quality.
  //e.g. if ["hd720", "medium"], try using "hd720" quality first. If not available, use "medium" quality. If it's also not available, use YouTube's default.
  var qualities = [""]; //Set to [] if no preference

  //Minimum video quality. Set it to "" to use lowest quality available.
  //If ID is not empty and is not available, use the available one which is a higher quality.
  var minQuality = "";

  //Maximum video quality. For slow network or low computer specifications. Set it to "" to use highest quality available.
  //If ID is not empty and is not available, use the available one which is a lower quality.
  var maxQuality = "";

  //minQuality and maxQuality have higher priority than the qualities variable.
  //e.g. if qualities is ["hd2160", "hd720"], minQuality is "hd1080", and maxQuality is "hd1440", YouTube's default will be used.
  //maxQuality rule is applied after minQuality rule has been aplied.
  //i.e. the rule priorities are: qualities, minQuality, then maxQuality.

  //To always use the maximum video quality available, set minQuality and maxQuality to "highres". The qualities variable will be ignored.

  //To always use the minimum video quality available, set minQuality and maxQuality to "tiny". The qualities variable will be ignored.

  /* Available video quality IDs:
    "tiny"     (144p)
    "small"    (240p)
    "medium"   (360p)
    "large"    (480p)
    "hd720"    (720p)
    "hd1080"  (1080p)
    "hd1440"  (1440p)
    "hd2160"  (2160p)
    "hd2880"  (2880p)
    "highres" (4320p; YouTube's highest resolution [2019 April])
  */

  //=== CONFIGURATION END ===

  var sb = document.querySelector(".ytp-settings-button");
  if (!sb) return;
  var sq = {
    "144p": "tiny", "240p": "small", "360p": "medium", "480p": "large", "720p": "hd720", "1080p": "hd1080",
    "1440p": "hd1440", "2160p": "hd2160", "2880p": "hd2880", "4320p": "highres"
  }, p = player.querySelector(".html5-video-player"), v = p.querySelector(".html5-main-video"), play = v.play, resm = {};
  ["tiny", "small", "medium", "large", "hd720", "hd1080", "hd1440", "hd2160", "highres"].forEach((r, i) => resm[r] = i);
  v.play = function() {
    var sty = document.head.appendChild(document.createElement("STYLE"));
    sty.innerHTML = '.ytp-settings-menu{display:none}';
    v.play = play;
    sb.click();
    document.querySelectorAll(".ytp-settings-menu .ytp-menuitem-label").forEach(l => {
      if (l.textContent !== "Quality") return;
      l.click();
      setTimeout(() => {
        var
          es = Array.from(document.querySelectorAll(".ytp-quality-menu .ytp-menuitem-label span")),
          qs = [], qsm = {}, esm = {}, cq = p.getPlaybackQuality(), q = cq;
        es.pop();
        es.reverse();
        var ss = es.map((e, s, n) => {
          s = e.firstChild.data;
          qs.push(n = sq[s]);
          qsm[n] = resm[n];
          esm[n] = e.parentNode;
          return s;
        });
        if (!minQuality || (qsm[minQuality] === undefined)) minQuality = qs[0];
        if (!maxQuality || (qsm[maxQuality] === undefined)) maxQuality = qs[qs.length - 1];
        qualities = qualities.filter(
          v => (qsm[v] !== undefined) && (resm[v] >= resm[minQuality]) && (resm[v] <= resm[maxQuality])
        );
        if (qualities.length) {
          q = qualities[0];
        } else {
          if (resm[cq] <= resm[minQuality]) q = minQuality;
          if (resm[cq] >= resm[maxQuality]) q = maxQuality;
        }
        if (q !== cq) {
          esm[q].click();
        } else v.play();
        sty.click();
        sty.remove();
      }, 0);
    });
  };
})();
