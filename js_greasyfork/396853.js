// ==UserScript==
// @name         城院学堂云脚本
// @namespace    http://www.kairlec.com/
// @version      1.1
// @description  在城院的学堂云3上可以挂着视频一直播放(暂时适配毛概,其他视频可以自行测试)
// @author       Kairlec
// @match        https://hncu.xuetangx.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/396853/%E5%9F%8E%E9%99%A2%E5%AD%A6%E5%A0%82%E4%BA%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/396853/%E5%9F%8E%E9%99%A2%E5%AD%A6%E5%A0%82%E4%BA%91%E8%84%9A%E6%9C%AC.meta.js
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
  $(document).ready(async function () {
    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    console.log('脚本等待页面初始化中')
    console.log('Edit by Kairlec')
    await sleep(2000)
    const $ = unsafeWindow.jQuery
    var video = unsafeWindow.video
    var begin = new Date()
    while (typeof (video) === 'undefined') {
      await sleep(1)
      if (new Date().getTime() - begin.getTime() > 10000) {
        console.log('脚本初始化超时,当前页面不是视频页或视频加载失败')
        return
      }
      video = unsafeWindow.video
    }
    console.log('初始化...')
    //video.pause = function () {}
    //console.log('hook暂停函数完成')
    video.onended = async function () { // 播放下一个视频
      var thisVideoName = $('div.video-header > span.chapter-name').text()// 获取当前视频名称
      $('div.course-structure-tree__wrap').find('i.icon-plus').click()// 先释放所有章节节点
      await sleep(500)
      $('div.course-structure-tree__wrap').find('i.el-icon-arrow-down').click()// 再释放所有子节点
      await sleep(500)
      var videoList = $('div.course-structure-tree__wrap').find('div[role="progressbar"]')// 获取所有视频列表
      console.log(videoList)
      var localVideo = $('div.course-structure-tree__wrap').find('span').filter(function () { return similar($(this).text().trim(), thisVideoName.trim()) > 0.9 }).parent().find('div[role="progressbar"]')[0]// 获取当前视频
      console.log(localVideo)
      var ls = false
      $.each(videoList, function (index, item) {
        console.log($(item))
        if (ls) {
          if (parseInt($(item).attr('aria-valuenow')) < parseInt($(item).attr('aria-valuemax'))) {
            console.log($(item))
            $(item).click()
            return false
          }
        } else {
          if (item === localVideo) {
            ls = true
          }
        }
      })
    }
    console.log('hook结束函数完成')
    $(document).off("mozvisibilitychange")
    $(document).off("visibilitychange")
    $(document).off("webkitvisibilitychange")
    $(document).off("msvisibilitychange")
    //unsafeWindow.test3="3"
    unsafeWindow.onblur = function () {}
    console.log('hook焦点函数完成')
    //video.muted = true// 静音视频,想看视频的可以删除这一行
    $(".xt_video_player_volume_icon").click()
    $(".xt_video_player_quality.xt_video_player_common").find("li[class!=xt_video_player_common_active]").each((index,item)=>{
        if(item.innerText==="标清"){
            item.click()
            console.log('自动切换至标清以节省带宽')
            return false
        }
    })
    console.log("当前播放速度:"+video.playbackRate)
    //启用2倍速播放
    setInterval(()=>{$("li[data-speed=2]").click()}, 3000);
    video.play()// 播放当前视频
    console.log('已经开始播放')
  })
})()