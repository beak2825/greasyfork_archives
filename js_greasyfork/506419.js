// ==UserScript==
// @name         Hunter-ed quick pass
// @namespace    http://tampermonkey.net/
// @version      2024-09-02
// @description  Quickly pass the Hunter-ed course.
// @author       You
// @match        https://www.hunter-ed.com/course/content/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hunter-ed.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506419/Hunter-ed%20quick%20pass.user.js
// @updateURL https://update.greasyfork.org/scripts/506419/Hunter-ed%20quick%20pass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("next-button").style.display = "block";

    const markSegmentComplete = function() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxRetries = 3;
            const retryInterval = 1000; // in milliseconds
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const attemptRequest = () => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: window.location.pathname + "/set_complete",
                    headers: {
                        'Origin': 'https://www.hunter-ed.com',
                        'Priority': 'u=1, i',
                        'Referer': 'https://www.hunter-ed.com/course/content/137925/',
                        'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                        'Sec-CH-UA-Mobile': '?0',
                        'Sec-CH-UA-Platform': '"Windows"',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                        'X-CSRF-Token': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.status);
                        } else {
                            handleError(response.status, response.responseText);
                        }
                    },
                    onerror: function(response) {
                        handleError(response.status, response.responseText);
                    }
                });
            };

            const handleError = (status, responseText) => {
                if (status === 422) {
                    console.error(`Unprocessable Entity. Status: ${status}.`);
                    reject(new Error(`Unprocessable Entity. Status: ${status}.`));
                    return; // Stop further retries for 422
                }

                if (attempts < maxRetries) {
                    attempts++;
                    console.warn(`Retrying... Attempt ${attempts}. Status: ${status}`);
                    setTimeout(attemptRequest, retryInterval);
                } else {
                    const errorMessage = `Failed to mark segment complete after 3 retries. Last Status: ${status}`;
                    console.error(errorMessage);
                    reject(new Error(errorMessage));
                }
            };

            attemptRequest();
        });
    };

    markSegmentComplete().then(status => {
        console.log(`Segment marked as complete. Status: ${status}`);
    }).catch(error => {
        console.error(error);
    });
        setInterval(() => {
        const button = document.querySelector('.btn.btn-lg.btn-success');
        if (button) button.click();
    }, 1000);
})();
