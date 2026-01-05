// ==UserScript==
// @name        Smart Header for Zhihu
// @namespace   org.sorz.lab.zhihu
// @include     http://www.zhihu.com/*
// @version     0.2
// @grant       none
// @description 根据页面滚动，自动隐藏及显示知乎顶栏。
// @downloadURL https://update.greasyfork.org/scripts/13445/Smart%20Header%20for%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/13445/Smart%20Header%20for%20Zhihu.meta.js
// ==/UserScript==

$(document).ready(function() {
  var $header = $('.zu-top');
  var headerHeight = $header.outerHeight() + 3;
  
  var refPos = $(document).scrollTop();
  var headerPos = 0;
  
  function isHidden() {
    return headerPos <= -headerHeight;
  }
  
  function isShown() {
    return headerPos >= 0;
  }
  
  $(window).scroll(function() {
    var scroll = $(document).scrollTop() - refPos;
    if (Math.abs(scroll) > headerHeight) {
      var oldHeaderPos = headerPos;
      headerPos = scroll > 0 ? -headerHeight : 0;
      if (headerPos != oldHeaderPos)
        $header.animate({top: headerPos + 'px'}, 200);
      refPos = $(document).scrollTop();
      return;
    }
    
    if ((scroll > 0 && !isHidden()) || (scroll < 0 && !isShown())) {
      headerPos = scroll > 0 ? -scroll : -headerHeight - scroll;
      $header.css('top', headerPos + 'px');
    } else {
      refPos = $(document).scrollTop();
    }
  });
});