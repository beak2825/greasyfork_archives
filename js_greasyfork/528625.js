// ==UserScript==
// @name         cryptoclaimhub.com bruteforce captcha test
// @namespace    http://tampermonkey.net/
// @version      2025-03-02
// @description  тупо нажимает 2 пока не попадет
// @author       Danik Odze
// @match        https://cryptoclaimhub.com/faucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoclaimhub.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528625/cryptoclaimhubcom%20bruteforce%20captcha%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/528625/cryptoclaimhubcom%20bruteforce%20captcha%20test.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var CaptchaSolverStatus = document.createElement('div');
    document.body.appendChild(CaptchaSolverStatus);

    CaptchaSolverStatus.classList.add('captchasolver-status');
	document.body.appendChild(document.createElement('style')).textContent = (`
                .captchasolver-status {
                position: fixed;
                font-size: 20px !important;
                top: 140px !important;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
                }
                `);

    function setCaptchaSolverStatus(html, color) {
        if (color === 'green') {
            CaptchaSolverStatus.style.color = 'green';
        } else if (color === 'red') {
            CaptchaSolverStatus.style.color = 'red';
        } else {
            CaptchaSolverStatus.style.color = 'black';
        }
        CaptchaSolverStatus.innerHTML = html;
    }

    setCaptchaSolverStatus(document.querySelector("body > div > div > nav > div > ul > li > p > span.badge.badge-primary-light").textContent, 'red');
class WorkerInterval {
  worker = null;
  constructor(callback, interval) {
    const blob = new Blob([`setInterval(() => postMessage(0), ${interval});`]);
    const workerScript = URL.createObjectURL(blob);
    this.worker = new Worker(workerScript);
    this.worker.onmessage = callback;
  }

  stop() {
    this.worker.terminate();
  }
}
   const interval = new WorkerInterval(() => {
	//1 минута = 60000 миллисекунд.
    location.reload();
}, 7*60000);

if(document.querySelector("#iconContainer > div:nth-child(2) > i"))document.querySelector("#iconContainer > div:nth-child(2) > i").click();
if(document.querySelector("#claimButton"))document.querySelector("#claimButton").click();
})();