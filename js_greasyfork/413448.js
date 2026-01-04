// ==UserScript==
// @name         全民解析 修改视频高度
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  蚂蚁vip视频在线解析 修改视频高度，
// @author       weimh
// @match        https://www.anttechnologys.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413448/%E5%85%A8%E6%B0%91%E8%A7%A3%E6%9E%90%20%E4%BF%AE%E6%94%B9%E8%A7%86%E9%A2%91%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/413448/%E5%85%A8%E6%B0%91%E8%A7%A3%E6%9E%90%20%E4%BF%AE%E6%94%B9%E8%A7%86%E9%A2%91%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  $('.topbar:first').html('');
  $('.form-group:first').prepend('<div class="form-group"><label class="sr-only" for="exampleInputAmount">Amount (in dollars)</label><div class="input-group"><div class="input-group-addon">视频高度</div><input type="text" class="form-control" id="myWidth" value="600" placeholder="请输入视频高度" /></div></div>');
  $('.dashang:first').html('');
  let timer = '';
  $("#myWidth").on("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setHeight();
    }, 500)
  });
  $("#btnOk").on("click", function () {
    setHeight();
  })
  function setHeight(){
    var val = $("#myWidth").val();
    var player = $('#videodiv iframe');
    $(player).attr("height", val);
  }
  setHeight();
})();
