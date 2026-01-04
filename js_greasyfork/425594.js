// ==UserScript==
// @name         YouTube Ad Killer
// @namespace    https://greasyfork.org/en/users/704811-wjatek
// @version      0.2
// @description  Kills YouTube ads, both video and popup
// @author       wjatek
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425594/YouTube%20Ad%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/425594/YouTube%20Ad%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict'

    async function clickIfPresent(selector) {
        const btn = document.querySelector(selector)
        if (btn) {
            btn.click()
        } else {
            throw 'Element not found: ' + selector
        }
    }

    async function killAd() {
        try {
            await clickIfPresent('.ytp-ad-button-link')
            await clickIfPresent('.ytp-ad-info-dialog-mute-button')
            await clickIfPresent('.ytp-ad-feedback-dialog-reason-input')
            await clickIfPresent('.ytp-ad-feedback-dialog-confirm-button')
            console.log('Video ad closed!')
        } catch (ignore) {}
        try {
            await clickIfPresent('.ytp-ad-overlay-close-button')
            console.log('Popup ad closed!')
        } catch (ignore) {}
        try {
            await clickIfPresent('.ytp-ad-skip-button')
            console.log('Popup ad closed!')
        } catch (ignore) {}
    }

    setInterval(killAd, 100)

    console.log('Ad Killer has started')
})()