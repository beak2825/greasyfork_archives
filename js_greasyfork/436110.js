// ==UserScript==
// @name         B站 周姐
// @namespace    https://space.bilibili.com/15516023
// @version      1.2.2
// @description  B站首页看各个分区！
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436110/B%E7%AB%99%20%E5%91%A8%E5%A7%90.user.js
// @updateURL https://update.greasyfork.org/scripts/436110/B%E7%AB%99%20%E5%91%A8%E5%A7%90.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  GM_addStyle(`
    #bili_custom .popover-video-card {
      display: none;
    }
    #bili_custom a:hover+.popover-video-card {
      display: block;
    }
    .pgc-rank-dropdown {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background-color: #fff;
      font-size: 12px;
      cursor: default;
      padding: 0 7px;
      height: 22px;
      line-height: 22px;
      border: 1px solid #ccd0d7;
      border-radius: 4px;
      margin-right: 12px;
  }
  
  .pgc-rank-dropdown:hover {
      border-radius: 4px 4px 0 0;
      -webkit-box-shadow: rgba(0,0,0,.16) 0 2px 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,.16)
  }
  
  .pgc-rank-dropdown:hover .dropdown-list {
      display: block
  }
  
  .pgc-rank-dropdown .selected {
      display: inline-block;
      vertical-align: top
  }
  
  .pgc-rank-dropdown .icon-arrow-down {
      background-image: url(//static.hdslb.com/images/base/icons.png);
      background-position: -475px -157px;
      display: inline-block;
      vertical-align: middle;
      width: 12px;
      height: 6px;
      margin-left: 5px;
      margin-top: -1px
  }
  
  .pgc-rank-dropdown .dropdown-list {
      position: absolute;
      width: 100%;
      background: #fff;
      border: 1px solid #ccd0d7;
      border-top: 0;
      left: -1px;
      top: 22px;
      z-index: 10;
      display: none;
      border-radius: 0 0 4px 4px
  }
  
  .pgc-rank-dropdown .dropdown-list .dropdown-item {
      cursor: pointer;
      margin: 0;
      padding: 3px 7px
  }
  
  .pgc-rank-dropdown .dropdown-list .dropdown-item:hover {
      background-color: #e5e9ef
  }
  
  `)

  const USERS = [
    {
      key_words: '周淑怡',
      channel_id: 780447,
      bigFans: [
        366314, //夕寒君
        408794610, //周姐日常事
        279220304, //米小莔
        2662674, //不2不叫火龙果
        30405149, //AA丶翼夜
        178505026, //AA丶熊熊
        1578665974, //全村最野的狗
        65888156, //hy弘月
        27330407, //拆城南宝
      ],
    },
    {
      key_words: 'A-SOUL',
      channel_id: 4429874,
      bigFans: [
        672328094, //嘉然今天吃什么
        672346917, //向晚大魔王
        672353429, //贝拉kira
        351609538, //珈乐Carol
        672342685, //乃琳Queen
      ],
    }
  ]

  let currentUserIndex = 0

  let currentPage = 1
  let page = 0
  let videoList = []

  const API = {
    getDetail: async (bvid) => {
      let res = await fetch(
        `https://api.bilibili.com/x/web-interface/archive/stat?bvid=${bvid}`,
      )
      return (await res.json()).data
    },
    getNewVideo: async () => {
      let res = await fetch(
        `https://api.bilibili.com/x/web-interface/search/type?context=&order=pubdate&keyword=${
          USERS[currentUserIndex].key_words
        }&search_type=video&page=${currentPage++}`,
      )
      videoList = videoList.concat((await res.json()).data.result)
    },
    getHotVideo: async () => {
      let res = await fetch(
        `https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id=${USERS[currentUserIndex].channel_id}&sort_type=hot&offset=&page_size=10`,
      )
      return (await res.json()).data.list[0].items
    },
  }

  function bigNumber(num) {
    return num > 10000 ? `${(num / 10000).toFixed(2)}万` : num
  }

  function s2d(string) {
    return new DOMParser().parseFromString(string, 'text/html').body
      .childNodes[0]
  }

  function timeFormat(time) {
    let res = []
    let [s = 0, m = 0, h = 0] = time.split(':').reverse()

    res.unshift(String(s).padStart(2, '0'))
    res.unshift(String(m % 60).padStart(2, '0'))
    res.unshift(String(h % 60).padStart(2, '0'))

    return res.join(':')
  }

  async function refresh() {
    console.log(`page:`, page, videoList.length)
    page++
    if (videoList.length <= page * 10 + 10) {
      await API.getNewVideo()
    }
    drawVideos()
  }

  function drawVideos() {
    const VIDEO_DOM = document.querySelector('#bili_custom .zone-list-box')
    VIDEO_DOM.innerHTML = ''

    videoList
      .slice(page * 10, page * 10 + 10)
      .sort((a, b) => {
        return USERS[currentUserIndex].bigFans.includes(b.mid) ? 1 : -1
      })
      .forEach((item) => {
        let title = item.title.replace(/<em class="keyword">(.*?)<\/em>/g, '$1')
        let DOM = s2d(`
        <div class="video-card-common">
          <div class="card-pic card-pic-hover"><a href="//www.bilibili.com/video/${
            item.bvid
          }" target="_blank"><img
              src="${item.pic}"
              alt="">
            <div class="count">
              <div class="left"><span><i class="bilifont bili-icon_shipin_bofangshu"></i>
                  ${item.play}
                </span><span><i class="bilifont bili-icon_shipin_dianzanshu"></i>${
                  item.favorites
                }</span></div>
              <div class="right"><span>${timeFormat(item.duration)}</span></div>
            </div><i class="crown ${
              USERS[currentUserIndex].bigFans.includes(item.mid) ? 'gold' : ''
            }"></i>
          </a>
          <div class="watch-later-video van-watchlater black"><span class="wl-tips" style="display: none;"></span>
          </div>
        </div><a href="//www.bilibili.com/video/${
          item.bvid
        }" target="_blank" title="${title}"
          class="title">
          ${title}
        </a><a href="//space.bilibili.com/${
          item.mid
        }/" target="_blank" class="up"><i
            class="bilifont bili-icon_xinxi_UPzhu"></i>${item.author}
        </a>
      </div>`)
        VIDEO_DOM.append(DOM)
      })
  }

  async function drawFirst(item) {
    const RANK_DOM = document.querySelector('#bili_custom .rank-list')
    let firstDetail = await API.getDetail(item.bvid)
    let firstTitle = item.name.replace(/<em class="keyword">(.*?)<\/em>/g, '$1')
    let first = `
    <div class="rank-wrap"><span class="number on">1</span>
      <div class="preview">
        <div class="pic">
          <a href="//www.bilibili.com/video/${
            item.bvid
          }" target="_blank" class="link">
            <img src="${item.cover}" alt="${firstTitle}">
          </a>
          <div class="watch-later-video van-watchlater black"><span class="wl-tips" style="display: none;"></span>
          </div>
        </div>
        <div class="txt"><a href="//www.bilibili.com/video/${
          item.bvid
        }" target="_blank" class="link">
            <p title="${firstTitle}">${firstTitle}</p>
          </a><span>播放次数：${bigNumber(firstDetail.view)}</span></div>
      </div>
      <div class="popover-video-card pvc" style="display: none;">
        <div class="content"><img src="${item.cover}" alt="">
          <div class="info">
            <p class="f-title">${firstTitle}</p>
            <p class="subtitle"><span class="name">${item.author_name}</span>
              <span class="point">·</span><span class="time">2021-11-22</span></p>
          </div>
        </div>
        <div class="count">
          <ul>
            <li><i class="bilifont bili-icon_shipin_bofangshu"></i><span>${bigNumber(
              firstDetail.view,
            )}</span></li>
            <li><i class="bilifont bili-icon_shipin_danmushu"></i><span>${bigNumber(
              firstDetail.danmaku,
            )}</span></li>
            <li><i class="bilifont bili-icon_shipin_shoucangshu"></i><span>${bigNumber(
              firstDetail.favorite,
            )}</span></li>
            <li><i class="bilifont bili-icon_shipin_yingbishu"></i><span>${bigNumber(
              firstDetail.coin,
            )}</span></li>
          </ul>
        </div>
      </div>
    </div>
    `
    RANK_DOM.append(s2d(first))
  }

  async function drawHot() {
    const RANK_DOM = document.querySelector('#bili_custom .rank-list')

    let rankList = await API.getHotVideo()
    await drawFirst(rankList.shift())
    rankList.forEach((item, index) => {
      let title = item.name.replace(/<em class="keyword">(.*?)<\/em>/g, '$1')
      let DOM = s2d(`
      <div class="rank-wrap"><span class="number ${index < 2 && 'on'}">${
        index + 2
      }</span>
        <a href="//www.bilibili.com/video/${
          item.bvid
        }" target="_blank" class="link">
          <p title="${title}" class="title">${title}</p>
        </a>
        <div class="popover-video-card pvc">
          <div class="content"><img
              src="${item.cover}" alt="">
            <div class="info">
              <p class="f-title">${title}</p>
              <p class="subtitle"><span class="name">${
                item.author_name
              }</span><span class="point">·</span><span
                  class="time">${timeFormat(item.duration)}</span></p>
            </div>
          </div>
          <div class="count">
            <ul>
              <li><i class="bilifont bili-icon_shipin_bofangshu"></i><span>${
                item.view_count
              }</span></li>
              <li><i class="bilifont bili-icon_shipin_danmushu"></i><span>-</span></li>
              <li><i class="bilifont bili-icon_shipin_shoucangshu"></i><span>-</span></li>
              <li><i class="bilifont bili-icon_shipin_yingbishu"></i><span>-</span></li>
            </ul>
          </div>  
        </div>
      </div>`)
      RANK_DOM.append(DOM)
    })
  }
  const drawSelector = () => {
    const HEADER_DOM = document.querySelector('#bili_custom .exchange-btn')
    let DOM = s2d(`
    <div class="pgc-rank-dropdown rank-dropdown"><span class="selected">${
      USERS[currentUserIndex].key_words
    }</span> 
      <i class="icon icon-arrow-down"></i> 
      <ul class="dropdown-list">
        ${USERS.map(
          (item, index) =>
            ` <li class="dropdown-item" index="${index}">${item.key_words}</li> `,
        ).join('')}
      </ul>
    </div>
    `)
    HEADER_DOM.prepend(DOM)

    document
      .querySelector('.dropdown-list')
      .addEventListener('click', injectDOM)
  }

  async function injectDOM(e) {
    currentUserIndex = e ? e.target.getAttribute('index') : 0
    videoList = []
    currentPage = 1
    page = 0

    const DOM = `
    <div id="bili_custom">
      <div class="space-between report-wrap-module report-scroll-module" id="bili_report_douga" scrollshow="true">
        <div class="card-list">
          <header class="storey-title">
          <div class="l-con"> <a
          href="https://search.bilibili.com/all?keyword=${USERS[currentUserIndex].key_words}" target="_blank" class="name">${USERS[currentUserIndex].key_words}</a></div>
          <div class="exchange-btn">
              <div class="btn btn-change custom-refresh"><i class="bilifont bili-icon_caozuo_huanyihuan"></i> 换一换 </div>
              <a href="https://search.bilibili.com/all?keyword=${USERS[currentUserIndex].key_words}&order=pubdate" target="_blank" class="btn more">
                更多 <i class="bilifont bili-icon_caozuo_qianwang"></i>
              </a>
            </div>
          </header>
          <div class="zone-list-box"> </div>
        </div>
        <div class="rank-list">
          <header class="rank-header"><span class="name">排行榜</span><a
              href="https://www.bilibili.com/v/channel/${USERS[currentUserIndex].channel_id}?tab=multiple" target="_blank" class="more">更多<i
                class="bilifont bili-icon_caozuo_qianwang"></i></a></header>
        </div>
      </div>
    </div>`
    let content = document.querySelector('.first-screen')
    let anchor = document.querySelector('#reportFirst2')
    let init = s2d(DOM)
    document.querySelector('#bili_custom') &&
      document.querySelector('#bili_custom').remove()
    // 插入初始模版
    console.log(`init:`, currentUserIndex)
    content.insertBefore(init, anchor)
    // 插入选择器
    drawSelector()
    // 插入最新视频
    await API.getNewVideo()
    drawVideos()
    // 插入热门视频
    drawHot()
    // 点击事件
    document.querySelector('.custom-refresh').addEventListener('click', refresh)
  }

  window.addEventListener(
    'load',
    async () => {
      await injectDOM()
    },
    false,
  )
})()
