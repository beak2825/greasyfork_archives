// ==UserScript==
// @name        移除百度文库在选中文字后弹出的提示框
// @description 百度文库中在页面上选中一段文字之后会自动弹出一个提示框，相当的烦人。本脚本就是用于移除这个提示框的。
//
// @namespace   wwwlsmcom@outlook.com
// @author      Liu233w
//
// @include     http://wenku.baidu.com/view/*
// @include     https://wenku.baidu.com/view/*
// @version     1.1
// @grant       none
//
//
// @downloadURL https://update.greasyfork.org/scripts/24918/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%9C%A8%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E5%90%8E%E5%BC%B9%E5%87%BA%E7%9A%84%E6%8F%90%E7%A4%BA%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/24918/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%9C%A8%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E5%90%8E%E5%BC%B9%E5%87%BA%E7%9A%84%E6%8F%90%E7%A4%BA%E6%A1%86.meta.js
// ==/UserScript==

window.onload = function () {
  var helper = document.getElementById('reader-helper-el');
  helper.innerHTML = '';
};
