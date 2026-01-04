// ==UserScript==
// @name         社会主义核心价值观
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让你的每次点击都很社会主义
// @author       greedy
// @match        *://*/*
// @icon         http://www.china.com.cn/favicon.ico
// @grant        none
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468772/%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%E8%A7%82.user.js
// @updateURL https://update.greasyfork.org/scripts/468772/%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%E8%A7%82.meta.js
// ==/UserScript==

(function () {
  var a_idx = 0;
  jQuery(document).ready(function ($) {
    $("body").click(function (e) {
      var a = new Array(
        "富强",
        "民主",
        "文明",
        "和谐",
        "自由",
        "平等",
        "公正",
        "法治",
        "爱国",
        "敬业",
        "诚信",
        "友善"
      );
      var $i = $("<span/>").text(a[a_idx]);
      a_idx = (a_idx + 1) % a.length;
      var x = e.pageX,
        y = e.pageY;
      $i.css({
        "z-index": Infinity,
        top: y - 20,
        left: x,
        position: "absolute",
        "font-weight": "bold",
        color: "#ff6651",
        //"font-size": "100px",
      });
      $("body").append($i);
      $i.animate(
        {
          top: y - 180,
          opacity: 0,
        },
        1500,
        function () {
          $i.remove();
        }
      );
    });
  });
})();
