// ==UserScript==
// @name         Add "Copy Tracking URL"
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Adds 'Copy Tracking URL' directly to the sidebar for easy access.
// @author       https://github.com/lirobinxc
// @match        https://chitchats.com/clients/*/shipments/*
// @icon         https://www.google.com/s2/favicons?domain=chitchats.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425852/Add%20%22Copy%20Tracking%20URL%22.user.js
// @updateURL https://update.greasyfork.org/scripts/425852/Add%20%22Copy%20Tracking%20URL%22.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let trackingNum;
  let intv;

  const btn = document.createElement('button');
  btn.innerHTML = 'Copy Tracking URL';
  btn.setAttribute('id', 'gfs-button');
  btn.setAttribute('class', 'btn btn-outline-gray btn-sm js-tooltip js-copy');

  function createIntv() {
    intv = setInterval(function () {
      let trackingBox = document.querySelector('.info-panel.p-4 .clearfix');
      let dBlockEle = trackingBox
        ? trackingBox.querySelector('.d-block')
        : null;
      let btnEle = trackingBox
        ? trackingBox.querySelector('#gfs-button')
        : null;
      trackingNum = trackingBox
        ? trackingBox.querySelector('strong').innerText
        : null;
      if (!trackingBox && !btnEle) {
        return false;
      }
      if (!btnEle) {
        btn.innerHTML = 'Copy Tracking URL';
        trackingBox.appendChild(btn);
        const trackingURL = `https://chitchats.com/tracking/${trackingNum}`;
        btn.addEventListener('click', () => copy(trackingURL));
      }
    }, 500);
  }
  createIntv();

  function copy(str) {
    let textArea = document.createElement('textarea');
    textArea.value = str;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    btn.innerHTML = 'Copied!';
    textArea.remove();
  }
})();
