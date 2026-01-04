// ==UserScript==
// @name         百度贴吧网页端屏蔽百度小说吧
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  屏蔽百度贴吧电脑网页端恶心的《百度小说吧》推广贴
// @license      MIT
// @author       mfcwebfe
// @match        *://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448482/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B0%8F%E8%AF%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/448482/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B0%8F%E8%AF%B4%E5%90%A7.meta.js
// ==/UserScript==

;(function() {
  // 'use strict';
  let blockArr = [
    '百度小说吧',
  ]
  function clearGarbageTieba(){
    let liList = document.querySelectorAll('.j_feed_li')
    liList.forEach(item => {
      if(!item.innerText) return
      let title = item.querySelector('.title-tag-wraper').querySelector('a')
      if(blockArr.includes(title.innerText) && item.style.display !== 'none'){
        item.style = "display: none;"
        console.log('title', title.innerText)
      }
    })
  }
  clearGarbageTieba()

  let box = document.querySelector('#new_list')
  /*
  * 在我们创建MutationObserver对象的时候可以传入一个函数，
  *
  */
  let observer = new MutationObserver(mutations => {
    console.log('加载新页面')
    // => 返回一个我们监听到的MutationRecord对象
    // MutationRecord对象 是我们每修改一个就会在数组里面追加一个
    clearGarbageTieba()
  })

  observer.observe(box, { childList: true }) // 监听的 元素 和 配置项
})();