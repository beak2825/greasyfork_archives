// ==UserScript==
// @name         Github 一键三连
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Github 长按star, 一键watch, star, fork
// @author       CroMarmot
// @match        https://*.github.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489113/Github%20%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/489113/Github%20%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  // based on https://greasyfork.org/zh-CN/scripts/391316-github-%E7%B4%A0%E8%B4%A8%E4%B8%89%E8%BF%9E
  // 修复了新的 元素选择表达式

  const starButton = document.querySelectorAll(
    'button.btn.btn-sm.js-toggler-target'
  )[0]
  const watchButton = document.querySelector('button[value="subscribed"]')
  const forkButton = document.querySelector('.octicon-repo-forked')
    .parentElement
  console.log('starButton:',starButton);
  console.log('watchButton:',watchButton);
  console.log('forkButton:',forkButton);

  const getTimeNow = () => new Date().getTime()

  let timeStart, timeEnd, time
  let playing = false

  function addAnimationStyle() {
    let style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `
    @keyframes shake {
        2% {
            transform: translate(.5px,-.5px) rotate(.5deg)
        }
    
        4% {
            transform: translate(-.5px,2.5px) rotate(.5deg)
        }
    
        6% {
            transform: translate(-1.5px,2.5px) rotate(-.5deg)
        }
    
        8% {
            transform: translate(-1.5px,.5px) rotate(1.5deg)
        }
    
        10% {
            transform: translate(1.5px,2.5px) rotate(.5deg)
        }
    
        12% {
            transform: translate(-1.5px,2.5px) rotate(1.5deg)
        }
    
        14% {
            transform: translate(1.5px,1.5px) rotate(-.5deg)
        }
    
        16% {
            transform: translate(2.5px,-.5px) rotate(1.5deg)
        }
    
        18% {
            transform: translate(1.5px,.5px) rotate(.5deg)
        }
    
        20% {
            transform: translate(1.5px,-1.5px) rotate(-.5deg)
        }
    
        22% {
            transform: translate(-1.5px,-1.5px) rotate(-.5deg)
        }
    
        24% {
            transform: translate(-.5px,-1.5px) rotate(.5deg)
        }
    
        26% {
            transform: translate(-1.5px,2.5px) rotate(-.5deg)
        }
    
        28% {
            transform: translate(2.5px,1.5px) rotate(1.5deg)
        }
    
        30% {
            transform: translate(.5px,-.5px) rotate(1.5deg)
        }
    
        32% {
            transform: translate(1.5px,2.5px) rotate(1.5deg)
        }
    
        34% {
            transform: translate(-1.5px,-1.5px) rotate(-.5deg)
        }
    
        36% {
            transform: translate(-.5px,.5px) rotate(-.5deg)
        }
    
        38% {
            transform: translate(1.5px,-1.5px) rotate(1.5deg)
        }
    
        40% {
            transform: translate(-.5px,.5px) rotate(1.5deg)
        }
    
        42% {
            transform: translate(2.5px,-.5px) rotate(1.5deg)
        }
    
        44% {
            transform: translate(-1.5px,2.5px) rotate(.5deg)
        }
    
        46% {
            transform: translate(-.5px,2.5px) rotate(-.5deg)
        }
    
        48% {
            transform: translate(1.5px,-.5px) rotate(1.5deg)
        }
    
        50% {
            transform: translate(1.5px,-.5px) rotate(1.5deg)
        }
    
        52% {
            transform: translate(.5px,.5px) rotate(-.5deg)
        }
    
        54% {
            transform: translate(-.5px,-1.5px) rotate(-.5deg)
        }
    
        56% {
            transform: translate(1.5px,-1.5px) rotate(1.5deg)
        }
    
        58% {
            transform: translate(.5px,1.5px) rotate(1.5deg)
        }
    
        60% {
            transform: translate(-.5px,-.5px) rotate(1.5deg)
        }
    
        62% {
            transform: translate(-.5px,.5px) rotate(1.5deg)
        }
    
        64% {
            transform: translate(.5px,-.5px) rotate(1.5deg)
        }
    
        66% {
            transform: translate(2.5px,.5px) rotate(1.5deg)
        }
    
        68% {
            transform: translate(1.5px,-.5px) rotate(1.5deg)
        }
    
        70% {
            transform: translate(.5px,2.5px) rotate(1.5deg)
        }
    
        72% {
            transform: translate(1.5px,-.5px) rotate(.5deg)
        }
    
        74% {
            transform: translate(2.5px,-.5px) rotate(.5deg)
        }
    
        76% {
            transform: translate(2.5px,-.5px) rotate(1.5deg)
        }
    
        78% {
            transform: translate(-1.5px,-.5px) rotate(-.5deg)
        }
    
        80% {
            transform: translate(-1.5px,.5px) rotate(-.5deg)
        }
    
        82% {
            transform: translate(-1.5px,2.5px) rotate(.5deg)
        }
    
        84% {
            transform: translate(-.5px,.5px) rotate(1.5deg)
        }
    
        86% {
            transform: translate(-1.5px,1.5px) rotate(.5deg)
        }
    
        88% {
            transform: translate(-.5px,-.5px) rotate(1.5deg)
        }
    
        90% {
            transform: translate(-1.5px,-1.5px) rotate(1.5deg)
        }
    
        92% {
            transform: translate(2.5px,1.5px) rotate(.5deg)
        }
    
        94% {
            transform: translate(2.5px,1.5px) rotate(-.5deg)
        }
    
        96% {
            transform: translate(2.5px,-.5px) rotate(.5deg)
        }
    
        98% {
            transform: translate(1.5px,.5px) rotate(-.5deg)
        }
    
        0%,to {
            transform: translate(0) rotate(0)
        }
    }
    `

    document.getElementsByTagName('head')[0].appendChild(style)
  }

  function playAnimation() {
    playing = true
    starButton.style.animation = 'shake 1s ease-in-out infinite'
  }

  function stopAnimation() {
    playing = false
    starButton.style.animation = ''
  }

  function combo() {
    starButton.click()
    watchButton.click()
    forkButton.click()
  }

  function holdDown() {
    timeStart = getTimeNow()
    time = setInterval(function() {
      timeEnd = getTimeNow()

      if (timeEnd - timeStart > 200) {
        !playing && playAnimation()
      }

      if (timeEnd - timeStart > 1500) {
        clearInterval(time)
        combo()
      }
    }, 100)
  }

  function holdUp() {
    clearInterval(time)
    playing && stopAnimation()
  }

  addAnimationStyle()
  starButton.addEventListener('mousedown', holdDown)
  starButton.addEventListener('mouseup', holdUp)
})()