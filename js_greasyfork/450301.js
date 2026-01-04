// ==UserScript==
// @name         Ulster bank autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autologin to ulster bank Ireland
// @author       You
// @match        https://www.anytimebanking.ulsterbank.ie/login.aspx
// @match        https://www.anytimebanking.ulsterbank.ie/Default.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450301/Ulster%20bank%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/450301/Ulster%20bank%20autologin.meta.js
// ==/UserScript==

const CUSTOMER_NUMBER = 'INSERT_CUSTOMER_NUMBER';
const PIN = 'INSERT_PIN';
const PASSWORD = 'INSERT_PASSWORD';

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


(async function() {
    'use strict';


     const input = await waitForElm('input[name="ctl00$mainContent$LI5TABA$CustomerNumber_edit"]')
     input.value = CUSTOMER_NUMBER

     const checkbox = await waitForElm('input[id="ctl00_mainContent_LI5TABA_LI5CBBCPAN"]')
     checkbox.checked = true


     const continueButton = document.querySelector('input[name="ctl00$mainContent$LI5TABA$LI5-LBB_button_button"]')
     continueButton.click()


})();

(async function() {
    const pinWrapper = await waitForElm('#PinWrapper')

    for (const pin of pinWrapper.querySelectorAll('label')) {
        const index = /\d/.exec(pin.innerHTML)[0] - 1
        const input = document.getElementById(pin.getAttribute('for'))
        input.value = PIN[index]
    }

    const passwordWrapper = await waitForElm('#PasswordWrapper')

    for (const password of passwordWrapper.querySelectorAll('label')) {
        const index = /\d*/.exec(password.innerHTML)[0] - 1
        const input = document.getElementById(password.getAttribute('for'))
        input.value = PASSWORD[index]
    }

     const loginButton = document.querySelector('input[name="ctl00$mainContent$next_text_button_button"]')
     loginButton.click()
})();