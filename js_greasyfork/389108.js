// ==UserScript==
// @name        龙空-图片显示
// @description 修复部分图片不能正常显示的问题
// @namespace   https://greasyfork.org/users/329519
// @version     0.1.1
// @match       *://lkong.cn/*
// @match       *://www.lkong.net/thread*
// @require     https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @author      eaudouce
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/389108/%E9%BE%99%E7%A9%BA-%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/389108/%E9%BE%99%E7%A9%BA-%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
  'use strict';
  //console.log('start '+location.href);
  var href=location.href, timer;

  var loadImg = function(){
    //console.log('reload image');
    var imgs=href.indexOf('.cn')>0?$('.inthread img'):$('.t_f img'), str;
    //imgs.attr('referrerpolicy','no-referrer');

    imgs.each(function(i,value){
      //console.log(value.src);
      if(value.src.indexOf('lkong.cn') > 0) return;
      // 路过图床图片链接，非图片真实地址
      if(value.src.indexOf('imgchr.com/i/') > 0) {
        $(this).attr('href', value.src).attr('src', '//s2.ax1x.com/2019/09/25/uZ22xH.jpg').attr('alt','点击看图');
        $(this).on('click', function(){
          window.open($(this).attr('href'));
        });
        return;
      }
      // 新浪图床
      str = value.src.replace(/ws(\d+)\.sinaimg\.cn/i, 'ww$1.sinaimg.cn').replace('https:','');
      //console.log(str);
      $(this).attr('referrerpolicy','no-referrer').attr('src',str);
    });
  };

  var imgchr = function(e){
    var t=e.target||e.srcElement;
    console.log($(t.document));
  };

  if(href.indexOf('.net') > 0) {
    loadImg();
  } else {
    if(href.indexOf('thread') > 0) {
      $('#lkong_content').bind('DOMNodeInserted', function(e){
        console.log('change #lkong_content');
        if(timer) clearTimeout(timer);
        timer = setTimeout(loadImg, 500);
      });
    }
    $('#lkong_pane').bind('DOMNodeInserted', function(e){
      //console.log('change #lkong_pane');
      if(timer) clearTimeout(timer);
      timer = setTimeout(loadImg, 500);
    });
  }

})();