// ==UserScript==
// @name         Bilibili - 在未登录的情况下照常加载评论
// @namespace    https://bilibili.com/
// @version      5.4
// @description  在未登录的情况下照常加载评论 | V5.4 修复缺少对子评论数据进行空值判断的问题
// @license      GPL-3.0
// @author       DD1969
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/cv*
// @match        https://www.bilibili.com/festival*
// @match        https://www.bilibili.com/list/*
// @match        https://manga.bilibili.com/detail/mc*
// @match        https://manga.bilibili.com/mc*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://update.greasyfork.org/scripts/510239/1454424/viewer.js
// @require      https://update.greasyfork.org/scripts/475332/1250588/spark-md5.js
// @require      https://update.greasyfork.org/scripts/512574/1464548/inject-bilibili-comment-style.js
// @require      https://update.greasyfork.org/scripts/512576/1464552/inject-viewerjs-style.js
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/473498/Bilibili%20-%20%E5%9C%A8%E6%9C%AA%E7%99%BB%E5%BD%95%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E7%85%A7%E5%B8%B8%E5%8A%A0%E8%BD%BD%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/473498/Bilibili%20-%20%E5%9C%A8%E6%9C%AA%E7%99%BB%E5%BD%95%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E7%85%A7%E5%B8%B8%E5%8A%A0%E8%BD%BD%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // no need to continue this script if user already logged in
  if (document.cookie.includes('DedeUserID')) return;

  // patch for 'unsafeWindow is not defined'
  const global = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

  // initialize options
  const options = {
    // 使用分页加载主评论
    enableReplyPagination: GM_getValue('enableReplyPagination', false),

    // 一次性加载所有子评论
    enableLoadAllSubRepliesAtOnce: GM_getValue('enableLoadAllSubRepliesAtOnce', false),

    // 显示用户头像边框
    enableAvatarPendent: GM_getValue('enableAvatarPendent', true),

    // 显示粉丝勋章
    enableFanMedal: GM_getValue('enableFanMedal', true),

    // 显示评论右上角的大航海装饰
    enableSailingDecoration: GM_getValue('enableSailingDecoration', true),

    // 显示"笔记"前缀
    enableNotePrefix: GM_getValue('enableNotePrefix', true),

    // 显示"热评"标签
    enableHotTag: GM_getValue('enableHotTag', true),

    // 显示"UP主觉得很赞"标签
    enableLikedTag: GM_getValue('enableLikedTag', true),

    // 显示大会员用户名的颜色为粉色
    enableVipUserNameColor: GM_getValue('enableVipUserNameColor', true),

    // 启用关键字搜索链接
    enableKeywordSearchLink: GM_getValue('enableKeywordSearchLink', true),
  }

  // RegExp
  const videoRE = /https:\/\/www\.bilibili\.com\/video\/.*/;
  const bangumiRE = /https:\/\/www\.bilibili\.com\/bangumi\/play\/.*/;
  const dynamicRE = /https:\/\/t\.bilibili\.com\/\d+/;
  const opusRE = /https:\/\/www\.bilibili\.com\/opus\/\d+/;
  const spaceRE = /https:\/\/space\.bilibili\.com\/\d+/;
  const articleRE = /https:\/\/www\.bilibili\.com\/read\/cv\d+.*/;
  const festivalRE = /https:\/\/www\.bilibili\.com\/festival\/.*/;
  const listRE = /https:\/\/www\.bilibili\.com\/list\/.*/;
  const mangaRE = /https:\/\/manga\.bilibili\.com\/detail\/mc\d+.*/;
  const mangaViewerRE = /https:\/\/manga\.bilibili\.com\/mc\d+\/\d+.*/;

  // essential data or elements
  let oid, createrID, commentType, replyList;

  // define sort types
  const sortTypeConstant = { LATEST: 0, HOT: 2 };
  let currentSortType;

  // offset data collector
  let offsetStore;

  // use to prevent loading duplicated main reply
  let replyPool;

  // ---------- variables above ----------

  // make comment buttons in dynamic page do their job
  if (spaceRE.test(global.location.href)) { setupCommentBtnModifier(); return; }

  // block official comment module from appending to DOM
  if (dynamicRE.test(global.location.href) || opusRE.test(global.location.href)) setupOfficialCommentModuleBlocker();

  // handle some special conditions in manga viewer page
  if (mangaViewerRE.test(global.location.href)) await setupMangaViewerCommentModuleHandler();

  // add style patch
  addStyle();

  // setup video change handler
  setupVideoChangeHandler();

  // setup setting panel & entry
  setupSettingPanel();
  setupSettingPanelEntry();

  // start loading comments
  start();

  // ---------- functions below ----------

  async function start() {
    // initialize
    oid = createrID = commentType = replyList = undefined;
    replyPool = {};
    currentSortType = sortTypeConstant.HOT;

    // setup standard comment container
    await setupStandardCommentContainer();

    // collect essential data or elements
    await new Promise(resolve => {
      const timer = setInterval(async () => {
        // collect oid, createrID, commentType
        if (videoRE.test(global.location.href)) {
          const videoID = global.location.pathname.replace('/video/', '').replace('/', '');
          if (videoID.startsWith('av')) oid = videoID.slice(2);
          if (videoID.startsWith('BV')) oid = b2a(videoID);
          createrID = global?.__INITIAL_STATE__?.upData?.mid;
          commentType = 1;
        } else if (bangumiRE.test(global.location.href)) {
          oid = b2a(document.querySelector('[class*=mediainfo_mediaDesc] a[href*="video/BV"]')?.textContent);
          createrID = document.querySelector('a[class*=upinfo_upLink]')?.href?.split('/').filter(item => !!item).pop() || -1;
          commentType = 1
        } else if (dynamicRE.test(global.location.href)) {
          const dynamicID = global.location.pathname.replace('/', '');
          const dynamicDetail = await fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${dynamicID}`).then(res => res.json());
          oid = dynamicDetail?.data?.item?.basic?.comment_id_str;
          commentType = dynamicDetail?.data?.item?.basic?.comment_type;
          createrID = dynamicDetail?.data?.item?.modules?.module_author?.mid;
        } else if (opusRE.test(global.location.href)) {
          oid = global?.__INITIAL_STATE__?.detail?.basic?.comment_id_str;
          createrID = global?.__INITIAL_STATE__?.detail?.basic?.uid;
          commentType = global?.__INITIAL_STATE__?.detail?.basic?.comment_type; // should be '11'
        } else if (articleRE.test(global.location.href)) {
          oid = global?.__INITIAL_STATE__?.cvid;
          createrID = global?.__INITIAL_STATE__?.readInfo?.author?.mid;
          commentType = 12;
        } else if (festivalRE.test(global.location.href)) {
          oid = global?.__INITIAL_STATE__?.videoInfo?.aid;
          createrID = global?.__INITIAL_STATE__?.videoInfo?.upMid;
          commentType = 1;
        } else if (listRE.test(global.location.href)) {
          oid = new URLSearchParams(global.location.search).get('oid');
          createrID = global?.__INITIAL_STATE__?.upInfo?.mid;
          commentType = 1;
        } else if (mangaRE.test(global.location.href)) {
          oid = global.location.href.match(/detail\/mc(?<oid>\d+)/)?.groups?.oid;
          createrID = 1;
          commentType = 22;
        } else if (mangaViewerRE.test(global.location.href)) {
          oid = global.location.href.match(/\/mc\d+\/(?<oid>\d+)/)?.groups?.oid;
          createrID = 1;
          commentType = 29;
        }

        // get reply container
        replyList = document.querySelector('.reply-list');

        // final check
        if (oid && createrID && commentType && replyList) {
          createrID = parseInt(createrID);
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });

    // enable switching sort type
    await enableSwitchingSortType();

    // load first pagination
    await loadFirstPagination();
  }

  async function setupStandardCommentContainer() {
    const container = await new Promise(resolve => {
      const timer = setInterval(() => {
        const standardContainer = document.querySelector('.comment-container');
        const outdatedContainer = document.querySelector('.comment-wrapper .common');
        const shadowRootContainer = document.querySelector('bili-comments');
        const container = standardContainer || outdatedContainer || shadowRootContainer;
        if (container) { clearInterval(timer); resolve(container); }
      }, 200);
    });

    // modify non-standard comment container
    if (!container.classList.contains('comment-container')) {
      container.parentElement.innerHTML = `
        <div class="comment-container">
          <div class="reply-header">
            <div class="reply-navigation">
              <ul class="nav-bar">
                <li class="nav-title">
                  <span class="nav-title-text">评论</span>
                  <span class="total-reply">-</span>
                </li>
                <li class="nav-sort hot">
                  <div class="hot-sort">最热</div>
                  <div class="part-symbol"></div>
                  <div class="time-sort">最新</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="reply-warp">
            <div class="main-reply-box">
              <div class="reply-box disabled">
                <div class="box-normal">
                  <div class="reply-box-avatar">
                    <div class="bili-avatar" style="width: 48px; height: 48px; background-color: #F1F1F1;"></div>
                  </div>
                  <div class="reply-box-warp" style="transition: none;">
                    <div class="textarea-wrap">
                      <textarea class="reply-box-textarea" placeholder="勇敢滴少年啊快去创造热评~"></textarea>
                    </div>
                    <div class="disable-mask">
                      <div class="no-login-mask">
                        <span>请先</span>
                        <span class="login-btn">登录</span>
                        <span>后发表评论 (・ω・)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="reply-list"></div>
          </div>  
        </div>
      `;
    }
  }

  async function enableSwitchingSortType() {
    // collect elements
    const navSortElement = document.querySelector('.comment-container .reply-header .nav-sort');
    const hotSortElement = navSortElement.querySelector('.hot-sort');
    const timeSortElement = navSortElement.querySelector('.time-sort');

    // reset classes
    navSortElement.classList.add('hot');
    navSortElement.classList.remove('time');

    // setup click event listener
    hotSortElement.addEventListener('click', () => {
      if (currentSortType === sortTypeConstant.HOT) return;
      currentSortType = sortTypeConstant.HOT;
      navSortElement.classList.add('hot');
      navSortElement.classList.remove('time');
      loadFirstPagination();
    });

    timeSortElement.addEventListener('click', () => {
      if (currentSortType === sortTypeConstant.LATEST) return;
      currentSortType = sortTypeConstant.LATEST;
      navSortElement.classList.add('time');
      navSortElement.classList.remove('hot');
      loadFirstPagination();
    });
  }

  async function loadFirstPagination() {
    // reset offset data
    offsetStore = { 1: `{"offset":""}` };

    // get data of first pagination
    const { data: firstPaginationData, code: resultCode } = await getPaginationData(1);

    // make sure 'replyList' exists
    await new Promise(resolve => {
      const timer = setInterval(() => {
        if (document.body.contains(replyList)) { clearInterval(timer); resolve(); }
        else { replyList = document.querySelector('.reply-list'); }
      }, 200);
    });

    // clear replyList
    replyList.innerHTML = '';

    // clear replyPool
    replyPool = {};

    // clear bottom modules
    document.querySelector('.comment-container .reply-warp .no-more-replies-info')?.remove();
    document.querySelector('.comment-container .reply-warp .page-switcher')?.remove();
    document.querySelector('.comment-container .reply-warp .anchor-for-loading')?.remove();

    // script ends here if not able to fetch pagination data
    if (resultCode !== 0) {
      // ref: BV12r4y147Bj
      const info = resultCode === 12061 ? 'UP主已关闭评论区' : '无法从API获取评论数据';
      replyList.innerHTML = `<p style="padding: 100px 0; text-align: center; color: #999;">${info}</p>`;
      return;
    }

    // load reply count
    const totalReplyElement = document.querySelector('.comment-container .reply-header .total-reply');
    const totalReplyCount = parseInt(firstPaginationData?.cursor?.all_count) || 0;
    totalReplyElement.textContent = totalReplyCount;

    // check whether replies are selected
    // ref: BV1Dy2mY3EGy
    if (firstPaginationData?.cursor?.name?.includes('精选')) {
      const navSortElement = document.querySelector('.comment-container .reply-header .nav-sort');
      navSortElement.innerHTML = `<div class="selected-sort">精选评论</div>`;
    }

    // load the top reply if it exists
    if (firstPaginationData.top_replies && firstPaginationData.top_replies.length !== 0) {
      const topReplyData = firstPaginationData.top_replies[0];
      appendReplyItem(topReplyData, true);
    }

    // script ends here if there are no more replies
    if (firstPaginationData.replies.length === 0) {
      const infoElement = document.createElement('p');
      infoElement.classList.add('no-more-replies-info');
      infoElement.style = 'padding-bottom: 100px; text-align: center; color: #999;';
      infoElement.textContent = '没有更多评论';
      document.querySelector('.comment-container .reply-warp').appendChild(infoElement);
      return;
    }

    // load normal replies
    for (const replyData of firstPaginationData.replies) {
      appendReplyItem(replyData);
    }

    // add page loader
    options.enableReplyPagination ? addReplyPageSwitcher() : addAnchor();
  }

  async function getPaginationData(paginationNumber) {
    const params = {
      oid,
      type: commentType,
      wts: parseInt(Date.now() / 1000)
    };

    // add 'mode' to params
    if (currentSortType === sortTypeConstant.HOT) params.mode = 3;
    if (currentSortType === sortTypeConstant.LATEST) params.mode = 2;

    // add 'pagination_str' to params
    params.pagination_str = offsetStore[paginationNumber];
    if (params.pagination_str === 'no-next-offset') return ({ code: 0, data: { replies: [] } });

    // fetch data
    const fetchResult = await fetch(`https://api.bilibili.com/x/v2/reply/wbi/main?${await getWbiQueryString(params)}`).then(res => res.json());

    // prepare offset data of next pagination
    if (fetchResult.code === 0) {
      const nextOffset = fetchResult.data?.cursor?.pagination_reply?.next_offset;
      offsetStore[paginationNumber + 1] = nextOffset ? `{"offset":"${nextOffset}"}` : 'no-next-offset';
    } else {
      fetchResult.data = fetchResult.data || {};
    }

    return fetchResult;
  }

  function appendReplyItem(replyData, isTopReply) {
    if (!options.enableReplyPagination && replyPool[replyData.rpid_str]) return;

    const replyItemElement = document.createElement('div');
    replyItemElement.classList.add('reply-item');
    replyItemElement.innerHTML = `
      <div class="root-reply-container">
        <a class="root-reply-avatar" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}">
          <div class="avatar">
            <div class="bili-avatar">
              <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius" data-src="${replyData.member.avatar}" alt="" src="${replyData.member.avatar}">
              ${
                replyData.member.pendant.image
                ? `
                <div class="bili-avatar-pendent-dom" style="transform: scale(0.85);">
                  <img class="bili-avatar-img" data-src="${replyData.member.pendant.image}" alt="" src="${replyData.member.pendant.image}">
                </div>
                `
                : ''
              }
              <span class="bili-avatar-icon bili-avatar-right-icon  bili-avatar-size-40"></span>
            </div>
          </div>
        </a>
        <div class="content-warp">
          <div class="reply-decorate">
            <div class="user-sailing">
              ${
                replyData.member.user_sailing?.cardbg
                ? `
                <img class="user-sailing-img" src="${replyData.member.user_sailing.cardbg.image}@576w.webp">
                <div class="user-sailing-text" style="color: ${replyData.member.user_sailing.cardbg.fan.color}">
                  <span class="sailing-text">NO.</span>
                  <br>
                  <span class="sailing-text">${replyData.member.user_sailing.cardbg.fan.number.toString().padStart(6, '0')}</span>
                </div>
                `
                : ''
              }
            </div>
          </div>
          <div class="user-info">
            <a class="user-name" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}" style="color: ${replyData.member.vip.nickname_color ? replyData.member.vip.nickname_color : '#61666d'}">${replyData.member.uname}</a>
            <span style="height: 16px; padding: 0 2px; margin-right: 4px; display: flex; align-items: center; font-size: 12px; color: white; border-radius: 2px; background-color: ${getMemberLevelColor(replyData.member.level_info.current_level)};">LV${replyData.member.level_info.current_level}</span>
            ${
              createrID === replyData.mid
              ? '<i class="svg-icon up-web up-icon" style="width: 24px; height: 24px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="4" width="24" height="16" rx="2" fill="#FF6699"></rect><path d="M5.7 8.36V12.79C5.7 13.72 5.96 14.43 6.49 14.93C6.99 15.4 7.72 15.64 8.67 15.64C9.61 15.64 10.34 15.4 10.86 14.92C11.38 14.43 11.64 13.72 11.64 12.79V8.36H10.47V12.81C10.47 13.43 10.32 13.88 10.04 14.18C9.75 14.47 9.29 14.62 8.67 14.62C8.04 14.62 7.58 14.47 7.3 14.18C7.01 13.88 6.87 13.43 6.87 12.81V8.36H5.7ZM13.0438 8.36V15.5H14.2138V12.76H15.9838C17.7238 12.76 18.5938 12.02 18.5938 10.55C18.5938 9.09 17.7238 8.36 16.0038 8.36H13.0438ZM14.2138 9.36H15.9138C16.4238 9.36 16.8038 9.45 17.0438 9.64C17.2838 9.82 17.4138 10.12 17.4138 10.55C17.4138 10.98 17.2938 11.29 17.0538 11.48C16.8138 11.66 16.4338 11.76 15.9138 11.76H14.2138V9.36Z" fill="white"></path></svg></i>'
              : ''
            }
            ${
              options.enableFanMedal && replyData.member.fans_detail
              ? `
              <div class="fan-medal ${ replyData.member.fans_detail.guard_icon ? 'fan-medal-with-guard-icon' : '' }">
                ${ replyData.member.fans_detail.guard_icon ? `<img class="fan-medal-icon" src="https://i0.hdslb.com/bfs/live/82d48274d0d84e2c328c4353c38def6eaf5de27a.png" />` : '' }
                <div class="fan-medal-name">${replyData.member.fans_detail.medal_name}</div>
                <div class="fan-medal-level">${replyData.member.fans_detail.level}</div>
              </div>
              `
              : ''
            }
          </div>
          <div class="root-reply">
            <span class="reply-content-container root-reply" style="padding-bottom: 8px;">
              <span class="reply-content">${isTopReply? '<span class="top-icon">置顶</span>': ''}${replyData.content.pictures ? `<div class="note-prefix" style="transform: translateY(-2px);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="#BBBBBB"><path d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25Zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25ZM3.5 6.25a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75Zm.75 2.25h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5Z"></path></svg><div style="margin-left: 3px;">笔记</div></div>` : ''}${getConvertedMessage(replyData.content)}</span>
            </span>
            ${
              replyData.content.pictures
              ? `
              <div class="image-exhibition" style="margin-top: 0; margin-bottom: 8px;">
                <div class="preview-image-container" style="display: flex; width: 400px;">
                  ${getImageItems(replyData.content.pictures)}
                </div>
              </div>
              `
              : ''
            }
            <div class="reply-info">
              <span class="reply-time" style="margin-right: 20px;">${getFormattedTime(replyData.ctime)}</span>
              <span class="reply-like">
                <i class="svg-icon like use-color like-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3323" width="200" height="200"><path d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z" p-id="3324" fill="#9499a0"></path></svg></i>
                <span>${replyData.like}</span>
              </span>
              <span class="reply-dislike">
                <i class="svg-icon dislike use-color dislike-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3933" width="200" height="200"><path d="M594.112 872.768a34.048 34.048 0 0 1-29.12-10.816c-11.264-13.248-15.872-24.064-21.504-40.064l-1.92-5.632c-5.632-16.128-12.8-36.864-27.712-63.232-25.344-44.928-50.24-74.432-86.144-97.024-23.104-14.528-43.648-26.432-65.024-32.64V203.84a4570.24 4570.24 0 0 1 339.072 4.672c38.656 2.048 72 21.12 88.896 52.032 21.504 39.36 47.232 95.744 63.552 163.008 16.448 67.52 21.568 123.776 22.592 163.008 0.448 16.832-13.44 32.256-35.392 32.256h-197.248a32 32 0 0 0-28.608 46.336l0.128 0.32 0.64 1.28 2.56 5.568c2.176 4.8 5.12 11.776 8.384 20.16 6.528 17.088 13.568 39.04 16.768 60.416 4.928 33.344 3.712 60.16-9.344 84.992-14.08 26.688-30.016 33.728-40.576 34.944z m97.728-190.016h149.568c52.8 0 100.864-40.128 99.392-97.92a846.336 846.336 0 0 0-24.32-176.448 742.016 742.016 0 0 0-69.632-178.56c-29.248-53.44-84.48-82.304-141.824-85.248-55.68-2.88-138.24-5.952-235.712-5.952-96 0-183.488 3.008-244.672 5.76-66.368 3.136-123.328 51.392-130.944 119.872a1380.608 1380.608 0 0 0-0.768 296.704c7.68 72.768 70.4 121.792 140.032 121.792h97.728c13.76 0 28.16 5.504 62.976 27.392 24.064 15.168 42.432 35.264 64.448 74.368 11.968 21.12 17.472 36.864 22.976 52.736l2.048 5.888c6.656 18.88 14.336 38.4 33.216 60.416 19.456 22.72 51.456 36.736 85.184 32.768 35.2-4.096 67.776-26.88 89.792-68.672 22.208-42.112 21.888-84.8 16-124.288a343.04 343.04 0 0 0-15.488-60.608zM298.688 205.568v413.184H232.96c-40.512 0-72.448-27.712-76.352-64.512a1318.912 1318.912 0 0 1 0.64-282.88c3.904-34.816 32.896-61.248 70.4-62.976 20.8-0.96 44.736-1.92 71.04-2.816z" p-id="3934" fill="#9499a0"></path></svg></i>
              </span>
              <span class="reply-btn">回复</span>
            </div>
            <div class="reply-tag-list"">
              ${
                replyData.card_label
                ? replyData.card_label.reduce((acc, cur) => acc + `<span class="reply-tag-item ${cur.text_content === '热评' ? 'reply-tag-hot' : ''} ${cur.text_content === 'UP主觉得很赞' ? 'reply-tag-liked' : ''}" style="font-size: 12px; background-color: ${cur.label_color_day}; color: ${cur.text_color_day};">${cur.text_content}</span>`, '')
                : ''
              }
            </div>
          </div>
        </div>
      </div>
      <div class="sub-reply-container">
        <div class="sub-reply-list">
          ${getSubReplyItems(replyData.replies)}
          ${
            replyData.rcount > (replyData.replies || []).length
            ? `
            <div class="view-more" style="padding-left: 8px; font-size: 13px; color: #9499A0;">
              <div class="view-more-default">
                <span>共${replyData.rcount}条回复, </span>
                <span class="view-more-btn" style="cursor: pointer;">点击查看</span>
              </div>
            </div>
            `
            : ''
          }
        </div>
      </div>
      <div class="bottom-line"></div>
    `;
    replyList.appendChild(replyItemElement);
    if (!options.enableReplyPagination) replyPool[replyData.rpid_str] = true;

    // setup image viewer
    const previewImageContainer = replyItemElement.querySelector('.preview-image-container');
    if (previewImageContainer) new Viewer(previewImageContainer, { title: false, toolbar: false, tooltip: false, keyboard: false });

    // setup view more button
    const subReplyList = replyItemElement.querySelector('.sub-reply-list');
    const viewMoreBtn = replyItemElement.querySelector('.view-more-btn');
    viewMoreBtn && viewMoreBtn.addEventListener('click', () => {
      options.enableLoadAllSubRepliesAtOnce
      ? loadAllSubReplies(replyData.rpid, subReplyList)
      : loadPaginatedSubReplies(replyData.rpid, subReplyList, replyData.rcount, 1);
    });
  }

  function getFormattedTime(ms) {
    const time = new Date(ms * 1000);
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const day = time.getDate().toString().padStart(2, '0');
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  function getMemberLevelColor(level) {
    return ({
      0: '#C0C0C0',
      1: '#BBBBBB',
      2: '#8BD29B',
      3: '#7BCDEF',
      4: '#FEBB8B',
      5: '#EE672A',
      6: '#F04C49'
    })[level];
  }

  function getConvertedMessage(content) {
    let result = content.message;

    // built blacklist of keyword, to avoid being converted to link incorrectly
    const keywordBlacklist = ['https://www.bilibili.com/video/av', 'https://b23.tv/mall-'];

    // convert vote to link
    if (content.vote && content.vote.deleted === false) {
      const linkElementHTML = `<a class="jump-link normal" href="${content.vote.url}" target="_blank" noopener noreferrer>${content.vote.title}</a>`;
      keywordBlacklist.push(linkElementHTML);
      result = result.replace(`{vote:${content.vote.id}}`, linkElementHTML);
    }

    // convert emote tag to image
    if (content.emote) {
      for (const [key, value] of Object.entries(content.emote)) {
        const imageElementHTML = `<img class="emoji-${['', 'small', 'large'][value.meta.size]}" src="${value.url}" alt="${key}">`;
        keywordBlacklist.push(imageElementHTML);
        result = result.replaceAll(key, imageElementHTML);
      }
    }

    // convert timestamp to link
    result = result.replaceAll(/(\d{1,2}[:：]){1,2}\d{1,2}/g, (timestamp) => {
      timestamp = timestamp.replaceAll('：', ':');

      // return plain text if no video in page
      if(!(videoRE.test(global.location.href) || bangumiRE.test(global.location.href) || festivalRE.test(global.location.href) || listRE.test(global.location.href))) return timestamp;

      const parts = timestamp.split(':');
      // return plain text if any part of timestamp equal to or bigger than 60
      if (parts.some(part => parseInt(part) >= 60)) return timestamp;
      
      let totalSecond;
      if (parts.length === 2) totalSecond = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      else if (parts.length === 3) totalSecond = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
      // return plain text if failed to get vaild number of second
      if (Number.isNaN(totalSecond)) return timestamp;

      const linkElementHTML = `<a class="jump-link video-time" onclick="window.player.mediaElement().currentTime = ${totalSecond}; window.scrollTo(0, 0); window.player.play();">${timestamp}</a>`
      keywordBlacklist.push(linkElementHTML);

      return linkElementHTML;
    });

    // convert @ user
    if (content.at_name_to_mid) {
      for (const [key, value] of Object.entries(content.at_name_to_mid)) {
        const linkElementHTML = `<a class="jump-link user" data-user-id="${value}" href="https://space.bilibili.com/${value}" target="_blank" noopener noreferrer>@${key}</a>`;
        keywordBlacklist.push(linkElementHTML);
        result = result.replaceAll(`@${key}`, linkElementHTML);
      }
    }

    // convert url to link
    if (Object.keys(content.jump_url).length) {
      // make sure links are converted first
      const entries = [].concat(
        Object.entries(content.jump_url).filter(entry => entry[0].startsWith('https://')),
        Object.entries(content.jump_url).filter(entry => !entry[0].startsWith('https://'))
      );

      for (const [key, value] of entries) {
        const href = (key.startsWith('BV') || /^av\d+$/.test(key)) ? `https://www.bilibili.com/video/${key}` : (value.pc_url || key);
        if (href.includes('search.bilibili.com') && (!options.enableKeywordSearchLink || keywordBlacklist.join('').includes(key))) continue;
        const linkElementHTML = `<img class="icon normal" src="${value.prefix_icon}" style="${value.extra && value.extra.is_word_search && 'width: 12px;'}"><a class="jump-link normal" href="${href}" target="_blank" noopener noreferrer>${value.title}</a>`;
        keywordBlacklist.push(linkElementHTML);
        result = result.replaceAll(key, linkElementHTML);
      }
    }

    return result;
  }

  function getImageItems(images) {
    let imageSizeConfig = 'width: 96px; height: 96px;';
    if (images.length === 1) imageSizeConfig = 'max-width: 280px; max-height: 180px;';
    if (images.length === 2) imageSizeConfig = 'width: 128px; height: 128px;';

    let result = '';
    for (const image of images) {
      result += `<div class="image-item-wrap" style="margin-top: 4px; margin-right: 4px; cursor: zoom-in;"><img src="${image.img_src}" style="border-radius: 4px; ${imageSizeConfig}"></div>`;
    }
    return result;
  }

  function getSubReplyItems(subReplies) {
    if (!(subReplies instanceof Array)) return '';

    let result = '';
    for (const replyData of subReplies) {
      result += `
        <div class="sub-reply-item">
          <div class="sub-user-info">
            <a class="sub-reply-avatar" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}">
              <div class="avatar">
                <div class="bili-avatar">
                  <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius" data-src="${replyData.member.avatar}" alt="" src="${replyData.member.avatar}">
                  <span class="bili-avatar-icon bili-avatar-right-icon  bili-avatar-size-24"></span>
                </div>
              </div>
            </a>
            <a class="sub-user-name" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}" style="color: ${replyData.member.vip.nickname_color ? replyData.member.vip.nickname_color : '#61666d'}">${replyData.member.uname}</a>
            <span style="height: 16px; padding: 0 2px; margin-right: 4px; display: flex; align-items: center; font-size: 12px; color: white; border-radius: 2px; background-color: ${getMemberLevelColor(replyData.member.level_info.current_level)};">LV${replyData.member.level_info.current_level}</span>
            ${
              createrID === replyData.mid
              ? `<i class="svg-icon up-web up-icon" style="width: 24px; height: 24px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="4" width="24" height="16" rx="2" fill="#FF6699"></rect><path d="M5.7 8.36V12.79C5.7 13.72 5.96 14.43 6.49 14.93C6.99 15.4 7.72 15.64 8.67 15.64C9.61 15.64 10.34 15.4 10.86 14.92C11.38 14.43 11.64 13.72 11.64 12.79V8.36H10.47V12.81C10.47 13.43 10.32 13.88 10.04 14.18C9.75 14.47 9.29 14.62 8.67 14.62C8.04 14.62 7.58 14.47 7.3 14.18C7.01 13.88 6.87 13.43 6.87 12.81V8.36H5.7ZM13.0438 8.36V15.5H14.2138V12.76H15.9838C17.7238 12.76 18.5938 12.02 18.5938 10.55C18.5938 9.09 17.7238 8.36 16.0038 8.36H13.0438ZM14.2138 9.36H15.9138C16.4238 9.36 16.8038 9.45 17.0438 9.64C17.2838 9.82 17.4138 10.12 17.4138 10.55C17.4138 10.98 17.2938 11.29 17.0538 11.48C16.8138 11.66 16.4338 11.76 15.9138 11.76H14.2138V9.36Z" fill="white"></path></svg></i>`
              : ''
            }
          </div>
          <span class="reply-content-container sub-reply-content">
            <span class="reply-content">${getConvertedMessage(replyData.content)}</span>
          </span>
          <div class="sub-reply-info" style="margin: 4px 0;">
            <span class="sub-reply-time" style="margin-right: 20px;">${getFormattedTime(replyData.ctime)}</span>
            <span class="sub-reply-like">
              <i class="svg-icon like use-color sub-like-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3323" width="200" height="200"><path d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z" p-id="3324" fill="#9499a0"></path></svg></i>
              <span>${replyData.like}</span>
            </span>
            <span class="sub-reply-dislike">
              <i class="svg-icon dislike use-color sub-dislike-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3933" width="200" height="200"><path d="M594.112 872.768a34.048 34.048 0 0 1-29.12-10.816c-11.264-13.248-15.872-24.064-21.504-40.064l-1.92-5.632c-5.632-16.128-12.8-36.864-27.712-63.232-25.344-44.928-50.24-74.432-86.144-97.024-23.104-14.528-43.648-26.432-65.024-32.64V203.84a4570.24 4570.24 0 0 1 339.072 4.672c38.656 2.048 72 21.12 88.896 52.032 21.504 39.36 47.232 95.744 63.552 163.008 16.448 67.52 21.568 123.776 22.592 163.008 0.448 16.832-13.44 32.256-35.392 32.256h-197.248a32 32 0 0 0-28.608 46.336l0.128 0.32 0.64 1.28 2.56 5.568c2.176 4.8 5.12 11.776 8.384 20.16 6.528 17.088 13.568 39.04 16.768 60.416 4.928 33.344 3.712 60.16-9.344 84.992-14.08 26.688-30.016 33.728-40.576 34.944z m97.728-190.016h149.568c52.8 0 100.864-40.128 99.392-97.92a846.336 846.336 0 0 0-24.32-176.448 742.016 742.016 0 0 0-69.632-178.56c-29.248-53.44-84.48-82.304-141.824-85.248-55.68-2.88-138.24-5.952-235.712-5.952-96 0-183.488 3.008-244.672 5.76-66.368 3.136-123.328 51.392-130.944 119.872a1380.608 1380.608 0 0 0-0.768 296.704c7.68 72.768 70.4 121.792 140.032 121.792h97.728c13.76 0 28.16 5.504 62.976 27.392 24.064 15.168 42.432 35.264 64.448 74.368 11.968 21.12 17.472 36.864 22.976 52.736l2.048 5.888c6.656 18.88 14.336 38.4 33.216 60.416 19.456 22.72 51.456 36.736 85.184 32.768 35.2-4.096 67.776-26.88 89.792-68.672 22.208-42.112 21.888-84.8 16-124.288a343.04 343.04 0 0 0-15.488-60.608zM298.688 205.568v413.184H232.96c-40.512 0-72.448-27.712-76.352-64.512a1318.912 1318.912 0 0 1 0.64-282.88c3.904-34.816 32.896-61.248 70.4-62.976 20.8-0.96 44.736-1.92 71.04-2.816z" p-id="3934" fill="#9499a0"></path></svg></i>
            </span>
            <span class="sub-reply-btn">回复</span>
          </div>
        </div>
      `;
    }

    return result;
  }

  async function loadAllSubReplies(rootReplyID, subReplyList) {
    let subPaginationCounter = 1;
    while(true) {
      const subReplyData = await fetch(`https://api.bilibili.com/x/v2/reply/reply?oid=${oid}&pn=${subPaginationCounter++}&ps=20&root=${rootReplyID}&type=${commentType}`).then(res => res.json()).then(json => json.data);
      if (subPaginationCounter - 1 === 1) subReplyList.innerHTML = '';
      if ((subReplyData.replies instanceof Array) && subReplyData.replies.length > 0) {
        subReplyList.innerHTML += getSubReplyItems(subReplyData.replies);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        break;
      }
    }
  }

  async function loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, paginationNumber) {
    // replace reply list with new replies
    const subReplyData = await fetch(`https://api.bilibili.com/x/v2/reply/reply?oid=${oid}&pn=${paginationNumber}&ps=10&root=${rootReplyID}&type=${commentType}`).then(res => res.json()).then(json => json.data);
    subReplyList.innerHTML = getSubReplyItems(subReplyData.replies);

    // add page switcher
    addSubReplyPageSwitcher(rootReplyID, subReplyList, subReplyAmount, paginationNumber);

    // scroll to the top of replyItem
    const replyItem = subReplyList.parentElement.parentElement;
    replyItem.scrollIntoView({ behavior: 'instant' });

    // scroll up a bit more because of the fixed header
    global.scrollTo(0, document.documentElement.scrollTop - 60);
  }

  function addSubReplyPageSwitcher(rootReplyID, subReplyList, subReplyAmount, currentPageNumber) {
    if (subReplyAmount <= 10) return;

    const pageAmount = Math.ceil(subReplyAmount / 10);
    const pageSwitcher = document.createElement('div');
    pageSwitcher.classList.add('view-more');
    pageSwitcher.innerHTML = `
      <div class="view-more-pagination">
        <span class="pagination-page-count">共${pageAmount}页</span>
        ${ currentPageNumber !== 1 ? '<span class="pagination-btn pagination-to-prev-btn">上一页</span>' : '' }
        ${
          (() => {
            // 4 on the left, 4 on the right, then merge
            const left = [currentPageNumber - 4, currentPageNumber - 3, currentPageNumber - 2, currentPageNumber - 1].filter(num => num >= 1);
            const right = [currentPageNumber + 1, currentPageNumber + 2, currentPageNumber + 3, currentPageNumber + 4].filter(num => num <= pageAmount);
            const merge = [].concat(left, currentPageNumber, right);

            // chosen 5(if able)
            let chosen;
            if (currentPageNumber <= 3) chosen = merge.slice(0, 5);
            else if (currentPageNumber >= pageAmount - 3) chosen = merge.reverse().slice(0, 5).reverse();
            else chosen = merge.slice(merge.indexOf(currentPageNumber) - 2, merge.indexOf(currentPageNumber) + 3);

            // add first and dots
            let final = JSON.parse(JSON.stringify(chosen));
            if (!final.includes(1)) {
              let front = [1];
              if (final.at(0) !== 2) front = [1, '...'];
              final = [].concat(front, final);
            }

            // add last and dots
            if (!final.includes(pageAmount)) {
              let back = [pageAmount];
              if (final.at(-1) !== pageAmount - 1) back = ['...', pageAmount];
              final = [].concat(final, back);
            }

            // assemble to html
            return final.reduce((acc, cur) => {
              if (cur === '...') return acc + '<span class="pagination-page-dot">...</span>';
              if (cur === currentPageNumber) return acc + `<span class="pagination-page-number current-page">${cur}</span>`;
              return acc + `<span class="pagination-page-number">${cur}</span>`;
            }, '');
          })()
        }
        ${ currentPageNumber !== pageAmount ? '<span class="pagination-btn pagination-to-next-btn">下一页</span>': '' }
      </div>
    `;
    
    // add click event listener
    pageSwitcher.querySelector('.pagination-to-prev-btn')?.addEventListener('click', () => loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, currentPageNumber - 1));
    pageSwitcher.querySelector('.pagination-to-next-btn')?.addEventListener('click', () => loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, currentPageNumber + 1));
    pageSwitcher.querySelectorAll('.pagination-page-number:not(.current-page)')?.forEach(pageNumberElement => {
      const number = parseInt(pageNumberElement.textContent);
      pageNumberElement.addEventListener('click', () => loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, number));
    });

    // append page switcher
    subReplyList.appendChild(pageSwitcher);
  }

  async function addReplyPageSwitcher() {
    let isPageAmountFound = false;
    let currentMaxPageNumber = 1;
    let currentPageNumber = 1;

    // check if there is no reply in page 2
    const { data: nextPaginationData } = await getPaginationData(currentPageNumber + 1);
    if (!nextPaginationData.replies || nextPaginationData.replies.length === 0) {
      const infoElement = document.createElement('p');
      infoElement.classList.add('page-switcher', 'page-switcher-info');
      infoElement.style = 'height: 40px; margin-top: -50px; margin-left: 22px; padding-bottom: 50px; text-align: center; color: #61666d;';
      infoElement.textContent = '所有评论已加载完毕';
      document.querySelector('.comment-container .reply-warp').appendChild(infoElement);
      return;
    }

    const pageSwitcher = document.createElement('div');
    pageSwitcher.classList.add('page-switcher');
    pageSwitcher.style = `
      width: 100%;
      display: flex;
      justify-content: center;
      transform: translateY(-60px);
    `;
    pageSwitcher.appendChild(generatePageSwitcher());
    document.querySelector('.comment-container .reply-warp').appendChild(pageSwitcher);

    function generatePageSwitcher() {
      const wrapper = document.createElement('div');
      wrapper.classList.add('page-switcher-wrapper');
      wrapper.innerHTML = `
        ${
          currentPageNumber === 1
          ? '<span class="page-switcher-prev-btn__disabled">上一页</span>'
          : '<span class="page-switcher-prev-btn">上一页</span>'
        }
        ${
          (() => {
            // 4 on the left, 4 on the right, then merge
            const left = [currentPageNumber - 4, currentPageNumber - 3, currentPageNumber - 2, currentPageNumber - 1].filter(num => num >= 1);
            const right = [currentPageNumber + 1, currentPageNumber + 2, currentPageNumber + 3, currentPageNumber + 4].filter(num => num <= currentMaxPageNumber);
            const merge = [].concat(left, currentPageNumber, right);

            // chosen 5(if able)
            let chosen;
            if (currentPageNumber <= 3) chosen = merge.slice(0, 5);
            else if (currentPageNumber >= currentMaxPageNumber - 3) chosen = merge.reverse().slice(0, 5).reverse();
            else chosen = merge.slice(merge.indexOf(currentPageNumber) - 2, merge.indexOf(currentPageNumber) + 3);

            // add first and dots
            let final = JSON.parse(JSON.stringify(chosen));
            if (!final.includes(1)) {
              let front = [1];
              if (final.at(0) !== 2) front = [1, 'dot'];
              final = [].concat(front, final);
            }

            // add last and dots
            if (!final.includes(currentMaxPageNumber)) {
              let back = [currentMaxPageNumber];
              if (final.at(-1) !== currentMaxPageNumber - 1) back = ['dot', currentMaxPageNumber];
              final = [].concat(final, back);
            }

            // assemble to html
            return final.reduce((acc, cur) => {
              if (cur === 'dot') return acc + '<span class="page-switcher-dot">•••</span>';
              if (cur === currentPageNumber) return acc + `<span class="page-switcher-number page-switcher-current-page">${cur}</span>`;
              return acc + `<span class="page-switcher-number">${cur}</span>`;
            }, '');
          })()
        }
        ${
          isPageAmountFound && currentPageNumber === currentMaxPageNumber
          ? '<span class="page-switcher-next-btn__disabled">下一页</span>'
          : '<span class="page-switcher-next-btn">下一页</span>'
        }
      `;

      // prev button click event
      wrapper.querySelector('.page-switcher-prev-btn')?.addEventListener('click', async () => {
        currentPageNumber -= 1;

        const { data: prevPaginationData } = await getPaginationData(currentPageNumber);
        replyList.innerHTML = '';

        // if loading page 1, load top reply if it exists
        if (currentPageNumber === 1 && prevPaginationData.top_replies && prevPaginationData.top_replies.length !== 0) {
          const topReplyData = prevPaginationData.top_replies[0];
          appendReplyItem(topReplyData, true);
        }

        for (const replyData of prevPaginationData.replies) {
          appendReplyItem(replyData);
        }

        pageSwitcher.innerHTML = '';
        pageSwitcher.appendChild(generatePageSwitcher());

        scrollToTopOfReplyList();
      });

      // next button click event
      wrapper.querySelector('.page-switcher-next-btn')?.addEventListener('click', async function nextButtonOnClickHandler(e) {
        if (currentPageNumber === currentMaxPageNumber && isPageAmountFound) return;

        const { data: nextPaginationData } = await getPaginationData(currentPageNumber + 1);
        if (!nextPaginationData.replies || nextPaginationData.replies.length === 0) {
          isPageAmountFound = true;
          e.target.classList.add('page-switcher-next-btn__disabled');
          e.target.classList.remove('page-switcher-next-btn');
          return;
        }

        if (currentPageNumber === currentMaxPageNumber) currentMaxPageNumber += 1;
        currentPageNumber += 1;
        
        replyList.innerHTML = '';
        for (const replyData of nextPaginationData.replies) {
          appendReplyItem(replyData);
        }

        pageSwitcher.innerHTML = '';
        pageSwitcher.appendChild(generatePageSwitcher());

        scrollToTopOfReplyList();
      });

      // number button click event
      wrapper.querySelectorAll('.page-switcher-number:not(.page-switcher-current-page)')?.forEach(numberElement => {
        numberElement.addEventListener('click', async () => {
          const targetPageNumber = parseInt(numberElement.textContent);
          currentPageNumber = targetPageNumber;
          
          const { data: paginationData } = await getPaginationData(targetPageNumber);
          replyList.innerHTML = '';

            // if loading page 1, load top reply if it exists
          if (targetPageNumber === 1 && paginationData.top_replies && paginationData.top_replies.length !== 0) {
            const topReplyData = paginationData.top_replies[0];
            appendReplyItem(topReplyData, true);
          }

          for (const replyData of paginationData.replies) {
            appendReplyItem(replyData);
          }

          pageSwitcher.innerHTML = '';
          pageSwitcher.appendChild(generatePageSwitcher());

          scrollToTopOfReplyList();
        });
      });

      return wrapper;
    }

    // scroll to the top of reply list
    function scrollToTopOfReplyList() {
      replyList.scrollIntoView({ behavior: 'instant' });

      // scroll up a bit more
      global.scrollTo(0, document.documentElement.scrollTop - 196);
    }
  }

  function addAnchor() {
    const anchorElement = document.createElement('div');
    anchorElement.classList.add('anchor-for-loading');
    anchorElement.textContent = '正在加载...';
    anchorElement.style = `
      width: calc(100% - 22px);
      height: 40px;
      margin-left: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateY(-60px);
      color: #61666d;
    `;
    document.querySelector('.comment-container .reply-warp').appendChild(anchorElement);

    let paginationCounter = 1;
    const ob = new IntersectionObserver(async (entries) => {
      if (!entries[0].isIntersecting) return;

      const { data: newPaginationData } = await getPaginationData(++paginationCounter);
      if (!newPaginationData.replies || newPaginationData.replies.length === 0) {
        anchorElement.textContent = '所有评论已加载完毕';
        ob.disconnect();
        return;
      }

      for (const replyData of newPaginationData.replies) {
        appendReplyItem(replyData);
      }

      const expanderElement = document.createElement('div');
      expanderElement.style = 'height: 100vh;';
      anchorElement.insertAdjacentElement('beforebegin', expanderElement);
      setTimeout(() => expanderElement.remove(), 200);
    });

    ob.observe(anchorElement);
  }

  // bvid to aid, ref: https://greasyfork.org/scripts/394296
  function b2a(bvid) {
    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;
    const BASE = 58n;
    const BYTES = ["B", "V", 1, "", "", "", "", "", "", "", "", ""];
    const BV_LEN = BYTES.length;
    const ALPHABET = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf'.split('');
    const DIGIT_MAP = [0, 1, 2, 9, 7, 5, 6, 4, 8, 3, 10, 11];

    let r = 0n;
    for (let i = 3; i < BV_LEN; i++) {
      r = r * BASE + BigInt(ALPHABET.indexOf(bvid[DIGIT_MAP[i]]));
    }
    return `${r & MASK_CODE ^ XOR_CODE}`;
  }

  // ref: https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/wbi.html
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

  function setupCommentBtnModifier() {
    setInterval(() => {
      const dynItems = document.querySelectorAll('.bili-dyn-list .bili-dyn-item');
      dynItems.forEach(dynItem => {
        if (dynItem.classList.contains('comment-btn-modified')) return;
        const dynContentElement = dynItem.querySelector('.bili-dyn-item__body div[data-module=desc]') || dynItem.querySelector('.bili-dyn-item__body a.bili-dyn-card-video');
        const commentBtnElement = dynItem.querySelector('.bili-dyn-item__footer .bili-dyn-action.comment');
        if (dynContentElement && commentBtnElement) {
          commentBtnElement.onclick = () => dynContentElement.click();
          dynItem.classList.add('comment-btn-modified');
        }
      });
    }, 1000);
  }

  async function setupOfficialCommentModuleBlocker() {
    // collect elements
    const { reactionTab, biliCommentContainer } = await new Promise(resolve => {
      const timer = setInterval(() => {
        const reactionTab = document.querySelector('.bili-tabs__header[role="tablist"] .bili-tabs__nav__item:not(.is-active)');
        const biliCommentContainer = document.querySelector('.bili-tab-pane[role="tabpanel"] > .comment-wrap > .bili-comment-container');
        if (reactionTab && biliCommentContainer) {
          clearInterval(timer);
          resolve({ reactionTab, biliCommentContainer });
        }
      }, 200);
    });

    // wait until reaction tab being clicked
    await new Promise(resolve => reactionTab.addEventListener('click', resolve));

    // prevent appending <bilibili-comments> to DOM
    biliCommentContainer.appendChild = function() {
      if (arguments[0].tagName === 'BILI-COMMENTS') return;
      return Node.prototype.appendChild.apply(this, arguments);
    }
  }

  async function setupMangaViewerCommentModuleHandler() {
    // clear the redundant class 'comment-container'
    await new Promise(resolve => {
      const timer = setInterval(() => {
        const target = document.querySelector('.episode-comment > .comment-container');
        if (target) {
          target.classList.remove('comment-container');
          target.classList.add('modified');
          target.style = `height: calc(100% - 40px); overflow: auto; padding: 30px;`;
        }
      }, 200);

      setTimeout(() => { clearInterval(timer); resolve(); }, 1000);
    });

    // get the show-comment button
    const showCommentBtn = await new Promise(resolve => {
      const timer = setInterval(() => {
        const target = document.querySelector('.action-settings > button.action-button.comment-button');
        if (target) { clearInterval(timer); resolve(target); }
      }, 200);
    });

    // load comment module after button clicked, except the first time
    let isOnceClicked = false;
    showCommentBtn.addEventListener('click', () => {
      if (isOnceClicked) start();
      else isOnceClicked = true;
    });
  }

  function addStyle() {
    // optional CSS
    const optionalCSS = document.createElement('style');
    if (!options.enableAvatarPendent) optionalCSS.textContent += `.bili-avatar-pendent-dom { display: none !important; } `;
    if (!options.enableSailingDecoration) optionalCSS.textContent += `.reply-decorate { display: none !important; } `;
    if (!options.enableNotePrefix) optionalCSS.textContent += `.note-prefix { display: none !important; } `;
    if (!options.enableHotTag) optionalCSS.textContent += `.reply-tag-hot { display: none !important; } `;
    if (!options.enableLikedTag) optionalCSS.textContent += `.reply-tag-liked { display: none !important; } `;
    if (!options.enableVipUserNameColor) optionalCSS.textContent += `.user-name, .sub-user-name { color: #61666d !important; } `;
    document.head.appendChild(optionalCSS);

    // avatar CSS
    const avatarCSS = document.createElement('style');
    avatarCSS.textContent = `
      .reply-item .root-reply-avatar .avatar .bili-avatar {
        width: 48px;
        height: 48px;
      }

      .sub-reply-item .sub-reply-avatar .avatar .bili-avatar {
        width: 30px;
        height: 30px;
      }

      @media screen and (max-width: 1620px) {
        .reply-item .root-reply-avatar .avatar .bili-avatar {
          width: 40px;
          height: 40px;
        }

        .sub-reply-item .sub-reply-avatar .avatar .bili-avatar {
          width: 24px;
          height: 24px;
        }
      }
    `;
    document.head.appendChild(avatarCSS);

    // fan medal CSS
    const fanMedalCSS = document.createElement('style');
    fanMedalCSS.textContent = `
      .fan-medal {
        display: flex;
        align-items: center;
        height: 14px;
        margin-left: 5px;
        border: 0.5px solid rgba(169, 195, 233, 0.18);
        border-radius: 10px;
        background-color: rgba(158, 186, 232, 0.2);
      }

      .fan-medal.fan-medal-with-guard-icon {
        border-color: #8da8e8;
        background-color: #b4ccff;
      }

      .fan-medal-icon {
        margin-right: -6px;
        width: 20px;
        height: 20px;
        overflow: clip;
        transform: translateX(-3px);
      }

      .fan-medal-name {
        margin-right: 4px;
        padding-left: 5px;
        line-height: 14px;
        white-space: nowrap;
        font-size: 9px;
        color: #577fb8;
      }

      .fan-medal-with-guard-icon > .fan-medal-name {
        color: #385599;
      }

      .fan-medal-level {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.5px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        line-height: 1;
        white-space: nowrap;
        font-family: medalnum;
        font-size: 6px;
        color: #9ab0d2;
        background-color: #ffffff;
      }

      .fan-medal-with-guard-icon > .fan-medal-level {
        color: #5e80c4;
      }
    `;
    document.head.appendChild(fanMedalCSS);

    // view-more CSS
    const viewMoreCSS = document.createElement('style');
    viewMoreCSS.textContent = `
      .sub-reply-container .view-more-btn:hover {
        color: #00AEEC;
      }

      .view-more {
        padding-left: 8px;
        color: #222;
        font-size: 13px;
        user-select: none;
      }

      .pagination-page-count {
        margin-right: 10px;
      }

      .pagination-page-dot,
      .pagination-page-number {
        margin: 0 4px;
      }

      .pagination-btn,
      .pagination-page-number {
        cursor: pointer;
      }

      .current-page,
      .pagination-btn:hover,
      .pagination-page-number:hover {
        color: #00AEEC;
      }
    `;
    document.head.appendChild(viewMoreCSS);

    // page switcher CSS
    const pageSwitcherCSS = document.createElement('style');
    pageSwitcherCSS.textContent = `
      .page-switcher-wrapper {
        display: flex;
        font-size: 14px;
        color: #666;
        user-select: none;
      }

      .page-switcher-wrapper span {
        margin-right: 6px;
      }

      .page-switcher-wrapper span:not(.page-switcher-dot){
        display: flex;
        padding: 0 14px;
        height: 38px;
        align-items: center;
        border: 1px solid #D7DDE4;
        border-radius: 4px;
        cursor: pointer;
        transition: border-color 0.2s;
      }

      .page-switcher-prev-btn:hover,
      .page-switcher-next-btn:hover,
      .page-switcher-number:hover {
        border-color: #00A1D6 !important;
      }

      .page-switcher-current-page {
        color: white;
        background-color: #00A1D6;
        border-color: #00A1D6 !important;
      }

      .page-switcher-dot {
        padding: 0 5px;
        display: flex;
        align-items: center;
        color: #CCC;
      }

      .page-switcher-prev-btn__disabled,
      .page-switcher-next-btn__disabled {
        color: #D7DDE4 !important;
        cursor: not-allowed !important;
      }
    `;
    document.head.appendChild(pageSwitcherCSS);

    // add other CSS
    const otherCSS = document.createElement('style');
    otherCSS.textContent = `
      .jump-link {
        color: #008DDA;
      }

      .login-tip,
      .fixed-reply-box,
      .v-popover:has(.login-panel-popover) {
        display: none;
      }
    `;
    document.head.appendChild(otherCSS);

    // dynamic page CSS
    if (dynamicRE.test(global.location.href) || opusRE.test(global.location.href)) {
      const dynPageCSS = document.createElement('style');
      dynPageCSS.textContent = `
        #app .opus-detail {
          min-width: 960px;
        }

        #app .opus-detail .right-sidebar-wrap {
          margin-left: 980px !important;
          transition: none;
        }

        #app > .content {
          min-width: 960px;
        }

        .v-popover:has(.login-panel-popover),
        .fixed-reply-box,
        .login-tip {
          display: none;
        }

        .note-prefix {
          fill: #BBBBBB;
        }

        .bili-comment-container svg {
          fill: inherit !important;
        }
      `;
      document.head.appendChild(dynPageCSS);
    }

    // article & festival page CSS
    if (articleRE.test(global.location.href) || festivalRE.test(global.location.href)) {
      const miscCSS = document.createElement('style');
      miscCSS.textContent = `
        :root {
          --text1: #18191C;
          --text3: #9499A0;
          --brand_pink: #FF6699;
          --graph_bg_thick: #e3e5e7;
        }

        .page-switcher {
          margin-top: 40px;
        }

        .van-popover:has(.unlogin-popover) {
          display: none !important;
        }
      `;
      document.head.appendChild(miscCSS);
    }
  }

  function setupVideoChangeHandler() {
    // redirect to new page if video source changed in festival page
    if (festivalRE.test(global.location.href)) {
      let record;
      const getBVID = () => global?.__INITIAL_STATE__?.videoInfo?.bvid;
      setInterval(() => {
        if (!record) record = getBVID();
        else if (record !== getBVID()) global.location.href = `${global.location.origin}${global.location.pathname}?bvid=${getBVID()}`;
      }, 1000);
    }

    // load new comment module when url changed
    if (videoRE.test(global.location.href) || bangumiRE.test(global.location.href) || listRE.test(global.location.href)) {
      const getHref = () => {
        const p = new URLSearchParams(global.location.search).get('p');
        const oid = new URLSearchParams(global.location.search).get('oid');
        return global.location.origin + global.location.pathname + (p ? `?p=${p}` : '') + (oid ? `?oid=${oid}` : '');
      }

      let oldHref = getHref();
      setInterval(() => {
        const newHref = getHref();
        if (oldHref !== newHref) {
          oldHref = newHref;
          start();
        }
      }, 1000);
    }
  }

  function setupSettingPanel() {
    // CSS
    const settingPanelCSS = document.createElement('style');
    settingPanelCSS.textContent = `
      #setting-panel-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999999999;
        width: 100vw;
        height: 100vh;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .setting-panel-wrapper {
        width: 600px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
        border-radius: 8px;
        user-select: none;
      }

      .setting-panel-title {
        margin-top: 0;
        margin-bottom: 8px;
        padding-top: 16px;
        padding-left: 12px;
        font-size: 28px;
      }

      .setting-panel-option-group {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 16px;
      }

      .setting-panel-option-item {
        padding: 16px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 4px;
      }

      .setting-panel-option-item:hover {
        background-color: #FAFAFA;
      }

      .setting-panel-option-item-switch {
        display: flex;
        align-items: center;
        width: 40px;
        height: 20px;
        padding: 2px;
        cursor: pointer;
        border-radius: 4px;
      }

      .setting-panel-option-item-switch[data-status="off"] {
        justify-content: flex-start;
        background-color: #CCCCCC;
      }

      .setting-panel-option-item-switch[data-status="on"] {
        justify-content: flex-end;
        background-color: #00AEEC;
      }

      .setting-panel-option-item-switch:after {
        content: '';
        width: 20px;
        height: 20px;
        background-color: #FFFFFF;
        border-radius: 4px;
      }

      #setting-panel-close-btn {
        margin-top: 16px;
        padding: 2px;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #FFFFFF;
        border: 2px solid #FFFFFF;
        border-radius: 100%;
        cursor: pointer;
        user-select: none;
      }
    `;
    document.head.appendChild(settingPanelCSS);

    // HTML
    const containerElement = document.createElement('div');
    containerElement.id = 'setting-panel-container';
    containerElement.innerHTML = `
      <div class="setting-panel-wrapper">
        <p class="setting-panel-title">自定义设置</p>
        <div class="setting-panel-option-group">
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">使用分页加载主评论</span>
            <span class="setting-panel-option-item-switch" data-key="enableReplyPagination" data-status="${options.enableReplyPagination ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">一次性加载所有子评论</span>
            <span class="setting-panel-option-item-switch" data-key="enableLoadAllSubRepliesAtOnce" data-status="${options.enableLoadAllSubRepliesAtOnce ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">显示用户头像边框</span>
            <span class="setting-panel-option-item-switch" data-key="enableAvatarPendent" data-status="${options.enableAvatarPendent ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">显示粉丝勋章</span>
            <span class="setting-panel-option-item-switch" data-key="enableFanMedal" data-status="${options.enableFanMedal ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">显示评论右上角的大航海装饰</span>
            <span class="setting-panel-option-item-switch" data-key="enableSailingDecoration" data-status="${options.enableSailingDecoration ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">显示"笔记"前缀</span>
            <span class="setting-panel-option-item-switch" data-key="enableNotePrefix" data-status="${options.enableNotePrefix ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">显示"热评"标签</span>
            <span class="setting-panel-option-item-switch" data-key="enableHotTag" data-status="${options.enableHotTag ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">显示"UP主觉得很赞"标签</span>
            <span class="setting-panel-option-item-switch" data-key="enableLikedTag" data-status="${options.enableLikedTag ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">显示大会员用户名的颜色为粉色</span>
            <span class="setting-panel-option-item-switch" data-key="enableVipUserNameColor" data-status="${options.enableVipUserNameColor ? 'on' : 'off'}"></span>
          </div>
          <div class="setting-panel-option-item">
            <span class="setting-panel-option-item-title">启用关键字搜索链接</span>
            <span class="setting-panel-option-item-switch" data-key="enableKeywordSearchLink" data-status="${options.enableKeywordSearchLink ? 'on' : 'off'}"></span>
          </div>
        </div>
        <div style="margin-top: 16px; align-self: center; font-size: 14px;">
          <span style="display: inline-block; transform: translateY(-1.5px);">⚠️</span>
          <span style="color: #AAAAAA;">所有改动将在页面刷新后生效</span>
        </div>
      </div>
      <span id="setting-panel-close-btn">×</span>
    `;

    // click events
    containerElement.querySelectorAll('.setting-panel-option-item-switch').forEach(switchElement => {
      switchElement.onclick = function(e) {
        const { key, status } = this.dataset;
        this.dataset.status = status === 'off' ? 'on' : 'off';
        GM_setValue(key, this.dataset.status === 'on');
      }
    });

    containerElement.querySelector('#setting-panel-close-btn').onclick = () => containerElement.style.display = 'none';

    // append to document
    document.body.appendChild(containerElement);
  }

  function setupSettingPanelEntry() {
    const settingPanelElement = document.querySelector('#setting-panel-container');
    const showSettingPanel = () => settingPanelElement.style.display = 'flex';

    // entry 1: gear icon
    setInterval(() => {
      const avatarElement = document.querySelector('.comment-container .reply-box .bili-avatar:not(.modified)') || document.querySelector('.comment-container .comment-send .bili-avatar:not(.modified)');
      if (avatarElement) {
        const gearElement = document.createElement('span');
        gearElement.id = 'open-setting-panel-btn';
        gearElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path></svg>';
        gearElement.style = `
          width: 48px;
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #F1F1F1;
          border-radius: 100%;
          border: 1px solid #DEDEDE;
          font-size: 48px;
          cursor: pointer;
          user-select: none;
        `;
        gearElement.onclick = showSettingPanel;

        avatarElement.innerHTML = '';
        avatarElement.style = `
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: none !important;
        `;
        avatarElement.classList.add('modified');
        avatarElement.appendChild(gearElement);
      }
    }, 1000);

    // entry 2: menu command
    GM_registerMenuCommand("自定义设置", showSettingPanel);
  }

})();