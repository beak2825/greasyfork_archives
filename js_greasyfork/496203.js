// ==UserScript==
// @name        Bit Enhancement
// @namespace    http://tampermonkey.net/
// @version      2024-5-28-1
// @description  用于增强Bit的功能, 自动生成commit信息.
// @author       You
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.js
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @match        https://bitlive.theronuat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theronuat.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496203/Bit%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/496203/Bit%20Enhancement.meta.js
// ==/UserScript==
(function ($) {
  // 'use strict';
  // 添加样式表
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css';
  document.head.appendChild(link);
  const classname =
    '.antd-pro-pages-product-product-detail-activesprint-components-sprint-card-singleTask';
  function copyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }

  // 处理单个任务的函数
  function processTask(element) {
    const task = $(element);
    console.log('task: ', task);

    // 如果已经添加过copy按钮, 则不再添加
    if (task.find('#copybtn').length > 0) {
      return;
    }

    // 设置元素position为relative
    task.css('position', 'relative');
    // 创建一个button元素, copy按钮, position为absolute, top为30, right为8
    const copyBtn = $('<button id="copybtn">Copy</button>').css({
      width: ' 50px',
      position: 'absolute',
      top: '50px',
      right: 0,
      height: 'calc(100% - 50px)',
      background: '#ffbb94',
      opacity: 0.3,
    });
    // 给copy按钮添加点击事件
    // 将copy按钮添加到任务元素中
    task.append(copyBtn);
    // 拿到antd-pro-pages-product-product-detail-activesprint-components-sprint-card-summary下面的文本内容
    const summary = task.find(
      '.antd-pro-pages-product-product-detail-activesprint-components-sprint-card-summary',
    );
    const summaryText = summary[0].innerText;
    // 拿到antd-pro-pages-product-product-detail-activesprint-components-sprint-card-code下面的span标签内容
    const code = task
      .find('.antd-pro-pages-product-product-detail-activesprint-components-sprint-card-code span')
      .text().trim();
    // 拼接commit message
    copyBtn.on('click', function (e) {
      const title = $('.antd-pro-pages-product-product-detail-activesprint-index-header h2').text();
      // 过滤出60
      // 查找子元素<use xlink:href="#icon-bug"></use>
      let type = 'feat';
      if (task.find('use').attr('xlink:href') === '#icon-bug') {
        type = 'fix';
      }

      const sprint = title.match(/\d+/)[0];
      const commitMessage = `${type}(${code}): SP${sprint} - ${summaryText}`;
      e.preventDefault();
      e.stopPropagation();
      copyTextToClipboard(commitMessage);
      var notyf = new Notyf();

      notyf.success('Copy success: ' + commitMessage);
    });
  }
  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // 检查是否有新的任务元素被添加

        mutation.addedNodes.forEach((node) => {
          if ($(node).find(classname).length > 0) {
            $(node)
              .find(classname)
              .each((index, element) => {
                processTask(element);
              });
          }
        });
      }
    }
  });
  let timer = null;
  timer = setInterval(() => {
    // 配置观察器选项
    const config = { childList: true, subtree: true };

    // 选择需要观察变动的节点
    const targetNode = document.querySelector(
      '.antd-pro-pages-product-product-detail-activesprint-containers-sprint-board-container',
    );

    // 如果目标节点存在，开始观察
    if (targetNode) {
      observer.observe(targetNode, config);
      clearInterval(timer);
    }
  }, 100);

  // Your code here...
})($);
