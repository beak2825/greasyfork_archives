// ==UserScript==
// @name         Save citations to your library
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save all citations of a paper to your library
// @author       yusanshi
// @license      MIT
// @match        https://scholar.google.com/scholar?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @require      https://cdn.jsdelivr.net/gh/uzairfarooq/arrive@77ff92c058598997e7da9789376b7a666a6d40db/src/arrive.js
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/450419/Save%20citations%20to%20your%20library.user.js
// @updateURL https://update.greasyfork.org/scripts/450419/Save%20citations%20to%20your%20library.meta.js
// ==/UserScript==
const sleepTime = 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const work = async (targetLibrary) => {
  await document.arrive('#gs_res_ccl_mid > div.gs_r.gs_or.gs_scl', {
    onceOnly: true,
    existing: true,
  });
  // Process the current page
  for (const e of document.querySelectorAll(
    '#gs_res_ccl_mid > div.gs_r.gs_or.gs_scl'
  )) {
    e.scrollIntoView();
    e.querySelector('div.gs_fl a.gs_or_sav span.gs_or_btn_lbl').click();
    await sleep(sleepTime);
    await document.arrive('#gs_md_albl-d.gs_vis div.gs_ldb_lbc', {
      onceOnly: true,
      existing: true,
    });

    let temp = [
      ...document.querySelectorAll('#gs_md_albl-d.gs_vis div.gs_ldb_lbc'),
    ].filter((a) => a.textContent === targetLibrary);
    if (temp.length === 0) {
      // create a new library
      document
        .querySelector('#gs_md_albl-d.gs_vis form span.gs_ldb_new_lb')
        .click();
      document.querySelector(
        '#gs_md_albl-d.gs_vis #gs_lbd_new_txt input'
      ).value = targetLibrary;
    } else {
      // select the old library
      temp = temp[0].querySelector('a');
      temp.scrollIntoView();
      if (!temp.classList.contains('gs_sel')) {
        temp.click();
      }
    }

    await sleep(sleepTime);
    document.querySelector('#gs_lbd_apl > span.gs_wr > span').click();
    await sleep(sleepTime);
  }

  const nextPage = document.querySelector(
    '#gs_n > center > table > tbody > tr > td > span.gs_ico_nav_current'
  ).parentElement.nextElementSibling;
  if (nextPage.innerText.trim() !== '') {
    nextPage.querySelector('a').click();
  }
};

(async function () {
  'use strict';

  document.body.insertAdjacentHTML(
    'beforeend',
    `<div
    style="
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(240, 240, 240, 0.9);
      z-index: 1;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 6px;
      display: flex;
      align-items: center;
    "
  >
    <label>Target library</label>
    <input type="text" id="targetLibrary" style="margin-left:6px;margin-right:10px" />
    <label>Current paper</label>
    <input type="text" id="currentPaper"  style="margin-left:6px;margin-right:10px" />
    <input
      type="checkbox"
      id="running"
      style="width: 16px; height: 16px"
    />
  </div>
  `
  );
  await document.arrive('#targetLibrary', {
    onceOnly: true,
    existing: true,
  });
  await document.arrive('#currentPaper', {
    onceOnly: true,
    existing: true,
  });
  await document.arrive('#running', {
    onceOnly: true,
    existing: true,
  });
  const targetLibraryInput = document.querySelector('#targetLibrary');
  const currentPaperInput = document.querySelector('#currentPaper');
  const runningCheckbox = document.querySelector('#running');

  targetLibraryInput.addEventListener('input', () => {
    GM.setValue('targetLibrary', targetLibraryInput.value.trim());
  });
  currentPaperInput.addEventListener('input', () => {
    GM.setValue('currentPaper', currentPaperInput.value.trim());
  });
  runningCheckbox.addEventListener('change', () => {
    GM.setValue('running', runningCheckbox.checked ? 'on' : 'off');
  });

  const targetLibrary = await GM.getValue('targetLibrary', '');
  const currentPaper = await GM.getValue('currentPaper', '');
  const running = await GM.getValue('running', 'off');

  targetLibraryInput.value = targetLibrary;
  currentPaperInput.value = currentPaper;
  runningCheckbox.checked = running === 'on';

  const params = new URL(window.location.href).searchParams;

  if (
    targetLibrary !== '' &&
    params.get('cites') === currentPaper &&
    params.get('q') === null &&
    running === 'on'
  ) {
    work(targetLibrary);
  }
})();
