// ==UserScript==
// @name         学生学习
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       wanglin
// @match        https://mooc1-2.chaoxing.com/mycourse/studentstudy?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397199/%E5%AD%A6%E7%94%9F%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/397199/%E5%AD%A6%E7%94%9F%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.top.clickBtn = document.createElement('div')
window.top.clickBtn.style.position = 'fixed'
window.top.clickBtn.style.top = '100px'
window.top.clickBtn.style.left = '100px'
window.top.clickBtn.style.padding = '10px'
window.top.clickBtn.style.cursor = 'pointer'
window.top.clickBtn.style.background = '#000'
window.top.clickBtn.style.color = '#fff'
window.top.clickBtn.innerText = '开始'
window.top.document.body.appendChild(window.top.clickBtn)

window.top.speedBtn = document.createElement('div')
window.top.speedBtn.style.position = 'fixed'
window.top.speedBtn.style.top = '100px'
window.top.speedBtn.style.left = '150px'
window.top.speedBtn.style.padding = '10px'
window.top.speedBtn.style.cursor = 'pointer'
window.top.speedBtn.style.background = '#000'
window.top.speedBtn.style.color = '#fff'
window.top.speedBtn.innerText = '加倍 1'
window.top.document.body.appendChild(window.top.speedBtn)

window.top.downBtn = document.createElement('div')
window.top.downBtn.style.position = 'fixed'
window.top.downBtn.style.top = '100px'
window.top.downBtn.style.left = '220px'
window.top.downBtn.style.padding = '10px'
window.top.downBtn.style.cursor = 'pointer'
window.top.downBtn.style.background = '#000'
window.top.downBtn.style.color = '#fff'
window.top.downBtn.innerText = '减速'
window.top.document.body.appendChild(window.top.downBtn)

window.top.maxSpeed = 12

window.top.clickBtn.onclick = () => {
  if (window.top.hadPlay) {
    window.top.videoArr[window.top.playingCount].play()
    console.log('点击开始按钮的继续播放')
    return
  } else {
    console.log('第一次播放')
  }
  window.top.bbb = window.top.frames.iframe
  window.top.framesArr = window.top.bbb.contentWindow.document.querySelectorAll('.ans-insertvideo-online')
  window.top.videoArr = []
  for (let i = 0; i < window.top.framesArr.length; i++) {
    window.top.videoArr.push(window.top.framesArr[i].contentWindow.document.querySelector('video'))
  }
  for (let i = 0; i < window.top.videoArr.length; i++) {
    window.top.videoArr[i].addEventListener('ended', () => {
      console.log('视频播放完毕, ', window.top.playingCount)
      window.top.dati = false
      if (++window.top.playingCount == window.top.videoArr.length) {
        window.top.paramInit()
        return
      }
      window.top.setTimeout(() => {
        window.top.videoArr[window.top.playingCount].play()
        window.top.videoArr[window.top.playingCount].playbackRate = window.top.videoSpeed
        console.log('开始播放下一个, ', window.top.playingCount)
      }, 1000)
    })
    window.top.videoArr[i].addEventListener('pause', () => {
      console.log('视频暂停', window.top.playingCount)
      if (window.top.dati) return
      window.top.videoquiz = window.top.framesArr[window.top.playingCount].contentWindow.document.getElementsByClassName('ans-videoquiz')[0]
      if (window.top.videoquiz) {

      } else {
        return
      }
      window.top.inputArr = window.top.videoquiz.getElementsByTagName('input')
      for (let j = 0; j < window.top.inputArr.length; j++) {
        if (window.top.inputArr[j].value) {
          window.top.inputArr[j].click()
          console.log('选择了: ' + j)
        }
      }
      window.top.setTimeout(() => {
        window.top.videoquiz.getElementsByClassName('ans-videoquiz-submit')[0].click()
        window.top.dati = true
        console.log('提交')
      }, 2000)
    })
  }
  window.top.setTimeout(() => {
    window.top.videoArr[window.top.playingCount].play()
    window.top.videoArr[window.top.playingCount].playbackRate = window.top.videoSpeed
    window.top.hadPlay = true
  }, 1000)
}

window.top.speedBtn.onclick = () => {
  if (window.top.videoArr[window.top.playingCount].playbackRate >= window.top.maxSpeed) return
  window.top.videoArr[window.top.playingCount].playbackRate = ++window.top.videoSpeed
  window.top.speedBtn.innerText = '加倍 ' + window.top.videoSpeed
}
window.top.downBtn.onclick = () => {
  if (window.top.videoArr[window.top.playingCount].playbackRate == 1) return
  window.top.videoArr[window.top.playingCount].playbackRate = --window.top.videoSpeed
  window.top.speedBtn.innerText = '加倍 ' + window.top.videoSpeed
}

window.top.paramInit = function() {
  window.top.videoSpeed = 4
  window.top.speedBtn.innerText = '加倍 4'
  window.top.playingCount = 0
  window.top.dati = false
  window.top.hadPlay = false
}

window.top.paramInit()

window.top.addEventListener('mouseleave', () => {
  if (window.top.videoArr.length != window.top.playingCount) {
    setTimeout(() => {
      // if (window.top.videoArr[window.top.playingCount]) {
        window.top.videoArr[window.top.playingCount].play()
      // }
    })
  }
}, 800)
    // Your code here...
})();