// ==UserScript==
// @name         MOOCAuto
// @name:zh-CN   MOOC自动互评
// @namespace    Hypnos
// @version      1.1
// @description  自动互评脚本
// @description:zh-cn 自动互评脚本
// @match https://www.icourse163.org/learn/*
// @match https://www.icourse163.org/spoc/learn/*
// @grant        none
// @license CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/475028/MOOCAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/475028/MOOCAuto.meta.js
// ==/UserScript==




(function() {
'use strict';

// 创建一个按钮
var button = document.createElement("button");
// 将按钮添加到 ID 为 "j-courseTabList" 的 HTML 元素中
document.getElementById("j-courseTabList").appendChild(button);
// 按钮上显示的文本为 "自动互评"，字体大小为 30px
button.textContent = "自动互评";
button.style.fontSize = "30px";
// 点击按钮触发名为 "pingfen" 的函数
button.addEventListener("click", pingfen);

function pingfen() {
// 遍历网页中类名为 s 的元素
var elements = document.getElementsByClassName("s");
for (var i = 0; i < elements.length; i++) {
// 选中它们最后一个子元素的单选框
var radios = elements[i].querySelectorAll("input[type='radio']");
radios[radios.length - 1].checked = true;
}
// 遍历文档中的所有 textarea 元素
var textareas = document.getElementsByTagName("textarea");
for (let i = 0; i < textareas.length; i++) {
// 将它们的值设为 "That's Good Enough."
textareas[i].value = "That's Good Enough.";
}
// 滑动到网页最下端
window.scrollTo(0, document.body.scrollHeight);
}

})();