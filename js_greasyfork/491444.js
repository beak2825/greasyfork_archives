// ==UserScript==
// @name         Gmail Unsubscribe Gitlab issues
// @namespace    https://violentmonkey.github.io/
// @version      0.1.6
// @license      MIT
// @grant        GM.openInTab
// @grant        window.close
// @description  Unsubscribe by pressing \
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/491444/Gmail%20Unsubscribe%20Gitlab%20issues.user.js
// @updateURL https://update.greasyfork.org/scripts/491444/Gmail%20Unsubscribe%20Gitlab%20issues.meta.js
// ==/UserScript==

function unsubscribe(event) {
  if (event.key !== "\\") {
    return;
  }

  const link = Array.from(document.querySelectorAll('a[href^="https://gitlab.com/-/sent_notifications/"]')).findLast(node => node.innerText === 'Unsubscribe');
  if (!link) {
    console.log("no link");
    return;
  }
  console.log(link);
  let tabControl = GM.openInTab(link.href, true);
  console.log("link open");

  setTimeout(() => {
    tabControl.close();
    console.log("tab close");
  },5000);

  const downEvt = new MouseEvent("mousedown");
  const upEvt = new MouseEvent("mouseup");

  const del = Array.from(document.querySelectorAll('[role="button"]')).find(node => node.innerText === 'Delete')
  console.log(del);

  if (!del) {
    console.log("no delete");
      return;
  }

  del.dispatchEvent(downEvt);
  setTimeout(() => del.dispatchEvent(upEvt));
  console.log("del evt");
}

(function() {
    'use strict';
    document.addEventListener('keypress', unsubscribe);
})();