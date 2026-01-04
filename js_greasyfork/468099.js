// ==UserScript==
// @name         通义听语文件排序
// @namespace    https://ymjin.blog.csdn.net/
// @version      0.2
// @license      AGPL License
// @description  实现对通义听语的列表和导入阿里云文件时进行排序
// @author       明金同学
// @match        *://tingwu.aliyun.com/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468099/%E9%80%9A%E4%B9%89%E5%90%AC%E8%AF%AD%E6%96%87%E4%BB%B6%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468099/%E9%80%9A%E4%B9%89%E5%90%AC%E8%AF%AD%E6%96%87%E4%BB%B6%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 声明排序方向变量，默认为升序
  let sortDirection = 'asc';
  // 定义一个标志变量，用于标识当前的排序状态，初始值为 true，代表升序
  var ascending = true;
  // 定义一个标志变量，用于标识监听器是否已经添加，初始值为 false
  var listenerAdded = false;

  // 定义我们的排序和监听器添加函数
  function sortAndListen (element) {
    // 点击事件
    element.addEventListener('click', function () {
      // 1. 选取元素
      var elements = document.querySelectorAll('.ant-list-item');

      // 2. 放入数组
      var elementsArray = Array.from(elements);

      // 3. 排序
      elementsArray.sort(function (a, b) {
        var aTitle = a.querySelector('.ant-list-item-meta-title div').textContent;
        var bTitle = b.querySelector('.ant-list-item-meta-title div').textContent;
        // 根据 ascending 变量的值决定是升序还是降序
        return ascending ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
      });

      // 4. 获取元素的父容器并插入排序后的元素
      var container = elements[0].parentNode;
      elementsArray.forEach(function (element) {
        container.appendChild(element);
      });

      // 每次点击后，反转排序状态
      ascending = !ascending;
    });

    // 设置监听器已经添加的标志
    listenerAdded = true;
  }
  // MutationObserver 回调
  function callback (mutationsList, observera) {
    // 检查是否已经添加了监听器，如果已经添加了，那么就断开 observera
    if (listenerAdded) {
      observera.disconnect();
      return;
    }
    // 检查每一个 mutation
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        var element = document.querySelector('.sc-keuYuY.ioFVbe');
        if (element) {
          sortAndListen(element);
          break;
        }
      }
    }
  }

  function sortElements (selector, attribute) {
    // 选取元素
    var elements = document.querySelectorAll('.sc-kBRoID.bnHVRk');
    if (!elements.length) {
      console.error('No elements found for selector ".sc-kBRoID.bnHVRk"');
      return;
    }

    // 放入数组
    var elementsArray = Array.from(elements);

    // 从数组中移除.sc-eZYNyq fLbdNx
    var excludeElement = document.querySelector('.sc-eZYNyq.fLbdNx');
    if (excludeElement) {
      var index = elementsArray.indexOf(excludeElement);
      if (index > -1) {
        elementsArray.splice(index, 1);
      }
    }

    // 排序
    elementsArray.sort(function (a, b) {
      var aAttribute = a.querySelector(selector).textContent;
      var bAttribute = b.querySelector(selector).textContent;

      // 如果选择的是时长，将其转换为秒
      if (selector === '.sc-iLLODe.dyILtT') {
        aAttribute = aAttribute.split(':').reduce((acc, time) => (60 * acc) + +time);
        bAttribute = bAttribute.split(':').reduce((acc, time) => (60 * acc) + +time);
      }
      // 如果选择的是文件大小，将其转换为数字
      else if (selector === '.sc-iLLODe.dyILwY') {
        aAttribute = parseFloat(aAttribute);
        bAttribute = parseFloat(bAttribute);
      }
      // 如果选择的是创建时间，将其转换为Date对象
      else if (selector === '.sc-iLLODe.dyIKAj') {
        const today = new Date().toISOString().split('T')[0];
        aAttribute = new Date(aAttribute.replace('今天', today));
        bAttribute = new Date(bAttribute.replace('今天', today));
      }

      // 根据sortDirection变量选择排序方向
      if (sortDirection === 'asc') {
        return aAttribute > bAttribute ? 1 : -1;
      } else {
        return bAttribute > aAttribute ? 1 : -1;
      }
    });

    // 获取元素的父容器并插入排序后的元素
    var container = document.querySelector('.sc-kBRoID.bnHVRk').parentNode;
    if (!container) {
      console.error('No parent container found for selector ".sc-kBRoID.bnHVRk"');
      return;
    }

    elementsArray.forEach(function (element) {
      container.appendChild(element);
    });

    // 最后再将被排除的元素添加回来
    if (excludeElement) {
      container.appendChild(excludeElement);
    }

    // 每次排序后更改排序方向
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  }

  // 选取排序元素并添加点击事件监听器
  function addClickListener () {
    ['.sc-bhqpjJ.LwBoU', '.sc-iLLODe.dyILtT', '.sc-iLLODe.dyILwY', '.sc-iLLODe.dyIKAj'].forEach(selector => {
      var sortElement = document.querySelector(selector);
      if (!sortElement) {
        console.error(`No element found for selector "${selector}"`);
      } else {
        // 先移除之前可能添加的监听器，避免循环添加
        sortElement.removeEventListener('click', () => sortElements(selector));
        // 添加监听器
        sortElement.addEventListener('click', () => sortElements(selector));
      }
    });
  }

  // 创建一个 observera 实例
  const observera = new MutationObserver(callback);

  // 配置 observera:
  const config = { attributes: true, childList: true, subtree: true };

  // 开始观察:
  observera.observe(document.body, config);

  // 创建观察器实例
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      // 如果没有新增节点，则返回
      if (!mutation.addedNodes) return

      for (var i = 0; i < mutation.addedNodes.length; i++) {
        // 如果新增的节点是我们需要的.sc-EgOXT ijozuf元素
        if (mutation.addedNodes[i].classList.contains('sc-EgOXT') && mutation.addedNodes[i].classList.contains('ijozuf')) {
          // 添加点击事件监听器
          addClickListener();
          break;
        }
      }
    })
  });

  // 传入观察目标对象及观察选项
  observer.observe(document.body, {
    childList: true, // 子节点的变动（指新增，删除或者更改）
    subtree: true, // 所有后代节点的变动
    attributes: false, // 属性的变动
    characterData: false // 数据的变动
  });

})();
