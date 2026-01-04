// ==UserScript==
// @name        RYM: Track Ratings Average when Rating
// @match       https://rateyourmusic.com/release/*
// @version     1.0
// @namespace   https://github.com/fauu
// @author      fau
// @description Displays your track rating averages (simple and time-weighted) in the track rating UI on the release page.
// @license     MIT
// @grant       GM.addStyle
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/530541/RYM%3A%20Track%20Ratings%20Average%20when%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/530541/RYM%3A%20Track%20Ratings%20Average%20when%20Rating.meta.js
// ==/UserScript==
"use strict";

/* !!! ADVANCED OPTIONAL EXTRA FEATURE: Scaled score !!!

  An extra scaled score can be displayed along with the averages.

  How it's calculated:
    1. The RYM ratings (0.5-5.0) are replaced with corresponding predefined values.
       This is in order to support non-linear rating scales (so that e.g. 3.5->4.0 could
       be defined to constitute a larger jump in terms of the score than 3.0->3.5).
    2. The simple and time-weighted averages for the replacements are calculated.
    3. These averages are normalized to a 100-point scale using a predefined value for the
       equivalent of 100 points.


  To ENABLE this feature, paste the entire following block into the browser developer
  console (Ctrl+Shift+K in Firefox, Ctrl+Shift+J in Chrome) in any rateyourmusic.com tab:

    localStorage.setItem("trawr_config", `
    {
      "scaledEnabled": true,
      "scaledNorm100": 2.9,
      "scaledMap": [
        [0.5, 0],
        [1,   0.6],
        [1.5, 1.1],
        [2,   1.5],
        [2.5, 1.75],
        [3,   2],
        [3.5, 2.4],
        [4,   2.7],
        [4.5, 2.9],
        [5,   3.3]
      ]
    }
    `)

  , replacing the example parameters with the desired ones. Then press Enter and refresh
  the page.

  Parameters:
    `scaledEnabled`: (true/false) Whether to display the scaled score.
    `scaledNorm100`: (number) The value of the average that will translate to the score of
                     100.
    `scaledMap`: (list of pairs of numbers) A transformation map with the original RYM rating
                 values on the left (must not be modified) and the corresponding replacement
                 values for the score calculation on the right.


  To revert the change and DISABLE this feature, issue this command in the developer console:

    localStorage.removeItem("trawr_config")
*/

const avgsDecimals = 2;
const scoresDecimals = 0;
const scopeName = "trawr";
const configKey = `${scopeName}_config`;
const cssPrefix = scopeName;
const avgContainerClass = `${cssPrefix}_avg-container`;
const avgLabelClass = `${cssPrefix}_avg-label`;
const avgValueClass = `${cssPrefix}_avg-value`;
const hiddenClass = `${cssPrefix}_hidden`;

const css = `
#track_rating_status:is(.saved, .saving) > .${avgContainerClass} {
  margin-left: 1.05em;
}

.${avgLabelClass} {
  color: var(--mono-7);
}

.${avgValueClass} {
  font-family: monospace;
}

.${hiddenClass} {
  display: none;
}
`.trim();

function main() {
  let trackLengths = [];
  for (let el of document.querySelectorAll("#tracks > .track > .tracklist_line")) {
    const durationEl = el.querySelector(".tracklist_duration");
    if (!durationEl) {
      trackLengths = [];
      break;
    }
    const secs = parseInt(durationEl.dataset.inseconds);
    if (secs > 0) {
      trackLengths.push(secs);
    }
  }

  const myTrackRatingsEl = document.getElementById("my_track_ratings");
  if (!myTrackRatingsEl) return;
  const trackRatingsEl = myTrackRatingsEl.querySelector("#track_ratings");
  const trackRatingEls = Array.from(trackRatingsEl.children);
  const numTracks = trackRatingEls.length;
  if (!numTracks) return;

  GM.addStyle(css);

  const config = loadConfig();

  if (trackLengths.length !== numTracks) {
    trackLengths = [];
  }

  let avgContainerEl, avgValueEl;
  const observer = new MutationObserver((muts) => {
    let [sum, count, scaledSum, weightedSum, scaledWeightedSum, sumWeights] = [0, 0, 0, 0, 0, 0];
    const calcWeighted = trackLengths.length > 0;
    trackRatingEls.forEach((el, i) => {
      const rating = parseFloat(el.querySelector(".rating_num").textContent);
      if (Number.isNaN(rating)) return;
      sum += rating;
      const scaledRating = config.scaledEnabled && config.scaledMap.get(rating);
      if (config.scaledEnabled) {
        scaledSum += scaledRating;
      }
      count++;
      if (calcWeighted) {
        const weight = trackLengths[i];
        weightedSum += rating * weight;
        if (config.scaledEnabled) {
          scaledWeightedSum += scaledRating * weight;
        }
        sumWeights += weight;
      }
    });
    const avg = sum / count;
    const scaledAvg = config.scaledEnabled
      ? normScaled(scaledSum / count, config.scaledNorm100)
      : null;
    let weightedAvg, scaledWeightedAvg;
    if (calcWeighted) {
      weightedAvg = weightedSum / sumWeights;
      scaledWeightedAvg =
        config.scaledEnabled && normScaled(scaledWeightedSum / sumWeights, config.scaledNorm100);
    }

    if (Number.isNaN(avg)) {
      if (avgContainerEl) avgContainerEl.classList.add(hiddenClass);
      return;
    }

    if (!avgContainerEl) {
      avgContainerEl = document.createElement("div");
      avgContainerEl.classList.add(avgContainerClass);
      const avgLabelEl = document.createElement("span");
      avgLabelEl.innerHTML = "Average:&nbsp;&nbsp;";
      avgLabelEl.classList.add(avgLabelClass);
      avgContainerEl.append(avgLabelEl);
      avgValueEl = document.createElement("span");
      avgValueEl.classList.add(avgValueClass);
      avgContainerEl.append(avgValueEl);
      const statusEl = myTrackRatingsEl.querySelector("#track_rating_status");
      statusEl.append(avgContainerEl);
    }

    const baseScaledPart = config.scaledEnabled ? `/${scaledAvg.toFixed(scoresDecimals)}` : "";
    const basePart = avg.toFixed(avgsDecimals) + baseScaledPart;

    const weightedScaledPart =
      weightedAvg && config.scaledEnabled ? `/${scaledWeightedAvg.toFixed(scoresDecimals)}` : "";
    const weightedPart = weightedAvg
      ? ` (${weightedAvg.toFixed(avgsDecimals)}${weightedScaledPart} weighted)`
      : "";

    avgValueEl.textContent = basePart + weightedPart;

    avgContainerEl.classList.remove(hiddenClass);
  });

  observer.observe(trackRatingsEl, { childList: true, subtree: true });
}

function loadConfig() {
  const config = JSON.parse(localStorage.getItem(configKey) || "{}");
  config.scaledEnabled ||= false;
  config.scaledMap ||= [];
  config.scaledMap = new Map(config.scaledMap);
  config.scaledNorm100 ||= null;
  return config;
}

function normScaled(x, norm) {
  return (x / norm) * 100;
}

main();