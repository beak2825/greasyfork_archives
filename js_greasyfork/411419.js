// ==UserScript==
// @name         知乎一键素质三连
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎 长按 点赞, 一键点赞喜欢收藏
// @author       liubiantao
// @match        https://*.zhihu.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411419/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E7%B4%A0%E8%B4%A8%E4%B8%89%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/411419/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E7%B4%A0%E8%B4%A8%E4%B8%89%E8%BF%9E.meta.js
// ==/UserScript==

;(function () {
  'use strict'

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
  addAnimationStyle()

  function getComboButtons(voteButton) {
    const parentEl = voteButton.parentElement.parentElement
    const starButton = parentEl.childNodes[3]
    const likeButton = parentEl.childNodes[4]

    return [voteButton, starButton, likeButton]
  }

  function getSvg(node) {
    return node.childNodes[0].childNodes[1]
  }

  function playAnimation(svg) {
    playing = true
    svg.style.animation = 'shake 1s ease-in-out infinite'
  }

  function stopAnimation(svg) {
    playing = false
    svg.style.animation = ''
  }

  function combo(comboButtons) {
    comboButtons.forEach((el) => {
      el.click()
    })
  }

  function holdDown(voteButton) {
    const comboButtons = getComboButtons(voteButton)

    timeStart = getTimeNow()
    time = setInterval(function () {
      timeEnd = getTimeNow()

      if (timeEnd - timeStart > 200 && !playing) {
        comboButtons.forEach((el) => {
          const svg = getSvg(el)
          playAnimation(svg)
        })
      }

      if (timeEnd - timeStart > 1500) {
        clearInterval(time)
        combo(comboButtons)
        comboButtons.forEach((el) => {
          const svg = getSvg(el)
          stopAnimation(svg)
        })
      }
    }, 100)
  }

  function holdUp(voteButton) {
    const comboButtons = getComboButtons(voteButton)
    clearInterval(time)
    if (playing) {
      comboButtons.forEach((el) => {
        const svg = getSvg(el)
        stopAnimation(svg)
      })
    }
  }

  const voteButtons = document.querySelectorAll('.VoteButton--up')

  voteButtons.forEach((voteButton) => {
    voteButton.addEventListener('mousedown', () => holdDown(voteButton))
    voteButton.addEventListener('mouseup', () => holdUp(voteButton))
  })
})()
