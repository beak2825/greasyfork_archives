// ==UserScript==
// @name         微博快转屏蔽-请使用另一个脚本
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @license GPL
// @description  辣鸡微博！
// @author       zycat
// @match        *://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407232/%E5%BE%AE%E5%8D%9A%E5%BF%AB%E8%BD%AC%E5%B1%8F%E8%94%BD-%E8%AF%B7%E4%BD%BF%E7%94%A8%E5%8F%A6%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/407232/%E5%BE%AE%E5%8D%9A%E5%BF%AB%E8%BD%AC%E5%B1%8F%E8%94%BD-%E8%AF%B7%E4%BD%BF%E7%94%A8%E5%8F%A6%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
   console.log('执行屏蔽开始。。。')
  setInterval(()=>{
      const s=document.querySelector('div[isfastforward="1"]');
      if(!!s){
      s.remove();
      console.log('移除了快转部分')
      }},5000)
})();