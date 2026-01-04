// ==UserScript==
// @name        Google Search English Filter
// @name:ja     Google Search English Filter
// @name:zh-CN  Google Search English Filter
// @description Add "Search English pages" option to the language filter on Google search Tools.
// @description:ja Google検索のツールで選べる絞り込み言語として、英語を追加します。
// @description:zh-CN 作为可以通过Google搜索工具选择的缩小语言，追加英语。
// @namespace   knoa.jp
// @include     https://www.google.*/search?*
// @version     1.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/394573/Google%20Search%20English%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/394573/Google%20Search%20English%20Filter.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'GoogleSearchEnglishFilter';
  const SCRIPTNAME = 'Google Search English Filter';
  const DEBUG = false;/*
[update] 1.1.2
Minor fix.

[bug]

[todo]
言語設定で複数選んでいると「日本語のページを検索」が「英語と日本語のページを検索」になるので、日本語だけが選べない
  langコードを取得して、ラベルは取得できないけどうまいことやるしかないか

[possible]

[memo]
https://www.google.com/search?q=google&client=firefox-b&sxsrf=ACYBGNTaF1aCsCLcgnQOwwDAo3nGoELowQ:1577943675296&source=lnt&tbs=lr:lang_1ja&lr=lang_ja&sa=X&ved=2ahUKEwif0PahmuTmAhWhGaYKHRCLDE0QpwV6BAgKEBk
https://www.google.com/search?q=test&hl=zh-CN&sxsrf=ACYBGNQ3oa8YIfHamy9rqBV9t5530dg6Nw:1577946432840&source=lnt&tbs=lr:lang_1zh-CN%7Clang_1zh-TW&lr=lang_zh-CN%7Clang_zh-TW&sa=X&ved=2ahUKEwiIhOrEpOTmAhVME6YKHWwjBeoQpwV6BAgLEBk
fetchしてもロケール言語による選択肢は取得できない。
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const RESET = 'GoogleSearchEnglishFilter_RESET';
  const LANGUAGES = [
    /* If you edited LANGUAGES, you should search "GoogleSearchEnglishFilter_RESET" on Google to apply your update */
    /* https://www.google.com/search?q=GoogleSearchEnglishFilter_RESET */
    {code: 'en', label: 'Search English pages',  value: 'lang_en'},
    //{code: 'ja', label: 'Search Japanese pages', value: 'lang_ja'},
    //{code: 'fr', label: 'Search French pages',   value: 'lang_fr'},
    //{code: 'ru', label: 'Search Russian pages',  value: 'lang_ru'},
    //{code: 'es', label: 'Search Spanish pages',  value: 'lang_es'},
    //{code: 'ar', label: 'Search Arabic pages',   value: 'lang_ar'},
    //{code: 'zh-CN_zh-TW', label: 'Search Chinese (Simplified) and Chinese (Traditional) pages', value: 'lang_zh-CN%7Clang_zh-TW'},
    //{code: 'zh-CN', label: 'Search Chinese (Simplified) pages',  value: 'lang_zh-CN'},
    //{code: 'zh-TW', label: 'Search Chinese (Traditional) pages', value: 'lang_zh-TW'},
  ];
  const LANGUAGEQUERY = /(\?|&)(lr)=([^&]+)/;
  const RETRY = 10;
  let site = {
    targets: {
      as: () => $$('#hdtbMenus a[href^="/"]'),/* possible anchors for language selector links */
    },
    get: {
      languageList: () => {/* list parent including any language, Japanese,... */
        if(LANGUAGEQUERY.test(location.href) === false){/* not filtered yet */
          const option = Array.from(elements.as).find(a => a.href.includes('&lr='));/* such as "Japanese" link */
          if(option === undefined) return error('Not found: language option');
          const languageList = option.parentNode.parentNode.parentNode;
          const anyLanguageText = languageList.firstElementChild.textContent.trim();/* must be "any language" */
          Storage.save('anyLanguageText', anyLanguageText);
          return languageList;
        }
        else{
          const anyLanguageText = Storage.read('anyLanguageText');
          if(!anyLanguageText) return error('Not saved yet: anyLanguageText');
          const option = Array.from(elements.as).find(a => a.textContent.includes(anyLanguageText));
          const languageList = option.parentNode.parentNode.parentNode;
          return languageList;
        }
      },
      languageData: (li) => {
        let a = li.querySelector('a[href]'), url = a ? a.href : location.href;
        let match = url.match(LANGUAGEQUERY);
        if(match === null) return log('LANGUAGEQUERY doesn\'t match.', url);
        return {
          code:  match[3].replace(/lang_/g, '').replace(/%7C/g, '_'),
          label: li.textContent,
          value: match[3],
        };
      },
      listItem: (languageList, languageData) => {
        let a = languageList.querySelector('a[href]');
        if(a === null) return log('a[href] doesn\'t exist.');
        let url = [a.href, location.href].find(href => LANGUAGEQUERY.test(href));
        if(url === undefined) return log('URL doesn\'t match.');
        let li = a.parentNode.parentNode.cloneNode(true), lia = li.querySelector('a[href]');
        li.id = SCRIPTID + '-' + languageData.code;
        li.dataset.value = languageData.value;
        lia.href = url.replace(LANGUAGEQUERY, `$1$2=${languageData.value}`);
        lia.textContent = li.dataset.label = languageData.label;
        return li;
      }
    },
    is: {
      reset: () => location.href.includes(RESET),
    },
  };
  let html, elements = {}, timers = {}, sizes = {};
  let languagesData = [];
  let core = {
    initialize: function(){
      html = document.documentElement;
      html.classList.add(SCRIPTID);
      core.ready();
      core.addStyle();
    },
    ready: function(){
      core.getTargets(site.targets, RETRY).then(() => {
        log("I'm ready.");
        core.readLanguages();
        core.getLanguages();
        core.addLanguages();
      });
    },
    readLanguages: function(){
      /* read the saved preferences */
      if(site.is.reset()){
        languagesData = LANGUAGES;
        alert(`${SCRIPTNAME} has reset.`);
      }else{
        languagesData = Storage.read('languagesData') || LANGUAGES;
      }
    },
    getLanguages: function(){
      let languageList = elements.languageList = site.get.languageList();
      /* add dataset for each list items */
      Array.from(languageList.children).forEach((li, i) => {
        if(i === 0) return;/*any language*/
        let languageData = site.get.languageData(li);
        li.dataset.code  = languageData.code;
        li.dataset.label = languageData.label;
        li.dataset.value = languageData.value;
        /* get default languages */
        if(languagesData.find(l => l.code === languageData.code)) return;
        languagesData.splice(i - 1, 0, languageData);/*keep the order of the languages*/
      });
      /* get and update localized labels */
      languagesData.forEach(languageData => {
        let li = Array.from(languageList.children).find(li => li.dataset.code === languageData.code);
        if(li) languageData.label = li.dataset.label;
      });
      Storage.save('languagesData', languagesData);
    },
    addLanguages: function(){
      let languageList = elements.languageList;
      languagesData.forEach((languageData, i) => {
        if(Array.from(languageList.children).some(li => li.dataset.code === languageData.code)) return;
        let li = site.get.listItem(languageList, languageData);
        languageList.insertBefore(li, languageList.children[i + 1]);
      });
    },
    getTarget: function(selector, retry = 10, interval = 1*SECOND){
      const key = selector.name;
      const get = function(resolve, reject){
        let selected = selector();
        if(selected === null || selected.length === 0){
          if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, interval, resolve, reject);
          else return reject(new Error(`Not found: ${selector.name}, I give up.`));
        }else{
          if(selected.nodeType === Node.ELEMENT_NODE) selected.dataset.selector = key;/* element */
          else selected.forEach((s) => s.dataset.selector = key);/* elements */
          elements[key] = selected;
          resolve(selected);
        }
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject);
      });
    },
    getTargets: function(selectors, retry = 10, interval = 1*SECOND){
      return Promise.all(Object.values(selectors).map(selector => core.getTarget(selector, retry, interval)));
    },
    addStyle: function(name = 'style'){
      if(core.html[name] === undefined) return;
      let style = createElement(core.html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      style: () => `
        <style type="text/css">
          [id^="${SCRIPTID}"]:active,
          [id^="${SCRIPTID}"]:hover{
            background-color: rgba(0,0,0,.1);
          }
          [id^="${SCRIPTID}"] a{
            color: #0c0c0d;
          }
          g-menu-item:not(:hover){
            background-color: white !important;
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
    if(typeof DEBUG === 'undefined') return;
    console.log(...log.build(new Error(), ...arguments));
  };
  log.build = function(error, ...args){
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    return [SCRIPTID + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...args
    ];
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
    //console.log('////', f.name, 'wants', 0/*the exact line number here*/, '\n' + new Error().stack);
    return true;
  });
  const error = function(){
    if(typeof DEBUG === 'undefined') return;
    let body = Array.from(arguments).join(' ');
    if(error.notifications[body]) return;
    Notification.requestPermission();
    error.notifications[body] = new Notification(SCRIPTNAME, {body: body});
    error.notifications[body].addEventListener('click', function(e){
      Object.values(error.notifications).forEach(n => n.close());
      error.notifications = {};
    });
    console.error(...log.build(new Error(), ...arguments));
  };
  error.notifications = {};
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();