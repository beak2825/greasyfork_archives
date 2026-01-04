// ==UserScript==
// @name         Upload_Market_by_el9in
// @namespace    Upload_Market_by_el9in
// @version      0.2
// @description  Upload Market
// @author       el9in
// @match        https://lzt.market/mass-upload/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466796/Upload_Market_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466796/Upload_Market_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const maxThreads = 3;
    const inputElement = document.querySelector('input[type="hidden"][name="_xfToken"]');
    const xfTokenValue = inputElement.value;
    const finishLoadElement = document.querySelector('div.MassUploadFinishedBadge.finishedBadge.hidden.mn-15-0');
    const url = window.location.href;
    const parts = url.split('/');
    const id = parts[parts.length - 2];
    const check = [];
    const divElements = document.querySelectorAll('div.account');
    const massUploadStats = document.querySelector('.MassUploadStats');
    const checked = massUploadStats.querySelector('.checked.label');
    const remaining = massUploadStats.querySelector('.left.label');
    const success = massUploadStats.querySelector('.success.label');
    const error = massUploadStats.querySelector('.error.label');
    var checkedCount = checked.textContent | 0;
    var remainingCount = remaining.textContent | 0;
    var successCount = success.textContent | 0;
    var errorCount = error.textContent | 0;
    divElements.forEach((divElement) => {
        const accountStatusElement = divElement.querySelector('.AccountStatus > .muted');
        const entryId = divElement.getAttribute('data-entry-id');
        check.push({
            entryId,
            statusElement: accountStatusElement
        });
    });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function checkAccount(accountData,close) {
        const Local = {
            times: 0,
            maxTimes: 20
        };
        if(accountData.statusElement) accountData.statusElement.textContent = 'EL9IN: Начата проверка.';
        while(true) {
            if(Local.times >= Local.maxTimes) return 0;
            const response = await fetch(`https://lzt.market/mass-upload/${id}/check-account`, {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-ajax-referer": `https://lzt.market/mass-upload/${id}/`,
                    "x-requested-with": "XMLHttpRequest",
                    "Referer": `https://lzt.market/mass-upload/${id}/`,
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": `entry_id=${accountData.entryId}&_xfRequestUri=%2Fmass-upload%2F${id}%2F&_xfNoRedirect=1&_xfToken=${xfTokenValue}&_xfResponseType=json`,
                "method": "POST"
            });
            const req = await response.json();
            const { error, item } = req;
            if(error == "captcha") {
                if(accountData.statusElement) accountData.statusElement.textContent = `EL9IN: ${error}`;
                Local.times++;
                await sleep(500);
                continue;
            } else if(error != null) {
                if(accountData.statusElement) accountData.statusElement.textContent = `EL9IN: ${error}`;
                Local.times++;
                errorCount ++;
                error.textContent = errorCount;
                return 0;
            } else {
                successCount ++;
                success.textContent = successCount;
                const { link } = item;
                if(accountData.statusElement) accountData.statusElement.textContent = `EL9IN: Успешно добавили ${link}`;
                if(close == true) {
                    const itemMarketId = extractIDFromURL(link);
                    try {
                        const status = await fetch(`https://lzt.market/${itemMarketId}/open-close?&_xfRequestUri=%2F${itemMarketId}%2F&_xfNoRedirect=1&_xfToken=${xfTokenValue}&_xfResponseType=json`, {
                            "headers": {
                                "accept": "application/json, text/javascript, */*; q=0.01",
                                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                                "x-ajax-referer": `https://lzt.market/${itemMarketId}/`,
                                "x-requested-with": "XMLHttpRequest",
                                "Referer": `https://lzt.market/${itemMarketId}/`,
                                "Referrer-Policy": "strict-origin-when-cross-origin"
                            },
                            "body": null,
                            "method": "GET"
                        });
                        const { _redirectStatus } = await status.json();
                        if(_redirectStatus == "ok") {
                            const svgHTML = `
						<svg viewBox="0 0 24 24" width="20" height="20" stroke="rgb(156 164 91)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
						  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
						  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
						</svg>
						`;
                            accountData.statusElement.insertAdjacentHTML('afterend', svgHTML);
                        }
                    } catch(error) {
                        return 2;
                    }
                }
            }
            return 1;
        }
    }
    const startStopButton = document.getElementById('MassStartStopButton');
    if(startStopButton) {
        const newButton = document.createElement('button');
        const newButtonAPI = document.createElement('button');
        newButton.id = 'MassStartStopButtonByEl9in';
        newButton.classList.add('toggle', 'primary', 'button');
        newButton.textContent = 'Начать и закрыть (EL9IN)';
        newButton.style.marginLeft = '3px';
        startStopButton.parentNode.insertBefore(newButton, startStopButton.nextSibling);
        newButton.addEventListener('click', async function() {
            startStopButton.parentNode.removeChild(startStopButton);
            newButton.parentNode.removeChild(newButton);
            newButtonAPI.parentNode.removeChild(newButtonAPI);
            runCheckAccounts(check,false);
        });
        newButtonAPI.id = 'MassStartStopButtonAPIByEl9in';
        newButtonAPI.classList.add('toggle', 'primary', 'button');
        newButtonAPI.textContent = 'Начать (EL9IN)';
        newButtonAPI.style.marginLeft = '3px';
        startStopButton.parentNode.insertBefore(newButtonAPI, startStopButton.nextSibling);
        newButtonAPI.addEventListener('click', async function() {
            startStopButton.parentNode.removeChild(startStopButton);
            newButton.parentNode.removeChild(newButton);
            newButtonAPI.parentNode.removeChild(newButtonAPI);
            runCheckAccounts(check,false);
        });
    }
    async function runCheckAccounts(check,close) {
        const semaphore = new Semaphore(maxThreads);
        const promises = [];
        for (let ck of check) {
            await semaphore.acquire();
            promises.push(
                (async () => {
                    await checkAccount(ck,close);
                    semaphore.release();
                })()
            );
            checkedCount ++;
            checked.textContent = checkedCount;
            remainingCount --;
            remaining.textContent = remainingCount;
        }
        await Promise.all(promises);
        if (finishLoadElement) {
            finishLoadElement.classList.remove('hidden');
        }
    }
    class Semaphore {
        constructor(maxCount) {
            this.maxCount = maxCount;
            this.counter = 0;
            this.waiters = [];
        }
        acquire() {
            if (this.counter < this.maxCount) {
                this.counter++;
                return Promise.resolve();
            } else {
                return new Promise(resolve => {
                    this.waiters.push(resolve);
                });
            }
        }
        release() {
            if (this.waiters.length > 0) {
                const waiter = this.waiters.shift();
                waiter();
            } else {
                this.counter--;
            }
        }
    }
    function extractIDFromURL(url) {
        const trimmedURL = url.endsWith('/') ? url.slice(0, -1) : url;
        const parts = trimmedURL.split('/');
        const id = parts[parts.length - 1];
        return id;
    }
})();