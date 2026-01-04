// ==UserScript==
// @name         MOOC互评全自动化脚本
// @description  自动填充内容并默认勾选最高分提交，默认互评5次
// @version      1.2
// @author       无知呦
// @match        https://www.icourse163.org//*  
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1195678
// @downloadURL https://update.greasyfork.org/scripts/477396/MOOC%E4%BA%92%E8%AF%84%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/477396/MOOC%E4%BA%92%E8%AF%84%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 2023年10月14日15:17:22 mooc互评全自动化脚本 无知呦

function fillRadios() {
  var radios = document.getElementsByTagName('input');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].type === 'radio') {
      radios[i].checked = true;
    }
  }
}

function fillTextareas() {
  var textareas = document.getElementsByTagName('textarea');
  for (var i = 0; i < textareas.length; i++) {
    textareas[i].value = '100';
  }
}

function clickLinkByTextContent(textContent) {
  var links = document.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    if (links[i].textContent === textContent) {
      links[i].click();
      break;
    }
  }
}

function clickNextLinks() {
  var nextLinks = document.querySelectorAll('a.j-gotonext');
  for (var j = 0; j < nextLinks.length; j++) {
    nextLinks[j].click();
  }
}

function doTask(taskIndex) {
  fillRadios();
  fillTextareas();
  clickLinkByTextContent('提交');

  setTimeout(function () {
    clickNextLinks();
    if (taskIndex < 4) {
      setTimeout(function () {
        doTask(taskIndex + 1);
      }, Math.random() * 2000 + 1000); // 随机等待时间在1秒到3秒之间
    }
  }, 2000);
}

doTask(0);
