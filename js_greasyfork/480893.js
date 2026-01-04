// ==UserScript==
// @name         b站首页推荐纯享版-ES改
// @namespace    https://greasyfork.org/zh-CN/users/959369-ebonyspace
// @version      3.0.2
// @description  这是一个基于Waflare的清爽版b站首页脚本修改的脚本，可以使得首页只有首页推荐，你不再需要忍受bilibili繁复的首页，没有直播、番剧、电视剧、电影一系列让人眼花缭乱的版块，就一个首页推荐，让你能轻松的浏览，不再是只有顶部一小块窗口还不能往回找，错过了就无了，太草了！【bilibili、b站、哔哩哔哩、首页、清爽、推荐、关注列表】
// @author       Waflare，由ESplus修改
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from=*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bilibili.com&size=48
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.js
// @license      GPL
// @note         ----------------------------------------------------------------
// @note         相比原版的改动内容:
// @note         1.缩小了视频标题和其他部分文字的字体大小
// @note         2.鼠标光标悬停在封面或标题时将显示完整标题
// @note         3.合并首页推荐和关注列表的按钮并移至屏幕右侧
// @note         4.[※]移除了选择视频时长的按钮
// @downloadURL https://update.greasyfork.org/scripts/480893/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E7%BA%AF%E4%BA%AB%E7%89%88-ES%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/480893/b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E7%BA%AF%E4%BA%AB%E7%89%88-ES%E6%94%B9.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 获取首页推荐的数据
  function getFrontPage() {
    let url = 'https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3';
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: (r) => {
          if (JSON.parse(r.response).code !== 0) {
            resolve([]);
            return;
          }
          let result = JSON.parse(r.response).data.item;
          resolve(result);
        }
      })
    })
  }

  // 获取关注列表视频投稿的数据
  function getFollowPage() {
    let url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?type=video&timezone_offset=-480&features=itemOpusStyle`
    followedOffset && (url += `&offset=${followedOffset}`);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: (r) => {
          if (JSON.parse(r.response).code !== 0) {
            resolve([]);
            return;
          }
          if (parseInt(JSON.parse(r.response).data.offset)) {
            followedOffset = parseInt(JSON.parse(r.response).data.offset);
          }
          let result = JSON.parse(r.response).data.items;
          resolve(result);
        }
      })
    })
  }

  // 获取视频模板
  function getTemplate(item) {
    return `
      <a class='w_item' href='https://www.bilibili.com/video/${item.bvid}' target='_blank' id='${item.bvid}'>
        <div class='w_img_box'>
          <img src='${item.pic}' title='${item.title}'/>
          <div class="w_img_box__pubdate">${formatDate(item.pubdate)}</div>
          <div class="w_img_box__duration">${formatTime(item.duration)}</div>
        </div>
        <div class='w_footer'>
          <div class="w_face">
            <img src='${item.owner.face}' />
          </div>
          <div class='w_detail'>
            <div class='w_title' title='${item.title}'>${item.title}</div>
            <div class='w_up'>${item.owner.name}</div>
            <div class='w_stat'>
              <div>${formatNum(item.stat.view)}播放</div>
              <div>${formatNum(item.stat.like)}点赞</div>
            </div>
          </div>
        </div>
      </a>
    `
  }

  // 获取关注列表视频投稿的模板
  function getFollowedTemplate(item) {
    const modules = item.modules;
    const { face, name, pub_time } = modules.module_author;
    const { title, duration_text, cover, bvid, stat } = modules.module_dynamic.major.archive;
    return `
      <a class='w_item' href='https://www.bilibili.com/video/${bvid}' target='_blank' id='${bvid}'>
        <div class='w_img_box'>
          <img src='${cover}' title='${title}'/>
          <div class="w_img_box__pubdate">${pub_time}</div>
          <div class="w_img_box__duration">${duration_text}</div>
        </div>
        <div class='w_footer'>
          <div class="w_face">
            <img src='${face}' />
          </div>
          <div class='w_detail'>
            <div class='w_title' title='${title}'>${title}</div>
            <div class='w_up'>${name}</div>
            <div class='w_stat'>
              <div>${stat.danmaku}弹幕</div>
              <div>${stat.play}播放</div>
            </div>
          </div>
        </div>
      </a>
    `
  }

  function getVideoTypeControlTemplate() {
    return `
      <div id="w_video_type_control">
        <div id="w_video_type_control_content_mini">
          <span id="w_video_type_text"></span>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="transform: rotate(0deg);"><path d="M8.624933333333333 13.666666666666666C8.624933333333333 14.011849999999999 8.345125 14.291666666666666 7.999933333333333 14.291666666666666C4.525166666666666 14.291666666666666 1.7082933333333332 11.474791666666665 1.7082933333333332 8C1.7082933333333332 6.013308333333333 2.629825 4.2414233333333335 4.066321666666667 3.089385C4.335603333333333 2.8734283333333335 4.728959999999999 2.9166533333333335 4.944915 3.1859349999999997C5.160871666666666 3.4552099999999997 5.1176466666666665 3.848573333333333 4.848366666666666 4.0645283333333335C3.694975 4.98953 2.9582933333333328 6.40852 2.9582933333333328 8C2.9582933333333328 10.784416666666667 5.215528333333333 13.041666666666666 7.999933333333333 13.041666666666666C8.345125 13.041666666666666 8.624933333333333 13.321483333333333 8.624933333333333 13.666666666666666zM11.060475 12.810558333333333C10.844225000000002 12.541558333333331 10.887033333333335 12.148125 11.156041666666667 11.931875C12.306858333333333 11.006775 13.041599999999999 9.589424999999999 13.041599999999999 8C13.041599999999999 5.215561666666666 10.784408333333332 2.958333333333333 7.999933333333333 2.958333333333333C7.6548083333333325 2.958333333333333 7.374933333333333 2.6785083333333333 7.374933333333333 2.333333333333333C7.374933333333333 1.9881533333333332 7.6548083333333325 1.7083333333333333 7.999933333333333 1.7083333333333333C11.474725000000001 1.7083333333333333 14.291599999999999 4.525206666666667 14.291599999999999 8C14.291599999999999 9.984108333333333 13.372483333333332 11.753958333333332 11.939225 12.906125C11.670166666666663 13.122375 11.276725 13.079625 11.060475 12.810558333333333z" fill="currentColor"></path><path d="M1.375 3.4130866666666666C1.375 3.0679066666666666 1.654825 2.7880866666666666 2 2.7880866666666666L4.333333333333333 2.7880866666666666C4.862608333333333 2.7880866666666666 5.291666666666666 3.2171449999999995 5.291666666666666 3.7464199999999996L5.291666666666666 6.079753333333334C5.291666666666666 6.424928333333334 5.011841666666666 6.704736666666666 4.666666666666666 6.704736666666666C4.321491666666667 6.704736666666666 4.041666666666666 6.424928333333334 4.041666666666666 6.079753333333334L4.041666666666666 4.038086666666667L2 4.038086666666667C1.654825 4.038086666666667 1.375 3.7582616666666664 1.375 3.4130866666666666z" fill="currentColor"></path><path d="M14.625 12.5864C14.625 12.931591666666666 14.345183333333333 13.2114 14 13.2114L11.666666666666666 13.2114C11.137408333333335 13.2114 10.708333333333332 12.782383333333332 10.708333333333332 12.253066666666665L10.708333333333332 9.919733333333333C10.708333333333332 9.574608333333334 10.98815 9.294733333333333 11.333333333333332 9.294733333333333C11.678516666666667 9.294733333333333 11.958333333333332 9.574608333333334 11.958333333333332 9.919733333333333L11.958333333333332 11.9614L14 11.9614C14.345183333333333 11.9614 14.625 12.241275000000002 14.625 12.5864z" fill="currentColor"></path></svg>
        </div>
      </div>
    `
  }

  // 输入秒数，返回时分秒格式的时间
  function formatTime(time) {
    let hour = Math.floor(time / 3600);
    let minute = Math.floor((time - hour * 3600) / 60);
    let second = Math.floor(time - hour * 3600 - minute * 60);
    let result = '';
    if (hour > 0) {
      // 如果小时大于0，则显示小时，前面补0
      result += (hour < 10 ? '0' + hour : hour) + ':';
    }
    result += (minute < 10 ? '0' + minute : minute) + ':';
    result += (second < 10 ? '0' + second : second);
    return result;
  }

  // 格式化时间，输入时间戳（秒），如果是一周内的时间，则显示几天前，否则返回yyyy-mm-dd格式的时间
  function formatDate(time) {
    let now = new Date();
    let date = new Date(time * 1000);
    let diff = now.getTime() - date.getTime();
    let day = Math.floor(diff / (24 * 3600 * 1000));
    let hour = Math.floor(diff / (3600 * 1000));
    if (hour == 0) {
      return Math.floor(diff / (60 * 1000)) + '分钟前';
    } else if (day == 0) {
      return hour + '小时前';
    } else if (day < 7) {
      return day + '天前';
    } else {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
          month = "0" + month;
      }
      let dates = date.getDate();
      if (dates < 10) {
          dates = "0" + dates;
      }
      return year + '-' + month + '-' + dates;
    }
  }

  // 老版 b站
  async function formatData() {
    $('#internationalHeader').after(`
      <div id="w_body">
        <div id="w_content"></div>
        <div id="w_content__loading">
          <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
          <div id="w_content__loading_text"></div>
        </div>
      </div>
    `);
    $('#w_body').append(getVideoTypeControlTemplate());
    const videoType = window.localStorage.getItem('video-type') || 0;
    if (videoType == '1') {
      let data = []
      while (data.length < 20) {
        const res = await getFollowedVideoData();
        data.push(...res)
      }
      for (let item of data) {
        $('#w_content').append(getFollowedTemplate(item));
      }
    } else {
      let data = await getVideoData();
      console.log(data);
      for (let item of data) {
        $('#w_content').append(getTemplate(item));
      }
    }
    $('#w_body').append('<div id="w_btn">顶</div>');
    $('#w_btn').on('click', backTop);
  }

  // 新版 b站
  async function formatDataNew() {
    $('#i_cecream').after(`
      <div id="w_body">
        <div id="w_content"></div>
        <div id="w_content__loading">
          <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
          <div id="w_content__loading_text"></div>
        </div>
      </div>
    `);
    $('#w_body').append(getVideoTypeControlTemplate());
    const videoType = window.localStorage.getItem('video-type') || 0;
    if (videoType == '1') {
      let data = []
      while (data.length < 20) {
        const res = await getFollowedVideoData();
        data.push(...res)
      }
      for (let item of data) {
        $('#w_content').append(getFollowedTemplate(item));
      }
    } else {
      let data = await getVideoData();
      console.log(data);
      for (let item of data) {
        $('#w_content').append(getTemplate(item));
      }
    }
    $('#w_body').append('<div id="w_btn">顶</div>');
    $('#w_btn').on('click', backTop);
  }

  // 控制loading的显示和隐藏以及文案
  function setLoading(show, text = '') {
    $('#w_content__loading_text').text(text);
    if (show) {
      $('#w_content__loading').show();
    } else {
      $('#w_content__loading').hide();
    }
  }

  // 获取视频列表，入参size表示一次的视频数量
  async function getVideoData(size = 20) {
    let data = []
    const videoTimeRange = window.localStorage.getItem('video-time-range');
    const type = ['', '5分钟以下的', '5-10分钟的', '10-30分钟的', '30分钟以上的']
    const videoTimeRangeType = type[videoTimeRange - 1]
    setLoading(true, '正在获取' + videoTimeRangeType + '视频列表，请稍候...');
    while (data.length < size) {
      let res = await getFrontPage();
      if (res.length == 0) {
        break;
      }
      // res.duration 为视频时长，单位为秒，如果视频时长不在范围内，则跳过
      if (videoTimeRange) {
        switch (videoTimeRange) {
          case '1':
            break;
          case '2':
            res = res.filter(item => item.duration < 300);
            break;
          case '3':
            res = res.filter(item => item.duration >= 300 && item.duration < 600);
            break;
          case '4':
            res = res.filter(item => item.duration >= 600 && item.duration < 1800);
            break;
          case '5':
            res = res.filter(item => item.duration >= 1800);
            break;
        }
      }
      data.push(...res);
    }
    setLoading(false);
    const len = data.length - data.length % 5;
    return data.slice(0, len);
  }

  // 获取关注的视频列表
  let followedOffset = 0;
  async function getFollowedVideoData() {
    let data = [];
    const videoTimeRange = window.localStorage.getItem('video-time-range');
    const type = ['', '5分钟以下的', '5-10分钟的', '10-30分钟的', '30分钟以上的']
    const videoTimeRangeType = type[videoTimeRange - 1]
    setLoading(true, `正在获取${videoTimeRangeType}关注视频列表，请稍候...`);
    let res = await getFollowPage();
    if (res.length == 0) {
      setLoading(false);
      return
    }
    const duration = (item) => getSecond(item.modules.module_dynamic.major.archive.duration_text)
    switch (videoTimeRange) {
      case '1':
        break;
      case '2':
        res = res.filter(item => duration(item) < 300);
        break;
      case '3':
        res = res.filter(item => duration(item) >= 300 && duration(item) < 600);
        break;
      case '4':
        res = res.filter(item => duration(item) >= 600 && duration(item) < 1800);
        break;
      case '5':
        res = res.filter(item => duration(item) >= 1800);
        break;
    }
    data.push(...res);
    if (data.length == 0) {
      await getFollowedVideoData();
    }
    setLoading(false);
    return data;
  }

  // 输入hh:mm:ss或者mm:ss格式的时间，返回秒数
  function getSecond(time) {
    let arr = time.split(':');
    let result = 0;
    if (arr.length === 2) {
      result += parseInt(arr[0]) * 60;
      result += parseInt(arr[1]);
    } else {
      result += parseInt(arr[0]) * 3600;
      result += parseInt(arr[1]) * 60;
      result += parseInt(arr[2]);
    }
    return result;
  }

  let timer = null;
  function backTop() {
    let isSafari = /^(?=.Safari)(?!.Chrome)/.test(navigator.userAgent);
    if (isSafari) {
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        var oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          scrollTo(0, oTop - oTop / 8);
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });
    } else {
      scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  async function moreVideo() {
    const videoType = window.localStorage.getItem('video-type') || 0;
    if (videoType == '1') {
      let data = []
      while (data.length < 20) {
        const res = await getFollowedVideoData();
        data.push(...res)
      }
      for (let item of data) {
        $('#w_content').append(getFollowedTemplate(item));
      }
    } else {
      let data = await getVideoData();
      for (let item of data) {
        $('#w_content').append(getTemplate(item));
      }
    }
  }

  // 判断是否是新版
  function isNewOrOld() {
    return $('#i_cecream').length > 0;
  }

  // 给视频类型选择框绑定事件
  function bindVideoTypeEvent() {
    document.querySelectorAll('#w_video_type_control').forEach(item => {
      item.addEventListener('click', function (e) {
        let value = window.localStorage.getItem('video-type') || 0;
        window.localStorage.setItem('video-type', 1 - value);
        window.location.reload();
      })
    })
  }

  function handleTypeControlExpand(expand) {
      let mini = document.getElementById('w_video_type_control_content_mini');
      const videoType = window.localStorage.getItem('video-type') || 0;
      const type = ['首页推荐', '关注列表'];
      const videoTypeType = type[1 - videoType];
      let span = document.getElementById('w_video_type_text');
      span.innerText = videoTypeType;
      mini.style.display = 'block';
  }

  // 主函数
  function main() {
    if(isNewOrOld()){
      formatDataNew();
    } else {
      formatData();
    }
    const w_time_expand = window.localStorage.getItem('w_time_expand');
    const w_type_expand = window.localStorage.getItem('w_type_expand');
    if (w_time_expand == undefined) {
      window.localStorage.setItem('w_time_expand', 'true');
    }
    if (w_type_expand == undefined) {
      window.localStorage.setItem('w_type_expand', 'true');
    }
    handleTypeControlExpand(w_type_expand == 'true' ? 'false' : 'true');
    bindVideoTypeEvent();

    let timeout = null;
    window.onscroll = function () {
      //距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      //滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      //滚动条到底部的条件
      if (scrollTop + windowHeight >= scrollHeight - 10) {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
          moreVideo();
        }, 300);
      }

      const back_top = document.getElementById('w_btn');
      if (back_top === null) return;
      if (scrollTop > 20 && !isNewOrOld()) {
        back_top.style.display = 'block';
      } else {
        back_top.style.display = 'none';
      }
    }
  }

  function formatNum(num) {
    if (!num) {
      return '0';
    }
    if (num < 10000) {
      return num.toString();
    } else {
      return (num / 10000).toFixed(1).toString() + '万';
    }
  }

  // 执行主函数
  main();

  GM_addStyle(`
    body {
      background-color: #ffffff;
    }
    .international-home {
      min-height: 100vh;
    }
    .international-home .storey-box, .international-footer {
      display: none;
    }
    .international-home .first-screen {
      display: none;
    }
    .header-channel {
      display: none;
    }
    main, .bili-footer {
      display: none !important;
    }
    #w_body {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 40px;
      background-color: ${isNewOrOld() ? '#ffffff;' : '#f1f2f3;'}
    }
    #w_control, #w_video_type_control {
      position: fixed;
      z-index: 999;
      width: fit-content;
      padding: 12px;
      height: 116px;
      background-color: rgba(255,255,255,0.8);
      border-radius: 8px 0 0 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
      -webkit-backdrop-filter: blur(30px);
      backdrop-filter: blur(30px);
      transition: all 0.1s;
      cursor: pointer;
    }
    #w_control, #w_video_type_control:hover{
      background-color: rgba(240,240,240,0.85);
    }
    #w_control, #w_video_type_control:active{
      background-color: rgba(224,224,224,0.85);
      font-size: 13px;
    }
    #w_control {
      bottom: 20px;
      left: 0;
    }
    #w_video_type_control {
      top: 40%;
      right: -5px;
    }
    #w_control_title, #w_video_type_control_title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 20px;
      writing-mode: tb-rl;
      display: flex;
    }
    #w_content__loading {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100px;
      margin-top: 20px;
      margin-bottom: 80px;
      font-size: 14px;
      color: #999;
    }
    .w_control_item > label, .w_video_type_control_item > label {
      width: 100px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      padding: 0 10px;
      margin-right: 10px;
      text-align: center;
    }
    .w_control_item > label:hover, .w_video_type_control_item > label:hover {
      cursor: pointer;
      border-color: #ff6699;
    }
    .w_control_item > input, .w_video_type_control_item > input {
      display: none;
    }
    .w_control_item > input:checked + label, .w_video_type_control_item > input:checked + label {
      border-color: #ff6699;
      color: #ff6699;
    }

    @media screen and (max-width: 1870px) {
      #w_content {
        width: 1414px !important;
      }
      .w_item {
        width: 270px !important;
      }
    }

    @media screen and (max-width: 1654px) {
      #w_content {
        width: 1198px !important;
      }
      .w_item {
        width: 225px !important;
      }
    }

    @media screen and (max-width: 1438px) {
      #w_content {
        width: 999px !important;
      }
      .w_item {
        width: 186px !important;
      }
    }

    #w_content {
      margin-top: 24px;
      max-width: 1610px;
      display: flex;
      justify-content: flex-start;
      flex-flow: wrap;
    }
    .w_item {
      width: 310px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      transition:all 0.2s;
    }
    .w_item:hover {
      cursor: pointer;
      transform: scale(1.01);
    }
    .w_item > .w_img_box{
      position: relative;
      overflow: hidden;
      padding-top: 62.5%;
      border-radius: 6px;
      background-image: url('https://i.w3tt.com/2021/12/05/BAH9l.png') no-repeat;
    }
    .w_img_box > img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .w_img_box > .w_img_box__duration {
      position: absolute;
      bottom: 0px;
      right: 0px;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 2px 4px;
      border-radius: 3px;
    }
    .w_img_box > .w_img_box__pubdate {
      position: absolute;
      bottom: 0px;
      left: 0px;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 2px 4px;
      border-radius: 3px;
    }
    .w_item > .w_detail {
      width: 100%;
    }
    .w_footer {
      display: flex;
    }
    .w_footer > .w_face {
      width: 56px;
      padding: 10px;
      box-size: border-sizing;
    }
    .w_footer > .w_detail {
      flex: 1;
    }
    .w_face > img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .w_detail > .w_title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 14px;
      line-height: 1.3;
      border-top: 10px solid transparent;
      border-bottom: 5px solid transparent;
    }
    .w_detail > .w_up {
      font-size: 12px;
      color: #606060;
    }
    .w_detail > .w_stat {
      font-size: 12px;
      color: #606060;
      line-height: 18px;
      display: flex;
      justify-content: space-between;
    }
    #w_btn {
      display: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      line-height: 50px;
      font-size: 20px;
      text-align: center;
      color: #9999b2;
      font-weight: 600;
      background-color: #f6f9fa;
      position: fixed;
      bottom: 30px;
      right: 30px;
    }
    #w_btn:hover {
      cursor: pointer;
    }
    .palette-button-outer div[class="primary-btn"] {
      display: none;
    }
    .spinner {
      margin: 100px auto 30px;
      width: 50px;
      height: 60px;
      text-align: center;
      font-size: 10px;
    }
    .spinner > div {
      background-color: #67CF22;
      height: 100%;
      width: 6px;
      display: inline-block;
      -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
      animation: stretchdelay 1.2s infinite ease-in-out;
    }
    .spinner .rect2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }
    .spinner .rect3 {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }
    .spinner .rect4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }
    .spinner .rect5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }
    @-webkit-keyframes stretchdelay {
      0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
      20% { -webkit-transform: scaleY(1.0) }
    }
    @keyframes stretchdelay {
      0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
      }  20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
      }
    }
    #w_control_expand, #w_video_type_control_expand {
      margin-top: 10px;
      writing-mode: horizontal-tb;
      cursor: pointer;
      text-align: center;
    }
    #w_video_type_control_content_mini {
      width: 18px;
    }
    .palette-button-wrap .flexible-roll-btn[data-v-2c5d4ebf] {
      display: none;
    }
  `)
})();