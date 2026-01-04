// ==UserScript==
// @name         PAIZAそーたー
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  PAIZAのスキルチェック問題を並び替える
// @author       SWIU
// @match        https://paiza.jp/challenges
// @match        https://paiza.jp/challenges/ranks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paiza.jp
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/478594/PAIZA%E3%81%9D%E3%83%BC%E3%81%9F%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/478594/PAIZA%E3%81%9D%E3%83%BC%E3%81%9F%E3%83%BC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const pGroup = document.querySelector(`.problem-group`), pBoxes = [...pGroup.getElementsByClassName(`problem-box`)];
  setDatasetForSort(pBoxes);
  addSortButton();

  function addSortButton() {
    let btnHTML = ``;
    for (const key in pBoxes[0].dataset) btnHTML += `<input type="button" class="c-btn c-btn--white" value="${key}" data-asc="asc">`;
    const groupHTML = `<div id="sortbtnGroup">↑↓${btnHTML}↑↓</div>`;
    const pGroupTitle = pGroup.querySelector(`.problem-group__title`);
    pGroupTitle.insertAdjacentHTML(`afterend`, groupHTML);

    const btns = sortbtnGroup.querySelectorAll(`.c-btn`);
    for (const btn of btns) btn.addEventListener(`click`, btnClicked, false);
  }

  function btnClicked() {
    pBoxSort(this.value, this.dataset.asc);
    this.dataset.asc = this.dataset.asc === `asc` ? `desc` : `asc`;
  }

  function setDatasetForSort(pBoxes) {
    for (const pBox of pBoxes) {
      pBox.dataset[`問題番号`] = pBox.querySelector(`.problem-box__header__title`).textContent.split(`:`)[0].slice(1);
      const dtdd = [...pBox.querySelectorAll(`dt,dd`)];
      for (let i = 0; i < dtdd.length; i += 2) {
        const key = dtdd[i].textContent.replace(`：`, ``);
        const val = parseFloat(dtdd[i + 1].textContent.replace(/,/g, ``));
        pBox.dataset[key] = val;
      }
      pBox.dataset[`解答時間`] = parseFloat(pBox.querySelector(`.problem-box__header__note strong`)?.textContent.replace(`分`, `.`));
    }
  }

  function pBoxSort(sortKey, sortType) {
    const sortFunc = sortType === `asc` ? (a, b) => a.dataset[sortKey] - b.dataset[sortKey] : sortType === `desc` ? (a, b) => b.dataset[sortKey] - a.dataset[sortKey] : null;
    pBoxes.sort(sortFunc);

    const df = document.createDocumentFragment();
    for (const pBox of pBoxes) df.appendChild(pBox);
    pGroup.appendChild(df);
  }
})();