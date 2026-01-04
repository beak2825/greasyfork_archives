// ==UserScript==
// @name         vip.kingdee.com去除复制限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  金蝶不好好做社区的功能，胡乱加，复制个内容，再用浏览器搜索功能，还得去掉他这一堆垃圾文字。或者复制的是代码，要粘贴到VS开发工具中!
// @author       李建忠 代码来源: https://cloud.tencent.com/developer/article/1695436
// @include     *://vip.kingdee.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441647/vipkingdeecom%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441647/vipkingdeecom%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // 监听整个网页的copy(复制)事件
  document.addEventListener('copy', function (event) {
  // clipboardData 对象是为通过编辑菜单、快捷菜单和快捷键执行的编辑操作所保留的，也就是你复制或者剪切内容
    let clipboardData = event.clipboardData || window.clipboardData;
    // 如果未复制或者未剪切，则return出去
    if (!clipboardData) { return; }
    // Selection 对象，表示用户选择的文本范围或光标的当前位置。
    //     声明一个变量接收 -- 用户输入的剪切或者复制的文本转化为字符串
    let text = window.getSelection().toString();
    if (text) {
      // 如果文本存在，首先取消文本的默认事件
      event.preventDefault();
      // 通过调用常clipboardData对象的 setData(format, data) 方法；来设置相关文本

      // setData(format, data);参数
      // format
      // 一个DOMString 表示要添加到 drag object的拖动数据的类型。
      // data
      // 一个 DOMString表示要添加到 drag object的数据。
      clipboardData.setData('text/plain', text);
    }
  });
    // Your code here...
})();