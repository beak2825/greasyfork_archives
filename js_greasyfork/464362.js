// ==UserScript==
// @name              全网VIP视频解析【免登录去除广告】长期更新
// @namespace         https://ichen.ink/
// @version           1.0.8
// @icon              https://ichen.ink/-/assets/img/logo/VIP.ico
// @description       全网VIP视频解析【免登录去除广告】，放心使用长期更新。支持：爱优腾芒、B站等其它网站
// @author            阿晨
// @supportURL        https://look.ichen.ink/
// @match             *://v.youku.com/v_*
// @match             *://m.youku.com/v*
// @match             *://m.youku.com/a*
// @match             *://*.iqiyi.com/v_*
// @match             *://*.iqiyi.com/w_*
// @match             *://*.iqiyi.com/a_*
// @match             *://*.iqiyi.com/dianying/*
// @match             *://*.le.com/ptv/vplay/*
// @match             *v.qq.com/x/cover/*
// @match             *v.qq.com/s/cover/*
// @match             *v.qq.com/x/page/*
// @match             *v.qq.com/play*
// @match             *://*.tudou.com/listplay/*
// @match             *://*.tudou.com/albumplay/*
// @match             *://*.tudou.com/programs/view/*
// @match             *://*.mgtv.com/b/*
// @match             *://film.sohu.com/album/*
// @match             *://tv.sohu.com/*
// @match             *://*.acfun.cn/v/*
// @match             *://*.bilibili.com/video/*
// @match             *://*.bilibili.com/anime/*
// @match             *://*.bilibili.com/bangumi/play/*
// @match             *://vip.pptv.com/show/*
// @match             *://v.pptv.com/show/*
// @match             *://*.baofeng.com/play/*
// @match             *://v.yinyuetai.com/video/*
// @match             *://v.yinyuetai.com/playlist/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_addStyle
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/464362/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%90%E5%85%8D%E7%99%BB%E5%BD%95%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E3%80%91%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/464362/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%90%E5%85%8D%E7%99%BB%E5%BD%95%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E3%80%91%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle('.h-icon-play {color: #ff7f50;fill: #ff7f50;height: 80px;width: 80px;position: fixed;z-index: 99999;top: 200px;left: 0;cursor: pointer;}  .h-ol {position: fixed;top: 270px;left: 20px;z-index: 99999;counter-reset: li;list-style: none;font-size: 14px;padding: 0;margin-bottom: 4em;text-shadow: 0 1px 0 rgba(255, 255, 255, .5);display: none;}  .h-ol a {position: relative;display: block;padding: 3px 10px 3px 2em;margin: 0.5em 0;background: #ddd;color: #444;text-decoration: none;border-radius: 0.3em;transition: all 0.3s ease-out;}  .h-ol a:hover {background: #eee;color: #ff6f5c;transition: all 0.3s ease-out;}  .h-ol a::before {content: counter(li);counter-increment: li;position: absolute;left: -1.3em;top: 50%;margin-top: -1.3em;background: #ff0000;height: 2em;width: 2em;line-height: 2em;border: 0.3em solid #fff;text-align: center;font-weight: bold;border-radius: 2em;}');

  let api = ['https://jx.jsonplayer.com/player/?url=', 'https://jx.playerjy.com/?url=', 'https://api.okjx.cc:3389/jx.php?url=', 'https://api.okjx.cc:3389/jx.php?url=', 'https://jx.bozrc.com:4433/player/?url=', 'https://okjx.cc/?url=','https://www.ckplayer.vip/jiexi/?url='];

  function showButton() {
    if (location.host.match(/youku|iqiyi|le|qq|tudou|mgtv|sohu|acfun|bilibili|pptv|baofeng|yinyuetai/ig)) {
      let mainButton = '<div class="h-icon-play" title="点击显示解析地址"><svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"></path></svg></div>';
      let apiList = '<ol class="h-ol"></ol>';
      let github = '<iframe src="https://ghbtns.com/github-btn.html?user=ichenc&repo=vip&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 10px;"></iframe>';

      $(top.document.body).append(mainButton);
      $(top.document.body).append(apiList);

      api.forEach((val, index) => {
        $('.h-ol').append(`<li><a href="${val + encodeURI(location.href)}">线路${index + 1}</a></li>`)
      });

      $('.h-ol').append(github);

      $(top.document.body).on('click', '.h-icon-play', () => {
        $('.h-ol').toggle();
      });
    }
  }

  function init() {
    showButton();
  }

  $(function () {
    init();
  });


})();