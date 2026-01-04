// ==UserScript==
// @name         Hide For You (schedule)
// @namespace    f_d
// @version      1.2
// @description  Hides the 'For You' tab and auto-switches to 'Following' on X.com during configured time windows
// @author       GPT-5
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546273/Hide%20For%20You%20%28schedule%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546273/Hide%20For%20You%20%28schedule%29.meta.js
// ==/UserScript==

/*** ──────────────────────────────────────────────────────────────
 * SCHEDULE CONFIG
 *
 * Time is local browser time, 24h "HH:MM".
 * Days: 0=Sun, 1=Mon, ..., 6=Sat
 * The filter is ACTIVE if the current time falls into ANY range
 * listed for the current day. "default" applies when a day has no
 * explicit entry. Overnight ranges are supported (e.g. 22:00–03:00).
 *
 * My Settings:
 *   - Mon–Fri: block active all day
 *   - Sat & Sun: active until 16:00
 * ───────────────────────────────────────────────────────────────*/
const SCHEDULE = {
  // Sunday
  0: [{ start: "00:00", end: "16:00" }],
  // Monday–Friday
  1: [{ start: "00:00", end: "24:00" }],
  2: [{ start: "00:00", end: "24:00" }],
  3: [{ start: "00:00", end: "24:00" }],
  4: [{ start: "00:00", end: "24:00" }],
  5: [{ start: "00:00", end: "24:00" }],
  // Saturday
  6: [{ start: "00:00", end: "16:00" }],
  // Fallback if a day is not listed
  default: [{ start: "00:00", end: "24:00" }],
};
/*** ─────────────────────────────────────────────────────────── ***/

(function () {
  'use strict';

  // Match both English and German labels, fall back to exact text match
  const LABELS_FOR_YOU = new Set(["For you", "Für dich"]);
  const LABELS_FOLLOWING = new Set(["Following", "Folge ich"]);

  const HIDDEN_ATTR = "data-hidden-by-userscript-for-you";

  function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  }

  function inRange(nowMin, startMin, endMin) {
    // Handles normal and overnight (wrap-around) ranges
    if (startMin === endMin) return false; // empty range
    if (startMin < endMin) return nowMin >= startMin && nowMin < endMin;
    return nowMin >= startMin || nowMin < endMin;
  }

  function isFeatureActiveNow() {
    const now = new Date();
    const day = now.getDay(); // 0..6
    const minutes = now.getHours() * 60 + now.getMinutes();
    const ranges = SCHEDULE.hasOwnProperty(day) ? SCHEDULE[day] : SCHEDULE.default;

    if (!ranges || ranges.length === 0) return false;
    return ranges.some(({ start, end }) => inRange(minutes, timeToMinutes(start), timeToMinutes(end)));
  }

  function getTabs() {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    let forYouTab = null, followingTab = null;

    tabs.forEach(tab => {
      const text = (tab.textContent || "").trim();
      if (LABELS_FOR_YOU.has(text)) forYouTab = tab;
      if (LABELS_FOLLOWING.has(text)) followingTab = tab;
    });

    return { forYouTab, followingTab };
  }

  function hideForYouAndSwitch() {
    const { forYouTab, followingTab } = getTabs();
    if (!forYouTab) return;

    // Hide the "For you" tab
    if (forYouTab.style.display !== "none") {
      forYouTab.style.display = "none";
      forYouTab.setAttribute(HIDDEN_ATTR, "true");
    }

    // If "For you" was active, switch to "Following"
    if (forYouTab.getAttribute('aria-selected') === 'true' && followingTab) {
      // Some builds require a mouse event to trigger navigation properly
      followingTab.click();
    }
  }

  function unhideForYou() {
    const { forYouTab } = getTabs();
    if (!forYouTab) return;
    if (forYouTab.getAttribute(HIDDEN_ATTR) === "true") {
      forYouTab.style.display = "";
      forYouTab.removeAttribute(HIDDEN_ATTR);
    }
  }

  function applyBehavior() {
    if (isFeatureActiveNow()) {
      hideForYouAndSwitch();
    } else {
      unhideForYou();
    }
  }

  // Run immediately
  applyBehavior();

  // Observe DOM changes (tabs re-render frequently)
  const observer = new MutationObserver(() => applyBehavior());
  observer.observe(document.body, { childList: true, subtree: true });

  // Re-check schedule every minute in case the hour changes without DOM mutations
  const intervalId = setInterval(applyBehavior, 60 * 1000);

  // Cleanup on unload
  window.addEventListener('unload', () => {
    observer.disconnect();
    clearInterval(intervalId);
  }, false);
})();

