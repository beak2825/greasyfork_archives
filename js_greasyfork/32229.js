// ==UserScript==
// @name        逛丢小时风云榜
// @namespace   https://greasyfork.org/zh-CN/users/821
// @author      gfork
// @description 逛丢小时风云榜加入方向键访问上一小时和下一小时
// @include     https://guangdiu.com/rank.php*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32229/%E9%80%9B%E4%B8%A2%E5%B0%8F%E6%97%B6%E9%A3%8E%E4%BA%91%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/32229/%E9%80%9B%E4%B8%A2%E5%B0%8F%E6%97%B6%E9%A3%8E%E4%BA%91%E6%A6%9C.meta.js
// ==/UserScript==
var handle = {
  hotKey: function (e) {
    //默认退出键为ESC。需要修改为其他快捷键的请搜索"keycode"，修改为按键对应的数字。
    if (e.keyCode == 37) {
      window.location.href = $('.pandvrank:eq(0)').attr('href');
    }
    if (e.keyCode == 39 && $('.pandvrank:eq(1)').attr('href') != null) {
      window.location.href = $('.pandvrank:eq(1)').attr('href');
    }
    if (e.keyCode == 13) {
      window.location.href = 'https://guangdiu.com/hots.php?kf=hdbar';
    }
    if (e.keyCode == 27) {
      window.location.href = 'https://guangdiu.com/rank.php';
    }
  }
};
document.addEventListener('keydown', handle.hotKey, false);