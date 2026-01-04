// ==UserScript==
// @name 多吉搜索重定向（针对中国大陆改进）
// @description 重定向多吉未完成的功能到百度搜索，针对中国大陆改进。
// 原版：https://greasyfork.org/zh-CN/scripts/387970
// 简介页：https://greasyfork.org/zh-CN/scripts/394352
// @namespace Violentmonkey Scripts
// @match https://www.dogedoge.com/results
// @require https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @run-at document-body
// @license Creative Commons BY-NC-SA 4.0
// @author iiiSmile
// @version 1.1.3
// 
// @downloadURL https://update.greasyfork.org/scripts/394352/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%88%E9%92%88%E5%AF%B9%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E6%94%B9%E8%BF%9B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/394352/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%88%E9%92%88%E5%AF%B9%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E6%94%B9%E8%BF%9B%EF%BC%89.meta.js
// ==/UserScript==
(function(){
  
  //
  var GoogleRoot="https://www.google.com/search?q="; // Google搜索
  var BaiduImage="https://image.baidu.com/search/index?tn=baiduimage&fm=result&ie=utf-8&word="; // 百度图片
  var Pixabay="https://pixabay.com/zh/images/search/"; // Pixabay 图片
  var Bilibili="https://search.bilibili.com/all?keyword="; // 哔哩哔哩弹幕网
  var News="https://sou.chinanews.com/search.do?q="; // 中国新闻网
  var SoKu="https://so.youku.com/search_video/q_"; // 搜酷（优酷视频）
  var SogouPic="https://pic.sogou.com/pics?query="; //搜狗图片
  var iQiyi="https://so.iqiyi.com/so/q_"; //爱奇艺
  //
  
  
  var keyword=window.location.search.split('=')[1];
  //link start      //如果需要引用其他的链接请替换参数，简介有相关教程。（https://greasyfork.org/zh-CN/forum/discussion/68503）
  $("a[data-zci-link='images']").attr('href',Pixabay+keyword).attr('target','_blank');
  $("a[data-zci-link='videos']").attr('href',Bilibili+keyword).attr('target','_blank');
  $("a[data-zci-link='news']").attr('href',News+keyword).attr('target','_blank');
  //link end
  
  //// 如果需要使用谷歌搜索请取消注释下面的代码，并注释link区域里的代码。
  // $("a[data-zci-link='images']").attr('href',GoogleRoot+keyword+'&tbm=isch').attr('target','_blank');
  // $("a[data-zci-link='videos']").attr('href',GoogleRoot+keyword+'&tbm=lnms').attr('target','_blank');
  // $("a[data-zci-link='news']").attr('href',GoogleRoot+keyword+'&tbm=nws').attr('target','_blank');
})();
