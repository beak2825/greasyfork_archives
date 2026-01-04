// ==UserScript==
// @name         Anna’s Archive Auto Download
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Wait on a slow download page for Anna's Archive and auto click the Download button once it is ready
// @author       heartnn
// @match        https://annas-archive.org/slow_download/*
// @match        https://annas-archive.li/slow_download/*
// @match        https://annas-archive.se/slow_download/*
// @icon         https://annas-archive.org/apple-touch-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544083/Anna%E2%80%99s%20Archive%20Auto%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/544083/Anna%E2%80%99s%20Archive%20Auto%20Download.meta.js
// ==/UserScript==

function checkAndClickDownloadButton() {
  const intervalMs = 1000;
  let clicked = false;
  let intervalId;
  function check() {
    const btns = Array.from(document.getElementsByTagName("a")).filter(
      (ele) => ele.innerText === "📚 Download now"
    );
    if (btns.length > 0) {
      btns[0].click();
      clicked = true;
    }

    if (clicked && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  intervalId = setInterval(check, intervalMs);
}
checkAndClickDownloadButton()