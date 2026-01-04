// ==UserScript==
// @name         肉漫屋功能强化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  肉漫屋功能强化：键盘左右控制翻页
// @icon         https://rouman5.com/favicon.ico
// @author       kizj
// @match        *://rouman5.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439315/%E8%82%89%E6%BC%AB%E5%B1%8B%E5%8A%9F%E8%83%BD%E5%BC%BA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/439315/%E8%82%89%E6%BC%AB%E5%B1%8B%E5%8A%9F%E8%83%BD%E5%BC%BA%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...

  $(document).ready(function(){
    var dom = $('.id_pagination___z7IR');
    if (dom.length > 0) {
      $(document).keydown(function(event){
        switch(event.keyCode) {
          case 37:
            var url = dom.eq(0).children().eq(0).attr('href');
            window.open(url,'_self');
            break;
            case 39:
              var url = dom.eq(0).children().eq(2).attr('href');
              window.open(url,'_self');
              break;
          default:
            break;
        } 
      });
    } else {
      return false;
    }
  })
})();

