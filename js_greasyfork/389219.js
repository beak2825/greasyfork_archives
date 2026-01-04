// ==UserScript==
// @name CSDN去广告，推荐，分享，自动全文阅读，不登录查看全部评论
// @namespace Zeko Scripts
// @match *://blog.csdn.net/*
// @grant none
// @description 去除CSDN页面广告，推荐信息，分享信息，关联文章，默认全部展开，无需登录可查看全部评论
// @author zeko zhang
// @version 1.0.5
// @icon https://csdnimg.cn/public/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/389219/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%8E%A8%E8%8D%90%EF%BC%8C%E5%88%86%E4%BA%AB%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%EF%BC%8C%E4%B8%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E5%85%A8%E9%83%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/389219/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%8E%A8%E8%8D%90%EF%BC%8C%E5%88%86%E4%BA%AB%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%EF%BC%8C%E4%B8%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E5%85%A8%E9%83%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

var bbsInterval = 500;
var bbsTimeout = 5000;

$(() => {
  var clearFunc = function () {
        // 删除左侧边栏广告
        $("div[class='csdn-tracking-statistics mb8 box-shadow']").remove();
        // 删除热门文章
        $("#asideHotArticle").remove();
        // 删除左侧边栏下部广告和关于信息
        $("#asideFooter").remove();
        // 删除紧跟正文下的广告
        $("#dmp_ad_58").remove();
        // 删除相关文章推荐
        $(".recommend-box").remove();
        // 删除分享提示
        $("#shareSuggest").remove();
        // 删除VIP，客服，投诉悬浮窗
        $(".csdn-side-toolbar").remove();
        // 删除自定义共同进步
        $("div[id^='asideCustom']").remove();
        // 删除点击阅读更多
        $("div[class='hide-article-box hide-article-pos text-center']").remove();
        // 打开阅读更多页面
        $("#article_content").removeAttr("style");
        // 清除其它迁入的iframe
        $("iframe").remove();
        // google广告块
        $("ins").remove();
        // 展开全部评论
        $(".comment-list-box").removeAttr("style");
        // 删除登录展开全部
        $("div[class='opt-box text-center']").remove();
        // 删除提示登录Mask
        $(".login-mark").remove();
        // 删除提示登录二维码
        $("#passportbox").remove();
  }
  
  clearFunc();
  
  var clearJob = setInterval(function () {
        clearFunc();
    }, bbsInterval);
  
  setTimeout(function () {
      clearInterval(clearJob);
  }, bbsTimeout);
})