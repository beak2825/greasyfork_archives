// ==UserScript==
// @name        YouTube ProgressBar Preserver
// @name:ja     YouTube ProgressBar Preserver
// @name:zh-CN  YouTube ProgressBar Preserver
// @description It preserves YouTube's progress bar always visible even if the controls are hidden.
// @description:ja YouTubeのプログレスバー(再生時刻の割合を示す赤いバー)を、隠さず常に表示させるようにします。
// @description:zh-CN 让你恒常地显示油管上的进度条(显示播放时间比例的红色条)。
// @namespace   knoa.jp
// @include     https://www.youtube.com/*
// @include     https://www.youtube-nocookie.com/embed/*
// @exclude     https://www.youtube.com/live_chat*
// @exclude     https://www.youtube.com/live_chat_replay*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/394512/YouTube%20ProgressBar%20Preserver.user.js
// @updateURL https://update.greasyfork.org/scripts/394512/YouTube%20ProgressBar%20Preserver.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YouTubeProgressBarPreserver';
  const SCRIPTNAME = 'YouTube ProgressBar Preserver';
  const DEBUG = false;/*
[update]
No updates on code. Just confirmed to work.

[bug]

[todo]

[research]
timeupdateの間隔ぶんだけ遅れてしまうのはうまく改善できるかどうか
timeupdateきっかけで250ms(前回との差？)をキープするような仕組みでいける？
もっとも、時間の短い広告時くらいしか知覚できないけど。

[memo]
YouTubeによって隠されているときはオリジナルのバーは更新されないので、独自に作るほうがラク。
0.9完成後、youtube progressbar で検索したところすでに存在していることを発見＼(^o^)／
https://addons.mozilla.org/ja/firefox/addon/progress-bar-for-youtube/
カスタマイズできるが、生放送に対応していない。プログレスが最低0.5秒単位でtransitionもない。
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const INTERVAL = 1*SECOND;/*for core.checkUrl*/
  const SHORTDURATION = 4*MINUTE / 1000;/*short video should have transition*/
  const STARTSWITH = [/*for core.checkUrl*/
    'https://www.youtube.com/watch?',
    'https://www.youtube.com/embed/',
    'https://www.youtube-nocookie.com/embed/',
  ];
  let site = {
    targets: {
      player: () => $('.html5-video-player'),
      video: () => $('video[src]'),
      time: () => $('.ytp-time-display'),
    },
    is: {
      live: (time) => time.classList.contains('ytp-live'),
    },
  };
  let elements = {}, timers = {};
  let core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      core.checkUrl();
      core.addStyle();
    },
    checkUrl: function(){
      let previousUrl = '';
      timers.checkUrl = setInterval(function(){
        if(document.hidden) return;
        /* The page is visible, so... */
        if(location.href === previousUrl) return;
        else previousUrl = location.href;
        /* The URL has changed, so... */
        if(STARTSWITH.some(url => location.href.startsWith(url)) === false) return;
        /* This page should be modified, so... */
        core.ready();
      }, INTERVAL);
    },
    ready: function(){
      core.getTargets(site.targets).then(() => {
        log("I'm ready.");
        core.appendBar();
        core.observeTime();
        core.observeVideo();
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    appendBar: function(){
      if(elements.bar && elements.bar.isConnected) return;
      let bar = elements.bar = createElement(html.bar());
      let progress = elements.progress = bar.firstElementChild;
      let buffer = elements.buffer = bar.lastElementChild;
      elements.player.appendChild(bar);
    },
    observeTime: function(){
      /* detect live for hiding the bar */
      let time = elements.time, bar = elements.bar;
      let detect = function(time, bar){
        if(site.is.live(time)) bar.classList.remove('active');
        else bar.classList.add('active');
      };
      detect(time, bar);
      if(time.isObservingAttributes) return;
      time.isObservingAttributes = true;
      let observer = observe(time, function(records){
        detect(time, bar);
      }, {attributes: true});
    },
    observeVideo: function(){
      let video = elements.video, progress = elements.progress, buffer = elements.buffer;
      if(video.isObservingForProgressBar) return;
      video.isObservingForProgressBar = true;
      if(video.duration < SHORTDURATION) progress.classList.add('transition');
      progress.style.transform = 'scaleX(0)';
      video.addEventListener('durationchange', function(e){
        if(video.duration < SHORTDURATION) progress.classList.add('transition');
        else progress.classList.remove('transition');
      });
      video.addEventListener('timeupdate', function(e){
        progress.style.transform = `scaleX(${video.currentTime / video.duration})`;
      });
      let renderBuffer = function(e){
        for(let i = video.buffered.length - 1; 0 <= i; i--){
          if(video.currentTime < video.buffered.start(i)) continue;
          buffer.style.transform = `scaleX(${video.buffered.end(i) / video.duration})`;
          break;
        }
      };
      video.addEventListener('progress', renderBuffer);
      video.addEventListener('seeking', renderBuffer);
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
    bar: () => `<div id="${SCRIPTID}-bar"><div id="${SCRIPTID}-progress"></div><div id="${SCRIPTID}-buffer"></div></div>`,
    style: () => `
      <style type="text/css">
        /* preserved bar */
        #${SCRIPTID}-bar{
          --height: 3px;
          --background: rgba(255,255,255,.2);
          --filter: drop-shadow(0px 0px calc(var(--height)/2) rgba(0,0,0,.5));
          --color: #f00;
          --ad-color: #fc0;
          --buffer-color: rgba(255,255,255,.4);
          --transition-bar: opacity .25s cubic-bezier(0.0,0.0,0.2,1);
          --transition-progress: transform .25s linear;
          --z-index: 100;
        }
        #${SCRIPTID}-bar{
          width: 100%;
          height: var(--height);
          background: var(--background);
          position: absolute;
          bottom: 0;
          transition: var(--transition-bar);
          opacity: 0;
          z-index: var(--z-index);
        }
        #${SCRIPTID}-progress,
        #${SCRIPTID}-buffer{
          width: 100%;
          height: var(--height);
          transform-origin: 0 0;
          position: absolute;
        }
        #${SCRIPTID}-progress.transition,
        #${SCRIPTID}-buffer{
          transition: var(--transition-progress);
        }
        #${SCRIPTID}-progress{
          background: var(--color);
          filter: var(--filter);
          z-index: 1;
        }
        #${SCRIPTID}-buffer{
          background: var(--buffer-color);
        }
        .ad-interrupting/*advertisement*/ #${SCRIPTID}-progress{
          background: var(--ad-color);
        }
        /* replace the original bar */
        .ytp-autohide #${SCRIPTID}-bar.active{
          opacity: 1;
        }
        /* replace the bar for an ad */
        .ytp-ad-persistent-progress-bar-container/*YouTube offers progress bar only when an ad is showing, but it doesn't have transition animation*/{
          display: none
        }
      </style>
    `,
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s, f){
    let targets = document.querySelectorAll(s);
    return f ? Array.from(targets).map(t => f(t)) : targets;
  };
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