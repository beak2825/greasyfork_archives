// ==UserScript==
// @name         城院学堂云脚本2
// @namespace    http://www.kairlec.com/
// @version      1.1
// @description  在城院的学堂云3上可以挂着视频一直播放(暂时适配毛概,其他视频可以自行测试)
// @author       Kairlec
// @match        https://www.xuetangx.com/learn/hncu*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/411554/%E5%9F%8E%E9%99%A2%E5%AD%A6%E5%A0%82%E4%BA%91%E8%84%9A%E6%9C%AC2.user.js
// @updateURL https://update.greasyfork.org/scripts/411554/%E5%9F%8E%E9%99%A2%E5%AD%A6%E5%A0%82%E4%BA%91%E8%84%9A%E6%9C%AC2.meta.js
// ==/UserScript==

(function () {
  'use strict'
  // Your code here...
  function similar (s, t, f) {
    if (!s || !t) {
      return 0
    }
    var l = s.length > t.length ? s.length : t.length
    var n = s.length
    var m = t.length
    var d = []
    f = f || 3
    var min = function (a, b, c) {
      return a < b ? (a < c ? a : c) : (b < c ? b : c)
    }
    var i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
      d[i] = []
      d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
      d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
      si = s.charAt(i - 1)
      for (j = 1; j <= m; j++) {
        tj = t.charAt(j - 1)
        if (si === tj) {
          cost = 0
        } else {
          cost = 1
        }
        d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      }
    }
    const res = (1 - d[n][m] / l)
    return res.toFixed(f)
  }
  const targetDocument = unsafeWindow.document
  console.log(targetDocument)
  targetDocument.onreadystatechange = async function () {
    if (targetDocument.readyState == 'complete') {
      const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
      }
      console.log('脚本等待页面初始化中')
      console.log('Edit by Kairlec')
      await sleep(2000)
      const $ = unsafeWindow.jQuery
      var video = unsafeWindow.video || targetDocument.querySelector('video')
      var begin = new Date()
      while (video === undefined || video === null) {
        await sleep(1)
        if (new Date().getTime() - begin.getTime() > 10000) {
          console.log('脚本初始化超时,当前页面不是视频页或视频加载失败')
          return
        }
        video = unsafeWindow.video || targetDocument.querySelector('video')
      }
      console.log('初始化...')
      // video.pause = function () {}
      // console.log('hook暂停函数完成')
      video.onended = async function () { // 播放下一个视频
        const listScroll = targetDocument.querySelector('div.courseAction_lesson_left.lesson_left div.listScroll')
        // 先释放所有章节节点
        listScroll.querySelectorAll('ul.first').forEach((elem) => {
          if (!elem.classList.contains('active')) {
            elem.querySelector('li.title').click()
          }
        })
        await sleep(500)
        // 获取所有视频列表
        const videoList = []
        listScroll.querySelectorAll('ul.third li.title').forEach((elem) => {
          if (elem.querySelector('i').innerText === '\ue65c') {
            videoList.push(elem)
          }
        })
        var localVideo = listScroll.querySelector('li.title.active')// 获取当前视频
        var ls = false
        videoList.some((item) => {
          if (ls) {
            if (item.querySelector('i.percentFull') === null) {
              console.log(item)
              item.click()
              return true
            }
          } else {
            if (item === localVideo) {
              ls = true
            }
          }
        })
        await sleep(500)
        unsafeWindow.location.reload()
      }
      console.log('hook结束函数完成')
      // $(document).off('mozvisibilitychange')
      // $(document).off('visibilitychange')
      // $(document).off('webkitvisibilitychange')
      // $(document).off('msvisibilitychange')
      // unsafeWindow.onblur = function () {}
      // console.log('hook焦点函数完成')
      targetDocument.querySelector('.xt_video_player_common_icon').click()
      targetDocument.querySelector('.xt_video_player_common_list').querySelectorAll('li').forEach((item) => {
        if (item.innerText === '标清') {
          item.click()
          console.log('自动切换至标清以节省带宽')
          return false
        }
      })
      console.log('当前播放速度:' + video.playbackRate)
      // 启用2倍速播放
      setInterval(() => { targetDocument.querySelector('li[data-speed="2"]').click() }, 3000)
      video.muted = true// 静音视频,想看视频的可以删除这一行
      video.play()// 播放当前视频
      console.log('已经开始播放')
    }
  }
}
)()
