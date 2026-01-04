// ==UserScript==
// @name         扇贝单词笔记编辑框加高, 取词自动朗读
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  扇贝单词笔记编辑框加大. 取词放大语音按钮 & 自动朗读英音.
// @author       wowo878787
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @match        https://www.shanbay.com/review/learning/*
// @match        https://web.shanbay.com/wordsweb/*
// @match        https://www.shanbay.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394004/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E7%AC%94%E8%AE%B0%E7%BC%96%E8%BE%91%E6%A1%86%E5%8A%A0%E9%AB%98%2C%20%E5%8F%96%E8%AF%8D%E8%87%AA%E5%8A%A8%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/394004/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E7%AC%94%E8%AE%B0%E7%BC%96%E8%BE%91%E6%A1%86%E5%8A%A0%E9%AB%98%2C%20%E5%8F%96%E8%AF%8D%E8%87%AA%E5%8A%A8%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

$.noConflict();

(function($) {
  $(function() {
    $("<style></style>")
      .text(
        "\
        textarea.note-textarea{height: 350px;}\
        \
        .resultModal .resultContent .resultContent-pronunciation .pronunciationItem .pronunciationItem-icon{width: 33px;height: 33px;}\
        \
        .index_transBox__2yUO4 .index_audio__305yO .index_trumpet__2KSpA{width: 33px;}\
        .index_transBox__2yUO4 .index_audio__305yO{height: 35px;}\
        "
      )
      .appendTo($("head"));

    var will_read = false;
    var input_new, input_old;

    var interval = setInterval(function() {
      var is_pop_in_head = $(".resultModal").length; // 页头
      var is_pop_in_detail = $(".index_transBox__2yUO4").length; // 详情取词

      if (is_pop_in_head === 1) {
        input_new = $(".resultContent .head-word").text();
      } else if (is_pop_in_detail === 1) {
        input_new = $(".index_vocab__3Dqmq span:first").text();
      }

      if (input_old != input_new) {
        will_read = true;
        input_old = input_new;
      } else {
        will_read = false;
      }

      if (will_read) {
        if (is_pop_in_head === 1) {
          $(".resultContent-pronunciation")
            .find(".pronunciationItem")
            .eq(1)
            .children("i")
            .click();
        } else if (is_pop_in_detail === 1) {
          $(".index_transBox__2yUO4")
            .find(".index_audio__305yO")
            .eq(1)
            .children(".index_trumpet__2KSpA")
            .click();
        }
      }
    }, 900);
  });
})(jQuery);

// Your code end...

})();