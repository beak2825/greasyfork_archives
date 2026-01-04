// ==UserScript==
// @name        MAL set finish date from history
// @namespace   Violentmonkey Scripts
// @match       https://myanimelist.net/ownlist/anime/*/edit*
// @match       https://myanimelist.net/ownlist/anime/add*
// @grant       none
// @version     1.2.1
// @author      rias75
// @license     MIT
// @description Shortcut to set finish watch date based on watch history
// @downloadURL https://update.greasyfork.org/scripts/473808/MAL%20set%20finish%20date%20from%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/473808/MAL%20set%20finish%20date%20from%20history.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(async window => {
    console.log(2);
  await addButton('#end_date_insert_today', () => setFinishDate());
  await addButton('#start_date_insert_today', () => setStartDate());
  console.info('[MAL SET FINISH DATE SCRIPT] Listener set');
})(window);

async function setDate(dateType) {
  const historyButton = document.querySelector('.thickbox');
  if (!historyButton) {
    throw new Error("Didn't find historyButton");
  }

  const response = await fetch(historyButton.href);
  const html = await response.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');

  let episode = dom.querySelector('.spaceit_pad:last-child');
  if (dateType === 'finish') {
    episode = dom.querySelector('.spaceit_pad');
  }

  if (!episode) {
    return alert('No info');
  }

  console.info('Episode info:', episode.innerText);
  const [, month, day, year] = episode.innerHTML.match(/watched on (\d+)\/(\d+)\/(\d+)/);

  const monthSelect = document.querySelector(`#add_anime_${dateType}_date_month`);
  const daySelect = document.querySelector(`#add_anime_${dateType}_date_day`);
  const yearSelect = document.querySelector(`#add_anime_${dateType}_date_year`);

  if (!monthSelect) {
    throw new Error(`Didn't find ${dateType} monthSelect`);
  }
  if (!daySelect) {
    throw new Error(`Didn't find ${dateType} daySelect`);
  }
  if (!yearSelect) {
    throw new Error(`Didn't find ${dateType} yearSelect`);
  }

  monthSelect.value = parseInt(month).toString();
  daySelect.value = parseInt(day).toString();
  yearSelect.value = parseInt(year).toString();
}

async function setStartDate() {
  await setDate('start');
}

async function setFinishDate() {
  await setDate('finish');
}

async function addButton(selector, handler) {
  const insertTodayButton = await waitForElement(selector);
  const insertFromHistoryButton = document.createElement('a');
  insertFromHistoryButton.innerHTML = 'Insert from history';
  insertFromHistoryButton.setAttribute('href', '#');
  insertFromHistoryButton.addEventListener('click', async event => {
    event.preventDefault();
    handler();
  });
  insertTodayButton.parentNode.insertBefore(insertFromHistoryButton, insertFromHistoryButton.nextSibling);
}

async function waitForElement(selector, win = window) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const node = win.document.querySelector(selector);
      if (node) {
        clearInterval(interval);
        resolve(node);
      }
    }, 250);
  });
}
