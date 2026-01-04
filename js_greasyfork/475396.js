// ==UserScript==
// @name        云开 - 在线作业
// @namespace   Violentmonkey Scripts
// @match       https://teach.ynou.edu.cn/hw/student/studentStartHomework.action*
// @require      https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js
// @grant       none
// @version     1.2
// @license MIT
// @author      -
// @description 2023/9/16 上午9:40:49
// @downloadURL https://update.greasyfork.org/scripts/475396/%E4%BA%91%E5%BC%80%20-%20%E5%9C%A8%E7%BA%BF%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/475396/%E4%BA%91%E5%BC%80%20-%20%E5%9C%A8%E7%BA%BF%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function ($) {
    'use strict';
    // 获取试卷ID
    var url = `https://teach.ynou.edu.cn/hw/student/studentViewHomework.action?paper_id=${paper_id}&studentClass=${studentClass}`
    $.get(url, function(data, status, jqXHR) {
      // 获取试卷试题ID
      $('input[type="radio"]').each(function() {
          // 获取当前 <input> 元素的 id 属性
          var inputId = $(this).attr('id');
          var da = $(data).find("#"+inputId+"_right_answer font").text()
          if($(this).attr('value') == da){
            // 输出 id 属性
            console.log('Input ID:', $(this));
            $(this).click()
          }
      });
      // 获取试卷试题ID
      $('input[type="checkbox"]').each(function() {
          // 获取当前 <input> 元素的 id 属性
          var inputId = $(this).attr('id');
          var da = $(data).find("#"+inputId+"_right_answer font").text()
          if(da.includes($(this).attr('value'))){
            // 输出 id 属性
            console.log('Input ID:', $(this));
            $(this).click()
          }
      });
    });

})(jQuery.noConflict(true));
