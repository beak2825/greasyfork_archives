// ==UserScript==
// @name         Keep Playing
// @namespace    KeepPlaying
// @version      0.1.0
// @description  Prevents Quest videos from pausing when the webpage loses focus.
// @author       Coxxs
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547216/Keep%20Playing.user.js
// @updateURL https://update.greasyfork.org/scripts/547216/Keep%20Playing.meta.js
// ==/UserScript==

(function() {
    'use strict'

    async function lockWakeState() {
        try {
            await navigator.wakeLock.request()
        } catch(e) {
            // ignore
        }
    }

    function stopEvent(evt) {
        lockWakeState()
        evt.stopImmediatePropagation()
        evt.stopPropagation()
    }

    for (const n of ['visibilitychange', 'webkitvisibilitychange', 'blur']) {
        window.addEventListener(n, stopEvent, true);
    }
})()
