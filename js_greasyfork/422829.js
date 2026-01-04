// ==UserScript==
// @name         乾淨ㄉ原價屋
// @namespace    https://github.com/FlandreDaisuki
// @description  讓我好好的選零件…
// @version      2021.05.20
// @author       FlandreDaisuki
// @match        *://www.coolpc.com.tw/evaluate.php
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/422829/%E4%B9%BE%E6%B7%A8%E3%84%89%E5%8E%9F%E5%83%B9%E5%B1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422829/%E4%B9%BE%E6%B7%A8%E3%84%89%E5%8E%9F%E5%83%B9%E5%B1%8B.meta.js
// ==/UserScript==

// 推薦搭配 AdGuard Annoyances 過濾清單

/* cSpell:ignore vwpro mesg Ttitle Fitem */
/* global sentinel */

const $ = (s) => document.querySelector(s);

// 取消鎖右鍵
document.body.removeAttribute('oncontextmenu');
document.body.removeAttribute('onselectstart');

// 總金額預覽移到上面
sentinel.on('#fDiv', (floatingBar) => {
  sentinel.off('#fDiv');
  floatingBar.remove();
  $('#know').insertAdjacentElement('afterend', floatingBar);
});

// 保留輸出圖片功能
sentinel.on('#vwpro', () => {
  $('#doc').classList.add('zTop');
});

sentinel.on('button[onclick="Gauze(2)"]', (imageExportCancelBtnEl) => {
  sentinel.off('button[onclick="Gauze(2)"]');
  imageExportCancelBtnEl.addEventListener('click', () => {
    $('#doc').classList.remove('zTop');
  });
});

// 刪除無用的 iframe
const iframeSelectors = [
  'iframe[src^="/home"]',
  'iframe[src$="eval-mesg.php"]',
];

sentinel.on(String(iframeSelectors), (iframe) => {
  iframe.remove();
});

// 調整樣式
const styleEl = document.createElement('style');
document.body.appendChild(styleEl);
styleEl.textContent = `
body {
  overflow: auto !important;
}
#Psu,
#hid,
#Ttitle > tbody > tr:nth-of-type(1) > td:nth-of-type(2),
#Ttitle > tbody > tr:nth-of-type(2) {
  display: none !important;
}
#doc {
  z-index: -1 !important;
}
form[action="eva-excel.php"] {
  position: relative;
}
#Ttitle > tbody > tr:first-of-type > td:first-of-type {
  display: grid;
  grid-template-columns: repeat(2, auto);
}
#fDiv {
  position: relative;
  display: flex;
  transform: initial;
  left: inherit !important
}
#ftb {
  margin: 0;
  border: 2px solid black;
}
#Fitem {
  position: relative !important;
}
#doc.zTop {
  z-index: 20 !important;
  background: rgba(0, 0, 0, 0.8);
}
#MatchArea {
  position: absolute;
  top: 100%;
}`;
