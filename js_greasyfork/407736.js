// ==UserScript==
// @name         Total And Remaning Duration Of Any Animes On MAL
// @namespace    Total duration
// @version      3
// @description  Now you can know how much time you will need to finish watching any animes on mal. If you use the MAL episode tracking tool you can also know how much time you still have to spend to finish watching all the remaining episodes.
// @author       Only_Brad
// @include      /^https:\/\/myanimelist\.net\/anime\/[\d]+(\/.*)?/
// @icon         https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407736/Total%20And%20Remaning%20Duration%20Of%20Any%20Animes%20On%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/407736/Total%20And%20Remaning%20Duration%20Of%20Any%20Animes%20On%20MAL.meta.js
// ==/UserScript==
(function() {
  let totalEps = document.getElementById("curEps").textContent;
  if (totalEps === "?" || totalEps === "1") return;
  totalEps = parseInt(totalEps);

  const informationHeader = findInformation(),
    durationNode = findDuration(),
    durationText = durationNode.querySelector("span"),
    durationValueNode = durationText.nextSibling,
    durationValue = durationValueNode.textContent.trim();

  const epDuration = extractDuration();
  const totalDurationNode = durationNode.cloneNode(true);
  const remainingTimeNode = durationNode.cloneNode(true);

  showTotalDuration();
  showRemainingDuration();

  function findInformation() {
    const headers = [...document.querySelectorAll("h2")];
    return headers.find(h2 => h2.textContent === "Information");
  }

  function findDuration() {
    const allInfo = [...informationHeader.parentNode.querySelectorAll("div")];
    return allInfo.find(info => info.innerText.includes("Duration"));
  }

  function extractDuration() {
    const DURATION_REGEX = /(?:(\d+) hr\. )?(\d+) min\./
    const match = durationValue.match(DURATION_REGEX);
    let hours, mins;

    if (match)[, hours, mins] = match;
    else hours = mins = 0;
    if (!hours) hours = 0;
    if (!mins) mins = 0;

    return {
      hours: parseInt(hours),
      mins: parseInt(mins)
    };
  }

  function getTotalDuration(epCount, {
    hours,
    mins
  }) {
    const
      totalMinutes = mins + hours * 60,
      totalDuration = epCount * totalMinutes,
      totalDurationHours = Math.floor(totalDuration / 60),
      totalDurationMins = totalDuration % 60;

    return {
      hours: totalDurationHours,
      mins: totalDurationMins
    };
  }

  function showDuration({
    epCount,
    durationNode,
    siblingNode,
    text
  }) {
    const {
      hours,
      mins
    } = getTotalDuration(epCount, epDuration);
    const durationText = durationNode.querySelector("span");
    const durationValue = durationText.nextSibling;

    durationText.textContent = text;
    durationValue.textContent = ` ${hours?hours+" hr." : ""} ${mins?mins+" min." : ""}`;
    siblingNode.insertAdjacentElement("afterend", durationNode);
  }

  function showTotalDuration() {
    showDuration({
      epCount: totalEps,
      durationNode: totalDurationNode,
      siblingNode: durationNode,
      text: "Total Duration:"
    });
  }

  function showRemainingDuration() {
    let epWatched = document.getElementById("myinfo_watchedeps");
    if (isNaN(epWatched.value)) return;

    epWatched = parseInt(epWatched.value);
    const epRemaining = totalEps - epWatched;
    showDuration({
      epCount: epRemaining,
      durationNode: remainingTimeNode,
      siblingNode: totalDurationNode,
      text: "Remaining time:"
    });
  }
})();