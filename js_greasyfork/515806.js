// ==UserScript==
// @name         vidhub ad blocked
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  vidhub 广告屏蔽
// @author       You
// @match        https://vidhub1.cc/*
// @icon         https://vidhub1.cc/mxstatic/image/logo2.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515806/vidhub%20ad%20blocked.user.js
// @updateURL https://update.greasyfork.org/scripts/515806/vidhub%20ad%20blocked.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let running = false

    const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))

    async function raf(callback) {
        if (!running) {
            console.log('raf stoped')
            return
        }
        callback?.()
        console.log('raf running')
        await sleep(1000)
        requestAnimationFrame(() => raf(callback))
    }
    function run(callback) {
        running = true
        raf(callback)
    }
    function stop() {
        running = false
    }

    run(() => {
        const ad = [
            ...[...document.querySelectorAll('script[src]')].filter(i => i.src.includes('stgowan.com')),
            ...[...document.querySelectorAll('.adpcc')]
        ]
        if (ad.length) {
            console.log('ad script', ad.map(i => i.src))
            ad.forEach(i => i.remove())
        }
    })
})();