// ==UserScript==
// @name         河工大评教
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  河工大自动评教脚本，默认第一选项为“符合”，其他选项为第一个选项，文本框填写“完全符合”（可自行修改），适用于mycos版评教系统，默认评级为空
// @author       YOUXIN 
// @match        https://haut.mycospxk.com/** 
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482501/%E6%B2%B3%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482501/%E6%B2%B3%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

var COMMENT = "  ";

function Fill_it() {
  var checkbox_list = $(".ant-radio-group"); // 单选框

  // 选择第一个选择题的第二个选项，其他选择题选择第一个选项
  var firstQuestionOptions = $(checkbox_list[0]).find(".ant-radio-input");
  $(firstQuestionOptions[1]).trigger("click");
  for (var i = 1; i < checkbox_list.length; i++) {
    var firstOption = $(checkbox_list[i]).find(".ant-radio-input")[0];
    $(firstOption).trigger("click");
  }

  checkbox_list = $(".ant-checkbox-group"); // 多选框

  // 选择所有多选框的第一个选项
  for (var i = 0; i < checkbox_list.length; i++) {
    var firstOption = $(checkbox_list[i]).find(".ant-checkbox-input")[0];
    $(firstOption).trigger("click");
  }

  var textbox_list = $(".ant-input");

  for (var i = 0; i < textbox_list.length; i++) {
    $(textbox_list[i]).trigger('click');
    $(textbox_list[i]).val(COMMENT).trigger('change');
  }
  // 滚动到底部
  // window.scrollTo(0, document.body.scrollHeight);
}
(function () {
  "use strict";
  setInterval(Fill_it, 1000); // 每隔1秒执行一次评教操作
})();