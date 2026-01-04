// ==UserScript==
// @name         国易堂去头部、文章页二维码、右侧热门推荐等广告
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  头部、文章页二维码、右侧热门推荐等广告
// @author       Dragon
// @match        https://www.guoyi360.com/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @icon         data:image/png;base64,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
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442219/%E5%9B%BD%E6%98%93%E5%A0%82%E5%8E%BB%E5%A4%B4%E9%83%A8%E3%80%81%E6%96%87%E7%AB%A0%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E3%80%81%E5%8F%B3%E4%BE%A7%E7%83%AD%E9%97%A8%E6%8E%A8%E8%8D%90%E7%AD%89%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/442219/%E5%9B%BD%E6%98%93%E5%A0%82%E5%8E%BB%E5%A4%B4%E9%83%A8%E3%80%81%E6%96%87%E7%AB%A0%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E3%80%81%E5%8F%B3%E4%BE%A7%E7%83%AD%E9%97%A8%E6%8E%A8%E8%8D%90%E7%AD%89%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...

  // 使用jq删除第一个script标签
  //$('head script:first').remove();
  
  // 删除导航条
  $('#nav').remove();
  // 删除置顶条
  $('#top').remove();
  // 删除当前栏目标题
  $('.index-title').remove();
  // 删除右侧热门排行、推荐内容等
  $('#pd-box #pd-y').remove();
  // 删除分享按钮等——此处效果不好，保存的html还是会加载，因为有js写入html到文件，更好的方式是直接删除js引入，见下面代码
  $('#dangqianweizhi #fxd').remove();
  
  // 此方式删了无效，保存的html还是有分享按钮
  //$('#bdshare').remove();
  
  // 删除百度分享js引入
  $('#bdshare_js').remove();
  $('#bdshell_js').remove();
  
  // 删除头部广告内容
  $("#header").remove();
  // 删除上面的二维码广告
  $('table').remove();
  
  // nth-child(1) 表示父元素中子元素为第一的并且名字为div的标签被选中
  document.querySelector("#article_content > div.content > div:nth-child(1)").remove();
  
  // 文章详细信息删除：时间阅读数等
  $('.wenzhang-xx').remove();
  
  // 删除 您可能感兴趣的文章 等内容
  $('#punlun .pd-ztitle2').remove();
  $('#punlun .pd-y-list2').remove();
  
  // 删除文末导航
  $('#dibubox').remove();
  
  // 删除百度分享等内容，直接暴力删除js引入
  $('head script').map((i, v) => {
    if (v.src.includes("jquery") || v.src.includes("lmcommon")) {
      console.log(v.remove())
    }
  });
  
  // 删除文末引用说明
  var elements = document.getElementsByTagName('p');
  for (var i = 1; i < elements.length; i++) {
    if (elements[i].innerHTML.includes('本文出自国易堂')) {
      elements[i].remove()
    }
  }
})();