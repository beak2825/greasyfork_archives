// ==UserScript==
// @name         蓝湖-复制单位转为rpx
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       villiam
// @match        https://lanhuapp.com/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanhuapp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445043/%E8%93%9D%E6%B9%96-%E5%A4%8D%E5%88%B6%E5%8D%95%E4%BD%8D%E8%BD%AC%E4%B8%BArpx.user.js
// @updateURL https://update.greasyfork.org/scripts/445043/%E8%93%9D%E6%B9%96-%E5%A4%8D%E5%88%B6%E5%8D%95%E4%BD%8D%E8%BD%AC%E4%B8%BArpx.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.addEventListener("copy", function (e) {
    let clipboardData = e.clipboardData || window.clipboardData;
    // 如果 未复制或者未剪切，直接 return
    if (!clipboardData) return;
    // Selection 对象 表示用户选择的文本范围或光标的当前位置。
    // 声明一个变量接收 -- 用户输入的剪切或者复制的文本转化为字符串
    var text = window.getSelection().toString();
    if (text) {
      // 如果文本存在，首先取消默认行为
      e.preventDefault();
      // 通过调用 clipboardData 对象的 setData(format,data) 方法，设置相关文本
      //替换单位为rpx
      text = text.replace(/px/g, "rpx");
      if (text.indexOf("font-family: Source Han Sans CN;") > -1) {
        text = text.replace("font-family: Source Han Sans CN;", "")
      }
      clipboardData.setData("text/plain", text);
    }
  });
})();
