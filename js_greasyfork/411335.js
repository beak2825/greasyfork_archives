// ==UserScript==
// @name        console.log With DOM Echo
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.2
// @author      -
// @description 14.09.2020, 17:35:08
// @downloadURL https://update.greasyfork.org/scripts/411335/consolelog%20With%20DOM%20Echo.user.js
// @updateURL https://update.greasyfork.org/scripts/411335/consolelog%20With%20DOM%20Echo.meta.js
// ==/UserScript==

let timer
const delay = 300

const consoleLog = console.log
const consoleErr = console.error

const toaster = []
const styles = document.createElement("style")
styles.innerHTML = `
  .console-toast {
    position: fixed;
    right: 15px;
    bottom: -55px;
    padding: 10px 30px;
    border-radius: 3px;
    transition: .3s;
    color: #fff;
    font-family: Lato, Roboto, sans-serif;
    animation: flowUp 10s;
    z-index: 3213213213;
    max-width: 70%;
  }

  .console-log-toast {
    background: #3a3a3a;
    box-shadow: 0 0 7px 0 #7b7b7b;
  }

  .console-err-toast {
    background: #d87070;
    box-shadow: 0 0 7px 0 #f38d8d;
  }

  @keyframes flowUp {
    0% {
      bottom: -55px;
    }

    5% {
      bottom: 15px;
    }

    75% {
      bottom: 15px;
      opacity: 1;
    }

    100% {
      bottom: 130%;
      opacity: 0;
    }
  }
`
document.head.append(styles)

function showToast() {
  if (toaster.length) {
    const toast = toaster.shift()
    
    setTimeout(() => toast.classList.remove('static-toast'), 7500)
    timer = setTimeout(showToast, delay)
    
    document.querySelectorAll('.static-toast').forEach(toast => {
      const shift = parseInt(toast.style.transform.slice(11)) || 0
      toast.style.transform = `translateY(${shift - toast.getBoundingClientRect().height - 10}px)`
    })
    
    document.body.append(toast)
  } else {
    timer = null
  }
}

function consoleToast(type) {
  return (...args) => {
    (type == 'err' ? consoleErr : consoleLog)(...args)

    const toast = document.createElement("div")
    toast.onanimationend = () => toast.remove()
    toast.className = `console-${type}-toast console-toast static-toast`
    toast.innerText = (typeof args[0] == 'function' ? args[0] : JSON.stringify(args.length == 1 ? args[0] : args)).slice(0, 500)
    toaster.push(toast)
    
    if (!timer) showToast()
  }
}

console.log = consoleToast('log')
console.error = consoleToast('err')