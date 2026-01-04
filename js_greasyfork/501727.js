// ==UserScript==
// @name 搜索引擎自动去广 - 百度自动去广 - 360自动去广
// @description 一款百度搜狗等常见搜索引擎自动去除广告的工具
// @namespace ssyqzdqg
// @include *://*.baidu.com/s?*
// @include *://*.so.com/s?*
// @require https://code.jquery.com/jquery-3.0.0.js
// @author 全身肥肉的小猪佩奇
// @license Parity-6.0.0
// @version 1.0.0
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/501727/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF%20-%20%E7%99%BE%E5%BA%A6%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF%20-%20360%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/501727/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF%20-%20%E7%99%BE%E5%BA%A6%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF%20-%20360%E8%87%AA%E5%8A%A8%E5%8E%BB%E5%B9%BF.meta.js
// ==/UserScript==
function clear () {
  var AD = arguments[0]
  AD.remove()
}
function baiduAction () {
  // 页面中广告
  var parkedAD1 = $("[data-tuiguang]").toArray().map((i) => i.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)
  // 页面右广告
  var parkedAD2 = $(".content_right").toArray()
  // 清除
  parkedAD1.forEach(clear)
  parkedAD2.forEach(clear)
}
function soAction () {
  // 页面中广告
  var parkedAD1 = $("[onclick=\"tips_event_146_5(this)\"]").toArray().map((item) => item.parentElement.parentElement.parentElement)
  // 360活动
  var parkedAD2 = $("#so-activity-entry").toArray()
  // 清除
  parkedAD1.forEach(clear)
  parkedAD2.forEach(clear)
}
setTimeout(
  function () {
    if (unsafeWindow.location.host.indexOf("baidu") != -1) {
      baiduAction()
    }
    if (unsafeWindow.location.host.indexOf("so") != -1) {
      soAction()
    }
  },
  3000)