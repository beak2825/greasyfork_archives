// ==UserScript==
// @name         Bilibili - 优化未登录情况下的移动网页端
// @namespace    https://bilibili.com/
// @version      1.1
// @description  优化未登录情况下的移动网页端的使用体验 | V1.1 优化处理视频第30秒处弹窗的方式
// @license      GPL-3.0
// @author       DD1969
// @match        https://m.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://update.greasyfork.org/scripts/475332/1250588/spark-md5.js
// @require      https://update.greasyfork.org/scripts/510239/1454424/viewer.js
// @require      https://update.greasyfork.org/scripts/524844/1702513/bilibili-mobile-comment-module.js
// @require      https://update.greasyfork.org/scripts/512576/1464552/inject-viewerjs-style.js
// @require      https://update.greasyfork.org/scripts/512574/1464548/inject-bilibili-comment-style.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/497732/Bilibili%20-%20%E4%BC%98%E5%8C%96%E6%9C%AA%E7%99%BB%E5%BD%95%E6%83%85%E5%86%B5%E4%B8%8B%E7%9A%84%E7%A7%BB%E5%8A%A8%E7%BD%91%E9%A1%B5%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/497732/Bilibili%20-%20%E4%BC%98%E5%8C%96%E6%9C%AA%E7%99%BB%E5%BD%95%E6%83%85%E5%86%B5%E4%B8%8B%E7%9A%84%E7%A7%BB%E5%8A%A8%E7%BD%91%E9%A1%B5%E7%AB%AF.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // no need to continue this script if user already logged in
  if (document.cookie.includes('DedeUserID')) return;

  const blacklist = [];

  // regular expressions
  const re = {
    home: /m\.bilibili\.com\/$|m\.bilibili\.com\/channel\/v\/.*/,
    video: /m\.bilibili\.com\/video\/.*/,
    search: /m\.bilibili\.com\/search.*/,
    space: /m\.bilibili\.com\/space\/.*/,
    dynamic: /m\.bilibili\.com\/dynamic\/.*/,
    opus: /m\.bilibili\.com\/opus\/.*/,
    topicDetail: /m\.bilibili\.com\/topic-detail.*/,
  }

  // make sure the document is ready
  await new Promise(resolve => {
    const timer = setInterval(() => {
      if (document.head && document.body) { clearInterval(timer); resolve(); }
    }, 50);
  });

  // search and remove elements constantly
  setupElementCleaner();

  // add style patch
  addStyle();

  // nav bar
  modifyNavBar();
  
  // home page
  if (re.home.test(window.location.href)) modifyHomePage();

  // video page
  if (re.video.test(window.location.href)) modifyVideoPage();

  // search page
  if (re.search.test(window.location.href)) modifySearchPage();

  // space page
  if (re.space.test(window.location.href)) modifySpacePage();

  // dynamic page
  if (re.dynamic.test(window.location.href)) modifyDynamicPage();
  
  // opus page
  if (re.opus.test(window.location.href)) modifyOpusPage();

  // topic detail page
  if (re.topicDetail.test(window.location.href)) modifyTopicDetailPage();

  // ------------ functions below ------------

  function setupElementCleaner() {
    const selectors = [];

    // home page
    if (re.home.test(window.location.href)) {
      selectors.push(...[
        '.m-nav-openapp',     // 右上角的"下载App"按钮
        '.m-navbar .face',    // 右上角的用户头像
        '.fixed-openapp',     // 首页底部的打开App横条
        '.v-card__stats',     // 视频卡片的数据信息
        '.reserve-float-btn', // 首页底部的浮动弹窗
      ]);
    }

    // video page
    if (re.video.test(window.location.href)) {
      selectors.push(...[
        '.m-nav-openapp',                                 // 右上角的"下载App"按钮
        '.m-navbar .face',                                // 右上角的用户头像
        '.video-natural-search .fixed-wrapper',           // 顶部遮挡video元素的整个区域
        '.m-video-related .list-custom-slot .m-open-app', // 相关视频底部的打开App横条
        '.openapp-dialog',                                // 底部弹出的"浏览方式"
        '.caution-dialog',                                // 底部弹出的"友情提示"
        '.play-page-gotop',                               // 回到顶部按钮
        '.reserve-float-btn',                             // 底部的浮动弹窗
        '.fixed-openapp',                                 // URL带'unique_k'参数时右下角才会出现的打开App按钮
        '.gsl-callapp-dom',                               // 视频模块中阻碍点击并唤起app的元素
        'm-open-app.m-video-main-launchapp',              // 从b23.tv打开时出现的打开App横条
        '.m-video-info',                                  // 从b23.tv打开时出现的视频标题、作者和简介
        '.bottom-tab-header',                             // 从b23.tv打开时出现的下方相关视频header
        '.m-video-part',                                  // 从b23.tv打开时出现的视频分P模块#1
        '.m-video-part-panel',                            // 从b23.tv打开时出现的视频分P模块#2
      ]);
    }

    // space page
    if (re.space.test(window.location.href)) {
      selectors.push(...[
        '.fixed-openapp',                   // 底部的打开App按钮
        '.bili-dyn-item-header__following', // 动态右上方的关注按钮
        '.dyn-orig-author__following',      // 转发的动态的作者的关注按钮
      ]);
    }

    // dynamic & opus page
    if (re.dynamic.test(window.location.href) || re.opus.test(window.location.href)) {
      selectors.push(...[
        '.fixed-openapp',                   // 底部的打开App横条
        '.dyn-header__following',           // 动态右上方的关注按钮
        '.dyn-share',                       // 若干分享按钮
        '.openapp-dialog',                  // 底部弹出的"浏览方式"
        '.reserve-float-btn',               // 底部的浮动弹窗
        '.opus-module-author__action',      // opus页右上角的关注按钮
        '.stat-openApp',                    // opus页(原专栏页)底部的stat模块
      ]);
    }

    // topic detail page
    if (re.topicDetail.test(window.location.href)) {
      selectors.push(...[
        '.m-topic-float-openapp', // 底部的打开App按钮
      ]);
    }

    // start cleaning
    setInterval(() => {
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach(element => element.remove());
      }
    }, 100);
  }

  function addStyle() {
    // nav bar
    const navBarCSS = document.createElement('style');
    navBarCSS.textContent = `
      .m-navbar {
        position: relative !important;
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        background: none !important;
        background-color: #FFFFFF !important;
        border-bottom: 1px solid #EEEEEE;
      }

      .nav-logo {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .nav-logo img {
        height: 60%;
      }

      .nav-search {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 200px;
        height: 28px;
        border: 1px solid #EEEEEE;
        border-radius: 16px;
      }

      .nav-search > svg {
        align-self: flex-end;
        margin-right: 8px;
      }
    `;
    document.head.appendChild(navBarCSS);

    // video page
    const videoPageCSS = document.createElement('style');
    videoPageCSS.textContent = `
      .video-share-loading-mask {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        z-index: 1999;
        background-color: #000000;
      }

      .video-share-loading-mask-circle {
        width: 30px;
        height: 30px;
        border: 2px solid #000000;
        border-top-color: #ffffff;
        border-right-color: #ffffff;
        border-bottom-color: #ffffff;
        border-radius: 100%;
        animation: circle infinite 0.75s linear;
      }

      @keyframes circle {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .m-video-player {
        position: relative !important;
        top: initial !important;
      }

      .video-info {
        display: flex;
        flex-direction: column;
        padding: 20px 12px;
      }

      .video-info-title {
        font-size: 1.2rem;
        word-break: break-all;
      }

      .video-info-author {
        display: flex;
        align-items: center;
        margin-top: 16px;
      }

      .video-info-author-avatar {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        border-radius: 100%;
      }

      .video-info-desc {
        color: #666666;
        font-size: 0.8rem;
        word-break: break-all;
      }

      .m-video-related {
        margin-top: 0 !important;
        padding: 24px 0;
        border-top: 1px dashed #aaa;
        border-bottom: 1px dashed #aaa;
      }

      .card-box {
        justify-content: space-between;
      }

      .card-box > .card {
        width: 49%;
      }

      .card-box .card .label,
      .card-box .card .open-app.weakened,
      .card-box .card .video-card .count {
        display: none !important;
      }

      .card-box .card .title {
        padding-top: 8px;
        padding-bottom: 16px;
        font-size: 0.8rem !important;
        word-break: break-all;
      }

      .gsl-top-return {
        transform: scale(0.5);
      }

      .gsl-buffer-app {
        display: none !important;
      }

      .gsl-control-btn.gsl-control-btn-quality {
        display: none !important;
      }

      .gsl-control-btn.gsl-control-btn-speed {
        display: flex !important;
      }

      .gsl-control-btn.gsl-control-btn-speed .gsl-control-dot {
        display: none !important;
      }

      .playback-rate-setting-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999999;
      }

      .playback-rate-option-container {
        width: 240px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 4px;
        user-select: none;
      }

      .playback-rate-option {
        width: 100%;
        margin-top: 2px;
        padding: 8px 0;
        color: #FFFFFF;
        background-color: #00AEEC;
        border-top: 1px solid #EEEEEE;
        border-radius: 4px;
        text-align: center;
      }

      .episode-container {
        display: flex;
        flex-direction: column;
        background-color: #f1f2f3;
      }

      .episode-container-header {
        display: flex;
        align-items: center;
        padding: 12px;
        padding-bottom: 10px;
      }

      .episode-container-header-count {
        margin-left: 4px;
        font-size: 0.8rem;
        font-family: monospace;
        color: #9499A0;
      }

      .episode-list {
        display: flex;
        flex-direction: column;
        padding: 12px;
        padding-top: 0;
      }

      .episode-list-item {
        display: flex;
        align-items: center;
        height: 36px;
        margin: 2px 0;
        padding: 2px 6px;
      }

      .episode-list-item.is-current-episode {
        background-color: #ffffff;
        color: #00AEEC;
        outline: 1px solid #7bdbfd;
        border-radius: 4px;
      }

      .episode-playing-gif {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;
        background-image: url('https://i0.hdslb.com/bfs/static/jinkela/playlist-video/asserts/playing.gif');
        background-repeat: no-repeat;
        background-size: 12px 12px;
        background-position: center;
      }

      .episode-list-item-title {
        max-width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 36px;
        font-size: 0.8rem;
      }

      .episode-list-item-duration {
        flex-grow: 1;
        text-align: right;
        font-size: 0.8rem;
        font-family: monospace;
        color: #9499A0;
      }

      #video-comment-module-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2000;
        display: none;
        width: 100vw;
        height: 100vh;
        background-color: #fff;
        overflow-x: hidden;
      }

      .close-comment-module-btn {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 2001;
        display: none;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        color: #fff;
        border-radius: 100%;
        background-color: #00AEEC;
      }

      .open-comment-module-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 12px 20px 12px;
        height: 40px;
        color: #fff;
        border-radius: 4px;
        background-color: #00AEEC;
      }
    `;
    document.head.appendChild(videoPageCSS);

    // space page
    const spacePageCSS = document.createElement('style');
    spacePageCSS.textContent = `
      .m-space-info {
        margin-top: 0 !important;
      }

      .bili-dyn-item {
        border-bottom: 1px solid #e7e7e7;
      }

      .video-item-space {
        box-sizing: border-box;
        margin-right: 3.2vmin;
        padding: 2.4vmin 0;
        height: 24.26667vmin;
        position: relative;
        display: block;
        border-bottom: 1px solid #ddd;
      }

      .video-item-space .cover {
        float: left;
        width: 31.2vmin;
        height: 19.46667vmin;
        position: relative;
        border-radius: 1.06667vmin;
        overflow: hidden;
      }

      .video-item-space .cover .duration {
        padding: 0 0.53333vmin;
        position: absolute;
        right: 1.06667vmin;
        bottom: 1.06667vmin;
        border-radius: 0.53333vmin;
        background: rgba(0,0,0,.5);
        font-size: 3.2vmin;
        color: #fff;
      }

      .video-item-space .info {
        margin-left: 34.4vmin;
        height: 19.46667vmin;
        position: relative;
      }

      .video-item-space .info .title {
        max-height: 9.06667vmin;
        font-size: 3.73333vmin;
        color: #212121;
        line-height: 4.53333vmin;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .video-item-space .info .state {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 2.66667vmin;
        color: #999;
        line-height: 4.53333vmin;
        height: 4.53333vmin;
      }

      .video-item-space .info .state .view,
      .video-item-space .info .state .danmaku {
        display: flex;
        align-items: center;
      }

      .video-item-space .info .state .danmaku {
        margin-left: 7.73333vmin;
      }

      .video-item-space .info .state .icon {
        margin-right: 1.06667vmin;
      }
    `;
    document.head.appendChild(spacePageCSS);

    // opus page
    const opusPageCSS = document.createElement('style');
    opusPageCSS.textContent = `
      .show-read-text {
        max-height: initial !important;
      }
    `;
    document.head.appendChild(opusPageCSS);

    // topic detail page
    const topicDetailPageCSS = document.createElement('style');
    topicDetailPageCSS.textContent = `
      .topic-detail-container {
        top: 0 !important;
      }
    `;
    document.head.appendChild(topicDetailPageCSS);
  }

  async function modifyNavBar() {
    const timer = setInterval(() => {
      const navBarElement = document.querySelector('.m-navbar');
      if (navBarElement) {
        const parentElement = navBarElement.parentElement;
        if (parentElement.tagName === 'M-OPEN-APP') {
          parentElement.insertAdjacentElement('beforebegin', navBarElement);
          parentElement.remove();
        }

        navBarElement.__vue__.$destroy();
        navBarElement.innerHTML = `
          <a class="nav-logo" href="/"><img src="https://i1.hdslb.com/bfs/static/jinkela/long/mstation/logo-bilibili-pink.png" /></a>
          <a class="nav-search" href="/search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#CCCCCC" d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path></svg>
          </a>
        `;
        clearInterval(timer);
      }
    }, 100);
  }

  async function modifyHomePage() {
    // modify video card
    setInterval(() => {
      document.querySelectorAll('.card-box .v-card:not(.modified)').forEach(card => {
        // blacklist check
        const cardTitle = card.querySelector('.v-card__title');
        if (blacklist.some(keyword => cardTitle.textContent.includes(keyword))) { card.remove(); return; }

        // rewrite behavior when video card being clicked
        if (card.__vue__?.bvid && card.__vue__?.$destroy) {
          const bvid = card.__vue__.bvid;
          card.onclick = () => window.location.href = `https://m.bilibili.com/video/${bvid}`;
          card.__vue__.$destroy();
          card.querySelector('.sleepy')?.classList.remove('sleepy');
          card.classList.add('modified');
        }
      });
    }, 100);
  }

  async function modifyVideoPage() {
    // show hidden video player
    const videoShare = await new Promise(resolve => {
      const timer = setInterval(() => {
        const videoShare = document.querySelector('.video-share');
        if (videoShare) {
          videoShare.style.display = 'block';
          videoShare.style.position = 'relative';
          clearInterval(timer);
          resolve(videoShare);
        }
      }, 100);
    });

    // add loading mask
    const loadingMask = document.createElement('div');
    loadingMask.classList.add('video-share-loading-mask');
    loadingMask.innerHTML = '<span class="video-share-loading-mask-circle"></span>';
    videoShare.appendChild(loadingMask);

    // show loading mask when video share being clicked, but only once
    const videoShareOnClickHandler = () => {
      videoShare.removeEventListener('click', videoShareOnClickHandler);
      loadingMask.style.display = 'flex';

      // hide the loading mask after the video start playing
      const timer = setInterval(() => {
        const progressBar = videoShare.querySelector('.gsl-ui-progress-bar');
        if (progressBar && progressBar.style.width && progressBar.style.width !== '0%') {
          clearInterval(timer);
          loadingMask.style.display = 'none';
          document.querySelector('.gsl-poster')?.remove();
        }
      }, 50);
    }
    videoShare.addEventListener('click', videoShareOnClickHandler);

    // get video info
    const videoID = window.location.pathname.replace('/video/', '');
    let param;
    if (videoID.startsWith('av')) param = `aid=${videoID.replace('av', '')}`;
    if (videoID.startsWith('BV')) param = `bvid=${videoID}`;
    const videoInfo = await fetch(`https://api.bilibili.com/x/web-interface/view?${param}`).then(res => res.json()).then(json => json.data);

    // add info
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('video-info');
    infoContainer.innerHTML = `
      <div class="video-info-title">${videoInfo.title}</div>
      <a class="video-info-author" href="https://m.bilibili.com/space/${videoInfo.owner.mid}">
        <img class="video-info-author-avatar" src="${videoInfo.owner.face}">
        <span class="video-info-author-name">${videoInfo.owner.name}</span>
      </a>
      <div class="video-info-desc" ${videoInfo.desc ? 'style="margin-top: 16px;"' : ''}>${videoInfo.desc.replaceAll('\n', '<br>').replaceAll(/BV[1-9A-HJ-NP-Za-km-z]{10}|av\d+/g, (match) => `<a style="color: #00AEEC" href="https://m.bilibili.com/video/${match}">${match}</a>`)}</div>
    `;
    document.querySelector('.video-share').insertAdjacentElement('afterend', infoContainer);

    // add comment module wrapper
    const commentModuleWrapper = document.createElement('div');
    commentModuleWrapper.id = 'video-comment-module-wrapper';
    document.body.appendChild(commentModuleWrapper);
    MobileCommentModule.init(commentModuleWrapper);

    // add button to close comment module
    const closeCommentModuleBtn = document.createElement('span');
    closeCommentModuleBtn.classList.add('close-comment-module-btn');
    closeCommentModuleBtn.textContent = '×';
    closeCommentModuleBtn.onclick = function () {
      // trigger 'popstate' event
      window.history.back();
    }
    document.body.appendChild(closeCommentModuleBtn);
    
    // add button to open comment module
    const openCommentModuleBtn = document.createElement('div');
    openCommentModuleBtn.classList.add('open-comment-module-btn');
    openCommentModuleBtn.textContent = '查看评论';
    openCommentModuleBtn.onclick = function () {
      commentModuleWrapper.style.display = 'block';
      closeCommentModuleBtn.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // push state in history
      window.history.pushState({}, '');

      // close comment module when 'popstate' event triggered
      const popStateHandler = () => {
        commentModuleWrapper.style.display = 'none';
        closeCommentModuleBtn.style.display = 'none';
        document.body.style.overflow = 'initial';
        document.querySelectorAll('.reply-item .preview-image-container').forEach(item => item.viewer?.hide(true));
        window.removeEventListener('popstate', popStateHandler);
      }
      window.addEventListener('popstate', popStateHandler);
    }
    infoContainer.insertAdjacentElement('afterend', openCommentModuleBtn);

    // add episodes
    const partNum = parseInt((new URLSearchParams(window.location.search)).get('p') || '1');
    const episodeContainer = document.createElement('div');
    episodeContainer.classList.add('episode-container');
    if (videoInfo.pages.length > 1) {
      episodeContainer.innerHTML = `
        <div class="episode-container-header">
          <span>视频选集</span>
          <span class="episode-container-header-count">(${partNum}/${videoInfo.pages.length})</span>
        </div>
        <div class="episode-list">
          ${
            videoInfo.pages.map((page, index) => {
              const isCurrentEpisode = partNum === index + 1;
              const second = page.duration % 60;
              const minute = (page.duration - second) / 60 % 60;
              const hour = Math.floor(page.duration / 3600);
              const formattedDuration =  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
              return `
                <a class="episode-list-item ${isCurrentEpisode ? 'is-current-episode' : ''}" ${isCurrentEpisode ? '' : `href="${window.location.pathname}?p=${index + 1}"`}>
                  ${isCurrentEpisode ? '<span class="episode-playing-gif"></span>' : ''}
                  <span class="episode-list-item-title">${page.part}</span>
                  <span class="episode-list-item-duration">${formattedDuration}</span>
                </a>
              `;
            }).join('')
          }
        </div>
      `;
    }
    openCommentModuleBtn.insertAdjacentElement('afterend', episodeContainer);

    // move .bottom-tab to where it should be, usually happens when page open by b23.tv short url
    const bottomTab = document.querySelector('.video-share > .bottom-tab');
    if (bottomTab) episodeContainer.insertAdjacentElement('afterend', bottomTab);

    // modify video card
    setInterval(() => {
      // move the video card out of <m-open-app>
      document.querySelectorAll('.card-box > m-open-app').forEach(item => {
        const href = item.getAttribute('universallink').replace('.html?', '');
        item.outerHTML = item.querySelector('.card').outerHTML.replace('class="card"', `class="card" data-href="${href}"`).replaceAll('sleepy', '');
      });

      // setup click event
      document.querySelectorAll('.card-box > .card:not(.modified)').forEach(item => {
        // blacklist check
        const cardTitle = item.querySelector('.title');
        if (blacklist.some(keyword => cardTitle.textContent.includes(keyword))) { item.remove(); return; }

        item.classList.add('modified');
        item.dataset.href = item.dataset.href.split('trackid=').shift();
        item.onclick = () => window.location.href = item.dataset.href;
      });
    }, 100);

    // modify playback rate button
    const timer4PlaybackRateBtn = setInterval(() => {
      const playbackRateBtn = document.querySelector('.gsl-control .gsl-control-btn-speed');
      if (playbackRateBtn) {
        playbackRateBtn.onclick = () => {
          const maskElement = document.createElement('div');
          maskElement.classList.add('playback-rate-setting-panel');
          maskElement.innerHTML = `
            <div class="playback-rate-option-container">
              <span style="margin-bottom: 6px; padding: 6px 0;">播放倍速</span>
              <span class="playback-rate-option" data-rate="5">5.0x</span>
              <span class="playback-rate-option" data-rate="3">3.0x</span>
              <span class="playback-rate-option" data-rate="2">2.0x</span>
              <span class="playback-rate-option" data-rate="1.5">1.5x</span>
              <span class="playback-rate-option" data-rate="1">1.0x</span>
              <span class="playback-rate-option" data-rate="0.5">0.5x</span>
            </div>
          `;
    
          maskElement
            .querySelectorAll('.playback-rate-option')
            .forEach(optionElement => optionElement.addEventListener('click', function() {
              const videoElement = document.querySelector('#bilibiliPlayer video');
              if (videoElement) videoElement.playbackRate = parseFloat(this.dataset.rate);
            }));
          
          maskElement.onclick = () => maskElement.remove();
    
          (document.querySelector('#bilibiliPlayer .gsl-area.gsl-wide') || document.body).appendChild(maskElement);
        }

        clearInterval(timer4PlaybackRateBtn);
      }
    }, 100);

    // enable fullscreen button
    const timer4FullscreenBtn = setInterval(() => {
      const info = window?.player?.developer?.store?.state?.setting?.mStationSetting?.fullBtnCallAppInfo;
      if (info) {
        info.enable = false;
        clearInterval(timer4FullscreenBtn);
      }
    }, 100);

    // modify ending panel of video
    const timer4EndingPanel = setInterval(async () => {
      const endingPanel = document.querySelector('.gsl-end.gsl-show .gsl-ending-panel-video');
      if (endingPanel) {
        clearInterval(timer4EndingPanel);

        // clean click events
        endingPanel.innerHTML = `
          <div class="gsl-ending-panel-video">
            <div class="gsl-ending-panel-pic">
              <img />
            </div>
            <div class="gsl-ending-panel-content">
              <div class="gsl-ending-panel-title"></div>
              <div class="gsl-ending-panel-button">点击打开</div>
            </div>
          </div>
        `;

        // get related video data
        const relatedVideoData = await fetch(`https://api.bilibili.com/x/web-interface/archive/related?bvid=${videoInfo.bvid}`).then(res => res.json()).then(json => json.data);

        // start showing
        let currentIndex;
        const currentVideoCover = endingPanel.querySelector('.gsl-ending-panel-pic img');
        const currentVideoTitle = endingPanel.querySelector('.gsl-ending-panel-title');
        const showRelatedVideo = () => {
          currentIndex = Math.floor(Math.random() * relatedVideoData.length);
          currentVideoCover.src = relatedVideoData[currentIndex].pic + '@460w_280h.webp';
          currentVideoTitle.textContent = relatedVideoData[currentIndex].title;
        }
        showRelatedVideo();
        setInterval(showRelatedVideo, 5 * 1000);

        // setup click event
        endingPanel.onclick = () => window.location.href = `https://m.bilibili.com/video/${relatedVideoData[currentIndex].bvid}`;
      }
    }, 100);

    // modify charge video page
    const timer4ChargeMask = setInterval(() => {
      const mask = document.querySelector('.m-video-player m-open-app.charge-mask');
      if (mask) {
        mask.outerHTML = mask.outerHTML.replace('<m-open-app', '<div').replace('</m-open-app>', '</div>');
      }
    }, 100);
    setTimeout(() => clearInterval(timer4ChargeMask), 3 * 1000);

    // handle the popup dialog at 00:30
    const timer4PlayerStoreEmit = setInterval(() => {
      const originEmit = window?.player?.videoEvents?.store?.emit;
      if (originEmit) {
        window.player.videoEvents.store.emit = function () {
          if (arguments[0] === 'video_progress_update') arguments[1] = { currentTime: 1.234 };
          return originEmit.apply(this, arguments);
        }
        clearInterval(timer4PlayerStoreEmit);
      }
    }, 100);
  }

  async function modifySearchPage() {
    // modify cancel button
    const timer4CancelBtn = setInterval(() => {
      const cancelBtn = document.querySelector('.m-search-search-bar .cancel');
      if (cancelBtn) {
        cancelBtn.outerHTML = cancelBtn.outerHTML.replace('class="cancel"', 'class="cancel" href="/"');
        clearInterval(timer4CancelBtn);
      }
    }, 100);

    // modify video card
    setInterval(() => {
      document.querySelectorAll('.card-box .v-card-single:not(.vue-destroyed)').forEach(card => {
        // blacklist check
        const cardTitle = card.querySelector('.info .title');
        const cardAuthor = card.querySelector('.info .author');
        if (blacklist.some(keyword => cardTitle.textContent.includes(keyword) || cardAuthor.textContent.includes(keyword))) { card.remove(); return; }

        const aid = card.dataset.aid;

        // remove card which leading to live streaming
        if (aid === '0') { card.remove(); return; }

        // cancel default actions
        card.classList.add('vue-destroyed');
        card.__vue__.$destroy();

        // setup click event
        card.onclick = () => window.location.href = `https://m.bilibili.com/video/av${aid}`;

        // show covers
        card.querySelector('.sleepy')?.classList.remove('sleepy');
      });
    }, 100);

    // modify user card
    setInterval(() => {
      document.querySelectorAll('.card-box a.m-search-user-item:not(.vue-destroyed)').forEach(card => {
        card.classList.add('vue-destroyed');
        card.__vue__.$destroy();
        card.href = card.href.replace('?from=search', '');
        card.querySelector('.sleepy')?.classList.remove('sleepy');
      });
    }, 100);
  }

  async function modifySpacePage() {
    // setup click event on user avatar if live streaming
    const timer4LiveStreaming = setInterval(() => {
      const face = document.querySelector('.m-space-info .info-main .face:not(.modified):has(.living-wrapper)');
      const liveRoomID = window.__INITIAL_STATE__?.space?.info?.live_room?.roomid;
      if (face && liveRoomID) {
        face.classList.add('modified');
        face.onclick = () => window.location.href = `https://live.bilibili.com/${liveRoomID}`;
      }
    }, 100);
    setTimeout(() => clearInterval(timer4LiveStreaming), 3 * 1000);

    // deactivate follow button
    const timer4FollowBtn = setInterval(() => {
      const followBtn = document.querySelector('.m-space-info .follow-btn');
      if (followBtn) {
        followBtn.__vue__.$destroy();
        clearInterval(timer4FollowBtn);
      }
    }, 100);
    
    // modify dynamic items
    setInterval(() => {
      document.querySelectorAll('.dynamic-list .list-scroll-content-wrap > m-open-app').forEach(item => {
        const dynItem = item.querySelector('.bili-dyn-item');
        dynItem.onclick = () => window.location.href = item.getAttribute('universallink');
        item.insertAdjacentElement('beforebegin', dynItem);
        item.remove();
      });
    }, 100);

    // modify archive list
    const timer4ArchiveList = setInterval(async () => {
      const archiveList = document.querySelector('.archive-list');
      if (archiveList) {
        clearInterval(timer4ArchiveList);

        // get user id
        const mid = window.location.pathname.replace('/space/', '');

        const getPaginationData = async (pn) => {
          const params = { mid, pn, ps: 50, order: 'senddate', wts: Math.floor(Date.now() / 1000) };
          return fetch(`https://api.bilibili.com/x/space/wbi/arc/search?${await getWbiQueryString(params)}`, { credentials: 'include' }).then(res => res.json()).then(json => json.data.list?.vlist || []);
        };

        const getVideoItem = (videoData) => {
          return `
            <a href="/video/${videoData.bvid}" class="video-item-space">
              <div class="cover">
                <div class="bfs-img-wrap">
                  <div class="bfs-img b-img">
                    <img class="b-img__inner" src="${videoData.pic}@468w_292h_1c.webp" alt="${videoData.title}">
                  </div>
                </div>
                <span class="duration">${videoData.length}</span>
              </div>
              <div class="info">
                <h3 class="title">${videoData.title}</h3>
                <div class="state">
                  <span class="view">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" width="16" height="16" style="width: 16px; height: 16px;"><path d="M8 3.3320333333333334C6.321186666666667 3.3320333333333334 4.855333333333333 3.4174399999999996 3.820593333333333 3.5013466666666666C3.1014733333333333 3.5596599999999996 2.5440733333333334 4.109013333333333 2.48 4.821693333333333C2.4040466666666664 5.666533333333334 2.333333333333333 6.780666666666666 2.333333333333333 7.998666666666666C2.333333333333333 9.216733333333334 2.4040466666666664 10.330866666666665 2.48 11.175699999999999C2.5440733333333334 11.888366666666666 3.1014733333333333 12.437733333333334 3.820593333333333 12.496066666666666C4.855333333333333 12.579933333333333 6.321186666666667 12.665333333333333 8 12.665333333333333C9.678999999999998 12.665333333333333 11.144933333333334 12.579933333333333 12.179733333333333 12.496033333333333C12.898733333333332 12.4377 13.456 11.888533333333331 13.520066666666667 11.176033333333333C13.595999999999998 10.331533333333333 13.666666666666666 9.217633333333332 13.666666666666666 7.998666666666666C13.666666666666666 6.779766666666667 13.595999999999998 5.665846666666667 13.520066666666667 4.821366666666666C13.456 4.108866666666666 12.898733333333332 3.55968 12.179733333333333 3.5013666666666663C11.144933333333334 3.417453333333333 9.678999999999998 3.3320333333333334 8 3.3320333333333334zM3.7397666666666667 2.50462C4.794879999999999 2.41906 6.288386666666666 2.3320333333333334 8 2.3320333333333334C9.7118 2.3320333333333334 11.2054 2.4190733333333334 12.260533333333331 2.5046399999999998C13.458733333333331 2.6018133333333333 14.407866666666665 3.5285199999999994 14.516066666666667 4.73182C14.593933333333332 5.597933333333334 14.666666666666666 6.7427 14.666666666666666 7.998666666666666C14.666666666666666 9.2547 14.593933333333332 10.399466666666665 14.516066666666667 11.2656C14.407866666666665 12.468866666666665 13.458733333333331 13.395566666666667 12.260533333333331 13.492766666666665C11.2054 13.578333333333333 9.7118 13.665333333333333 8 13.665333333333333C6.288386666666666 13.665333333333333 4.794879999999999 13.578333333333333 3.7397666666666667 13.492799999999999C2.541373333333333 13.395599999999998 1.5922066666666668 12.468633333333333 1.4840200000000001 11.265266666666665C1.4061199999999998 10.3988 1.3333333333333333 9.253866666666667 1.3333333333333333 7.998666666666666C1.3333333333333333 6.743533333333333 1.4061199999999998 5.598579999999999 1.4840200000000001 4.732153333333333C1.5922066666666668 3.5287466666666667 2.541373333333333 2.601793333333333 3.7397666666666667 2.50462z" fill="currentColor"></path><path d="M9.8092 7.3125C10.338433333333333 7.618066666666666 10.338433333333333 8.382 9.809166666666666 8.687533333333333L7.690799999999999 9.910599999999999C7.161566666666666 10.216133333333332 6.5 9.8342 6.500006666666666 9.223066666666666L6.500006666666666 6.776999999999999C6.500006666666666 6.165873333333334 7.161566666666666 5.783913333333333 7.690799999999999 6.089479999999999L9.8092 7.3125z" fill="currentColor"></path></svg>
                    <span>${videoData.play < 10000 ? videoData.play : (parseInt(videoData.play) / 10000).toFixed(1) + '万'}</span>
                  </span>
                  <span class="danmaku">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" width="16" height="16" style="width: 16px; height: 16px;"><path d="M8 3.3320333333333334C6.321186666666667 3.3320333333333334 4.855333333333333 3.4174399999999996 3.820593333333333 3.5013466666666666C3.1014733333333333 3.5596599999999996 2.5440733333333334 4.109013333333333 2.48 4.821693333333333C2.4040466666666664 5.666533333333334 2.333333333333333 6.780666666666666 2.333333333333333 7.998666666666666C2.333333333333333 9.216733333333334 2.4040466666666664 10.330866666666665 2.48 11.175699999999999C2.5440733333333334 11.888366666666666 3.1014733333333333 12.437733333333334 3.820593333333333 12.496066666666666C4.855333333333333 12.579933333333333 6.321186666666667 12.665333333333333 8 12.665333333333333C9.678999999999998 12.665333333333333 11.144933333333334 12.579933333333333 12.179733333333333 12.496033333333333C12.898733333333332 12.4377 13.456 11.888533333333331 13.520066666666667 11.176033333333333C13.595999999999998 10.331533333333333 13.666666666666666 9.217633333333332 13.666666666666666 7.998666666666666C13.666666666666666 6.779766666666667 13.595999999999998 5.665846666666667 13.520066666666667 4.821366666666666C13.456 4.108866666666666 12.898733333333332 3.55968 12.179733333333333 3.5013666666666663C11.144933333333334 3.417453333333333 9.678999999999998 3.3320333333333334 8 3.3320333333333334zM3.7397666666666667 2.50462C4.794879999999999 2.41906 6.288386666666666 2.3320333333333334 8 2.3320333333333334C9.7118 2.3320333333333334 11.2054 2.4190733333333334 12.260533333333331 2.5046399999999998C13.458733333333331 2.6018133333333333 14.407866666666665 3.5285199999999994 14.516066666666667 4.73182C14.593933333333332 5.597933333333334 14.666666666666666 6.7427 14.666666666666666 7.998666666666666C14.666666666666666 9.2547 14.593933333333332 10.399466666666665 14.516066666666667 11.2656C14.407866666666665 12.468866666666665 13.458733333333331 13.395566666666667 12.260533333333331 13.492766666666665C11.2054 13.578333333333333 9.7118 13.665333333333333 8 13.665333333333333C6.288386666666666 13.665333333333333 4.794879999999999 13.578333333333333 3.7397666666666667 13.492799999999999C2.541373333333333 13.395599999999998 1.5922066666666668 12.468633333333333 1.4840200000000001 11.265266666666665C1.4061199999999998 10.3988 1.3333333333333333 9.253866666666667 1.3333333333333333 7.998666666666666C1.3333333333333333 6.743533333333333 1.4061199999999998 5.598579999999999 1.4840200000000001 4.732153333333333C1.5922066666666668 3.5287466666666667 2.541373333333333 2.601793333333333 3.7397666666666667 2.50462z" fill="currentColor"></path><path d="M10.583333333333332 7.166666666666666L6.583333333333333 7.166666666666666C6.307193333333332 7.166666666666666 6.083333333333333 6.942799999999999 6.083333333333333 6.666666666666666C6.083333333333333 6.390526666666666 6.307193333333332 6.166666666666666 6.583333333333333 6.166666666666666L10.583333333333332 6.166666666666666C10.859466666666666 6.166666666666666 11.083333333333332 6.390526666666666 11.083333333333332 6.666666666666666C11.083333333333332 6.942799999999999 10.859466666666666 7.166666666666666 10.583333333333332 7.166666666666666z" fill="currentColor"></path><path d="M11.583333333333332 9.833333333333332L7.583333333333333 9.833333333333332C7.3072 9.833333333333332 7.083333333333333 9.609466666666666 7.083333333333333 9.333333333333332C7.083333333333333 9.0572 7.3072 8.833333333333332 7.583333333333333 8.833333333333332L11.583333333333332 8.833333333333332C11.859466666666666 8.833333333333332 12.083333333333332 9.0572 12.083333333333332 9.333333333333332C12.083333333333332 9.609466666666666 11.859466666666666 9.833333333333332 11.583333333333332 9.833333333333332z" fill="currentColor"></path><path d="M5.25 6.666666666666666C5.25 6.942799999999999 5.02614 7.166666666666666 4.75 7.166666666666666L4.416666666666666 7.166666666666666C4.140526666666666 7.166666666666666 3.9166666666666665 6.942799999999999 3.9166666666666665 6.666666666666666C3.9166666666666665 6.390526666666666 4.140526666666666 6.166666666666666 4.416666666666666 6.166666666666666L4.75 6.166666666666666C5.02614 6.166666666666666 5.25 6.390526666666666 5.25 6.666666666666666z" fill="currentColor"></path><path d="M6.25 9.333333333333332C6.25 9.609466666666666 6.02614 9.833333333333332 5.75 9.833333333333332L5.416666666666666 9.833333333333332C5.140526666666666 9.833333333333332 4.916666666666666 9.609466666666666 4.916666666666666 9.333333333333332C4.916666666666666 9.0572 5.140526666666666 8.833333333333332 5.416666666666666 8.833333333333332L5.75 8.833333333333332C6.02614 8.833333333333332 6.25 9.0572 6.25 9.333333333333332z" fill="currentColor"></path></svg>
                    <span>${videoData.video_review}</span>
                  </span>
                </div>
              </div>
            </a>
          `;
        };

        const addAnchor = (container) => {
          const anchorElement = document.createElement('div');
          anchorElement.classList.add('anchor-for-loading');
          anchorElement.style = `margin-right: 3.2vmin; padding: 10vmin 0; text-align: center; font-size: 0.8rem; color: #61666d;`;
          anchorElement.textContent = '正在加载...';
          container.appendChild(anchorElement);

          let paginationCounter = 1;
          const ob = new IntersectionObserver(async (entries) => {
            if (!entries[0].isIntersecting) return;

            const newPaginationData = await getPaginationData(++paginationCounter);
            if (newPaginationData instanceof Array && newPaginationData.length === 0) {
              anchorElement.textContent = '所有投稿已加载完毕';
              ob.disconnect();
              return;
            }

            for (const videoData of newPaginationData) {
              anchorElement.insertAdjacentHTML('beforebegin', getVideoItem(videoData));
            }
          });

          ob.observe(anchorElement);
        };

        // get first pagination data
        const firstPaginationData = await getPaginationData(1);

        // return if there are no video archives
        if (firstPaginationData instanceof Array && firstPaginationData.length === 0) return;

        // clear archive list, then add video item
        archiveList.innerHTML = '';
        for (const videoData of firstPaginationData) {
          archiveList.insertAdjacentHTML('beforeend', getVideoItem(videoData));
        }

        // add anchor to the bottom
        addAnchor(archiveList);
      }
    }, 100);
  }

  async function modifyDynamicPage() {
    // if <m-open-app> still exists 1 second after opening the page, reload the page
    const noMoreOpenAppPromise = new Promise(resolve => {
      setTimeout(() => {
        if (document.querySelector('m-open-app')) window.location.reload();
        else resolve();
      }, 1000);
    });

    // get cleaned dynamic card
    const dynamicCard = await new Promise(resolve => {
      const timer = setInterval(() => {
        const dynamicCardWrapper = document.querySelector('m-open-app.card-wrap');
        if (dynamicCardWrapper) {
          clearInterval(timer);
          const dynamicCard = dynamicCardWrapper.querySelector('.dyn-card');
          dynamicCardWrapper.insertAdjacentElement('beforebegin', dynamicCard);
          dynamicCardWrapper.remove();
          resolve(dynamicCard);
        }
      }, 100);
    });

    // setup click event on author avatar and name
    const spaceURL = dynamicCard.querySelector('.dyn-header').dataset.url;
    dynamicCard.querySelector('.dyn-header .dyn-header__author__avatar').onclick = () => window.location.href = spaceURL;
    dynamicCard.querySelector('.dyn-header .dyn-header__author__name').onclick = () => window.location.href = spaceURL;

    // setup click event on topic(original or referenced)
    dynamicCard.querySelectorAll('.dyn-content .bili-dyn-topic').forEach(item => {
      item.onclick = () => window.location.href = item.dataset.url;
    });

    // setup click event on archive(original or referenced)
    dynamicCard.querySelectorAll('.dyn-content .dyn-archive').forEach(item => {
      item.onclick = () => window.location.href = `https://m.bilibili.com/video/${item.dataset.oid}`;
    });

    // setup click event on rich-text-topic
    dynamicCard.querySelectorAll('.dyn-content .bili-richtext .bili-rich-text-topic').forEach(item => {
      item.onclick = () => window.location.href = item.dataset.url;
    });

    // setup click event on rich-text-at
    dynamicCard.querySelectorAll('.dyn-content .bili-richtext .bili-rich-text-module.at').forEach(item => {
      item.onclick = () => window.location.href = `https://m.bilibili.com/space/${item.dataset.oid}`;
    });

    // setup click event on rich-text-link
    dynamicCard.querySelectorAll('.dyn-content .bili-richtext .bili-rich-text-link:not(.viewpic)').forEach(item => {
      item.onclick = () => window.location.href = item.dataset.url;
    });

    // setup click event on rich-text-link for viewing image
    const viewPicElements = dynamicCard.querySelectorAll('.dyn-content .bili-richtext .bili-rich-text-link.viewpic');
    if (viewPicElements.length > 0) {
      let code, dynamicDetail;
      const dynamicID = window.location.pathname.replace('/dynamic/', '');
      const parseResult = JSON.parse(window.localStorage.getItem('dynamicDetail'));
      if (parseResult && parseResult.data.item.id_str === dynamicID) {
        code = parseResult.code;
        dynamicDetail = parseResult.data;
      } else {
        const fetchResult = await fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${dynamicID}`).then(res => res.json());
        code = fetchResult.code;
        dynamicDetail = fetchResult.data;
        if (code === 0) window.localStorage.setItem('dynamicDetail', JSON.stringify(fetchResult));
      }

      if (code === 0) {
        const viewPicNodes = [].concat(
          dynamicDetail.item.modules?.module_dynamic?.desc?.rich_text_nodes?.filter(node => node.type === 'RICH_TEXT_NODE_TYPE_VIEW_PICTURE') || [],
          dynamicDetail.item.orig?.modules?.module_dynamic?.desc?.rich_text_nodes?.filter(node => node.type === 'RICH_TEXT_NODE_TYPE_VIEW_PICTURE') || [],
        );
        viewPicElements.forEach((viewPicElement, index) => {
          viewPicElement.insertAdjacentHTML('beforeend', `<div style="display: none;">${viewPicNodes[index].pics.map(pic => `<img src=${pic.src} />`).join('')}</div>`);
          const viewerInstance = new Viewer(viewPicElement, { title: false, toolbar: false, tooltip: false, keyboard: false });
          viewPicElement.onclick = () => viewerInstance.show();
        });
      }
    }

    // setup image viewer on pics-block
    dynamicCard.querySelectorAll('.dyn-content .bm-pics-block').forEach(item => {
      new Viewer(item, { title: false, toolbar: false, tooltip: false, keyboard: false, url: (image) => image.src.slice(0, image.src.lastIndexOf('@')) });
    });

    // setup click event on goods card
    dynamicCard.querySelectorAll('.dyn-content .dyn-goods .dyn-goods__card > [data-url]').forEach(item => {
      item.onclick = () => window.location.href = item.dataset.url;
    });

    // setup click event on goods list item
    dynamicCard.querySelectorAll('.dyn-content .dyn-goods .dyn-goods__card .dyn-goods__list__item > img').forEach(item => {
      item.onclick = () => window.location.href = item.dataset.url;
    });

    // setup click event on live card
    dynamicCard.querySelectorAll('.dyn-content .dyn-live__card').forEach(item => {
      item.onclick = () => window.location.href = item.dataset.url;
    });

    // setup click event on additional common card
    dynamicCard.querySelectorAll('.dyn-content .dyn-add-common').forEach(item => {
      item.onclick = () => window.location.href = item.dataset.url;
    });

    // setup click event on reference author
    const referenceAuthor = dynamicCard.querySelector('.dyn-content .reference .dyn-orig-author');
    if (referenceAuthor) {
      referenceAuthor.querySelector('.dyn-orig-author__following').remove();
      referenceAuthor.onclick = () => window.location.href = referenceAuthor.dataset.url;
    }

    // setup click event on reference article
    const referenceArticle = dynamicCard.querySelector('.dyn-content .reference .dyn-article');
    if (referenceArticle) {
      referenceArticle.onclick = async () => {
        let code, dynamicDetail;
        const dynamicID = window.location.pathname.replace('/dynamic/', '');
        const parseResult = JSON.parse(window.localStorage.getItem('dynamicDetail'));
        if (parseResult && parseResult.data.item.id_str === dynamicID) {
          code = parseResult.code;
          dynamicDetail = parseResult.data;
        } else {
          const fetchResult = await fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${dynamicID}`).then(res => res.json());
          code = fetchResult.code;
          dynamicDetail = fetchResult.data;
          if (code === 0) window.localStorage.setItem('dynamicDetail', JSON.stringify(fetchResult));
        }

        if (code === 0) {
          const jump_url = dynamicDetail.item.orig?.modules?.module_dynamic?.major?.article?.jump_url;
          if (jump_url) window.location.href = jump_url;
        }
      }
    }

    // setup comment module
    const timer4CommentModule = setInterval(() => {
      const wrapper = document.querySelector('.m-dynamic > .v-switcher');
      if (wrapper) {
        clearInterval(timer4CommentModule);
        wrapper.className = 'comment-module-wrapper';
        wrapper.style = `background-color: #fff; overflow-x: hidden;`;
        wrapper.innerHTML = '';
        noMoreOpenAppPromise.then(_ => MobileCommentModule.init(wrapper));
      }
    }, 100);
  }

  async function modifyOpusPage() {
    // if <m-open-app> still exists 1 second after opening the page, reload the page
    const noMoreOpenAppPromise = new Promise(resolve => {
      setTimeout(() => {
        if (document.querySelector('m-open-app')) window.location.reload();
        else resolve();
      }, 1000);
    });

    // get data of opus modules
    const opusModules = await new Promise(resolve => {
      const timer = setInterval(() => {
        const opusModules = window.__INITIAL_STATE__?.opus?.detail?.modules;
        if (opusModules instanceof Array && opusModules.length !== 0) {
          clearInterval(timer);
          resolve(opusModules);
        }
      }, 100);
    });

    // remove opus content read more limit
    const timer4OpusReadMoreLimit = setInterval(() => {
      document.querySelectorAll('.opus-module-content.limit').forEach(item => item.classList.remove('limit'));
      document.querySelectorAll('.opus-read-more').forEach(item => item.remove());
    }, 100);
    setTimeout(() => clearInterval(timer4OpusReadMoreLimit), 3 * 1000);

    // setup image viewer on top album
    document.querySelectorAll('.opus-module-top .opus-module-top__album').forEach(item => {
      let previousImageAmount = item.querySelectorAll('.v-swipe__item img').length;
      const viewerInstance = new Viewer(item, { title: false, toolbar: false, tooltip: false, keyboard: false, url: (image) => image.src.slice(0, image.src.lastIndexOf('@')) });
      setInterval(() => {
        const currentImageAmount = item.querySelectorAll('.v-swipe__item img').length;
        if (currentImageAmount > previousImageAmount) {
          previousImageAmount = currentImageAmount;
          viewerInstance.update();
        }
      }, 500);
    });

    // get cleaned author avatar and name
    const wrappedAuthorAvatar = document.querySelector('m-open-app.opus-module-author__avatar');
    const wrappedAuthorName = document.querySelector('m-open-app.opus-module-author__name');
    wrappedAuthorAvatar.outerHTML = wrappedAuthorAvatar.outerHTML.replace('<m-open-app', '<div').replace('</m-open-app', '</div');
    wrappedAuthorName.outerHTML = wrappedAuthorName.outerHTML.replace('<m-open-app', '<div').replace('</m-open-app', '</div');
    const authorAvatar = document.querySelector('.opus-module-author__avatar');
    authorAvatar.querySelector('.sleepy')?.classList.remove('sleepy');
    const authorName = document.querySelector('.opus-module-author__name');

    // setup click event on author avatar and name
    const authorData = opusModules.find(module => module.module_type === 'MODULE_TYPE_AUTHOR')?.module_author;
    authorAvatar.onclick = () => window.location.href = authorData.jump_url;
    authorName.onclick = () => window.location.href = authorData.jump_url;

    // clean and setup click event on topic
    const timer4Topic = setInterval(() => {
      const wrapper = document.querySelector('m-open-app.opus-module-topic');
      if (wrapper) {
        wrapper.outerHTML = wrapper.outerHTML.replace('<m-open-app', '<span').replace('</m-open-app', '</span');
        const jump_url = opusModules.find(module => module.module_type === 'MODULE_TYPE_TOPIC')?.module_topic?.jump_url;
        if (jump_url) document.querySelector('.opus-module-topic').onclick = () => window.location.href = jump_url;
      }
    }, 100);
    setTimeout(() => clearInterval(timer4Topic), 3 * 1000);

    // clean and setup click event on rich-text-at
    document.querySelectorAll('m-open-app > .opus-text-rich-hl.at').forEach(item => {
      const wrapper = item.parentElement;
      wrapper.insertAdjacentElement('beforebegin', item);
      wrapper.remove();
      const rid = opusModules.find(module => module.module_type === 'MODULE_TYPE_CONTENT')?.module_content?.paragraphs.find(paragraph => paragraph.para_type === 1)?.text?.nodes.find(node => node.type === 'TEXT_NODE_TYPE_RICH' && node?.rich?.type === 'RICH_TEXT_NODE_TYPE_AT' && node?.rich?.text === item.textContent)?.rich?.rid;
      if (rid) item.onclick = () => window.location.href = `https://m.bilibili.com/space/${rid}`;
    });

    // clean and setup click event on rich-text-topic
    document.querySelectorAll('m-open-app > .opus-text-rich-hl.topic').forEach((item, index) => {
      const wrapper = item.parentElement;
      wrapper.insertAdjacentElement('beforebegin', item);
      wrapper.remove();
      const jump_url = opusModules.find(module => module.module_type === 'MODULE_TYPE_CONTENT')?.module_content?.paragraphs.find(paragraph => paragraph.para_type === 1)?.text?.nodes.filter(node => node.type === 'TEXT_NODE_TYPE_RICH' && node?.rich?.type === 'RICH_TEXT_NODE_TYPE_TOPIC').at(index)?.rich?.jump_url;
      if (jump_url) item.onclick = () => window.location.href = jump_url;
    });

    // clean and setup click event on rich-text-link
    document.querySelectorAll('m-open-app > .opus-text-rich-hl.link').forEach((item, index) => {
      const wrapper = item.parentElement;
      wrapper.insertAdjacentElement('beforebegin', item);
      wrapper.remove();
      const jump_url = opusModules.find(module => module.module_type === 'MODULE_TYPE_CONTENT')?.module_content?.paragraphs.find(paragraph => paragraph.para_type === 1)?.text?.nodes.filter(node => node.type === 'TEXT_NODE_TYPE_RICH' && node?.rich?.type === 'RICH_TEXT_NODE_TYPE_WEB').at(index)?.rich?.jump_url;
      if (jump_url) item.onclick = () => window.location.href = jump_url;
    });

    // clean and setup click event on rich-text-goods
    document.querySelectorAll('m-open-app > .opus-text-rich-hl.goods').forEach((item, index) => {
      const wrapper = item.parentElement;
      wrapper.insertAdjacentElement('beforebegin', item);
      wrapper.remove();
      const jump_url = opusModules.find(module => module.module_type === 'MODULE_TYPE_CONTENT')?.module_content?.paragraphs.find(paragraph => paragraph.para_type === 1)?.text?.nodes.filter(node => node.type === 'TEXT_NODE_TYPE_RICH' && node?.rich?.type === 'RICH_TEXT_NODE_TYPE_GOODS').at(index)?.rich?.jump_url;
      if (jump_url) item.onclick = () => window.location.href = jump_url;
    });

    // clean rich-text-lottery
    document.querySelectorAll('m-open-app > .opus-text-rich-hl.lottery').forEach((item, index) => {
      const wrapper = item.parentElement;
      wrapper.insertAdjacentElement('beforebegin', item);
      wrapper.remove();
    });

    // setup image viewer on pics-block
    document.querySelectorAll('.opus-module-content .bm-pics-block').forEach(item => {
      const wrapper = item.parentElement;
      if (wrapper.tagName === 'M-OPEN-APP') {
        wrapper.insertAdjacentElement('beforebegin', item);
        wrapper.remove();
      }
      new Viewer(item, { title: false, toolbar: false, tooltip: false, keyboard: false, url: (image) => image.src.slice(0, image.src.lastIndexOf('@')) });
    });

    // clean reserve card and setup click event
    const timer4ReserveCard = setInterval(() => {
      const reserveCard = document.querySelector('m-open-app > .bm-link-card-reserve');
      if (reserveCard) {
        const wrapper = reserveCard.parentElement;
        wrapper.insertAdjacentElement('beforebegin', reserveCard);
        wrapper.remove();
        const jump_url = opusModules.find(module => module.module_type === 'MODULE_TYPE_CONTENT')?.module_content?.paragraphs.find(paragraph => paragraph.para_type === 6)?.link_card?.card?.reserve?.jump_url;
        if (jump_url) reserveCard.onclick = () => window.location.href = jump_url;
      }
    }, 100);
    setTimeout(() => clearInterval(timer4ReserveCard), 3 * 1000);

    // clean goods card and setup click event
    const timer4GoodsCard = setInterval(() => {
      const goodsCard = document.querySelector('m-open-app > .bm-link-card-goods');
      if (goodsCard) {
        const wrapper = goodsCard.parentElement;
        wrapper.insertAdjacentElement('beforebegin', goodsCard);
        wrapper.remove();
        goodsCard.querySelectorAll('.bm-link-card-goods__one[data-url]').forEach(item => {
          item.onclick = () => window.location.href = item.dataset.url;
        });
        goodsCard.querySelectorAll('.bm-link-card-goods__list__item img').forEach(item => {
          item.onclick = () => window.location.href = item.dataset.url;
        });
      }
    }, 100);
    setTimeout(() => clearInterval(timer4GoodsCard), 3 * 1000);

    // clean and setup click event on ugc card
    const timer4UgcCard = setInterval(() => {
      const ugcCard = document.querySelector('m-open-app > .bm-link-card-ugc');
      if (ugcCard) {
        const wrapper = ugcCard.parentElement;
        wrapper.insertAdjacentElement('beforebegin', ugcCard);
        wrapper.remove();
        const jump_url = opusModules.find(module => module.module_type === 'MODULE_TYPE_CONTENT')?.module_content?.paragraphs.find(paragraph => paragraph.para_type === 6)?.link_card?.card?.ugc?.jump_url;
        if (jump_url) ugcCard.onclick = () => window.location.href = jump_url;
      }
    }, 100);
    setTimeout(() => clearInterval(timer4UgcCard), 3 * 1000);

    // clean and setup click event on common card
    const timer4CommonCard = setInterval(() => {
      const commonCard = document.querySelector('m-open-app > .bm-link-card-common');
      if (commonCard) {
        const wrapper = commonCard.parentElement;
        wrapper.insertAdjacentElement('beforebegin', commonCard);
        wrapper.remove();
        commonCard.onclick = () => window.location.href = commonCard.dataset.url;
      }
    }, 100);
    setTimeout(() => clearInterval(timer4CommonCard), 3 * 1000);

    // setup comment module
    const timer4CommentModule = setInterval(() => {
      const wrapper = document.querySelector('.m-opus .v-switcher');
      if (wrapper) {
        clearInterval(timer4CommentModule);
        wrapper.className = 'comment-module-wrapper';
        wrapper.style = `background-color: #fff; overflow-x: hidden;`;
        wrapper.innerHTML = '';
        noMoreOpenAppPromise.then(_ => MobileCommentModule.init(wrapper));
      }
    }, 100);
  }

  async function modifyTopicDetailPage() {
    const timer4OpenApp = setInterval(() => {
      document.querySelectorAll('m-open-app').forEach(item => {
        item.outerHTML = item.outerHTML.replace('<m-open-app', '<div').replace('</m-open-app', '</div');
      });
    }, 100);
    setTimeout(() => clearInterval(timer4OpenApp), 3 * 1000);
  }

  async function getWbiQueryString(params) {
    // get origin key
    const { img_url, sub_url } = await fetch('https://api.bilibili.com/x/web-interface/nav').then(res => res.json()).then(json => json.data.wbi_img);
    const imgKey = img_url.slice(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.'));
    const subKey = sub_url.slice(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.'));
    const originKey = imgKey + subKey;

    // get mixin key
    const mixinKeyEncryptTable = [
      46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
      33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
      61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
      36, 20, 34, 44, 52
    ];
    const mixinKey = mixinKeyEncryptTable.map(n => originKey[n]).join('').slice(0, 32);

    // generate basic query string
    const query = Object
      .keys(params)
      .sort() // sort properties by key
      .map(key => {
        const value = params[key].toString().replace(/[!'()*]/g, ''); // remove characters !'()* in value
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&');
 
    // calculate wbi sign
    const wbiSign = SparkMD5.hash(query + mixinKey);

    return query + '&w_rid=' + wbiSign;
  }

})();