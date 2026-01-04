// ==UserScript==
// @name        YouTube Live Filled Up View
// @name:ja     YouTube Live Filled Up View
// @name:zh-CN  YouTube Live Filled Up View
// @description Get maximized video-and-chat view with no margins on YouTube Live or Premieres.
// @description:ja YouTube Live やプレミア公開のチャット付きビューで、余白を切り詰めて映像を最大化します。
// @description:zh-CN 在油管中的 YouTube Live 或首映公开的带聊天视图中，截取空白以最大化映像。
// @namespace   knoa.jp
// @include     https://www.youtube.com/*
// @version     1.2.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/394945/YouTube%20Live%20Filled%20Up%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/394945/YouTube%20Live%20Filled%20Up%20View.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YouTubeLiveFilledUpView';
  const SCRIPTNAME = 'YouTube Live Filled Up View';
  const DEBUG = false;/*
[update]
Now compatibile for Firefox + Greasemonkey. Minor fixes.

[bug]

[todo]
/live 待機ページで左サイドバーが常時表示化されてる？自然と直った？
右側に表示されるチャプター一覧にも対応してほしいらしいね

https://greasyfork.org/ja/scripts/394945-youtube-live-filled-up-view/discussions/64579
Maybe I'll modify the script as below:
- normal mode with chat for keeping current "Filled Up View"
- normal mode with chat closed for (meaningless) YouTube's default
- theater mode with chat for "Filled Up View" with no distracting elements.
- theater mode with chat closed for "Filled Up View" with neither distracting elements nor chats.

コメ欄の比率カスタマイズ (greasyforkでの要望)
  ついでにフォントサイズ、アイコンの有無、余白なども？
  上部ヘッダをマウスオーバーでのみとかなんとか、なんらかの対処はしたい
  チャットを非表示もXボタン化してヘッダ右上に

[possible]

[research]
ヘッダを隠す方法
  LIVEに限らずBigTubeの代替を目指すか
  上部マウスホバーで出現、スクロール上端からさらに上にスクロールでもx秒出現、下スクロールで出現、くらいかな
    動画上部とカチャッと上部のコントロール要素をクリックできない問題は回避しなければならない
  あくまでスクロー位置で調整することにして、多少の前後は自動スクロールでカバーするとか
    きほんシアターモードへの移行でスクロール位置調整
      むしろ本来的にヘッダを隠すのはシアターモードだけでいいよね
  スクロールイベントで3秒表示という手段
  https://greasyfork.org/ja/scripts/414234-youtube-auto-hide-header
infoの高さが変わりうるwindow.onresizeに対応か(パフォーマンスはスロットルすれば平気か)

[memo]
ダークモードはそれ用のユーザースタイルに任せるべき。
YouTubeのヘッダが常時表示なのはちょっと気にかかるが、高さにはまだ余裕がある。
  横幅1920時のinnerHeight: 910px, ChromeのUI: 約100px, Windowsタスクバー: 約40px
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const INTERVAL = 1*SECOND;/*for core.checkUrl*/
  const DEFAULTRATIO = 9/16;/*for waiting page*/
  const VIDEOURLS = [/*for core.checkUrl*/
    /^https:\/\/www\.youtube\.com\/watch\?/,
    /^https:\/\/www\.youtube\.com\/channel\/[^/]+\/live/,
  ];
  const CHATURLS = [/*for core.checkUrl*/
    /^https:\/\/www\.youtube\.com\/live_chat\?/,
    /^https:\/\/www\.youtube\.com\/live_chat_replay\?/,
  ];
  let site = {
    videoTargets: {
      watchFlexy: () => $('ytd-watch-flexy'),
      video: () => $('#movie_player video'),
      info: () => $('ytd-video-primary-info-renderer'),
      chat: () => $('ytd-live-chat-frame#chat'),
    },
    is: {
      video: () => VIDEOURLS.some(url => url.test(location.href)),
      chat: () => CHATURLS.some(url => url.test(location.href)),
      opened: (chat) => (chat.isConnected === true && chat.hasAttribute('collapsed') === false),
      theater: () => (elements.watchFlexy.theater === true),/* YouTube uses this property */
    },
    get: {
      sizeButton: () => $('button.ytp-size-button'),
      chatFrameToggleButton: () => $('ytd-live-chat-frame paper-button'),
    },
    chatTargets: {
      items: () => $('yt-live-chat-item-list-renderer #items'),
    },
  };
  let elements = {}, timers = {}, sizes = {};
  let core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      if(site.is.chat()){
        core.readyForChat();
      }else{
        core.checkUrl();
      }
    },
    checkUrl: function(){
      let previousUrl = '';
      timers.checkUrl = setInterval(function(){
        if(document.hidden) return;
        /* The page is visible, so... */
        if(location.href === previousUrl) return;
        else previousUrl = location.href;
        /* The URL has changed, so... */
        core.clearVideoStyle();
        if(site.is.video()) return core.readyForVideo();
      }, INTERVAL);
    },
    clearVideoStyle: function(){
      if(elements.videoStyle && elements.videoStyle.isConnected){
        document.head.removeChild(elements.videoStyle);
      }
    },
    addVideoStyle: function(e){
      let chat = elements.chat;
      if(site.is.opened(chat) === false) return;
      /* it also replaces old style */
      let video = elements.video;
      /* adapt to the aspect ratio  */
      if(video.videoWidth){
        sizes.videoAspectRatio = video.videoHeight / video.videoWidth;
        core.addStyle('videoStyle');
      }else{
        sizes.videoAspectRatio = DEFAULTRATIO;
        core.addStyle('videoStyle');
        video.addEventListener('canplay', core.addVideoStyle, {once: true});
      }
      /* for Ads replacing */
      if(video.dataset.observed === 'true') return;
      video.dataset.observed = 'true';
      observe(video, function(records){
        video.addEventListener('canplay', core.addVideoStyle, {once: true});
      }, {attributes: true, attributeFilter: ['src']});
    },
    readyForVideo: function(){
      core.getTargets(site.videoTargets).then(() => {
        log("I'm ready for Video with Chat.");

        sizes.scrollbarWidth = getScrollbarWidth();
        core.getInfoHeight();
        core.replacePlayerSize();
        core.observeChatFrame();
        core.enterDefaultMode();
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    getInfoHeight: function(){
      let info = elements.info;
      if(info.offsetHeight === 0) return setTimeout(core.getInfoHeight, 1000);
      sizes.infoHeight = elements.info.offsetHeight;
    },
    replacePlayerSize: function(){
      /* update the size */
      setTimeout(() => window.dispatchEvent(new Event('resize')), 1000);
      let watchFlexy = elements.watchFlexy;
      if(watchFlexy.calculateNormalPlayerSize_original) return;
      /* Thanks for Iridium.user.js > initializeBypasses */
      watchFlexy.calculateNormalPlayerSize_original = watchFlexy.calculateNormalPlayerSize_;
      watchFlexy.calculateCurrentPlayerSize_original = watchFlexy.calculateCurrentPlayerSize_;
      watchFlexy.calculateNormalPlayerSize_ = watchFlexy.calculateCurrentPlayerSize_ = function(){
        let video = elements.video, chat = elements.chat;
        if(site.is.opened(chat) === false){/* chat is closed */
          return watchFlexy.calculateCurrentPlayerSize_original();
        }else{
          if(watchFlexy.theater) return {width: NaN, height: NaN};
          else return {width: video.offsetWidth, height: video.offsetHeight};
        }
      };
    },
    observeChatFrame: function(){
      let chat = elements.chat, isOpened = site.is.opened(chat), button = site.get.chatFrameToggleButton();
      if(!isOpened && button){
        button.click();
        isOpened = !isOpened;
      }
      core.addVideoStyle();
      observe(chat, function(records){
        if(site.is.opened(chat) === isOpened) return;
        isOpened = !isOpened;
        window.dispatchEvent(new Event('resize'));/*for updating controls tooltip positions*/
        if(isOpened) return core.addVideoStyle();
        else return core.clearVideoStyle();
      }, {attributes: true});
    },
    enterDefaultMode: function(){
      if(site.is.theater() === false) return;/* already in default mode */
      let sizeButton = site.get.sizeButton();
      if(sizeButton) sizeButton.click();
    },
    readyForChat: function(){
      core.getTargets(site.chatTargets).then(() => {
        log("I'm ready for Chat.");
        core.addStyle('chatStyle');
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    getTarget: function(selector, retry = 10, interval = 1*SECOND){
      const key = selector.name;
      const get = function(resolve, reject){
        let selected = selector();
        if(selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);/* elements */
        else if(selected instanceof HTMLElement) selected.dataset.selector = key;/* element */
        else if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, interval, resolve, reject);
        else return reject(new Error(`Not found: ${selector.name}, I give up.`));
        elements[key] = selected;
        resolve(selected);
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject);
      });
    },
    getTargets: function(selectors, retry = 10, interval = 1*SECOND){
      return Promise.all(Object.values(selectors).map(selector => core.getTarget(selector, retry, interval)));
    },
    addStyle: function(name = 'style'){
      if(html[name] === undefined) return;
      let style = createElement(html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
  };
  const html = {
    videoStyle: () => `
      <style type="text/css" id="${SCRIPTID}-videoStyle">
        /* common */
        ytd-watch-flexy{
          --${SCRIPTID}-header-height: var(--ytd-watch-flexy-masthead-height);
          --${SCRIPTID}-info-height: ${sizes.infoHeight}px;
          --ytd-watch-flexy-width-ratio: 1 !important;/*fix for Iridium bug*/
          --ytd-watch-width-ratio: 1 !important;/*fix for Iridium bug*/
          --ytd-watch-flexy-height-ratio: ${sizes.videoAspectRatio} !important;/*fix for Iridium bug*/
          --ytd-watch-height-ratio: ${sizes.videoAspectRatio} !important;/*fix for Iridium bug*/
        }
        ytd-watch-flexy[is-two-columns_]{
          --${SCRIPTID}-primary-width: calc(100vw - ${sizes.scrollbarWidth}px - var(--ytd-watch-flexy-sidebar-width));
          --${SCRIPTID}-secondary-width: var(--ytd-watch-flexy-sidebar-width);
          --${SCRIPTID}-video-height: calc(var(--${SCRIPTID}-primary-width) * ${sizes.videoAspectRatio});
        }
        ytd-watch-flexy:not([is-two-columns_]){
          --${SCRIPTID}-primary-width: 100vw;
          --${SCRIPTID}-secondary-width: 100vw;
          --${SCRIPTID}-video-height: calc(100vw * ${sizes.videoAspectRatio});
        }
        /* columns */
        #columns{
          max-width: 100% !important;
        }
        #primary{
          max-width: var(--${SCRIPTID}-primary-width) !important;
          min-width: var(--${SCRIPTID}-primary-width) !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        #secondary{
          max-width: var(--${SCRIPTID}-secondary-width) !important;
          min-width: var(--${SCRIPTID}-secondary-width) !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        #player-container-outer,
        yt-live-chat-app{
          max-width: 100% !important;
          min-width: 100% !important;
        }
        #primary-inner > *:not(#player){
          padding: 0 24px 0;
        }
        /* video */
        #player,
        #player *{
          max-height: calc(100vh - var(--${SCRIPTID}-header-height)) !important;
        }
        #movie_player .html5-video-container{
          height: 100% !important;
        }
        #movie_player .ytp-chrome-bottom/*controls*/{
          width: calc(100% - 24px) !important;/*fragile!!*/
          max-width: calc(100% - 24px) !important;/*fragile!!*/
        }
        #movie_player video{
          max-width: 100% !important;
          width: 100% !important;
          height: 100% !important;
          left: 0px !important;
          background: black;
        }
        .ended-mode video{
          display: none !important;/*avoid conflicting with Iridium*/
        }
        /* chatframe */
        ytd-watch-flexy[is-two-columns_] ytd-live-chat-frame#chat{
          height: calc(var(--${SCRIPTID}-video-height) + var(--${SCRIPTID}-info-height)) !important;
          min-height: auto !important;
          max-height: calc(100vh - var(--${SCRIPTID}-header-height)) !important;
          border-right: none;
        }
        ytd-watch-flexy:not([is-two-columns_]) ytd-live-chat-frame#chat{
          padding: 0 !important;
          margin: 0 !important;
          height: calc(100vh - var(--${SCRIPTID}-header-height) - var(--${SCRIPTID}-video-height)) !important;
          min-height: auto !important;
          border-top: none;
        }
      </style>
    `,
    chatStyle: () => `
      <style type="text/css" id="${SCRIPTID}-chatStyle">
        /* common */
        :root{
          --${SCRIPTID}-slight-shadow: drop-shadow(0 0 1px rgba(0,0,0,.1));
        }
        /* header and footer */
        yt-live-chat-header-renderer/*header*/{
          filter: var(--${SCRIPTID}-slight-shadow);
          z-index: 100;
        }
        #contents > #ticker/*superchat*/{
          filter: var(--${SCRIPTID}-slight-shadow);
        }
        #contents > #ticker/*superchat*/ > yt-live-chat-ticker-renderer > #container > *{
          padding-top: 4px;
          padding-bottom: 4px;
        }
        iron-pages#panel-pages/*footer*/{
          border-top: 1px solid rgba(128,128,128,.125);
        }
        /* body */
        #docked-item.yt-live-chat-docked-message-renderer/*sticky on the top*/,
        #undocking-item.yt-live-chat-docked-message-renderer/*sticky on the top*/{
          margin: 8px 0;
        }
        #docked-item.yt-live-chat-docked-message-renderer/*sticky on the top*/ > *,
        #undocking-item.yt-live-chat-docked-message-renderer/*sticky on the top*/ > *{
          filter: var(--${SCRIPTID}-slight-shadow);
        }
        #docked-item.yt-live-chat-docked-message-renderer/*sticky on the top*/ > *,
        #undocking-item.yt-live-chat-docked-message-renderer/*sticky on the top*/ > *,
        #items.yt-live-chat-item-list-renderer/*normal chats*/ > *:not(yt-live-chat-placeholder-item-renderer){
          padding: 2px 10px !important;
        }
      </style>
    `,
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  class Storage{
    static key(key){
      return (SCRIPTID) ? (SCRIPTID + '-' + key) : key;
    }
    static save(key, value, expire = null){
      key = Storage.key(key);
      localStorage[key] = JSON.stringify({
        value: value,
        saved: Date.now(),
        expire: expire,
      });
    }
    static read(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.value === undefined) return data;
      if(data.expire === undefined) return data;
      if(data.expire === null) return data.value;
      if(data.expire < Date.now()) return localStorage.removeItem(key);
      return data.value;
    }
    static delete(key){
      key = Storage.key(key);
      delete localStorage.removeItem(key);
    }
    static saved(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.saved) return data.saved;
      else return undefined;
    }
  }
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s){return document.querySelectorAll(s)};
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false, subtree: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const getScrollbarWidth = function(){
    let div = document.createElement('div');
    div.textContent = 'dummy';
    document.body.appendChild(div);
    div.style.overflowY = 'scroll';
    let clientWidth = div.clientWidth;
    div.style.overflowY = 'hidden';
    let offsetWidth = div.offsetWidth;
    document.body.removeChild(div);
    return offsetWidth - clientWidth;
  };
  const log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      (SCRIPTID || '') + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...arguments
    );
  };
  log.formats = [{
      name: 'Firefox Scratchpad',
      detector: /MARKER@Scratchpad/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Console',
      detector: /MARKER@debugger/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 3',
      detector: /\/gm_scripts\//,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 4+',
      detector: /MARKER@user-script:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 0,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Tampermonkey',
      detector: /MARKER@moz-extension:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 2,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?name=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 1,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Chrome Extension',
      detector: /at MARKER \(chrome-extension:/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Edge Console',
      detector: /at MARKER \(eval/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(eval)/gm),
    }, {
      name: 'Edge Tampermonkey',
      detector: /at MARKER \(Function/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 4,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(Function)/gm),
    }, {
      name: 'Safari',
      detector: /^MARKER$/m,
      getLine: (e) => 0,/*e.lineが用意されているが最終呼び出し位置のみ*/
      getCallers: (e) => e.stack.split('\n'),
    }, {
      name: 'Default',
      detector: /./,
      getLine: (e) => 0,
      getCallers: (e) => [],
    }];
  log.format = log.formats.find(function MARKER(f){
    if(!f.detector.test(new Error().stack)) return false;
    //console.log('////', f.name, 'wants', 0/*line*/, '\n' + new Error().stack);
    return true;
  });
  const time = function(label){
    if(!DEBUG) return;
    const BAR = '|', TOTAL = 100;
    switch(true){
      case(label === undefined):/* time() to output total */
        let total = 0;
        Object.keys(time.records).forEach((label) => total += time.records[label].total);
        Object.keys(time.records).forEach((label) => {
          console.log(
            BAR.repeat((time.records[label].total / total) * TOTAL),
            label + ':',
            (time.records[label].total).toFixed(3) + 'ms',
            '(' + time.records[label].count + ')',
          );
        });
        time.records = {};
        break;
      case(!time.records[label]):/* time('label') to create and start the record */
        time.records[label] = {count: 0, from: performance.now(), total: 0};
        break;
      case(time.records[label].from === null):/* time('label') to re-start the lap */
        time.records[label].from = performance.now();
        break;
      case(0 < time.records[label].from):/* time('label') to add lap time to the record */
        time.records[label].total += performance.now() - time.records[label].from;
        time.records[label].from = null;
        time.records[label].count += 1;
        break;
    }
  };
  time.records = {};
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();