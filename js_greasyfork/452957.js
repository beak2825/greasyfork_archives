// ==UserScript==
// @name         奇讯视频解析-免费看全网VIP视频及付费电影破解去广告,支持直接搜索。
// @version      1.4.0
// @description  腾讯、爱奇艺、优酷、芒果、乐视、土豆、AcFun、搜狐、PPTV、音悦Tai、bilibili、暴风影音等全网VIP视频付费电影破解去广告.
// @author       none
// @icon         http://mygod.eu.org/favicon.ico
// @include      *://v.youku.com/v_*
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/dianying/*
// @include      *://*.le.com/ptv/vplay/*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/play*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/*
// @include      *://*.acfun.cn/v/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://vip.pptv.com/show/*
// @include      *://v.pptv.com/show/*
// @include      *://*.baofeng.com/play/*
// @include      *://v.yinyuetai.com/video/*
// @include      *://v.yinyuetai.com/playlist/*
// @license      MIT
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/269350
// @downloadURL https://update.greasyfork.org/scripts/452957/%E5%A5%87%E8%AE%AF%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90-%E5%85%8D%E8%B4%B9%E7%9C%8B%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%8F%8A%E4%BB%98%E8%B4%B9%E7%94%B5%E5%BD%B1%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E6%94%AF%E6%8C%81%E7%9B%B4%E6%8E%A5%E6%90%9C%E7%B4%A2%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/452957/%E5%A5%87%E8%AE%AF%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90-%E5%85%8D%E8%B4%B9%E7%9C%8B%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%8F%8A%E4%BB%98%E8%B4%B9%E7%94%B5%E5%BD%B1%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E6%94%AF%E6%8C%81%E7%9B%B4%E6%8E%A5%E6%90%9C%E7%B4%A2%E3%80%82.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let img_paly = 'data:image/png;base64,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';
  let href = window.location.href;
  let title = document.title;
  let titles = ['腾讯', '乐视', '优酷', '爱奇艺', '土豆', 'AcFun', '搜狐', 'PPTV', '音悦Tai', 'bilibili', '芒果', '暴风影音'];
  for (let i = 0; i < titles.length; i++) {
    if (~title.indexOf(titles[i])) {
      let html = `<a href="http://mygod.eu.org/#/?url=${href}" target='_blank'
style='z-index:99999;display:block;position:fixed;left:0;top:250px;text-align:center;border-radius:3px;background:red;padding:5px;' >
        <img src='${img_paly}' height="30px" >
        <div style="color:#fff;">奇讯</div>
      </a>`;
      $("body").append(html);
    }
  }
})();