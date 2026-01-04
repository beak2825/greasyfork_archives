// ==UserScript==
// @name              解析各大视频网站VIP视频，支持优酷，爱奇艺，乐视，腾讯视频，土豆，芒果TV，bilibili，PPTV，暴风，音悦台
// @namespace         elon musk
// @version           1.1.1
// @icon              https://gw.alicdn.com/tfs/TB1ZvwSycbpK1RjSZFyXXX_qFXa-48-48.ico
// @description       【不能解析请换线路，或者去公众号获取资源】解析各大视频网站VIP视频，支持优酷，爱奇艺，乐视，腾讯视频，土豆，芒果TV，bilibili，PPTV，暴风，音悦台
// @author            syhyz1990
// @license           MIT
// @supportURL        https://github.com/syhyz1990/media
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
// @downloadURL https://update.greasyfork.org/scripts/394288/%E8%A7%A3%E6%9E%90%E5%90%84%E5%A4%A7%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99VIP%E8%A7%86%E9%A2%91%EF%BC%8C%E6%94%AF%E6%8C%81%E4%BC%98%E9%85%B7%EF%BC%8C%E7%88%B1%E5%A5%87%E8%89%BA%EF%BC%8C%E4%B9%90%E8%A7%86%EF%BC%8C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%EF%BC%8C%E5%9C%9F%E8%B1%86%EF%BC%8C%E8%8A%92%E6%9E%9CTV%EF%BC%8Cbilibili%EF%BC%8CPPTV%EF%BC%8C%E6%9A%B4%E9%A3%8E%EF%BC%8C%E9%9F%B3%E6%82%A6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394288/%E8%A7%A3%E6%9E%90%E5%90%84%E5%A4%A7%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99VIP%E8%A7%86%E9%A2%91%EF%BC%8C%E6%94%AF%E6%8C%81%E4%BC%98%E9%85%B7%EF%BC%8C%E7%88%B1%E5%A5%87%E8%89%BA%EF%BC%8C%E4%B9%90%E8%A7%86%EF%BC%8C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%EF%BC%8C%E5%9C%9F%E8%B1%86%EF%BC%8C%E8%8A%92%E6%9E%9CTV%EF%BC%8Cbilibili%EF%BC%8CPPTV%EF%BC%8C%E6%9A%B4%E9%A3%8E%EF%BC%8C%E9%9F%B3%E6%82%A6%E5%8F%B0.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function addDiv(){
        var div = document.createElement("div");
        div.innerHTML = "点我查看电影资源公众号（直接提供百度云以及磁力链接）";
        var css = "position:fixed;top:160px;left:20px;z-index:999999999;width:360px;height:32px;line-height:32px;text-align:center;font-size:10px;background:#fff;font-family:Verdana, Arial, '宋体';font-weight:500;color:white;background-color:#f44336;user-select:none;padding:0px;white-space:nowrap;border-radius:3px;border:1px solid #f44336;cursor:pointer;";
        div.style.cssText = css;
        if(window.self === window.top){ document.body.appendChild(div);}
        div.addEventListener("click",function(){
            let url = window.location.href;
            url = 'http://www.dianyingso.xyz/wp-content/uploads/2019/12/qrcode_for_gh_e1040d1e3da5_258.jpg';
            window.open(url, "_blank");});
   }
   addDiv();
})();


(function () {
  'use strict';

  GM_addStyle('.h-icon-play {color: #d926b5;fill: #d926b5;height: 80px;width: 80px;position: fixed;z-index: 99999;top: 180px;left: 0;cursor: pointer;}  .h-ol {position: fixed;top: 250px;left: 20px;z-index: 99999;counter-reset: li;list-style: none;font-size: 14px;padding: 0;margin-bottom: 4em;text-shadow: 0 1px 0 rgba(255, 255, 255, .5);display: none;}  .h-ol a {position: relative;display: block;padding: 3px 10px 3px 2em;margin: 0.5em 0;background: #ddd;color: #444;text-decoration: none;border-radius: 0.3em;transition: all 0.3s ease-out;}  .h-ol a:hover {background: #eee;color: #ff6f5c;transition: all 0.3s ease-out;}  .h-ol a::before {content: counter(li);counter-increment: li;position: absolute;left: -1.2em;top: 50%;margin-top: -1.2em;background: #87ceeb;height: 2em;width: 2em;line-height: 2em;border: 0.2em solid #fff;text-align: center;font-weight: bold;border-radius: 2em;}');

  let api = [
    {name: '20191227可用解析一', url: 'https://z1.m1907.cn/?jx='},
    {name: '20191227可用解析二', url: 'https://beaacc.com/api.php?url='},
	{name: '思古解析', url: 'https://api.bbbbbb.me/jx/?url='}
	];


  let main = {
    showButton: function () {
      if (location.host.match(/youku|iqiyi|le|qq|tudou|mgtv|sohu|acfun|bilibili|pptv|baofeng|yinyuetai/ig)) {
        let mainButton = '<div class="h-icon-play" title="点击显示解析地址"><svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"></path></svg></div>';
        let apiList = '<ol class="h-ol"></ol>';
        let github = '<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=media&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 110px;padding: 0 5px;box-sizing: border-box;margin-top: 10px;"></iframe>';

        $(top.document.body).append(mainButton);
        $(top.document.body).append(apiList);

        api.forEach((val, index) => {
          $('.h-ol').append(`<li><a target="_blank" href="${val.url + encodeURI(location.href)}">${val.name}</a></li>`)
        });
        //反馈按钮
        $('.h-ol').append(`<li><a target="_blank" style="color: #999;" href="https://github.com/syhyz1990/media/issues">点击反馈</a></li>`);
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