// ==UserScript==
// @name         ！！
// @namespace    https://bilibili.com
// @version      1.1.0
// @description  B站首页看？！
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436436/%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/436436/%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

/*
 原作者：https://www.v2ex.com/t/818992#reply10
         https://greasyfork.org/zh-CN/scripts/436110-b%E7%AB%99-%E5%91%A8%E5%A7%90

 如有侵权，立即删除。
 */

;(function () {
  'use strict'
  GM_addStyle(`
    #bili_zhoushuyi .popover-video-card {
      display: none;
    }
    #bili_zhoushuyi a:hover+.popover-video-card {
      display: block;
    }
  `)
  const TITLE = '王冰冰'
  const KEY_WORDS = '王冰冰'
  const CHANNEL_ID = 4785500
  const ICON =
    'data:image/jpg;base64,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'

  const bigFans = [
    
  ]

  let currentPage = 1
  let page = 0
  let videoList = []
  let page_size = 12

  async function getDetail(bvid) {
    let res = await fetch(
      `https://api.bilibili.com/x/web-interface/archive/stat?bvid=${bvid}`,
    )
    return (await res.json()).data
  }

  async function getNewVideo() {
    let res = await fetch(
      `https://api.bilibili.com/x/web-interface/search/type?context=&order=pubdate&keyword=${KEY_WORDS}&search_type=video&page=${currentPage++}`,
    )
    videoList = videoList.concat((await res.json()).data.result)
  }

  async function getHotVideo() {
    let res = await fetch(
      `https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id=${CHANNEL_ID}&sort_type=hot&offset=&page_size=${page_size}`,
    )
    return (await res.json()).data.list[0].items
  }

  function bigNumber(num) {
    return num > 10000 ? `${(num / 10000).toFixed(2)}万` : num
  }

  function s2d(string) {
    return new DOMParser().parseFromString(string, 'text/html').body
      .childNodes[0]
  }

  async function refresh() {
    page++
    if (videoList.length < page * page_size + page_size) {
      await getNewVideo()
    }
    drawVideos()
  }

  function timeFormat(time) {
    let res = []
    let [s = 0, m = 0, h = 0] = time.split(':').reverse()

    res.unshift(String(s).padStart(2, '0'))
    res.unshift(String(m % 60).padStart(2, '0'))
    res.unshift(String(h % 60).padStart(2, '0'))

    return res.join(':')
  }

  function drawVideos() {
    const VIDEO_DOM = document.querySelector('#bili_zhoushuyi .zone-list-box')
    VIDEO_DOM.innerHTML = ''

    videoList
      .slice(page * page_size, page * page_size + page_size)
      //.sort((a, b) => {
      //  return bigFans.includes(b.mid) ? 1 : -1
      //})
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
              bigFans.includes(item.mid) ? 'gold' : ''
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
    const RANK_DOM = document.querySelector('#bili_zhoushuyi .rank-list')
    let firstDetail = await getDetail(item.bvid)
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
    const RANK_DOM = document.querySelector('#bili_zhoushuyi .rank-list')

    let rankList = await getHotVideo()
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

  const zhoujieDOM = `
  <div id="bili_zhoushuyi">
    <div class="space-between report-wrap-module report-scroll-module" id="bili_report_douga" scrollshow="true">
      <div class="card-list">
        <header class="storey-title">
          <div class="l-con"> <img class="svg-icon" src="${ICON}" /> <a
              href="https://search.bilibili.com/all?keyword=${KEY_WORDS}" target="_blank" class="name">${TITLE}</a></div>
          <div class="exchange-btn">
            <div class="btn btn-change zhoujie-refresh"><i class="bilifont bili-icon_caozuo_huanyihuan"></i> 换一换 </div><a
              href="https://search.bilibili.com/all?keyword=${KEY_WORDS}&order=pubdate" target="_blank" class="btn more">
              更多 <i class="bilifont bili-icon_caozuo_qianwang"></i></a>
          </div>
        </header>
        <div class="zone-list-box"> </div>
      </div>
      <div class="rank-list">
        <header class="rank-header"><span class="name">排行榜</span><a
            href="https://www.bilibili.com/v/channel/${CHANNEL_ID}?tab=multiple" target="_blank" class="more">更多<i
              class="bilifont bili-icon_caozuo_qianwang"></i></a></header>
      </div>
    </div>
  </div>`

  window.addEventListener(
    'load',
    async function () {
      let content = document.querySelector('.first-screen')
      let anchor = document.querySelector('#reportFirst2')
      let init = s2d(zhoujieDOM)

      // 插入初始模版
      content.insertBefore(init, anchor)

      //点击事件
      document
        .querySelector('.zhoujie-refresh')
        .addEventListener('click', refresh)

      // 插入最新视频
      await getNewVideo()
      drawVideos()

      // 插入热门视频
      drawHot()
    },
    false,
  )
})()
