// ==UserScript==
// @name        Brightness Slider 
// @version     1.1
// @description Adds a small on-screen slider to adjust page brightness, works for mobile and desktop.
// @license     CC0-1.0
// @author       Mane
// @match       *://*/*
// @grant       GM.getValue
// @grant       GM.setValue
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/541551/Brightness%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/541551/Brightness%20Slider.meta.js
// ==/UserScript==

;(async function() {
  const STORAGE_KEY = 'brightness-value'
  const MIN   = 0.5
  const MAX   = 1.5
  const STEP  = 0.01
  const WIDTH = '120px'

  //
  // Polyfill for GM.getValue / GM.setValue across managers
  //
  if (typeof GM === 'undefined') {
    // some managers expose GM_* instead of GM.*
    if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
      this.GM = {
        getValue:    (k, def) => Promise.resolve(GM_getValue(k, def)),
        setValue:    (k, v)  => Promise.resolve(GM_setValue(k, v))
      }
    } else {
      // fallback to localStorage
      this.GM = {
        getValue: (k, def) => Promise.resolve(
          localStorage.getItem(k) !== null
            ? JSON.parse(localStorage.getItem(k))
            : def
        ),
        setValue: (k, v) => Promise.resolve(
          localStorage.setItem(k, JSON.stringify(v))
        )
      }
    }
  } else {
    // wrap GM.* if one of them is missing
    if (typeof GM.getValue !== 'function' && typeof GM_getValue === 'function') {
      GM.getValue = (k, def) => Promise.resolve(GM_getValue(k, def))
    }
    if (typeof GM.setValue !== 'function' && typeof GM_setValue === 'function') {
      GM.setValue = (k, v) => Promise.resolve(GM_setValue(k, v))
    }
    // fallback to localStorage if neither exists
    if (typeof GM.getValue !== 'function') {
      GM.getValue = (k, def) => Promise.resolve(
        localStorage.getItem(k) !== null
          ? JSON.parse(localStorage.getItem(k))
          : def
      )
    }
    if (typeof GM.setValue !== 'function') {
      GM.setValue = (k, v) => Promise.resolve(
        localStorage.setItem(k, JSON.stringify(v))
      )
    }
  }

  // Create slider
  const slider = document.createElement('input')
  slider.id    = 'brightness-slider'
  slider.type  = 'range'
  slider.min   = MIN
  slider.max   = MAX
  slider.step  = STEP
  slider.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: ${WIDTH};
    z-index: 9999;
    opacity: 0.6;
    transition: opacity .3s;
  `
  slider.addEventListener('mouseover', () => slider.style.opacity = 1)
  slider.addEventListener('mouseout',  () => slider.style.opacity = 0.6)

  const style = document.createElement('style')
  style.textContent = `
    #brightness-slider {
      height: 8px;
      cursor: pointer;
    }
    #brightness-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #888;
      border-radius: 50%;
      margin-top: -4px;
    }
    #brightness-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: #888;
      border-radius: 50%;
      border: none;
    }
  `
  document.head.appendChild(style)

  // Load saved brightness (default = 1)
  const saved = await GM.getValue(STORAGE_KEY, 1)
  slider.value = saved

  // Apply brightness filter
  function applyBrightness(v) {
    document.documentElement.style.filter = `brightness(${v})`
  }
  applyBrightness(slider.value)

  // On change: update filter and cache
  slider.addEventListener('input', async e => {
    const v = e.target.value
    applyBrightness(v)
    await GM.setValue(STORAGE_KEY, v)
  })

  document.body.appendChild(slider)
})()
