// ==UserScript==
// @name         驰游包包一键刮key
// @namespace    https://greasyfork.org/zh-CN/users/101223-splash
// @version      1.3
// @description  驰游包包一键刮key脚本
// @author       Splash
// @match        https://www.ccyyshop.com/order/id/*
// @supportURL   https://keylol.com/t267170-1-1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29336/%E9%A9%B0%E6%B8%B8%E5%8C%85%E5%8C%85%E4%B8%80%E9%94%AE%E5%88%AEkey.user.js
// @updateURL https://update.greasyfork.org/scripts/29336/%E9%A9%B0%E6%B8%B8%E5%8C%85%E5%8C%85%E4%B8%80%E9%94%AE%E5%88%AEkey.meta.js
// ==/UserScript==
(function () {
  var gd_btn = $('<div><div style="position:relative"><a href="javascript:;" style="color:#ffd700">一键刮KEY</a>|<a href="javascript:;" style="color:#ffd700">复制key(asf格式)</a>|<a href="javascript:;" style="color:#ffd700">复制key(一般格式)</a></div><textarea style="top:-999px;left:-999px;width:0px;height:0px;position:absolute"></textarea></div>'),
  gd_txta = gd_btn.find('textarea');
  gd_btn.find('a').eq(0).click(function () {
    $('.deliver-btn').click();
  });
  gd_btn.find('a').eq(1).click(function () {
    var keystr = '!redeem ';
    $('.deliver-game .deliver-gkey span[id]').each(function (i, el) {
      keystr += $(el).text().replace(/\r|\n|\t/g, '') + ',';
    });
    gd_copy(keystr.slice( -1) == ',' ? keystr.slice(0, - 1) : keystr);
  });
  gd_btn.find('a').eq(2).click(function () {
    var keystr = '';
    $('.deliver-game .deliver-gkey').each(function (i, el) {
      keystr += $(el).parent().prev().text().replace(/\r|\n|\t/g, '') + '\r\n' + $(el).find('span[id]').text().replace(/\r|\n|\t/g, '') + '\r\n';
    });
    gd_copy(keystr.slice( -1) == '\n' ? keystr.slice(0, - 2) : keystr);
  });
  $('hr.featurette-divider').eq(0).before(gd_btn);
  function gd_copy(gd_str) {
    gd_txta.val(gd_str).select();
    document.execCommand('copy');
  }
})();