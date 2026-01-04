// ==UserScript==
// @name         Taobao 自动搜索-隐私保护
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动搜索关键词，每隔随机时间4-8秒，并提供设置窗口修改关键词列表的功能。
// @author       Your Name
// @match        https://s.taobao.com/search*
// @match        https://search.jd.com/Search*
// @match        https://so.m.jd.com/**
// @match        https://www.baidu.com/*
// @match        https://m.baidu.com/**
// @match        https://www.google.com/search*
// @match        https://mobile.pinduoduo.com/search*
// @license      MIT
// @download     https://greasyfork.org/zh-CN/scripts/498687
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498687/Taobao%20%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2-%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/498687/Taobao%20%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2-%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 默认的关键词列表
  let defaultKeywords = [
    "手机壳",
    "夏季连衣裙",
    "蓝牙耳机",
    "厨房清洁刷",
    "运动鞋",
    "护肤品套装",
    "电风扇",
    "办公椅",
    "婴儿推车",
    "速干毛巾",
    "笔记本电脑",
    "智能手表",
    "电饭煲",
    "瑜伽垫",
    "家用扫地机器人",
    "浴室防滑垫",
    "电动牙刷",
    "车载吸尘器",
    "颈椎按摩器",
    "防晒霜",
    "牛仔裤",
    "LED台灯",
    "空调扇",
    "电热水壶",
    "旅行背包",
    "羽绒服",
    "空气净化器",
    "床上四件套",
    "儿童学习桌",
    "车载冰箱",
    "护眼灯",
    "沙发套",
    "洗衣液",
    "插线板",
    "多功能料理机",
    "书架",
    "居家拖鞋",
    "运动手环",
    "猫砂",
    "电动晾衣架",
    "化妆刷套装",
    "电暖器",
    "扫地拖地一体机",
    "遮阳帽",
    "凉席",
    "电煮锅",
    "车载手机支架",
    "自动洗衣机",
    "窗帘"
  ];

  // 定义一个变量来跟踪脚本是否正在运行
  let isRunning = true;

  // 从localStorage获取设置
  let settings = JSON.parse(localStorage.getItem('taobaoAutoSearchSettings')) || {
    enabled: true,
    keywords: defaultKeywords,
    category: 'all'
  };

  // 保存设置到localStorage
  function saveSettings() {
    localStorage.setItem('taobaoAutoSearchSettings', JSON.stringify(settings));
  }

  // 获取随机关键词
  function getRandomKeyword() {
    const randomIndex = Math.floor(Math.random() * settings.keywords.length);
    return settings.keywords[randomIndex];
  }

  // 获取随机间隔时间（4-8秒）
  function getRandomInterval() {
    return Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000;
  }

  // 进行搜索
  function searchNextKeyword() {
    if (settings.enabled && isRunning) {

      const keyword = encodeURIComponent(getRandomKeyword());
      let url;

      // 判断当前页面是淘宝还是京东
      if (window.location.hostname.includes('m.taobao.com')) {
        url = `https://main.m.taobao.com/search/index.html?page=1&q=${keyword}&tab=all`;
      } else if (window.location.hostname.includes('taobao.com')) {
        url = `https://s.taobao.com/search?page=1&q=${keyword}&tab=all`;
      } else if (window.location.hostname.includes('m.jd.com')) {
        url = `https://so.m.jd.com/ware/search.action?keyword=${keyword}`;
      } else if (window.location.hostname.includes('jd.com')) {
        url = `https://search.jd.com/Search?keyword=${keyword}`;
      } else if (window.location.hostname.includes('m.baidu.com')) {
        url = `https://m.baidu.com/s?wd=${keyword}`;
      } else if (window.location.hostname.includes('baidu.com')) {
        url = `https://www.baidu.com/s?wd=${keyword}`;
      } else if (window.location.hostname.includes('google.com')) {
        url = `https://www.google.com/search?q=${keyword}`;
      } else if (window.location.hostname.includes('pinduoduo.com')) {
        url = `https://mobile.pinduoduo.com/search_result.html?search_key=${keyword}`;
      }

      window.location.href = url;
    }
  }


  // 创建设置窗口
  function createSettingsWindow() {
    const settingsDiv = document.createElement('div');
    settingsDiv.id = 'settingsDiv';
    Object.assign(settingsDiv.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90vw',
      maxWidth: '400px',
      maxHeight: '80vh',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      padding: '15px',
      overflowY: 'auto',
      zIndex: 99999,
      display: 'none',
      fontSize: '14px'
    });

    const title = document.createElement('h2');
    title.innerText = '自动搜索设置';
    title.textContent = '自动搜索设置';
    title.style.margin = '0 0 15px 0';
    title.style.fontSize = '18px';
    settingsDiv.appendChild(title);

    const enabledCheckboxLabel = document.createElement('label');
    enabledCheckboxLabel.innerText = '启用脚本';
    enabledCheckboxLabel.style.display = 'block';
    settingsDiv.appendChild(enabledCheckboxLabel);

    const enabledCheckbox = document.createElement('input');
    enabledCheckbox.type = 'checkbox';
    enabledCheckbox.checked = settings.enabled;
    enabledCheckbox.onchange = function() {
      settings.enabled = enabledCheckbox.checked;
      saveSettings();
    };
    enabledCheckboxLabel.appendChild(enabledCheckbox);

    const categoryLabel = document.createElement('label');
    categoryLabel.innerText = '偏好类别';
    categoryLabel.style.display = 'block';
    categoryLabel.style.marginTop = '20px';
    settingsDiv.appendChild(categoryLabel);

    const categorySelect = document.createElement('select');
    const categories = ['all', 'fashion', 'electronics', 'home', 'sports'];
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.innerText = category;
      if (settings.category === category) {
        option.selected = true;
      }
      categorySelect.appendChild(option);
    });
    categorySelect.onchange = function() {
      settings.category = categorySelect.value;
      saveSettings();
    };
    settingsDiv.appendChild(categorySelect);

    const keywordsLabel = document.createElement('label');
    keywordsLabel.innerText = '关键词列表';
    keywordsLabel.style.display = 'block';
    keywordsLabel.style.marginTop = '20px';
    settingsDiv.appendChild(keywordsLabel);

    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '200px';
    textarea.value = settings.keywords.join('\n');
    settingsDiv.appendChild(textarea);

    const saveButton = document.createElement('button');
    saveButton.innerText = '保存';
    saveButton.style.display = 'block';
    saveButton.style.marginTop = '20px';
    saveButton.style.padding = '10px';
    saveButton.style.backgroundColor = '#007BFF';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';
    saveButton.onclick = function() {
      settings.keywords = textarea.value.split('\n').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
      saveSettings();
      settingsDiv.style.display = 'none';
    };
    settingsDiv.appendChild(saveButton);

    const closeButton = document.createElement('button');
    closeButton.innerText = '关闭';
    closeButton.style.display = 'block';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '10px';
    closeButton.style.backgroundColor = '#6c757d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
      settingsDiv.style.display = 'none';
    };
    settingsDiv.appendChild(closeButton);

    document.body.appendChild(settingsDiv);
  }

  // 创建悬浮按钮
  function createFloatingButton() {
    const button = document.createElement('button');
    button.innerText = '搜索设置';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '20px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.onclick = function() {
      const settingsDiv = document.getElementById('settingsDiv');
      if (settingsDiv.style.display === 'none') {
        settingsDiv.style.display = 'block';
        isRunning = false;  // 暂停脚本
      } else {
        settingsDiv.style.display = 'none';
        isRunning = true;   // 恢复脚本
        startAutoSearch();  // 重新开始搜索
      }
    };
    document.body.appendChild(button);
  }

  createSettingsWindow();
  createFloatingButton();

  // 设置一个随机的间隔时间，并且执行搜索
  function startAutoSearch() {
    if (settings.enabled) {
      setTimeout(function() {
        searchNextKeyword();
        startAutoSearch();
      }, getRandomInterval());
    }
  }

  startAutoSearch();
})();
