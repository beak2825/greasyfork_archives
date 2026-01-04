// ==UserScript==
// @name         Wanikani Forums: The Countdown Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Updates countdown timers from pending.me.uk every second so it seems like they're counting down real-time.
// @author       Kumirei
// @include      https://community.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37274/Wanikani%20Forums%3A%20The%20Countdown%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/37274/Wanikani%20Forums%3A%20The%20Countdown%20Script.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    setInterval(function () {
        $('img[src*="pending"]').each(function () {
            var link = $(this).attr('src')
            if (link.includes('?=')) {
                link = link.split('?=')[0]
            }
            $(this).attr('src', link + '?=' + Date.now())
        })
    }, 1000)
})()
