// ==UserScript==
// @name        YouTube Embedded Popupper
// @name:ja     YouTube Embedded Popupper
// @name:zh-CN  YouTube Embedded Popupper
// @description You can pop up embeded videos by right click. (It may require permission for pop up blocker at the first pop)
// @description:ja YouTubeの埋め込み動画を、右クリックからポップアップで開けるようにします。(初回のみポップアップブロックの許可が必要かもしれません)
// @description:zh-CN 将YouTube上的嵌入视频从右键弹出打开。(只有第一次，可能需要弹出块的许可)
// @namespace   knoa.jp
// @include     https://www.youtube.com/embed/*
// @include     https://www.youtube-nocookie.com/embed/*
// @version     3.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31506/YouTube%20Embedded%20Popupper.user.js
// @updateURL https://update.greasyfork.org/scripts/31506/YouTube%20Embedded%20Popupper.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YouTubeEmbeddedPopupper';
  const SCRIPTNAME = 'YouTube Embedded Popupper';
  const DEBUG = false;/*
[update] 3.1.2
Greasemonkey compatibility.

[bug]

[todo]
最後の位置とサイズを記憶してもいいのでは
  ディスプレイ変わってた場合にデフォルトにする処理を忘れずに
本気なら設定パネル
  右クリックで起動 or デフォルトの右クリックメニュー内から起動
  https://greasyfork.org/ja/forum/discussion/27383/x

[possible]

[research]
途中まで視聴経験のある動画はstart=0指定時に限り途中からの再生が優先されてしまう

[memo]
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const POPUPWIDTH = 960;/* width of popup window (height depends on the width) */
  const POPUPTOP = 'CENTER';/* position top of popup window (DEFAULT,TOP,CENTER,BOTTOM) */
  const POPUPLEFT = 'CENTER';/* position left of popup window (DEFAULT,LEFT,CENTER,RIGHT) */
  const INDICATORDURATION = 1000*MS;/* duration for indicator animation */
  const REWIND = .0;/* a bit of rewind time for popuping window (seconds) */
  const POPUPTITLE = 'Right Click to Popup';/* shown on mouse hover */
  const PARAMS = [/* overwrite YouTube parameters via https://developers.google.com/youtube/player_parameters */
    'autoplay=1',/* autoplay */
    'controls=1',/* show controls */
    'disablekb=0',/* enable keyboard control */
    'fs=1',/* enable fullscreen */
    'rel=0',/* not to show relative videos */
    'popped=1',/* (original) prevent grandchild popup */
  ];
  const RETRY = 10;
  let site = {
    originalTargets: {
      video: () => $('video'),
    },
    poppedTargets: {
      video: () => $('video'),
    },
    get: {
      originalVideo: () => window.opener ? window.opener.document.querySelector('video') : null,
    },
  };
  let html, elements = {}, timers = {}, sizes = {};
  let core = {
    initialize: function(){
      html = document.documentElement;
      html.classList.add(SCRIPTID);
      switch(true){
        case(location.href.includes('popped=1')):/* Prevent grandchild popup */
          core.readyForPopped();
          break;
        default:
          core.readyForOriginal();
          break;
      }
    },
    readyForOriginal: function(){
      core.getTargets(site.originalTargets, RETRY).then(() => {
        log("I'm ready for Original.");
        /* Title for Indicator */
        document.body.title = POPUPTITLE;
        /* get window size for pop indicator */
        sizes.innerWidth = document.body.clientWidth;
        sizes.innerHeight = document.body.clientHeight;
        sizes.diagonal = Math.hypot(sizes.innerWidth, sizes.innerHeight);
        /* Right Click to Popup */
        document.body.addEventListener('contextmenu', function(e){
          if(e.target.localName === 'a') return;
          let video = elements.video;
          elements.indicator.classList.add('popped');
          /* Get current time */
          let params = PARAMS.concat('start=' + parseInt(video.currentTime));
          /* Build URL */
          /* (Duplicated params are overwritten by former) */
          let l = location.href.split('?');
          let url = l[0] + '?' + params.join('&');
          if(l.length === 2) url += ('&' + l[1]);
          /* Open popup window */
          /* (Use URL for window name to prevent popupping the same videos) */
          window.open(url, location.href, core.setOptions());
          e.preventDefault();
          e.stopPropagation();
        }, {capture: true});
        core.createIndicator();
        core.addStyle();
      });
    },
    createIndicator: function(e){
      let indicator = elements.indicator = createElement(core.html.indicator());
      document.body.appendChild(indicator);
      indicator.addEventListener('transitionend', function(e){
        if(indicator.classList.contains('popped')) indicator.classList.remove('popped');
      });
    },
    setOptions: function(){
      let parameters = [], screen = window.screen, body = document.body, width = POPUPWIDTH, height = (width / body.offsetWidth) * body.offsetHeight;
      parameters.push('width=' + width);
      parameters.push('height=' + height);
      switch(POPUPTOP){
        case 'TOP':     parameters.push('top=' + 0); break;
        case 'CENTER':  parameters.push('top=' + (screen.availTop + (screen.availHeight / 2) - (height / 2))); break;
        case 'BOTTOM':  parameters.push('top=' + (screen.availTop + (screen.availHeight) - (height))); break;
        case 'DEFAULT': break;
        default:        break;
      }
      switch(POPUPLEFT){
        case 'LEFT':    parameters.push('left=' + 0); break;
        case 'CENTER':  parameters.push('left=' + (screen.availLeft + (screen.availWidth / 2) - (width / 2))); break;
        case 'RIGHT':   parameters.push('left=' + (screen.availLeft + (screen.availWidth) - (width))); break;
        case 'RIGHTCENTER': parameters.push('left=' + (screen.availLeft + (screen.availWidth * (3/4)) - (width / 2))); break;
        case 'DEFAULT': break;
        default:        break;
      }
      return parameters.join(',');
    },
    readyForPopped: function(){
      core.getTargets(site.poppedTargets, RETRY).then(() => {
        log("I'm ready for Popped.");
        /* pause and play seamlessly */
        let originalVideo = site.get.originalVideo(), poppedVideo = elements.video;
        if(originalVideo){
          poppedVideo.addEventListener('canplay', function(e){
            poppedVideo.currentTime = originalVideo.currentTime - REWIND;
            originalVideo.pause();
            poppedVideo.play();
          }, {once: true});
        }
        /* Enables shortcut keys on popupped window */
        poppedVideo.focus();
      });
    },
    getTargets: function(targets, retry = 0){
      const get = function(resolve, reject, retry){
        for(let i = 0, keys = Object.keys(targets), key; key = keys[i]; i++){
          let selected = targets[key]();
          if(selected){
            if(selected.length) selected.forEach((s) => s.dataset.selector = key);
            else selected.dataset.selector = key;
            elements[key] = selected;
          }else{
            if(--retry < 0) return reject(log(`Not found: ${key}, I give up.`));
            log(`Not found: ${key}, retrying... (left ${retry})`);
            return setTimeout(get, 1000, resolve, reject, retry);
          }
        }
        resolve();
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject, retry);
      });
    },
    addStyle: function(name = 'style'){
      if(core.html[name] === undefined) return;
      let style = createElement(core.html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      indicator: () => `
        <div id="${SCRIPTID}-indicator"></div>
      `,
      style: () => `
        <style type="text/css">
          #${SCRIPTID}-indicator{
            position: absolute;
            margin: auto;
            top: -100%;
            bottom: -100%;
            left: -100%;
            right: -100%;
            width: ${sizes.diagonal}px;
            height: ${sizes.diagonal}px;
            border-radius: ${sizes.diagonal}px;
            background: rgba(255,255,255,1.0);
            pointer-events: none;
            transform: scale(0);
            opacity: 1;
            transition: 0ms;
          }
          #${SCRIPTID}-indicator.popped{
            transform: scale(1);
            opacity: 0;
            transition: ${INDICATORDURATION}ms;
          }
        </style>
      `,
    },
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window), requestIdleCallback = window.requestIdleCallback.bind(window);
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
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
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
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 500,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Tampermonkey',
      detector: /MARKER@moz-extension:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 6,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?id=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 6,
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
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();