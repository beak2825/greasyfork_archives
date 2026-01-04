// ==UserScript==
// @name        Google Search Various Ranges
// @name:ja     Google Search Various Ranges
// @name:zh-CN  Google Search Various Ranges
// @description Add more time ranges on Google search.
// @description:ja Google検索の期間指定の選択肢を増やします。
// @description:zh-CN 增加Google搜索中指定期间的选项。
// @namespace   knoa.jp
// @include     https://www.google.*/search?*
// @version     3.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/534547/Google%20Search%20Various%20Ranges.user.js
// @updateURL https://update.greasyfork.org/scripts/534547/Google%20Search%20Various%20Ranges.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'GoogleSearchVariousRanges';
  const SCRIPTNAME = 'Google Search Various Ranges';
  const DEBUG = false;/*
[update] 3.1.1
Minor fix.

[to do]
画像検索その他でも効くようにしたい
カスタムレンジでレイアウトが崩れる問題(カスタムレンジそもそも不要？)

[memo]
最初と最後は「期間指定なし」と「期間を指定」とみなせる
中身にaを含むリストアイテムを1つ見つけてまるまるクローンしていく
既存要素はガン無視してRANGES定義に従って粛々と独自にDOM構築する！
チェックマークもlocation.hrefから判定していくのみ
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const LANGS = ['en', 'ja', 'fr', 'ru', 'zh', 'es', 'ar', 'ko'];
  const RANGES = {
    "qdr:h": {
      "qdr:h":   ["Past hour",     "1 時間以内",  "Moins d'une heure",   "За час",      "过去 1 小时内",  "Última hora",       "آخر ساعة",      "지난 1시간"],
      "qdr:h2":  ["Past 2 hours",  "2 時間以内",  "Moins de 2 heures",   "За 2 часа",   "过去 2 小时内",  "Últimas 2 horas",   "آخر ساعتين",    "지난 2시간"],
      "qdr:h12": ["Past 12 hours", "12 時間以内", "Moins de 12 heures",  "За 12 часов", "过去 12 小时内", "Últimas 12 horas",  "آخر ١٢ ساعة",   "지난 12시간"],
    },
    "qdr:d": {
      "qdr:d":   ["Past day",      "1 日以内",    "Moins d'un jour",     "За 1 дня",    "过去 1 天内",    "Último 1 día",      "آخر 24 ساعة",  "지난 1일"],
      "qdr:d2":  ["Past 2 days",   "2 日以内",    "Moins de 2 jours",    "За 2 дня",    "过去 2 天内",    "Últimos 2 días",    "آخر يومين",    "지난 2일"],
      "qdr:d3":  ["Past 3 days",   "3 日以内",    "Moins de 3 jours",    "За 3 дня",    "过去 3 天内",    "Últimos 3 días",    "آخر ٣ أيام",   "지난 3일"],
    },
    "qdr:w": {
      "qdr:w":   ["Past week",     "1 週間以内",  "Moins d'une semaine", "За неделю",   "过去 1 周内",    "Última semana",     "آخر أسبوع",     "지난 1주"],
      "qdr:w2":  ["Past 2 weeks",  "2 週間以内",  "Moins de 2 semaines", "За 2 недели", "过去 2 周内",    "Últimas 2 semanas", "آخر أسبوعين",   "지난 2주"],
    },
    "qdr:m": {
      "qdr:m":   ["Past month",    "1 か月以内",  "Moins d'un mois",     "За месяц",    "过去 1 个月内",  "Último mes",        "آخر شهر",       "지난 1개월"],
      "qdr:m2":  ["Past 2 months", "2 か月以内",  "Moins de 2 mois",     "За 2 месяца", "过去 2 个月内",  "Últimos 2 meses",   "آخر شهرين",     "지난 2개월"],
      "qdr:m6":  ["Past 6 months", "6 か月以内",  "Moins de 6 mois",     "За 6 месяца", "过去 6 个月内",  "Últimos 6 meses",   "آخر ٦ شهور",    "지난 6개월"],
    },
    "qdr:y": {
      "qdr:y":   ["Past year",     "1 年以内",    "Moins d'une an",      "За год",      "过去 1 年内",    "Último año",        "آخر سنة",      "지난 1년"],
      "qdr:y2":  ["Past 2 years",  "2 年以内",    "Moins de 2 ans",      "За 2 года",   "过去 2 年内",    "Últimos 2 años",    "آخر سنتين",    "지난 2년"],
      "qdr:y5":  ["Past 5 years",  "5 年以内",    "Moins de 5 ans",      "За 5 года",   "过去 5 年内",    "Últimos 5 años",    "آخر ٥ سنوات",  "지난 5년"],
    },
  };
  const PERIODS = [
    // You can edit or add below.
    //{
    //  "in '90s": ['1/1/1990', '12/31/1999'],
    //  "in '00s": ['1/1/2000', '12/31/2009'],
    //  "in '10s": ['1/1/2010', '12/31/2019'],
    //},
    //{
    //  "Before 2000": ['', '12/31/1999'],
    //  "After 2000" : ['1/1/2000', ''],
    //},
  ];
  const site = {
    targets: {
      rangeAnchor: () => (location.href.includes('qdr:h')) ? $('a[href*="qdr:d"]') : $('a[href*="qdr:h"]'),
    },
    hiddenTargets: {/*dropdown parent displaying none*/
      dropdown: () => $('#hdtbMenus'),
      listParent: () => elements.rangeList.parentNode,
    },
    get: {
      index: () => document.documentElement.lang ? LANGS.indexOf(document.documentElement.lang.split('-')[0]) : 0,
      rangeRow: (rangeAnchor) => rangeAnchor.parentNode.parentNode,
      rangeList: (rangeRow) => rangeRow.parentNode,
      customRange: (rangeList) => rangeList.lastElementChild,
      customRangeHref: (href, from, to) => href.replace(/(qdr:)[a-z][0-9]*/, `cdr:1,cd_min:${from},cd_max:${to}`),
      rangeAnchors: (rangeList) => rangeList.querySelectorAll('a[href*="qdr:"]'),
    },
  };
  const PADDING = 32 + 32;/*default left+right padding size of each range items*/
  let elements = {}, sizes = {};
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
        /* DOM operations */
        core.rebuildRanges();
        core.addCustomPeriods();
        core.calculateWidth();
      }).catch(e => {
        console.error(`${SCRIPTID}:`, e);
      });
    },
    rebuildRanges: function(){
      const index = site.get.index();
      const rangeAnchor = elements.rangeAnchor;
      const rangeRow = elements.rangeRow = site.get.rangeRow(rangeAnchor);
      const rangeList = elements.rangeList = site.get.rangeList(rangeRow);
      while(rangeList.children[1] !== rangeList.lastElementChild) rangeList.children[1].remove();/* only the first and the last remain */
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
      /* for calculating width */
      core.getTargets(site.hiddenTargets).then(() => {
        elements.dropdown.style.visibility = 'hidden';
        elements.dropdown.style.display = 'block';
        elements.listParent.style.visibility = 'hidden';
        elements.listParent.style.display = 'block';
        sizes.maxwidth = 0;
        /* calculate */
        let as = site.get.rangeAnchors(elements.rangeList);
        for(let i = 0, a; a = as[i]; i++){
          if(sizes.maxwidth < a.offsetWidth) sizes.maxwidth = a.offsetWidth;
        }
        if(sizes.maxwidth === 0) return setTimeout(core.calculateWidth, 250);
        /* restore */
        elements.dropdown.style.visibility = '';
        elements.dropdown.style.display = '';
        elements.listParent.style.visibility = '';
        elements.listParent.style.display = 'none';
        core.addStyle();
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
        [data-selector="rangeAnchor"]{
          display: inline-block !important;
          width: ${sizes.maxwidth - PADDING}px !important;
          padding-right: 20px !important;
        }
        [data-selector="rangeAnchor"]:hover,
        [data-selector="rangeAnchor"]:active{
          background-color: rgba(0,0,0,.1);
        }
        [data-selector="rangeAnchor"][data-selected="true"]{
          background-image: url(//ssl.gstatic.com/ui/v1/menu/checkmark.png);
          background-position: left center;
          background-repeat: no-repeat;
        }
        g-menu-item:not(:hover){
          background-color: white !important;
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
  if(window === top) console.timeEnd(SCRIPTNAME);
})();
