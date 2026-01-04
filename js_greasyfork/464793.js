// ==UserScript==
// @name         WK Completed Lesson Replacement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add back the completed lesson amount to the lessons page on WK
// @author       Gorbit99
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464793/WK%20Completed%20Lesson%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/464793/WK%20Completed%20Lesson%20Replacement.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener("turbo:load", () => {
    setTimeout(checkUrl, 0);
  });
  window.addEventListener("didCompleteSubject", handleLessonCompletedEvent);

  let completedLessons = 0;

  function checkUrl() {
    if (location.pathname.match(/\/subjects\/\d+\/lesson/)
        || location.pathname.startsWith("/subjects/lesson/quiz")) {
      addCompletedLessonsIcon();
    }
  }

  function handleLessonCompletedEvent() {
    if (!location.pathname.startsWith("/subjects/lesson/quiz")) {
      return;
    }

    completedLessons++;
    const countElem = document.querySelector(
      ".subject-statistic-counts__item[data-category='Completed'] .subject-statistic-counts__item-count-text"
    );
    countElem.innerText = completedLessons;
  }

  function addCompletedLessonsIcon() {
    document.querySelectorAll(
      ".subject-statistic-counts__item[data-category='Completed']"
    ).forEach((e) => e.remove());

    const statisticsContainer = document.querySelector(".subject-statistic-counts");

    const completedStatsElement = document.createElement("div");
    completedStatsElement.classList.add("subject-statistic-counts__item");
    completedStatsElement.dataset.category = "Completed";

    const nameElement = document.createElement("div");
    nameElement.classList.add("subject-statistic-counts__item-label");
    nameElement.innerText = "C";

    const countElement = document.createElement("div");
    countElement.classList.add("subject-statistic-counts__item-count");
    const countIconElement = document.createElement("div");
    countIconElement.classList.add("subject-statistic-counts__item-count-icon");
    const countIconFAElement = document.createElement("i");
    countIconFAElement.classList.add("wk-icon", "fa-solid", "fa-check");
    countIconElement.append(countIconFAElement);
    const countTextElement = document.createElement("span");
    countTextElement.classList.add("subject-statistic-counts__item-count-text");
    countTextElement.innerText = completedLessons;
    countElement.append(countIconElement, countTextElement);

    completedStatsElement.append(nameElement, countElement);

    statisticsContainer.append(completedStatsElement);
  }
})();