// ==UserScript==
// @name         许昌职业技术学院自动评教
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  自动提交许昌职业技术学院评价基本上所有青果都适配改一下就行感谢Anubis Ja作者
// @author       HUAJIEN
// @license MIT
// @original-script https://greasyfork.org/zh-CN/scripts/394130-%E9%9D%92%E8%8B%B9%E6%9E%9C%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99
// @original-author Anubis Ja
// @match        https://jwxt.xcitc.edu.cn/*
// @match        *://*.edu.cn/*
// @require      https://cdn.staticfile.org/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/482709/%E8%AE%B8%E6%98%8C%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482709/%E8%AE%B8%E6%98%8C%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==



$(document).ready(function() {
  var targetElement = $("[djdm='01']");
  targetElement.trigger('click');
  setTimeout(function() {
    submitForm();
  }, 3000);
});

function submitForm() {
  $("#butSave").click();
}