// ==UserScript==
// @name         网站图片地址修订
// @namespace    http://tampermonkey.net/
// @require  https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js
// @version      1.1
// @description  网站图片地址修订,私有
// @author       三胖
// @match        https://www.hxm5.com/t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469418/%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E4%BF%AE%E8%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/469418/%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E4%BF%AE%E8%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function  th(){
          $('.lazyload').each(function() {
  // 获取元素的data-original属性值
  var originalValue = $(this).attr('data-original');
  // 将https://i1.wp.com/替换为http://
  var newValue = originalValue.replace('https://i1.wp.com/', 'http://');
  // 将替换后的值重新设置为data-original属性的值
  $(this).attr('data-original', newValue);
               $(this).attr('src', newValue);
});
    }

   $(document).ready(function (){
       th() // JS代码
    })

    $("img").click(() => {
      th()
    })


   



})();