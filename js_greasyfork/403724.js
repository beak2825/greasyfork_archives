// ==UserScript==
// @name        Wayback Machine Auto Hopper
// @name:ja     Wayback Machine Auto Hopper
// @name:zh-CN  Wayback Machine Auto Hopper
// @description Automatically jump to the earliest or latest page of the search results on INTERNET ARCHIVE Wayback Machine.
// @description:ja INTERNET ARCHIVE の Wayback Machine でURL検索をした際、最古または最新のページに自動で飛びます。
// @description:zh-CN 自动跳转到 INTERNET ARCHIVE Wayback Machine 上搜索结果的最早或最新页面。
// @namespace   knoa.jp
// @include     /^http:\/\/web\.archive\.org\/web\/\*\/https?:\/\//
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403724/Wayback%20Machine%20Auto%20Hopper.user.js
// @updateURL https://update.greasyfork.org/scripts/403724/Wayback%20Machine%20Auto%20Hopper.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'WaybackMachineAutoHopper';
  const SCRIPTNAME = 'Wayback Machine Auto Hopper';
  const DEBUG = false;/*
[update] 1.0.1
No updates on code. Just confirmed to work.

[bug]

[todo]

[possible]

[research]
[Esc]のキャンセルを捉えたことがわかる反応がほしいね。

[memo]
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const HOPTO = 'EARLIEST';/* EARLIEST or LATEST */
  const DELAY = 0;/* set some time to keep chance to press [Esc] to cancel the hop */
  const site = {
    targets: {
      reactWaybackSearch: () => $('#react-wayback-search'),
    },
    get: {
      EARLIEST: () => $('.captures-range-info a[href]:first-of-type'),
      LATEST: () => $('.captures-range-info a[href]:last-of-type'),
      selector: () => {
        switch(HOPTO){
          case('EARLIEST'): return site.get.EARLIEST;
          case('LATEST'):   return site.get.LATEST;
          default:
            console.error(SCRIPTNAME, 'Unknown HOPTO:', HOPTO);
            return null;
        }
      },
    },
  };
  let elements = {};
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      core.ready();
    },
    ready: function(){
      let canceled = false, selector = site.get.selector(), a, observer;
      if(selector === null) return;
      window.addEventListener('keydown', function(e){
        if(canceled) return;
        if(e.key !== 'Escape') return;
        if(observer) observer.disconnect();
        canceled = true;
        log('Canceled.');
      });
      core.getTargets(site.targets).then(() => {
        log("I'm ready.");
        if(canceled) return;
        a = selector();
        if(a) core.hop(a);
        else observer = observe(elements.reactWaybackSearch, function(records){
          a = selector();
          if(a){
            observer.disconnect();
            core.hop(a);
          }
        }, {childList: true, subtree: true});
      }).catch(selector => {
        log(`Not found: ${selector.name}, I give up.`);
      });
    },
    hop: function(a){
      setTimeout(function(){
        log('Jump to:', a.href);
        a.click();
      }, DELAY);
    },
    getTarget: function(selector, retry = 10, interval = 1*SECOND){
      const key = selector.name;
      const get = function(resolve, reject){
        let selected = selector();
        if(selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);/* elements */
        else if(selected instanceof HTMLElement) selected.dataset.selector = key;/* element */
        else if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, interval, resolve, reject);
        else return reject(selector);
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
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
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
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?name=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 4,
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