// ==UserScript==
// @name              云栖VIP解析助手【简单无后门】（爱奇艺腾讯等视频网VIP视频解析。音乐下载，智能影院全网搜片（支持pc和手机），临时邮箱/手机号，office安装/激活/辅助，全球直播，小学生辅助等及各种工具教程）
// @namespace         https://www.yq52.cn
// @version           2.0
// @icon              https://www.yq52.cn/img/favicon.ico
// @description       万能全网一键VIP视频解析，免设置，傻瓜式操作。全面支持各大影视平台VIP视频解析，去广告，免会员！（爱奇艺、腾讯、优酷、乐视网、芒果TV、土豆、搜狐视频、bilibili、PPTV、暴风、音悦台等）。同时，集免费工具一体的导航网站，包括免费音乐下载，智能影院（跨平台支持pc和手机），网盘资源搜索/速度破解，临时邮箱/手机（临时接收需求），WIN和office安装包，U盘系统工具，系统和办公软件激活工具，全球电视台直播，日常办公辅助工具（office，pdf，图片，图床等等），小学生学习辅助工具（数学练习测验，拼音听写助手等），各种技术教程等等——云栖影院VIP视频解析助手。云栖导航（www.yq52.cn/nav），不定时更新实用小工具，各位用友请收藏关注，才不会迷路哦！
// @author            feng52072
// @license           MIT
// @supportURL        https://www.yq52.cn/nav
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
// @match             *://*.bilibili.com/video/*
// @match             *://*.bilibili.com/anime/*
// @match             *://*.bilibili.com/bangumi/play/*
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
// @downloadURL https://update.greasyfork.org/scripts/425991/%E4%BA%91%E6%A0%96VIP%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B%E3%80%90%E7%AE%80%E5%8D%95%E6%97%A0%E5%90%8E%E9%97%A8%E3%80%91%EF%BC%88%E7%88%B1%E5%A5%87%E8%89%BA%E8%85%BE%E8%AE%AF%E7%AD%89%E8%A7%86%E9%A2%91%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%82%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%99%BA%E8%83%BD%E5%BD%B1%E9%99%A2%E5%85%A8%E7%BD%91%E6%90%9C%E7%89%87%EF%BC%88%E6%94%AF%E6%8C%81pc%E5%92%8C%E6%89%8B%E6%9C%BA%EF%BC%89%EF%BC%8C%E4%B8%B4%E6%97%B6%E9%82%AE%E7%AE%B1%E6%89%8B%E6%9C%BA%E5%8F%B7%EF%BC%8Coffice%E5%AE%89%E8%A3%85%E6%BF%80%E6%B4%BB%E8%BE%85%E5%8A%A9%EF%BC%8C%E5%85%A8%E7%90%83%E7%9B%B4%E6%92%AD%EF%BC%8C%E5%B0%8F%E5%AD%A6%E7%94%9F%E8%BE%85%E5%8A%A9%E7%AD%89%E5%8F%8A%E5%90%84.user.js
// @updateURL https://update.greasyfork.org/scripts/425991/%E4%BA%91%E6%A0%96VIP%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B%E3%80%90%E7%AE%80%E5%8D%95%E6%97%A0%E5%90%8E%E9%97%A8%E3%80%91%EF%BC%88%E7%88%B1%E5%A5%87%E8%89%BA%E8%85%BE%E8%AE%AF%E7%AD%89%E8%A7%86%E9%A2%91%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%82%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%99%BA%E8%83%BD%E5%BD%B1%E9%99%A2%E5%85%A8%E7%BD%91%E6%90%9C%E7%89%87%EF%BC%88%E6%94%AF%E6%8C%81pc%E5%92%8C%E6%89%8B%E6%9C%BA%EF%BC%89%EF%BC%8C%E4%B8%B4%E6%97%B6%E9%82%AE%E7%AE%B1%E6%89%8B%E6%9C%BA%E5%8F%B7%EF%BC%8Coffice%E5%AE%89%E8%A3%85%E6%BF%80%E6%B4%BB%E8%BE%85%E5%8A%A9%EF%BC%8C%E5%85%A8%E7%90%83%E7%9B%B4%E6%92%AD%EF%BC%8C%E5%B0%8F%E5%AD%A6%E7%94%9F%E8%BE%85%E5%8A%A9%E7%AD%89%E5%8F%8A%E5%90%84.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle('.h-icon-play {color: #f47920;fill: #f47920;height: 80px;width: 80px;position: fixed;z-index: 99999;top: 60px;left: 12px;cursor: pointer;}  .h-ol {position: fixed;top: 250px;left: 20px;z-index: 99999;counter-reset: li;list-style: none;font-size: 14px;padding: 0;margin-bottom: 4em;text-shadow: 0 1px 0 rgba(255, 255, 255, .5);display: none;}  .h-ol a {position: relative;display: block;padding: 3px 10px 3px 2em;margin: 0.5em 0;background: #ddd;color: #444;text-decoration: none;border-radius: 0.3em;transition: all 0.3s ease-out;}  .h-ol a:hover {background: #eee;color: #ff6f5c;transition: all 0.3s ease-out;}  .h-ol a::before {content: counter(li);counter-increment: li;position: absolute;left: -1.2em;top: 50%;margin-top: -1.2em;background: #87ceeb;height: 2em;width: 2em;line-height: 2em;border: 0.2em solid #fff;text-align: center;font-weight: bold;border-radius: 2em;}');

  let api = [
    {name: '云栖影院', url: 'https://www.yq52.cn/jx?url='}];


  let main = {
    showButton: function () {
      if (location.host.match(/youku|iqiyi|le|qq|tudou|mgtv|sohu|acfun|bilibili|pptv|baofeng|yinyuetai/ig)) {
        let mainButton = '<div class="h-icon-play" title="云栖助手【一键解析视频】"><svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"></path></svg></div>';
        let apiList = '<ol class="h-ol"></ol>';

        $(top.document.body).append(mainButton);
        $(top.document.body).append(apiList);

        api.forEach((val, index) => {
        $('.h-ol').append(`<li><a target="_blank" href="${val.url + encodeURI(location.href)}">${val.name}</a></li>`)
        });
        $(top.document.body).on('click', '.h-icon-play', () => {
           var url='https://www.yq52.cn/nav/windowns.html';                             //转向网页的地址;
           var name='提示';                            //网页名称，可为空;
           var iWidth=400;                          //弹出窗口的宽度;
           var iHeight=600;                         //弹出窗口的高度;
           //获得窗口的垂直位置
           var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
           //获得窗口的水平位置
           var iLeft = (window.screen.availWidth - 30 - iWidth) / 2;

           window.open("https://www.yq52.cn/nav/windowns.html", "_blank",'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,location=no')
           var JK="https://www.yq52.cn/jx?url=";
           window.location.href=JK+window.location.href;
        });
      }
    }
  };

  $(function () {
    main.showButton();
  });
})();
