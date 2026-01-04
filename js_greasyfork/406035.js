// ==UserScript==
// @name              知YOU视频VIP解析
// @namespace         https://github.com/hackerlengyue
// @version           2.0.0
// @icon              https://gw.alicdn.com/tfs/TB1ZvwSycbpK1RjSZFyXXX_qFXa-48-48.ico
// @description       解析各大视频网站VIP视频，支持优酷，爱奇艺，乐视，腾讯视频，土豆，芒果TV
// @author            hackerlengyue
// @license           MIT
// @supportURL        https://github.com/hackerlengyue
// @match             *://v.youku.com/v_*
// @match             *://m.youku.com/v*
// @match             *://m.youku.com/a*
// @match             *://*.iqiyi.com/v_*
// @match             *://*.iqiyi.com/w_*
// @match             *://*.iqiyi.com/a_*
// @match             *://*.iqiyi.com/dianying/*
// @match             *://*.le.com/ptv/vplay/*
// @match             *v.qq.com/x/cover/*
// @match             *v.qq.com/x/page/*
// @match             *v.qq.com/play*
// @match             *://*.tudou.com/listplay/*
// @match             *://*.tudou.com/albumplay/*
// @match             *://*.tudou.com/programs/view/*
// @match             *://*.mgtv.com/b/*
// @match             *://film.sohu.com/album/*
// @match             *://tv.sohu.com/*
// @match             *://vip.pptv.com/show/*
// @match             *://v.pptv.com/show/*
// @match             *://*.baofeng.com/play/*
// @match             *://v.yinyuetai.com/video/*
// @match             *://v.yinyuetai.com/playlist/*
// @match             *://vip.1905.com/play/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406035/%E7%9F%A5YOU%E8%A7%86%E9%A2%91VIP%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/406035/%E7%9F%A5YOU%E8%A7%86%E9%A2%91VIP%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle('.h-icon-play {color: #d926b5;fill: #d926b5;height: 80px;width: 80px;position: fixed;z-index: 99999;top: 0px;left: 0;cursor: pointer;}  .h-ol {position: fixed;top: 30px;left: 20px;z-index: 99999;counter-reset: li;list-style: none;font-size: 8px;padding: 0;margin-bottom: 2em;text-shadow: 0 1px 0 rgba(255, 255, 255, .5);display: none;}  .h-ol a {position: relative;display: block;padding: 3px 10px 3px 2em;margin: 0.5em 0;background: #ddd;color: #444;text-decoration: none;border-radius: 0.3em;transition: all 0.3s ease-out;}  .h-ol a:hover {background: #eee;color: #ff6f5c;transition: all 0.3s ease-out;}  .h-ol a::before {content: counter(li);counter-increment: li;position: absolute;left: -1.2em;top: 50%;margin-top: -1.2em;background: #87ceeb;height: 2em;width: 2em;line-height: 2em;border: 0.2em solid #fff;text-align: center;font-weight: bold;border-radius: 2em;}');

  let api = [              
{"name":"蓝光1","url":"https://jx.iztyy.com/svip/?url="},                                  
{"name":"蓝光2","url":"https://jx.m3u8.tv/jiexi/?url="},                             
{"name":"高清1","url":"https://api.jiexi.la/?url="},      
{"name":"高清2","url":"https://www.playm3u8.cn/jiexi.php?url="},                                      
{"name":"高清3","url":"https://www.ckmov.vip/api.php?url="},];

  let main = {
    showButton: function () {
      if (location.host.match(/youku|iqiyi|le|qq|tudou|mgtv|sohu|acfun|bilibili|pptv|baofeng|yinyuetai/ig)) {
        let mainButton = '<div class="h-icon-play" title="Click show resolve address"><svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"></path></svg></div>';
        let apiList = '<ol class="h-ol"></ol>';
        let github = '<iframe src="https://greasyfork.org/zh-CN/users/704106&repo=media&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 110px;padding: 0 5px;box-sizing: border-box;margin-top: 10px;"></iframe>';

        $(top.document.body).append(mainButton);
        $(top.document.body).append(apiList);

        api.forEach((val, index) => {
          $('.h-ol').append(`<li><a target="_blank" href="${val.url + encodeURI(location.href)}">${val.name}</a></li>`)
        });
        //Feedback button
        $('.h-ol').append(`<li><a target="_blank" style="color: #999;" href="https://greasyfork.org/zh-CN/users/">失效请留言</a></li>`);
        $('.h-ol').append(github);

        $(top.document.body).on('click', '.h-icon-play', () => {
          $('.h-ol').fadeToggle('fast');
        });
      }
    }
  };

  $(function () {
    main.showButton();
  });
})();
