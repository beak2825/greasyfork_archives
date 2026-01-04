// ==UserScript==
// @name         数字选中类别
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  数字选中类别。。。
// @author       huqz
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @note         21-06-11 0.2 添加按键
// @downloadURL https://update.greasyfork.org/scripts/427765/%E6%95%B0%E5%AD%97%E9%80%89%E4%B8%AD%E7%B1%BB%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/427765/%E6%95%B0%E5%AD%97%E9%80%89%E4%B8%AD%E7%B1%BB%E5%88%AB.meta.js
// ==/UserScript==

(function() {
  'use strict';

  setTimeout(() => {
    $(".ant-select-arrow").click();
    $(".ant-select-arrow").click();
    var opts = $("li");

    $(`
        <br>
        <br>
        <div class="extro" style="330px">
          <style>
            .extro > button {
              margin-left: 20px;
              margin-bottom: 5px;
            }
          </style>
          <button class="ant-btn">1 - 文档类</button>
          <button class="ant-btn">2 - 图文混排类</button>
          <br>
          <button class="ant-btn">3 - 截屏类</button>
          <button class="ant-btn">5 - 海报设计类</button>
          <br>
          <button class="ant-btn">4 - 图表类</button>
          <button class="ant-btn">6 - 低质广告类</button>
          <br>
          <button class="ant-btn">7 - 艺术字</button>
          <button class="ant-btn">8 - 其他-水印</button>
          <br>
          <button class="ant-btn">9 - 其他</button>
          <button class="ant-btn">0 - 抛弃</button>
        </div>
    `).appendTo($(".right___1jbBy")[0].children[0])

  $(".extro").click(function (e) {
    if (e.target.nodeName === "BUTTON") {
      var num = e.target.textContent.replace(/[^0-9]/ig, "");
      if (num === "0") {
        opts[9].click();
      }else {
        opts[Number(num) - 1].click();
      }
      $(".ant-btn.ant-btn-primary").click();
    }
  })
    document.onkeydown = function(e){
      switch (e.keyCode) {
        case 48:
        case 96:
          opts[9].click();
          break;
        // 1
        case 49:
        case 97:
          opts[0].click();
          break;
          // 2
        case 50:
        case 98:
          opts[1].click();
          break;
        case 51:
        case 99:
          opts[2].click();
          break;
        case 52:
        case 100:
          opts[3].click();
          break;
        case 53:
        case 101:
          opts[4].click();
          break;
        case 54:
        case 102:
          opts[5].click();
          break;
        case 55:
        case 103:
          opts[6].click();
          break;
        case 56:
        case 104:
          opts[7].click();
          break;
        case 57:
        case 105:
          opts[8].click();
          break;
      }
      $(".ant-btn.ant-btn-primary").click();
    };
  }, 3000)
  // Your code here...
})();
