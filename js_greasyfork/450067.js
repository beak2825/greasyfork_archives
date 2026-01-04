// ==UserScript==
// @name         数独快捷切换备注
// @namespace    FreezeNowSudoku
// @version      1.1
// @description  可以用来快捷切换备注开关，快捷键为小键盘的"."，目前只支持 sudoku.com
// @author       FreezeNow
// @match        *://sudoku.com/*
// @icon         https://sudoku.com/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450067/%E6%95%B0%E7%8B%AC%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/450067/%E6%95%B0%E7%8B%AC%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const notes = document.querySelector('.game-controls-item[data-action="pencil"]');
  if (notes) {
    document.addEventListener('keydown', (event) => {
      const code = event.code;
      if (code === 'NumpadDecimal') {
        const mousedownEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        notes.dispatchEvent(mousedownEvent);
        // 修改鼠标样式
        const pencilOn = document.querySelector('.pencil-mode');
        const game = document.querySelector('#game canvas');
        if (pencilOn) {
          game.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' class='icon-game-control' viewBox='0 0 30 31'%3E%3Cpath fill='%230072E3' d='M25.43 4.76a5.42 5.42 0 01.19 7.52l-.18.2-13.5 13.48a.91.91 0 01-1.21.08l-.1-.08-5.07-5.08-.59 4.34 3.25-.44c.44-.05.84.2 1 .58l.03.11.02.11c.06.47-.24.91-.7 1.03l-.1.02-4.45.6a.94.94 0 01-.79-.27.92.92 0 01-.26-.65v-.13l1-7.4a.92.92 0 01.19-.44l.08-.09L17.71 4.76a5.45 5.45 0 017.72 0zm.35 20.08a1 1 0 110 2h-8.7a1 1 0 010-2h8.7zM21.4 10.18L9.43 22.13 11.3 24l11.95-11.95-1.86-1.86zm-3.23-3.23L6.2 18.91l1.92 1.91L20.07 8.86l-1.9-1.9zm3.42-1.93c-.69 0-1.35.2-1.92.56l-.15.1 5.01 5 .1-.14c.33-.5.51-1.09.55-1.7l.01-.22a3.58 3.58 0 00-3.6-3.6z'%3E%3C/path%3E%3C/svg%3E") 2 24, auto`;
        } else {
          game.style.cursor = '';
        }
      }
    });
  }
})();

