// ==UserScript==
// @name         Bloxd Zoom
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Zoom in Bloxd with C!
// @icon         https://bloxd.io/apple-touch-icon.png?v=2
// @author       Gnosis
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      GPL3
// @match        https://bloxd.io/*
// @require      https://update.greasyfork.org/scripts/485962/1319216/hookPropertyName.js
// @downloadURL https://update.greasyfork.org/scripts/485966/Bloxd%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/485966/Bloxd%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!GM_getValue('customMultiplier')) GM_setValue('customMultiplier', false)
    const customMultiplier = GM_getValue('customMultiplier')
    let zoomFov = 1.2
    let isZooming = false

    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyC') {
            isZooming = true
            e.stopImmediatePropagation()
        }
    })

    document.addEventListener('keyup', (e) => {
        if (e.code === 'KeyC') {
            isZooming = false
            e.stopImmediatePropagation()
        }
    })

    document.addEventListener('wheel', (e) => {
        if (isZooming) {
            if (e.deltaY > 0) {
                zoomFov += 0.1
            } else if (e.deltaY < 0) {
                zoomFov -= 0.1
            }
            if (zoomFov < 0.1) zoomFov = 0.1
            else if (zoomFov > 2.5) zoomFov = 2.5
            e.stopPropagation()
        }
    }, true)

    hookPropertyName('movementBasedFov', function (fov) {
        if (isZooming) {
            return zoomFov
        } else if (customMultiplier) {
            return fov * customMultiplier
        }
    })
})();