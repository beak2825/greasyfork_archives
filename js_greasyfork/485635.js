// ==UserScript==
// @name         Bloxd Keep Run / Crouch
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Help you keep running or crouching in Bloxd.io with the key X and V.
// @icon         https://bloxd.io/apple-touch-icon.png?v=2
// @author       Gnosis
// @grant        none
// @run-at       document-start
// @license      GPL3
// @match        https://bloxd.io/*
// @downloadURL https://update.greasyfork.org/scripts/485635/Bloxd%20Keep%20Run%20%20Crouch.user.js
// @updateURL https://update.greasyfork.org/scripts/485635/Bloxd%20Keep%20Run%20%20Crouch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const infoDisplay = document.createElement('div')

    infoDisplay.style.position = 'absolute'
    infoDisplay.style.left = '0px'
    infoDisplay.style.bottom = '10em'
    infoDisplay.style.whiteSpace = 'pre'
    infoDisplay.style.padding = '5px'
    infoDisplay.style.background = '#00000088'
    infoDisplay.style.zIndex = '999'

    window.addEventListener('load', () => document.querySelector('.WholeAppWrapper').appendChild(infoDisplay))

    let isRunning = ''
    let isCrouching = ''
    let isKeepingRunning = false
    let isKeepingCrouching = false

    function updateInfoDisplay() {
        infoDisplay.textContent = `Running: ${isRunning || 'no'}${isKeepingRunning ? '(x)' : ''}\nCrouching: ${isCrouching || 'no'}${isKeepingCrouching ? '(v)': ''}`
    }

    const shiftKeyData = {
        key: 'Shift',
        code: 'ShiftLeft',
        keyCode: 16,
        which: 16,
        shiftKey: true,
        ControlKey: false,
        altKey: false,
        metaKey: false,
        repeat: false,
        bubbles: true,
        cancelable: true
    }

    const zKeyData = {
        key: 'z',
        code: 'KeyZ',
        keyCode: 90,
        which: 90,
        shiftKey: false,
        ControlKey: false,
        altKey: false,
        metaKey: false,
        repeat: false,
        bubbles: true,
        cancelable: true
    }

    const shiftDown = new KeyboardEvent('keydown', shiftKeyData)

    const shiftUp = new KeyboardEvent('keyup', shiftKeyData)

    const zDown = new KeyboardEvent('keydown', zKeyData)

    const zUp = new KeyboardEvent('keyup', zKeyData)

    document.addEventListener('keyup', e => {
        if (e.code === 'KeyX') {
            if (isRunning === '') {
                isRunning = 'Shift'
                isKeepingRunning = true
                document.dispatchEvent(shiftDown)
            } else if (isRunning === 'Shift') {
                isRunning = ''
                isKeepingRunning = false
                document.dispatchEvent(shiftUp)
            }
        } else if (e.code === 'KeyV') {
            if (isCrouching === '') {
                isCrouching = 'z'
                isKeepingCrouching = true
                document.dispatchEvent(zDown)
            } else if (isCrouching === 'z') {
                isCrouching = ''
                isKeepingCrouching = false
                document.dispatchEvent(zUp)
            }
        } else if (e.code === 'ShiftLeft' && isRunning === 'Shift') {
            if (isKeepingRunning) {
                e.stopImmediatePropagation()
                return
            }
            isRunning = ''
        } else if (e.key === 'Control' && isCrouching === 'Control') {
            isCrouching = ''
        } else if (e.code === 'KeyZ' && isCrouching === 'z') {
            if (isKeepingCrouching) {
                e.stopImmediatePropagation()
                return
            }
            isCrouching = ''
        } else if (e.code === 'KeyC' && isCrouching === 'c') {
            isCrouching = ''
        }
        updateInfoDisplay()
    })

    document.addEventListener('keydown', e => {
        if (e.code === 'ShiftLeft' && isRunning === '') {
            isRunning = 'Shift'
        } else if (e.key === 'Control' && isCrouching === '') {
            isCrouching = 'Control'
        } else if (e.code === 'KeyZ' && isCrouching === '') {
            isCrouching = 'z'
        } else if (e.code === 'KeyC' && isCrouching === '') {
            isCrouching = 'c'
        }
        updateInfoDisplay()
    })

    setInterval(() => {
        if (isKeepingRunning && !isKeepingCrouching) {
            document.dispatchEvent(shiftDown)
        }
        if (isKeepingCrouching && !isKeepingRunning) {
            document.dispatchEvent(zDown)
        }
    }, 100)

    updateInfoDisplay()
})();