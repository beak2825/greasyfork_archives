// ==UserScript==
// @name        Google Tabindexer
// @name:ja     Google Tabindexer
// @name:zh-CN  Google Tabindexer
// @description Enable comfortable [TAB] key navigation by keyboard shortcut on Google search.
// @description:ja Google の検索結果で [TAB] キーによる快適なキーボード操作を可能にします。
// @description:zh-CN Google 的搜索结果允许使用 [TAB] 键进行舒适的键盘操作。
// @namespace   knoa.jp
// @include     https://www.google.*/search?*
// @version     1.2.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/376823/Google%20Tabindexer.user.js
// @updateURL https://update.greasyfork.org/scripts/376823/Google%20Tabindexer.meta.js
// ==/UserScript==

(function(){
  const SCRIPTNAME = 'GoogleTabindexer';
  const DEBUG = false;/*
[update] 1.2.4
fix for google's update.

[todo]
ターゲット要素に背景色？単純なリンク要素以外だと適用しにくいかな。
ブロック要素の指定も含めて定義するか。
shift戻るときのbottom判定にも使える。

Twitterのみ特殊な件、テキトー対応しただけ
https://www.google.co.jp/search?q=%22%E5%86%AC%E9%87%8E%E3%83%A6%E3%83%9F%22
*/
  if(window === top && console.time) console.time(SCRIPTNAME);
  const POSITION = (50/100);/* anchor target position scroll to */
  const SELECTORS = [
    'input[title]',/* search */
    '#hdtbSum a:not([tabindex="-1"])',/* top navigations */
    '.zTpPx g-link > a',/* special twitter heading */
    '#search div.g [data-hveid] > div > a',/**** main headings!! ****/
    /* sub pages vary too much */
    '[aria-label^="Page"]',/* paging */
    '#pnprev',/* paging */
    '#pnnext',/* paging */
    '#tads a:not([style])[id]',/* ads */
    'h3[role="heading"] a',/* images */
    '[data-init-vis="true"] g-inner-card a',/* videos */
    'lazy-load-item a',/* news */
  ];
  const FOCUSFIRST = '#search div.g [data-hveid] > div > a';
  const INDEX = '1';/* set 1 to prevent default tab focuses */
  const FLAGNAME = 'tabindexer';/* should be lowercase */
  let elements = {}, indexedElements = [];
  let core = {
    initialize: function(){
      core.addTabindex(document.body);
      core.focusFirst();
      core.observe();
      core.tabToScroll();
      core.addStyle();
    },
    addTabindex: function(node){
      for(let i = 0; SELECTORS[i]; i++){
        let es = node.querySelectorAll(SELECTORS[i]);
        if(es === null) log('Not found:', SELECTORS[i]);
        for(let j = 0; es[j]; j++){
          es[j].tabIndex = INDEX;
          es[j].dataset[FLAGNAME] = SELECTORS[i];
        }
      }
      indexedElements = document.querySelectorAll(`[data-${FLAGNAME}]`);
      for(let i = 0; indexedElements[i]; i++){
        indexedElements[i].previousTabindexElement = indexedElements[i - 1];
        indexedElements[i].nextTabindexElement = indexedElements[i + 1];
      }
    },
    focusFirst: function(){
      let target = document.querySelector(FOCUSFIRST);
      core.showTarget(target);
      target.focus();
    },
    observe: function(){
      let body = document.body;
      observe(body, function(records){
        core.addTabindex(body);
      }, {childList: true, subtree: true});
    },
    tabToScroll: function(){
      window.addEventListener('keydown'/*keypress doesn't fire on tab key*/, function(e){
        if(e.key !== 'Tab') return;/* catch only Tab key */
        if(e.altKey || e.ctrlKey || e.metaKey) return;
        let target = (e.shiftKey) ? e.target.previousTabindexElement : e.target.nextTabindexElement;
        if(target) core.showTarget(target, e.shiftKey);
      }, true);
    },
    showTarget: function(target, shiftKey){
      let scroll = function(x, y, deltaY){
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 9**2)/100)}, 0*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 8**2)/100)}, 1*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 7**2)/100)}, 2*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 6**2)/100)}, 3*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 5**2)/100)}, 4*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 4**2)/100)}, 5*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 3**2)/100)}, 6*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 2**2)/100)}, 7*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 1**2)/100)}, 8*(1000/60));
        setTimeout(function(){window.scrollTo(x, y + deltaY*(100 - 0**2)/100)}, 9*(1000/60));
      };
      let innerHeight = window.innerHeight, scrollX = window.scrollX, scrollY = window.scrollY;
      let rect = target.getBoundingClientRect()/* rect.top: from top of the window */;
      switch(true){
        case(shiftKey === true && rect.bottom < innerHeight*POSITION):/* target is above the POSITION */
          scroll(scrollX, scrollY, rect.bottom - innerHeight*POSITION);/* position the target to (POSITION) from top */
          break;
        case(shiftKey === false && innerHeight*(1 - POSITION) < rect.top):/* target is below the POSITION */
          scroll(scrollX, scrollY, rect.top - innerHeight*(1 - POSITION));/* position the target to (1 - POSITION) from top */
          break;
        default:
          /* stay scrollY */
          break;
      }
    },
    addStyle: function(name = 'style'){
      let style = createElement(core.html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      style: () => `
        <style type="text/css">
          div.g [data-hveid] > div > a:focus,
          g-link a:focus,
          g-inner-card a:focus{
            outline: 0;
          }
          div.g [data-hveid] > div > a:focus h3,
          g-inner-card a:focus [role="heading"]{
            text-decoration: underline;
          }
          div.g [data-hveid] > div,
          g-link,
          g-inner-card a [role="heading"]{
            position: relative;
            overflow: visible !important;
          }
          div.g [data-hveid] > div > a:focus:before,
          g-link a:focus:before,
          g-inner-card a:focus [role="heading"]:before{
            content: "▶";
            font-size: medium;
            color: lightgray;
            position: absolute;
            left: -1.25em;
            top: 0.1em;
          }
          /* pagenation */
          a:focus > h3 > div{
            background: #eee;
            border: 1px solid #ccc;
          }
        </style>
      `,
    },
  };
  const createElement = function(html){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, characterData: false, subtree: false, attributes: false, attributeFilter: undefined}){
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
      SCRIPTNAME + ':',
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
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \((userscript\.html|chrome-extension:)/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):1\)$/)[1] - 4,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \((userscript\.html|chrome-extension:))/gm),
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
    //console.log('//// ' + f.name + '\n' + new Error().stack);
    return true;
  });
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTNAME);
})();