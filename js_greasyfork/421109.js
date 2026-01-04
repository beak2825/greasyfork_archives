// ==UserScript==
// @name             电脑弹幕颜色过滤器
// @description      将指定的 B 站弹幕颜色隐藏或替换为其他颜色
// @namespace        https://cldxiang.com/
// @version          1.0.0
// @include          https://*.bilibili.com/*
// @supportURL       https://github.com/CLDXiang/bili-danmaku-color-filter
// @author           CLDXiang
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421109/%E7%94%B5%E8%84%91%E5%BC%B9%E5%B9%95%E9%A2%9C%E8%89%B2%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421109/%E7%94%B5%E8%84%91%E5%BC%B9%E5%B9%95%E9%A2%9C%E8%89%B2%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  /** 刷新弹幕颜色的间隔时间(毫秒) */
  var CD = 233;
  /** 需要过滤的颜色列表 */
  var COLORS_TO_FILTER = [
    '#FFFF00', // 示例：过滤亮黄色弹幕
  ];
  /** 想要转换成的颜色，此处默认转为白色弹幕，如果想要直接隐藏，可以用 '#FFF0' */
  var TARGET_COLOR = '#FFF';
 
  /**
   * 将颜色值由十六进制表示转为 RGB 表示，如 `#FFFFFF` 转为 `rgb(255, 255, 255)`
   * @param colorHex 十六进制表示的颜色字符串
   */
  function hex2RGB(colorHex) {
    if (/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/.test(colorHex)) {
      return colorHex;
    }
    if (!/#[0-9A-Fa-f]{6}/.test(colorHex)) {
      throw new Error("请按照正确格式输入颜色值，如 '#123abc'");
    }
    var r = parseInt(colorHex.slice(1, 3), 16);
    var g = parseInt(colorHex.slice(3, 5), 16);
    var b = parseInt(colorHex.slice(5, 7), 16);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
 
  var parsedColorsToFilter = COLORS_TO_FILTER.map(hex2RGB);
  console.log('将被过滤的弹幕颜色：', parsedColorsToFilter);
 
  setInterval(function () {
    document.querySelectorAll('.b-danmaku').forEach(function (ele) {
      if (parsedColorsToFilter.indexOf(ele.style.color) !== -1) {
        ele.style.color = TARGET_COLOR;
      }
    });
  }, CD);
 
  /** 输出当前显示的所有弹幕的颜色 */
  unsafeWindow.showDanmakuColor = function () {
    var colorList = [];
    document.querySelectorAll('.b-danmaku').forEach(function (ele) {
      colorList.push(ele.style.color);
    });
    if (colorList.length) {
      console.log('当前显示的弹幕颜色：', Array.from(new Set(colorList)));
    } else {
      console.log('没有找到弹幕');
    }
  };
})();