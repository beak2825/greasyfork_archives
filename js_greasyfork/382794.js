// ==UserScript==
// @name        oxy.cloud download helper
// @description Skip ads asking for push notification permission.
// @version     1.0.2
// @namespace   moe.jixun
// @match       https://oxy.cloud/d/*
// @match       https://*.newsravel.com/*
// @match       https://*.news-hwh.com/*
// @match       https://*.infograet.info/*
// @match       https://*.ecofakultet.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382794/oxycloud%20download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/382794/oxycloud%20download%20helper.meta.js
// ==/UserScript==

if (location.hostname.endsWith('oxy.cloud')) {
  handleOxyCloud();
} else {
  handleAdsDomain();
}

function handleAdsDomain () {
  delete window.Notification;
  delete window.fetch;
}

function handleOxyCloud () {
  addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
.button-list__container > a,
.button-list__container > div:not(.text-left) {
  display: none;
}
  `.trim();
    document.head.appendChild(style);

    //////

    const dlBtn = document.querySelector('#divdownload > a');
    if (!dlBtn) { return; }

    dlBtn.click();
  });
}
