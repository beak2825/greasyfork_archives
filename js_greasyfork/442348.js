// ==UserScript==
// @name         鼠标点击特效修改
// @namespace    http://tampermonkey.net/
// @version      22.03.01
// @description  可以有效实现简单修改鼠标点击特效，点击弹出“社会主义核心价值观”
// @author       qiu121
// @match        *://*/*
// @icon         http://pic.616pic.com/ys_bnew_img/00/14/47/wI48iKKv7m.jpg
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/442348/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/442348/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
  /* 鼠标点击特效 */
  var a_idx = 0;
  jQuery(document).ready(function($) {
      $("body").click(function(e) {
  var a = new Array("富强", "民主", "文明", "和谐", "自由", "平等", "公正" ,"法治", "爱国", "敬业", "诚信", "友善");
  var $i = $("<span/>").text(a[a_idx]);
          a_idx = (a_idx + 1) % a.length;
  var x = e.pageX,
          y = e.pageY;
          $i.css({
  "z-index": 9999999999999999999999999999,
  "top": y - 20,
  "left": x,
  "position": "absolute",
   //"font-weight": "bold",
  "font-size":"30px",
  "color": "black"
          });
          $("body").append($i);
          $i.animate({
  "top": y - 180,
  "opacity": 0
          },
           1500,
  function() {
              $i.remove();
          });
      });
  });
   
})();