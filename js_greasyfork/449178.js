// ==UserScript==
// @name         b站多倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  b站所有视频倍速播放增加了额外倍速的选择，增加的方式是在原有的倍速播放样式基础上增加，保证使用方便及样式统一
// @author       qixuan.yu
// @match        *://www.bilibili.com/*
// @match        *://m.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449178/b%E7%AB%99%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/449178/b%E7%AB%99%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener('load', () => {
    const interval = setInterval(() => {
      const video = document.querySelector('video')
      const ul = [...document.querySelectorAll('ul')].find(node => node.firstElementChild.innerHTML === '2.0x')
      const displayBackRate = ul.parentElement.firstElementChild
      let firstChild = ul.firstElementChild
      const rates = ['3.0',' 4.0']
      rates.forEach(rate => {
        const cloneNode = firstChild.cloneNode()
        if (firstChild.dataset.value) {
          cloneNode.dataset.value = rate
        }
        cloneNode.innerHTML = `${rate}x`
        console.log(`${rate}x`);
        ul.insertBefore(cloneNode, firstChild)
        firstChild = cloneNode
      })
      const backRateNodes = [...ul.children]
      let activeClass = ''
      backRateNodes.forEach(node => {
        if (node.classList.length === 2) {
          activeClass = node.classList[node.classList.length - 1]
        }
      })
      
      const changeSelectColor = (select) => {
        setTimeout(() => {
          select.classList.add(activeClass)
          backRateNodes.forEach(item => {
            if (item === select) {
            } else {
              if (item.classList.contains(activeClass)) {
                item.classList.remove(activeClass)
              }
            }
          }, 1000)
        })
      }

      ul.addEventListener('click', (e) => {
        const target = e.target
        const PlaybackRate = target.innerHTML.slice(0, target.innerHTML.length - 1)
        video.playbackRate = PlaybackRate
        setTimeout(() => {
          displayBackRate.innerHTML = PlaybackRate === '1.0' ? '倍速' : `${PlaybackRate}x`
          console.log(PlaybackRate, `${PlaybackRate}x`);
        })
        changeSelectColor(target)
      })

      if (video) {
        clearInterval(interval)
      }
    }, 1000)
  })

})();