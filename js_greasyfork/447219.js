// ==UserScript==
// @name         B站 Antfu
// @namespace    https://github.com/lilei2603/bilibili-follow
// @version      2.1
// @description  B站首页显示Antfu专区！
// @author       Lei
// @match        https://www.bilibili.com/*
// @icon         https://avatars.githubusercontent.com/u/11247099?v=4
// @grant        GM_addStyle
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/447219/B%E7%AB%99%20Antfu.user.js
// @updateURL https://update.greasyfork.org/scripts/447219/B%E7%AB%99%20Antfu.meta.js
// ==/UserScript==
; (function () {
  'use strict'

  // 用户列表
  let USERS = []
  // 当前用户索引
  let currentUserIndex = 0

  let currentPage = 1
  let page = 0
  // 视频列表
  let videoList = []
  // 是否显示我的关注窗口
  let isShowFavorite = false
  // 窗口滚动距离
  let scrollTop = 0
  let totalCount = 0
  const API = {
    // 获取用户视频列表
    getNewVideo: async () => {
      let res = await fetch(
        `https://api.bilibili.com/x/space/arc/search?mid=${USERS[currentUserIndex].mid}&ps=30&tid=0&pn=${currentPage}&order=pubdate&jsonp=jsonp`
      )
      const json = await res.json()
      totalCount = json.data.page.count
      videoList = videoList.concat(json.data.list.vlist)
    },
    // 根据用户ID获取用户信息
    getUserInfoByMid: async (mid) => {
      let res = await fetch(`https://api.bilibili.com/x/space/acc/info?mid=${mid}&jsonp=jsonp`)
      const json = await res.json()
      return json
    }
  }
  // 用户初始化
  function initUser() {
    // 从缓存中获取用户列表
    if(!localStorage.getItem('favorites')) {
      USERS = [
        {
          key_words: 'AnthonyFu一个托尼',
          mid: 668380,
          avatar: 'http://i1.hdslb.com/bfs/face/519cb17285e6b9450a738472cb0b95aeb8676547.jpg',
        }
      ]
      localStorage.setItem('favorites', JSON.stringify(USERS))
    }else {
      USERS = JSON.parse(localStorage.getItem('favorites'))
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
    let [s = 0, m = 0] = time.split(':').reverse()
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
      result = '昨天'
    } else if (hourC >= 1 && hourC <= 23) {
      result = ' ' + parseInt(hourC) + '小时前'
    } else if (minC >= 1 && minC <= 59) {
      result = ' ' + parseInt(minC) + '分钟前'
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = '刚刚'
    } else if (monthC < new Date().getMonth() + 1) {
      result = Nmonth + '-' + Ndate
    } else {
      result = Nyear + '-' + Nmonth + '-' + Ndate
    }
    return result;
  }
  // 换一换
  async function refresh() {
    page++
    if(videoList.length < totalCount){
      currentPage++
      await API.getNewVideo()
    }else {
      if(videoList.length % totalCount == 0){
        currentPage = 1
      }else{
        currentPage++
      }
      await API.getNewVideo()
    }
    drawVideos()
  }
  // 绘制视频
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
  // 绘制我的关注按钮
  function drawFavorites() {

    const refreshBtn = document.querySelector('.custom-refresh')
    const refreshBtnParent = refreshBtn.parentNode
    const favorite = s2d(`
    <button class="primary-btn roll-btn favorite-btn" id="favorite-btn">
      <svg style="transform: rotate(180deg);">
        <use xlink:href="#widget-arrow"></use>
      </svg>
      <span>我的关注</span>
    </button>
  `)
  refreshBtnParent.insertBefore(favorite, refreshBtn)
  const modal = s2d(`
  <div class="custom-modal">
  <div class="modal-mask"></div>
  <div class="modal-wrap">
    <div class="modal" role="document">
      <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div>
      <div class="modal-content"><button type="button" aria-label="Close" class="modal-close"><span
            class="modal-close-x"><span role="img" aria-label="close"
              class="anticon anticon-close modal-close-icon"><svg focusable="false" class="" data-icon="close"
                width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                <path
                  d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                </path>
              </svg></span></span></button>
        <div class="modal-header">
          <div class="modal-title">我的关注</div>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer">
          <div>
            <span>用户ID：</span>
            <input id="mid" style="height: 25px; padding: 5px;" />
          </div>
          <button class="btn btn-primary" type="button">
            <span>添 加</span>
          </button>
        </div>
      </div>
      <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div>
    </div>
  </div>
</div>
    `)
    document.querySelector('#bili_custom').append(modal)
    appendFavoriteItem()
  }
  // 添加关注用户项
  function appendFavoriteItem() {
    document.querySelector('.modal-body').innerHTML = ''
    USERS.forEach((item, index) => {
      const DOM = s2d(`
      <div class="modal-content-item">
        <img src="${item.avatar}" style="width: 34px; height: 34px; border-radius: 17px; margin-right: 12px;">
        <span>${item.key_words}</span>
      </div>
      `)
      document.querySelector('.modal-body').append(DOM)
      DOM.addEventListener('click', () => {
        currentUserIndex = index
        showFavorite()
        injectDOM()
      })
    })
  }
  // 操作我的关注弹窗
  function showFavorite() {
    isShowFavorite = !isShowFavorite
    // 获取点击按钮时，当前窗口滚动距离
    if(window.pageYOffset != 0) {
      scrollTop = window.pageYOffset
    }
    // 如果显示弹窗，则禁用页面滚动
    document.body.style.position = isShowFavorite ? 'fixed' : 'static'
    // 设置页面滚动高度
    document.body.style.top = isShowFavorite ? `-${scrollTop}px` : '0';
    window.scrollTo(0, scrollTop)

    document.querySelector('.custom-modal').style.display = isShowFavorite ? 'block' : 'none'
    appendFavoriteItem()
  }
  // 添加用户信息
  async function appendFavorite() {
    const mid = document.querySelector('#mid')
    const isUserExist = USERS.findIndex(item => item.mid == mid)
    if(isUserExist == -1) {
      const userInfo = await API.getUserInfoByMid(mid.value)
      if(userInfo.code === 0) {
        USERS.push({
          mid: mid.value,
          key_words: userInfo.data.name,
          avatar: userInfo.data.face
        })
      }else{
        alert('获取用户信息失败')
      }
      localStorage.setItem('favorites', JSON.stringify(USERS))
      getMyFavorite()
      mid.value = ''
    }else{
      alert('用户已存在')
    }
  }
  // 获取用户信息
  function getMyFavorite() {
    const favorites = localStorage.getItem('favorites')
    if(favorites) {
      USERS = JSON.parse(favorites)
    }
    appendFavoriteItem()
  }
  // 关注信息
  async function useLive() {
    const { data } = await API.getUserInfoByMid(USERS[currentUserIndex].mid);
    return {
        liveRoomUrl: data.live_room.url,
        isLive: data.live_room.liveStatus === 1
    }
  }
  // 包装根据bool切换值
  function wrapperSwitchValue(flag) {
    return (t, f) => flag ? t : f
  }
  // 初始化容器
  async function injectDOM() {
    // currentUserIndex = mid ? USERS.findIndex(item => item.mid == mid) : 0
    videoList = []
    currentPage = 1
    page = 0
    const spaceVideoUrl = `https://space.bilibili.com/${USERS[currentUserIndex].mid}/video`
    const { liveRoomUrl, isLive } = await useLive();
    const switchLiving = wrapperSwitchValue(isLive);

    const DOM = `
    <div id="bili_custom">
      <section class="bili-grid">
        <div class="variety-area">
          <div class="area-header">
            <div class="left">
              <div class="avatar-container">
                <a href="${switchLiving(liveRoomUrl,spaceVideoUrl)}" target="_blank" class="space-user-avatar">
                <div class="avatar-wrap ${switchLiving('live-ani','')}">
                  <div>
                    <div class="bili-avatar" style="width: 34px;height:34px;">
                      <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius"
                        data-src="${USERS[currentUserIndex].avatar}"
                        alt=""
                        src="${USERS[currentUserIndex].avatar}">
                      <span class="bili-avatar-icon bili-avatar-right-icon  bili-avatar-size-60"></span>
                    </div>
                  </div>
                  <div class="a-cycle a-cycle-1"></div>
                  <div class="a-cycle a-cycle-2"></div>
                  <div class="a-cycle a-cycle-3"></div>
                </div>
                <div class="live-tab" style="${switchLiving('', 'display:none;')}"><img style="width: 15px;height: 15px;"
                    src="//s1.hdslb.com/bfs/static/jinkela/space/assets/live.gif" alt="live" class="live-gif">
                </div>
                </a>
            </div>
                <a class="title" href="https://space.bilibili.com/${USERS[currentUserIndex].mid}/video" target="_blank">
                  <span>${USERS[currentUserIndex].key_words}</span>
                </a>
            </div>
            <div class="right">
              <button class="primary-btn roll-btn custom-refresh">
                <svg style="transform: rotate(0deg);">
                  <use xlink:href="#widget-roll"></use>
                </svg>
                <span>换一换</span>
              </button>
              <a class="primary-btn see-more" href="https://space.bilibili.com/${USERS[currentUserIndex].mid}/video" target="_blank">
                <span>查看更多</span>
                <svg>
                  <use xlink:href="#widget-arrow"></use>
                </svg>
              </a>
            </div>
          </div>
          <div class="variety-body"></div>
        </div>
      </section>
    </div>`
    let content = document.querySelector('.bili-layout')
    if (document.querySelector('#bili_custom')) {
      content.removeChild(document.querySelector('#bili_custom'))
    }
    let anchor = document.querySelectorAll('.bili-grid')[2]
    let init = s2d(DOM)
    document.querySelector('#bili_custom') &&
    document.querySelector('#bili_custom').remove()
    // 插入初始模版
    console.log(anchor)
    content.insertBefore(init, anchor)
    // 插入关注UP主按钮
    drawFavorites()
    // 插入最新视频
    await API.getNewVideo()
    drawVideos()
    // 点击事件
    document.querySelector('.custom-refresh').addEventListener('click', refresh)
    document.querySelector('.favorite-btn').addEventListener('click', showFavorite)
    document.querySelector('.anticon').addEventListener('click', showFavorite)
    document.querySelector('.btn-primary').addEventListener('click', appendFavorite)
  }

  window.addEventListener(
    'load',
    async () => {
      initUser()
      await injectDOM()
    },
    false,
  )

  GM_addStyle(`

  .space-user-avatar {
    width: 34px;
    min-width: 34px;
  }
  .space-user-avatar .avatar-wrap {
    position: relative;
    width: 100%;
    height: 34px;
  }
  .space-user-avatar .avatar-wrap.live-ani .a-cycle {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: 34px;
      height: 34px;
      border: 1px solid #f69;
      border-radius: 50%;
      z-index: 1;
      opacity: 0;
      animation: scaleUpCircle 1.5s linear;
      animation-iteration-count: infinite;
  }
  @keyframes scaleUpCircle{
    0%{
      transform:translate(-50%,-50%) scale(1);
      opacity:1
    }
    to
    {
    transform:translate(-50%,-50%) scale(1.5);
    opacity:0
    }
  }
  .space-user-avatar .avatar-wrap.live-ani .a-cycle-1 {
      animation-delay: 0s;
  }
  .space-user-avatar .avatar-wrap.live-ani .a-cycle-2 {
      animation-delay: .5s;
  }
  .space-user-avatar .avatar-wrap.live-ani .a-cycle-3 {
      animation-delay: 1s;
  }
  .avatar-container {
      position: relative;
      margin-right:15px;
  }
  .space-user-avatar .live-tab {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%,50%);
    height: 15px;
    white-space: nowrap;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    background: #f69;
    color: #fff;
    border-radius: 8px;
    border: 1.5px solid #fff;
    padding: 5px 10px;
    font-size: 12px;
    z-index: 2;
}


    .favorite-btn {
      background-color: #fb7299!important;
      color: #ffffff!important;
    }
    .favorite-btn:hover {
      background-color: #fc8bab!important;
    }
    #bili_custom {
      position: relative;
    }
    .custom-modal {

      display: none;
    }
    .modal-mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      height: 100%;
      background-color: #00000073;
    }
    .modal-wrap {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: auto;
      outline: 0;
      z-index: 1000;
    }
    .modal {
      box-sizing: border-box;
      padding: 0 0 24px;
      color: #000000d9;
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: "tnum";
      pointer-events: none;
      position: relative;
      top: 100px;
      width: 500px;
      height: 500px;
      margin: 0 auto;
      transform-origin: 9px 204px;
  }
  .modal-content {
      position: relative;
      background-color: #fff;
      background-clip: padding-box;
      border: 0;
      border-radius: 2px;
      box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
      pointer-events: auto;
  }
  .modal-close {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
      padding: 0;
      color: #00000073;
      font-weight: 700;
      line-height: 1;
      text-decoration: none;
      background: transparent;
      border: 0;
      outline: 0;
      cursor: pointer;
      transition: color .3s;
  }
  .modal-close-x {
      display: block;
      width: 56px;
      height: 56px;
      font-size: 16px;
      font-style: normal;
      line-height: 56px;
      text-align: center;
      text-transform: none;
      text-rendering: auto;
  }
  .anticon {
      display: inline-block;
      color: inherit;
      font-style: normal;
      line-height: 0;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizelegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }
  .anticon:hover {
    color: #fb7299;
  }
  .modal-header {
      padding: 16px 24px;
      color: #000000d9;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      border-radius: 2px 2px 0 0;
  }
  .modal-title {
      margin: 0;
      color: #000000d9;
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      word-wrap: break-word;
  }
  .modal-body {
      padding: 24px;
      font-size: 14px;
      line-height: 1.5715;
      word-wrap: break-word;
  }
  .modal-footer {
      padding: 10px 16px;
      text-align: right;
      background: transparent;
      border-top: 1px solid #f0f0f0;
      border-radius: 0 0 2px 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  .btn {
      line-height: 1.5715;
      position: relative;
      display: inline-block;
      font-weight: 400;
      white-space: nowrap;
      text-align: center;
      background-image: none;
      border: 1px solid transparent;
      box-shadow: 0 2px #00000004;
      cursor: pointer;
      transition: all .3s cubic-bezier(.645,.045,.355,1);
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      touch-action: manipulation;
      height: 32px;
      padding: 4px 15px;
      font-size: 14px;
      border-radius: 2px;
      color: #000000d9;
      border-color: #d9d9d9;
      background: #fff;
      outline: 0;
  }
  .btn:hover {
    border-color: #e3e5e7!important;
    background-color: #e3e5e7!important;
  }
  .btn-primary {
      margin-left: 20px;
      color: #fff;
      border-color: #fb7299;
      background: #fb7299!important;
      text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
      box-shadow: 0 2px #0000000b;
  }
  .btn-primary:hover {
    border-color: #fc8bab!important;
    background-color: #fc8bab!important;
  }
  .modal-body {
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    justify-content: space-between;
    height: 300px;
    overflow-y: auto;
  }
  .modal-content-item {
    cursor: pointer;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16);
    padding: 0 12px;
    width: 45%;
    height: 60px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }
  .modal-content-item:hover {
    background-color: #efefef;
  }
  `)
})()
