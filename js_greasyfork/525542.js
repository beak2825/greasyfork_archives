// ==UserScript==
// @name         Improved SpaceHey Dates
// @namespace    https://vasi.dev
// @version      1.0.2
// @description  SpaceHey timestamps with better relative dates and full dates on hover. Shows relative time for recent posts (< 30 days) and exact dates for older content.
// @author       Vasilis
// @match        https://*.spacehey.com/*
// @icon         https://static.spacehey.net/icons/clock.png
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525542/Improved%20SpaceHey%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/525542/Improved%20SpaceHey%20Dates.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const dateFormatterWithTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "medium",
  });

  const dateFormatterNoTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  });

  function formatDate(timestamp, showTime = true) {
    const date = new Date(timestamp * 1000);
    return (showTime ? dateFormatterWithTime : dateFormatterNoTime).format(
      date
    );
  }

  function getRelativeTime(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;

    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = 60 * MS_IN_SECOND;
    const MS_IN_HOUR = 60 * MS_IN_MINUTE;
    const MS_IN_DAY = 24 * MS_IN_HOUR;
    const MS_IN_MONTH = 30 * MS_IN_DAY;

    const diffMs = Math.abs(diff * 1000);

    if (diffMs < MS_IN_MINUTE) return "just now";

    if (diffMs < MS_IN_HOUR) {
      const minutes = Math.round(diffMs / MS_IN_MINUTE);
      return diff > 0
        ? `in ${minutes === 1 ? "1 minute" : minutes + " minutes"}`
        : `${minutes === 1 ? "1 minute" : minutes + " minutes"} ago`;
    }

    if (diffMs < MS_IN_DAY) {
      const hours = Math.round(diffMs / MS_IN_HOUR);
      return diff > 0
        ? `in ${hours === 1 ? "1 hour" : hours + " hours"}`
        : `${hours === 1 ? "1 hour" : hours + " hours"} ago`;
    }

    if (diffMs < MS_IN_MONTH) {
      const days = Math.round(diffMs / MS_IN_DAY);
      if (days === 1) return diff > 0 ? "tomorrow" : "yesterday";
      return diff > 0 ? `in ${days} days` : `${days} days ago`;
    }

    return false; // otherwise we will show the exact date
  }

  function setTimestamp(element) {
    const timestamp = element.getAttribute("data-timestamp");
    const relativeTime = getRelativeTime(timestamp);
    element.textContent = relativeTime || formatDate(timestamp, false);
    element.title = formatDate(timestamp);
    element.dataset.timeProcessed = "true";
  }

  function updateTimeElements() {
    const timeElements = document.querySelectorAll("time[data-timestamp]");
    timeElements.forEach((element) => {
      if (!element.dataset.timeProcessed) {
        setTimestamp(element);
      }
    });
  }

  // spacehey updates its timestamps every 6 seconds, resulting in replacing our changes
  // we need to observe the elements and update them again
  const observer = new MutationObserver((mutations) => {
    observer.disconnect(); // avoid infinite loop on firefox
    mutations.forEach((mutation) => {
      if (mutation.target.matches("time[data-timestamp]")) {
        const element = mutation.target;
        if (element.dataset.timeProcessed === "true") {
          setTimestamp(element);
        }
      }
    });
    document.querySelectorAll("time[data-timestamp]").forEach((element) => {
      observer.observe(element, {
        characterData: true,
        childList: true,
        subtree: false,
      });
    });
  });

  // required for IMs since timestamps are loaded dynamically
  const documentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const timeElements = node.querySelectorAll("time[data-timestamp]");
          timeElements.forEach((element) => {
            setTimestamp(element);
            observer.observe(element, { characterData: true, childList: true });
          });
        }
      });
    });
  });

  documentObserver.observe(document.body, { childList: true, subtree: true });

  updateTimeElements();

  document.querySelectorAll("time[data-timestamp]").forEach((element) => {
    observer.observe(element, { characterData: true, childList: true });
  });
})();
