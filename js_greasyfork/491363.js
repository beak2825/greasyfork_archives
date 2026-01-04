// ==UserScript==
// @name         Google Play Become a Tester
// @version      0.4
// @namespace    https://isab.run/
// @description  Automatically refresh the Google Play “Become a Tester” page and join as a beta tester when the tester quota becomes available.
// @author       Joe Fang
// @license      MIT

// @match        https://play.google.com/apps/testing/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play.google.com
// @downloadURL https://update.greasyfork.org/scripts/491363/Google%20Play%20Become%20a%20Tester.user.js
// @updateURL https://update.greasyfork.org/scripts/491363/Google%20Play%20Become%20a%20Tester.meta.js
// ==/UserScript==

"use strict";


(() => {
    const getJoinButton = () => {
        const button = document.querySelector('input[type="submit"]')
        if (button && button.value && button.value.trim().toLowerCase() === 'become a tester') {
            return button
        }
        return undefined
    }

    const getLeaveButton = () => {
        const button = document.querySelector('input[type="submit"]')
        if (button && button.value && button.value.trim().toLowerCase() === 'leave the program') {
            return button
        }
        return undefined
    }

    if (getLeaveButton()) {
        return;
    }

    let button = getJoinButton();
    console.log('Button', button)
    if (!button) {
        setTimeout(() => location.reload(), 30000.0)
        console.log('Time:', (new Date()).toLocaleString(), '; Refreshing', location.href, 'in 30 seconds');
        return
    }

    button.click()
})()