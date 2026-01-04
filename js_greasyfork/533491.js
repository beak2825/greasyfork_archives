// ==UserScript==
// @name          Google 搜索增强套件
// @name:en       Google Search Enhancement Suite
// @name:ja       Google検索拡張ツール
// @name:zh-CN    Google 搜索增强套件
// @name:zh-TW    Google 搜尋增強套件
// @namespace     https://github.com/your-github-username
// @version       3.3.1
// @description   增强Google搜索功能：扩展时间范围选项、自动展开工具菜单、多语言支持
// @description:en Enhance Google Search: Extended time ranges, auto-expand tools menu, multi-language support
// @description:ja Google検索の拡張機能：期間指定オプションの追加、ツールメニューの自動展開、多言語対応
// @description:zh-CN 增强Google搜索功能：扩展时间范围选项、自动展开工具菜单、多语言支持
// @description:zh-TW 增強Google搜索功能：擴展時間範圍選項、自動展開工具菜單、多語言支持
// @author        Hu3rror
// @license       MIT
// @match         https://www.google.com/search*
// @icon          https://www.google.com/favicon.ico
// @grant         none
// @homepageURL   https://github.com/hu3rror/my-userscript
// @supportURL   https://github.com/hu3rror/my-userscript/issues
// @downloadURL https://update.greasyfork.org/scripts/533491/Google%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/533491/Google%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.meta.js
// ==/UserScript==


(function(){
    const SCRIPTID = 'GoogleSearchVariousRanges';
    const SCRIPTNAME = 'Google Search Various Ranges';
    const DEBUG = false;
    if(window === top && console.time) console.time(SCRIPTID);
    const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
    const LANGS = ['en', 'ja', 'fr', 'ru', 'zh-CN', 'zh-TW', 'es', 'ar'];
    const RANGES = {
      "qdr:h": {
        "qdr:h":   ["Past hour",     "1 時間以内",  "Moins d'une heure",   "За час",      "过去 1 小时内",  "過去 1 小時內", "Última hora",       "آخر ساعة"],
        "qdr:h2":  ["Past 2 hours",  "2 時間以内",  "Moins de 2 heures",   "За 2 часа",   "过去 2 小时内",  "過去 2 小時內", "Últimas 2 horas",   "آخر ساعتين"],
        "qdr:h12": ["Past 12 hours", "12 時間以内", "Moins de 12 heures",  "За 12 часов", "过去 12 小时内", "過去 12 小時內", "Últimas 12 horas",  "آخر ١٢ ساعة"],
      },
      "qdr:d": {
        "qdr:d":   ["Past day",      "1 日以内",    "Moins d'un jour",     "За 1 дня",    "过去 1 天内",    "過去 1 天內", "Último 1 día",      "آخر 24 ساعة"],
        "qdr:d2":  ["Past 2 days",   "2 日以内",    "Moins de 2 jours",    "За 2 дня",    "过去 2 天内",    "過去 2 天內", "Últimos 2 días",    "آخر يومين"],
        "qdr:d3":  ["Past 3 days",   "3 日以内",    "Moins de 3 jours",    "За 3 дня",    "过去 3 天内",    "過去 3 天內", "Últimos 3 días",    "آخر ٣ أيام"],
      },
      "qdr:w": {
        "qdr:w":   ["Past week",     "1 週間以内",  "Moins d'une semaine", "За неделю",   "过去 1 周内",    "過去 1 週內", "Última semana",     "آخر أسبوع"],
        "qdr:w2":  ["Past 2 weeks",  "2 週間以内",  "Moins de 2 semaines", "За 2 недели", "过去 2 周内",    "過去 2 週內", "Últimas 2 semanas", "آخر أسبوعين"],
      },
      "qdr:m": {
        "qdr:m":   ["Past month",    "1 か月以内",  "Moins d'un mois",     "За месяц",    "过去 1 个月内",  "過去 1 個月內", "Último mes",        "آخر شهر"],
        "qdr:m2":  ["Past 2 months", "2 か月以内",  "Moins de 2 mois",     "За 2 месяца", "过去 2 个月内",  "過去 2 個月內", "Últimos 2 meses",   "آخر شهرين"],
        "qdr:m3":  ["Past 3 months", "3 か月以内",  "Moins de 3 mois",     "За 3 месяца", "过去 3 个月内",  "過去 3 個月內", "Últimos 3 meses",   "آخر ٣ شهور"],
        "qdr:m6":  ["Past 6 months", "6 か月以内",  "Moins de 6 mois",     "За 6 месяца", "过去 6 个月内",  "過去 6 個月內", "Últimos 6 meses",   "آخر ٦ شهور"],
      },
      "qdr:y": {
        "qdr:y":   ["Past year",     "1 年以内",    "Moins d'une an",      "За год",      "过去 1 年内",    "過去 1 年內", "Último año",        "آخر سنة"],
        "qdr:y2":  ["Past 2 years",  "2 年以内",    "Moins de 2 ans",      "За 2 года",   "过去 2 年内",    "過去 2 年內", "Últimos 2 años",    "آخر سنتين"],
        "qdr:y5":  ["Past 5 years",  "5 年以内",    "Moins de 5 ans",      "За 5 года",   "过去 5 年内",    "過去 5 年內", "Últimos 5 años",    "آخر ٥ سنوات"],
      },
    };
    const LANGUAGES = {
      "lang_en": ["English", "英語", "Anglais", "английский", "英语", "英語", "Inglés", "الإنجليزية"],
      "lang_ja": ["Japanese", "日本語", "Japonais", "японский", "日语", "日語", "Japonés", "اليابانية"],
      "lang_zh-TW": ["Traditional Chinese", "繁体中文", "Chinois traditionnel", "традиционный китайский", "繁体中文", "繁體中文", "Chino tradicional", "الصينية التقليدية"],
    };
    const PERIODS = [];
  
    const site = {
      targets: {
        tools: () => document.querySelector('#hdtb-tls'), // 新增工具按钮选择器
        rangeAnchor: () => (location.href.includes('qdr:h')) ? $('a[href*="qdr:d"]') : $('a[href*="qdr:h"]'),
        langAnchor: () => $('a[href*="lr=lang_"]'),
      },
      hiddenTargets: {
        dropdown: () => $('#hdtbMenus'),
        listParent: () => elements.rangeList ? elements.rangeList.parentNode : null,
        langListParent: () => elements.langList ? elements.langList.parentNode : null,
      },
      get: {
        index: () => {
          const lang = document.documentElement.lang;
          if (!lang) return 0;
  
          const langCode = lang.split('-')[0];
          const fullLangCode = lang;
  
          if (fullLangCode === 'zh-TW') return LANGS.indexOf('zh-TW');
          if (fullLangCode === 'zh-CN' || langCode === 'zh') return LANGS.indexOf('zh-CN');
  
          return LANGS.indexOf(langCode) !== -1 ? LANGS.indexOf(langCode) : 0;
        },
        rangeRow: (rangeAnchor) => rangeAnchor.parentNode.parentNode,
        rangeList: (rangeRow) => rangeRow.parentNode,
        langRow: (langAnchor) => langAnchor.parentNode.parentNode,
        langList: (langRow) => langRow.parentNode,
        customRange: (rangeList) => rangeList.lastElementChild,
        customRangeHref: (href, from, to) => href.replace(/(qdr:)[a-z][0-9]*/, `cdr:1,cd_min:${from},cd_max:${to}`),
        rangeAnchors: (rangeList) => rangeList.querySelectorAll('a[href*="qdr:"]'),
        langAnchors: (langList) => langList.querySelectorAll('a[href*="lr=lang_"]'),
        cleanUrl: (url) => {
          let clean = url.replace(/&?lr=lang_[a-zA-Z-]+/g, '');
          clean = clean.replace(/&+/g, '&').replace(/^&|&$/g, '');
          return clean;
        },
      },
    };
    const PADDING = 32 + 32;
    let elements = {}, sizes = {}, timers = {};
    let core = {
      initialize: function(){
        elements.html = document.documentElement;
        elements.html.classList.add(SCRIPTID);
        core.ready();
      },
      ready: function(){
        if(document.hidden) return document.addEventListener('visibilitychange', core.ready, {once: true});
        core.getTargets(site.targets, 40, 250).then(() => {
          log("I'm ready.");
          core.rebuildRanges();
          core.addLanguages();
          core.addCustomPeriods();
          core.calculateWidth();
          core.autoClickTools(); // 新增自动点击功能
        }).catch(e => {
          console.error(`${SCRIPTID}:`, e);
        });
      },
      // 新增自动点击方法
      autoClickTools: function(){
        timers.expand = setInterval(() => {
          const tools = elements.tools;
          if(!tools) return;
  
          const activeElement = document.activeElement;
          if(tools.getAttribute('aria-expanded') === 'true') {
            return clearInterval(timers.expand);
          }
          tools.click();
          activeElement.focus();
        }, 250);
      },
      rebuildRanges: function(){
        const index = site.get.index();
        const rangeAnchor = elements.rangeAnchor;
        const rangeRow = elements.rangeRow = site.get.rangeRow(rangeAnchor);
        const rangeList = elements.rangeList = site.get.rangeList(rangeRow);
        while(rangeList.children[1] !== rangeList.lastElementChild) rangeList.children[1].remove();
        rangeList.children[0].dataset.selector = rangeList.children[1].dataset.selector = 'rangeRow';
        Object.keys(RANGES).forEach(r => {
          const row = rangeRow.cloneNode(true), a = row.querySelector('a');
          row.dataset.selector = 'rangeRow';
          Object.keys(RANGES[r]).forEach(c => {
            const range = rangeAnchor.cloneNode(true);
            range.dataset.selector = 'rangeAnchor';
            range.href = range.href.replace(/qdr:[hd]/, c);
            range.textContent = RANGES[r][c][index];
            if(location.href.includes(c + '&')) range.dataset.selected = 'true';
            a.parentNode.append(range);
          });
          a.remove();
          rangeList.lastElementChild.before(row);
        });
      },
      addLanguages: function(){
        if (!elements.langAnchor) return;
  
        const index = site.get.index();
        const langAnchor = elements.langAnchor;
        const langRow = elements.langRow = site.get.langRow(langAnchor);
        const langList = elements.langList = site.get.langList(langRow);
  
        const existingLangItems = langList.querySelectorAll('a[href*="lr=lang_"]');
        if (existingLangItems.length === 0) return;
  
        const parentContainer = existingLangItems[0].parentNode;
  
        Object.keys(LANGUAGES).forEach(lang => {
          const template = existingLangItems[0].cloneNode(true);
          const cleanUrl = site.get.cleanUrl(langAnchor.href);
          template.href = cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + `lr=${lang}`;
          template.textContent = LANGUAGES[lang][index];
          template.dataset.selector = 'langAnchor';
  
          if(location.href.includes(lang)) {
            template.dataset.selected = 'true';
          }
  
          parentContainer.insertBefore(template, parentContainer.lastElementChild);
        });
      },
      addCustomPeriods: function(){
        let customRange = site.get.customRange(elements.rangeList);
        for(let i = 0; PERIODS[i]; i++){
          let line = document.createElement('div');
          for(let key in PERIODS[i]){
            let a = elements.rangeAnchor.cloneNode(true);
            a.href = site.get.customRangeHref(a.href, PERIODS[i][key][0], PERIODS[i][key][1]);
            a.textContent = key;
            line.appendChild(a);
          }
          customRange.parentNode.appendChild(line);
        }
      },
      calculateWidth: function(){
        core.getTargets(site.hiddenTargets).then(() => {
          if (elements.dropdown) {
            elements.dropdown.style.visibility = 'hidden';
            elements.dropdown.style.display = 'block';
          }
  
          if (elements.listParent) {
            elements.listParent.style.visibility = 'hidden';
            elements.listParent.style.display = 'block';
          }
  
          sizes.maxwidth = 0;
          if (elements.rangeList) {
            let as = site.get.rangeAnchors(elements.rangeList);
            for(let i = 0, a; a = as[i]; i++){
              if(sizes.maxwidth < a.offsetWidth) sizes.maxwidth = a.offsetWidth;
            }
          }
  
          if (elements.langList) {
            let langAs = site.get.langAnchors(elements.langList);
            for(let i = 0, a; a = langAs[i]; i++){
              if(sizes.maxwidth < a.offsetWidth) sizes.maxwidth = a.offsetWidth;
            }
          }
  
          if(sizes.maxwidth === 0) return setTimeout(core.calculateWidth, 250);
  
          if (elements.dropdown) {
            elements.dropdown.style.visibility = '';
            elements.dropdown.style.display = '';
          }
  
          if (elements.listParent) {
            elements.listParent.style.visibility = '';
            elements.listParent.style.display = 'none';
          }
  
          if (elements.langListParent) {
            elements.langListParent.style.visibility = '';
            elements.langListParent.style.display = 'none';
          }
  
          core.addStyle();
        }).catch(e => {
          console.error(`${SCRIPTID} calculateWidth:`, e);
        });
      },
      getTarget: function(selector, retry = 10, interval = 1*SECOND){
        const key = selector.name;
        const get = function(resolve, reject){
          let selected = selector();
          if(selected === null || selected.length === 0){
            if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, interval, resolve, reject);
            else return resolve(null);
          }else{
            if(selected.nodeType === Node.ELEMENT_NODE) selected.dataset.selector = key;
            else selected.forEach((s) => s.dataset.selector = key);
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
      addStyle: function(name = 'style', d = document){
        if(html[name] === undefined) return;
        if(d.head){
          let style = createElement(html[name]()), id = SCRIPTID + '-' + name, old = d.getElementById(id);
          style.id = id;
          d.head.appendChild(style);
          if(old) old.remove();
        }
        else{
          let observer = observe(d.documentElement, function(){
            if(!d.head) return;
            observer.disconnect();
            core.addStyle(name);
          });
        }
      },
    };
    const html = {
      style: () => `
        <style type="text/css">
          [data-selector="rangeRow"]:not(:first-child):not(:last-child):hover,
          [data-selector="rangeRow"]:not(:first-child):not(:last-child):active{
            background-color: transparent;
          }
          [data-selector="rangeAnchor"],
          [data-selector="langAnchor"]{
            display: inline-block !important;
            width: ${sizes.maxwidth - PADDING}px !important;
            padding-right: 20px !important;
          }
          [data-selector="rangeAnchor"]:hover,
          [data-selector="rangeAnchor"]:active,
          [data-selector="langAnchor"]:hover,
          [data-selector="langAnchor"]:active{
            background-color: rgba(0,0,0,.1);
          }
          [data-selector="rangeAnchor"][data-selected="true"],
          [data-selector="langAnchor"][data-selected="true"]{
            background-image: url(//ssl.gstatic.com/ui/v1/menu/checkmark.png);
            background-position: left center;
            background-repeat: no-repeat;
          }
          [data-selector="langAnchor"] {
            font-family: inherit;
            font-size: inherit;
            color: inherit;
            white-space: nowrap;
          }
          [data-selector="langAnchor"][data-selected="true"] {
            font-weight: bold;
          }
          :root[data-theme="dark"] [data-selector="rangeAnchor"]:hover,
          :root[data-theme="dark"] [data-selector="rangeAnchor"]:active,
          :root[data-theme="dark"] [data-selector="langAnchor"]:hover,
          :root[data-theme="dark"] [data-selector="langAnchor"]:active,
          .dark [data-selector="rangeAnchor"]:hover,
          .dark [data-selector="rangeAnchor"]:active,
          .dark [data-selector="langAnchor"]:hover,
          .dark [data-selector="langAnchor"]:active{
            background-color: rgba(255,255,255,.1) !important;
          }
          :root[data-theme="dark"] g-menu-item:not(:hover),
          .dark g-menu-item:not(:hover){
            background-color: #202124 !important;
          }
          :root[data-theme="dark"] [data-selector="rangeAnchor"][data-selected="true"],
          :root[data-theme="dark"] [data-selector="langAnchor"][data-selected="true"],
          .dark [data-selector="rangeAnchor"][data-selected="true"],
          .dark [data-selector="langAnchor"][data-selected="true"]{
            background-image: url(//ssl.gstatic.com/ui/v1/menu/checkmark_white.png);
          }
          @media (prefers-color-scheme: dark) {
            .dark-mode [data-selector="rangeAnchor"]:hover,
            .dark-mode [data-selector="rangeAnchor"]:active,
            .dark-mode [data-selector="langAnchor"]:hover,
            .dark-mode [data-selector="langAnchor"]:active{
              background-color: rgba(255,255,255,.1) !important;
            }
            .dark-mode g-menu-item:not(:hover){
              background-color: #202124 !important;
            }
            .dark-mode [data-selector="rangeAnchor"][data-selected="true"],
            .dark-mode [data-selector="langAnchor"][data-selected="true"]{
              background-image: url(//ssl.gstatic.com/ui/v1/menu/checkmark_white.png);
            }
          }
        </style>
      `,
    };
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
    const observe = function(target, callback, options = {childList: true, subtree: true}){
      const observer = new MutationObserver(callback);
      observer.observe(target, options);
      return observer;
    };
    const log = function(){
      if(typeof DEBUG === 'undefined' || !DEBUG) return;
      let l = log.last = log.now || new Date(), n = log.now = new Date();
      let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
      console.log(
        SCRIPTID + ':',
        n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
        '+' + ((n-l)/1000).toFixed(3) + 's',
        ':' + line,
        (callers[2] ? callers[2] + '() => ' : '') + (callers[1] || '') + '()',
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
        getLine: (e) => 0,
        getCallers: (e) => e.stack.split('\n'),
      }, {
        name: 'Default',
        detector: /./,
        getLine: (e) => 0,
        getCallers: (e) => [],
    }];
    log.format = log.formats.find(function MARKER(f){
      if(!f.detector.test(new Error().stack)) return false;
      return true;
    });
    core.initialize();
    if(window === top) console.timeEnd(SCRIPTNAME);
  })();
  