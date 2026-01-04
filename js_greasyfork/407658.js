// ==UserScript==
// @name         维基百科简体中文化
// @version      0.03
// @description  Wikipedia 维基百科和 wikiwand 默认语言转简体中文。
// @author       Fionnghall
// @include      http*://zh.wikipedia.org/*
// @include      http*://en.wikipedia.org/*
// @include      http*://www.wikiwand.com/*
// @namespace    https://greasyfork.org/users/293425
// @downloadURL https://update.greasyfork.org/scripts/407658/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407658/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // ==================================================
    // 请优先使用维基百科自带的语言选择功能，需要登陆账号。
    // 在参数设置里选择，不同的地区语言，链接可能不同。
    // https://zh.wikipedia.org/wiki/Special:参数设置
    // ==================================================

     console.log('自动切换维基语言')
  
  
    //let current_lang = document.querySelector('.uls-display-settings-anon-label span').firstChild.nodeValue
    if (document.URL.includes('en')) {
      let wiki_href = ""
      // if (document.URL.includes.('wikipedia.org')){
        let target_href = document.querySelector('#p-lang .vector-menu-content .vector-menu-content-list .interwiki-zh a').getAttribute('href')
        wiki_href = target_href
        window.location = target_href
        console.log('切换成功！')
      // }
      // if (document.URL.includes.('wikiwand.com')){
      //   window.location = target_href
      //   console.log('切换成功！')
      // }
    }
    


})();
