// ==UserScript==
// @name         GitHub Profile Time Converter
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Convert GitHub profile local time from 24-hour format (e.g. “00:00”) to the 12-hour AM/PM style.
// @author       GooglyBlox
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525712/GitHub%20Profile%20Time%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/525712/GitHub%20Profile%20Time%20Converter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function convertTo12Hour(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return timeStr;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return hours + ':' + minutes + ' ' + suffix;
  }

  function updateLocalTime() {
    const localTimeItem = document.querySelector('li[itemprop="localTime"]');
    if (!localTimeItem) return;

    const labelEl = localTimeItem.querySelector('.p-label');
    if (!labelEl || !labelEl.firstChild) return;

    if (labelEl.textContent.match(/\b(AM|PM)\b/)) return;

    const timeRegex = /(\d{2}:\d{2})/;
    const originalText = labelEl.firstChild.textContent;
    const match = originalText.match(timeRegex);
    if (!match) return;

    const originalTime = match[1];
    const convertedTime = convertTo12Hour(originalTime);

    labelEl.firstChild.textContent = originalText.replace(originalTime, convertedTime);
  }

  updateLocalTime();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      updateLocalTime();
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
