// ==UserScript==
// @name         移动端链接跳电脑端
// @description  自动将移动端链接跳转为电脑端访问的网页
// @namespace    https://github.com/popring/tampermonkey-m2pc
// @version      2025-12-07
// @author       popring
// @match        https://m.huxiu.com/*
// @match        https://m.thepaper.cn/*
// @match        https://threejs.org/docs/*
// @match        https://item.m.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huxiu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510561/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%93%BE%E6%8E%A5%E8%B7%B3%E7%94%B5%E8%84%91%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/510561/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%93%BE%E6%8E%A5%E8%B7%B3%E7%94%B5%E8%84%91%E7%AB%AF.meta.js
// ==/UserScript==

var main = function (devMode) {
  'use strict';
  var map = {
    'm.huxiu.com': 'www.huxiu.com',
    'm.thepaper.cn': (originURL) => {
      var url = new URL(originURL);
      if (url.pathname.startsWith('/kuaibao_detail.jsp')) {
        var contid = url.searchParams.get('contid');
        return `https://www.thepaper.cn/newsDetail_forward_${contid}?${url.searchParams.toString()}`;
      }
      return originURL.replace('m.thepaper.cn', 'www.thepaper.cn');
    },
    'threejs.org': (originURL) => {
      return originURL.replace('/docs/#api/en/', '/docs/#api/zh/');
    },
    'item.m.jd.com': (originURL) => {
      var url = new URL(originURL);

      if (!url.pathname.startsWith('/product/')) {
        return originURL; // 非商品页不处理
      }

      var last = url.pathname.split('/').pop();
      var skuId = last && last.split('.')[0];

      if (!skuId) {
        return originURL; // 保险处理
      }

      return `https://item.jd.com/${skuId}.html`;
    },
  };

  // 格式化控制台打印
  var log = (message) => {
    console.log(
      '%c M2PC %c ' + message,
      'background: #2c3e50; color: #fff; border-radius: 3px 0 0 3px; padding: 1px 2px; font-weight: bold',
      'background: #ecf0f1; color: #2c3e50; border-radius: 0 3px 3px 0; padding: 1px 2px'
    );
  };

  // 检测是否为移动设备
  var isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  var convertLink = (originURL) => {
    var host = new URL(originURL).host;
    if (typeof map[host] === 'function') {
      return map[host](originURL);
    }
    if (typeof map[host] === 'string') {
      return originURL.replace(host, map[host]);
    }
    return originURL;
  };

  var redirect = (key) => {
    // 如果是移动设备，直接返回不跳转
    if (isMobile()) {
      log('检测到移动设备，不进行跳转');
      return;
    }

    var newLink = convertLink(window.location.href);
    window.location.href = newLink;
  };

  var bootstrap = () => {
    const newLink = convertLink(window.location.href);
    if (newLink !== window.location.href) {
      window.location.href = newLink;
    }
  };

  if (!devMode) {
    bootstrap();
    return;
  }

  return convertLink;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = main;
} else {
  main(window.__M2PC_DEV_MODE__);
}
