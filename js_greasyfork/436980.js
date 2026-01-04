// ==UserScript==
// @name         B站 阿梓从小就很可爱
// @namespace    https://space.bilibili.com/7522132
// @version      0.1
// @description  B站首页看阿梓
// @author       You
// @match        https://www.bilibili.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436980/B%E7%AB%99%20%E9%98%BF%E6%A2%93%E4%BB%8E%E5%B0%8F%E5%B0%B1%E5%BE%88%E5%8F%AF%E7%88%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/436980/B%E7%AB%99%20%E9%98%BF%E6%A2%93%E4%BB%8E%E5%B0%8F%E5%B0%B1%E5%BE%88%E5%8F%AF%E7%88%B1.meta.js
// ==/UserScript==


;(function () {
  'use strict'
  GM_addStyle(`
    #bili_azi .popover-video-card {
      display: none;
    }
    #bili_azi a:hover+.popover-video-card {
      display: block;
    }
  `)
  const TITLE = '阿梓从小就很可爱'
  const KEY_WORDS = '阿梓'
  const CHANNEL_ID = 4429874
  const ICON =
    'data:image/jpeg;base64,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'

  const bigFans = [
    1982780, //CC无名酱
    390317791, //七乃嘉晚贝珈梓
    231590, //Asong゛
    295689, //梓梓柴宝
    14137121, //阿千从小就很会说话
    1997886, //摸法师吴京
    19439683,//阿梓毒唯
  ]

  let currentPage = 1
  let page = 0
  let videoList = []

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
      `https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id=${CHANNEL_ID}&sort_type=hot&offset=&page_size=10`,
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
    if (videoList.length < page * 10 + 10) {
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
    const VIDEO_DOM = document.querySelector('#bili_azi .zone-list-box')
    VIDEO_DOM.innerHTML = ''

    videoList
      .slice(page * 10, page * 10 + 10)
      .sort((a, b) => {
        return bigFans.includes(b.mid) ? 1 : -1
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
              bigFans.includes(item.mid) ? 'gold' : ''
            }"></i>
          </a>
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
    const RANK_DOM = document.querySelector('#bili_azi .rank-list')
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
    const RANK_DOM = document.querySelector('#bili_azi .rank-list')

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
  <div id="bili_azi">
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