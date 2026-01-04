// ==UserScript==
// @name         ABEMA Little Tools
// @namespace    https://greasyfork.org/ja/scripts/465585
// @version      15
// @description  画質変更やNGワードなど、ABEMAをちょっとだけ便利にするかもしれない機能をまとめました。
// @match        https://abema.tv/*
// @connect      abema-tv.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT License
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465585/ABEMA%20Little%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/465585/ABEMA%20Little%20Tools.meta.js
// ==/UserScript==

(() => {
  'use strict';
  let mainElement = null;
  const sid = 'LittleTools';
  /**
   * localStorageからデータを安全に取得する
   * @param {string} key
   * @returns {Object<string, any>}
   */
  const getLS = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}') || {};
    } catch (e) {
      log(`${sid}: Failed to parse localStorage for ${key}`, e, 'error');
      return {};
    }
  };

  /** @type {Object<string, any>} */
  const ls = getLS(sid);
  /** @type {Object<string, any>} */
  const lsWord = getLS(`${sid}-Word`);
  /** @type {Object<string, any>} */
  const lsId = getLS(`${sid}-Id`);

  /**
   * スクリプト内の共通データ
   */
  const data = {
    archiveComments: [
      {
        createdAtMs: 0,
        elapsedMs: 0,
        id: '',
        isOwner: false,
        message: '',
        userId: '',
      },
    ],
    blockedUserId: '',
    comment: [{ userid: '', message: [''] }],
    commentAll: 0,
    commentId: new Set(),
    commentMouseEnter: false,
    footerFeed: '',
    href: '',
    newComments: false,
    ngId: new Set(lsId.ngId),
    /** @type {string[]} */
    ngWordText: [],
    /** @type {RegExp[]} */
    ngWordRe: [],
    program: {},
    programId: '',
    showVideoResolution: false,
    statsDomain: '',
    title: '',
    version: 15,
    videoSource: '',
  };

  /**
   * 定期実行（タイマー）のIDを管理
   */
  const interval = {
    archiveComments: 0,
    changePageTitle: 0,
    changeTargetQuality: 0,
    checkSwitchedProgram: 0,
    comment: 0,
    footer: 0,
    init: 0,
    navigation: 0,
    newcomment: 0,
    notification: 0,
    programInfo2: 0,
    resizeVideo: 0,
    resolution: 0,
    statsI: 0,
    statsT: 0,
    videoelement: 0,
    videoskip: 0,
    videosource: 0,
  };

  /**
   * DOM要素を選択するためのCSSセレクタ
   */
  const selector = {
    archiveCommentContainer: 'c-archive-comment-ArchiveCommentContainerView',
    commentBefore: `:is(.com-tv-CommentBlock, .com-comment-CommentItem):has(> div:not([data-${sid.toLowerCase()}-hidden])), .com-archive-comment-ArchiveCommentItem:has(> p:not([data-${sid.toLowerCase()}-hidden]))`,
    commentDuplicate: `:is(.com-tv-CommentBlock, .com-comment-CommentItem):has(> div[data-${sid.toLowerCase()}-duplicate]), .com-archive-comment-ArchiveCommentItem:has(> p[data-${sid.toLowerCase()}-duplicate])`,
    commentHidden: `:is(.com-tv-CommentBlock, .com-comment-CommentItem):has(> div[data-${sid.toLowerCase()}-hidden="true"]), .com-archive-comment-ArchiveCommentItem:has(> p[data-${sid.toLowerCase()}-hidden="true"])`,
    comenntAll:
      '.com-tv-CommentBlock, .com-archive-comment-ArchiveCommentItem, .com-comment-CommentItem',
    commentArea:
      '.com-tv-CommentArea, .c-tv-TimeshiftPlayerContainerView__comment-wrapper:has(.com-a-OnReachTop > ul), .com-comment-CommentContainerView',
    commentButton: 'button:has(svg[aria-label^="コメント"])',
    commentContinue:
      '.com-tv-CommentArea__continue-button, .c-archive-comment-ArchiveCommentContainerView__new-comment-button, .com-comment-CommentContinueButton',
    commentForm:
      '.com-o-CommentForm__opened-textarea,.com-comment-CommentTextarea__textarea',
    commentInner:
      '.com-tv-CommentBlock__inner, .com-archive-comment-ArchiveCommentItem__message, .com-comment-CommentItem__inner',
    commentInnerTs: `.com-archive-comment-ArchiveCommentItem__message:not([data-${sid.toLowerCase()}-user-id])`,
    commentList:
      '.com-a-OnReachTop > :is(div, ul), .com-comment-CommentList__inner > ul',
    commentMessage:
      '.com-tv-CommentBlock__message > span, .com-archive-comment-ArchiveCommentItem__message > span, .com-comment-CommentItem__body',
    commentReport: `.com-tv-CommentReportForm:not([data-${sid.toLowerCase()}-commentreportform]), .com-archive-comment-ArchiveCommentReportForm:not([data-${sid.toLowerCase()}-commentreportform]), .com-comment-CommentReportForm:not([data-${sid.toLowerCase()}-commentreportform])`,
    commentReport2: `.com-tv-CommentReportForm[data-${sid.toLowerCase()}-commentreportform], .com-archive-comment-ArchiveCommentReportForm[data-${sid.toLowerCase()}-commentreportform], .com-comment-CommentReportForm[data-${sid.toLowerCase()}-commentreportform]`,
    commentReportCancel:
      '.com-tv-CommentReportForm__cancel-button, .com-archive-comment-ArchiveCommentReportForm__cancel-button, .com-comment-CommentReportForm__cancel-button',
    commentReportSubmitLe: 'com-comment-CommentReportForm__submit-button',
    commentReportSubmitTs:
      'com-archive-comment-ArchiveCommentReportForm__submit-button',
    commentReportSubmitTv: 'com-tv-CommentReportForm__submit-button',
    commentReportLe: '.com-comment-CommentReportForm',
    commentReportTs: '.com-archive-comment-ArchiveCommentReportForm',
    commentReportTv: '.com-tv-CommentReportForm',
    commentTextarea: '.com-o-CommentForm__opened-textarea',
    commentTs: `.com-archive-comment-ArchiveCommentItem:has(.com-archive-comment-ArchiveCommentItem__message:not([data-${sid.toLowerCase()}-user-id]))`,
    footer:
      '.com-tv-LinearFooter,.com-vod-VideoControlBar,.com-live-event-LiveEventVideoController,.com-vod-LiveEventPayperviewControlBar',
    footerFeed: '.com-tv-LinearFooter__feed-super-text',
    footerVisible:
      '.com-tv-TVScreen__footer-container:not(.com-tv-TVScreen__footer-container--hidden),.com-vod-VODScreen-container:not(.com-vod-VODScreen-container--cursor-hidden),.com-live-event-LiveEventPlayerAreaLayout--controllers-visible',
    headerMenu: '.com-m-HeaderMenu',
    inner: '.c-application-DesktopAppContainer__content',
    main: '#main',
    mypageMenu: '.com-application-MypageMenu__menu',
    nextCancel: '.com-vod-VODNextProgramInfo__cancel-button',
    nextCancelMini:
      '.com-vod-VODScreenOverlayForMiniPlayer__cancel-next-program-button',
    notification: '.com-m-NotificationManager',
    notificationClose: '.com-m-Notification__button[aria-label="閉じる"]',
    notificationMessage: '.com-m-Notification__message span',
    programDetailButton: '.com-tv-LinearFooterProgramDetailButton',
    recommendedCancel:
      '.com-vod-VODFirstProgramOfRecommendedSeriesInfo__cancel-button',
    sideNavi: '.c-application-SideNavigation',
    sideNaviColl: 'c-application-SideNavigation--collapsed',
    sideNaviWrapColl: 'c-application-SideNavigation__wrapper--collapsed',
    sidePanelClose:
      '.com-tv-FeedSidePanel__close-button,.com-live-event-LiveEventStatsSidePanel__close,.com-comment-CommentAreaHeader__close-button',
    tvContainerScreen: '.c-tv-NowOnAirContainer__screen',
    tvScreen: '.com-tv-TVScreen',
    video: 'video[src]:not([style*="display: none;"])',
    videoContainer:
      '.com-a-Video__container, .com-live-event__LiveEventPlayerView',
    videoDblclick:
      '.com-vod-VideoControlBar,.c-vod-EpisodePlayerContainer-ad-container,.c-tv-TimeshiftPlayerContainerView__ad-container,.com-live-event-LiveEventPlayerSectionLayout__player-area',
    videoMainPlayer:
      '.com-vod-VODMiniPlayerWrapper__player:not(.com-vod-VODMiniPlayerWrapper__player--bg):not(.com-vod-VODMiniPlayerWrapper__player--mini),.com-live-event-LiveEventPlayerAreaLayout__player',
    videoSkip: '.com-video_ad-AdSkipButton',
    videoSkip2: '.com-video_ad-AdSkipButton:not([disabled])',
  };

  /**
   * スクリプトの設定値
   */
  const setting = {
    _ngid: [0, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000],
    closeNotification: ls.closeNotification,
    closeSidePanel: ls.closeSidePanel,
    commentFontSize: ls.commentFontSize,
    commentFontSizeNum: ls.commentFontSizeNum,
    dblclickScroll: ls.dblclickScroll,
    enterKey: ls.enterKey,
    escKey: ls.escKey,
    headerPosition: ls.headerPosition,
    hiddenButtonText: ls.hiddenButtonText,
    hiddenCommentList: ls.hiddenCommentList,
    hiddenCommentListNum: ls.hiddenCommentListNum,
    hiddenCommentListNum2: ls.hiddenCommentListNum2,
    hiddenIdAndPlan: ls.hiddenIdAndPlan,
    highlightFirstComment: ls.highlightFirstComment,
    highlightNewComment: ls.highlightNewComment,
    mouseoverNavigation: ls.mouseoverNavigation,
    newCommentOneByOne: ls.newCommentOneByOne,
    nextProgramInfo: ls.nextProgramInfo,
    ngConsole: ls.ngConsole,
    ngId: lsId.ngId ? [...lsId.ngId] : [],
    ngIdEnable: ls.ngIdEnable,
    ngIdMaxSize: ls.ngIdMaxSize,
    ngWord: lsWord.ngWord,
    ngWordEnable: ls.ngWordEnable,
    overlapSidePanel: ls.overlapSidePanel,
    qualityEnable: ls.qualityEnable,
    recommendedSeriesInfo: ls.recommendedSeriesInfo,
    reduceCommentSpace: ls.reduceCommentSpace,
    reduceNavigation: ls.reduceNavigation,
    scrollNewComment: ls.scrollNewComment,
    semiTransparent: ls.semiTransparent,
    sidePanelBackground: ls.sidePanelBackground,
    sidePanelCloseButton: ls.sidePanelCloseButton,
    sidePanelSize: ls.sidePanelSize,
    sidePanelSizeNum: ls.sidePanelSizeNum,
    showProgramDetail: ls.showProgramDetail,
    skipVideo: ls.skipVideo,
    smallFontSize: ls.smallFontSize,
    stopCommentScroll: ls.stopCommentScroll,
    targetQuality: ls.targetQuality,
    videoPadding: ls.videoPadding,
    videoResolution: ls.videoResolution,
    viewCounter: ls.viewCounter,
    reportFormCommentList: ls.reportFormCommentList,
    programInfo1: ls.programInfo1,
    programInfo2: ls.programInfo2,
    programInfo2Num: ls.programInfo2Num,
  };

  /**
   * ビデオ要素の状態管理
   */
  const video = {
    clientHeight: 0,
    clientWidth: 0,
    maxHeight: 0,
    pixelRatio: 0,
    src: '',
    videoHeight: 0,
    videoWidth: 0,
  };

  /**
   * NG IDを追加する
   */
  const addNgId = () => {
    log('addNgId');
    clearInterval(interval.newcomment);
    const blocked = checkBlockedUser(false);
    if (
      blocked >= 100 &&
      setting.ngIdMaxSize &&
      setting._ngid[setting.ngIdMaxSize] > data.ngId.size &&
      data.blockedUserId &&
      !data.ngId.has(data.blockedUserId)
    ) {
      setting.ngId.push(data.blockedUserId);
      lsId.ngId.push(data.blockedUserId);
      data.ngId.add(data.blockedUserId);
      log('addNgId', data.blockedUserId, data.ngId.size);
      saveStorage();
      setTimeout(() => {
        checkBlockedUser(true);
      }, 1000);
    } else {
      log(
        'not add NGiD',
        blocked,
        setting.ngIdMaxSize,
        setting._ngid[setting.ngIdMaxSize],
        data.ngId.size,
        data.blockedUserId,
        data.ngId.has(data.blockedUserId)
      );
    }
  };

  /**
   * スタイルを追加
   * @param {string} s
   */
  const addStyle = (s) => {
    const init = `
:root {
  --${sid}-pi-font-size: 14px;
  --${sid}-pi-title-size: clamp(1rem, 0.8rem + 1cqw, 2rem);
  --${sid}-pi2-font-shadow: calc(var(--${sid}-pi-font-size) / 2);
  --${sid}-pi2-title-shadow: calc(var(--${sid}-pi-title-size) / 2);
}
:is(.com-tv-CommentBlock, .com-comment-CommentItem):has(
  > div[data-${sid.toLowerCase()}-hidden="true"],
  > div[data-${sid.toLowerCase()}-ngword],
  > div[data-${sid.toLowerCase()}-ngid]
),
.com-archive-comment-ArchiveCommentItem:has(
  > p[data-${sid.toLowerCase()}-hidden="true"],
  > p[data-${sid.toLowerCase()}-ngword],
  > p[data-${sid.toLowerCase()}-ngid]
),
.${sid}_ProgramInfo_hidden,
.${sid}_Settings_hidden,
.${sid}_Settings-tab-switch {
  display: none;
}
#${sid}_Settings {
  background-color: #F9FCFF;
  border: 2px solid #CCCCCC;
  border-radius: 8px;
  box-shadow: 4px 4px 16px rgba(0,0,0,0.5);
  color: black;
  left: 20px;
  max-height: calc(100vh - 40px);
  max-width: calc(100vw - 40px);
  min-width: 45em;
  overflow: auto;
  padding: 8px;
  position: fixed;
  top: 20px;
  user-select: none;
  width: min-content;
  z-index: 9900;
  label[title] {
    cursor: help;
  }
  input[type="number"],
  select {
    margin-left: 8px;
    margin-right: 2px;
  }
}
#main:has(.c-tv-NowOnAirContainer__side-panel--shown) ~ #${sid}_Settings {
  max-width: calc(100vw - 460px);
}
#${sid}_Settings-header {
  text-align: center;
}
#${sid}_Settings-main {
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0;
  &::after {
    background: #8899aa;
    content: '';
    display: block;
    height: 1px;
    order: -1;
    width: 100%;
  }
  fieldset {
    border: 1px solid #CCCCCC;
    margin: 2px 0;
    padding: 4px 8px;
  }
  fieldset + label {
    margin-top: 2px;
  }
  fieldset + fieldset {
    margin-top: 10px;
  }
  pre {
    background-color: #FFFFEE;
    border: 1px solid #DDDDDD;
    margin-left: 1em;
    padding: 4px;
    user-select: text;
    width: min-content;
  }
  :is(label, details):not(.${sid}_Settings-tab-label) {
    display: inline-block;
    width: 100%;
  }
  :is(label, details):not(.${sid}_Settings-tab-label):hover {
    background-color: #E3ECF6;
  }
  details {
    transition: 0.5s;
  }
  input[type="checkbox"] {
    position: relative;
    top: 2px;
    margin-right: 4px;
  }
  summary {
    cursor: pointer;
    display: list-item;
    &::before {
      background: #88AA88;
      border-radius: 50%;
      color: #FFFFFF;
      content: "?";
      display: inline-block;
      font-size: 85%;
      font-weight: bold;
      height: 1.5em;
      line-height: 1.5;
      margin-right: 4px;
      text-align: center;
      vertical-align: 2px;
      width: 1.5em;
    }
  }
  select {
    appearance: auto;
    cursor: pointer;
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 4px 8px;
  }
  input + input,
  input + input + input,
  legend:has(input),
  legend:has(input) ~ label {
    color: gray;
  }
  input:checked + input,
  input:checked + input + input,
  legend:has(input:checked),
  legend:has(input:checked) ~ label {
    color: black;
  }
  input + input,
  input + input + input,
  legend:has(input):has(
    ~ #${sid}_Settings-ngWord,
    ~ label #${sid}_Settings-ngIdMaxSize,
    ~ label #${sid}_Settings-targetQuality
  ) {
    background-color: #DDDDDD;
  }
  input:checked + input,
  input:checked + input + input,
  legend:has(input:checked):has(
    ~ #${sid}_Settings-ngWord,
    ~ label #${sid}_Settings-ngIdMaxSize,
    ~ label #${sid}_Settings-targetQuality
  ) {
    background-color: white;
  }
}
#${sid}_Settings-commentFontSizeNum,
#${sid}_Settings-programInfo2Num {
  text-align: center;
  width: 3.5em;
}
#${sid}_Settings-hiddenCommentListNum,
#${sid}_Settings-hiddenCommentListNum2 {
  text-align: center;
  width: 4em;
}
#${sid}_Settings-sidePanelSizeNum {
  text-align: center;
  width: 5em;
}
#${sid}_Settings-ngWord {
  height: 6em;
  margin-top: 8px;
  max-width: calc(100vw - 118px);
  min-height: 6em;
  min-width: 40em;
  width: 100%;
}
#${sid}_Settings-ngWord-error {
  display: none;
  margin-bottom: 4px;
  p {
    color: red;
  }
  pre {
    font-weight: bold;
    margin-top: 4px;
    padding: 4px 8px;
  }
}
#${sid}_Settings-ngIdMaxSize {
  text-align: right;
}
#${sid}_Settings-ngId-record {
  margin-left: 1em;
}
#${sid}_Settings-footer {
  text-align: right;
  button {
    border: 1px solid gray;
    border-radius: 4px;
    margin: 8px;
    padding: 4px;
    width: 8em;
  }
}
#${sid}_Settings-ok {
  background-color: #EEEEEE;
}
#${sid}_Settings-cancel {
  background-color: #EEEEEE;
}
.${sid}_Settings-tab-label {
  background: #BCBCBC;
  border-radius: 4px 4px 0 0;
  color: White;
  cursor: pointer;
  flex: 1;
  font-weight: bold;
  order: -1;
  padding: 2px 4px;
  position: relative;
  text-align: center;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  z-index: 1;
}
.${sid}_Settings-tab-label:not(:last-of-type) {
  margin-right: 5px;
}
.${sid}_Settings-tab-content {
  height: 0;
  opacity: 0;
  overflow: hidden;
  width: 100%;
}
.${sid}_Settings-tab-switch:checked + .${sid}_Settings-tab-label {
  background: #8899aa;
}
.${sid}_Settings-tab-switch:checked + .${sid}_Settings-tab-label + .${sid}_Settings-tab-content {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  height: auto;
  opacity: 1;
  overflow: auto;
  padding: 8px;
  transition: .5s opacity;
}
#${sid}_CommentReportForm-NgComment {
  color: #E6E6E6;
  font-size: 13px;
  margin-top: 12px;
}
#${sid}_CommentReportForm-NgCommentHeader {
  font-size: 12px;
}
#${sid}_CommentReportForm-NgCommentList {
  background-color: #333333;
  margin-top: 4px;
  padding: 8px 4px;
  p + p {
    margin-top: 0.8em;
  }
}
#${sid}_VideoResolution {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), #000000);
  bottom: 0px;
  color: #ccc;
  display: none;
  font-size: 12px;
  height: 16px;
  left: 155px;
  padding: 0 2px;
  position: absolute;
  user-select: none;
  white-space: nowrap;
}
#${sid}_ProgramInfo1,
#${sid}_ProgramInfo2 {
  border-radius: 8px;
  color: white;
  font-size: var(--${sid}-pi-font-size);
  left: 24px;
  max-height: calc(100cqh - 206px);
  max-width: calc(100cqw - 84px);
  overflow: auto;
  padding: 2px 4px;
  position: fixed;
  scrollbar-width: thin;
  top: 68px;
  z-index: 3;
}
#${sid}_ProgramInfo1 {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(50, 50, 50, 0.5));
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.5);
  text-shadow:
    -1px -1px 1px black, -1px 0px 1px black, -1px 1px 1px black,
     0px -1px 1px black,  0px 1px 1px black,
     1px -1px 1px black,  1px 0px 1px black,  1px 1px 1px black;
}
#${sid}_ProgramInfo2 {
  line-height: calc(var(--${sid}-pi-font-size) + var(--${sid}-pi2-font-shadow) * 2);
  min-width: calc(100cqw - 316px);
  text-shadow:
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222,
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222,
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222,
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222,
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222,
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222,
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222,
    0 0 var(--${sid}-pi2-font-shadow) #222, 0 0 var(--${sid}-pi2-font-shadow) #222;
  .${sid}_ProgramInfo-title {
    line-height: calc(var(--${sid}-pi-title-size) + var(--${sid}-pi2-title-shadow) * 2);
    padding: 0 var(--${sid}-pi2-title-shadow);
  }
}
:is(#${sid}_ProgramInfo1, #${sid}_ProgramInfo2) a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.${sid}_ProgramInfo-text {
  padding: 0 var(--${sid}-pi2-font-shadow);
}
.${sid}_ProgramInfo-title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  font-size: var(--${sid}-pi-title-size);
  overflow: hidden;
  text-overflow: ellipsis;
}
.${sid}_ProgramInfo-labels {
  margin-right: 0.25em;
  > span {
    font-size: calc(1.5rem - 2px);
    margin-right: 4px;
    padding: 2px 3px;
    vertical-align: 1px;
  }
}
.${sid}_ProgramInfo-label-new,
.${sid}_ProgramInfo-label-live {
  background-color: red;
  color: white;
  text-shadow: 1px 1px black;
}
.${sid}_ProgramInfo-label-bundle,
.${sid}_ProgramInfo-label-pickup {
  background-color: white;
  color: black;
  text-shadow: 0px 0px;
}
.${sid}_ProgramInfo-label-first {
  background-color: black;
  border: 1px solid white;
  color: white;
  text-shadow: 0px 0px;
}
.${sid}_ProgramInfo-startEndAt {
  margin-top: 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.${sid}_ProgramInfo-tsAt {
  display: flex;
  flex-wrap: wrap;
  margin: 0.5em 0 1.5em;
}
.${sid}_ProgramInfo-tsFreeEndAt,
.${sid}_ProgramInfo-tsEndAt {
  flex: 0 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.${sid}_ProgramInfo-tsFreeEndAt {
  margin-right: 1em;
}
.${sid}_ProgramInfo-detailHighlight,
.${sid}_ProgramInfo-content {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  display: -webkit-box;
  margin-top: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
}
.${sid}_ProgramInfo-credit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1em;
}
.${sid}_ProgramInfo-credit-casts,
.${sid}_ProgramInfo-credit-crews {
  
}
.${sid}_ProgramInfo-credit2 {
  
}
.${sid}_ProgramInfo-credit2-casts {
  dl {
    display: grid;
    grid-auto-flow: dense;
    grid-column-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
  }
  dt {
    grid-column: 1 / -1;
  }
}
.${sid}_ProgramInfo-credit-copyrights {
  grid-column: span 2;
  margin-top: 1em;
}
.c-tv-NowOnAirContainer__screen:has(~ .c-tv-NowOnAirContainer__side-panel[aria-hidden="false"]) {
  container-name: tvScreen;
  container-type: inline-size;
}
@container tvScreen (max-width: 40em) {
  .${sid}_ProgramInfo-credit-casts,
  .${sid}_ProgramInfo-credit-crews {
    grid-column: span 2;
  }
  .${sid}_ProgramInfo-credit-casts {
    margin-bottom: 1em;
  }
}
    `,
      overlapSidePanel = `
/*右側のサイドパネルを動画に重ねて表示する*/
.c-tv-NowOnAirContainer__tv-container,
.com-vod-VODResponsiveMainContent--wide-mode .c-tv-TimeshiftPlayerContainerView-screen,
.com-vod-VODResponsiveMainContent--with-side-panel {
  width: 100vw !important;
}
.c-tv-NowOnAirContainer__screen--with-side-panel {
  width: calc(100% - ${
    setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
  }px) !important;
  .com-tv-TVScreen__footer-container {
    padding-right: ${
      setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
    }px !important;
  }
}
.com-tv-TVScreen__player {
  height: 100vh !important;
}
.com-a-Text--info.com-a-Text--dark,
.com-a-Text--info.com-a-Text--light {
  color: #DDDDDD !important;
}
.com-tv-CommentBlock,
.com-tv-FeedProgramDetailContainerView__contents :is(h2, h3, h2+p, h3+p, dd),
.com-tv-FeedProgramDetailContainerView__contents span:not(.com-tv-FeedProgramDetailExternalLink__button-text),
.com-tv-FeedSidePanel__close-button-text,
.com-comment-CommentItem__body,
.com-archive-comment-ArchiveCommentHead__count > span,
.com-archive-comment-ArchiveCommentItem__message > span {
  text-shadow:
    -1px -1px 1px black, -1px 0px 1px black, -1px 1px 1px black,
     0px -1px 1px black,  0px 1px 1px black,
     1px -1px 1px black,  1px 0px 1px black,  1px 1px 1px black !important;
}
.com-tv-CommentBlock__message > span,
.com-comment-CommentItem__body,
.com-archive-comment-ArchiveCommentHead__count > span,
.com-archive-comment-ArchiveCommentItem__message > span {
  color: white !important;
}
.c-tv-NowOnAirContainer__side-panel,
.com-tv-CommentArea,
.com-tv-CommentArea__comment-form,
.com-tv-CommentBlock,
.com-tv-FeedProgramDetailContainerView__contents,
.com-tv-FeedSidePanel__header,
.com-comment-CommentContainerView,
.com-live-event-LiveEventStatsSidePanel,
.c-tv-TimeshiftPlayerContainerView__comment,
.com-archive-comment-ArchiveCommentItem,
.c-archive-comment-ArchiveCommentContainerView__no-input {
  background-color: rgba(0, 0, 0, 0) !important;
}
.com-tv-CommentBlock__inner:hover,
.com-comment-TwitterSigninButton:hover,
.com-comment-CommentItem__inner:hover,
.com-archive-comment-ArchiveCommentItem:hover {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
.com-tv-CommentBlock__time {
  opacity: 0.6 !important;
}
.com-o-CommentForm__can-post .com-o-CommentForm__opened-textarea-wrapper,
.com-comment-CommentTextarea__textarea {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
.com-o-CommentForm__can-post .com-o-CommentForm__opened-textarea:focus,
.com-comment-CommentTextarea__textarea:focus {
  background-color: rgba(255, 255, 255, 0.8) !important;
}
.com-o-CommentForm__opened-textarea-wrapper {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
.com-o-CommentForm__twitter-button,
.com-comment-TwitterSigninButton,
.com-comment-TwitterSignoutButton,
.com-comment-CommentAreaHeader__comment-count {
  opacity: 0.2 !important;
}
.com-o-CommentForm__twitter-button:hover,
.com-comment-TwitterSigninButton:hover,
.com-comment-TwitterSignoutButton:hover,
.com-comment-CommentAreaHeader__comment-count:hover {
  opacity: 1 !important;
}
.com-tv-FeedSidePanel__contents {
  height: 98% !important;
}
.com-a-Button--primary,
.com-comment-CommentSubmitButton {
  background-color: rgba(221, 170, 0, 0.5) !important;
}
.com-a-Button--primary:hover:not([disabled]),
.com-comment-CommentSubmitButton:hover:not([disabled]) {
  background-color: rgba(221, 170, 0, 1) !important;
}
.c-tv-NowOnAirContainer__screen--with-side-panel :is(
  .com-tv-SlotMyListButtonOnPlayerContainerView,
  .com-tv-TVScreen__ad-link-button
) {
  bottom: 124px !important;
  right: ${
    setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
  }px !important;
  transform: translateX(500px) !important;
}
.com-tv-SlotMyListButtonOnPlayerContainerView--shown,
.com-tv-TVScreen__ad-link-button--shown {
  transform: translateX(0) !important;
}
.com-question-QuestionContainerView,
.com-vod-VODResponsiveMainContent--with-side-panel .com-live-event-LiveEventOverlayControllerLayout__bottom-buttons {
  right: ${
    setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
  }px !important;
}
.com-vod-VODResponsiveMainContent--with-side-panel .com-vod-LiveEventPayperviewControlBar,
.com-vod-VODResponsiveMainContent--with-side-panel .com-vod-VideoControlBar__right {
  margin-right: ${
    setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
  }px !important;
}
.com-tv-FeedProgramDetailCommentCounter,
.com-tv-FeedProgramDetailHeader__date,
.com-tv-FeedProgramDetailViewCounter {
  color: #CCCCCC !important;
}
.com-live-event-LiveEventPlayerSectionLayout__side-panel {
  height: calc(100vh - 10px);
  position: absolute;
  right: 0;
}
.com-live-event-LiveEventStatsSidePanel {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
.com-comment-CommentAreaHeader__close-button:hover {
  color: #FFFFFF;
}
.com-o-CommentForm__opened-textarea:focus::placeholder {
  color: black;
}
.c-tv-TimeshiftPlayerContainerView__comment-wrapper {
  z-index: 20;
}
.c-tv-TimeshiftPlayerContainerView--has-comment .com-vod-VODScreen-video-control,
.c-tv-TimeshiftPlayerContainerView--has-comment .c-video_ad-VideoAdContainerView__info {
  margin: 0 !important;
  width: calc(100% - ${
    setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
  }px);
  z-index: 30;
}
.c-tv-TimeshiftPlayerContainerView__comment:hover .com-archive-comment-ArchiveCommentHead__close {
  background-color: rgba(0, 0, 0, 0.3);
  color: white !important;
}
.c-archive-comment-ArchiveCommentContainerView__body-waiting-show {
  opacity: 0 !important;
  + .c-archive-comment-ArchiveCommentContainerView__list-wrapper {
    opacity: 0.5;
  }
}
    `,
      highlightNewComment = `
/*新規コメントと自分のコメントを強調表示する*/
.com-tv-CommentBlock__inner--active,
.com-archive-comment-ArchiveCommentItem__is-active,
.com-tv-CommentBlock--new,
.com-comment-CommentItem[data-${sid.toLowerCase()}-Own] .com-comment-CommentItem__body,
.com-comment-CommentItem__inner[data-${sid.toLowerCase()}-Own] .com-comment-CommentItem__body {
  text-shadow:
    -1px -1px 1px black, -1px 0px 1px black, -1px 1px 1px black,
     0px -1px 1px black,  0px 1px 1px black,
     1px -1px 1px black,  1px 0px 1px black,  1px 1px 1px black,
    -2px -2px 1px rgba(255,165,0,0.3), -2px 0px 1px rgba(255,165,0,0.3), -2px 2px 1px rgba(255,165,0,0.3),
     0px -2px 1px rgba(255,165,0,0.3),  0px 2px 1px rgba(255,165,0,0.3),
     2px -2px 1px rgba(255,165,0,0.3),  2px 0px 1px rgba(255,165,0,0.3),  2px 2px 1px rgba(255,165,0,0.3) !important;
}
.com-tv-CommentBlock__inner--active,
.com-archive-comment-ArchiveCommentItem__is-active,
.com-comment-CommentItem[data-${sid.toLowerCase()}-Own],
.com-comment-CommentItem__inner[data-${sid.toLowerCase()}-Own] {
  background-color: rgba(128,83,0,0.3) !important;
}
    `,
      highlightFirstComment = `
/*初回コメントと連投コメントを強調表示する*/
.com-tv-CommentBlock__inner[data-${sid.toLowerCase()}-Green],
.com-comment-CommentItem__inner[data-${sid.toLowerCase()}-Green] .com-comment-CommentItem__body,
.com-archive-comment-ArchiveCommentItem__message[data-${sid.toLowerCase()}-Green] span {
  text-shadow:
      -1px -1px 1px black, -1px 0px 1px black, -1px 1px 1px black,
      0px -1px 1px black,  0px 1px 1px black,
      1px -1px 1px black,  1px 0px 1px black,  1px 1px 1px black,
      -2px -2px 1px rgba(0,192,0,0.6), -2px 0px 1px rgba(0,192,0,0.6), -2px 2px 1px rgba(0,192,0,0.6),
      0px -2px 1px rgba(0,192,0,0.6),  0px 2px 1px rgba(0,192,0,0.6),
      2px -2px 1px rgba(0,192,0,0.6),  2px 0px 1px rgba(0,192,0,0.6),  2px 2px 1px rgba(0,192,0,0.6) !important;
}
.com-tv-CommentBlock__inner[data-${sid.toLowerCase()}-Purple],
.com-comment-CommentItem__inner[data-${sid.toLowerCase()}-Purple] .com-comment-CommentItem__body,
.com-archive-comment-ArchiveCommentItem__message[data-${sid.toLowerCase()}-Purple] span {
  text-shadow:
    -1px -1px 1px black, -1px 0px 1px black, -1px 1px 1px black,
     0px -1px 1px black,  0px 1px 1px black,
     1px -1px 1px black,  1px 0px 1px black,  1px 1px 1px black,
    -2px -2px 1px rgba(192,96,192,0.6), -2px 0px 1px rgba(192,96,192,0.6), -2px 2px 1px rgba(192,96,192,0.6),
     0px -2px 1px rgba(192,96,192,0.6),  0px 2px 1px rgba(192,96,192,0.6),
     2px -2px 1px rgba(192,96,192,0.6),  2px 0px 1px rgba(192,96,192,0.6),  2px 2px 1px rgba(192,96,192,0.6) !important;
}
.com-tv-CommentBlock__inner[data-${sid.toLowerCase()}-Red],
.com-comment-CommentItem__inner[data-${sid.toLowerCase()}-Red] .com-comment-CommentItem__body,
.com-archive-comment-ArchiveCommentItem__message[data-${sid.toLowerCase()}-Red] span {
  text-shadow:
    -1px -1px 1px black, -1px 0px 1px black, -1px 1px 1px black,
     0px -1px 1px black,  0px 1px 1px black,
     1px -1px 1px black,  1px 0px 1px black,  1px 1px 1px black,
    -2px -2px 1px rgba(255,0,0,0.8), -2px 0px 1px rgba(255,0,0,0.8), -2px 2px 1px rgba(255,0,0,0.8),
     0px -2px 1px rgba(255,0,0,0.8),  0px 2px 1px rgba(255,0,0,0.8),
     2px -2px 1px rgba(255,0,0,0.8),  2px 0px 1px rgba(255,0,0,0.8),  2px 2px 1px rgba(255,0,0,0.8) !important;
}
.com-tv-CommentBlock__inner[data-${sid.toLowerCase()}-Yellow],
.com-comment-CommentItem__inner[data-${sid.toLowerCase()}-Yellow] .com-comment-CommentItem__body,
.com-archive-comment-ArchiveCommentItem__message[data-${sid.toLowerCase()}-Yellow] span {
  text-shadow:
    -1px -1px 1px black, -1px 0px 1px black, -1px 1px 1px black,
     0px -1px 1px black,  0px 1px 1px black,
     1px -1px 1px black,  1px 0px 1px black,  1px 1px 1px black,
    -2px -2px 1px rgba(224,224,0,0.8), -2px 0px 1px rgba(224,224,0,0.8), -2px 2px 1px rgba(224,224,0,0.8),
     0px -2px 1px rgba(224,224,0,0.8),  0px 2px 1px rgba(224,224,0,0.8),
     2px -2px 1px rgba(224,224,0,0.8),  2px 0px 1px rgba(224,224,0,0.8),  2px 2px 1px rgba(224,224,0,0.8) !important;
}
    `,
      commentFontSize = `
/*コメントの文字サイズを変更する*/
.com-tv-CommentBlock__message > span,
.com-comment-CommentItem__body,
.com-archive-comment-ArchiveCommentItem__message > span {
  font-size: ${setting.commentFontSizeNum}px !important;
}
      `,
      reduceCommentSpace = `
/*コメントの余白を減らす＆行間を狭める*/
.com-tv-CommentBlock__inner,
.com-archive-comment-ArchiveCommentItem {
  padding: 2px 4px !important;
}
.com-comment-CommentItem__body {
  padding: 4px 0 !important;
}
.com-comment-CommentItem__body-sub-wrapper {
  padding: 0 4px !important;
}
.com-comment-CommentItem__sub {
  width: auto !important;
}
    `,
      sidePanelCloseButton = `
/*サイドパネル上端にマウスカーソルを近づけたとき閉じるボタンを表示*/
.com-tv-FeedSidePanel__close-button {
  background-color: rgba(64,64,64,0.8) !important;
}
.com-tv-FeedSidePanel__contents {
  transform: translateY(10px) !important;
}
.com-tv-FeedSidePanel__header {
  position: absolute !important;
  transform: translateY(-58px) !important;
  transition: transform 0.2s !important;
  z-index: 99 !important;
  &:hover {
    transform: translateY(0px) !important;
  }
}
    `,
      sidePanelSize = `
/*サイドパネルの幅を変更する*/
.c-tv-NowOnAirContainer__side-panel,
.com-tv-FeedSidePanel,
.com-live-event-LiveEventPlayerSectionLayout__side-panel,
.c-tv-TimeshiftPlayerContainerView--has-comment .c-tv-TimeshiftPlayerContainerView__comment-wrapper,
.c-tv-TimeshiftPlayerContainerView__comment {
  width: ${
    setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
  }px !important;
}
.c-tv-NowOnAirContainer__screen--with-side-panel,
.com-application-Header--shrunk,
.c-common-HeaderContainer-header--shrunk {
  width: calc(100% - ${
    setting.sidePanelSize ? setting.sidePanelSizeNum : '320'
  }px) !important;
}
      `,
      showProgramDetail = `
/*サイドパネルに記載された番組情報の詳細を常に表示する*/
.com-tv-FeedSidePanel__contents #com-vod-VODDetailsAccordion__details {
  height: auto !important;
}
.com-tv-FeedSidePanel__contents .com-vod-VODDetailsAccordion__details--collapsed {
  visibility: visible !important;
}
.com-tv-FeedSidePanel__contents .com-vod-VODDetailsAccordion__toggle-collapsed-details-button-paragraph {
  display: none !important;
}
    `,
      hiddenButtonText = `
/*最初から見る・番組情報・コメントボタンのテキストを隠す*/
.com-tv-LinearFooterChasePlayButton,
.com-tv-LinearFooterProgramDetailButton,
.com-tv-LinearFooterCommentButton {
  transition: all 0.2s !important;
  width: 44px !important;
}
.com-tv-LinearFooterChasePlayButton:hover:not(.com-tv-LinearFooterChasePlayButton--shrunk) {
  width: 132px !important;
}
.com-tv-LinearFooterProgramDetailButton:hover:not(.com-tv-LinearFooterProgramDetailButton--shrunk),
.com-tv-LinearFooterCommentButton:hover:not(.com-tv-LinearFooterCommentButton--shrunk) {
  width: 100px !important;
}
.com-tv-LinearFooterChasePlayButton__text,
.com-tv-LinearFooterProgramDetailButton__text,
.com-tv-LinearFooterCommentButton__text {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
}
.com-tv-LinearFooterChasePlayButton:hover .com-tv-LinearFooterChasePlayButton__text,
.com-tv-LinearFooterProgramDetailButton:hover .com-tv-LinearFooterProgramDetailButton__text,
.com-tv-LinearFooterCommentButton:hover .com-tv-LinearFooterCommentButton__text {
  width: auto;
}
    `,
      hiddenCommentList = `
/*コメントリストを半透明化*/
.com-a-OnReachTop, .com-comment-CommentList__inner {
  opacity: ${Number(setting.hiddenCommentListNum) / 100};
}
    `,
      hiddenCommentList2 = `
/*コメントリストを半透明化2*/
.com-a-OnReachTop, .com-comment-CommentList__inner {
  opacity: ${Number(setting.hiddenCommentListNum2) / 100};
}
    `,
      videoResolution = `
#${sid}_VideoResolution {
  display: block;
}
      `,
      semiTransparent = `
/*ヘッダーやサイドナビゲーションなどを半透明にする*/
.com-application-Header,
.com-application-Header:before {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), #000000) !important;
}
.com-InputText__input--dark-strong:not(:focus),
.com-live-event-LiveEventOverlayControllerLayout__bottom-buttons .com-a-Button--dark:not(:hover) {
  background: rgba(33, 33, 33, 0.2) !important;
}
.c-application-SideNavigation__wrapper {
  background-color: rgba(0, 0, 0, 0.2) !important;
  background-image: linear-gradient(270deg,transparent, #000) !important;
}
.c-application-SideNavigation__footer {
  background-color: rgba(0, 0, 0, 0) !important;
}
.com-tv-LinearFooter__button button {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
.c-application-SideNavigation__wrapper:hover,
.com-tv-LinearFooter__button button:hover {
  background-color: rgba(0, 0, 0, 0.8) !important;
}
.com-tv-LinearChannelSwitcher__button {
  opacity: 0.5 !important;
}
.com-playback-Volume__icon {
  opacity: 0.8 !important;
}
.com-tv-LinearChannelSwitcher__button:hover,
.com-playback-Volume__icon:hover {
  opacity: 1 !important;
}
.com-tv-RemoteController__button:hover {
  border: 2px outset #555555 !important;
}
.com-a-Tooltip {
  background-color: rgba(33, 33, 33, 0.5) !important;
}
.com-question-QuestionContainerView .com-question-VoteContent {
  background-color: rgba(23, 23, 23, 0.6) !important;
}
.com-question-QuestionContainerView .com-question-VoteContent:hover {
  background-color: rgba(23, 23, 23, 1) !important;
}
.com-question-VoteButton:hover:not(.com-question-VoteButton--highest) {
  background-color: #171717 !important;
}
      `,
      smallFontSize = `
/*ヘッダーやフッターの一部の文字サイズを小さくする*/
.com-InputText__input {
  font-size: 14px !important;
}
.com-tv-LinearFooter__feed-super {
  font-size: 16px !important;
}
      `,
      headerPosition = `
/*ヘッダーを追従表示にする*/
body:not(.com-timetable-TimeTable__body-timetable) :is(
  .c-common-HeaderContainer-header,
  .com-application-Header:not(.com-application-Header--shrunk)
) {
  position: relative !important;
}
body:not(.com-timetable-TimeTable__body-timetable) .c-application-SideNavigation__wrapper {
  padding-top: 0 !important;
}
.com-a-ResponsiveMainContent {
  margin-top: 0 !important;
}
.c-application-SideNavigation__wrapper {
  height: calc(100vh - 68px) !important;
}
#main:has(.com-application-Header--scrolled) .c-application-SideNavigation__wrapper {
  height: 100vh !important;
  top: 0;
}
      `,
      videoPadding = `
/*動画周辺の余白を減らす*/
html:has(.com-vod-VODResponsiveMainContent--wide-mode, .com-vod-VODResponsiveMainContent--with-side-panel) {
  scrollbar-width: none;
}
.com-vod-VODResponsiveMainContent {
  margin: 0 !important;
  padding: 0 !important;
  .com-m-BreadcrumbList {
    padding: 7px 0;
  }
}
.com-vod-VODResponsiveMainContent__inner {
  max-width: none !important;
}
.c-application-DesktopAppContainer__content-container:has(.com-vod-VODResponsiveMainContent--wide-mode, .com-vod-VODResponsiveMainContent--with-side-panel) > :is(
  .c-application-SideNavigation--collapsed,
  .c-application-SideNavigation__wrapper--collapsed
) {
  width: 0 !important;
}
      `,
      mouseoverNavigation = `
/*左端にマウスオーバーしたときサイドナビゲーションを表示する*/
.c-application-SideNavigation--collapsed,
.c-application-SideNavigation__wrapper--collapsed {
  width: 16px !important;
}
.c-application-SideNavigation--collapsed:not(:hover) {
  opacity: 0 !important;
}
.com-tv-TVScreen__footer-container--sidenav-collapsed {
  padding-left: 0 !important;
}
.com-timetable-DesktopTimeTableWrapper__channel-content-header-wrapper--side-navigation-collapsed,
.com-timetable-TimeTableListTimeAxis--is-collapsed-side-navigation {
  left: 8px !important;
}
.c-application-DesktopAppContainer__content:has(.com-live-event-LiveEventPlayerSectionLayout__player-area) {
  left: 0;
  position: absolute;
}
      `,
      sidePanelBackground = `
/*サイドパネルの背景を半透明にする*/
.c-tv-NowOnAirContainer__side-panel,
.com-live-event-LiveEventPlayerSectionLayout__side-panel,
.c-tv-TimeshiftPlayerContainerView__comment {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
      `,
      hiddenIdAndPlan = `
/*サイドナビゲーションのIDと視聴プランを隠す*/
.com-application-SideNavigationAccountItem__info-item {
  display: none !important;
}
      `,
      style = document.createElement('style');
    if (s === 'init') {
      style.textContent = init;
    } else if (s === 'highlightFirstComment') {
      style.textContent = highlightFirstComment;
    } else if (s === 'highlightNewComment') {
      style.textContent = highlightNewComment;
    } else if (s === 'overlapSidePanel') {
      style.textContent = overlapSidePanel;
    } else if (s === 'commentFontSize') {
      style.textContent = commentFontSize;
    } else if (s === 'reduceCommentSpace') {
      style.textContent = reduceCommentSpace;
    } else if (s === 'sidePanelCloseButton') {
      style.textContent = sidePanelCloseButton;
    } else if (s === 'showProgramDetail') {
      style.textContent = showProgramDetail;
    } else if (s === 'sidePanelSize') {
      style.textContent = sidePanelSize;
    } else if (s === 'hiddenButtonText') {
      style.textContent = hiddenButtonText;
    } else if (s === 'videoResolution') {
      style.textContent = videoResolution;
    } else if (s === 'semiTransparent') {
      style.textContent = semiTransparent;
    } else if (s === 'smallFontSize') {
      style.textContent = smallFontSize;
    } else if (s === 'headerPosition') {
      style.textContent = headerPosition;
    } else if (s === 'videoPadding') {
      style.textContent = videoPadding;
    } else if (s === 'mouseoverNavigation') {
      style.textContent = mouseoverNavigation;
    } else if (s === 'hiddenCommentList') {
      style.textContent = hiddenCommentList;
    } else if (s === 'hiddenCommentList2') {
      style.textContent = hiddenCommentList2;
    } else if (s === 'sidePanelBackground') {
      style.textContent = sidePanelBackground;
    } else if (s === 'hiddenIdAndPlan') {
      style.textContent = hiddenIdAndPlan;
    }
    style.id = `${sid}_style_${s}`;
    document.head.appendChild(style);
  };

  /**
   * 動画を構成している要素に変更があったとき
   */
  const changeElements = () => {
    const content = returnContentType();
    if (content === 'tv') {
      if (setting.closeSidePanel) checkSidePanel();
      const feed = document.querySelector(selector.footerFeed);
      if (feed) {
        const text = feed.textContent;
        if (text && data.footerFeed !== text) {
          data.footerFeed = text;
          checkSwitchedProgram();
        }
      }
    } else if (/ts|vi/.test(content)) {
      closeNextProgramInfo();
    }
    hasCommentElement();
    const inner = document.querySelector(selector.inner),
      reports = document.querySelectorAll(selector.commentReport2);
    if (inner) {
      setTimeout(() => {
        hasVideoElement();
        checkVisibleFooter();
      }, 250);
    }
    if (setting.reportFormCommentList) {
      const report = document.querySelector(selector.commentReport);
      if (report instanceof HTMLFormElement) {
        report.dataset[`${sid.toLowerCase()}Commentreportform`] = String(
          Date.now()
        );
        let uid;
        if (content === 'tv') {
          uid = getCommentProps(report, 'userId');
        } else if (content === 'ts') {
          const p = report.parentElement
            ? report.parentElement.querySelector('p')
            : null;
          if (p instanceof HTMLParagraphElement) {
            const cid = getCommentProps(report, 'commentId', content);
            uid = p.dataset[`${sid.toLowerCase()}UserId`];
            if (!uid && data.newComments && setArchiveComments(0)) {
              /** @type {NodeListOf<HTMLDivElement>|null} */
              const noIdComment = document.querySelectorAll(selector.commentTs),
                noIdCommentInner = document.querySelectorAll(
                  selector.commentInnerTs
                );
              let reset = false;
              if (noIdCommentInner.length) data.newComments = false;
              for (let i = 0, j = noIdCommentInner.length; i < j; i++) {
                const eMessage = noIdCommentInner[i];
                if (
                  eMessage instanceof HTMLParagraphElement &&
                  eMessage.parentElement instanceof HTMLDivElement
                ) {
                  const cid2 = getCommentProps(
                    eMessage.parentElement,
                    'commentId',
                    content
                  );
                  if (cid && !uid) {
                    const comment = data.archiveComments.find(
                      (c) => c.id === cid
                    );
                    if (comment) uid = comment.userId;
                  }
                  if (cid2) {
                    const comment2 = data.archiveComments.find(
                      (c) => c.id === cid2
                    );
                    if (comment2) {
                      reset = true;
                      eMessage.dataset[`${sid.toLowerCase()}UserId`] =
                        comment2.userId;
                    }
                  }
                }
              }
              if (reset) {
                const listP = document.querySelector(
                  selector.commentList
                )?.parentElement;
                if (noIdComment.length && listP) {
                  ngComment(noIdComment, listP, content, true);
                }
              }
            }
          }
        } else if (content === 'le') {
          const eProps = report.parentElement?.parentElement;
          if (eProps instanceof HTMLLIElement) {
            uid = getCommentProps(eProps, 'userId');
          }
        }
        if (uid) reportformUserComment(report, content, uid);
      }
    }
    if (reports.length > 1) {
      let minTime = Infinity,
        oldForm = null;
      for (let i = 0, j = reports.length; i < j; i++) {
        const form = reports[i];
        if (form instanceof HTMLFormElement) {
          const timeS = form.dataset[`${sid.toLowerCase()}Commentreportform`];
          if (timeS) {
            const time = parseInt(timeS);
            if (time < minTime) {
              minTime = time;
              oldForm = reports[i];
            }
          }
        }
      }
      if (oldForm) {
        const cancel = oldForm.querySelector(selector.commentReportCancel);
        if (cancel instanceof HTMLButtonElement) {
          cancel.click();
        }
      }
    }
  };

  /**
   * 指定したイベントリスナーを登録/解除する
   * @param {boolean} b true:登録, false:解除
   * @param {HTMLElement|null|undefined} e 登録/解除する要素
   * @param {string} s
   */
  const changeEventListener = (b, e, s) => {
    if (e) {
      if (s === 'commentScroll') {
        if (b) {
          e.removeEventListener('mouseenter', checkMouseEnter);
          e.removeEventListener('mouseleave', checkMouseLeave);
          e.addEventListener('mouseenter', checkMouseEnter);
          e.addEventListener('mouseleave', checkMouseLeave);
        } else {
          e.removeEventListener('mouseenter', checkMouseEnter);
          e.removeEventListener('mouseleave', checkMouseLeave);
        }
      }
    } else {
      log('changeEventListener: not found element', s);
    }
  };

  /**
   * ページタイトルもしくはURLが変更したとき
   */
  const changePageTitle = () => {
    const content = returnContentType(),
      title = document.title,
      url = location.href;
    if (data.href !== url || data.title !== title) {
      data.href = url;
      data.title = title;
      if (/tv|tt/.test(content)) {
        removeStyle('headerPosition');
      } else reStyle('headerPosition', setting.headerPosition);
      if (content === 'tt') {
        removeStyle('mouseoverNavigation');
      } else reStyle('mouseoverNavigation', setting.mouseoverNavigation);
      if (content === 'tv') {
        clearInterval(interval.changePageTitle);
        interval.changePageTitle = setTimeout(checkSwitchedProgram, 1000);
      }
    }
  };

  /**
   * 動画の画質を変更する
   * @param {Number} n 0:自動 1:180p 2:240p 3:360p 4:480p 5:720p 6:1080p
   */
  const changeTargetQuality = (n) => {
    if (!setting.qualityEnable) return;
    const vt = returnVideoTracks();
    const vc = document.querySelector(selector.videoContainer);
    if (vt?.qualities?.length) {
      const vi = returnVideo();
      const qualities = vt.qualities;
      const heightList = [0, 180, 240, 360, 480, 720, 1080];
      const targetHeight = heightList[n];
      let target = -1;

      if (qualities.length === 1) {
        target = 0;
      } else {
        const firstHeight = qualities[0]?.height || 0;
        const lastHeight = qualities.at(-1)?.height || 0;
        if (firstHeight < lastHeight) {
          target = qualities.findLastIndex((q) => q.height <= targetHeight);
          if (target === -1) target = 0;
        } else {
          target = qualities.findIndex((q) => q.height <= targetHeight);
          if (target === -1) target = qualities.length - 1;
        }
      }

      log(
        'changeTargetQuality',
        n,
        qualities.length,
        target,
        targetHeight,
        qualities[target]?.height,
        vi?.videoHeight
      );

      clearInterval(interval.changeTargetQuality);
      interval.changeTargetQuality = setInterval(() => {
        const currentVt = returnVideoTracks();
        if (currentVt) {
          if (target >= 0 && qualities[target]) {
            if (currentVt.targetQuality?.height !== qualities[target].height) {
              log('changeTargetQuality Set', qualities[target].height);
              currentVt.targetQuality = qualities[target];
            }
          } else if (currentVt.targetQuality) {
            log('changeTargetQuality Clear');
            currentVt.targetQuality = null;
          }
        } else {
          clearInterval(interval.changeTargetQuality);
        }
      }, 2000);
    } else if (vc instanceof HTMLDivElement) {
      const content = returnContentType();
      const as = getCommentProps(vc, 'AdaptationSet', content);
      const abr = getCommentProps(vc, 'abr', content);
      const heightList = [0, 180, 240, 360, 480, 720, 1080];

      if (Array.isArray(as) && abr) {
        for (const e of as) {
          let target = -1;
          if (
            e?.mimeType &&
            /^video\//.test(e.mimeType) &&
            Array.isArray(e.Representation)
          ) {
            const vHeight = e.Representation.map((r) => r.height);
            const vBandwidth = e.Representation.map((r) =>
              Math.ceil((r.bandwidth || 0) / 1000)
            );
            if (n > 0) {
              vHeight.sort((a, b) => a - b);
              vBandwidth.sort((a, b) => a - b);
              const index = vHeight.findIndex((v) => v >= heightList[n]);
              target = index !== -1 ? vBandwidth[index] : vBandwidth.at(-1);
            }
            if (abr.initialBitrate && abr.maxBitrate && abr.minBitrate) {
              abr.initialBitrate.video = target >= 0 ? target : -1;
              abr.maxBitrate.video = target >= 0 ? target : -1;
              abr.minBitrate.video = target >= 0 ? target : -1;
              log('changeTargetQuality video', n, target, vHeight, vBandwidth);
            }
          } else if (
            e?.mimeType &&
            /^audio\//.test(e.mimeType) &&
            Array.isArray(e.Representation)
          ) {
            const aHeight = e.Representation.map((r) => parseInt(r.id, 10));
            const aBandwidth = e.Representation.map((r) =>
              Math.ceil((r.bandwidth || 0) / 1000)
            );
            if (n > 0) {
              aHeight.sort((a, b) => a - b);
              aBandwidth.sort((a, b) => a - b);
              const index = aHeight.findIndex((v) => v >= heightList[n]);
              target = index !== -1 ? aBandwidth[index] : aBandwidth.at(-1);
            }
            if (abr.initialBitrate && abr.maxBitrate && abr.minBitrate) {
              abr.initialBitrate.audio = target >= 0 ? target : -1;
              abr.maxBitrate.audio = target >= 0 ? target : -1;
              abr.minBitrate.audio = target >= 0 ? target : -1;
              log('changeTargetQuality audio', n, target, aHeight, aBandwidth);
            }
          }
        }
      }
    }
  };

  /**
   * 動画のソースが切り替わったとき
   */
  const changeVideoSource = () => {
    clearInterval(interval.videosource);
    interval.videosource = setInterval(() => {
      const vi = returnVideo();
      if (vi) {
        clearInterval(interval.videosource);
        if (vi.hasAttribute('src')) {
          const src = vi.getAttribute('src');
          if (src && src !== data.videoSource) {
            log('changeVideoSource', src);
            data.videoSource = src;
            changeTargetQuality(setting.targetQuality);
            showVideoResolution();
            if (returnContentType() === 'tv') checkSwitchedProgram();
          }
        }
      }
    }, 500);
  };

  /**
   * ブロックしたユーザー数を確認する
   * @param {boolean} b trueならdata.ngIdReserveを操作する
   * @returns {number} ブロックしたユーザー数
   */
  const checkBlockedUser = (b) => {
    log('checkBlockedUser', b, data.blockedUserId);
    const sBui = localStorage.getItem('abm_blockedUserIds');
    if (sBui) {
      const aBui = sBui.split(',');
      if (b) {
        if (aBui.length >= 100) {
          data.blockedUserId = aBui[0];
          log('checkBlockedUser', data.blockedUserId, aBui[0], aBui[1]);
        } else {
          data.blockedUserId = '';
        }
      }
      return aBui.length;
    }
    log('checkBlockedUser: not found abm_blockedUserIds', 'warn');
    return 0;
  };

  /**
   * クリックしたとき
   * @param {MouseEvent} e
   */
  const checkClick = (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const content = returnContentType();
    const targetClass =
      content === 'tv'
        ? selector.commentReportSubmitTv
        : content === 'ts'
        ? selector.commentReportSubmitTs
        : content === 'le'
        ? selector.commentReportSubmitLe
        : '';

    if (targetClass && e.target.closest(`.${targetClass}`)) {
      addNgId();
    }
  };

  /**
   * 右クリックしたとき
   * @param {MouseEvent} e
   */
  const checkContextmenu = (e) => {
    const content = returnContentType();
    if (
      setting.programInfo1 &&
      content === 'tv' &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.metaKey &&
      (e.target instanceof HTMLElement || e.target instanceof SVGElement) &&
      e.target.closest(selector.programDetailButton)
    ) {
      e.preventDefault();
      toggleProgramInfo();
    }
  };

  /**
   * ダブルクリックしたとき
   * @param {MouseEvent} e
   */
  const checkDblclick = (e) => {
    if (
      setting.dblclickScroll &&
      /le|ts|vi/.test(returnContentType()) &&
      e.target instanceof HTMLElement &&
      e.target.closest(selector.videoDblclick)
    ) {
      adjustScrollPosition();
    }
  };

  /**
   * キーボードのキーを押したとき
   * @param {KeyboardEvent} e
   */
  const checkKeyDown = (e) => {
    const isInput =
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
        ? true
        : false;
    if (e.shiftKey && e.key === 'O' && (!isInput || (isInput && e.altKey))) {
      openSettings();
    } else if (
      setting.programInfo1 &&
      e.shiftKey &&
      e.key === 'P' &&
      (!isInput || (isInput && e.altKey))
    ) {
      toggleProgramInfo();
    } else if (!isInput && e.key === 'Escape') {
      closeCommentReportForm();
    } else if (setting.enterKey && e.key === 'Enter') {
      if (!isInput) {
        const ca = document.querySelector(selector.commentArea);
        if (!ca) {
          const cb = document.querySelector(selector.commentButton);
          if (cb instanceof HTMLButtonElement) {
            cb.click();
          }
        }
        const ta = document.querySelector(selector.commentForm);
        if (ta instanceof HTMLTextAreaElement) {
          ta.focus();
          e.preventDefault();
        }
      }
      const cc = document.querySelector(selector.commentContinue);
      if (cc instanceof HTMLButtonElement) {
        const cf = document.querySelector(selector.commentForm);
        if (
          cf instanceof HTMLTextAreaElement &&
          ((isInput && !cf.value) || !isInput)
        ) {
          cc.click();
        }
      }
    } else if (
      setting.sidePanelBackground &&
      e.shiftKey &&
      e.key === 'B' &&
      (!isInput || (isInput && e.altKey))
    ) {
      const style = document.getElementById(`${sid}_style_sidePanelBackground`);
      if (style) removeStyle('sidePanelBackground');
      else addStyle('sidePanelBackground');
    } else if (
      setting.hiddenCommentList &&
      e.shiftKey &&
      e.key === 'C' &&
      (!isInput || (isInput && e.altKey))
    ) {
      const style1 = document.getElementById(`${sid}_style_hiddenCommentList`),
        style2 = document.getElementById(`${sid}_style_hiddenCommentList2`);
      if (!style1 && !style2) {
        addStyle('hiddenCommentList');
      } else if (style1) {
        removeStyle('hiddenCommentList');
        if (setting.hiddenCommentListNum2) addStyle('hiddenCommentList2');
      } else if (style2) {
        removeStyle('hiddenCommentList2');
      }
    } else if (
      e.target instanceof HTMLElement &&
      (e.target.closest(selector.commentReportTv) ||
        e.target.closest(selector.commentReportTs) ||
        e.target.closest(selector.commentReportLe))
    ) {
      if (
        setting.ngIdEnable &&
        e.target.textContent === 'ブロック' &&
        (e.key === 'Enter' || e.key === ' ')
      ) {
        addNgId();
      }
    }
  };

  /**
   * マウスカーソルをコメントリストに重ねたとき
   * @param {MouseEvent} e
   */
  const checkMouseEnter = (e) => {
    const cl = document.querySelector(selector.commentList)?.parentElement;
    if (cl === e.target) data.commentMouseEnter = true;
  };

  /**
   * マウスカーソルをコメントリストから外したとき
   * @param {MouseEvent} e
   */
  const checkMouseLeave = (e) => {
    const cl = document.querySelector(selector.commentList)?.parentElement;
    if (cl === e.target) data.commentMouseEnter = false;
  };

  /**
   * 新規コメントを読み込んだとき
   */
  const checkNewComments = async () => {
    const content = returnContentType();
    if (!content) return;
    const ca = document.querySelectorAll(selector.comenntAll),
      /** @type {NodeListOf<HTMLDivElement>|null} */
      cb = content ? document.querySelectorAll(selector.commentBefore) : null,
      listP =
        content === 'tv' || content === 'ts'
          ? document.querySelector(selector.commentList)?.parentElement
          : content === 'le'
          ? document.querySelector(selector.commentList)?.parentElement
              ?.parentElement
          : null;
    if (!ca?.length || !cb?.length) return;
    data.newComments = true;
    data.commentAll = ca.length;
    if (ca.length === cb.length) {
      data.archiveComments.length = 0;
      data.commentId.clear();
      if (content !== 'ts') data.comment.length = 0;
    }
    if (listP) {
      for (let i = 0, j = cb.length; i < j; i++) {
        /** @type {HTMLDivElement|null} */
        const eInner = cb[i].querySelector(selector.commentInner);
        if (eInner) {
          eInner.dataset[`${sid.toLowerCase()}Hidden`] = 'true';
        }
      }
      if (content === 'ts') {
        data.archiveComments.length = 0;
        await sleep(1000);
        if (setArchiveComments(ca.length - cb.length)) {
          ngComment(cb, listP, content, false);
        } else log('checkNewComments: not found archiveCommentContainer');
      } else ngComment(cb, listP, content, false);
    }
  };

  /**
   * サイドパネルが最初から開いているかを調べる
   */
  const checkSidePanel = () => {
    if (!document.querySelector(`.${sid}_SidePanelCloseed`)) {
      /** @type {HTMLButtonElement|null} */
      const button = document.querySelector(selector.sidePanelClose);
      button?.classList.add(`${sid}_SidePanelCloseed`);
      button?.click();
    }
  };

  /**
   * テレビで番組が切り替わったか調べる
   */
  const checkSwitchedProgram = () => {
    log('checkSwitchedProgram', data.programId);
    let n = 0;
    const check = () => {
      /** @type {HTMLDivElement|null} */
      const screen = document.querySelector(selector.tvScreen),
        id = screen ? getCommentProps(screen, 'programId', 'tv') : '';
      if (id && typeof id === 'string') {
        if (data.programId !== id) {
          data.programId = id;
          clearInterval(interval.checkSwitchedProgram);
          log('checkSwitchedProgram', n);
          if (setting.programInfo1 || setting.programInfo2) {
            getProgramInfo(id);
          }
        }
      } else {
        const eInfo1 = document.getElementById(`${sid}_ProgramInfo1`),
          eInfo2 = document.getElementById(`${sid}_ProgramInfo2`);
        if (eInfo1) eInfo1.innerHTML = '';
        if (eInfo2) eInfo2.innerHTML = '';
      }
      if (n > 120) clearInterval(interval.checkSwitchedProgram);
      n += 1;
    };
    clearInterval(interval.checkSwitchedProgram);
    interval.checkSwitchedProgram = setInterval(check, 1000);
  };

  /**
   * スクリプトとストレージのバージョンを確認
   */
  const checkVersion = () => {
    if ('version' in ls) {
      if (ls.version < 9) {
        if ('pageKey' in ls) {
          delete ls.pageKey;
          log('delete ls.pageKey');
        }
      }
    }
    ls.version = data.version;
    saveStorage();
  };

  /**
   * 動画のフッターが表示されているかを調べる
   */
  const checkVisibleFooter = () => {
    const fo = document.querySelector(selector.footerVisible);
    if (fo) showVideoResolution();
  };

  /**
   * ブロックアイコンをクリックして表示した報告フォームをすべて閉じる
   */
  const closeCommentReportForm = () => {
    const submit = document.querySelectorAll(selector.commentReportCancel);
    for (let i = 0, j = submit.length; i < j; i++) {
      const button = submit[i];
      if (button instanceof HTMLButtonElement) button.click();
    }
  };

  /**
   * 「次のエピソード」が表示されたらキャンセルボタンを押す
   * 「こちらもオススメ」が表示されたらキャンセルボタンを押す
   * 可能ならスキップボタンを押す
   */
  const closeNextProgramInfo = () => {
    if (setting.nextProgramInfo) {
      const nc = document.querySelector(selector.nextCancel);
      if (nc instanceof HTMLButtonElement) {
        setTimeout(() => {
          nc.click();
        }, 2000);
      }
    }
    if (setting.nextProgramInfo) {
      const ncm = document.querySelector(selector.nextCancelMini);
      if (ncm instanceof HTMLButtonElement) {
        setTimeout(() => {
          ncm.click();
        }, 2000);
      }
    }
    if (setting.recommendedSeriesInfo) {
      const rc = document.querySelector(selector.recommendedCancel);
      if (rc instanceof HTMLButtonElement) {
        setTimeout(() => {
          rc.click();
        }, 2000);
      }
    }
    if (setting.skipVideo) {
      const vs = document.querySelector(selector.videoSkip);
      if (vs instanceof HTMLButtonElement) {
        clearInterval(interval.videoskip);
        interval.videoskip = setInterval(() => {
          const vs2 = document.querySelector(selector.videoSkip2);
          if (vs2 instanceof HTMLButtonElement) {
            clearInterval(interval.videoskip);
            vs2.click();
          } else if (!vs && !vs2) clearInterval(interval.videoskip);
        }, 500);
      }
    }
  };

  /**
   * 一部の通知を閉じる
   */
  const closeNotificationToast = () => {
    log('closeNotificationToast');
    /** @type {HTMLButtonElement|null} */
    const closeButton = document.querySelector(selector.notificationClose),
      /** @type {HTMLVideoElement|null} */
      message = document.querySelector(selector.notificationMessage);
    if (closeButton && message) {
      if (/推奨環境外のため/.test(message.innerText)) {
        closeButton.click();
      }
    }
  };

  /**
   * 設定欄を閉じる
   */
  const closeSettings = () => {
    const settings = document.querySelector(`#${sid}_Settings`);
    settings?.classList.add(`${sid}_Settings_hidden`);
  };

  /**
   * 記入されたNGワードを処理しやすくするため正規表現用とそれ以外用に分ける
   * @param {string} t
   * @returns {string}
   */
  const convertNgword = (t) => {
    log('convertNgword');
    const aWord = t.split(/\r\n|\n|\r/),
      aText = [],
      /** @type {RegExp[]} */
      aRe = [];
    let sError = '';
    for (let i = 0, j = aWord.length; i < j; i++) {
      const str = aWord[i].trim();
      if (str.slice(0, 2) !== '//') {
        if (/^\/.+\/[dgimsuvy]{0,}$/.test(str)) {
          try {
            const re = str.slice(1, str.lastIndexOf('/')),
              flag = str.slice(str.lastIndexOf('/') + 1) || '';
            aRe.push(new RegExp(re, flag));
          } catch (error) {
            sError += `${i + 1}行目: ${str}\n`;
            log(error, 'error');
          }
        } else {
          aText.push(str);
        }
      }
    }
    data.ngWordText = [...aText];
    data.ngWordRe = [...aRe];
    return sError;
  };

  /**
   * 番組情報の要素を作成
   * @param {object} o ダウンロードした番組情報
   */
  const createProgramInfo = (o) => {
    let label = '';
    if (o.labels?.length) {
      label += `<span class="${sid}_ProgramInfo-labels">`;
      for (let i = 0, j = o.labels.length; i < j; i++) {
        if (o.labels[i] === 'new') {
          label += `<span class="${sid}_ProgramInfo-label-new">新</span>`;
        } else if (o.labels[i] === 'live') {
          label += `<span class="${sid}_ProgramInfo-label-live">生</span>`;
        } else if (o.labels[i] === 'bundle') {
          label += `<span class="${sid}_ProgramInfo-label-bundle">一挙</span>`;
        } else if (o.labels[i] === 'pickup') {
          label += `<span class="${sid}_ProgramInfo-label-pickup">注目</span>`;
        } else if (o.labels[i] === 'first') {
          label += `<span class="${sid}_ProgramInfo-label-first">初</span>`;
        } else {
          log('createProgramInfo: labels', o.labels[i], 'warn');
        }
      }
      label += '</span>';
    }
    const dir = location.href.split('/'),
      channelId = dir[dir.length - 1],
      programId = o.id ? o.id : '',
      title = o.title
        ? `
<div class="${sid}_ProgramInfo-title ${sid}_ProgramInfo-text">
<a href="https://abema.tv/channels/${channelId}/slots/${programId}" target="_blank">${label}${o.title}</a>
</div>
      `
        : '',
      startEndAt =
        o.startAt && o.endAt
          ? `
<div class="${sid}_ProgramInfo-startEndAt ${sid}_ProgramInfo-text">${returnFormatDate(
              o.startAt
            )} ～ ${returnFormatDate(o.endAt)}</div>
      `
          : '',
      tsFreeEndAt = o.timeshiftFreeEndAt
        ? `
<div class="${sid}_ProgramInfo-tsFreeEndAt ${sid}_ProgramInfo-text">無料見逃し視聴：${returnFormatDate(
            o.timeshiftFreeEndAt
          )}まで</div>
      `
        : '',
      tsEndAt = o.timeshiftEndAt
        ? `<div class="${sid}_ProgramInfo-tsEndAt ${sid}_ProgramInfo-text">${
            o.timeshiftFreeEndAt ? '（' : ''
          }ABEMAプレミアム見逃し視聴：${returnFormatDate(
            o.timeshiftEndAt
          )}まで${o.timeshiftFreeEndAt ? '）' : ''}</div>`
        : '',
      highlight = o.detailHighlight
        ? `
<div class="${sid}_ProgramInfo-detailHighlight ${sid}_ProgramInfo-text">${o.detailHighlight}</div>
      `
        : '',
      content = o.content
        ? `
<div class="${sid}_ProgramInfo-content ${sid}_ProgramInfo-text">${o.content}</div>
      `
        : '';
    let tsAt = `<div class="${sid}_ProgramInfo-tsAt">`,
      credit1 = '',
      credit2 = '';
    if (o.credit?.casts?.length || o.credit?.crews?.length) {
      credit1 += `<div class="${sid}_ProgramInfo-credit">`;
    }
    if (o.credit?.casts?.length) {
      credit2 += `<div class="${sid}_ProgramInfo-credit2">`;
    }
    if (tsFreeEndAt) tsAt += tsFreeEndAt;
    if (tsEndAt) tsAt += tsEndAt;
    tsAt += '</div>';
    if (o.credit?.casts?.length) {
      credit1 += `<div class="${sid}_ProgramInfo-credit-casts ${sid}_ProgramInfo-text">`;
      if (o.credit.casts.length === 1) {
        credit1 += /^[-‐]$/.test(o.credit.casts[0])
          ? ''
          : `<dl><dt>【キャスト】</dt><dd>${o.credit.casts[0]}</dd></dl>`;
      } else {
        credit1 += `<dl><dt>【キャスト】</dt><dd>${o.credit.casts.join(
          '</dd><dd>'
        )}</dd></dl>`;
      }
      credit1 += '</div>';
      credit2 += `<div class="${sid}_ProgramInfo-credit2-casts ${sid}_ProgramInfo-text">`;
      if (o.credit.casts.length === 1) {
        credit2 += /^[-‐]$/.test(o.credit.casts[0])
          ? ''
          : `<dl><dt>【キャスト】</dt><dd>${o.credit.casts[0]}</dd></dl>`;
      } else {
        credit2 += `<dl><dt>【キャスト】</dt><dd>${o.credit.casts.join(
          '</dd><dd>'
        )}</dd></dl>`;
      }
      credit2 += '</div>';
    }
    if (o.credit?.crews?.length) {
      credit1 += `<div class="${sid}_ProgramInfo-credit-crews ${sid}_ProgramInfo-text">`;
      if (o.credit.crews.length === 1) {
        credit1 += /^[-‐]$/.test(o.credit.crews[0])
          ? ''
          : `<dl><dt>【スタッフ】</dt><dd>${o.credit.crews[0]}</dd></dl>`;
      } else {
        credit1 += `<dl><dt>【スタッフ】</dt><dd>${o.credit.crews.join(
          '</dd><dd>'
        )}</dd></dl>`;
      }
      credit1 += '</div>';
    }
    if (o.credit?.copyrights?.length) {
      credit1 += `<div class="${sid}_ProgramInfo-credit-copyrights ${sid}_ProgramInfo-text">`;
      if (o.credit.copyrights.length === 1) {
        credit1 += `<dl><dt></dt><dd>${o.credit.copyrights[0]}</dd></dl>`;
      } else {
        credit1 += `<dl><dt></dt><dd>${o.credit.copyrights.join(
          '</dd><dd>'
        )}</dd></dl>`;
      }
      credit1 += '</div>';
    }
    credit1 += '</div>';
    credit2 += '</div>';
    const sInfo1 = `${title}${startEndAt}${tsAt}${highlight}${content}${credit1}`,
      sInfo2 = `${title}${startEndAt}${tsAt}${credit2}`;
    const info1 = document.getElementById(`${sid}_ProgramInfo1`);
    if (info1) {
      info1.innerHTML = sInfo1;
    } else {
      const eInfo1 = document.createElement('div'),
        screen1 = document.querySelector(selector.tvContainerScreen);
      if (screen1) {
        eInfo1.id = `${sid}_ProgramInfo1`;
        eInfo1.className = `${sid}_ProgramInfo_hidden`;
        eInfo1.innerHTML = sInfo1;
        screen1.appendChild(eInfo1);
      } else {
        log('createProgramInfo: not found screen');
      }
    }
    clearTimeout(interval.programInfo2);
    const info2 = document.getElementById(`${sid}_ProgramInfo2`),
      setStyleCasts = (c) => {
        const cast2 = document.querySelector(
          `.${sid}_ProgramInfo-credit2-casts > dl`
        );
        if (cast2 instanceof HTMLDListElement) {
          cast2.style.gridTemplateColumns = `repeat(auto-fit, minmax(${c}em, 1fr))`;
        }
      },
      showInfo2 = (e) => {
        if (!info1 || (info1 && getComputedStyle(info1).display === 'none')) {
          e.classList.remove(`${sid}_ProgramInfo_hidden`);
          interval.programInfo2 = setTimeout(() => {
            e.classList.add(`${sid}_ProgramInfo_hidden`);
          }, Number(setting.programInfo2Num) * 1000);
        }
      };
    let chara = 0;
    for (const ele of o.credit.casts) {
      if (ele.length > chara) chara = ele.length;
    }
    if (setting.programInfo2) {
      let targetInfoElement = info2;
      if (!targetInfoElement) {
        const screen2 = document.querySelector(selector.tvContainerScreen);
        if (screen2) {
          targetInfoElement = document.createElement('div');
          targetInfoElement.id = `${sid}_ProgramInfo2`;
          targetInfoElement.className = `${sid}_ProgramInfo_hidden`;
          screen2.appendChild(targetInfoElement);
        } else {
          log('createProgramInfo2: not found screen');
        }
      }

      if (targetInfoElement) {
        targetInfoElement.innerHTML = sInfo2;
        setStyleCasts(chara);
        showInfo2(targetInfoElement);
      }
    }
  };

  /**
   * 設定欄を作成する
   */
  const createSettings = () => {
    const sSettings = `
<div id="${sid}_Settings-header">
  ${sid} 設定
</div>
<div id="${sid}_Settings-main">
  <input id="${sid}_Settings-Tab-General" type="radio" name="Tab" class="${sid}_Settings-tab-switch" checked="checked">
  <label class="${sid}_Settings-tab-label" for="${sid}_Settings-Tab-General">全般</label>
  <div id="${sid}_Settings-General" class="${sid}_Settings-tab-content">
    <fieldset>
      <legend>全般</legend>
      <label>
        <input id="${sid}_Settings-reduceNavigation" type="checkbox">
        ページを開いたときサイドナビゲーションを縮める
      </label>
      <br>
      <label title="左側のサイドナビゲーションを縮めているとき、ウィンドウ左端にマウスカーソルを合わせるとサイドナビゲーションを表示します。">
        <input id="${sid}_Settings-mouseoverNavigation" type="checkbox">
        左端にマウスオーバーしたときサイドナビゲーションを表示する
      </label>
      <br>
      <label>
        <input id="${sid}_Settings-closeNotification" type="checkbox">
        右上に表示される一部の通知を閉じる
      </label>
      <br>
      <label title="テレビ・ライブイベントでは最大解像度も表示します。">
        <input id="${sid}_Settings-videoResolution" type="checkbox">
        動画の解像度と表示領域サイズを表示する
      </label>
      <br>
      <label title="ABEMAトップページなどで、ヘッダーは固定表示せずにページのスクロールに追従するようにします。">
        <input id="${sid}_Settings-headerPosition" type="checkbox">
        ヘッダーを追従表示にする
      </label>
      <br>
      <label title="ヘッダー・サイドナビゲーションなどの背景や一部のボタンを半透明にします。">
        <input id="${sid}_Settings-semiTransparent" type="checkbox">
        ヘッダーやサイドナビゲーションなどを半透明にする
      </label>
      <br>
      <label>
        <input id="${sid}_Settings-smallFontSize" type="checkbox">
        ヘッダーやフッターの一部の文字サイズを小さくする
      </label>
      <br>
      <label title="動画の表示幅を縮めずに右側のサイドパネルを動画に重ねて表示します。">
        <input id="${sid}_Settings-overlapSidePanel" type="checkbox">
        サイドパネルを動画に重ねて表示する
      </label>
      <br>
      <label title="「サイドパネルを動画に重ねて表示する」がONのときサイドパネルの背景が透明になりますが、Shift+Bキーで背景を半透明の黒色にします。&#13;&#10;入力欄にフォーカスしているときはAlt+Shift+Bキーで動作します。">
        <input id="${sid}_Settings-sidePanelBackground" type="checkbox">
        Shift+Bキーでサイドパネルの背景を半透明にする
      </label>
      <br>
      <label title="サイドパネルの幅を100px～1000pxに変更できます。&#13;&#10;初期値:320">
        <input id="${sid}_Settings-sidePanelSize" type="checkbox">
        サイドパネルの幅を変更する
        <input id="${sid}_Settings-sidePanelSizeNum" type="number" min="100" max="1000" step="10" ${
        setting.sidePanelSize ? '' : 'disabled'
      }>px
      </label>
      <br>
      <label title="IDと視聴プランはアカウント管理ページで確認できます。">
        <input id="${sid}_Settings-hiddenIdAndPlan" type="checkbox">
        サイドナビゲーションのIDと視聴プランを隠す
      </label>
      <br>
    </fieldset>
  </div>
  <input id="${sid}_Settings-Tab-Tv" type="radio" name="Tab" class="${sid}_Settings-tab-switch">
  <label class="${sid}_Settings-tab-label" for="${sid}_Settings-Tab-Tv">テレビ</label>
  <div id="${sid}_Settings-Tv" class="${sid}_Settings-tab-content">
    <fieldset>
      <legend>テレビ</legend>
      <label>
        <input id="${sid}_Settings-closeSidePanel" type="checkbox">
        ページを開いたとき右側のサイドパネルを閉じる
      </label>
      <br>
      <label>
        <input id="${sid}_Settings-sidePanelCloseButton" type="checkbox">
        サイドパネル上端にマウスオーバーしたとき閉じるボタンを表示する
      </label>
      <br>
      <label title="番組情報を開いたとき詳細情報を自動的に表示します。">
        <input id="${sid}_Settings-showProgramDetail" type="checkbox">
        サイドパネルに記載された番組情報の詳細を常に表示する
      </label>
      <br>
      <label title="ボタンにマウスオーバーしたときテキストを表示します。">
        <input id="${sid}_Settings-hiddenButtonText" type="checkbox">
        [最初から見る・番組情報・コメント]ボタンのテキストを隠す
      </label>
      <br>
      <label title="約1分ごとに視聴数を更新します。">
        <input id="${sid}_Settings-viewCounter" type="checkbox">
        入力欄に視聴数を表示する
      </label>
      <br>
      <label title="Shift+Pキー（入力欄にフォーカスしているときはAlt+Shift+Pキー）でも表示/非表示します。&#13;&#10;サイドパネルを閉じずに番組情報を確認できます。">
        <input id="${sid}_Settings-programInfo1" type="checkbox">
        番組情報ボタンを右クリックで独自の番組情報欄を表示/非表示する
      </label>
      <br>
      <label title="次の番組が始まったときやチャンネルを切り替えたときにも番組情報の一部を指定した時間（1～60秒間）表示します。&#13;&#10;初期値:3">
        <input id="${sid}_Settings-programInfo2" type="checkbox">
        番組を見始めたとき番組情報の一部を表示する
        <input id="${sid}_Settings-programInfo2Num" type="number" min="1" max="60" ${
        setting.programInfo2 ? '' : 'disabled'
      }>秒
      </label>
      <br>
    </fieldset>
  </div>
  <input id="${sid}_Settings-Tab-Video" type="radio" name="Tab" class="${sid}_Settings-tab-switch">
  <label class="${sid}_Settings-tab-label" for="${sid}_Settings-Tab-Video">ビデオ</label>
  <div id="${sid}_Settings-Video" class="${sid}_Settings-tab-content">
    <fieldset>
      <legend>ビデオ・見逃し視聴</legend>
      <label title="自動的に次のエピソードへ移動せずに最後まで再生できるようにします。">
        <input id="${sid}_Settings-nextProgramInfo" type="checkbox">
        再生中に[次のエピソード]が表示されたらキャンセルボタンを押す
      </label>
      <br>
      <label title="自動的にオススメ作品へ移動せずに最後まで再生できるようにします。">
        <input id="${sid}_Settings-recommendedSeriesInfo" type="checkbox">
        再生中に[オススメ作品]が表示されたらキャンセルボタンを押す
      </label>
      <br>
      <label>
        <input id="${sid}_Settings-skipVideo" type="checkbox">
        再生中に可能ならスキップボタンを押す
      </label>
      <br>
    </fieldset>
    <fieldset>
      <legend>ビデオ・見逃し視聴・ライブイベント</legend>
      <label title="デフォルト表示では動画の上や左の余白を減らします。&#13;&#10;ワイド表示では動画の大きさをウィンドウ幅に合わせます。">
        <input id="${sid}_Settings-videoPadding" type="checkbox">
        動画周辺の余白を減らす
      </label>
      <br>
      <label title="可能であれば動画の上や左に隙間がなくなるようにページをスクロールします。">
        <input id="${sid}_Settings-dblclickScroll" type="checkbox">
        動画のコントローラーをダブルクリックしてスクロール位置を調整
      </label>
      <br>
    </fieldset>
  </div>
  <input id="${sid}_Settings-Tab-Comment" type="radio" name="Tab" class="${sid}_Settings-tab-switch">
  <label class="${sid}_Settings-tab-label" for="${sid}_Settings-Tab-Comment">コメント</label>
  <div id="${sid}_Settings-Comment" class="${sid}_Settings-tab-content">
    <fieldset>
      <legend>コメント</legend>
      <label>
        <input id="${sid}_Settings-newCommentOneByOne" type="checkbox">
        コメントを1つずつ表示する
      </label>
      <br>
      <label title="新着コメントが多い場合はスクロールせずに瞬時に表示します。">
        <input id="${sid}_Settings-scrollNewComment" type="checkbox">
        コメントを1つずつスクロールする
      </label>
      <br>
      <label title="いずれかのコメントにマウスカーソルを合わせている間、一時的に新着コメントを表示しません。">
        <input id="${sid}_Settings-stopCommentScroll" type="checkbox">
        コメントにマウスオーバーしたときスクロールを止める
      </label>
      <br>
      <label title="自分のコメントは背景を色付きの半透明で表示します。">
        <input id="${sid}_Settings-highlightNewComment" type="checkbox">
        自分のコメントとテレビでの新規コメントを強調表示する
      </label>
      <br>
      <label title="緑色:初回コメント&#13;&#10;黄色:2～3連続で同内容のコメント&#13;&#10;赤色:4連続以上で同内容のコメント&#13;&#10;紫色:直近5回のいずれかと同内容のコメント">
        <input id="${sid}_Settings-highlightFirstComment" type="checkbox">
        初回コメントと連投コメントを強調表示する
      </label>
      <br>
      <label title="文字サイズを10px～32pxに変更できます。&#13;&#10;初期値:13">
        <input id="${sid}_Settings-commentFontSize" type="checkbox">
        コメントの文字サイズを変更する
        <input id="${sid}_Settings-commentFontSizeNum" type="number" min="10" max="32" ${
        setting.commentFontSize ? '' : 'disabled'
      }>px
      </label>
      <br>
      <label>
        <input id="${sid}_Settings-reduceCommentSpace" type="checkbox">
        コメント周辺の余白を減らす＆行間を縮める
      </label>
      <br>
      <label title="コメントの透明度を0%～100%に変更できます。透明度は2つまで指定できます。&#13;&#10;入力欄にフォーカスしているときはAlt+Shift+Cキーで動作します。&#13;&#10;入力欄1の初期値:50">
        <input id="${sid}_Settings-hiddenCommentList" type="checkbox">
        Shift+Cキーでコメントリストを半透明化
        <input id="${sid}_Settings-hiddenCommentListNum" type="number" min="0" max="100" step="5" ${
        setting.hiddenCommentList ? '' : 'disabled'
      }>%
        <input id="${sid}_Settings-hiddenCommentListNum2" type="number" min="0" max="100" step="5" ${
        setting.hiddenCommentList ? '' : 'disabled'
      }>%
      </label>
      <br>
      <label title="各コメント右端のブロックアイコンをクリックすると表示されるフォームをEscキーで閉じます。">
        <input id="${sid}_Settings-escKey" type="checkbox">
        Escキーで[このユーザーをブロックします]をすべてキャンセルする
      </label>
      <br>
      <label title="コメントリストを上へスクロールしたときに表示される[新着コメント↓]ボタンもEnterキーで押します。">
        <input id="${sid}_Settings-enterKey" type="checkbox">
        Enterキーでコメント欄を開く＆コメント入力欄にフォーカスする
      </label>
      <br>
      <label title="そのユーザーのコメントを一覧表示します。ブロックする理由の参考にしてください。">
        <input id="${sid}_Settings-reportFormCommentList" type="checkbox">
        コメント報告フォームを開いたときそのユーザーのコメント履歴を表示する
      </label>
      <br>
    </fieldset>
  </div>
  <input id="${sid}_Settings-Tab-Quality" type="radio" name="Tab" class="${sid}_Settings-tab-switch">
  <label class="${sid}_Settings-tab-label" for="${sid}_Settings-Tab-Quality">画質</label>
  <div id="${sid}_Settings-Quality" class="${sid}_Settings-tab-content">
    <fieldset>
      <legend>
        <label title="チェックボックスONで画質機能を有効にします。">
          <input id="${sid}_Settings-qualityEnable" type="checkbox">
          画質
        </label>
      </legend>
      <details>
        <summary>[説明]</summary>
        <p>番組の画質を設定します。</p>
        <p>番組を開いた直後やCM直後などの数秒から数十秒後に設定した画質が反映されます。</p>
        <p>設定した画質が用意されていない番組ではそれよりも低い画質で再生します。</p>
        <p>また、画質の設定に合わせて音質も変更します。</p>
      </details>
      <label>
        画質:
        <select id="${sid}_Settings-targetQuality" ${
        setting.qualityEnable ? '' : 'disabled'
      }>
          <option value="0">自動</option>
          <option value="1">通信節約モード（180p）</option>
          <option value="2">最低画質（240p）</option>
          <option value="3">低画質（360p）</option>
          <option value="4">中画質（480p）</option>
          <option value="5">高画質（720p）</option>
          <option value="6">最高画質（1080p）</option>
        </select>
      </label>
    </fieldset>
  </div>
  <input id="${sid}_Settings-Tab-Ng" type="radio" name="Tab" class="${sid}_Settings-tab-switch">
  <label class="${sid}_Settings-tab-label" for="${sid}_Settings-Tab-Ng">NG</label>
  <div id="${sid}_Settings-Ng" class="${sid}_Settings-tab-content">
    <fieldset>
      <legend>
        <label title="チェックボックスONでNGワード機能を有効にします。">
          <input id="${sid}_Settings-ngWordEnable" type="checkbox">
          NGワード
        </label>
      </legend>
      <details>
        <summary>[説明]</summary>
        <p>NGワードに該当するコメントを表示しません。</p>
        <p>1行に1つのNGワードを記入してください。<br>
        先頭と末尾に / を付けると正規表現として扱います。<br>
        正規表現の末尾に i や u などを追記してフラグを使用できます。</p>
        <p>先頭が // の行はコメントとして扱うのでNGワードとして使用しません。</p>
        <p>記入例:
          <pre>
Aaa
bbb
/Ccc|DDD|eEe/

//大文字小文字を区別しません
/fff|ggg|hhh/i

//10桁以上の数字
/\\d{10,}/

//5文字以上の同じ文字を3回以上繰り返している
//（例:あいうえおあいうえおあいうえお）
/(.{5,})\\1{2,}/

//[ひらがな・カタカナ・漢字・絵文字・全角英数字・一部の全角記号]の
//いずれも含まない（Chromeなど一部のブラウザのみ有効）
/^(?!.*[\\p{scx=Hira}\\p{scx=Kana}\\p{scx=Han}\\p{RGI_Emoji}\\uFF01-\\uFF65]).*$/v
</pre>
        </p>
        <p>NGワードが多すぎると動作が重くなるのでご注意ください。</p>
      </details>
      <textarea id="${sid}_Settings-ngWord" ${
        setting.ngWordEnable ? '' : 'disabled'
      }></textarea>
      <div id="${sid}_Settings-ngWord-error">
        <p>エラー:下記の正規表現を修正してください。</p>
        <pre id="${sid}_Settings-ngWord-error-pre"></pre>
      </div>
      <label>
        <input id="${sid}_Settings-ngConsole" type="checkbox" ${
        setting.ngWordEnable ? '' : 'disabled'
      }>
        NGワードに該当したコメントをブラウザのコンソールに出力する
      </label>
    </fieldset>
    <fieldset>
      <legend>
        <label title="チェックボックスONでNG ID機能を有効にします。">
          <input id="${sid}_Settings-ngIdEnable" type="checkbox">
          NG ID
        </label>
      </legend>
      <details>
        <summary>[説明]</summary>
        <p>ABEMAではコメント欄からブロックしたユーザーIDをブラウザに100件まで保存していて、それ以上ブロックしたときは古い方から破棄されます。<br>
        このNG ID機能ではその破棄されるユーザーIDを別枠で保存しておいてそのユーザーのコメントもブロックします。</p>
        <p>現在の保存数よりも少ない保存数に変更した場合は古いほうから溢れた分を破棄します。<br>
        0に変更するとすべて破棄します。</p>
      </details>
      <label>
        最大保存数:
        <select id="${sid}_Settings-ngIdMaxSize" ${
        setting.ngIdEnable ? '' : 'disabled'
      }>
          <option value="0">${setting._ngid[0]}</option>
          <option value="1">${setting._ngid[1]}</option>
          <option value="2">${setting._ngid[2]}</option>
          <option value="3">${setting._ngid[3]}</option>
          <option value="4">${setting._ngid[4]}</option>
          <option value="5">${setting._ngid[5]}</option>
          <option value="6">${setting._ngid[6]}</option>
          <option value="7">${setting._ngid[7]}</option>
          <option value="8">${setting._ngid[8]}</option>
          <option value="9">${setting._ngid[9]}</option>
        </select>
        <span id="${sid}_Settings-ngId-record"></span>
      </label>
    </fieldset>
  </div>
</div>
<div id="${sid}_Settings-footer">
  <button id="${sid}_Settings-ok">OK</button>
  <button id="${sid}_Settings-cancel">キャンセル</button>
</div>`,
      eSettings = document.createElement('div');
    eSettings.id = `${sid}_Settings`;
    eSettings.className = `${sid}_Settings_hidden`;
    eSettings.innerHTML = sSettings;
    document.body.appendChild(eSettings);
    document
      .getElementById(`${sid}_Settings-overlapSidePanel`)
      ?.addEventListener('change', () => {
        const osp = document.getElementById(`${sid}_Settings-overlapSidePanel`),
          spb = document.getElementById(`${sid}_Settings-sidePanelBackground`);
        if (
          osp instanceof HTMLInputElement &&
          spb instanceof HTMLInputElement
        ) {
          spb.disabled = osp.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-sidePanelSize`)
      ?.addEventListener('change', () => {
        const sps = document.getElementById(`${sid}_Settings-sidePanelSize`),
          spsn = document.getElementById(`${sid}_Settings-sidePanelSizeNum`);
        if (
          sps instanceof HTMLInputElement &&
          spsn instanceof HTMLInputElement
        ) {
          spsn.disabled = sps.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-programInfo2`)
      ?.addEventListener('change', () => {
        const pi2 = document.getElementById(`${sid}_Settings-programInfo2`),
          pi2n = document.getElementById(`${sid}_Settings-programInfo2Num`);
        if (
          pi2 instanceof HTMLInputElement &&
          pi2n instanceof HTMLInputElement
        ) {
          pi2n.disabled = pi2.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-newCommentOneByOne`)
      ?.addEventListener('change', () => {
        const snc = document.getElementById(`${sid}_Settings-scrollNewComment`),
          obo = document.getElementById(`${sid}_Settings-newCommentOneByOne`);
        if (
          snc instanceof HTMLInputElement &&
          obo instanceof HTMLInputElement
        ) {
          snc.disabled = obo.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-commentFontSize`)
      ?.addEventListener('change', () => {
        const cfs = document.getElementById(`${sid}_Settings-commentFontSize`),
          cfsn = document.getElementById(`${sid}_Settings-commentFontSizeNum`);
        if (
          cfs instanceof HTMLInputElement &&
          cfsn instanceof HTMLInputElement
        ) {
          cfsn.disabled = cfs.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-hiddenCommentList`)
      ?.addEventListener('change', () => {
        const hcl = document.getElementById(
            `${sid}_Settings-hiddenCommentList`
          ),
          hcln = document.getElementById(
            `${sid}_Settings-hiddenCommentListNum`
          ),
          hcln2 = document.getElementById(
            `${sid}_Settings-hiddenCommentListNum2`
          );
        if (
          hcl instanceof HTMLInputElement &&
          hcln instanceof HTMLInputElement &&
          hcln2 instanceof HTMLInputElement
        ) {
          hcln.disabled = hcl.checked ? false : true;
          hcln2.disabled = hcl.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-qualityEnable`)
      ?.addEventListener('change', () => {
        const qe = document.getElementById(`${sid}_Settings-qualityEnable`),
          tq = document.getElementById(`${sid}_Settings-targetQuality`);
        if (qe instanceof HTMLInputElement && tq instanceof HTMLSelectElement) {
          tq.disabled = qe.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-ngWordEnable`)
      ?.addEventListener('change', () => {
        const ngwe = document.getElementById(`${sid}_Settings-ngWordEnable`),
          ngw = document.getElementById(`${sid}_Settings-ngWord`),
          ngc = document.getElementById(`${sid}_Settings-ngConsole`);
        if (
          ngwe instanceof HTMLInputElement &&
          ngw instanceof HTMLTextAreaElement &&
          ngc instanceof HTMLInputElement
        ) {
          ngw.disabled = ngwe.checked ? false : true;
          ngc.disabled = ngwe.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-ngIdEnable`)
      ?.addEventListener('change', () => {
        const ngie = document.getElementById(`${sid}_Settings-ngIdEnable`),
          ngims = document.getElementById(`${sid}_Settings-ngIdMaxSize`);
        if (
          ngie instanceof HTMLInputElement &&
          ngims instanceof HTMLSelectElement
        ) {
          ngims.disabled = ngie.checked ? false : true;
        }
      });
    document
      .getElementById(`${sid}_Settings-ok`)
      ?.addEventListener('click', () => {
        const eWord = document.getElementById(`${sid}_Settings-ngWord`),
          eWordError = document.getElementById(`${sid}_Settings-ngWord-error`),
          eWordPre = document.getElementById(
            `${sid}_Settings-ngWord-error-pre`
          );
        let sError = '';
        if (eWord instanceof HTMLTextAreaElement) {
          const sWord = eWord.value;
          if (sWord) {
            sError = convertNgword(sWord);
          }
        }
        if (
          eWordError instanceof HTMLDivElement &&
          eWordPre instanceof HTMLPreElement
        ) {
          if (sError) {
            const eTabNg = document.getElementById(`${sid}_Settings-Tab-Ng`);
            if (eTabNg instanceof HTMLInputElement) {
              eWordPre.innerText = sError;
              eWordError.style.display = 'block';
              eTabNg.checked = true;
            }
          } else {
            eWordPre.innerText = '';
            eWordError.style.display = 'none';
            saveSettings();
            closeSettings();
          }
        }
      });
    document
      .getElementById(`${sid}_Settings-cancel`)
      ?.addEventListener('click', () => {
        closeSettings();
        loadSettings();
      });
  };

  /**
   * コメントのプロパティを取得する
   * @param {HTMLDivElement|HTMLFormElement|HTMLLIElement} e 調べる要素
   * @param {string} k キー名
   * @param {string} c コンテンツ
   * @returns {array|boolean|number|object|string}
   */
  const getCommentProps = (e, k, c = '') => {
    let flag = false;
    if (!e) {
      log('getCommentProps: not found element', k);
      return '';
    }
    for (const key of Object.keys(e)) {
      if (key.startsWith('__reactFiber$')) {
        flag = true;
        if (k === 'id' && /le|tv/.test(c)) {
          if (e[key].return?.pendingProps?.commentId) {
            return e[key].return.pendingProps.commentId;
          }
        }
        if (k === 'isOwnComment' && c === 'le') {
          if ('isOwnComment' in e[key].return.pendingProps) {
            return e[key].return.pendingProps.isOwnComment;
          }
        }
        if (k === 'comments' && c === 'ts') {
          if (e[key].return.pendingProps.comments) {
            return e[key].return.pendingProps.comments;
          }
        }
        if (k === 'commentId' && c === 'ts') {
          if ('commentId' in e[key].return.pendingProps) {
            return e[key].return.pendingProps.commentId;
          }
        }
        if (k === 'commentMessage' && c === 'ts') {
          if ('commentMessage' in e[key].return.pendingProps) {
            return e[key].return.pendingProps.commentMessage;
          }
        }
        if (k === 'programId' && c === 'tv') {
          if (e[key].return.pendingProps.slot?.id) {
            return e[key].return.pendingProps.slot.id;
          }
        }
        if (k === 'AdaptationSet') {
          const ma =
            /ts|tv|vi/.test(c) &&
            e[key].return?.stateNode?.player?.getDashAdapter &&
            e[key].return.stateNode.player.getDashAdapter()?.getMpd &&
            e[key].return.stateNode.player.getDashAdapter().getMpd()?.manifest
              ?.Period
              ? e[key].return.stateNode.player.getDashAdapter().getMpd()
                  .manifest
              : c === 'le' &&
                e[key].return?.pendingProps?.contentSession?._player?._dash
                  ?._player?.getDashAdapter &&
                e[
                  key
                ].return.pendingProps.contentSession._player._dash._player.getDashAdapter()
                  ?.getMpd &&
                e[key].return.pendingProps.contentSession._player._dash._player
                  .getDashAdapter()
                  .getMpd()?.manifest?.Period
              ? e[key].return.pendingProps.contentSession._player._dash._player
                  .getDashAdapter()
                  .getMpd().manifest
              : null;
          if (ma?.Period) {
            if (ma.Period.AdaptationSet) return ma.Period.AdaptationSet;
            if (ma.Period instanceof Array) return {};
          }
        }
        if (k === 'abr') {
          const st =
            /ts|tv|vi/.test(c) &&
            e[key].return?.stateNode?.player?.getSettings &&
            e[key].return.stateNode.player.getSettings()?.streaming?.abr
              ? e[key].return.stateNode.player.getSettings()?.streaming
              : c === 'le' &&
                e[key].return?.pendingProps?.contentSession?._player?._dash
                  ?._player?.getSettings &&
                e[
                  key
                ].return.pendingProps.contentSession._player._dash._player.getSettings()
                  ?.streaming?.abr
              ? e[
                  key
                ].return.pendingProps.contentSession._player._dash._player.getSettings()
                  .streaming
              : null;
          if (st?.abr) return st.abr;
        }
        if (e[key].return?.pendingProps?.comment?.[`_${k}`]) {
          return e[key].return.pendingProps.comment[`_${k}`];
        }
        if (e[key].return?.pendingProps?.commentItem?.[k]) {
          return e[key].return.pendingProps.commentItem[k];
        }
      }
    }
    log('getCommentProps: not found key', k, flag, e);
    return '';
  };

  /**
   * テレビで視聴中の番組情報を取得する
   * @param {string} id 番組ID
   */
  const getProgramInfo = (id) => {
    /** @type {HTMLDivElement|null} */
    const screen = document.querySelector(selector.tvScreen);
    if (!screen) return;
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${data.statsDomain}v1/broadcast/slots/${id}`,
      onload: (res) => {
        if (res.status === 200) {
          if (id !== data.programId) return;
          if (!res.responseText) {
            log('getProgramInfo response is empty', res.status, id, 'warn');
            return;
          }
          try {
            data.program = JSON.parse(res.responseText);
            if (data.program.slot) {
              log('getProgramInfo success', res.status, id);
              createProgramInfo(data.program.slot);
            } else {
              log('getProgramInfo success. not found slot', res.status, id);
            }
          } catch (e) {
            log('getProgramInfo failed to parse JSON', e, 'warn');
          }
        }
      },
      onerror: (res) => {
        log('getProgramInfo error', res.status, id);
      },
    });
  };

  /**
   * 視聴している番組のステータスを取得する
   * @param {string} t view:視聴数
   * @param {boolean} f フラグ
   */
  const getStats = (t, f) => {
    if (t === 'view') {
      clearTimeout(interval.statsT);
      /** @type {HTMLDivElement|null} */
      const screen = document.querySelector(selector.tvScreen);
      if (!screen) return;
      const id = getCommentProps(screen, 'programId', 'tv');
      const func = () => {
        clearTimeout(interval.statsT);
        const ta2 = document.querySelector(selector.commentTextarea);
        if (id && ta2 instanceof HTMLTextAreaElement) {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `${
              data.statsDomain
            }v1/broadcast/slots/${id}/stats?${new Date().getTime()}`,
            onload: (res) => {
              if (res.status === 200) {
                if (!res.responseText) {
                  log('getStats responseText is empty', res.status, id, 'warn');
                  return;
                }
                try {
                  const obj = JSON.parse(res.responseText);
                  if (obj?.stats?.view) {
                    ta2.placeholder = `コメントを入力　（視聴数：${obj.stats.view}）`;
                  }
                } catch (e) {
                  log('getStats failed to parse JSON', e, 'warn');
                }
              }
            },
            onerror: (res) => {
              log('getStats Error', res.status, t);
            },
          });
        } else {
          interval.statsT = setTimeout(func, 1000);
        }
      };
      clearInterval(interval.statsI);
      const ta1 = document.querySelector(selector.commentTextarea);
      if (f && id) {
        interval.statsI = setInterval(func, 70000);
        if (ta1 instanceof HTMLTextAreaElement) {
          ta1.placeholder = 'コメントを入力';
        }
        setTimeout(func, 1000);
      } else {
        const ta2 = document.querySelector(selector.commentTextarea);
        if (ta1 instanceof HTMLTextAreaElement) {
          ta1.placeholder = 'コメントを入力';
        }
        if (ta2 instanceof HTMLTextAreaElement) ta2.placeholder = '';
      }
    }
  };

  /**
   * 番組ステータス取得用のドメインを調べる
   */
  const getStatsDomain = () => {
    if (!data.statsDomain) {
      /** @type {NodeListOf<HTMLLinkElement>|null} */
      const link = document.querySelectorAll('link[rel="preconnect"]');
      for (let i = 0, j = link.length; i < j; i++) {
        if (/^https:\/\/api\.[^/]+\.abema-tv\.com\/$/.test(link[i].href)) {
          data.statsDomain = link[i].href;
          break;
        }
      }
    }
  };

  /**
   * 必要ならコメントに色を付ける
   * @param {HTMLDivElement} e1 処理前の新着コメント
   * @param {HTMLDivElement} e2 カスタムデータ属性を付与する新着コメント内の要素
   * @param {String|null|undefined} m コメント本文
   * @param {*} u userID
   * @param {string} t どのページを開いているか
   */
  const highlightComment = (e1, e2, m, u, t) => {
    if (setting.highlightFirstComment) {
      let exists = false,
        duplicate = 0;
      for (let i = 0, j = data.comment.length; i < j; i++) {
        if (data.comment[i].userid === u) {
          exists = true;
          if (m) {
            const mes = m.trim().replace(/(.)\1{3,}$/, '$1$1$1');
            for (let k = 0, l = data.comment[i].message.length; k < l; k++) {
              if (data.comment[i].message[k] === mes) {
                duplicate += 1;
                if (k === 0) {
                  duplicate += 1000;
                } else if (k === 1 && duplicate > 1000) {
                  duplicate += 1000;
                } else if (k === 2 && duplicate > 2000) {
                  duplicate += 1000;
                  break;
                }
              }
            }
            if (data.comment[i].message.length > 4) {
              data.comment[i].message.pop();
            }
            data.comment[i].message.unshift(mes);
          }
          break;
        }
      }
      if (!exists) {
        if (typeof u === 'string' && m) {
          data.comment.push({ userid: u, message: [m] });
          e2.dataset[`${sid.toLowerCase()}Green`] = '';
        }
      } else if (duplicate > 3000) {
        e2.dataset[`${sid.toLowerCase()}Red`] = '';
      } else if (duplicate > 1000) {
        e2.dataset[`${sid.toLowerCase()}Yellow`] = '';
      } else if (duplicate > 0) {
        e2.dataset[`${sid.toLowerCase()}Purple`] = '';
      }
    }
    if (
      setting.highlightNewComment &&
      t === 'le' &&
      getCommentProps(e1, 'isOwnComment', t)
    ) {
      e2.dataset[`${sid.toLowerCase()}Own`] = '';
    }
  };

  /**
   * コメント欄の要素があるか調べる
   */
  const hasCommentElement = () => {
    const check = () => {
      const ca = document.querySelector(selector.commentArea);
      if (ca) {
        clearInterval(interval.comment);
        if (!document.querySelector(`.${sid}_CommentElement`)) {
          setTimeout(() => {
            const cl = ca.querySelector(selector.commentList);
            if (cl) {
              cl.classList.add(`${sid}_CommentElement`);
              if (setting.stopCommentScroll) {
                changeEventListener(true, cl.parentElement, 'commentScroll');
              }
              observerC.observe(cl, { childList: true });
              checkNewComments();
            } else log('hasCommentElement: Not found element.', 'warn');
          }, 1000);
        }
      } else {
        clearInterval(interval.newcomment);
      }
    };
    clearInterval(interval.comment);
    interval.comment = setInterval(check, 500);
    check();
  };

  /**
   * 通知の要素があるか調べる
   */
  const hasNotification = () => {
    clearInterval(interval.notification);
    interval.notification = setInterval(() => {
      const noti = document.querySelector(selector.notification);
      if (noti) {
        clearInterval(interval.notification);
        closeNotificationToast();
      }
    }, 1000);
  };

  /**
   * サイドナビゲーションの要素があるか調べる
   */
  const hasSideNavigation = () => {
    log('hasSideNavigation');
    clearInterval(interval.navigation);
    const startTime = Date.now();
    interval.navigation = setInterval(() => {
      const navi = document.querySelector(selector.sideNavi);
      if (navi) {
        clearInterval(interval.navigation);
        /**
         * 監視タイマーを停止し、管理変数をリセットする
         */
        const clear = () => {
          clearInterval(timerId);
          if (interval.navigation === timerId) interval.navigation = 0;
        };
        const timerId = setInterval(() => {
          const isCollapsed =
            navi.classList.contains(selector.sideNaviColl) ||
            navi.classList.contains(selector.sideNaviWrapColl);
          if (!isCollapsed) {
            clear();
            reduceSideNavigation();
          }
        }, 200);
        interval.navigation = timerId;
        setTimeout(clear, 5000);
      } else if (Date.now() - startTime > 10000) {
        clearInterval(interval.navigation);
      }
    }, 200);
  };

  /**
   * VIDEO要素があるか調べる
   */
  const hasVideoElement = () => {
    clearInterval(interval.videoelement);
    interval.videoelement = setInterval(() => {
      const vi = returnVideo();
      if (vi) {
        clearInterval(interval.videoelement);
        if (!vi.classList.contains(`${sid}_VideoElement`)) {
          log('hasVideoElement');
          const content = returnContentType();
          vi.classList.add(`${sid}_VideoElement`);
          observerV.observe(vi, { attributes: true });
          observerR.observe(vi);
          changeTargetQuality(setting.targetQuality);
          if (setting.viewCounter && data.statsDomain && content === 'tv') {
            getStats('view', true);
          }
          if (content === 'ts') {
            vi.addEventListener('seeked', seekedVideo);
          }
        }
      }
    }, 500);
  };

  /**
   * 見逃し視聴で動画をシークしたとき
   */
  const seekedVideo = async () => {
    log('seekedVideo');
    data.archiveComments.length = 0;
    data.comment.length = 0;
    data.commentId.clear();
    await sleep(1000);
    closeCommentReportForm();
  };

  /**
   * ページを開いたときに実行
   */
  const init = () => {
    log('init');
    checkVersion();
    setInitialValue();
    if (!document.getElementById(`${sid}_Settings`)) createSettings();
    convertNgword(setting.ngWord);
    checkBlockedUser(true);
    GM_registerMenuCommand('設定', openSettings);
    getStatsDomain();
    initStyle();
    if (setting.reduceNavigation) hasSideNavigation();
    if (setting.closeNotification) hasNotification();
    setTimeout(startFirstObserve, 1000);
  };

  /**
   * ページを開いたときに必要な分だけスタイルを追加
   */
  const initStyle = () => {
    addStyle('init');
    if (setting.overlapSidePanel) addStyle('overlapSidePanel');
    if (setting.highlightFirstComment) addStyle('highlightFirstComment');
    if (setting.highlightNewComment) addStyle('highlightNewComment');
    if (setting.sidePanelCloseButton) addStyle('sidePanelCloseButton');
    if (setting.showProgramDetail) addStyle('showProgramDetail');
    if (setting.sidePanelSize) addStyle('sidePanelSize');
    if (setting.hiddenIdAndPlan) addStyle('hiddenIdAndPlan');
    if (setting.hiddenButtonText) addStyle('hiddenButtonText');
    if (setting.videoResolution) addStyle('videoResolution');
    if (setting.semiTransparent) addStyle('semiTransparent');
    if (setting.smallFontSize) addStyle('smallFontSize');
    if (setting.commentFontSize) addStyle('commentFontSize');
    if (setting.reduceCommentSpace) addStyle('reduceCommentSpace');
    if (setting.headerPosition && !/tv|tt/.test(returnContentType())) {
      addStyle('headerPosition');
    }
    if (setting.videoPadding) addStyle('videoPadding');
    if (setting.mouseoverNavigation && returnContentType() !== 'tt') {
      addStyle('mouseoverNavigation');
    }
  };

  /**
   * 設定を読み込んで設定欄に反映する
   */
  const loadSettings = () => {
    /**
     * 変数aの型がsとは異なる場合trueを返す
     * @param {any} a 判別したい変数
     * @param {string} t 型
     * @returns {boolean}
     */
    const notType = (a, t) =>
      Object.prototype.toString.call(a).slice(8, -1) !== t ? true : false;
    /**
     * 保存している値を設定欄のチェックボックスに反映する
     * @param {string} s 変数名
     * @param {string} t 型
     */
    const setCheck = (s, t) => {
      const e = document.getElementById(`${sid}_Settings-${s}`);
      if (e instanceof HTMLInputElement && !notType(setting[s], t)) {
        e.checked = setting[s];
      }
    };
    /**
     * 保存している値を設定欄のセレクトボックスに反映する
     * @param {string} s 変数名
     * @param {string} t 型
     */
    const setSelect = (s, t) => {
      const e = document.getElementById(`${sid}_Settings-${s}`);
      if (e) {
        if (e instanceof HTMLSelectElement && !notType(setting[s], t)) {
          e.options.selectedIndex = setting[s];
        }
      }
    };
    /**
     * 保存している値を設定欄の入力ボックス・テキストエリアに反映する
     * @param {string} s 変数名
     * @param {string} t 型
     */
    const setValue = (s, t) => {
      const e = document.getElementById(`${sid}_Settings-${s}`);
      if (e instanceof HTMLTextAreaElement) {
        if (s === 'ngWord' && !notType(lsWord[s], t)) e.value = lsWord[s];
      } else if (e instanceof HTMLInputElement) {
        if (!notType(setting[s], t)) e.value = setting[s];
      }
    };
    setCheck('reduceNavigation', 'Boolean');
    setCheck('hiddenButtonText', 'Boolean');
    setCheck('closeNotification', 'Boolean');
    setCheck('overlapSidePanel', 'Boolean');
    setCheck('videoResolution', 'Boolean');
    setCheck('semiTransparent', 'Boolean');
    setCheck('smallFontSize', 'Boolean');
    setCheck('closeSidePanel', 'Boolean');
    setCheck('sidePanelCloseButton', 'Boolean');
    setCheck('showProgramDetail', 'Boolean');
    setCheck('sidePanelBackground', 'Boolean');
    setCheck('sidePanelSize', 'Boolean');
    setValue('sidePanelSizeNum', 'String');
    setCheck('hiddenIdAndPlan', 'Boolean');
    setCheck('nextProgramInfo', 'Boolean');
    setCheck('recommendedSeriesInfo', 'Boolean');
    setCheck('skipVideo', 'Boolean');
    setCheck('headerPosition', 'Boolean');
    setCheck('videoPadding', 'Boolean');
    setCheck('dblclickScroll', 'Boolean');
    setCheck('mouseoverNavigation', 'Boolean');
    setCheck('newCommentOneByOne', 'Boolean');
    setCheck('scrollNewComment', 'Boolean');
    setCheck('stopCommentScroll', 'Boolean');
    setCheck('highlightNewComment', 'Boolean');
    setCheck('highlightFirstComment', 'Boolean');
    setCheck('commentFontSize', 'Boolean');
    setValue('commentFontSizeNum', 'String');
    setCheck('reduceCommentSpace', 'Boolean');
    setCheck('hiddenCommentList', 'Boolean');
    setValue('hiddenCommentListNum', 'String');
    setValue('hiddenCommentListNum2', 'String');
    setCheck('escKey', 'Boolean');
    setCheck('enterKey', 'Boolean');
    setCheck('viewCounter', 'Boolean');
    setCheck('reportFormCommentList', 'Boolean');
    setCheck('programInfo1', 'Boolean');
    setCheck('programInfo2', 'Boolean');
    setValue('programInfo2Num', 'String');
    setCheck('qualityEnable', 'Boolean');
    setSelect('targetQuality', 'Number');
    setCheck('ngWordEnable', 'Boolean');
    setValue('ngWord', 'String');
    setSelect('ngIdMaxSize', 'Number');
    setCheck('ngConsole', 'Boolean');
    setCheck('ngIdEnable', 'Boolean');
    const spb = document.getElementById(`${sid}_Settings-sidePanelBackground`);
    if (spb instanceof HTMLInputElement) {
      spb.disabled = setting.overlapSidePanel ? false : true;
    }
    const snc = document.getElementById(`${sid}_Settings-scrollNewComment`);
    if (snc instanceof HTMLInputElement) {
      snc.disabled = setting.newCommentOneByOne ? false : true;
    }
    const tq = document.getElementById(`${sid}_Settings-targetQuality`);
    if (tq instanceof HTMLSelectElement) {
      tq.disabled = setting.qualityEnable ? false : true;
    }
    const ngw = document.getElementById(`${sid}_Settings-ngWord`),
      ngc = document.getElementById(`${sid}_Settings-ngConsole`);
    if (ngw instanceof HTMLTextAreaElement && ngc instanceof HTMLInputElement) {
      ngw.disabled = setting.ngWordEnable ? false : true;
      ngc.disabled = setting.ngWordEnable ? false : true;
    }
    const ngims = document.getElementById(`${sid}_Settings-ngIdMaxSize`);
    if (ngims instanceof HTMLSelectElement) {
      ngims.disabled = setting.ngIdEnable ? false : true;
    }
    const ngwe = document.getElementById(`${sid}_Settings-ngWord-error`),
      ngwep = document.getElementById(`${sid}_Settings-ngWord-error-pre`);
    if (ngwe instanceof HTMLDivElement && ngwep instanceof HTMLPreElement) {
      ngwep.innerText = '';
      ngwe.style.display = 'none';
    }
    const record = document.getElementById(`${sid}_Settings-ngId-record`);
    if (record instanceof HTMLSpanElement) {
      record.textContent = data.ngId.size
        ? `（現在の保存数:${data.ngId.size}）`
        : '';
    }
  };

  /**
   * デバッグ用ログ
   * @param {...any} a
   */
  const log = (...a) => {
    if (ls.debug) {
      try {
        if (/^debug$|^error$|^info$|^warn$/.test(a[a.length - 1])) {
          const b = a.pop();
          console[b](sid, ...a);
        } else console.log(sid, ...a);
      } catch (e) {
        if (e instanceof Error) console.error(e.message, ...a);
        else if (typeof e === 'string') console.error(e, ...a);
        else console.error('log error', ...a);
      }
    }
  };

  /**
   * 該当するコメントをNG処理する
   * @param {NodeListOf<HTMLDivElement>} n 処理前の新着コメント一覧
   * @param {HTMLElement} e コメントリストの親要素
   * @param {string} t どのページを開いているか
   * @param {boolean} r true:見逃し視聴でuserID未登録コメントのブロックアイコンをクリックしたとき
   */
  const ngComment = (n, e, t, r) => {
    for (let i = 0; i < n.length; i++) {
      const eMessage = n[i].querySelector(selector.commentMessage),
        /** @type {HTMLDivElement|null} */
        eInner = n[i].querySelector(selector.commentInner),
        message = eMessage?.textContent;
      let cid = undefined,
        ngFlag = false,
        userId = undefined;
      //コメントIDとユーザーIDを取得
      if (/le|tv/.test(t)) {
        cid = getCommentProps(n[i], 'id', t);
      } else if (t === 'ts') {
        cid = getCommentProps(n[i], 'commentId', t);
        if (eInner) {
          if (`${sid.toLowerCase()}UserId` in eInner.dataset) {
            userId = eInner.dataset[`${sid.toLowerCase()}UserId`];
          } else {
            for (let j = 0, k = data.archiveComments.length; j < k; j++) {
              if (data.archiveComments[j].id === cid) {
                userId = data.archiveComments[j].userId;
                eInner.dataset[`${sid.toLowerCase()}UserId`] = userId;
                break;
              }
            }
            if (!userId) {
              log('checkNewComments: not found userId', cid, message);
            }
          }
        }
      }
      const uid = t === 'ts' ? userId : getCommentProps(n[i], 'userId');
      if (!eInner || !cid) continue;
      if (!data.commentId.has(cid)) {
        data.commentId.add(cid);
        //NG IDの処理
        if (!ngFlag && setting.ngIdEnable && uid) {
          if (!(`${sid.toLowerCase()}Ngid` in eInner.dataset)) {
            if (data.ngId.has(uid)) {
              ngFlag = true;
              log(`NG ID: ${uid} / ${cid} / ${message}`);
              eInner.dataset[`${sid.toLowerCase()}Ngid`] = '';
            }
          }
        }
        //NGワードの処理
        if (
          !r &&
          !ngFlag &&
          setting.ngWordEnable &&
          message &&
          !(`${sid.toLowerCase()}Ngword` in eInner.dataset)
        ) {
          for (let j = 0, k = data.ngWordText.length; j < k; j++) {
            if (data.ngWordText[j] && message.includes(data.ngWordText[j])) {
              ngFlag = true;
              eInner.dataset[`${sid.toLowerCase()}Ngword`] = '';
              if (setting.ngConsole) {
                console.log(
                  `${sid} NG Word: ${data.ngWordText[j]} / Comment: ${message} / UserID: ${uid}`
                );
              }
              break;
            }
          }
          if (!ngFlag) {
            for (let j = 0, k = data.ngWordRe.length; j < k; j++) {
              const re = data.ngWordRe[j];
              re.lastIndex = 0;
              if (re.test(message)) {
                ngFlag = true;
                eInner.dataset[`${sid.toLowerCase()}Ngword`] = '';
                if (setting.ngConsole) {
                  re.lastIndex = 0;
                  const ng = re.exec(message);
                  if (ng) {
                    console.log(
                      `${sid} NG Word: ${ng[0]} / Comment: ${ng.input} / UserID: ${uid}`
                    );
                  }
                }
                break;
              }
            }
          }
        }
      } else if (t !== 'ts') {
        //重複コメントの処理
        ngFlag = true;
        if (!(`${sid.toLowerCase()}Duplicate` in eInner.dataset)) {
          log(`---------- Duplicate: ${uid} / ${cid} / ${message} ----------`);
          eInner.dataset[`${sid.toLowerCase()}Duplicate`] = '';
        }
      }
      if (ngFlag) eInner.dataset[`${sid.toLowerCase()}Hidden`] = '';
      if (uid) highlightComment(n[i], eInner, message, uid, t);
    }
    if (!r) {
      if (t !== 'ts') {
        const dupli = document.querySelectorAll(selector.commentDuplicate);
        for (let i = 0, j = dupli.length; i < j; i++) {
          const inner = dupli[i].firstChild;
          if (inner) inner.remove();
        }
      }
      visibleComment(e, t);
    }
  };

  /**
   * 設定欄を開く
   */
  const openSettings = () => {
    const settings = document.querySelector(`#${sid}_Settings`);
    if (settings && settings.classList.contains(`${sid}_Settings_hidden`)) {
      loadSettings();
      settings.classList.remove(`${sid}_Settings_hidden`);
    }
  };

  /**
   * サイドナビゲーションを縮める
   */
  const reduceSideNavigation = () => {
    log('reduceSideNavigation');
    /** @type {HTMLButtonElement|null} */
    const headerMenu = document.querySelector(selector.headerMenu);
    headerMenu?.click();
  };

  /**
   * 報告フォームの下にそのユーザーのコメント一覧を追加する
   * @param {HTMLFormElement} e ブロックアイコンをクリックして表示される報告フォームの要素
   * @param {string} t どのページを開いているか
   * @param {*} u ブロックアイコンをクリックしたコメントのuserID
   */
  const reportformUserComment = (e, t, u) => {
    log('reportformUserComment', t, u);
    const list = document.querySelectorAll(selector.comenntAll),
      comments = [],
      ids = new Set();
    const addComment = (message, id) => {
      if (message && typeof message === 'string' && !ids.has(id)) {
        comments.push(message);
        ids.add(id);
      }
    };
    for (let i = 0, j = list.length; i < j; i++) {
      const co = list[i];
      if (co instanceof HTMLDivElement || co instanceof HTMLLIElement) {
        if (/le|tv/.test(t)) {
          if (getCommentProps(co, 'userId') === u) {
            addComment(
              getCommentProps(co, t === 'tv' ? 'message' : 'body'),
              getCommentProps(co, 'id', t)
            );
          }
        } else if (t === 'ts') {
          const p = co.querySelector('p');
          if (p instanceof HTMLParagraphElement) {
            if (p.dataset[`${sid.toLowerCase()}UserId`] === u) {
              addComment(
                getCommentProps(co, 'commentMessage', t),
                getCommentProps(co, 'commentId', t)
              );
            }
          }
        }
      }
    }
    if (comments.length) {
      const eWrapper = document.createElement('div'),
        eHeader = document.createElement('div'),
        eList = document.createElement('div');
      eWrapper.id = `${sid}_CommentReportForm-NgComment`;
      eHeader.id = `${sid}_CommentReportForm-NgCommentHeader`;
      eHeader.textContent = 'このユーザーのコメント履歴:';
      eList.id = `${sid}_CommentReportForm-NgCommentList`;
      eWrapper.appendChild(eHeader);
      for (let i = 0, j = comments.length; i < j; i++) {
        const p = document.createElement('p');
        p.textContent = comments[i];
        eList.appendChild(p);
      }
      eWrapper.appendChild(eList);
      e.appendChild(eWrapper);
    }
  };

  /**
   * 動画の大きさが変わったとき
   */
  const resizeVideo = () => {
    clearTimeout(interval.resizeVideo);
    interval.resizeVideo = setTimeout(() => {
      changeTargetQuality(setting.targetQuality);
      checkVisibleFooter();
    }, 500);
  };

  /**
   * スタイルを追加・削除する
   * @param {string} s スタイルの設定名
   * @param {boolean} b trueならスタイルを追加
   */
  const reStyle = (s, b) => {
    removeStyle(s);
    if (b) addStyle(s);
  };

  /**
   * スタイルを削除する
   * @param {string} s スタイルの設定名
   */
  const removeStyle = (s) => {
    const e = document.getElementById(`${sid}_style_${s}`);
    if (e instanceof HTMLStyleElement) e.remove();
  };

  /**
   * どのコンテンツを表示しているかを返す
   * @returns {string} tv:テレビ, ts:見逃し視聴, le:ライブイベント, vi:ビデオ, tt:番組表
   */
  const returnContentType = () => {
    const type = /^https:\/\/abema\.tv\/now-on-air\/.+$/.test(location.href)
      ? 'tv'
      : /^https:\/\/abema\.tv\/channels\/.+$/.test(location.href)
      ? 'ts'
      : /^https:\/\/abema\.tv\/live-event\/.+$/.test(location.href)
      ? 'le'
      : /^https:\/\/abema\.tv\/video\/episode\/.+$/.test(location.href)
      ? 'vi'
      : /^https:\/\/abema\.tv\/timetable/.test(location.href)
      ? 'tt'
      : '';
    return type;
  };

  /**
   * 日時に変換した文字列を返す
   * @param {number} d
   * @returns {string} 「1月2日(火) 03:04」のような形式の文字列
   */
  const returnFormatDate = (d) => {
    if (d < 10000000000) d = d * 1000;
    const date = new Date(d),
      month = (date.getMonth() + 1).toString(),
      day = date.getDate().toString(),
      week = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
      hours = date.getHours().toString().padStart(2, '0'),
      minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日(${week}) ${hours}:${minutes}`;
  };

  /**
   * video要素を返す
   * @returns {HTMLVideoElement|null}
   */
  const returnVideo = () => {
    /** @type {HTMLVideoElement|null} */
    const vi = document.querySelector(selector.video);
    return vi ? vi : null;
  };

  /**
   * 動画のvideoTracksを返す
   * @returns {object|undefined}
   */
  const returnVideoTracks = () => {
    const vc = document.querySelector(selector.videoContainer);
    if (vc) {
      for (const key of Object.keys(vc)) {
        if (
          key.startsWith('__reactFiber$') &&
          vc[key].return?.stateNode?.player?.videoTracks?.[0]
        ) {
          return vc[key].return.stateNode.player.videoTracks[0];
        }
      }
    }
    return undefined;
  };

  /**
   * 設定を保存する
   */
  const saveSettings = () => {
    /**
     * 設定欄のチェックボックスの値を取得する
     * @param {string} s 変数名
     */
    const getCheck = (s) => {
      const e = document.getElementById(`${sid}_Settings-${s}`);
      if (e instanceof HTMLInputElement) {
        setting[s] = e.checked ? true : false;
      }
    };
    /**
     * 設定欄のセレクトボックスの値を取得する
     * @param {string} s 変数名
     */
    const getSelect = (s) => {
      const e = document.getElementById(`${sid}_Settings-${s}`);
      if (e instanceof HTMLSelectElement) {
        const index = e.options.selectedIndex;
        if (Number.isInteger(index) && index >= 0) {
          setting[s] = index;
        }
      }
    };
    /**
     * 設定欄の入力ボックス・テキストエリアの値を取得する
     * @param {string} s 変数名
     */
    const getValue = (s) => {
      const e = document.getElementById(`${sid}_Settings-${s}`);
      if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) {
        if (s === 'commentFontSizeNum') {
          if (!e.value || isNaN(Number(e.value)) || /e/.test(e.value)) {
            e.value = '13';
          } else if (Number(e.value) < 10) e.value = '10';
          else if (Number(e.value) > 32) e.value = '32';
        } else if (
          s === 'hiddenCommentListNum' ||
          s === 'hiddenCommentListNum2'
        ) {
          if (!e.value || isNaN(Number(e.value)) || /e/.test(e.value)) {
            if (s === 'hiddenCommentListNum') e.value = '50';
            else if (s === 'hiddenCommentListNum2') e.value = '';
          } else if (Number(e.value) < 0) e.value = '0';
          else if (Number(e.value) > 100) e.value = '100';
        } else if (s === 'programInfo2Num') {
          if (!e.value || isNaN(Number(e.value)) || /e/.test(e.value)) {
            e.value = '3';
          } else if (Number(e.value) < 1) e.value = '1';
          else if (Number(e.value) > 60) e.value = '60';
        } else if (s === 'sidePanelSizeNum') {
          if (!e.value || isNaN(Number(e.value)) || /e/.test(e.value)) {
            e.value = '320';
          } else if (Number(e.value) < 100) e.value = '100';
          else if (Number(e.value) > 1000) e.value = '1000';
        }
        setting[s] = e.value ? e.value : '';
      }
    };
    const content = returnContentType();
    document.getElementById(`${sid}_Settings-ok`)?.blur();
    getCheck('reduceNavigation');
    getCheck('hiddenButtonText');
    getCheck('closeNotification');
    getCheck('overlapSidePanel');
    getCheck('videoResolution');
    getCheck('semiTransparent');
    getCheck('smallFontSize');
    getCheck('closeSidePanel');
    getCheck('sidePanelBackground');
    getCheck('sidePanelCloseButton');
    getCheck('showProgramDetail');
    getCheck('sidePanelSize');
    getValue('sidePanelSizeNum');
    getCheck('hiddenIdAndPlan');
    getCheck('nextProgramInfo');
    getCheck('recommendedSeriesInfo');
    getCheck('skipVideo');
    getCheck('headerPosition');
    getCheck('videoPadding');
    getCheck('dblclickScroll');
    getCheck('mouseoverNavigation');
    getCheck('newCommentOneByOne');
    getCheck('scrollNewComment');
    getCheck('stopCommentScroll');
    getCheck('highlightNewComment');
    getCheck('highlightFirstComment');
    getCheck('commentFontSize');
    getValue('commentFontSizeNum');
    getCheck('reduceCommentSpace');
    getCheck('hiddenCommentList');
    getValue('hiddenCommentListNum');
    getValue('hiddenCommentListNum2');
    getCheck('escKey');
    getCheck('enterKey');
    getCheck('viewCounter');
    getCheck('reportFormCommentList');
    getCheck('programInfo1');
    getCheck('programInfo2');
    getValue('programInfo2Num');
    getCheck('qualityEnable');
    getSelect('targetQuality');
    getCheck('ngWordEnable');
    getValue('ngWord');
    getSelect('ngIdMaxSize');
    getCheck('ngConsole');
    getCheck('ngIdEnable');
    ls.reduceNavigation = setting.reduceNavigation;
    if (ls.hiddenButtonText !== setting.hiddenButtonText) {
      reStyle('hiddenButtonText', setting.hiddenButtonText);
    }
    ls.hiddenButtonText = setting.hiddenButtonText;
    ls.closeNotification = setting.closeNotification;
    if (ls.videoResolution !== setting.videoResolution) {
      reStyle('videoResolution', setting.videoResolution);
    }
    ls.videoResolution = setting.videoResolution;
    if (ls.semiTransparent !== setting.semiTransparent) {
      reStyle('semiTransparent', setting.semiTransparent);
    }
    ls.semiTransparent = setting.semiTransparent;
    if (ls.smallFontSize !== setting.smallFontSize) {
      reStyle('smallFontSize', setting.smallFontSize);
    }
    ls.smallFontSize = setting.smallFontSize;
    ls.closeSidePanel = setting.closeSidePanel;
    if (ls.overlapSidePanel !== setting.overlapSidePanel) {
      reStyle('overlapSidePanel', setting.overlapSidePanel);
      if (setting.highlightNewComment) reStyle('highlightNewComment', true);
      if (setting.highlightFirstComment) reStyle('highlightFirstComment', true);
    }
    ls.overlapSidePanel = setting.overlapSidePanel;
    if (ls.sidePanelBackground !== setting.sidePanelBackground) {
      reStyle('sidePanelBackground', setting.sidePanelBackground);
    }
    ls.sidePanelBackground = setting.sidePanelBackground;
    if (ls.sidePanelCloseButton !== setting.sidePanelCloseButton) {
      reStyle('sidePanelCloseButton', setting.sidePanelCloseButton);
    }
    ls.sidePanelCloseButton = setting.sidePanelCloseButton;
    if (ls.showProgramDetail !== setting.showProgramDetail) {
      reStyle('showProgramDetail', setting.showProgramDetail);
    }
    ls.showProgramDetail = setting.showProgramDetail;
    if (ls.sidePanelSize || ls.sidePanelSize !== setting.sidePanelSize) {
      reStyle('overlapSidePanel', setting.overlapSidePanel);
      reStyle('sidePanelSize', setting.sidePanelSize);
    }
    ls.sidePanelSize = setting.sidePanelSize;
    if (ls.hiddenIdAndPlan !== setting.hiddenIdAndPlan) {
      reStyle('hiddenIdAndPlan', setting.hiddenIdAndPlan);
    }
    ls.hiddenIdAndPlan = setting.hiddenIdAndPlan;
    ls.sidePanelSizeNum = setting.sidePanelSizeNum;
    ls.nextProgramInfo = setting.nextProgramInfo;
    ls.recommendedSeriesInfo = setting.recommendedSeriesInfo;
    ls.skipVideo = setting.skipVideo;
    if (ls.headerPosition !== setting.headerPosition) {
      reStyle('headerPosition', setting.headerPosition);
    }
    if (/tv|tt/.test(content)) removeStyle('headerPosition');
    ls.headerPosition = setting.headerPosition;
    if (ls.videoPadding !== setting.videoPadding) {
      reStyle('videoPadding', setting.videoPadding);
    }
    ls.videoPadding = setting.videoPadding;
    ls.dblclickScroll = setting.dblclickScroll;
    if (ls.mouseoverNavigation !== setting.mouseoverNavigation) {
      reStyle('mouseoverNavigation', setting.mouseoverNavigation);
    }
    if (content === 'tt') removeStyle('mouseoverNavigation');
    ls.mouseoverNavigation = setting.mouseoverNavigation;
    ls.newCommentOneByOne = setting.newCommentOneByOne;
    ls.scrollNewComment = setting.scrollNewComment;
    if (ls.stopCommentScroll !== setting.stopCommentScroll) {
      changeEventListener(
        setting.stopCommentScroll,
        document.querySelector(selector.commentList)?.parentElement,
        'commentScroll'
      );
    }
    ls.stopCommentScroll = setting.stopCommentScroll;
    if (ls.highlightNewComment !== setting.highlightNewComment) {
      reStyle('highlightNewComment', setting.highlightNewComment);
    }
    ls.highlightNewComment = setting.highlightNewComment;
    if (ls.highlightFirstComment !== setting.highlightFirstComment) {
      reStyle('highlightFirstComment', setting.highlightFirstComment);
    }
    ls.highlightFirstComment = setting.highlightFirstComment;
    if (ls.commentFontSizeNum !== setting.commentFontSizeNum) {
      reStyle('commentFontSize', setting.commentFontSize);
    }
    ls.commentFontSizeNum = setting.commentFontSizeNum;
    if (ls.commentFontSize !== setting.commentFontSize) {
      reStyle('commentFontSize', setting.commentFontSize);
    }
    ls.commentFontSize = setting.commentFontSize;
    if (ls.reduceCommentSpace !== setting.reduceCommentSpace) {
      reStyle('reduceCommentSpace', setting.reduceCommentSpace);
    }
    ls.reduceCommentSpace = setting.reduceCommentSpace;
    if (ls.hiddenCommentList && !setting.hiddenCommentList) {
      removeStyle('hiddenCommentList');
      removeStyle('hiddenCommentList2');
    }
    ls.hiddenCommentList = setting.hiddenCommentList;
    if (
      setting.hiddenCommentList &&
      ls.hiddenCommentListNum !== setting.hiddenCommentListNum &&
      document.getElementById(`${sid}_style_hiddenCommentList`)
    ) {
      reStyle('hiddenCommentList', true);
    }
    ls.hiddenCommentListNum = setting.hiddenCommentListNum;
    if (
      setting.hiddenCommentList &&
      ls.hiddenCommentListNum2 !== setting.hiddenCommentListNum2 &&
      document.getElementById(`${sid}_style_hiddenCommentList2`)
    ) {
      reStyle('hiddenCommentList2', setting.hiddenCommentListNum2);
    }
    ls.hiddenCommentListNum2 = setting.hiddenCommentListNum2;
    ls.escKey = setting.escKey;
    ls.enterKey = setting.enterKey;
    if (ls.viewCounter && !setting.viewCounter) getStats('view', false);
    ls.viewCounter = setting.viewCounter;
    ls.reportFormCommentList = setting.reportFormCommentList;
    ls.programInfo1 = setting.programInfo1;
    if (ls.programInfo2 && !setting.programInfo2) {
      const info2 = document.getElementById(`${sid}_ProgramInfo2`);
      if (info2 && getComputedStyle(info2).display !== 'none') {
        clearTimeout(interval.programInfo2);
        info2.classList.add(`${sid}_ProgramInfo_hidden`);
      }
    }
    ls.programInfo2 = setting.programInfo2;
    ls.programInfo2Num = setting.programInfo2Num;
    if ((setting.programInfo1 || setting.programInfo2) && data.programId) {
      if (data.program.slot?.id !== data.programId) {
        getProgramInfo(data.programId);
      }
    }
    ls.qualityEnable = setting.qualityEnable;
    if (setting.targetQuality !== ls.targetQuality) {
      changeTargetQuality(setting.targetQuality);
    }
    ls.targetQuality = setting.targetQuality;
    ls.ngWordEnable = setting.ngWordEnable;
    lsWord.ngWord = setting.ngWord;
    ls.ngIdEnable = setting.ngIdEnable;
    lsId.ngId = setting.ngId ? [...setting.ngId] : [];
    data.ngId = new Set(setting.ngId);
    if (
      ls.ngIdMaxSize < setting.ngIdMaxSize &&
      setting.ngId.length > setting._ngid[ls.ngIdMaxSize]
    ) {
      setting.ngId.splice(
        0,
        setting.ngId.length - setting._ngid[ls.ngIdMaxSize]
      );
      data.ngId = new Set(setting.ngId);
    }
    ls.ngIdMaxSize = setting.ngIdMaxSize;
    ls.ngConsole = setting.ngConsole;
    ls.ngIdEnable = setting.ngIdEnable;
    saveStorage();
  };

  /**
   * ローカルストレージに保存する
   */
  const saveStorage = () => {
    try {
      localStorage.setItem(sid, JSON.stringify(ls));
      localStorage.setItem(`${sid}-Word`, JSON.stringify(lsWord));
      localStorage.setItem(`${sid}-Id`, JSON.stringify(lsId));
    } catch (e) {
      log(`${sid}: Failed to save settings to localStorage.`, e, 'error');
    }
  };

  /**
   * 可能であれば動画の上側や左側に隙間がなくなるようにページをスクロールする
   */
  const adjustScrollPosition = () => {
    log('adjustScrollPosition');
    const player = document.querySelector(selector.videoMainPlayer);
    if (player) {
      player.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  /**
   * 見逃しコメントを登録する
   * @param {number} n
   * @returns
   */
  const setArchiveComments = (n) => {
    /** @type {HTMLCollection|null} */
    const acc = document.getElementsByClassName(
      selector.archiveCommentContainer
    );
    if (acc.length && acc[0] instanceof HTMLDivElement) {
      const ac = getCommentProps(acc[0], 'comments', 'ts');
      if (ac instanceof Array) {
        data.archiveComments = ac.slice(n);
      } else data.archiveComments.length = 0;
      return true;
    }
    data.archiveComments.length = 0;
    return false;
  };

  /**
   * このスクリプトを初めて使うときやローカルストレージを削除したとき初期値を登録する
   */
  const setInitialValue = () => {
    /**
     * 変数aの型がsとは異なる場合trueを返す
     * @param {string} t 型
     * @param {any} a 判別したい変数
     * @returns {boolean}
     */
    const notType = (t, a) =>
      Object.prototype.toString.call(a).slice(8, -1) !== t ? true : false;
    /**
     * 設定用の変数が異なる型の場合は初期値を登録する
     * @param {string} s 変数名
     * @param {string} t 型の先頭3文字
     * @param {any} a 初期値
     */
    const setValue = (s, t, a) => {
      if (notType(t, setting[s])) {
        setting[s] = a;
        if (s === 'ngWord') lsWord[s] = '';
        else if (s === 'ngId') lsId[s] = [];
        else setting[s] = a;
      }
    };
    if (!lsWord.ngWord) lsWord.ngWord = '';
    if (!lsId.ngId) lsId.ngId = [];
    setValue('reduceNavigation', 'Boolean', true);
    setValue('hiddenButtonText', 'Boolean', true);
    setValue('closeNotification', 'Boolean', false);
    setValue('videoResolution', 'Boolean', true);
    setValue('semiTransparent', 'Boolean', true);
    setValue('smallFontSize', 'Boolean', true);
    setValue('closeSidePanel', 'Boolean', true);
    setValue('overlapSidePanel', 'Boolean', true);
    setValue('sidePanelBackground', 'Boolean', true);
    setValue('sidePanelCloseButton', 'Boolean', true);
    setValue('showProgramDetail', 'Boolean', true);
    setValue('sidePanelSize', 'Boolean', false);
    setValue('sidePanelSizeNum', 'String', '320');
    setValue('hiddenIdAndPlan', 'Boolean', true);
    setValue('nextProgramInfo', 'Boolean', true);
    setValue('recommendedSeriesInfo', 'Boolean', true);
    setValue('skipVideo', 'Boolean', false);
    setValue('headerPosition', 'Boolean', true);
    setValue('videoPadding', 'Boolean', true);
    setValue('dblclickScroll', 'Boolean', true);
    setValue('mouseoverNavigation', 'Boolean', true);
    setValue('newCommentOneByOne', 'Boolean', true);
    setValue('scrollNewComment', 'Boolean', true);
    setValue('stopCommentScroll', 'Boolean', true);
    setValue('highlightNewComment', 'Boolean', true);
    setValue('highlightFirstComment', 'Boolean', true);
    setValue('commentFontSize', 'Boolean', false);
    setValue('commentFontSizeNum', 'String', '13');
    setValue('reduceCommentSpace', 'Boolean', true);
    setValue('hiddenCommentList', 'Boolean', true);
    setValue('hiddenCommentListNum', 'String', '50');
    setValue('hiddenCommentListNum2', 'String', '');
    setValue('escKey', 'Boolean', true);
    setValue('enterKey', 'Boolean', true);
    setValue('viewCounter', 'Boolean', false);
    setValue('reportFormCommentList', 'Boolean', true);
    setValue('programInfo1', 'Boolean', true);
    setValue('programInfo2', 'Boolean', true);
    setValue('programInfo2Num', 'String', '3');
    setValue('qualityEnable', 'Boolean', true);
    setValue('targetQuality', 'Number', 0);
    setValue('ngWordEnable', 'Boolean', true);
    setValue('ngWord', 'String', '');
    setValue('ngIdMaxSize', 'Number', 0);
    setValue('ngId', 'Array', '');
    setValue('ngConsole', 'Boolean', false);
    setValue('ngIdEnable', 'Boolean', true);
    saveStorage();
  };

  /**
   * 動画の解像度と表示領域サイズを調べて表示する
   */
  const showVideoResolution = () => {
    if (!setting.videoResolution) return;
    const retry = () => {
      data.showVideoResolution = false;
      showVideoResolution();
    };
    clearTimeout(interval.resolution);
    interval.resolution = setTimeout(() => {
      const dpr = window.devicePixelRatio,
        footer = document.querySelector(selector.footer),
        content = returnContentType(),
        vi = returnVideo(),
        vr = document.getElementById(`${sid}_VideoResolution`),
        ch = vi?.clientHeight,
        cw = vi?.clientWidth,
        vh = vi?.videoHeight,
        vw = vi?.videoWidth;
      if (vi && dpr && ch && cw && vh && vw) {
        if (
          !vr ||
          video.pixelRatio !== dpr ||
          video.clientHeight !== ch ||
          video.clientWidth !== cw ||
          video.videoHeight !== vh ||
          video.videoWidth !== vw ||
          !video.maxHeight
        ) {
          let desc = `動画解像度: ${vw}×${vh}`,
            maxHeight = 0;
          if (/tv|le/.test(content)) {
            const vt = returnVideoTracks();
            if (vt?.qualities) {
              if (vt.qualities[0].height < vt.qualities.at(-1).height) {
                maxHeight = vt.qualities.at(-1).height;
              } else {
                maxHeight = vt.qualities[0].height;
              }
            } else {
              const vc = document.querySelector(selector.videoContainer);
              if (vc instanceof HTMLDivElement) {
                /** @type {Object} */
                const as = getCommentProps(vc, 'AdaptationSet', content);
                if (as instanceof Array) {
                  for (const e of as) {
                    if (/^video\//.test(e.mimeType)) {
                      const availableHeight = e.Representation.map(
                        (r) => r.height
                      );
                      maxHeight = Math.max(...availableHeight);
                    }
                  }
                } else {
                  if (!data.showVideoResolution) {
                    data.showVideoResolution = true;
                    setTimeout(retry, 1000);
                  }
                }
              }
            }
          }
          if (maxHeight) desc += ` (Max: ${maxHeight}p)`;
          desc += ` / 表示領域: ${cw}×${ch}`;
          if (dpr !== 1) desc += ` * ${dpr}`;
          if (mainElement) observerE.disconnect();
          if (vr) {
            vr.innerText = desc;
          } else {
            const div = document.createElement('div');
            div.id = `${sid}_VideoResolution`;
            div.innerText = desc;
            if (footer) footer.appendChild(div);
          }
          if (mainElement) {
            observerE.observe(mainElement, { childList: true, subtree: true });
          }
          if (maxHeight && !video.maxHeight) {
            changeTargetQuality(setting.targetQuality);
          }
          video.clientHeight = ch;
          video.clientWidth = cw;
          video.maxHeight = maxHeight;
          video.pixelRatio = dpr;
          video.videoHeight = vh;
          video.videoWidth = vw;
        }
      } else {
        if (!data.showVideoResolution) {
          data.showVideoResolution = true;
          setTimeout(retry, 1000);
        }
      }
    }, 100);
  };

  /**
   * 指定時間だけ待機する
   * @param {number} ms
   * @returns
   */
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * ページを開いて動画が表示されたら1度だけ実行
   */
  const startFirstObserve = () => {
    log('startFirstObserve');
    document.addEventListener('keydown', checkKeyDown, true);
    document.addEventListener('click', checkClick);
    document.addEventListener('dblclick', checkDblclick);
    document.addEventListener('contextmenu', checkContextmenu);
    const main = document.querySelector(selector.main),
      head = document.querySelector('head');
    mainElement = main;
    if (main && head) {
      observerE.observe(main, { childList: true, subtree: true });
      observerT.observe(head, { childList: true });
    } else log('startFirstObserve: Not found element.', 'warn');
  };

  /**
   * 視聴中の番組情報が記載されている要素を表示/非表示
   */
  const toggleProgramInfo = () => {
    const e1 = document.getElementById(`${sid}_ProgramInfo1`);
    if (e1) {
      if (e1.classList.contains(`${sid}_ProgramInfo_hidden`)) {
        e1.classList.remove(`${sid}_ProgramInfo_hidden`);
        const e2 = document.getElementById(`${sid}_ProgramInfo2`);
        if (e2 && getComputedStyle(e2).display !== 'none') {
          clearTimeout(interval.programInfo2);
          e2.classList.add(`${sid}_ProgramInfo_hidden`);
        }
      } else {
        e1.classList.add(`${sid}_ProgramInfo_hidden`);
      }
    }
  };

  /**
   * 新着コメントを1つずつもしくは一気に表示する
   * @param {HTMLElement} e コメントリストの親要素
   * @param {string} t どのページを開いているか
   */
  const visibleComment = (e, t) => {
    const clickContinueButton = () => {
      /** @type {HTMLButtonElement|null} */
      const cButton = document.querySelector(selector.commentContinue);
      if (cButton) cButton.click();
    };
    if (setting.newCommentOneByOne) {
      const hidden = document.querySelectorAll(selector.commentHidden),
        time =
          t === 'tv' || t === 'ts'
            ? hidden.length > 7
              ? (6.5 / hidden.length) * 1000
              : 920
            : t === 'le'
            ? hidden.length > 5
              ? (4.5 / hidden.length) * 1000
              : 900
            : 1000;
      clearInterval(interval.newcomment);
      interval.newcomment = setInterval(() => {
        const ch = document.querySelector(selector.commentHidden),
          rf = document.querySelector(selector.commentReport);
        if (!rf && !data.commentMouseEnter) {
          if (ch) {
            /** @type {HTMLDivElement|null} */
            const chi = ch.querySelector(selector.commentInner);
            if (chi) chi.dataset[`${sid.toLowerCase()}Hidden`] = 'false';
            if (e.scrollHeight - e.scrollTop - e.clientHeight < 500) {
              if (setting.scrollNewComment && hidden.length < 30) {
                e.scroll({
                  top: e.scrollHeight,
                  behavior: 'auto',
                });
                e.scrollBy({
                  top: -ch.clientHeight,
                  behavior: 'auto',
                });
                e.scrollBy({
                  top: ch.clientHeight + 1,
                  behavior: 'smooth',
                });
              } else {
                e.scrollBy({
                  top: ch.clientHeight + 1,
                  behavior: 'auto',
                });
              }
              clickContinueButton();
            }
          } else {
            clearInterval(interval.newcomment);
            if (e.scrollHeight - e.scrollTop - e.clientHeight < 500) {
              if (setting.scrollNewComment && hidden.length < 30) {
                e.scroll({
                  top: e.scrollHeight,
                  behavior: 'smooth',
                });
              } else {
                e.scroll({
                  top: e.scrollHeight,
                  behavior: 'auto',
                });
              }
              clickContinueButton();
            }
          }
        }
      }, time);
    } else {
      const ch = document.querySelectorAll(selector.commentHidden),
        rf = document.querySelector(selector.commentReport);
      if (ch.length && !rf && !data.commentMouseEnter) {
        const ccb =
          e.scrollHeight - e.scrollTop - e.clientHeight < 500 ? true : false;
        for (let i = 0, j = ch.length; i < j; i++) {
          /** @type {HTMLDivElement|null} */
          const chi = ch[i].querySelector(selector.commentInner);
          if (chi) chi.dataset[`${sid.toLowerCase()}Hidden`] = 'false';
        }
        if (ccb) clickContinueButton();
      }
    }
  };

  const observerC = new MutationObserver(checkNewComments),
    observerE = new MutationObserver(changeElements),
    observerR = new ResizeObserver(resizeVideo),
    observerT = new MutationObserver(changePageTitle),
    observerV = new MutationObserver(changeVideoSource);
  clearInterval(interval.init);
  interval.init = setInterval(() => {
    if (document.querySelector(selector.main)) {
      clearInterval(interval.init);
      init();
    }
  }, 500);
})();
