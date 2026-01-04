// ==UserScript==
// @name         Remove Gray
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  移除网站灰色蒙版
// @author       LeeDashan
// @match        
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455723/Remove%20Gray.user.js
// @updateURL https://update.greasyfork.org/scripts/455723/Remove%20Gray.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 处理 root 上的遮罩
    const _root = document.querySelector(':root')
    _root.style.filter = 'none'
    _root.classList.forEach(c=>{
      if(/(\w\-\_)*gray([\w\-\_]*)/.exec(c)){
        _root.classList.remove(c)
      }
    })
    // 处理 body 上的遮罩
    const _body = document.querySelector('body')
    _body.style.filter = 'none'
    _body.classList.forEach(c=>{
      if(/(\w\-\_)*gray([\w\-\_]*)/.exec(c)){
        _body.classList.remove(c)
      }
    })

    const _hy_wrapper = document.querySelector('.ssr-wrapper')
    if(_hy_wrapper){
      _hy_wrapper.style.filter = 'none'
    }
})();