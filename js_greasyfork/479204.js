// ==UserScript==
// @name         WaniKani Update Review Count and Forecast
// @namespace    http://wanikani.com
// @version      0.1.3
// @description  Auto update Update Review Count and Forecast by hour
// @author       polv
// @match        *://www.wanikani.com/*
// @match        *://preview.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479204/WaniKani%20Update%20Review%20Count%20and%20Forecast.user.js
// @updateURL https://update.greasyfork.org/scripts/479204/WaniKani%20Update%20Review%20Count%20and%20Forecast.meta.js
// ==/UserScript==

(function () {
  'use strict';

  wkof.include('ItemData');

  Object.assign(window, { updateWkStats });

  addEventListener('turbo:load', (ev) => {
    const u = new URL(ev.detail?.url);
    if (['/', '/dashboard', '/dashboard/'].includes(u.pathname)) {
      setTimeout(updateWkStats, getMillisecondsToNewHour());
    }
  });

  let timeoutId = 0;

  async function updateWkStats() {
    const updateFrame = async (nextUpdate = 1000 * 60 * 60) => {
      const forecastFrame = document.querySelector(
        'turbo-frame[data-controller="review-forecast"]',
      );
      if (forecastFrame) forecastFrame.reload();

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateFrame(), nextUpdate);

      return wkof
        .ready('ItemData')
        .then(() =>
          wkof.ItemData.get_items({
            wk_items: { options: { assignments: true } },
          }),
        )
        .then((rs) => {
          const reviewsBtn = document.querySelector(
            '.lessons-and-reviews__reviews-button',
          );
          if (!reviewsBtn) return;

          const d = new Date().toISOString();
          const count = rs.filter(
            (r) => r.assignments?.available_at <= d,
          ).length;

          let countClass = 0;
          if (count >= 1000) {
            countClass = 1000;
          } else if (count >= 500) {
            countClass = 500;
          } else if (count >= 250) {
            countClass = 250;
          } else if (count >= 100) {
            countClass = 100;
          } else if (count >= 50) {
            countClass = 50;
          } else if (count) {
            countClass = 1;
          }

          const clickable = document.createElement('a');
          clickable.href = '/subjects/review';

          clickable.className =
            reviewsBtn.className.replace(
              / lessons-and-reviews__reviews-button--\d+/,
              '',
            ) +
            ' lessons-and-reviews__reviews-button--' +
            countClass;
          clickable.title = reviewsBtn.title;
          clickable.append(...reviewsBtn.childNodes);

          const elCount = clickable.querySelector(
            '.lessons-and-reviews__button-count',
          );
          if (elCount) {
            elCount.innerText = count;
          }

          reviewsBtn.replaceWith(clickable);
        });
    };
    return updateFrame();
  }

  function getMillisecondsToNewHour() {
    const d = new Date();
    return (
      60 * 60 * 1000 -
      ((d.getMinutes() * 60 + d.getSeconds()) * 1000 + d.getMilliseconds())
    );
  }
})();
