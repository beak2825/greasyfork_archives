// ==UserScript==
// @name        HPOOL CHIA收益计算
// @namespace   Violentmonkey Scripts
// @match       *://www.hpool.co/statistics/chia*
// @grant       none
// @version     1.8
// @author      Edik
// @description 2021/4/15下午3:32:44
// @require    https://code.jquery.com/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/425525/HPOOL%20CHIA%E6%94%B6%E7%9B%8A%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/425525/HPOOL%20CHIA%E6%94%B6%E7%9B%8A%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  document.addEventListener("DOMContentLoaded",startaa);

  startaa();

  function startaa(){
    
    $.get("https://www.hpool.co/api/pool/detail?language=zh&type=chia", function(result){
  
      let capacity = result.data.capacity
      
      let html = $($($('.stat-t').children()[2]).children()[2]).html()
      
      let num = html.substring(0,html.indexOf("<small"))
      
      
      let htmlNew = '<div><img src="/static/media/income.861e0a5700.png" alt=""><div class="mt15 d">日平均收益</div><h2>'+(num/1024).toFixed(6)+' <small>XCH/TB</small></h2></div>'

      $('.stat-t').append(htmlNew)
      
      htmlNew = '<div><img src="/static/media/income.861e0a5700.png" alt=""><div class="mt15 d">日总收益</div><h2>'+(num*capacity/1024/1024).toFixed(6)+' <small>XCH/'+(capacity/1024).toFixed(2)+'TB</small></h2></div>'

      $('.stat-t').append(htmlNew)
      
    });
    
  }

})();