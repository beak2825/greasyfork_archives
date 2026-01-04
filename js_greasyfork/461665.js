// ==UserScript==
// @name         Get Douban Movie Info
// @namespace    http://tampermonkey/net/
// @version      1.11
// @description  Get movie info from Douban website.
// @author       Your Name
// @match        https://www.xiaohongshu.com/user/profile/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461665/Get%20Douban%20Movie%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/461665/Get%20Douban%20Movie%20Info.meta.js
// ==/UserScript==


function sendPostRequest(arr) {
    console.log("success");
  
    // 创建XMLHttpRequest对象
    let xhr = new XMLHttpRequest();
    
    // 监听请求状态变化
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          // 输出响应内容
          console.log(this.responseText);
        } else {
          // 输出错误信息
          console.error('Error occurred: ' + this.statusText);
        }
      }
    };
   
    // 指定POST请求方式和接口路径
    xhr.open('POST', 'http://localhost:3000/putInfo');
    
    // 设置请求头信息
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    
    // 发送数据并处理异常情况
    try {
      xhr.send(JSON.stringify(arr));
    } catch (error) {
      console.error(error);
    }
  }
  
function getImageUrl(element) {
    let backgroundImageUrl = element.style.backgroundImage;
  
    // 提取出链接部分并输出结果
    let urlStart = 'url("';
    let urlEnd = '")';
    let startIndex = backgroundImageUrl.indexOf(urlStart) + urlStart.length;
    let endIndex = backgroundImageUrl.indexOf(urlEnd, startIndex);
    let url = backgroundImageUrl.substring(startIndex, endIndex);
    return url
  }
  
  function getInfo(arrList,titleMap) {
    let itemList = [...document.querySelectorAll('.note-item')];
    const InitNum = 10;
    itemList.forEach((p) => {
      let title = p.querySelector('.title').innerText;
      if (!titleMap.has(title)) {
        let num = p.querySelector('.count').innerText;
        let element = p.querySelector('.cover');
        let titleUrl = element.href;
        let imgUrl = getImageUrl(element);
        let name = p.querySelector('.name').innerText;
        arrList.push({
          title,
          imgUrl,
          titleUrl,
          num,
          name
        });
        titleMap.set(title,1);
      }
    })
    return arrList;
  }
  
  function start() {
    let arrList = [];
    let titleMap = new Map();
    function fn() {
  
    }
  
    function scrollToBottom() {
      const interval = 100; // 每次滚动间隔时间（毫秒）
      const distance = 280; // 每次垂直滚动距离（像素）
      let timer = null;
  
      // 定义滚动函数
      function scroll() {
        // 更新滚动位置
        window.scrollTo(0, document.documentElement.scrollTop + distance);
        getInfo(arrList,titleMap);
        if (document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight) {
          // 如果未滚动到底部，则继续滚动
          timer = setTimeout(scroll, interval);
  
        } else {
          // 如果已经滚动到底部，则取消定时器
          sendPostRequest(arrList)
          clearTimeout(timer);
        }
      }
  
      // 开始滚动
      timer = setTimeout(scroll, interval);
    }
  
    // 调用scrollToBottom()函数，并传入回调函数作为参数
    scrollToBottom();
  };
  

  (function() {
    'use strict';
  
    // 创建按钮元素
    const button = document.createElement('button');
    button.innerHTML = '爬取信息';
  
    // 添加样式和类名
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#FFFFFF';
    button.style.borderRadius = '5px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.25)';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '10%';
    button.style.zIndex = '9999';
  
    // 添加元素到页面中
    document.body.appendChild(button);
  
    // 监听按钮的点击事件
    button.addEventListener('click', start);
  })();
  