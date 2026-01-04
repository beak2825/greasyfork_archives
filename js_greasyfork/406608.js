// ==UserScript==
// @name        icourse163.org显示视频编号
// @namespace   https://www.icourse163.org/
// @version     1.4
// @description 在看课的时候视频没有编号，用这个可以显示当前是第几个视频。
// @author      good1uck
// @match       https://www.icourse163.org/learn/*
// @require     http://code.jquery.com/jquery-1.8.2.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/406608/icourse163org%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E7%BC%96%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/406608/icourse163org%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E7%BC%96%E5%8F%B7.meta.js
// ==/UserScript==
$(document).ready(
  function () {
    //添加计数器
    $(".unitslist").addClass("mycounter");

    //创建并添加新伪类样式，如果span有title,则会显示视频标题。
    let newstyle =
      `
      <style>
      .u-icon-video2:before {
        counter-increment : section;
        content: '[' counter(section) ']' ' ' attr(title) !important 
      }

      .unitslist {
        counter-reset:section;
      }
      </style>
      `
    $(newstyle).appendTo('head');

  }
)

