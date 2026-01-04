// ==UserScript==
// @name         he_clover_fc_toolbar
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  HE-Clover-fc页面工具
// @author       dong.luo@happyelements.com
// @include      /^http[s]*:\/\/.*\.happyelements\.net.*$/
// @include      /^http[s]*:\/\/.*localhost.*$/
// @include      /^http[s]*:\/\/.*127\.0\.0\.1.*$/
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449966/he_clover_fc_toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/449966/he_clover_fc_toolbar.meta.js
// ==/UserScript==


(function() {
  'use strict';

  //==========================================
  // var $ = window.jQuery;
  var $ = window.jQuery.noConflict(true);

  // 时间戳转换成时间
  handlerTimestampShow();

  // 时间戳转换成时间
  function handlerTimestampShow() {
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("datado.jsp") == -1) {
      return;
    }
    setInterval(function(){
      $(".number", $("#content")).each(function() {
        // 一个节点只处理一次
        var transFlag = $(this).attr('transFlag');
        if (transFlag == "1") {
          return;
        }
        $(this).attr('transFlag', '1'); // 设置已处理标识

        // 尝试将数字转换成时间戳
        var dateInfo = timestampFormat($(this).html());
        if (dateInfo) {
          $(this).after(dateInfo);
        }
      });
    }, 1000);
  }
  function timestampFormat(timeInfo) {
    if (!timeInfo) {
      return "";
    }
    if (/[^\d]/.test(timeInfo)) {
      return "";
    }

    if (timeInfo.length == 5 && timeInfo >= 10957 && timeInfo <= 29220) {
      // 格式一：第N天
      // 10957  2000-01-01 00:00:00
      // 29220  2050-01-01 00:00:00
      //// timeInfo = timeInfo * 24 * 60 * 60 * 1000 - 28800000;

    }else if(timeInfo.length == 10 && timeInfo >= 946656000 && timeInfo <= 2524579200) {
      // 格式二：时间戳（单位秒）
      // 946656000  2000-01-01 00:00:00
      // 2524579200 2050-01-01 00:00:00
      timeInfo = timeInfo * 1000;
    }

    // 时间戳检查
    if (timeInfo < 946656000000 || timeInfo > 2524579200000) {
      return "";
    }

    var dateInfo = timestampToTime(timeInfo);
    if (!dateInfo) {
      return "";
    }
    return ',<span style="padding-left:20px; color: #0366d6;">// '+dateInfo+'</span>';
  }
  function timestampToTime(timestamp) { // 毫秒 1533773345000
    const dateObj = new Date(+timestamp); // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
    const year = dateObj.getFullYear(); // 获取年，
    const month = pad(dateObj.getMonth() + 1); // 获取月，必须要加1，因为月份是从0开始计算的
    const date = pad(dateObj.getDate()); // 获取日，记得区分getDay()方法是获取星期几的。
    const hours = pad(dateObj.getHours()); // 获取时, pad函数用来补0
    const minutes = pad(dateObj.getMinutes()); // 获取分
    const seconds = pad(dateObj.getSeconds()); // 获取秒
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  }
  function pad(str) {
    return +str >= 10 ? str : '0' + str
  }


})();