// ==UserScript==
// @name         t66y图片收藏
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  增加图片收藏按钮
// @author       lukezh
// @match        http://t66y.com/htm_*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/410031/t66y%E5%9B%BE%E7%89%87%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/410031/t66y%E5%9B%BE%E7%89%87%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var html='<div id="addfa" style="position: fixed;z-index: 1000;height: 2rem;width: 2.4rem;background-color: #ff6a00;bottom: 2rem;right: 1rem;color: white;line-height: 2rem;text-align: center;font-size: 0.8em;border-radius: 0.2rem;box-shadow: 0 0 3px rgba(0, 0, 0, 0.52);cursor: pointer;">收藏</div>';

    $('body').append(html);

    $('#addfa').click(function(event) {

    var url=window.location.href;
    $(this).html('...');

    $.post('https://rb.lukey.pub/index/get/getone', {url: url}, function(data, textStatus, xhr) {

      if(data){
        $('#addfa').html('成功').css('background-color','green');
      }else{
        $('#addfa').html('失败').css('background-color','red');
      }
    });
  });
})();