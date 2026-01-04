// ==UserScript==
// @name         百度优化
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  添加一个按钮，点击按钮可以随机改变百度首页的背景颜色，并在下次进入页面时自动应用上次设置的颜色。同时，在页面的右上角显示微博的热搜内容。
// @author       您的姓名
// @match        https://www.baidu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487675/%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/487675/%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 屏蔽广告
  var blockAds = function() {
    var ads = document.querySelectorAll('[data-tuiguang]');
    ads.forEach(function(ad) {
      ad.style.display = 'none';
    });
  };

  // 执行屏蔽广告操作
  blockAds();

  // 创建一个按钮元素
  var button = document.createElement('button');
  button.innerText = '变色';

  // 设置按钮样式
  button.style.position = 'fixed';
  button.style.top = '18px';
  button.style.right = '23px';
  button.style.width = '49px';
  button.style.height = '28px';
  button.style.zIndex = '9999';

  // 将按钮添加到页面中
  document.body.appendChild(button);

  // 如果当前页面是百度首页 https://www.baidu.com/ 才显示微博热搜内容
  if (window.location.href === 'https://www.baidu.com/') {
    // 创建一个容器元素用于显示微博热搜
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '60px';
    container.style.left = '10px'; // 调整左侧位置
    container.style.width = '300px';
    container.style.height = '50%'; // 调整高度
    container.style.padding = '10px';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    container.style.zIndex = '9999';
    container.style.fontSize = '14px';
    container.style.overflow = 'auto';
    container.style.textAlign = 'left';
    // 将容器添加到页面中
    document.body.appendChild(container);

    // 使用GM_xmlhttpRequest获取微博热搜数据
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://api.wetab.link/api/hotsearch/list?type=weibo',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'api.wetab.link',
        'I-App': 'hitab',
        'I-Branch': 'zh',
        'I-Lang': 'zh-CN',
        'I-Platform': 'chrome',
        'I-Version': '1.6.4',
        'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'none',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      },
      onload: function(response) {
        if (response.status === 200) {
          var data = JSON.parse(response.responseText);
          // 解析热搜数据
          var hotTopics = data.data.list;

          // 将热搜内容插入到容器中
          hotTopics.forEach((topic, index) => {
            var topicElement = document.createElement('a');
            topicElement.href = topic.url;
            topicElement.target = '_blank';
            topicElement.innerText = (index + 1) + '. ' + topic.title;
            topicElement.style.display = 'block';
            container.appendChild(topicElement);
          });
        } else {
          console.error('Failed to fetch hot topics:', response);
        }
      }
    });
  }

  // 定义随机生成颜色的函数
  function getRandomColor() {
    var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    color += '33';
    return color;
  }

  // 从本地存储中获取上次保存的颜色
  var lastColor = GM_getValue('baiduBackgroundColor');

  // 如果有上次保存的颜色，则应用到页面的背景颜色
  if (lastColor) {
    document.body.style.backgroundColor = lastColor;
    document.getElementById('s_top_wrap').style.backgroundColor = lastColor;
    document.getElementById('bottom_layer').style.backgroundColor = lastColor;
    if (container) {
      container.style.backgroundColor = lastColor;
    }
  }

  // 点击按钮时改变页面背景颜色，并保存到本地存储中
  button.addEventListener('click', function() {
    var color = getRandomColor();
    document.body.style.backgroundColor = color;
    document.getElementById('s_top_wrap').style.backgroundColor = color;
    if (container) {
      container.style.backgroundColor = color;
      container.style.opacity = '0.9'; // 设置热搜容器的透明度与页面背景一致
    }
    GM_setValue('baiduBackgroundColor', color);
  });

})();
