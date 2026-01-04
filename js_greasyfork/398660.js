// ==UserScript==
// @name         鼠标点击特效，出文字符号表情，颜色随机
// @namespace    戈小戈
// @version      0.1.1
// @description  鼠标点击网页任意地方，出文字符号表情的特效，颜色随机
// @author       戈小戈
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398660/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%EF%BC%8C%E5%87%BA%E6%96%87%E5%AD%97%E7%AC%A6%E5%8F%B7%E8%A1%A8%E6%83%85%EF%BC%8C%E9%A2%9C%E8%89%B2%E9%9A%8F%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/398660/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88%EF%BC%8C%E5%87%BA%E6%96%87%E5%AD%97%E7%AC%A6%E5%8F%B7%E8%A1%A8%E6%83%85%EF%BC%8C%E9%A2%9C%E8%89%B2%E9%9A%8F%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
                 var a_idx = 0;
            const 前颜色码库 = new Array('00', '11', '22', '1', '44', '55', '66', '77', '88', '99',
                    'aa', 'bb', 'cc', 'dd', 'ee', 'ff');
            const 中颜色码库 = new Array('00', '11', '22', '33', '44', '55', '66', '77', '88', '99',
                    'aa', 'bb', 'cc', 'dd', 'ee', 'ff');
            const 后颜色码库 = new Array('00', '11', '22', '33', '44', '55', '66', '77', '88', '99',
                    'aa', 'bb', 'cc', 'dd', 'ee', 'ff');
            var 前颜色码 ;var 中颜色码;var 后颜色码;
            var timerrrr = setInterval(function(){

                 前颜色码 = Math.floor(Math.random() * 前颜色码库.length);
                 中颜色码 = Math.floor(Math.random() * 中颜色码库.length);
                 后颜色码 = Math.floor(Math.random() * 后颜色码库.length);
 },150)
      $("body").click(function(e) {
          var a = new Array("^_^","^O^ ","\(^o^)/","o(*￣︶￣*)o","n(*≧▽≦*)n","(づ｡◕‿‿◕｡)づ","(✿◡‿◡)","(*^__^*) ","~\(≧▽≦)/~","顶！d=====(￣▽￣*)b","o(^▽^)o","(　ﾟ∀ﾟ) ﾉ♡");
          var $i = $("<span/>").text(a[a_idx]);
          a_idx = (a_idx + 1) % a.length;
          var x = e.pageX,
         y = e.pageY;
         $i.css({
             "z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
            "top": y - 20,
            "left": x,
             "position": "absolute",
            "font-weight": "bold",
             "color": "#" + 前颜色码库[前颜色码] + 中颜色码库[中颜色码] + 后颜色码库[后颜色码]
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
})();
