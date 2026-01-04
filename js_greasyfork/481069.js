// ==UserScript==
// @name        成绩增强显示插件（留星网）- liustar.cn
// @namespace   Violentmonkey Scripts
// @match       https://liustar.cn/*/result-*
// @grant       none
// @version     1.12
// @author      -
// @license MIT
// @description 11/30/2023, 2:26:02 PM
// @downloadURL https://update.greasyfork.org/scripts/481069/%E6%88%90%E7%BB%A9%E5%A2%9E%E5%BC%BA%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E7%95%99%E6%98%9F%E7%BD%91%EF%BC%89-%20liustarcn.user.js
// @updateURL https://update.greasyfork.org/scripts/481069/%E6%88%90%E7%BB%A9%E5%A2%9E%E5%BC%BA%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E7%95%99%E6%98%9F%E7%BD%91%EF%BC%89-%20liustarcn.meta.js
// ==/UserScript==

// .border-red-bold{
//   border: 6px #ff4242 solid !important;
// }

function getGrade(){
  // 统计数量
  let errors = document.querySelectorAll(".border-red").length
  console.log(document.querySelectorAll(".broder-red"))
  var grade = document.querySelector('.f18');

  // 获取包含 <span class="f18">成绩：</span> 的元素
var spanElement = document.querySelector('span.f18');

// 检查元素是否存在
if (spanElement) {
  // 创建一个包含换行符的空白文本节点
  var lineBreak = document.createElement('br');

  // 创建一个 <span> 元素
  var newSpanElement = document.createElement('span');

    // 创建一个文本节点
  let msg = ""
  if(errors === 0){
     msg = '全对！'
  }else{
     msg = '错误: ' + errors
  }
    var textNode = document.createTextNode(msg);


  // 设置文本节点的颜色为红色
  newSpanElement.style.color = 'red';

    // 将新的 <span> 元素设置为 class="f18"
  newSpanElement.classList.add('f18');

  // 将文本节点添加到 <span> 元素中
  newSpanElement.appendChild(textNode);

  // 将 <span> 元素添加到 <span class="f18"> 成绩：</span> 后面
  spanElement.parentNode.insertBefore(newSpanElement, spanElement.nextSibling);

    // 将空白文本节点插入到 <span class="f18"> 成绩：</span> 后面
  spanElement.parentNode.insertBefore(lineBreak, spanElement.nextSibling);
}

}

(function() {
    'use strict';
  getGrade();
    // 创建一个<style>元素
  var styleElement = document.createElement('style');

  // 设置<style>元素的类型
  styleElement.type = 'text/css';

  // 定义CSS规则，此处为新类名.border-red-bold的样式规则
  var cssRule = '.border-red-bold { border: 4px #ff4242 solid !important;}';
  var cssRule2 = '.a-ture.border-red-bold {background-color: #ff4242;color: #FFF !important;border: 0px}'

  // 将CSS规则添加到<style>元素中
    styleElement.appendChild(document.createTextNode(cssRule)); // 标准方式
    styleElement.appendChild(document.createTextNode(cssRule2)); // 标准方式

  // 将<style>元素添加到<head>中
  document.head.appendChild(styleElement);


  // 获取所有具有 .border-red 类的元素
  var elementsWithBorderRed = document.querySelectorAll('.border-red');

  // 遍历这些元素并替换类名
  elementsWithBorderRed.forEach(function(element) {
    element.classList.remove('border-red');  // 移除旧类名
    element.classList.add('border-red-bold');  // 添加新类名
  });

})()