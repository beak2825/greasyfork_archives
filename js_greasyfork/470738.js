// ==UserScript==
// @name         青书学堂自动刷课
// @namespace    https://github.com/gaoyang/tampermonkey-scripts
// @version      1.1
// @description  青书学堂自动刷课，没有多余的功能，简单好用。
// @author       gaoyang
// @match        https://*.qingshuxuetang.com/*/CourseShow*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=degree.qingshuxuetang.com
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470738/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470738/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const message = document.createElement('div')
  const urlParams = new URLSearchParams(window.location.search)
  const currentNodeId = urlParams.get('nodeId')
  let nextNode
  let findCoursesTimer
  let findVideoTimer

  message.style = 'display:inline-block;color:red;font-size:18px;'
  const playerHeader = document.querySelector('.player-header')
  playerHeader.parentNode.insertBefore(message, playerHeader)

  if (currentNodeId.includes('jbxx')) {
    message.innerText = `[自动刷课] ⚠ 只有视频课程才能自动刷课`
    return
  }

  const findCourses = () => {
    const list = document.querySelectorAll('#lessonMenu li a[id]')
    if (list && list.length > 0) clearInterval(findCoursesTimer)
    const nodeArray = []
    list.forEach(item => {
      if (item.id.includes('jbxx')) return
      nodeArray.push({
        id: item.id.split('-')[1],
        title: item.text
      })
    })
    window.sss = nodeArray
    nextNode = nodeArray[nodeArray.findIndex(o => o.id === currentNodeId) + 1]
    if (nextNode) message.innerText = `[自动刷课] 下一节课：${nextNode.title}`
    else message.innerText = `[自动刷课] ⚠ 目前最后一节课了`
  }
  findCoursesTimer = setInterval(findCourses, 1000)

  const findVideo = () => {
    const player = window.CoursewarePlayer
    if (player) clearInterval(findVideoTimer)
    player.videoPlayer.player.muted(true)
    player.seek(0)
    player.play()

    player.addListener('ended', function () {
      if (!nextNode) return
      urlParams.set('nodeId', nextNode.id)
      location.replace(window.location.pathname + '?' + urlParams.toString())
    })
  }
  findVideoTimer = setInterval(findVideo, 1000)
})()
