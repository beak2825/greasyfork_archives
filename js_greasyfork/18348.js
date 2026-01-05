// ==UserScript==
// @name           Yinyuetai
// @author         hyk
// @namespace      bengda@outlook.com
// @description    免积分，免登录，既可观看、下载高清MV
// @version        1.1.9
// @create         2016-03-28
// @lastmodified   2016-06-03
// @lastmodified   2016-12-23
// @lastmodified   2017-01-05
// @lastmodified   2017-02-21
// @include        http://v.yinyuetai.com/video/*
// @copyright      2016+, hyk
// @grant		GM_addStyle
// @grant		GM_xmlhttpRequest
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_registerMenuCommand
// @run-at  document-start
// @icon		http://www.yinyuetai.com/favicon.ico
// @updatelog [2017-02-23] h5播放器可直接播放会员视频。h5播放器默认最高画质播放
// @updatelog [2017-01-05] 自动跳转到官方h5播放页面
// @updatelog [2016-11-13]  解决音悅台页面改变后脚本失效。重写了代码。以前代码好糟糕，现在的代码照样还是很糟糕 -_-||
//                         /*不再支持悅单列表(没有意义)*/
// @updatelog [2016-06-03] 将鼠标悬浮视频预览改为鼠标点击显示，并可快速聚焦到正在播放的项
// @downloadURL https://update.greasyfork.org/scripts/18348/Yinyuetai.user.js
// @updateURL https://update.greasyfork.org/scripts/18348/Yinyuetai.meta.js
// ==/UserScript==
//======= 禁止商业用途 ===========//
//======= 禁止商业用途 ===========//
//======= 禁止商业用途 ===========//
//======== start =================//
var Yyt = function () {
  this.version = '1.1.9';
  this.author = 'hyk';
  var resResult = new RegExp(/http:\/\/v\.yinyuetai\.com\/video\/(\d+).*|http:\/\/v\.yinyuetai\.com\/video\/h5\/(\d+).*/, 'g').exec(window.location.href);
  this.Vid = resResult[1] || resResult[2];
  /* api from 跳过网站等待、验证码及登录[author:Jixun.Moe] 
   * https://greasyfork.org/zh-CN/scripts/2600-%E8%B7%B3%E8%BF%87%E7%BD%91%E7%AB%99%E7%AD%89%E5%BE%85-%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8F%8A%E7%99%BB%E5%BD%95
  */
  /*支持会员视频*/
  this.api = 'http://www.yinyuetai.com/insite/get-video-info?json=true&videoId=' + this.Vid;
  //this.api='http://ext.yinyuetai.com/main/get-h-mv-info?json=true&videoId='+this.Vid;// + Vid
  this.wrapper = '#Yyt_user_script_' + Date.now();
  this.enableH5Play = (GM_getValue('enableH5Play') == undefined ? true : GM_getValue('enableH5Play')); //默认重定向至官方h5播放页面;
  if (this.enableH5Play)
  this.redirectToH5();
  setTimeout(function () {
    this.initView()
  }.bind(this), 1000);
  //this.initEvent();
  this.style();
  this.enableH5PlaySet();
}
Yyt.prototype.redirectToH5 = function () {
  //启用官方htm5播放
  var url = location.href;
  if (/^http:\/\/v\.yinyuetai.com\/video\/\d+/.test(url)) {
    url = url.replace(/(^http:\/\/v.yinyuetai.com\/video\/)(\d+\S*$)/, '$1h5/$2');
    location.href = url;
  }
}
Yyt.prototype.enableH5PlayHandler = function () {
  var f = this.enableH5Play;
  this.enableH5Play = !f;
  GM_setValue('enableH5Play', this.enableH5Play);
  location.reload();
}
Yyt.prototype.enableH5PlaySet = function () {
  var f = this.enableH5Play;
  var str = [
    '启用音悦台h5播放',
    '禁用音悦台h5播放'
  ];
  GM_registerMenuCommand(str[Number(f)], this.enableH5PlayHandler.bind(this));
}
Yyt.prototype.initView = function () {
  var $this = this;
  GM_xmlhttpRequest({
    url: $this.api,
    method: 'get',
    onload: function (y) {
      var r = JSON.parse(y.responseText);
      var aVideoUrlModels = r.videoInfo.coreVideoInfo.videoUrlModels;
      $this.data = aVideoUrlModels;
      var YytELe = document.createElement('div');
      var videoUrlEle = aVideoUrlModels.map(function (item, i) {
        return '<a href="' + item.videoUrl + '" class="vUrl vUrl_' + item.qualityLevel + '">' + item.qualityLevelName + '</a>';
      });
      YytELe.setAttribute('id', $this.wrapper.split('#') [1]);
      YytELe.innerHTML = '<span class="aside"></span><div class="Yyt_user_script_wrapper">' + videoUrlEle.join('') + '</div>'
      document.body.appendChild(YytELe);
      if(unsafeWindow.isH5)
         $this.initEvent();
    }
  });
}
Yyt.prototype.initEvent = function () {
  var $this = this;
  var timer = null;
  var tickerCount = 0;
  timer = setInterval(function () {
    tickerCount++;
    if (unsafeWindow.$ || unsafeWindow.jQuery) {
      console.log('可以使用jQuery', window);
      var $ = unsafeWindow.jQuery;
      var targetEle = $('#vPlay');
      if (targetEle.find('.vp-resolution-menu-ul li') && targetEle.find('.vp-resolution-menu-ul li').length > 0) {
        var sh = $this.data.filter(function (item) {return item.qualityLevel === 'sh'; });
        if (sh.length > 0) {
          var shEle = $('<li data-url="' + (sh[0].videoUrl) + '" class="vp-resolution-menu-li" data-index="' + (targetEle.find('.vp-resolution-menu-ul li').length) + '"><span class="vp-resolution-menu-li-text">' + (sh[0].qualityLevelName) + '</span></li>');
          targetEle.find('.vp-resolution-menu-ul').prepend(shEle);
          targetEle.find('.vp-resolution-menu').css('top', '-' + (targetEle.find('.vp-resolution-menu-ul li').length * 30) + 'px');
          document.querySelectorAll('.vp-resolution-menu-ul li') [0].addEventListener('click', function (e) {
            var currentTime = document.querySelector('#video').currentTime;
            targetEle.find('.vp-resolution-basebar-text').text($(this).text());
            $('#video').attr('src', $(this).data('url'));
            document.querySelector('#video').currentTime = currentTime;
          });
        }
        targetEle.find('.vp-resolution-menu-ul li').first().trigger('click');
        clearInterval(timer);
      }
    }
    if (tickerCount >= 20) clearInterval(timer);
  }, 300);
}
Yyt.prototype.style = function () {
  var css = this.wrapper + '{position:absolute;left:0;top:632px;font-size: 14px;transition: width 0.5s;width: 8px;height: 28px;background-color: #333;z-index: 99999;}              '
  + this.wrapper + ' .aside{display: inline-block;height: 100%;width: 8px;background-color: #27d5bf;}              '
  + this.wrapper + ':hover{width: 260px;}              '
  + this.wrapper + ':hover .aside{display: none;}              '
  + this.wrapper + ' .Yyt_user_script_wrapper{display: none;}              '
  + this.wrapper + ':hover .Yyt_user_script_wrapper{width: 100%;overflow: hidden;display: flex;justify-content: center;align-items: center;height: 28px;}              '
  + this.wrapper + ' .Yyt_user_script_wrapper .vUrl{font-size: 1em;text-align: center;text-decoration: none;color: #fff;line-height: 22px;border-right: 1px solid #444;flex: 1;}              '
  + this.wrapper + ' .Yyt_user_script_wrapper .vUrl:last-child{border-right: none;}              '
  + this.wrapper + ' .Yyt_user_script_wrapper .vUrlvisited{color: #666;}              '
  + this.wrapper + ' .Yyt_user_script_wrapper .vUrl:hover{text-decoration: underline;color: #27d5bf;}';
  GM_addStyle(css);
}
new Yyt();
//==============================================================================//
//                                                                              //
//                                                                              //
//          ==      ==         ===        ===      ===        ===              //
//          ==      ==           ==       = =          ==       ===                //
//          == ====            ==     ==            == == ==                  //
//          == ====             == ==               == ===                     //
//          ==      ==               ==                   ==   ===                  //
//          ==      ==               ==                  ===     ====             //
//                                                                                                 //
//==============================================================================//
