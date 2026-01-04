// ==UserScript==
// @name         Chain Warn v2
// @namespace    namespace
// @version      0.8.1
// @description  description
// @author       tos + lonerider543
// @match        *.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471473/Chain%20Warn%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/471473/Chain%20Warn%20v2.meta.js
// ==/UserScript==

const alert_time = 100 //seconds
const min_chain = 100
const alert_sound = true

GM_addStyle(`
.cw_overlay {
  position: fixed;
  pointer-events: none;
  height: 100%;
  width: 100%;
  z-index: 20000;
  will-change: background-color;
}

.cw_idle::after {
  background-color: #FF03;
  bottom: 0;
  content: "";
  left: -10px;
  position: absolute;
  right: -10px;
  top: 0;
}

.cw_warn {
  animation-name: cw_warn;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
}

@keyframes cw_warn {
  0% {
    background-color: #FF000000;
  }
  50% {
    background-color: #FF000055;
  }
  100 {
    background-color: #FF000000;
  }
}
`)

let warn_overlay = null
function chain_value () {
  return parseInt(document.querySelector('[class^=chain-bar] [class^=bar-value]')?.innerText.replace(',', '').split('/')[0])
}

// playTone(gain, frequency, duration)
let a = new AudioContext()
function playTone(w,x,y){
  //console.log("Gain:"+w, "Hz:"+x, "ms:"+y)
  osc = a.createOscillator()
  gain_node = a.createGain()
  osc.connect(gain_node)
  osc.frequency.value = x
  osc.type = "square"
  gain_node.connect(a.destination)
  gain_node.gain.value = w * 0.01
  osc.start(a.currentTime)
  osc.stop(a.currentTime + y *0.001)
}
function alert() {
  playTone(10,233,100)
  playTone(3,603,200)
}
let alarm = null

const chainbar_observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    try {
      if (mutation.target.parentElement.className.includes('bar-timeleft')) {
        //const a = performance.now()
        const t = mutation.target.data.split(':')
        const s = parseInt(t[0]) * 60 + parseInt(t[1])
        if (0 < s && s < alert_time && t.length < 3 && min_chain <= chain_value()) {
          warn_overlay.classList.add('cw_warn')
          if (!alarm && alert_sound) alarm = setInterval(alert, 1500)
        }
        else {
          warn_overlay.classList.remove('cw_warn')
          clearInterval(alarm)
          alarm = null
        }
        //const b = performance.now()
        //console.log(b-a)
      }
    } catch(err) { console.error(err)}
  }
})


function waitForSelector(selector) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}


waitForSelector('DIV[class^=sidebar]').then((sidebar) => {
  chainbar = {}
  chainbar.A = document.querySelector('[class^=chain-bar]')
  chainbar.barstats = document.querySelector('[class^=chain-bar] [class^=bar-stats]')
  if (chainbar.A && chainbar.barstats) {
    document.querySelector('body').insertAdjacentHTML('afterbegin', `<div class="cw_overlay"></div>`)
    warn_overlay = document.querySelector('.cw_overlay')
    chainbar.A.classList.add('cw_idle')
    chainbar_observer.observe(chainbar.barstats, { subtree: true, characterData: true })
  }
}).catch(console.error)