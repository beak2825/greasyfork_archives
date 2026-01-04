// ==UserScript==
// @version 1.1
// @description:zh-cn
// @name 安全教育平台自动回答问题
// @namespace Violentmonkey Scripts
// @match https://hangzhou.xueanquan.com/JiaTing/*
// @grant none
// @description 安全教育平台自动回答问题，并且全对。
// @downloadURL https://update.greasyfork.org/scripts/379804/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/379804/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==
(function () {
    'use strict';
      $(document).ready(function(){
         alert("脚本加载成功");
        $("#input_button").click(function () {
            for (var i = 0; i < threeTest; i++) {
            var radion = document.getElementsByName("radio" + i + "_" + i);
            radion[1].checked =  'checked';  //自动选择
            for (var j = 0; j < radion.length; j++) {
                  radion[j].value = "1";  //所有答案都为正确
            }
        }
        });
      });
})();