// ==UserScript==
// @name block anti adblock
// @namespace ren.min.bi
// @match http://www.ruanyifeng.com/*
// @match https://www.ruanyifeng.com/*
// @match http://t66y.com/*
// @match https://t66y.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @description block anti block
// @grant none
// @version 0.0.1.20190524143514
// @downloadURL https://update.greasyfork.org/scripts/383436/block%20anti%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/383436/block%20anti%20adblock.meta.js
// ==/UserScript==
let arr = ['屏蔽','广告拦截','破坏'];
function _blockCheck(callback){
  let code = callback.prototype ? callback.prototype.constructor.toString() : callback.toString();
  let flag = false;
  for(let key of arr){
    if(code.indexOf(key) !== -1){
      flag = true;
      break;
    }
  }
  return flag;
}
// 有两种调用方式，
// 1.在执行之初就将代码注册到settimeout，这个时候由重写setTimeout接管，
// (function() {})();
function overrideSetTimeout(fn){
  return function(callback, delay){
    if(_blockCheck(callback)){
      console.log('屏蔽掉了屏蔽广告函数', callback.prototype.constructor.name);
    }else{
      fn(callback,delay);
    }
  }
}
window.setTimeout = overrideSetTimeout(setTimeout);

// 2.写一个函数，加载完毕后再注册。这个时候破坏掉这个函数。
$(function(){
   for(let i in window){
      let o = window[i];
      if(typeof(o) == 'function' && o.prototype){
        if(_blockCheck(o)){
          if('setTimeout'!== i){ 
            console.log('发现屏蔽掉了屏蔽广告函数', i);
            window[i] = {};
          }
        }
      }
    }
});


