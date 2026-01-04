// ==UserScript==
// @name         B站视频观看总进度
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  给B站多P视频下方添加一个总进度
// @author       汐涌及岸
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427453/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E6%80%BB%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/427453/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E6%80%BB%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==

const bvid = isBiliPlayer.bvid;
//格式化
const HHmmss = second => [Math.floor(second/3600),Math.floor(second/60)%60,second%60].map(n=>n.toString().padStart(2,0)).join(':')
//进度解析
const durationHelper = {
  async request(){
    const data = app.__vue__.videoData
    return data.ugc_season ? durationHelper.episodesAdapte(data) : durationHelper.pagesAdapte(data)
  },
  //分P
  pagesAdapte(data) {
    if (data.pages.length <= 1) return null
    const p = parseInt(new URLSearchParams(location.search).get('p')) || 1
    const multi = data.pages.map(p => p.duration)
    const before = p > 1 ? multi.slice(0, p - 1).reduce((t, d) => t + d) : 0
    return { total: data.duration, multi, before}
  },
  //合集
  episodesAdapte(data) {
    const eps = data.ugc_season.sections[0].episodes
    if (eps.length <= 1) return null
    let multi = []
    let total = 0, before = 0
    let isBefore = true
    for (const ep of eps) {
      if (ep.bvid == bvid) isBefore = false
      const duration = ep.page.duration
      multi.push(duration)
      total += duration
      if (isBefore) {
        before += duration
      }
    }
    return { multi, total, before }
  },
}
//进度条管理
const totalProgress = {
  data:null,
  el:null,
  async init(){
    totalProgress.createEl()
    totalProgress.data = await durationHelper.request()
    totalProgress.setContent()
    //进度条刷新
    window.player.on("Player_TimeUpdate", totalProgress.setContent)
    //分P列表点击时重新获取数据
    document.getElementById('multi_page').addEventListener('click',totalProgress.init)
  },
  //创建标签
  createEl(){
    if (document.getElementById('video-total-progress')) return
    const el = document.createElement('span')
    el.id = 'video-total-progress'
    el.style.color = '#eee'
    el.style.paddingLeft = '12px'

    let ctrlTimeLabelEl = document.querySelector('.bpx-player-ctrl-time-label')
    ctrlTimeLabelEl.style.display = "inline-block"
    ctrlTimeLabelEl.style.width = "unset"
    ctrlTimeLabelEl.insertAdjacentElement('beforeend',el)
    ctrlTimeLabelEl.parentElement.style.minWidth = "max-content"
    
    totalProgress.el = el
  },
  //设置内容
  setContent(){
    const { before,total } = totalProgress.data
    const now = parseInt(window.player.getCurrentTime())+before
    totalProgress.el.innerHTML = `<b>总进度</b> ${HHmmss(now)} / ${HHmmss(total)} (${((now/total)*100).toFixed(2)}%)`
  }
}
//等待播放器加载完成
let waitPlayerLoad = setInterval(() => { if(!window.player || !document.querySelector('.bpx-player-ctrl-time-label') || !app.__vue__) return; totalProgress.init(); clearInterval(waitPlayerLoad)}, 1000);