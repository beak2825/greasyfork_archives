// ==UserScript==
// @name         图集岛人物历史记录
// @namespace    http://www.tujidao09.com/
// @version      1.9
// @description  在页面底部生成历史栏，记录人物头像和名称，支持单独删除和一键清空，具有显示和隐藏动画效果。显示和隐藏设置保存在油猴后台。根据点击卡片次数、直接访问与卡片相同链接的访问次数和与卡片链接部分匹配的次数排序。
// @author       William Zhou
// @match   *://*.jimeilu*.com/*
// @match   *://*.tujidao*.com/*
// @match   *://*.sqmuying.com/*
// @include /^https?:\/\/jimeilu[0-9]*\.com\/.*$/
// @include /^https?:\/\/.*\.jimeilu[0-9]*\.com\/.*$/
// @include /^https?:\/\/tujidao[0-9]*\.com\/.*$/
// @include /^https?:\/\/.*\.tujidao[0-9]*\.com\/.*$/
// @include /^https?:\/\/sqmuying[0-9]*\.com\/.*$/
// @include /^https?:\/\/.*\.sqmuying[0-9]*\.com\/.*$/
// @icon         https://www.apple.com.cn/v/iphone/home/bp/images/overview/compare/icon_face_id__eyzciiwkc5oy_large.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478841/%E5%9B%BE%E9%9B%86%E5%B2%9B%E4%BA%BA%E7%89%A9%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478841/%E5%9B%BE%E9%9B%86%E5%B2%9B%E4%BA%BA%E7%89%A9%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 初始化历史栏
  const historyBar = document.createElement('div');
  historyBar.id = 'history-bar';
  historyBar.style.height = '146px'; // 修改历史栏高度为146px
  historyBar.style.width = '100%';
  historyBar.style.position = 'fixed';
  historyBar.style.bottom = GM_getValue('historyBarVisible', '-146px'); // 修改初始位置为-146px
  historyBar.style.left = '0';

  // 使用 backdrop-filter 实现半透明模糊背景
  historyBar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  historyBar.style.backdropFilter = 'blur(10px)'; // 背景模糊效果，可以根据需要调整模糊程度

  historyBar.style.transition = 'bottom 0.3s ease-in-out';
  historyBar.style.overflowX = 'auto';
  historyBar.style.whiteSpace = 'nowrap';
  historyBar.style.display = 'block';
  historyBar.style.zIndex = '9999'; // 保持在最上层

  document.body.appendChild(historyBar);

  // 显示/隐藏历史栏按钮
  const toggleButton = document.createElement('button');
  toggleButton.textContent = '🫦';
  toggleButton.style.position = 'fixed'; // 将按钮固定在页面上
  toggleButton.style.left = '10px';
  toggleButton.style.bottom = '10px'; // 调整按钮距离页面顶部的位置
  toggleButton.style.zIndex = '9999'; // 确保按钮在页面最顶层
  toggleButton.addEventListener('click', () => {
    const isVisible = historyBar.style.bottom === '0px';
    historyBar.style.bottom = isVisible ? '-146px' : '0px';
    GM_setValue('historyBarVisible', isVisible ? '-146px' : '0px');
  });

  document.body.appendChild(toggleButton);


  // Helper 函数：创建人物卡片
  function createCharacterCard(imageURL, name, link) {
    const card = document.createElement('div');
    card.style.display = 'inline-block';
    card.style.padding = '10px';
    card.style.margin = '5px';
    card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    card.style.borderRadius = '5px';
    card.style.cursor = 'pointer';

    const avatar = document.createElement('img');
    avatar.src = imageURL;
    avatar.style.width = '80px';
    avatar.style.height = '80px';
    avatar.style.borderRadius = '50%';
    avatar.style.display = 'block';
    avatar.style.margin = '0 auto';

    const characterName = document.createElement('div');
    characterName.textContent = name;
    characterName.style.textAlign = 'center';

    card.appendChild(avatar);
    card.appendChild(characterName);

    // 点击卡片打开链接
    card.addEventListener('click', () => {
      // 记录点击次数
      let clickCount = GM_getValue(link, 0) || 0;
      clickCount++;
      GM_setValue(link, clickCount);

      // 记录直接访问次数
      let directAccessCount = GM_getValue(`direct_${link}`, 0) || 0;
      directAccessCount++;
      GM_setValue(`direct_${link}`, directAccessCount);

      window.location.href = link;
    });

    // 单独删除卡片
    card.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      historyBar.removeChild(card);
      const updatedHistory = savedHistory.filter((item) => item.href !== link);
      GM_setValue('history', updatedHistory);
    });

    return card;
  }

  // 获取已保存的历史记录，如果没有数据则初始化为空数组
  const savedHistory = GM_getValue('history', []);

  // 创建历史栏中的卡片
  for (const item of savedHistory) {
    const { imageURL, name, href } = item;
    const characterCard = createCharacterCard(imageURL, name, href);
    historyBar.appendChild(characterCard);
  }

  // 遍历页面寻找符合条件的链接并创建卡片
  const links = document.querySelectorAll('a[href^="/t/?id="]');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (href.includes('&page=')) {
      continue; // 排除带有 &page= 参数的链接
    }
    if (savedHistory.some((item) => item.href === href)) {
      continue; // 排除重复项
    }
    const imageURL = `https://picew6d4ew.82pic.com${href.replace('/t/?id=', '/t/')}.jpg`;
    const name = link.textContent;
    const characterCard = createCharacterCard(imageURL, name, href);
    historyBar.appendChild(characterCard);
    savedHistory.push({ href, imageURL, name });
  }

  // 根据点击卡片次数、直接访问与卡片相同链接的访问次数和匹配地址栏的次数排序
  savedHistory.sort((a, b) => {
    const clickCountA = GM_getValue(a.href, 0) || 0;
    const directAccessCountA = GM_getValue(`direct_${a.href}`, 0) || 0;
    const matchCountA = GM_getValue(`match_${a.href}`, 0) || 0;
    const totalA = clickCountA + directAccessCountA + matchCountA;

    const clickCountB = GM_getValue(b.href, 0) || 0;
    const directAccessCountB = GM_getValue(`direct_${b.href}`, 0) || 0;
    const matchCountB = GM_getValue(`match_${b.href}`, 0) || 0;
    const totalB = clickCountB + directAccessCountB + matchCountB;

    return totalB - totalA;
  });

  // 保存历史记录
  GM_setValue('history', savedHistory);

  // 匹配地址栏的URL
  const currentURL = window.location.href;
  for (const item of savedHistory) {
    const { href } = item;
    if (currentURL.includes(href)) { // 修改此行以匹配地址栏URL与卡片链接的一部分
      let matchCount = GM_getValue(`match_${href}`, 0) || 0;
      matchCount++;
      GM_setValue(`match_${href}`, matchCount);
    }
  }
})();

