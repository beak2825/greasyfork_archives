// ==UserScript==
// @name              长期更新，主要解析腾讯，优酷，爱奇艺会员视频，vip视频
// @namespace         https://greasyfork.org/zh-CN/users/704106
// @version           6.6
// @description       长期更新，解析腾讯，优酷，爱奇艺等会员视频，vip视频
// @antifeature      解析网站中广告与脚本无关，具体看简介
// @author            jlmf
// @license           AGPL License
// @supportURL        https://greasyfork.org/zh-CN/users/704106
// @include            *://v.youku.com/v_*
// @include             *://m.youku.com/v*
// @include             *://m.youku.com/a*
// @include             *://*.iqiyi.com/v_*
// @include            *://*.iqiyi.com/w_*
// @include             *://*.iqiyi.com/a_*
// @include             *://*.iqiyi.com/dianying/*
// @include            *://*.le.com/ptv/vplay/*
// @include             *v.qq.com/x/cover/*
// @include             *v.qq.com/x/page/*
// @include             *v.qq.com/play*
// @include             *://pan.baidu.com/*
// @include             *://*.tudou.com/listplay/*
// @include             *://*.tudou.com/albumplay/*
// @include             *://*.tudou.com/programs/view/*
// @include             *://*.mgtv.com/b/*
// @include             *://film.sohu.com/album/*
// @include             *://tv.sohu.com/*
// @include             *://*.bilibili.com/video/*
// @include             *://*.bilibili.com/anime/*
// @include             *://*.bilibili.com/bangumi/play/*
// @include             *://vip.pptv.com/show/*
// @include             *://v.pptv.com/show/*
// @include             *://*.baofeng.com/play/*
// @include             *://v.yinyuetai.com/video/*
// @include             *://v.yinyuetai.com/playlist/*
// @include             *://vip.1905.com/play/*
// @require             https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require             https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @require             https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/qrcodejs/1.0.0/qrcode.js
// @require             https://greasyfork.org/scripts/454236-findandreplacedomtext-huahuacat/code/findAndReplaceDOMText-huahuacat.js?version=1112990
// @run-at             document-idle
// @grant              unsafeWindow
// @grant              GM_addStyle
// @grant              GM_setValue
// @grant              GM_getValue
// @charset	       UTF-8   
// @downloadURL https://update.greasyfork.org/scripts/418436/%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E4%B8%BB%E8%A6%81%E8%A7%A3%E6%9E%90%E8%85%BE%E8%AE%AF%EF%BC%8C%E4%BC%98%E9%85%B7%EF%BC%8C%E7%88%B1%E5%A5%87%E8%89%BA%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%EF%BC%8Cvip%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/418436/%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E4%B8%BB%E8%A6%81%E8%A7%A3%E6%9E%90%E8%85%BE%E8%AE%AF%EF%BC%8C%E4%BC%98%E9%85%B7%EF%BC%8C%E7%88%B1%E5%A5%87%E8%89%BA%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%EF%BC%8Cvip%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function () {
  'use strict';
  GM_addStyle('.h-icon-play {color: #919191;fill: #919191;height: 90px;width: 90px;position: fixed;z-index: 99999;top: 0px;left: 0;cursor: pointer;}  .h-ol {position: fixed;top: 15px;left: 10px;z-index: 99999;counter-reset: li;list-style: none;font-size: 10px;padding: 0;margin-bottom: 2em;text-shadow: 0 1px 0 rgba(255, 255, 255, .5);display: none;}  .h-ol a {position: relative;display: block;padding: 3px 20px 3px 2em;margin: 0.3em 0;background: #ddd;color: #444;text-decoration: none;border-radius: 0.3em;transition: all 0.3s ease-out;}  .h-ol a:hover {background: #eee;color: #ff6f5c;transition: all 0.3s ease-out;}  .h-ol a::before {content: counter(li);counter-increment: li;position: absolute;left: -1.2em;top: 50%;margin-top: -1.2em;background: #87ceeb;height:2.3em;width: 2.3em;line-height: 2em;border: 0.2em solid #fff;text-align: center;font-weight: bold;border-radius: 2em;}');
  let api = [
{"name":"bl","url":"https://vip.bljiex.com/?v="},
{"name":"七哥","url":"https://jx.nnxv.cn/tv.php?url="},
{"name":"视频流","url":"https://jx.m3u8.tv/jiexi/?url="}, 
{"name":"CK","url":"https://www.ckplayer.vip/jiexi/?url="},
{"name":"解析la","url":"https://api.jiexi.la/?url="},
{"name":"夜幕","url":"https://www.yemu.xyz/?url="},
{"name":"新1970","url":"https://im1907.top/?jx="},
{"name":"偶像","url":"https://jx.aidouer.net/?url="},
{"name":"虾米","url":"https://jx.xmflv.com/?url="},
{"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url="},
{"name":"mmkv","url":"https://jx.mmkv.cn/tv.php?url="},
{"name": "猪蹄","url": "https://jx.iztyy.com/Bei/?url="},
{"name":"1717yun","url":"https://www.1717yun.com/jx/ty.php?url="},
{"name":"nxflv","url":"https://www.nxflv.com/?url="},
{"name":"ckmov","url":"https://www.ckmov.com/?url="},
{"name":"JSON","url":"https://jx.jsonplayer.com/player/?url="},
{"name":"新Parwix","url":"https://jx.bozrc.com:4433/player/?url="},
{"name":"OK解析","url":"https://okjx.cc/?url="},  
{"name":"B站4","url":"https://jx.yparse.com/index.php?url="},
{"name":"JY视频","url":"https://jx.playerjy.com/?url="},
{"name":"主页","url":"https://greasyfork.org/zh-CN/scripts/418436?url="},];
  jQuery('.btn_close').trigger('click');
  let main = {
    showButton: function () {
      if(jQuery('.h-icon-play').length > 0){
        return
      }
      if (location.host.match(/youku|iqiyi|le|qq|tudou|baidu|mgtv|sohu|acfun|bilibili|pptv|baofeng|yinyuetai/ig)) {
        let mainButton = '<div class="h-icon-play" title="解析接口"><svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"></path></svg></div>';
        let apiList = '<ol class="h-ol"></ol>';
        (function () {
          jQuery("body").on('click', '.h-ol a', function (e) {
            let objfj = jQuery(this), href = objfj.attr('href') || objfj.data("href");
            window.open(href + encodeURI(location.href));
          })
        })();
       
        jQuery(document.body).append(mainButton);
        jQuery(document.body).append(apiList);

       let fragment = document.createDocumentFragment();
        api.forEach((val, index) => {
          jQuery(fragment).append(`<li><a target="_blank" href="${val.url}">${val.name}</a></li>`)
        });
        jQuery('.h-ol').append(fragment);
        let lock = false;
        jQuery(document.body).on('click', '.h-icon-play', function () {
          if (lock) {
            console.log('hide');
            jQuery('.h-ol').hide();
            lock = false;
          } else {
            console.log('show');
            jQuery('.h-ol').show();
            lock = true;
          }

        });
      }
    }
  };

  jQuery(function () {
    main.showButton();
  });

})();
