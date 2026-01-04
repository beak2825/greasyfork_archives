// ==UserScript==
// @name         (MTurk) Show Qualtrics Survey Progress
// @namespace    https://greasyfork.org/en/users/367017-shinobu-oshino
// @version      1.28
// @description  Shows hidden progress on qualtrics surveys
// @author       letsfindcommonground (mktemp@pm.me)
// @match        https://*.qualtrics.com/*
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/389842/%28MTurk%29%20Show%20Qualtrics%20Survey%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/389842/%28MTurk%29%20Show%20Qualtrics%20Survey%20Progress.meta.js
// ==/UserScript==

var currentProgressPositionIndex = 0;
const progressPositions = [
   'top: 0; left: 0; bottom: unset; right: unset; border-radius: 0 0 8px 0;',
   'top: 0; right: 0; bottom: unset; left: unset; border-radius: 0 0 0 8px;',
   'bottom: 0; left: 0; top: unset; right: unset; border-radius: 0 8px 0 0;',
   'bottom: 0; right: 0; top: unset; left: unset; border-radius: 8px 0 0 0;'
];

function waitForElement(selector) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);

            if(element) {
               resolve(element);

               clearInterval(interval);
            }
        }, 50);
    });
}

function removeOldProgressBar() {
    const oldProgressBar = document.querySelector('#ProgressBar');

    if(oldProgressBar) {
        oldProgressBar.style.display = 'none';
    }
}

function updateProgressStyle(indicator) {
    GM.setValue('progressStyle', currentProgressPositionIndex++);
    const currentPosition = progressPositions[currentProgressPositionIndex % progressPositions.length];

    indicator.style.cssText = `
        color: white; background: black; padding: 8px 12px;
cursor: pointer; position: fixed; font-family: 'Roboto', sans-serif; font-size: 0.9em;
${currentPosition}
     `;
}

(async function() {
    'use strict';

    currentProgressPositionIndex = await GM.getValue('progressStyle', 0);
    console.log(currentProgressPositionIndex);

    const page = await waitForElement('#Page');

    const pageObserver = new MutationObserver(removeOldProgressBar);
    pageObserver.observe(page, {
       childList: true
    });

   const progress = unsafeWindow.QSettings.pt.ProgressPercent;

    const indicator = document.createElement('span');
    indicator.textContent = `${progress}%`;
    updateProgressStyle(indicator);

    indicator.addEventListener('click', () => {
        updateProgressStyle(indicator);
    }, false);
    document.body.appendChild(indicator);

    const oldXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;

    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, async) {
        if(url.includes('next?rand=')) {
            this.addEventListener('load', function() {
                const result = JSON.parse(this.response);
                indicator.textContent = `${result.ProgressPercent}%`;
            });
        }

        return oldXHROpen.apply(this, arguments);
    };
})();