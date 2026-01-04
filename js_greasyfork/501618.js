// ==UserScript==
// @name         HK_PlayInBrowser
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  Click-clack-clock!
// @author       Wratixor
// @match        https://hamsterkombatgame.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hamsterkombatgame.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501618/HK_PlayInBrowser.user.js
// @updateURL https://update.greasyfork.org/scripts/501618/HK_PlayInBrowser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (location.hostname === 'hamsterkombatgame.io') {
        const ORIG_indexOf = Array.prototype.indexOf
        Array.prototype.indexOf = function(...args) {
            console.log(JSON.stringify(this))
            if (JSON.stringify(this) === JSON.stringify(['android', 'android_x', 'ios'])) {
                setTimeout(() => {
                           Array.prototype.indexOf = ORIG_indexOf
                })
                return 0
            } else {
                return ORIG_indexOf.apply(this, args)
            }
        }
        let div = document.createElement('div')
        div.className = "alert"
        div.innerHTML = "Первый клик - настройка, второй клик - запуск, третий клик - пауза."
        div.style.minHeight = '50px'
        div.style.backgroundColor = '#FF0000'
        div.style.textAlign = 'center'
        div.style.padding = '10px'
        let button = null // document.querySelector(".user-tap-button")
        let reachedZeroEnergy = false
        let ac_stage = 'NOINIT'
        function tick() {
            if (ac_stage === 'RUNNED') {
                try {
                    const energy = document.querySelector(".user-tap-energy > p")
                    if(energy) {
                        const energyStr = energy.innerText
                        const currEnergy = Number (energyStr.split('/')[0])
                        const maxEnergy = Number(energyStr.split('/')[1])
                        if(!reachedZeroEnergy) {
                            button.dispatchEvent(new PointerEvent('pointerup'))
                            button.dispatchEvent(new PointerEvent('pointerup'))
                            button.dispatchEvent(new PointerEvent('pointerup'))
                            button.dispatchEvent(new PointerEvent('pointerup'))
                            button.dispatchEvent(new PointerEvent('pointerup'))
                        }
                        if (currEnergy <= 100) {
                            reachedZeroEnergy = true
                        }
                        if(currEnergy >= maxEnergy - 10) {
                            reachedZeroEnergy = false
                        }
                    }
                } catch(e) {
                    console.log(e)
                }
                setTimeout(tick, 100* Math.random() + 50)
            }
        }
        div.onclick = function(event) {
            if (ac_stage === 'NOINIT') {
                button = document.querySelector(".user-tap-button")
                ac_stage = 'INIT'
                div.innerHTML = "Текущий статус: " + ac_stage
                return ac_stage
            }
            if ((ac_stage === 'INIT') || (ac_stage === 'STOPPED')) {
                ac_stage = 'RUNNED'
                setTimeout(tick)
                div.innerHTML = "Текущий статус: " + ac_stage
                return ac_stage
            }
            if (ac_stage === 'RUNNED') {
                ac_stage = 'STOPPED'
                div.innerHTML = "Текущий статус: " + ac_stage
                return ac_stage
            }
            console.log(ac_stage)
            return ac_stage
        }
        // --

      document.body.prepend(div)

    }
  })();