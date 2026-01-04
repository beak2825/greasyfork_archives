// ==UserScript==
// @name        Yahoo News Original Finder
// @namespace   knoa.jp
// @description Yahoo! ニュース の元記事を探して自動でジャンプします。
// @include     https://news.yahoo.co.jp/pickup/*
// @include     https://news.yahoo.co.jp/articles/*
// @include     https://headlines.yahoo.co.jp/*
// @include     https://article.yahoo.co.jp/detail/*
// @include     https://www.google.co.jp/search?YahooNewsOriginalFinder&q=*
// @version     1.0.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403843/Yahoo%20News%20Original%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/403843/Yahoo%20News%20Original%20Finder.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'YahooNewsOriginalFinder';
  const SCRIPTNAME = 'Yahoo News Original Finder';
  const DEBUG = false;/*
[update]
Googleの仕様変更に対応しました。

[bug]

[todo]

[possible]
元記事へのリンクを追加するだけのほうが穏やかですか？

[research]
古いFirefoxで記事本体のreplaceStateが意図通りに機能しないのは？

[memo]
Tampermonkey で #hash は @include に使えない。
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const STOP = SCRIPTID + '-stop';
  const NOOWNMEDIA = ['THE PAGE', 'Yahoo!ニュース 特集'];/*外部に独自のメディアを持たない(img[alt])*/
  const sites = {
    /* 続きを読む */
    pickup: {
      url: /^https:\/\/news\.yahoo\.co\.jp\/pickup\//,
      targets: {
        detail: () => $('[data-ual-view-type="digest"] a[data-ual-gotocontent="true"]'),
      },
    },
    /* 記事本体 */
    news: {/*一般*/
      url: /^https:\/\/news\.yahoo\.co\.jp\/articles\//,
      targets: {
        title: () => $('article header h1'),
        media: () => $('article header h1 + div > div:last-child a[href]'),/*weak*/
        logo:  () => $('article header h1 + div > div:last-child a[href] img[alt]'),/*weak*/
      },
    },
    headlines: {/*映像*/
      url: /^https:\/\/headlines\.yahoo\.co\.jp\//,
      targets: {
        title: () => $('article h1'),
        media: () => $('article .ynCobrandBanner a[href]'),
        logo:  () => $('article .ynCobrandBanner a[href] img[alt]'),
      },
    },
    article: {/*一部*/
      url: /^https:\/\/article\.yahoo\.co\.jp\/detail\//,
      targets: {
        title: () => $('article header h2'),
        media: () => $('article header a[href]'),
        logo:  () => $('article header a[href] img[alt]'),
      },
    },
    /* Google */
    google: {
      url: /https:\/\/www\.google\.co\.jp\/search\?YahooNewsOriginalFinder&q=/,
      targets: {
      },
      get: {
        results: () => $$('div.g [data-hveid] > div > a'),
      },
    },
  };
  let site, elements = {};
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      site = core.getSite();
      if(site){
        core.ready();
      }
    },
    ready: function(){
      core.getTargets(site.targets).then(() => {
        log("I'm ready.");
        core.sites[site.key]();
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    sites: {
      pickup: function(){
        /* 続きを読む */
        if(location.hash.endsWith(STOP)) return;
        history.replaceState({}, '', `#${STOP}`);
        let detail = elements.detail;
        if(detail === null) return console.error('Not found: detail.');
        log('Detail:', detail.href);
        return detail.click();
      },
      news: function(){
        core.sites.article();
      },
      headlines: function(){
        core.sites.article();
      },
      article: function(){
        /* 元記事をググる */
        if(location.hash.endsWith(STOP)) return;
        history.replaceState({}, '', `#${STOP}`);
        let title = encodeURIComponent(elements.title.textContent);
        let host = elements.media.href.replace(/^https?:\/\/(www\.)?([^/]+)(.*)$/, '$2');
        let name = elements.logo.alt;
        if(NOOWNMEDIA.includes(name)){
          log(`${name} doesn't have their own media.`);
          return;
        }
        else if(host.includes('yahoo.co.jp')){/*リダイレクトリンクにつきホスト名が得られていない*/
          log('Jump to:', `https://www.google.co.jp/search?${SCRIPTID}&q=${title}+${name}#${SCRIPTID}`);
          return location.assign(`https://www.google.co.jp/search?${SCRIPTID}&q=${title}+${name}#${SCRIPTID}`);
        }else{
          log('Jump to:', `https://www.google.co.jp/search?${SCRIPTID}&q=${title}+site:${host}#${SCRIPTID}`);
          return location.assign(`https://www.google.co.jp/search?${SCRIPTID}&q=${title}+site:${host}#${SCRIPTID}`);
        }
      },
      google: function(){
        /* 元記事を見つけて移動する */
        if(location.hash.endsWith(STOP)) return;
        history.replaceState({}, '', `#${STOP}`);
        let results = site.get.results();
        if(results.length === 0){
          if(location.href.includes('+site:')){/* site:絞りを外してみる */
            return location.assign(location.href.replace(/\+site:([^#]+)/, '').replace(/-stop$/, ''));
          }
          else{/* 記事が1件も見つからない */
            log('Not found: original.');
            return;
          }
        }else{
          /* Yahoo!の記事に戻るようならスクリプトは起動しない */
          Array.from(results).filter(a => a.href.includes('yahoo.co.jp')).forEach(a => a.href+= `#${STOP}`);
          /* Yahoo!を除いた最上位を元記事とみなす */
          let original = Array.from(results).find(a => a.href.includes('yahoo.co.jp') === false);
          if(original === undefined){
            log('Not found: original.');
            return;
          }else{
            log('Original:', original.href);
            return original.click();
          }
        }
      },
    },
    getSite: function(){
      Object.keys(sites).forEach(key => sites[key].key = key);
      let key = Object.keys(sites).find(key => sites[key].url.test(location.href));
      if(key === undefined) return log('Doesn\'t match any sites:', location.href);
      else return sites[key];
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