// ==UserScript==
// @name         抖音下载图片
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  抖音图文下载图片
// @author       fightingHawk
// @match        *://*.douyin.com/note/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450467/%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/450467/%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

var index = 1;

(function() {
    'use strict';
    // 1. 暂停播放音乐
    document.getElementsByTagName('audio')[0].pause(); // 获取audio元素并暂停播放音乐
    // 2. 添加按钮
    addButton();
})();

// 2. 添加一个下载按钮到页面上
function addButton() {
    let ul = document.getElementsByClassName('RypxtTsf')[0]; // 获取私信节点
    let myUl = document.createElement('ul'); // 创建一个ul节点
    let button = document.createElement('button'); // 创建一个按钮节点
    button.innerText = '下载'; // 设置按钮显示文本
    button.onclick = getImgs; // 设置按钮点击事件
    myUl.appendChild(button); // 将按钮添加到自己创建的ul节点内部
    ul.after(myUl); // 在私信节点后追加自创建的ul节点
}

// 3. 点击下载按钮获取所有图片url
function getImgs() {
    let imgs = document.getElementsByClassName('V5BLJkWV'); // 获取所有图片（.webp）
    // 遍历图片数组
    for (let i = 0; i < imgs.length; i++) {
        let url = imgs[i].src; // 获取图片的url
        download(url); // 下载
    }
}

// 4. 根据url下载图片
function download(url) {
     //文件的下载，看不懂，反正是网上抄的
      var x = new XMLHttpRequest();
      x.open("GET", url, true);
      x.responseType = 'blob';
      x.onload = function (e) {
        var newUrl = window.URL.createObjectURL(x.response);
        var a = document.createElement('a');
        a.href = newUrl;
        a.download = 'img_' + index + '.webp'; //下载后的文件名
        a.click();
        index++;
      }
      x.send();
}