// ==UserScript==
// @name         百度舆情抓取
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  百度百家号舆情抓取
// @author       daben
// @match        https://baijiahao.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520794/%E7%99%BE%E5%BA%A6%E8%88%86%E6%83%85%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520794/%E7%99%BE%E5%BA%A6%E8%88%86%E6%83%85%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function getArticleNum(domSelector, defaultText) {
    var el = document.querySelector(domSelector);
    var num = el ? el.textContent.trim() : 0;
    return /^\d+$/.test(num) ? num : defaultText;
  }
  function getCopyNum(numText) {
    return /^\d+$/.test(numText) ? numText : (parseInt(numText) || 0)
  }

  window.addEventListener('load', function() {
    // 获取标题，这里假设标题元素是h1标签，可根据实际调整选择器
    var titleElement = document.querySelector('#header div');
    var title = titleElement? titleElement.textContent.trim() : '未获取到标题';
    // 获取作者，假设作者信息在class为"author"的元素内，需按实际修改选择器
    var authorElement = document.querySelector('#header [data-testid=author-name]');
    var author = authorElement? authorElement.textContent.trim() : '未获取到作者';
    // 获取发布时间，假设在class为"publish-time"的元素内，按需修改选择器
    var timeElement = document.querySelector('#header [data-testid=updatetime]');
    var time = timeElement? timeElement.textContent.trim() : '未获取到发布时间';
    // 获取文章内容所在元素，假设文章内容在id为"article-content"的元素内，按实际调整
    var contentElement = document.querySelector('[data-testid=article]');
    var wordCount = contentElement? contentElement.textContent.trim().length : 0;
    // 点赞数
    var likeNum = getArticleNum('[data-testid=like-btn] .interact-desc', '未获取到点赞数')
    // 评论数
    var commentNum = getArticleNum('[data-testid=comment-btn] .interact-desc', '未获取到评论数')
    // 收藏数
    var collectNum = getArticleNum('[data-testid=favor-btn] .interact-desc', '未获取到收藏数')
    // 分享数
    var shareNum = getArticleNum('[data-testid=share-btn] .interact-desc', '未获取到分享数')

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
    var infoText = `标题：${title}<br>作者：${author}<br>发布时间：${time}<br>字数：${wordCount}<br>点赞数：${likeNum}<br>评论数：${commentNum}<br>收藏数：${collectNum}<br>分享数：${shareNum}`;
    infoDiv.innerHTML += infoText;

    // 将浮窗添加到页面的body元素中
    document.body.appendChild(infoDiv);

    document.querySelector('#__close_btn__').addEventListener('click', function() {
      infoDiv.parentNode.removeChild(infoDiv);
    });

    document.querySelector('#__copy__').onclick = function() {
      var copyText = `${time.replace(/[年月]/g, '/').replace(/日/, '')}\t百度\t${author}\t${title}\t${window.location.href}\t点赞${getCopyNum(likeNum)} 转发${getCopyNum(shareNum)} 评论${getCopyNum(commentNum)} 收藏${getCopyNum(collectNum)}\t${wordCount}`;
      navigator.clipboard.writeText(copyText).then(function() {
        console.log('已复制到剪贴板');
      }).catch(function(err) {
        console.error('复制失败：', err);
      });
    };
  });
})();