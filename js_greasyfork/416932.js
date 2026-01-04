// ==UserScript==
// @name        * Lyric FullScreen Columnizer
// @name:ja     * Lyric FullScreen Columnizer
// @name:zh-CN  * Lyric FullScreen Columnizer
// @namespace   knoa.jp
// @description It offers a full-width and columnized lyric view on major lyric services. No more scrolling while singing, playing the piano, or guitar.
// @description:ja 大手歌詞サイトの歌詞を、横幅いっぱいの複数カラム表示に。歌いながら、ピアノやギターを弾きながら、スクロールしなくてもいいんです。
// @description:zh-CN 将大型歌词网站的歌词显示为宽度最大的多列。一边唱歌，一边弹钢琴和吉他，不用滚动。
// @include     https://www.google.*/*Lyric*
// @include     https://www.google.*/*%E6%AD%8C%E8%A9%9E*
// @include     https://www.google.*/*%E6%AD%8C%E8%AF%8D*
// @include     https://www.azlyrics.com/lyrics/*
// @include     https://genius.com/*
// @include     https://www.lyrics.com/lyric/*
// @include     https://j-lyric.net/artist/*
// @include     http*://www.kget.jp/lyric/*
// @include     https://www.uta-net.com/song/*
// @include     https://utaten.com/lyric/*
// @noframes
// @version     2.2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/416932/%2A%20Lyric%20FullScreen%20Columnizer.user.js
// @updateURL https://update.greasyfork.org/scripts/416932/%2A%20Lyric%20FullScreen%20Columnizer.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'LyricFullScreenColumnizer';
  const SCRIPTNAME = '* Lyric FullScreen Columnizer';
  const DEBUG = false;/*
[update]
Now available on Genius Lyrics.

[possible]
lyrics.com はpreなので単語が切れる。br挿入してnormalテキストにすれば解決するが。
うたまっぷ は大手だがHTMLが古いのでいまのところ対応しない。

[acknowledgement]
This script is originally dedicated to Milky Queen, for singing freely with her guitar playing.
🌾👑 https://twitter.com/milkyqueen_idol
  */
  if(window === top) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const sites = {
    google: {
      /* it doesn't detect url with "lyric" or something here, but @include meta tag does */
      url: /^https:\/\/www\.google\.[^/]+\//,
      targets: {
        header: () => $('#sfcnt'),
        lyricBody: () => $('[data-lyricid]'),
      },
      actions: {
        beforeColumnize: () => $('g-more-link [aria-expanded="false"]', e => e.click()),
      }
    },
    azlyrics: {
      url: /^https:\/\/www\.azlyrics\.com\/lyrics\//,
      targets: {
        header: () => $('.lboard-wrap'),
        lyricBody: () => $('.main-page br + br + div'),
      },
    },
    genius: {
      url: /^https:\/\/genius\.com\//,
      targets: {
        header: () => $('.header'),
        lyricBody: () => $('.lyrics'),
      },
    },
    lyrics: {
      url: /^https:\/\/www\.lyrics\.com\/lyric\//,
      targets: {
        header: () => $('#content-top'),
        lyricBody: () => $('#lyric-body-text'),
      },
    },
    jlyric: {
      url: /^https:\/\/j-lyric\.net\/artist\//,
      targets: {
        header: () => $('#ttb'),
        lyricBody: () => $('#Lyric'),
      },
    },
    kget: {
      url: /^https?:\/\/www\.kget\.jp\/lyric\//,
      targets: {
        header: () => $('#searchbar-wrap'),
        lyricBody: () => $('#lyric-trunk'),
      },
    },
    utanet: {
      url: /^https:\/\/www\.uta-net\.com\/song\//,
      targets: {
        header: () => $('#global_header'),
        lyricBody: () => $('#kashi_area'),
      },
    },
    utaten: {
      url: /^https:\/\/utaten\.com\/lyric\//,
      targets: {
        header: () => $('body > header'),
        lyricBody: () => $('.lyricBody'),
      },
    },
  };
  let site;
  let elements = {};
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      site = core.getSite(sites);
      if(site){
        core.ready();
        core.addStyle('style');
        core.addStyle('style-' + site.key);
      }
    },
    ready: function(){
      core.getTargets(site.targets).then(() => {
        log("I'm ready.");
        core.bindKeys();
      }).catch(e => {
        console.error(`${SCRIPTID}:`, e);
      });
    },
    bindKeys: function(){
      const {header, lyricBody} = elements;
      const beforeLyricBody = elements.lyricBody?.previousElementSibling;
      const parentOfLyricBody = elements.lyricBody?.parentNode;
      window.addEventListener('keydown', e => {
        if(['input', 'textarea'].includes(e.target.localName) || e.target.isContentEditable) return;
        if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
        console.log(SCRIPTID, e.key);
        switch(e.key){
          /* columnize */
          case('1'):
          case('2'):
          case('3'):
          case('4'):
          case('5'):
          case('6'):
          case('7'):
          case('8'):
          case('9'):
            document.body.classList.add(SCRIPTID);
            if(site.actions?.beforeColumnize) site.actions.beforeColumnize();
            if(document.fullscreenElement === null) header.after(lyricBody);
            lyricBody.dataset.columns = e.key;
            e.preventDefault();
            break;
          /* reset to default */
          case('0'):
          case('Escape'):
            document.body.classList.remove(SCRIPTID);
            if(beforeLyricBody) beforeLyricBody.after(lyricBody);
            else parentOfLyricBody.prepend(lyricBody);
            delete lyricBody.dataset.columns;
            e.preventDefault();
            break;
          /* browser's fullscreen */
          case('f'):
            if(document.fullscreenElement === null){
              document.body.classList.add(SCRIPTID);
              if(site.actions?.beforeColumnize) site.actions.beforeColumnize();
              if(lyricBody.dataset.columns === undefined) lyricBody.dataset.columns = '1';
              lyricBody.requestFullscreen();
            }
            else document.exitFullscreen();
            e.preventDefault();
            break;
        }
      }, true);
      /* fire the reset event on fullscreen exit */
      window.addEventListener('fullscreenchange', e => {
        if(document.fullscreenElement) return;
        else window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
      });
    },
    getSite: function(sites){
      Object.keys(sites).forEach(key => sites[key].key = key);
      let key = Object.keys(sites).find(key => sites[key].url.test(location.href));
      if(key === undefined) return log('Doesn\'t match any sites:', location.href);
      else return sites[key];
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
        /* maximize lyricBody */
        [data-selector="lyricBody"][data-columns]{
          width: 100vw;
          padding: 2em 1em 2em 2em;
          margin: 0;
          box-sizing: border-box;
        }
        /* columnize */
        [data-selector="lyricBody"][data-columns="1"]{columns: 1}
        [data-selector="lyricBody"][data-columns="2"]{columns: 2}
        [data-selector="lyricBody"][data-columns="3"]{columns: 3}
        [data-selector="lyricBody"][data-columns="4"]{columns: 4}
        [data-selector="lyricBody"][data-columns="5"]{columns: 5}
        [data-selector="lyricBody"][data-columns="6"]{columns: 6}
        [data-selector="lyricBody"][data-columns="7"]{columns: 7}
        [data-selector="lyricBody"][data-columns="8"]{columns: 8}
        [data-selector="lyricBody"][data-columns="9"]{columns: 9}
        /* no distracting elements */
        [data-selector="lyricBody"][data-columns] ~ *{
          display: none;
        }
      </style>
    `,
    'style-google': () => `
      <style type="text/css">
        body.${SCRIPTID} [data-selector="lyricBody"]{
          background: white;/* i don't know why it is required on fullscreen */
        }
        body.${SCRIPTID} .OULBYb/* SO FRAGILE!! */{
          display: none;
        }
        body.${SCRIPTID} [role="contentinfo"]{
          display: block;
        }
      </style>
    `,
    'style-azlyrics': () => `
      <style type="text/css">
        body.${SCRIPTID} [data-selector="lyricBody"]{
          background: rgb(221, 221, 238);/* i don't know why it is required on fullscreen */
        }
        body.${SCRIPTID} .navbar-bottom,
        body.${SCRIPTID} .navbar-bottom ~ div{
          display: block;
        }
      </style>
    `,
    'style-genius': () => `
      <style type="text/css">
        body.${SCRIPTID} [data-selector="lyricBody"]{
          background: white;/* i don't know why it is required on fullscreen */
        }
        body.${SCRIPTID} .page_footer{
          display: block;
        }
      </style>
    `,
    'style-lyrics': () => `
      <style type="text/css">
        body.${SCRIPTID} #main{
          width: 100vw;
          margin: 20px 0 0;
          max-width: 100vw;
          padding: 0;
        }
        body.${SCRIPTID} [data-selector="lyricBody"]{
          white-space: pre-wrap;
          font-family: 'Droid Sans',sans-serif;
          font-weight: 400;
          font-size: 18px;
          line-height: 26px;
          background: white;/* i don't know why it is required on fullscreen */
        }
        body.${SCRIPTID} footer{
          display: block;
        }
      </style>
    `,
    'style-jlyric': () => `
      <style type="text/css">
        body.${SCRIPTID} [data-selector="lyricBody"]{
          margin: 0 !important;
          background: white;/* i don't know why it is required on fullscreen */
        }
        body.${SCRIPTID} #ftb{
          display: block;
        }
      </style>
    `,
    'style-kget': () => `
      <style type="text/css">
        body.${SCRIPTID} [data-selector="lyricBody"]{
          font-size: 123.1%;
          font-family: "Hiragino Mincho ProN", Meiryo, "MS PMincho", serif;
          background: white;/* i don't know why it is required on fullscreen */
        }
        body.${SCRIPTID} [data-selector="lyricBody"] > a{
          display: none;
        }
        body.${SCRIPTID} #footer-wrap{
          display: block;
        }
      </style>
    `,
    'style-utanet': () => `
      <style type="text/css">
        body.${SCRIPTID} [data-selector="lyricBody"]{
          font-size: 15px;
          background: white;/* i don't know why it is required on fullscreen */
        }
        body.${SCRIPTID} #footer_map,
        body.${SCRIPTID} #footer_bottom{
          display: block;
        }
      </style>
    `,
    'style-utaten': () => `
      <style type="text/css">
        body.${SCRIPTID} footer{
          display: block !important;
        }
        body.${SCRIPTID} footer > aside{
          display: none;
        }
        body.${SCRIPTID}{
          background: #343330;
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
  core.initialize();
  if(window === top) console.timeEnd(SCRIPTID);
})();