// ==UserScript==
// @icon        https://1.tongji.edu.cn/static/images/logo.ico
// @name        2024新版系统 - 一键评教
// @namespace   http://www.lxzy.me
// @match       https://1.tongji.edu.cn/*
// @grant       none
// @version     1.1
// @author      银河以北吾彦最美
// @description 同济大学新版1系统评教，一键全选A、B、C、D、E中的某一项并自动提交。
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/483767/2024%E6%96%B0%E7%89%88%E7%B3%BB%E7%BB%9F%20-%20%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/483767/2024%E6%96%B0%E7%89%88%E7%B3%BB%E7%BB%9F%20-%20%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

// 创建悬浮窗元素
var popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.top = "50%";
popup.style.left = "3%";
popup.style.transform = "translate(-50%, -50%)";
popup.style.zIndex = "9999";
popup.style.borderRadius = "50%";
popup.style.width = "50px";
popup.style.height = "50px";
popup.style.backgroundColor = "#4CAF50";
popup.style.color = "white";
popup.style.textAlign = "center";
popup.style.lineHeight = "50px";
popup.style.fontSize = "15px";
popup.style.cursor = "pointer";
popup.innerHTML = "评教";
document.body.appendChild(popup);

// 点击悬浮窗元素时弹出输入框
popup.addEventListener("click", function() {
  var input = prompt("请输入ABCD中的一个选项：");
  if (input == null || input == "") {
    input = "B"
  }
  // 获取所有的单选题元素
  var radios = document.querySelectorAll("input[type='radio']");
  // 遍历每个单选题
  for (var i = 0; i < radios.length; i++) {
    // 如果是输入的选项，就选中它
    if (radios[i].value == input) {
      var label = radios[i].parentNode.parentNode;
      label.click();
    }
  }
  setTimeout(function() {
    var buttons = document.querySelectorAll('.el-button.el-button--primary.el-button--small');
    var send = buttons[buttons.length - 1];
    send.click();
    setTimeout(function() {
      var buttons1 = document.querySelectorAll('.el-button.el-button--primary.el-button--small');
      var yes = buttons1[buttons1.length - 1];
      yes.click();
    }, 5);
  }, 100);
});
