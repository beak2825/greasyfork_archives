// ==UserScript==
// @name         d2l.ai优化
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  d2l.ai添加隐藏侧栏按钮，增加跳转本地jupyter notebook按钮
// @author       You
// @match        *://*.d2l.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d2l.ai
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463059/d2lai%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463059/d2lai%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 获取元素
const drawer = document.querySelector('.mdl-layout__drawer');
const main = document.querySelector('.mdl-layout__content');
const doc = document.documentElement;

// 创建按钮
let btn = document.createElement('button');
btn.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect');
btn.textContent = '隐藏侧边';

// 按钮点击事件处理函数
function toggleDrawer() {
  if (drawer.style.display === 'none') {
    // 显示侧边栏
    drawer.style.display = '';
    main.style.marginLeft = '256px';
    btn.textContent = '隐藏侧边';
    doc.style.width = '';
  } else {
    // 隐藏侧边栏
    drawer.style.display = 'none';
    main.style.marginLeft = '50px';
    btn.textContent = '显示侧边';
    doc.style.width = '100vw';
  }
}

// 添加按钮到导航元素中
const nav = document.querySelector('.mdl-navigation');
nav.appendChild(btn);

// 绑定按钮点击事件
btn.addEventListener('click', toggleDrawer);

// 找到innerText为 Colab [mxnet] 的button
let aa = document.querySelector('a[href*="https://studiolab.sagemaker.aws/import/github/d2l-ai"]')
aa.removeAttribute('href');
aa.onclick=null
let button = aa.querySelector('button');

if (button) {
  // 将文本替换为“跳转到本地jupyter notebook”
  button.innerText = '跳转到本地jupyter notebook';
  
  // 绑定一个函数
  button.onclick = function() {
    // 获取当前网址并替换
    const url = window.location.href.replace('https://zh.d2l.ai/', 'http://localhost:8888/notebooks/pytorch/').replace('.html', '.ipynb');
    
    // 在新标签页打开
    window.open(url, '_blank');
  };
  button.href=window.location.href.replace('https://zh.d2l.ai/', 'http://localhost:8888/notebooks/pytorch/').replace('.html', '.ipynb');
    
}
btn = document.createElement('button');
var t = document.createTextNode("用本地notebook打开");
btn.appendChild(t);

// 设置按钮样式
btn.style.position = "fixed";
btn.style.top = "10px";
btn.style.right = "10px";
btn.style.zIndex = "9999";
btn.style.backgroundColor = "#008CBA";
btn.style.color = "white";
btn.style.border = "none";
btn.style.padding = "10px 20px";
btn.style.fontSize = "16px";
btn.style.cursor = "pointer";

// 绑定点击事件
btn.onclick = function() {
  var url = window.location.href;
  url = url.replace("https", "http");
  url = url.replace("zh.d2l.ai", "localhost:8888/notebooks/pytorch");
  url = url.replace(".html", ".ipynb");
  window.open(url, '_blank');
};

// 添加按钮到页面
document.body.appendChild(btn);


})();