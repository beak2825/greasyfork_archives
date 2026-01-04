// ==UserScript==
// @name         Bilibili剧场版播放
// @namespace    https://greasyfork.org/zh-CN/users/1129769-pxoxq
// @version      0.2.1
// @description  B站播放器剧场模式
// @author       pxoxq
// @license      AGPL-3.0-or-later
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/video/**
// @match        https://www.bilibili.com/list/**
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        window.onurlchange
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/482441/Bilibili%E5%89%A7%E5%9C%BA%E7%89%88%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/482441/Bilibili%E5%89%A7%E5%9C%BA%E7%89%88%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

//========elmGetter===================
var elmGetter = function() {
  const win = window.unsafeWindow || document.defaultView || window;
  const doc = win.document;
  const listeners = new WeakMap();
  let mode = 'css';
  let $;
  const elProto = win.Element.prototype;
  const matches = elProto.matches ||
      elProto.matchesSelector ||
      elProto.webkitMatchesSelector || 
      elProto.mozMatchesSelector ||
      elProto.oMatchesSelector;
  const MutationObs = win.MutationObserver ||
      win.WebkitMutationObserver ||
      win.MozMutationObserver;
  function addObserver(target, callback) {
      const observer = new MutationObs(mutations => {
          for (const mutation of mutations) {
              if (mutation.type === 'attributes') {
                  callback(mutation.target);
                  if (observer.canceled) return;
              }
              for (const node of mutation.addedNodes) {
                  if (node instanceof Element) callback(node);
                  if (observer.canceled) return;
              }
          }
      });
      observer.canceled = false;
      observer.observe(target, {childList: true, subtree: true, attributes: true});
      return () => {
          observer.canceled = true;
          observer.disconnect();
      };
  }
  function addFilter(target, filter) {
      let listener = listeners.get(target);
      if (!listener) {
          listener = {
              filters: new Set(),
              remove: addObserver(target, el => listener.filters.forEach(f => f(el)))
          };
          listeners.set(target, listener);
      }
      listener.filters.add(filter);
  }
  function removeFilter(target, filter) {
      const listener = listeners.get(target);
      if (!listener) return;
      listener.filters.delete(filter);
      if (!listener.filters.size) {
          listener.remove();
          listeners.delete(target);
      }
  }
  function query(all, selector, parent, includeParent, curMode) {
      switch (curMode) {
          case 'css':
              const checkParent = includeParent && matches.call(parent, selector);
              if (all) {
                  const queryAll = parent.querySelectorAll(selector);
                  return checkParent ? [parent, ...queryAll] : [...queryAll];
              }
              return checkParent ? parent : parent.querySelector(selector);
          case 'jquery':
              let jNodes = $(includeParent ? parent : []);
              jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
              if (all) return $.map(jNodes, el => $(el));
              return jNodes.length ? $(jNodes.get(0)) : null;
          case 'xpath':
              const ownerDoc = parent.ownerDocument || parent;
              selector += '/self::*';
              if (all) {
                  const xPathResult = ownerDoc.evaluate(selector, parent, null, 7, null);
                  const result = [];
                  for (let i = 0; i < xPathResult.snapshotLength; i++) {
                      result.push(xPathResult.snapshotItem(i));
                  }
                  return result;
              }
              return ownerDoc.evaluate(selector, parent, null, 9, null).singleNodeValue;
      }
  }
  function isJquery(jq) {
      return jq && jq.fn && typeof jq.fn.jquery === 'string';
  }
  function getOne(selector, parent, timeout) {
      const curMode = mode;
      return new Promise(resolve => {
          const node = query(false, selector, parent, false, curMode);
          if (node) return resolve(node);
          let timer;
          const filter = el => {
              const node = query(false, selector, el, true, curMode);
              if (node) {
                  removeFilter(parent, filter);
                  timer && clearTimeout(timer);
                  resolve(node);
              }
          };
          addFilter(parent, filter);
          if (timeout > 0) {
              timer = setTimeout(() => {
                  removeFilter(parent, filter);
                  resolve(null);
              }, timeout);
          }
      });
  }
  return {
      get currentSelector() {
          return mode;
      },
      get(selector, ...args) {
          let parent = typeof args[0] !== 'number' && args.shift() || doc;
          if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
          const timeout = args[0] || 0;
          if (Array.isArray(selector)) {
              return Promise.all(selector.map(s => getOne(s, parent, timeout)));
          }
          return getOne(selector, parent, timeout);
      },
      each(selector, ...args) {
          let parent = typeof args[0] !== 'function' && args.shift() || doc;
          if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
          const callback = args[0];
          const curMode = mode;
          const refs = new WeakSet();
          for (const node of query(true, selector, parent, false, curMode)) {
              refs.add(curMode === 'jquery' ? node.get(0) : node);
              if (callback(node, false) === false) return;
          }
          const filter = el => {
              for (const node of query(true, selector, el, true, curMode)) {
                  const _el = curMode === 'jquery' ? node.get(0) : node;
                  if (refs.has(_el)) break;
                  refs.add(_el);
                  if (callback(node, true) === false) {
                      return removeFilter(parent, filter);
                  }
              }
          };
          addFilter(parent, filter);
      },
      create(domString, ...args) {
          const returnList = typeof args[0] === 'boolean' && args.shift();
          const parent = args[0];
          const template = doc.createElement('template');
          template.innerHTML = domString;
          const node = template.content.firstElementChild;
          if (!node) return null;
          parent ? parent.appendChild(node) : node.remove();
          if (returnList) {
              const list = {};
              node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
              list[0] = node;
              return list;
          }
          return node;
      },
      selector(desc) {
          switch (true) {
              case isJquery(desc):
                  $ = desc;
                  return mode = 'jquery';
              case !desc || typeof desc.toLowerCase !== 'function':
                  return mode = 'css';
              case desc.toLowerCase() === 'jquery':
                  for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                      if (isJquery(jq)) {
                          $ = jq;
                          break;
                      };
                  }
                  return mode = $ ? 'jquery' : 'css';
              case desc.toLowerCase() === 'xpath':
                  return mode = 'xpath';
              default:
                  return mode = 'css';
          }
      }
  };
}();
//===========elmGetter================

const BWidePlayerGolbalConf = {
  darkMode: false,
  wideModeDefault: true, // 默认宽屏
  shadowColers: {
    dark: ['#d3d4d5', '#818283'],
    white: ['#E3E5E7', '#F1F2F3']
  },
  indexBgDarkColor: '#22222B',
  indexBgColor: 'white',
  globalDarkClr: '#22222B',
  wideModePlayerHeight: 700,

  styles: {
    globalPrettify: ``,
    widePlayerStyles: ``,
  }
}

function bWidePlayerFlushStyle() {
  BWidePlayerGolbalConf.styles.widePlayerStyles = `
  .bpx-player-ctrl-wide{
    width:0px;
  }
  #wide-box::-webkit-scrollbar{
    display:none;
  }
  #wide-box, html{
  scrollbar-width:none;
  }
  #wide-box .mini-header__logo path{
    fill: #fb7299;
  }
  #wide-box #bilibili-player{
    width: 100vw !important;
  }
  #wide-box #playerWrap{
    order: -1;
    height: ${BWidePlayerGolbalConf.wideModePlayerHeight}px;
  }
  #wide-box #bilibili-player{
    height:${BWidePlayerGolbalConf.wideModePlayerHeight}px;
    position:relative;
  }
  /*右侧悬浮列表*/
  #wide-box #bilibili-player #reco_list,
  #wide-box #bilibili-player #multi_page,
  #wide-box #bilibili-player .base-video-sections-v1,
  #wide-box #bilibili-player .action-list-container{
    position:absolute;
    top:25px;
    right:0px;
    background-color: #f1f2f3d6;
    overflow: hidden;
    transition: all .28s linear;
    border: 1px solid #1F1F1F;
    width: 14px;
    height: 400px;
    opacity: 0.26;
    z-index: 999;
  }
  
  #wide-box #bilibili-player .base-video-sections-v1:hover{
    width: 280px;
    height: auto;
    opacity: 1;
  }
  #wide-box #bilibili-player .base-video-sections-v1:hover .video-sections-content-list{
    max-height:  unset;
    height:  ${BWidePlayerGolbalConf.wideModePlayerHeight - 200}px !important;
  }
  
  #wide-box #bilibili-player #reco_list{
    border-radius: 8px;
    top: 20px;
    width: 10px;
    overflow-y: scroll;
  }
  #wide-box #bilibili-player #reco_list::-webkit-scrollbar{
    width: 0px;
  }
  #wide-box #bilibili-player #reco_list{
    scrollbar-width:0px;
  }
  #wide-box #bilibili-player #reco_list .pic-box{
    width: 90px;
    height: 65px;
  }
  #wide-box #bilibili-player #reco_list .pic-box .video-awesome-img{
    width:100%;
    height:100%;
  }
  #wide-box #bilibili-player #reco_list .info .title{
    -webkit-line-clamp: 1;
  }
  #wide-box #bilibili-player #reco_list:hover{
    height: ${BWidePlayerGolbalConf.wideModePlayerHeight - 140}px;
    width: 280px;
    opacity:1;
    padding: 8px;
  }
  
  #wide-box #bilibili-player .action-list-container .main .cover{
    width: 70px;
  }
  #wide-box #bilibili-player .action-list-container:hover{
    width: 270px;
    height: auto;
    opacity: 1;
  }
  #wide-box #bilibili-player .action-list-container:hover #playlist-video-action-list,
  #wide-box #bilibili-player #playlist-video-action-list-body{
    max-height: ${BWidePlayerGolbalConf.wideModePlayerHeight - 160}px;
  }
  #wide-box #bilibili-player #multi_page:hover{
    width: auto;
    height:auto;
    opacity: 1;
  }
  #wide-box #bilibili-player #multi_page .cur-list{
    max-height: ${BWidePlayerGolbalConf.wideModePlayerHeight - 160}px;
  }
  #wide-box #bilibili-player #multi_page .list-box li{
    width:260px;
  }
  
  /*左侧栏视频信息左-包含播放器*/
  #wide-box .left-container.scroll-sticky,
  #wide-box div.playlist-container--left{
    display: flex;
    flex-direction: column;
  }
  /*收藏页去padding*/
  #wide-box div.playlist-container{
    padding: unset;
  }
  #wide-box div#mirror-vdcon{
    justify-content: left;
  }
  /*右侧栏*/
  #wide-box div.right-container.is-in-large-ab,
  #wide-box div.playlist-container--right{
    margin-top: ${BWidePlayerGolbalConf.wideModePlayerHeight}px;
  }
  #wide-box #danmukuBox{margin-top: 0;}
  #wide-box div.video-container-v1{
    padding: 0;
    justify-content: left;
  }
  /*左栏除视频编辑器*/ 
  #wide-box .left-container.scroll-sticky>div:not(#playerWrap),
  #wide-box div.playlist-container--left>div:not(#playerWrap){
   margin-left:100px;
  }
  #wide-box #biliMainHeader .bili-header__bar{
    background-color: #000;
  }
  #wide-box #app .bpx-player-sending-bar{
    background-color:black;
  }
  #wide-box #biliMainHeader .bili-header__bar a.default-entry{
    color:white;
  }
  #wide-box #biliMainHeader .bili-header__bar li svg{color: white}
  #wide-box .mini-header .right-entry .right-entry__outside .right-entry-text{color:white}
  #wide-box .mini-header__title span{color:white !important;}
  #wide-box .bpx-player-video-inputbar-wrap{background-color:#353232;}
  `
}

class BilibiliPrettifyInject {

  static flushStyle() {
    bWidePlayerFlushStyle()
    this.injectStyle(BWidePlayerGolbalConf.styles.indexSimplifyStyle)
    this.injectStyle(BWidePlayerGolbalConf.styles.widePlayerStyles)
  }

  static injectStyle(styleStr) {
    GM_addStyle(styleStr)
  }
}

class BilibiliPlayMode {
  // 记录Ctrl是否已经被点击一次
  static ctrlReady = false
  static init() {
    bWidePlayerFlushStyle()
    // 注入样式
    BilibiliPrettifyInject.injectStyle(BWidePlayerGolbalConf.styles.widePlayerStyles)

    // 按钮移位

    // 事件绑定
    this.__eventBind()
  }

  static __injectMenu() {

  }

  static __eventBind() {
    // 全局按键事件绑定
    document.onkeyup = (event) => {
      // 1. 双击Ctrl
      if (event.key == "Control") {
        if (!this.ctrlReady) {
          this.ctrlReady = true
          setTimeout(() => {
            this.ctrlReady = false
          }, 300)
        }
        else {
          this.ctrlReady = false
          // do something
          this.toggleWideMode()
        }
      }

    };

  }

  static toggleWideMode() {
    elmGetter.get('.pic-box picture', document, 2.5 * 60e3).then(res => {
      console.log('xxxou: ', res)
      const mainBox = 'body'
      const boxId = $(mainBox).attr('id')
      let newId = ''
      if (!boxId) {
        newId = 'wide-box'
        this.videoFloatList()
      }
      else {
        this.videoFloatList(false)
      }
      $(mainBox).attr('id', newId)
    })
  }

  static videoFloatList(float = true) {
    const wrapperSelector = '#bilibili-player'
    if (float) {
      const wrapper = $(wrapperSelector)
      const favList = $('.action-list-container')
      if (favList && favList.length) {
        $(wrapper[0]).append(favList)
      }
      else {
        const multiList = $('#multi_page')
        // console.log('multi-page: ', multiList)
        if (multiList && multiList.length) {
          $(wrapper[0]).append(multiList)
        }
        else {
          const hejiList = $('.base-video-sections-v1')
          if (hejiList && hejiList.length) {
            $(wrapper[0]).append(hejiList)
          }
          else {
            const normalList = $('#reco_list')
            // console.log('reco list: ', normalList )
            if (normalList && normalList.length) {
              $(wrapper[0]).append(normalList)
            }
          }
        }
      }
    }
    else {
      const favList = $(`${wrapperSelector} .action-list-container`)
      if (favList && favList.length) {
        $('#danmukuBox').after($(favList))

      }
      else {
        const multiList = $(`${wrapperSelector} #multi_page`)
        if (multiList && multiList.length) {
          $('#danmukuBox').after($(multiList))
        }
        else {
          const hejiList = $(`${wrapperSelector} .base-video-sections-v1`)
          if (hejiList && hejiList.length) {
            $('#danmukuBox').after(hejiList)
          }
          else {
            const normalList = $(`${wrapperSelector} #reco_list`)
            if (normalList && normalList.length) {
              $('#danmukuBox').after($(normalList))
            }
          }
        }
      }
    }
  }
}

let firstCtrl = true

function __bWidePlayerInit() {
  bWidePlayerFlushStyle()
  BilibiliPlayMode.init()
  if (BWidePlayerGolbalConf.wideModeDefault) {
    BilibiliPlayMode.toggleWideMode()
  }

}

(function () {
  'use strict';
  __bWidePlayerInit()

})();
