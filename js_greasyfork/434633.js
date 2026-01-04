// ==UserScript==
// @name        百度结果广告过滤,垃圾信息过滤 
// @namespace   Violentmonkey Scripts
// @match       *://www.baidu.com/*
// @grant       none
// @version     1.0
// @author      ZJS
// @description 2021/10/29 下午8:27:23
// @downloadURL https://update.greasyfork.org/scripts/434633/%E7%99%BE%E5%BA%A6%E7%BB%93%E6%9E%9C%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%2C%E5%9E%83%E5%9C%BE%E4%BF%A1%E6%81%AF%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/434633/%E7%99%BE%E5%BA%A6%E7%BB%93%E6%9E%9C%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%2C%E5%9E%83%E5%9C%BE%E4%BF%A1%E6%81%AF%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
(function(){
  'use strict';
  console.log($)
  const url = location.href
  
  function action(){
    //过滤csdn搜索结果
    if(/\s?ie=/.test(url)){
      document.querySelectorAll('.c-container').forEach(item=>{
        //去掉搜索结果中的视频内容
        const title= item.querySelector('h3')?.textContent
        if(item.querySelector('.video-main-title_S_LlQ')){
          return item.remove()
        }
        //去掉百度的推广内容
        if(item.querySelector('.ec-tuiguang')){
          console.log(title,'remove')
          return item.remove()
        }
        //搜索内容的关键词过滤 
        const filter= /提供|来自互联网|免费小说|相关推荐/
        if(filter.test(item.querySelector('.c-abstract')?.textContent)){
          console.log(title,'remove')
          item.remove()
        }
      })
    }    
  }
  setInterval(()=>{
    action()
  },500)
})()