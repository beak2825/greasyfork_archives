// ==UserScript==
// @name         dgiot物联网
// @namespace    https://dgiotcloud.cn
// @version      1.0.0
// @description  B站首页显示dgiot专区！
// @author       h7ml <h7ml@qq.com>
// @match        https://www.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/face/def9d68958ee3bd8bd0ecd9215d08a1882deb3b0.jpg@240w_240h_1c_1s.webp
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/447257/dgiot%E7%89%A9%E8%81%94%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/447257/dgiot%E7%89%A9%E8%81%94%E7%BD%91.meta.js
// ==/UserScript==
; (function () {
  'use strict'
  GM_addStyle()

  const USERS = [
    {
      key_words: 'dgiot物联网',
      channel_id: 1252767981,
      avatar: 'https://i0.hdslb.com/bfs/face/def9d68958ee3bd8bd0ecd9215d08a1882deb3b0.jpg@240w_240h_1c_1s.webp',
    }
  ]

  let currentUserIndex = 0

  let currentPage = 1
  let page = 0
  let videoList = []

  const API = {
    getNewVideo: async () => {
      let res = await fetch(
        `https://api.bilibili.com/x/space/arc/search?mid=${USERS[currentUserIndex].channel_id}&ps=30&tid=0&pn=${currentPage}&order=pubdate&jsonp=jsonp`
      )
      const json = await res.json()
      videoList = videoList.concat(json.data.list.vlist)
    }
  }

  // 播放量格式化
  function bigNumber(num) {
    return num > 10000 ? `${(num / 10000).toFixed(2)}万` : num
  }

  function s2d(string) {
    return new DOMParser().parseFromString(string, 'text/html').body
      .childNodes[0]
  }
  // 播放时长格式化
  function timeFormat(time) {
    let res = []
    let h = 0
    let [s = 0, m = 0] = time.split(':').reverse()
    console.log(m, s)
    res.unshift(String(s).padStart(2, '0'))
    res.unshift(String(m % 60).padStart(2, '0'))
    res.unshift(String(parseInt(m / 60)).padStart(2, '0'))
 
    return res.join(':')
  }
  // 日期时间格式化
  function timeago(dateTimeStamp) {
    const minute = 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60;
    const day = hour * 24;
    // const week = day * 7;
    const month = day * 30;
    const now = parseInt(new Date().getTime() / 1000);   //获取当前时间毫秒
    const diffValue = now - dateTimeStamp;//时间差
    let result = ''
    if (diffValue < 0) {
      return;
    }
    const minC = diffValue / minute;  //计算时间差的分，时，天，周，月
    const hourC = diffValue / hour;
    const dayC = diffValue / day;
    const monthC = diffValue / month;
    const datetime = new Date();
    datetime.setTime(dateTimeStamp * 1000);
    const Nyear = datetime.getFullYear();
    const Nmonth = datetime.getMonth() + 1;
    const Ndate = datetime.getDate();
    if (dayC >= 1 && dayC < 2) {
      result = "昨天"
    } else if (hourC >= 1 && hourC <= 23) {
      result = " " + parseInt(hourC) + "小时前"
    } else if (minC >= 1 && minC <= 59) {
      result = " " + parseInt(minC) + "分钟前"
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = "刚刚"
    } else if (monthC < 12) {
      result = Nmonth + "-" + Ndate
    } else {
      result = Nyear + "-" + Nmonth + "-" + Ndate
    }
    return result;
  }
  // 换一换
  async function refresh() {
    page++
    if (videoList.length <= page * 10 + 14) {
      await API.getNewVideo()
    }
    drawVideos()
  }

  function drawVideos() {
    const VIDEO_DOM = document.querySelector('#bili_custom .variety-body')
    VIDEO_DOM.innerHTML = ''

    videoList
      .slice(page * 10, page * 10 + 14)
      .forEach((item) => {
        const title = item.title.replace(/<em class="keyword">(.*?)<\/em>/g, '$1')
        const pic = item.pic.replace(/http/g, 'https') + '@672w_378h_1c'
        const webp = pic + '.webp'
        let DOM = s2d(`
        <div class="bili-video-card" data-report="partition_recommend.content">
  <div class="bili-video-card__skeleton hide">
    <div class="bili-video-card__skeleton--cover"></div>
    <div class="bili-video-card__skeleton--info">
      <div class="bili-video-card__skeleton--right">
        <p class="bili-video-card__skeleton--text"></p>
        <p class="bili-video-card__skeleton--text short"></p>
        <p class="bili-video-card__skeleton--light"></p>
      </div>
    </div>
  </div>
  <div class="bili-video-card__wrap __scale-wrap"><a href="//www.bilibili.com/video/${item.bvid}" target="_blank"
      data-mod="partition_recommend" data-idx="content" data-ext="click">
      <div class="bili-video-card__image __scale-player-wrap">
        <div class="bili-video-card__image--wrap">
          <div class="bili-watch-later" style="display: none;"><svg class="bili-watch-later__icon">
              <use xlink:href="#widget-watch-later"></use>
            </svg><span class="bili-watch-later__tip" style="display: none;"></span></div>
          <picture class="v-img bili-video-card__cover">
            <!---->
            <source srcset="${webp}"
              type="image/webp"><img
              src="${pic}"
              alt="${title}" loading="lazy" onload="">
          </picture>
          <div class="v-inline-player"></div>
        </div>
        <div class="bili-video-card__mask">
          <div class="bili-video-card__stats">
            <div class="bili-video-card__stats--left"><span class="bili-video-card__stats--item"><svg
                  class="bili-video-card__stats--icon">
                  <use xlink:href="#widget-video-play-count"></use>
                </svg><span class="bili-video-card__stats--text">${bigNumber(item.play)}</span></span><span
                class="bili-video-card__stats--item"><svg class="bili-video-card__stats--icon">
                  <use xlink:href="#widget-video-danmaku"></use>
                </svg><span class="bili-video-card__stats--text">${item.comment}</span></span></div><span
              class="bili-video-card__stats__duration">${timeFormat(item.length)}</span>
          </div>
        </div>
      </div>
    </a>
    <div class="bili-video-card__info __scale-disable">
      <div class="bili-video-card__info--right">
        <h3 class="bili-video-card__info--tit" title="${title}"><a href="//www.bilibili.com/video/${item.bvid}"
            target="_blank" data-mod="partition_recommend" data-idx="content" data-ext="click">${title}</a></h3>
        <div class="bili-video-card__info--bottom">
          <a class="bili-video-card__info--owner" href="//space.bilibili.com/${item.mid}" target="_blank"
            data-mod="partition_recommend" data-idx="content" data-ext="click"><svg
              class="bili-video-card__info--owner__up">
              <use xlink:href="#widget-up"></use>
            </svg><span class="bili-video-card__info--author">${item.author}</span><span
            class="bili-video-card__info--date">· ${timeago(item.created)}</span></a>
        </div>
      </div>
    </div>
  </div>
</div>
`)
        VIDEO_DOM.append(DOM)
      })
  }

  async function injectDOM(e) {
    currentUserIndex = e ? e.target.getAttribute('index') : 0
    videoList = []
    currentPage = 1
    page = 0

    const DOM = `
    <div id="bili_custom">
    <section class="bili-grid">
  <div class="variety-area">
    <div class="area-header">
      <div class="left"><a id="${USERS[currentUserIndex].key_words}" class="the-world area-anchor" data-id="6"></a>
        <img src="${USERS[currentUserIndex].avatar}" style="width: 34px; height: 34px; border-radius: 17px; margin-right: 12px;">
        <a class="title" href="https://search.bilibili.com/all?keyword=${USERS[currentUserIndex].key_words}"
          target="_blank"><span>${USERS[currentUserIndex].key_words}</span></a></div>
      <div class="right"><button class="primary-btn roll-btn custom-refresh"><svg style="transform: rotate(0deg);">
            <use xlink:href="#widget-roll"></use>
          </svg><span>换一换</span></button><a class="primary-btn see-more" href="https://space.bilibili.com/${USERS[currentUserIndex].channel_id}/video"
          target="_blank"><span>查看更多</span><svg>
            <use xlink:href="#widget-arrow"></use>
          </svg></a></div>
    </div>
    <div class="variety-body"></div>
    </div>
  </section>
</div>`
    let content = document.querySelector('.bili-layout')
    let anchor = document.querySelectorAll('.bili-grid')[2]
    let init = s2d(DOM)
    document.querySelector('#bili_custom') &&
    document.querySelector('#bili_custom').remove()
    // 插入初始模版
    content.insertBefore(init, anchor)

    // 插入最新视频
    await API.getNewVideo()
    drawVideos()
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