// ==UserScript==
// @name         邮编获取
// @namespace    前端阿轩
// @version      0.1
// @description  用来直接获取邮编
// @author       前端阿轩
// @match        https://www.youbianku.com/*
// @license MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/446898/%E9%82%AE%E7%BC%96%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446898/%E9%82%AE%E7%BC%96%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("前端阿轩邮编插件，加载成功");
  var button = document.createElement("button"); //创建一个input对象（提示框按钮）
  button.id = "id001";
  button.textContent = "获取邮编";
  button.style.width = "60px";
  button.style.height = "20px";
  button.style.align = "center";

  //绑定按键点击功能
  button.onclick = function () {
    // 邮编
    var cs = document.getElementsByClassName("tabel_response")[0];
    if (!cs) {
      alert("前端阿轩提醒您！此时此刻因为网速问题还没有获取到您的邮编");
      return;
    }
    var emil = document
      .getElementsByClassName("tabel_response")[0]
      .innerText.split("\n")[2]
      .split("\t")[1];

    // 复制
    GM_setClipboard(emil);
    return;
  };

  var x = document.getElementsByClassName("tab-content")[0];
  //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
  x.appendChild(button);

  //var y = document.getElementById('s_btn_wr');
  //y.appendChild(button);
})();
