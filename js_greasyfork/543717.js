// ==UserScript==
// @name        Solscan重定向
// @namespace   Violentmonkey Scripts
// @match       https://solscan.io/*
// @grant       none
// @version     1.3
// @author      memeslayer
// @license     MIT
// @description 重定向 Solscan 账户页面到带有过滤参数的 URL，包括页面内跳转
// @downloadURL https://update.greasyfork.org/scripts/543717/Solscan%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/543717/Solscan%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let redirectEnabled = true; // 添加一个变量来控制跳转功能

  function toggleRedirect() {
    redirectEnabled = !redirectEnabled; // 切换跳转功能的状态
    const buttonText = redirectEnabled ? '关' : '开'; // 修正按钮文本逻辑
    document.getElementById('toggleRedirectButton').innerText = buttonText; // 更新按钮显示
  }

  function redirectIfAccountPage() {
    if (!redirectEnabled) return; // 如果跳转功能被关闭，直接返回

    const currentUrl = window.location.href;
    // 匹配三种URL模式
    const plainPattern = /^https:\/\/solscan\.io\/account\/[^?#]+$/;
    const transfersPattern = /^https:\/\/solscan\.io\/account\/[^?#]+#transfers$/;
    const defiPattern = /^https:\/\/solscan\.io\/account\/[^?#]+#defiactivities$/;

    if (plainPattern.test(currentUrl) || transfersPattern.test(currentUrl)) {
      // 处理普通账户页面和transfers页面重定向
      const accountAddress = currentUrl.split('/').pop().split('#')[0];
      const newUrl = `https://solscan.io/account/${accountAddress}?activity_type=ACTIVITY_SPL_TRANSFER&remove_spam=true&exclude_amount_zero=true&flow=in&value=100&value=undefined&token_address=So11111111111111111111111111111111111111111#transfers`;
      if (currentUrl !== newUrl) {
        window.location.replace(newUrl);
      }
    } else if (defiPattern.test(currentUrl)) {
      // 处理defi活动页面重定向
      const accountAddress = currentUrl.split('/').pop().split('#')[0];
      const newUrl = `https://solscan.io/account/${accountAddress}?activity_type=ACTIVITY_SPL_INIT_MINT&activity_type=ACTIVITY_TOKEN_ADD_LIQ&activity_type=ACTIVITY_TOKEN_REMOVE_LIQ#defiactivities`;
      if (currentUrl !== newUrl) {
        window.location.replace(newUrl);
      }
    }
  }

  // 初始页面加载时检查
  redirectIfAccountPage();

  // 监听 pushState 和 replaceState 方法的变化
  (function(history){
    const pushState = history.pushState;
    history.pushState = function(state) {
      if (typeof history.onpushstate == "function") {
        history.onpushstate({state: state});
      }
      setTimeout(redirectIfAccountPage, 0);
      return pushState.apply(history, arguments);
    };

    const replaceState = history.replaceState;
    history.replaceState = function (state) {
      if (typeof history.onreplacestate == "function") {
        history.onreplacestate({ state: state });
      }
      setTimeout(redirectIfAccountPage, 0);
      return replaceState.apply(history, arguments);
    };

    window.addEventListener('popstate', function(event) {
      redirectIfAccountPage();
    });
  })(window.history);

  // 创建悬浮窗
  const floatingWindow = document.createElement('div');
  floatingWindow.style.position = 'fixed';
  floatingWindow.style.top = '20%';
  floatingWindow.style.right = '20px';
  floatingWindow.style.width = '300px';
  floatingWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  floatingWindow.style.padding = '15px';
  floatingWindow.style.borderRadius = '10px';
  floatingWindow.style.color = 'white';
  floatingWindow.style.zIndex = '999';
  floatingWindow.style.fontSize = '14px';
  floatingWindow.style.lineHeight = '1.5';
  floatingWindow.style.display = 'none'; // 默认隐藏

  // 设置悬浮窗内容
  floatingWindow.innerHTML = `
    <div style="margin-bottom: 10px;"><span style="color: red;">rug?</span></div>
    <div style="margin-bottom: 5px;">changenow 南美 非托管</div>
    <div style="margin-bottom: 5px;">Bitkub 泰国</div>
    <div style="margin-bottom: 5px;">Bitso 墨西哥</div>
    <div style="margin-bottom: 5px;">CoinDCX 印度</div>
    <div style="margin-bottom: 5px;">KuCoin 塞舌尔</div>
    <div style="margin-bottom: 5px;">Indodax 印尼</div>
    <div style="margin-bottom: 5px;">BtcTurk 土耳其</div>
    <div style="margin: 10px 0;"><span style="color: #4CAF50;">safe?</span></div>
    <div style="margin-bottom: 5px;">Crypto.com Phemex BingX 新加坡</div>
    <div style="margin-bottom: 5px;">Luno 新加坡- 非洲东南亚</div>
    <div style="margin-bottom: 5px;">Coincheck BitTrade bitFlyer Liquid 日本</div>
    <div style="margin-bottom: 5px;">Bitvavo Deribit荷兰</div>
    <div style="margin-bottom: 5px;">Bitfinex CEX.IO 英属维尔京 英国</div>
    <div style="margin-bottom: 5px;">Bittrex 美国</div>
    <div style="margin-bottom: 5px;">Bitstamp 罗森堡</div>
    <div style="margin-bottom: 5px;">Bithumb upbit 韩国</div>
    <div style="margin-bottom: 5px;">SwissBorg 瑞士</div>
  `;

  document.body.appendChild(floatingWindow);

  // 创建控制悬浮窗的按钮
  const toggleWindowButton = document.createElement('button');
  toggleWindowButton.innerText = '显';
  toggleWindowButton.style.position = 'fixed';
  toggleWindowButton.style.top = '50%';
  toggleWindowButton.style.right = '80px'; // 位于跳转按钮左侧
  toggleWindowButton.style.transform = 'translateY(-50%)';
  toggleWindowButton.style.zIndex = '1000';
  toggleWindowButton.style.padding = '10px 15px';
  toggleWindowButton.style.backgroundColor = '#4CAF50';
  toggleWindowButton.style.color = 'white';
  toggleWindowButton.style.border = 'none';
  toggleWindowButton.style.borderRadius = '5px';
  toggleWindowButton.style.cursor = 'pointer';
  toggleWindowButton.style.fontSize = '16px';
  
  // 添加点击事件
  toggleWindowButton.onclick = function() {
    const isVisible = floatingWindow.style.display !== 'none';
    floatingWindow.style.display = isVisible ? 'none' : 'block';
    toggleWindowButton.innerText = isVisible ? '显' : '隐';
  };
  
  document.body.appendChild(toggleWindowButton);

  // 创建按钮并添加到页面
  const button = document.createElement('button');
  button.id = 'toggleRedirectButton';
  button.innerText = '关'; // 初始文本，因为 redirectEnabled 初始值为 true
  button.style.position = 'fixed'; // 固定位置
  button.style.top = '50%'; // 距离顶部50%
  button.style.right = '20px'; // 距离右侧20px
  button.style.transform = 'translateY(-50%)'; // 垂直居中
  button.style.zIndex = '1000'; // 确保按钮在最上层
  button.style.padding = '10px 15px'; // 添加内边距
  button.style.backgroundColor = '#4CAF50'; // 背景颜色
  button.style.color = 'white'; // 字体颜色
  button.style.border = 'none'; // 去掉边框
  button.style.borderRadius = '5px'; // 圆角
  button.style.cursor = 'pointer'; // 鼠标悬停时显示为手型
  button.style.fontSize = '16px'; // 字体大小
  button.onclick = toggleRedirect; // 直接使用 toggleRedirect 函数，移除额外的点击处理逻辑
  document.body.appendChild(button); // 将按钮添加到页面

  // 新增多Token筛选跳转按钮
  const multiTokenButton = document.createElement('button');
  multiTokenButton.innerText = '多Token筛选';
  multiTokenButton.style.position = 'fixed';
  multiTokenButton.style.top = '70%';
  multiTokenButton.style.right = '20px';
  multiTokenButton.style.transform = 'translateY(-50%)';
  multiTokenButton.style.zIndex = '1000';
  multiTokenButton.style.padding = '10px 15px';
  multiTokenButton.style.backgroundColor = '#2196F3';
  multiTokenButton.style.color = 'white';
  multiTokenButton.style.border = 'none';
  multiTokenButton.style.borderRadius = '5px';
  multiTokenButton.style.cursor = 'pointer';
  multiTokenButton.style.fontSize = '16px';

  // 按钮点击事件：跳转到多Token筛选URL（动态获取当前账户地址）
  multiTokenButton.onclick = function() {
    // 获取当前URL中的account地址
    const match = window.location.href.match(/^https:\/\/solscan\.io\/account\/([^?#]+)/);
    const accountAddress = match ? match[1] : 'ADj7cSMTyoB4cyx2puLN5uTyzZDJdtwQ1KxST5GRtkTL'; // 默认示例地址
    // 多Token合约地址，逗号分隔
    const tokenAddresses = [
      'So11111111111111111111111111111111111111111', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'  // USDT
    ].join('%2C');
    // 拼接目标URL
    const targetUrl = `https://solscan.io/account/${accountAddress}?activity_type=ACTIVITY_SPL_TRANSFER&exclude_amount_zero=true&remove_spam=true&flow=in&value=100&value=undefined&token_address=${tokenAddresses}#transfers`;
    window.location.href = targetUrl;
  };

  document.body.appendChild(multiTokenButton);

})();