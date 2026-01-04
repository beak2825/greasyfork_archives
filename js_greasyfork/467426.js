// ==UserScript==
// @name         Google Im Not A Robot Captcha Clicker
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Automatically Clicks the Google I'm Not A Robot Button for you.
// @author       longkidkoolstar
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      CC BY
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467426/Google%20Im%20Not%20A%20Robot%20Captcha%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/467426/Google%20Im%20Not%20A%20Robot%20Captcha%20Clicker.meta.js
// ==/UserScript==


setTimeout(function() {
    const checkbox = document.querySelector('.recaptcha-checkbox')
    if (checkbox) checkbox.click()
}, 1750);