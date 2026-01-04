// ==UserScript==
// @name          PTP Top 10 Archive Navigation
// @namespace     https://greasyfork.org/en/users/1051538
// @description   Add a date picker to the Most Snatched Movies Archive
// @match         https://passthepopcorn.me/top10.php*type=movies_snatched_archive*
// @version       1.0.0
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/494502/PTP%20Top%2010%20Archive%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/494502/PTP%20Top%2010%20Archive%20Navigation.meta.js
// ==/UserScript==

'use strict';

let thisPage, numPages;
const oneWeek = 604800000;
const earliestDate = 1239580800000; // 2009-04-13

const $ = (sel, parent = document) => parent.querySelector(sel);
const getPage = elt => +(/page=(\d+)/.exec(elt)?.[1] ?? elt.textContent);
const getDateStr = page => new Date(earliestDate + (numPages - page) * oneWeek).toISOString().slice(0, 10);

const update = () => {
  thisPage = getPage($('span', pagination));
  numPages = getPage(pagination.lastElementChild);
  Object.assign($('#date_picker'), { value: getDateStr(thisPage), max: getDateStr(0.1) });
  document.querySelectorAll('.pagination__link').forEach(elt => (elt.title = getDateStr(getPage(elt))));
};

const onClickGo = evt => {
  const selectedDate = new Date($('#date_picker').value);
  const offset = Math.floor((selectedDate - earliestDate) / oneWeek);
  const newPage = Math.min(Math.max(numPages - offset, 1), numPages) || thisPage;
  if (newPage !== thisPage) {
    const link = $('a', pagination);
    link.href = link.href.replace(/page=\d+/, `page=${newPage}`);
    link.click(); // trigger ajax
  } else {
    update();
  }
};

const pagination = $('.pagination');
if (pagination) {
  $('.page__title').insertAdjacentHTML('afterend', `
    <span style="position: absolute;">
      <input id="date_picker" type="date" min="2009-04-13">
      <input type="button" value="Go">
    </span>
  `);

  update();
  new MutationObserver(update).observe(pagination, { childList: true });
  $('#date_picker + input').addEventListener('click', onClickGo);
}