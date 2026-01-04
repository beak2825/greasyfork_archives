// ==UserScript==
// @name        世界杯直播网页全屏
// @namespace   TestCard
// @description 世界直播网页全屏
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @include     http*://vku.youku.com/*
// @version     1.1
// @grant       none
// @run-at      document_end
// @downloadURL https://update.greasyfork.org/scripts/369555/%E4%B8%96%E7%95%8C%E6%9D%AF%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/369555/%E4%B8%96%E7%95%8C%E6%9D%AF%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(
  function()
  {
    var ivk = function()
    {
      var o = $('.video-playing');
      
      if(o.length > 0)
      {
        var x = $('.video-playing').offset().left;
        var y = $('.video-playing').offset().top;
        
        var ny = $(window).height();
        var nx = ny * 16 / 9;
        var mx = ($(window).width() - nx) / 2;
        
        $('.video-playing').css('position', 'absolute');
        $('.video-playing').css('left', -x + 'px');
        $('.video-playing').css('top', -y + 'px');
        $('.video-playing').css('width', nx + 'px');
        $('.video-playing').css('height', ny + 'px');
        $('.video-playing').css('zIndex', '1');
      }
      else
      {
        return window.setTimeout(ivk, 500);
      }
    }
    
    ivk();
  }
)();
