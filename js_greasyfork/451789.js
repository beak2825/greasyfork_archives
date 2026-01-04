// ==UserScript==
// @name        虎扑一键点赞
// @namespace   Violentmonkey Scripts
// @include      *://*.hupu.com/*
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant       none
// @version     1.0
// @author      青工丶
// @license     MIT
// @description 手机端长按点赞，pc端Ctrl+Alt+L点赞
// @downloadURL https://update.greasyfork.org/scripts/451789/%E8%99%8E%E6%89%91%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/451789/%E8%99%8E%E6%89%91%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
(function () {
  'use strict';
  setTimeout(()=>{
    //$('.todo-list-text bold').trigger('click')
    $(document).keydown(function (e) {
      if(e.ctrlKey&&e.altKey&&e.key == 'l'){
        $('.light').each(function(){
          $(this).trigger('click')
        })
      }
    })
    $(document).off("taphold")
    $(document).on("taphold",function(){
      $('.light').each(function(){
        $(this).trigger('click')
      })
    });
  },100)
})()