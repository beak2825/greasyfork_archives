// ==UserScript==
// @name         Mute Medium
// @namespace    https://twitter.com/libinfs1
// @version      1.0
// @description  Mute the noisy metered paywall message in Medium
// @author       libinfs
// @match        https://medium.com/*
// @downloadURL https://update.greasyfork.org/scripts/386568/Mute%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/386568/Mute%20Medium.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let noisy = null
    let counter = 20
    const nail = muteMedium() || setInterval(() => {
        counter--
        if (!counter) {
            clearInterval(nail)
        }
        muteMedium()
    }, 500)

    function muteMedium() {
        noisy = document.querySelector(".u-relative.u-padding20.u-borderLighter.u-borderRadius4")
        if (noisy) {
            noisy.outerHTML = ''
            console.log('The world is quite, enjoy it.')
            return true
        }
    }
})();