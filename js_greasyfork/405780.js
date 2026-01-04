// ==UserScript==
// @name        GreasyFork Installs Notifier
// @name:ja     GreasyFork Installs Notifier
// @name:zh-CN  GreasyFork Installs Notifier
// @namespace   knoa.jp
// @description It shows a browser notification when any of the numbers of installs reached round numbers on your own user page.
// @description:ja ご自身のユーザーページで各スクリプトのインストール数がキリのいい数字を超えたらブラウザ通知でお知らせします。
// @description:zh-CN 在您自己的用户页面上，如果每个脚本的安装数量超过整数或靓号，我们将通过浏览器通知通知您。
// @include     https://greasyfork.org/*/users/*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/405780/GreasyFork%20Installs%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/405780/GreasyFork%20Installs%20Notifier.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'GreasyForkInstallsNotifier';
  const SCRIPTNAME = 'GreasyFork Installs Notifier';
  const DEBUG = false;/*
[update] 1.0.2
Properly added yellow background highlight and fixed the 1st install text.

[bug]

[todo]

[possible]

[research]

[memo]
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const THRESHOLDS = [1, 10, 100, 1000, 10000, 100000, 1000000];
  const FLAGNAME = SCRIPTID.toLowerCase();
  const site = {
    targets: {
      userScriptListItems: () => $$('#user-script-list > li'),
    },
    get: {
      scriptName: (li) => li.dataset.scriptName,
      totalInstalls: (li) => parseInt(li.dataset.scriptTotalInstalls),
    },
    is: {
      owner: () => ($('#control-panel') !== null),
    },
  };
  let elements = {}, installs;
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      if(site.is.owner()){
        core.ready();
        core.addStyle();
      }
    },
    ready: function(){
      core.getTargets(site.targets).then(() => {
        log("I'm ready.");
        Notification.requestPermission();
        core.getInstalls();
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    getInstalls: function(){
      installs = Storage.read('installs') || {};
      let items = elements.userScriptListItems;
      Array.from(items).forEach(li => {
        let name = site.get.scriptName(li);
        let totalInstalls = site.get.totalInstalls(li);
        if(THRESHOLDS.some(t => installs[name] < t && t <= totalInstalls)){
          let numberText = totalInstalls.toLocaleString();
          let installsText = (totalInstalls === 1) ? 'install' : 'installs';
          let notification = new Notification(SCRIPTNAME, {body: `${numberText} ${installsText}: ${name}`});
          notification.addEventListener('click', function(e){
            notification.close();
          });
          li.dataset[FLAGNAME] = 'true';
        }
        installs[name] = totalInstalls;
      });
      Storage.save('installs', installs);
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
    style: () => `
      <style type="text/css" id="${SCRIPTID}-style">
        li[data-${FLAGNAME}="true"]{
          background: #ffc;
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
      if(data.expire < Date.now()) return localStorage.removeItem(key);/*undefined*/
      return data.value;
    }
    static remove(key){
      key = Storage.key(key);
      delete localStorage.removeItem(key);
    }
    static delete(key){
      Storage.remove(key);
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
  const $$ = function(s, f){
    let targets = document.querySelectorAll(s);
    return f ? Array.from(targets).map(t => f(t)) : targets;
  };
  const createElement = function(html = '<div></div>'){
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