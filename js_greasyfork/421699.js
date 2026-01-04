// ==UserScript==
// @name         湿热一瞬间显示性别
// @namespace    https://shireyishunjian.com/main/?170123
// @version      0.1
// @description  像手机版一样，在电脑版上显示作者性别
// @author       难道这么冷
// @match        https://shireyishunjian.com/main/forum.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421699/%E6%B9%BF%E7%83%AD%E4%B8%80%E7%9E%AC%E9%97%B4%E6%98%BE%E7%A4%BA%E6%80%A7%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/421699/%E6%B9%BF%E7%83%AD%E4%B8%80%E7%9E%AC%E9%97%B4%E6%98%BE%E7%A4%BA%E6%80%A7%E5%88%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery('head').append('<link rel="stylesheet" type="text/css" href="/main/template/banzhuan_touch01201/touch/banzhuan/font/iconfont.css">');
    jQuery('head').append(`<style>
.color-nan { color:#87D0F5;}
.color-nv { color: #FFA3A3} </style>`);

    jQuery('.authi .xw1').each(function(){
      let pop=jQuery(this).closest('.pls').find('.p_pop');
      let gender='';
      if(pop.hasClass('card_gender_0'))
      {
          gender='';
      }
      else if(pop.hasClass('card_gender_1'))
      {
          gender='icon-shouyezhuyetubiao06 color-nan';
      }
      else if(pop.hasClass('card_gender_2'))
      {
          gender='icon-iconfontshouyezhuyetubiao07 color-nv';
      }
      jQuery(this).after(`<i class="iconfont ${gender}"></i>`);
    });
})();