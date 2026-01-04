// ==UserScript==
// @name         公众号舆情抓取
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  wx公众号舆情抓取
// @author       daben
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520795/%E5%85%AC%E4%BC%97%E5%8F%B7%E8%88%86%E6%83%85%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520795/%E5%85%AC%E4%BC%97%E5%8F%B7%E8%88%86%E6%83%85%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('load', function() {
    // 获取标题，这里假设标题元素是h1标签，可根据实际调整选择器
    var titleElement = document.querySelector('h1');
    var title = titleElement? titleElement.textContent.trim() : '未获取到标题';
    // 获取作者，假设作者信息在class为"author"的元素内，需按实际修改选择器
    var authorElement = document.querySelector('#js_name');
    var author = authorElement? authorElement.textContent.trim() : '未获取到作者';
    // 获取发布时间，假设在class为"publish-time"的元素内，按需修改选择器
    var timeElement = document.querySelector('#publish_time');
    var time = timeElement? timeElement.textContent.trim() : '未获取到发布时间';
    // 获取文章内容所在元素，假设文章内容在id为"article-content"的元素内，按实际调整
    var contentElement = document.getElementById('js_content');
    var wordCount = contentElement? contentElement.textContent.trim().length : 0;

    // 创建一个用于显示信息的div元素作为浮窗
    var infoDiv = document.createElement('div');
    infoDiv.style.position = 'fixed';
    infoDiv.style.top = '0';
    infoDiv.style.right = '0';
    infoDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    infoDiv.style.padding = '10px';
    infoDiv.style.border = '1px solid gray';
    infoDiv.style.zIndex = '9999';

    // 创建关闭按钮元素
    var closeButton = document.createElement('span');
    closeButton.id = '__close_btn__';
    closeButton.textContent = '×';
    closeButton.style.cursor = 'pointer';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '18px';
    closeButton.style.color = 'red';

    // 创建复制按钮元素
    var copyButton = document.createElement('span');
    copyButton.id = '__copy__';
    copyButton.textContent = '复制';
    copyButton.style.cursor = 'pointer';
    copyButton.style.float = 'right';
    copyButton.style.marginRight = '5px';
    copyButton.style.fontSize = '18px';
    copyButton.style.color = 'blue';

    // 先将关闭按钮添加到浮窗中
    infoDiv.appendChild(closeButton);
    // 再将复制按钮添加到浮窗中
    infoDiv.appendChild(copyButton);

    // 将信息拼接成字符串并设置到浮窗的innerHTML中
    var infoText = `标题：${title}<br>作者：${author}<br>发布时间：${time}<br>字数：${wordCount}`;
    infoDiv.innerHTML += infoText;

    // 将浮窗添加到页面的body元素中
    document.body.appendChild(infoDiv);

    document.querySelector('#__close_btn__').addEventListener('click', function() {
      infoDiv.parentNode.removeChild(infoDiv);
    });

    document.querySelector('#__copy__').onclick = function() {
      var copyText = `${time.replace(/[年月]/g, '/').replace(/日/, '')}\t公众号\t${author}\t${title}\t${window.location.href}\t阅读 点赞 转发 在看 评论\t${wordCount}`;
      navigator.clipboard.writeText(copyText).then(function() {
        console.log('已复制到剪贴板');
      }).catch(function(err) {
        console.error('复制失败：', err);
      });
    };
  });
})();