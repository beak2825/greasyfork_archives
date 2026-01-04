// ==UserScript==
// @name        YouTube Live CPU Tamer
// @name:ja     YouTube Live CPU Tamer
// @name:zh-CN  YouTube Live CPU Tamer
// @description It reduces the high CPU usage on Super Chats with nothing to lose.
// @description:ja スーパーチャットによる高いCPU使用率を削減します。見た目は何も変わりません。
// @description:zh-CN 降低超级聊天的高CPU利用率。外观完全没有变化。
// @namespace   knoa.jp
// @include     https://www.youtube.com/live_chat*
// @include     https://www.youtube.com/live_chat_replay*
// @version     2.0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/396532/YouTube%20Live%20CPU%20Tamer.user.js
// @updateURL https://update.greasyfork.org/scripts/396532/YouTube%20Live%20CPU%20Tamer.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YouTubeLiveCpuTamer';
  const SCRIPTNAME = 'YouTube Live CPU Tamer';
  const DEBUG = false;/*
[update] 2.0.6
No updates on code. Just confirmed to work.

[bug]

[todo]

[possible]

[research]
Proxyを使うとbackgroundトリック不要？CPU使用に対する効果はある？
放送開始前の待機画面でもHelper(GPU)が食ってる件
リアルタイム視聴時のほうがHelper(GPU)が消費する件は新着確認js処理のせいか

[memo]
none:80+30=110 => tame:50+20=70 => remove:30+15=45
  */
  if(console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const THROTTLE = 1000*MS;
  const site = {
    targets: {
      itemsNode: () => $('yt-live-chat-ticker-renderer #items'),
    },
    get: {
      tickerItemInsideContainers: (items) => items.querySelectorAll('.yt-live-chat-ticker-renderer[role="button"] #container'),/* existing items */
      tickerItemInsideContainer: (node) => node.querySelector('.yt-live-chat-ticker-renderer[role="button"] #container'),/* for observer */
    },
  };
  let elements = {};
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      text.setup(texts, top.document.documentElement.lang);
      core.ready();
      core.addStyle('style');
    },
    ready: function(){
      core.getTargets(site.targets).then(() => {
        log("I'm ready.");
        core.observeTickerItems();
        core.prepareRemoveTickersButton();
      });
    },
    observeTickerItems: function(){
      let containers = site.get.tickerItemInsideContainers(elements.itemsNode);
      Array.from(containers).forEach(container => {
        core.observeTickerItemInsideContainer(container);
      });
      observe(elements.itemsNode, function(records){
        records.forEach(r => r.addedNodes.forEach(node => {
          let container = site.get.tickerItemInsideContainer(node);
          if(container) core.observeTickerItemInsideContainer(container);
        }));
      });
    },
    observeTickerItemInsideContainer: function(container){
      container.parentNode.style.background = container.style.background;
      let lastUpdated = Date.now();
      observe(container, function(records){
        let now = Date.now();
        if(now - lastUpdated < THROTTLE) return;
        lastUpdated = now;
        container.parentNode.style.background = container.style.background;
      }, {attributes: true, attributeFilter: ['style']});
    },
    prepareRemoveTickersButton: function(){
      let button = createElement(html.removeTickersButton());
      button.addEventListener('click', function(e){
        elements.itemsNode.parentNode.removeChild(elements.itemsNode);
      });
      elements.itemsNode.parentNode.appendChild(button);
    },
    getTarget: function(selector, retry = 10){
      const key = selector.name;
      const get = function(resolve, reject, retry){
        let selected = selector();
        if(selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);/* elements */
        else if(selected instanceof HTMLElement) selected.dataset.selector = key;/* element */
        else if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, 1000, resolve, reject, retry);
        else return reject(selector);
        elements[key] = selected;
        resolve(selected);
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject, retry);
      }).catch(selector => {
        log(`Not found: ${key}, I give up.`);
      });
    },
    getTargets: function(selectors, retry = 10){
      return Promise.all(Object.values(selectors).map(selector => core.getTarget(selector, retry)));
    },
    addStyle: function(name = 'style'){
      if(html[name] === undefined) return;
      let style = createElement(html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
  };
  const texts = {
    'remove tickers by ${SCRIPTNAME}': {
      en: () => `remove tickers by ${SCRIPTNAME}`,
      ja: () => `履歴欄を削除 by ${SCRIPTNAME}`,
      zh: () => `删除历史记录栏 by ${SCRIPTNAME}`,
    },
  };
  const html = {
    removeTickersButton: () => `<button id="${SCRIPTID}-removeTickers" title="${text('remove tickers by ${SCRIPTNAME}')}">╳</button>`,
    style: () => `
      <style type="text/css">
        yt-live-chat-ticker-renderer #items > *{
          border-radius: 999px;
        }
        yt-live-chat-ticker-renderer #items > * > #container{
          background: none !important;
        }
        yt-live-chat-ticker-renderer #${SCRIPTID}-removeTickers{
          cursor: pointer;
          position: absolute;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
          border-radius: 100vmax;
          border: none;
          background: white;
          filter: drop-shadow(0px 0px 1px rgba(0,0,0,.25));
          height: 20px;
          width: 20px;
          padding: 0 !important;
          opacity: 0;
          transition: opacity 250ms;
          pointer-events: none;
        }
        yt-live-chat-ticker-renderer:hover #left-arrow-container[hidden] ~ #${SCRIPTID}-removeTickers{
          opacity: 1;
          pointer-events: auto;
        }
        yt-live-chat-ticker-renderer #items > *{
          transition: transform 250ms;
        }
        yt-live-chat-ticker-renderer:hover #items > *{
          transform: translateX(5px);
        }
      </style>
    `,
  };
  const text = function(key, ...args){
    if(text.texts[key] === undefined){
      log('Not found text key:', key);
      return key;
    }else return text.texts[key](args);
  };
  text.setup = function(texts, language){
    let languages = [...window.navigator.languages];
    if(language) languages.unshift(...String(language).split('-').map((p,i,a) => a.slice(0,1+i).join('-')).reverse());
    if(!languages.includes('en')) languages.push('en');
    languages = languages.map(l => l.toLowerCase());
    Object.keys(texts).forEach(key => {
      Object.keys(texts[key]).forEach(l => texts[key][l.toLowerCase()] = texts[key][l]);
      texts[key] = texts[key][languages.find(l => texts[key][l] !== undefined)] || (() => key);
    });
    text.texts = texts;
  };
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
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 5,
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
  if(console.timeEnd) console.timeEnd(SCRIPTID);
})();