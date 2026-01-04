// ==UserScript==
// @name         美团券搜索
// @license      MIT
// @version      1.8
// @description  注意需要请求手机页面，先登录账户后，获取列表
// @author       Bingo95
// @match        https://offsiteact.meituan.com/web/hoae/collection_waimai_v8/index.html*
// @grant        none
// @namespace https://greasyfork.org/users/1312821
// @downloadURL https://update.greasyfork.org/scripts/497642/%E7%BE%8E%E5%9B%A2%E5%88%B8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/497642/%E7%BE%8E%E5%9B%A2%E5%88%B8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 创建UI元素
  function createUI() {
    // 创建搜索框
    const searchBox = document.createElement('input');
    searchBox.type = 'search';
    searchBox.placeholder = '输入商家名称搜索...';
    searchBox.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 40px;
            padding: 5px 15px;
            border: 1px solid #ccc;
            border-radius: 20px;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        `;

    // 创建加载按钮
    const loadButton = document.createElement('button');
    loadButton.textContent = '加载更多';
    loadButton.style.cssText = `
            position: fixed;
            top: 40px;
            right: 20px;
            padding: 0 20px;
            height: 40px;
            border: none;
            border-radius: 20px;
            background: #FFC107;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;

    // 创建券面值排序按钮
    const sortButton = document.createElement('button');
    sortButton.textContent = '券面值排序';
    sortButton.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 0 20px;
            height: 40px;
            border: none;
            border-radius: 20px;
            background: #4CAF50;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;

    // 创建计数器
    const counter = document.createElement('div');
    counter.id = 'shop-counter';
    counter.style.cssText = `
            position: fixed;
            top: 40px;
            left: 20px;
            padding: 0 15px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            color: #666;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        `;

    document.body.appendChild(searchBox);
    document.body.appendChild(loadButton);
    document.body.appendChild(sortButton);
    document.body.appendChild(counter);

    return { searchBox, loadButton, sortButton, counter };
  }

  // 加载更多数据
  let loadInterval = null;
  let isLoading = false;
  function loadMoreData(loadButton) {
    if (isLoading) {
      // 停止加载
      clearInterval(loadInterval);
      isLoading = false;
      loadButton.textContent = '继续加载';
      loadButton.style.background = '#FFC107';
      loadButton.disabled = false;
      return;
    }
    // 开始加载
    isLoading = true;
    loadButton.textContent = '停止加载';
    loadButton.style.background = '#f44336';
    loadButton.disabled = false;
    let lastCount = 0;
    let sameCountTimes = 0;
    loadInterval = setInterval(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo(0, scrollHeight);
      const currentCount = document.querySelectorAll(
        '.index-module__poiCardContainer___L28Xd'
      ).length;
      // 如果连续3次数量没变化,认为加载完成
      if (currentCount === lastCount) {
        sameCountTimes++;
        if (sameCountTimes >= 3) {
          clearInterval(loadInterval);
          isLoading = false;
          loadButton.textContent = '加载完成';
          loadButton.style.background = '#ccc';
          loadButton.disabled = false;
        }
      } else {
        sameCountTimes = 0;
        lastCount = currentCount;
      }
    }, 1000);
  }
  // 搜索商家
  function searchShops(keyword) {
    const shops = document.querySelectorAll(
      '.index-module__poiCardContainer___L28Xd'
    );
    let visibleCount = 0;

    shops.forEach((shop) => {
      const name = shop.querySelector('.name').textContent.trim();
      if (keyword && !name.toLowerCase().includes(keyword.toLowerCase())) {
        shop.style.display = 'none';
      } else {
        shop.style.display = 'block';
        visibleCount++;
      }
    });

    // 更新计数器
    const counter = document.getElementById('shop-counter');
    if (counter) {
      counter.textContent = `${visibleCount}/${shops.length}`;
    }
  }

  // 监听列表是否加载完成
  function observeListLoading(loadButton) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const nodes = Array.from(mutation.addedNodes);
        nodes.forEach((node) => {
          if (node.nodeType === 1 && node.textContent.includes('没有更多了')) {
            loadButton.textContent = '已加载完成';
            loadButton.style.background = '#ccc';
            loadButton.disabled = false;
            observer.disconnect();
            console.log('列表加载完成');
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // 券面值排序功能
  function sortCouponsByValue() {
    // 获取所有商家卡片
    const shopCards = Array.from(
      document.querySelectorAll('.index-module__poiCardContainer___L28Xd')
    );
    if (shopCards.length === 0) return;

    // 获取父容器
    const parent = shopCards[0].parentNode;

    // 提取每个卡片下最大券面值
    const cardWithValue = shopCards.map((card) => {
      // 查找所有券
      const coupons = Array.from(card.querySelectorAll('.poiCoupon .value'));
      // 提取所有券面值
      const values = coupons.map((v) => parseFloat(v.textContent.trim()) || 0);
      // 取最大值
      const maxValue = values.length ? Math.max(...values) : 0;
      return { card, maxValue };
    });

    // 按最大券面值降序排序
    cardWithValue.sort((a, b) => b.maxValue - a.maxValue);

    // 重新插入到父容器
    cardWithValue.forEach(({ card }) => {
      parent.appendChild(card);
    });
  }

  // 初始化
  function init() {
    const { searchBox, loadButton, sortButton, counter } = createUI();

    // 添加搜索事件
    searchBox.addEventListener('input', (e) => {
      searchShops(e.target.value.trim());
    });

    // 添加加载按钮事件
    loadButton.addEventListener('click', function () {
      loadMoreData(loadButton);
    });

    // 添加券面值排序按钮事件
    sortButton.addEventListener('click', sortCouponsByValue);

    // 监听列表加载状态
    observeListLoading(loadButton);

    // 初始计数
    searchShops('');
  }

  // 等待页面加载完成后执行
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
