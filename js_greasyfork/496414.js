// ==UserScript==
// @name         starly.fun
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  starly
// @author       LTW
// @license      none
// @match        https://starly.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=starly.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496414/starlyfun.user.js
// @updateURL https://update.greasyfork.org/scripts/496414/starlyfun.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const email = "";
    const senha = "";
    const redirecionamento = "https://starly.fun/faucet"

 setTimeout(function () {location.reload(); }, 120000);
    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');
if (wasButtonClicked()) {removeButtonClicked();window.location.href = redirecionamento;}
if (window.location.href === 'https://starly.fun/') {window.location.href = 'https://starly.fun/login';}
if (window.location.href === 'https://starly.fun/home') {window.location.href = 'https://starly.fun/faucet';}
  if (window.location.href === 'https://starly.fun/anti-bot') {generate();}
if (window.location.href.includes('faucet')) {
const intervalId = setInterval(() => {
    const submitButton = document.querySelector('button[type="submit"]');
    if (window.location.href.includes("/faucet") && grecaptcha?.getResponse()?.length && submitButton) {
        clearInterval(intervalId);
        submitButton.click();
        setButtonClicked();
    }
}, 3000);
}
    if (window.location.href.includes('login')) {
        document.querySelector(".form-control[name='email']").value = email;
        document.querySelector(".form-control[name='password']").value = senha;

        const checkbox = document.getElementById('exampleCheck1');
        if (!checkbox.checked) {
            checkbox.checked = true;
        }
        const submitButton = document.querySelector('button[type="submit"]');
        setTimeout(function() {
        if (submitButton && !submitButton.disabled) {
        submitButton.click()
        }
      }, 3000);
    }
})();
