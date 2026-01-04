// ==UserScript==
// @name         GitHub Copilot automatically obtains GHU
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically fill and submit GitHub device authorization code, and handle confirmation page by form submission after fully loaded.
// @author       NingMengGuoRou
// @match        https://github.com/login/device*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489793/GitHub%20Copilot%20automatically%20obtains%20GHU.user.js
// @updateURL https://update.greasyfork.org/scripts/489793/GitHub%20Copilot%20automatically%20obtains%20GHU.meta.js
// ==/UserScript==

(function() {
    'use strict';
//   const fetchTokenUrl = '改成你自己的http(s)://ip:端口';
  const fetchTokenUrl = 'https://xxxx:9191';
    async function getUserCode() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: fetchTokenUrl+"/get_user_code",
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.user_code) {
                            resolve(data.user_code);
                        } else {
                            reject("Failed to get user code");
                        }
                    } catch (e) {
                        reject(e.toString());
                    }
                },
                onerror: function(error) {
                    reject(error.toString());
                }
            });
        });
    }
    function waitForElement(selector, delay = 50, maxAttempts = 20) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                attempts++;
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error(`Element ${selector} not found`));
                }
            }, delay);
        });
    }
    async function fillAndSubmitCode() {
        try {
            const userCode = await getUserCode();
            const codeParts = userCode.split('-');
            if (codeParts.length !== 2) {
                console.error("Invalid user code format.");
                return;
            }
            for (let i = 0; i < codeParts[0].length; i++) {
                waitForElement(`#user-code-${i}`).then(el => el.value = codeParts[0][i]);
            }
            for (let i = 0; i < codeParts[1].length; i++) {
                waitForElement(`#user-code-${i + 5}`).then(el => el.value = codeParts[1][i]);
            }
            waitForElement('input[type="submit"][name="commit"]').then(button => setTimeout(() => button.click(), 1000));
        } catch (error) {
            console.error(error);
        }
    }
    // function autoSubmitFormOnConfirmation() {
    //     const observer = new MutationObserver((mutations, obs) => {
    //         const form = document.querySelector('form');
    //         if (form) {
    //             const authorizeButton = form.querySelector('button[name="authorize"][value="1"]');
    //             if (authorizeButton) {
    //                 setTimeout(() => {
    //                     form.submit();
    //                     obs.disconnect();
    //                 }, 1000);
    //             }
    //         }
    //     });
    //     observer.observe(document.body, { childList: true, subtree: true });
    // }
    function autoSubmitFormOnConfirmation() {
      console.log("--------------------------------------------------------")
          window.addEventListener('load', () => {
            waitForElement('form[action="/login/device/authorize"] button[name="authorize"][value="1"]')
                .then(button => setTimeout(() => button.click(), 1000))
                .catch(error => console.error(error));
        });
    }
    if (window.location.pathname.includes('/login/device')) {
        fillAndSubmitCode();
    }
    if (window.location.pathname.includes('/login/device/confirmation')) {
        autoSubmitFormOnConfirmation();
    }
    if (window.location.pathname.includes('/login/device/success')) {
      // Add a delay before executing the GM_xmlhttpRequest call
setTimeout(function() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: fetchTokenUrl+"/success",
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                console.log(data);
                if (data.token) {
                    const message = document.createElement('div');
                    message.style.position = 'fixed';
                    message.style.left = '0';
                    message.style.top = '0'; // Changed from bottom to top
                    message.style.width = '100%';
                    message.style.backgroundColor = 'green';
                    message.style.color = 'white';
                    message.style.textAlign = 'center';
                    message.style.padding = '10px';
                    message.style.fontSize = '20px';
                    message.style.zIndex = '1000'; // Ensure it's on top of other elements
                    message.innerText = 'Authorization successful! You can now close this window GHU：'+data.token;
                    document.body.appendChild(message);
                } else {
                    console.error("Token fetch error: ", data.error);
                }
            } catch (e) {
                console.error("Response parsing error: ", e);
            }
        },
        onerror: function(error) {
            console.error("Request failed: ", error);
        }
    });
}, 1000); // Delay set to 5000 milliseconds (5 seconds)
    }
})();
