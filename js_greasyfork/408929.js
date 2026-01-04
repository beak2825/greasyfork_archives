// ==UserScript==
// @name        YouTube Bolder Subtitles
// @name:ja     YouTube Bolder Subtitles
// @name:zh-CN  YouTube Bolder Subtitles
// @namespace   knoa.jp
// @description Make subtitles bolder for better visibility on YouTube.
// @description:ja YouTubeの字幕を太字にして見やすくします。
// @description:zh-CN 将YouTube上的字幕放成粗体字，让人更容易看清。
// @include     https://www.youtube.com/*
// @include     https://www.youtube-nocookie.com/embed/*
// @exclude     https://www.youtube.com/live_chat*
// @exclude     https://www.youtube.com/live_chat_replay*
// @version     1.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/408929/YouTube%20Bolder%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/408929/YouTube%20Bolder%20Subtitles.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YouTubeBolderSubtitles';
  const SCRIPTNAME = 'YouTube Bolder Subtitles';
  const DEBUG = false;/*
[update]
Also available on embedded videos on youtube-nocookie.com. Internal code preparation.

[bug]

[todo]
デフォルトのオプションをクリックできないようにしとくか
元々の太字には文字の大きさとかで対処する？
もうちょっと込み入った背景のスクショで見やすさを強調したい

[possible]
設定パネルでカスタマイズ？
  YouTubeの設定パネルに選択肢を差し込む？

[research]
normalizeが必要なのはABCやNBCなどのテレビ局が独自に挿入する字幕システムのせいっぽい？ (Bob the Canadian のライブに付く自動字幕は問題なかった)
  と思ったら、動画でもあったはず。URL失念。

[memo]
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const site = {
    targets: {
      title: () => $('title'),
    },
    get: {
      moviePlayer: () => $('#movie_player'),
      captionWindow: (player) => player.querySelector('.caption-window'),
    },
  };
  let elements = {}, flags = {}, timers = {}, sizes = {}, panels, configs;
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      //core.observeTitle();
      //core.observeCaption();
      core.addStyle('style');
    },
    observeTitle: function(){
      observe(elements.title, function(records){
        log('Title has changed:', elements.title.textContent);
      }, {childList: true, subtree: true, characterData: true});
    },
    observeCaption: function(){
      // 100msくらいにスロットルする？
      // 時刻が変わっても検知してしまうのでは・・・
      //   observeを二重構造にしてcaptionを発見するごとにcaptionを監視する？
      const player = site.get.moviePlayer();
      observe(player, function(records){
        const caption = site.get.captionWindow(player);
        if(caption) caption.normalize();
      }, {childList: true, subtree: true, characterData: true});
    },
    addStyle: function(name = 'style', d = document){
      if(html[name] === undefined) return;
      if(!d.head) return d.addEventListener('load', (e) => core.addStyle(name, d), {once: true});
      let style = createElement(html[name]()), id = SCRIPTID + '-' + name;
      style.id = id;
      Array.from(d.styleSheets).forEach(s => s.ownerNode.id === id && d.head.removeChild(s.ownerNode));
      d.head.appendChild(style);
    },
  };
  const html = {
    style: () => `
      <style type="text/css">
        .caption-window{
          background: transparent !important;
          overflow: visible !important;
        }
        .ytp-caption-segment{
          text-shadow:
            rgb(0,0,0) 0 0 .1em,
            rgb(0,0,0) 0 0 .2em,
            rgb(0,0,0) 0 0 .4em,
            rgb(0,0,0) 0 0 .8em,
            transparent 0 0 0
          !important;
          background: transparent !important;
          font-weight: bold !important;
        }
      </style>
    `,
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window), requestIdleCallback = window.requestIdleCallback.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  const $ = function(s, f = undefined){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s, f = undefined){
    let targets = document.querySelectorAll(s);
    return f ? f(targets) : targets;
  };
  const createElement = function(html = '<div></div>'){
    let outer = document.createElement('div');
    outer.insertAdjacentHTML('afterbegin', html);
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, subtree: false, characterData: false, attributes: false, attributeFilter: undefined}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const log = function(){
    if(typeof DEBUG === 'undefined') return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      SCRIPTID + ':',
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
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();