// ==UserScript==
// @name CopyLS
// @namespace New LK
// @description copy ls from new lk
// @match *://lk.mango-office.ru/*
// @grant none
// @version 0.0.1.20190912072848
// @downloadURL https://update.greasyfork.org/scripts/390048/CopyLS.user.js
// @updateURL https://update.greasyfork.org/scripts/390048/CopyLS.meta.js
// ==/UserScript==

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text);
}

function ready() {
  if (document.getElementsByClassName('account-panel__data-cell')[0].getElementsByClassName('val')[0].innerText !== undefined) {
    $('.val').click(function(){copyTextToClipboard(this.innerHTML)});
    clearInterval(timerId);
  }
}

var timerId = setInterval(ready, 500);