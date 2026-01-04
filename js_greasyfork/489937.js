// ==UserScript==
// @name         Youtube OCD number replacer
// @namespace    https://www.nexusmods.com/palworld/mods/1134
// @version      2025-01-28
// @description  Replaces a number in the end of youtube videos duration.
// @author       ...
// @match        https://www.youtube.com/*
// @icon         ...
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489937/Youtube%20OCD%20number%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/489937/Youtube%20OCD%20number%20replacer.meta.js
// ==/UserScript==

let number_to_replace = '3';
let mutationScheduled = false;

function durationEndsWithThree(duration) {
  return duration.endsWith(number_to_replace);
}

function updateBadgeShapeWizElement(element) {
  const durationTextElement = element.querySelector('.badge-shape-wiz__text');
  if (durationTextElement) {
    const duration = durationTextElement.textContent.trim();
    if (durationEndsWithThree(duration)) {
      const modifiedDuration = duration.slice(0, -1) + '4';
      durationTextElement.textContent = modifiedDuration;
    }
  }
}

function updateYtpTimeDurationElement() {
  const durationTextElement = document.querySelector('.ytp-time-duration');
  if (durationTextElement) {
    const duration = durationTextElement.textContent.trim();
    if (durationEndsWithThree(duration)) {
      const modifiedDuration = duration.slice(0, -1) + '4';
      durationTextElement.textContent = modifiedDuration;
    }
  }
}

function processDurationElements() {
  document.querySelectorAll('.badge-shape-wiz').forEach(updateBadgeShapeWizElement);
  updateYtpTimeDurationElement();
}

function scheduleProcessDurationElements() {
  if (!mutationScheduled) {
    mutationScheduled = true;
    requestAnimationFrame(() => {
      mutationScheduled = false;
      processDurationElements();
    });
  }
}

const observer = new MutationObserver(() => {
  scheduleProcessDurationElements();
});
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', processDurationElements);