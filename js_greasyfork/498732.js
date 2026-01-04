

    // ==UserScript==
    // @name         Bilibili获取合集总时长
    // @description  在标题栏下显示合集总时长以及观看进度。如下图
    // @namespace    http://tampermonkey.net/
    // @version      2024-06-24
    // @author       flypig
    // @match        https://www.bilibili.com/video/*
    // @run-at       document-end
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498732/Bilibili%E8%8E%B7%E5%8F%96%E5%90%88%E9%9B%86%E6%80%BB%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/498732/Bilibili%E8%8E%B7%E5%8F%96%E5%90%88%E9%9B%86%E6%80%BB%E6%97%B6%E9%95%BF.meta.js
    // ==/UserScript==
     
    ;(function () {
      'use strict'
     
      function timeToTimestamp(timeStr) {
        const parts = timeStr.split(':').map(Number)
        let hours = 0
        let minutes = 0
        let seconds = 0
     
        if (parts.length === 3) {
          hours = parts[0]
          minutes = parts[1]
          seconds = parts[2]
        } else if (parts.length === 2) {
          minutes = parts[0]
          seconds = parts[1]
        } else {
          throw new Error('时间格式错误，应为hh:mm:ss或mm:ss')
        }
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        return totalSeconds
      }
     
      function timestampToTime(timestampInSeconds) {
        const hours = Math.floor(timestampInSeconds / 3600)
        const minutes = Math.floor((timestampInSeconds % 3600) / 60)
        const seconds = timestampInSeconds % 60
     
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
          2,
          '0'
        )}:${String(seconds).padStart(2, '0')}`
      }
     
      function handleText() {
        document.querySelector('.video-total-time')?.remove()
     
        let alreadyTime = 0
        for (let indx = 0; indx < timeArr.length; indx++) {
          if (indx === curPage - 1) break
          alreadyTime = alreadyTime + timeToTimestamp(timeArr[indx].innerHTML)
        }
        timeEle.innerText = `总时长：${timestampToTime(totalTime)}。已看：${(
          (alreadyTime / totalTime) *
          100
        ).toFixed(2)}%`
     
        info.appendChild(timeEle)
      }
     
      const isCollect = document.querySelector('button.second-line_right')
      if (!isCollect) return
     
      const timeArr = document.querySelectorAll(
        '.video-episode-card__info-duration'
      )
      let totalTime = 0
      timeArr.forEach(i => (totalTime = totalTime + timeToTimestamp(i.innerHTML)))
     
      const info = document.querySelector('.video-info-meta')
      const timeEle = document.createElement('span')
      timeEle.className = 'video-total-time'
     
      const videoElement = document.querySelector('video')
      videoElement.addEventListener('canplaythrough', handleText)
     
      let curPage = +document.querySelector('.cur-page').innerText.match(/\d+/)[0]
      const curPageElement = document.querySelector('.cur-page')
      const observerCallback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation.type === 'characterData') {
            curPage = +document.querySelector('.cur-page').innerText.match(/\d+/)[0]
            handleText()
          }
        }
      }
      const observer = new MutationObserver(observerCallback)
      const config = { childList: false, subtree: true, characterData: true }
      observer.observe(curPageElement, config)
    })()

