// ==UserScript==
// @name         数独-自动隐藏已填写9次的数字
// @namespace    FreezeNowSudokuHideNumberButton
// @version      1.2
// @description  可以用来隐藏已在九宫格中存在九个的数字按钮，目前只支持 sudoku.com
// @author       FreezeNow
// @match        *://sudoku.com/*
// @icon         https://sudoku.com/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450450/%E6%95%B0%E7%8B%AC-%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E5%B7%B2%E5%A1%AB%E5%86%999%E6%AC%A1%E7%9A%84%E6%95%B0%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/450450/%E6%95%B0%E7%8B%AC-%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E5%B7%B2%E5%A1%AB%E5%86%999%E6%AC%A1%E7%9A%84%E6%95%B0%E5%AD%97.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const numpadItems = document.querySelectorAll('.numpad-item');
  if (!numpadItems) {
    return;
  }
  document.addEventListener('keydown', async () => {
    // 如果在备注模式，则退出
    const pencilOn = document.querySelector('.pencil-mode');
    if (pencilOn) {
      return;
    }
    // 不延时的话，会导致拿到的是上一步的数据
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
    const mode = window.mode;
    let info;
    switch (mode) {
      case 'daily': {
        const newDate = new Date();
        const dcDate =
          sessionStorage.getItem('dc-date') ?? `${newDate.getFullYear()}_${newDate.getMonth()}_${newDate.getDate()}`;
        const dailyInfoString = localStorage.getItem('dailyInfo');
        if (!dailyInfoString) {
          return;
        }
        const dailyInfo = JSON.parse(dailyInfoString);
        info = dailyInfo[dcDate];
        break;
      }
      case 'classic': {
        const main_gameString = localStorage.getItem('main_game');
        if (!main_gameString) {
          return;
        }
        info = JSON.parse(main_gameString);
        break;
      }
      case 'event': {
        const live_opsString = localStorage.getItem('live_ops');
        const live_ops_level = sessionStorage.getItem('live_ops_level');
        if (!live_opsString) {
          return;
        }
        const liveOps = JSON.parse(live_opsString);
        for (const key in liveOps.progress) {
          if (Object.hasOwnProperty.call(liveOps.progress, key)) {
            const element = liveOps.progress[key];
            if (element.id == live_ops_level) {
              info = element;
              break;
            }
          }
        }
        break;
      }
    }
    if (!info) {
      return;
    }
    const infoValues = info.values;
    if (!infoValues?.length) {
      return;
    }
    const numberMap = {};
    for (let i = 0; i < infoValues.length; i++) {
      const element = infoValues[i];
      const val = element.val;
      if (val) {
        if (!numberMap[val]) {
          numberMap[val] = 0;
        }
        numberMap[val]++;
      }
    }
    for (const number in numberMap) {
      if (Object.hasOwnProperty.call(numberMap, number)) {
        const count = numberMap[number];
        const numpadItem = numpadItems[number - 1];
        if (count === 9) {
          numpadItem.style.opacity = 0.1;
        } else {
          numpadItem.style.opacity = 1;
        }
      }
    }
  });
})();

