// ==UserScript==
// @name        haijiao-海角-天涯-社区-允许文本选中复制
// @description 允许全选
// @namespace    http://tampermonkey.net/
// @version     0.0.8
// @author      HHH
// @match       https://hj2404cf43.top/*
// @match       https://haijiao.com/*
// @match       https://hj2404cf43.top/post/details*
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @supportURL  https://github.com/nicaicai/TKScript/issues
// @license     MIT
// @license Copyright 我的名字
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/499339/haijiao-%E6%B5%B7%E8%A7%92-%E5%A4%A9%E6%B6%AF-%E7%A4%BE%E5%8C%BA-%E5%85%81%E8%AE%B8%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/499339/haijiao-%E6%B5%B7%E8%A7%92-%E5%A4%A9%E6%B6%AF-%E7%A4%BE%E5%8C%BA-%E5%85%81%E8%AE%B8%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {

  setTimeout(()=>{
    allowCopy()
  },1000)
  setTimeout(()=>{
    allowCopy()
  },2000)
  setTimeout(()=>{
    allowCopy()
  },3000)
  setTimeout(()=>{
    allowCopy()
  },4000)
  setTimeout(()=>{
    allowCopy()
  },5000)
  setTimeout(()=>{
    allowCopy()
  },6000)
  setTimeout(()=>{
    allowCopy()
  },7000)
  setTimeout(()=>{
    // $(".tab-bbs-list tbody tr td:nth-child(-n+10)").css("display", "none")
    allowCopy()
  },8000)
}());

function allowCopy() {
    $(".article-content").css("user-select", "all")
    $(".article").css("user-select", "all")
    $(".article p").css("user-select", "all")
    $(".article p span").css("user-select", "all")
    $("#details-page .header h2 span").css("user-select", "all")
}

setInterval(()=>{
    let arr = $("a.hjbox-linkcolor")
    if (arr.length > 0) {
      for(let i = 0; i < arr.length - 1; i++) {
        let x = arr[i]
        console.log(x.innerText)
        if(x.innerText.startsWith('海角管理') || x.innerText.startsWith('海角小助手') || x.innerText.startsWith('海角mingL')){
          debugger
          $(x.parentElement.parentElement).css("display", "none");
        }
      }
    }
},1000)
