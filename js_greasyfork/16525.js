// ==UserScript==
// @name        Anti Baha Anti ad block
// @namespace   mmis1000.me
// @description anit anit ad block
// @include     http://*.gamer.com.tw/*
// @include     https://*.gamer.com.tw/*
// @version     1.3.0
// @grant       none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/16525/Anti%20Baha%20Anti%20ad%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/16525/Anti%20Baha%20Anti%20ad%20block.meta.js
// ==/UserScript==
var debug = 0;
var injects = [
  {
    match: /var AntiAd/g,
    process: function (str) {
      return str.replace(/var AntiAd([\r\n]|.)*\(AntiAd\);/, '');
    }
  },
  {
    match: /var mercyadblock/g,
    process: function (str) {
      return str.replace(/var mercyadblock(.|\r|\n)+insideSecondaryfunc\(2, event\);(.|\r|\n)*\}\);/, '');
    }
  }
]
function addJS_Node(text, s_URL, funcToRun) {
  var D = document;
  var scriptNode = D.createElement('script');
  scriptNode.type = 'text/javascript';
  if (text) scriptNode.textContent = text;
  if (s_URL) scriptNode.src = s_URL;
  if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';
  var targ = D.getElementsByTagName('head') [0] || D.body || D.documentElement;
  //--- Don't error check here. if DOM not available, should throw error.
  targ.appendChild(scriptNode);
}
function log() {
  if (!debug) return;
  console.log('aborted AntiAd');
  console.log((new Error).stack);
}
Object.defineProperty(window, 'mobileBigBanner', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: true
});
Object.defineProperty(window, 'AntiAd', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: {
  }
});
Object.defineProperty(window.AntiAd, 'block', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: log
});
Object.defineProperty(window.AntiAd, 'check', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: log
});
Object.freeze && Object.freeze(window.AntiAd);

Object.defineProperty(window, 'mercyadblock', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: {
  }
});
Object.defineProperty(window.mercyadblock, 'show', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: log
});
Object.defineProperty(window.mercyadblock, 'hide', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: hide
});
Object.freeze && Object.freeze(window.mercyadblock);

function listener(zEvent) {
  var matched = false;
  var text = zEvent.target.textContent;
  
  console.log(text);
  
  injects.forEach(function (item) {
    if (item.match.test(text)) {
      matched = true;
      text = item.process(text);
      
      if (!debug) return;
      
      console.log('matched');
      console.log(text);
      console.log(item);
    }
  })
  
  if (matched) {
    addJS_Node(text);
    zEvent.stopPropagation();
    zEvent.preventDefault();
    zEvent.target.parentElement.removeChild(zEvent.target);
    window.removeEventListener('beforescriptexecute', listener)
    
    if (!debug) return;
    
    console.log(zEvent.target.textContent)
    console.log('AntiAd script killed. Cleaned script:')
    console.log(text)
  }
}
window.addEventListener('beforescriptexecute', listener, true);
