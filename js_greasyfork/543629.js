// ==UserScript==
// @name        虎牙解锁20M清晰度+去除礼物条
// @namespace   https://greasyfork.org/zh-CN/users/762932-kytrio-yu
// @match       *://www.huya.com/*
// @grant       none
// @version     1.0
// @author      UFOdestiny
// @run-at      document-end
// @license      GPL-3.0-or-later
// @description 2025/7/26 01:29:13
// @downloadURL https://update.greasyfork.org/scripts/543629/%E8%99%8E%E7%89%99%E8%A7%A3%E9%94%8120M%E6%B8%85%E6%99%B0%E5%BA%A6%2B%E5%8E%BB%E9%99%A4%E7%A4%BC%E7%89%A9%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/543629/%E8%99%8E%E7%89%99%E8%A7%A3%E9%94%8120M%E6%B8%85%E6%99%B0%E5%BA%A6%2B%E5%8E%BB%E9%99%A4%E7%A4%BC%E7%89%A9%E6%9D%A1.meta.js
// ==/UserScript==

/*
 * 基于原脚本 https://greasyfork.org/zh-CN/scripts/477947 修改。
 * 基于原脚本 https://greasyfork.org/zh-CN/scripts/538229 修改。
 * 原作者: (σ｀д′)σ
 * 依据 GPL-3.0-or-later 许可证进行分发。
 */




(() => {
  'use strict';

  // 获取元素通过ID
  const getById = (id) => document.getElementById(id);

  // 解锁视频清晰度
  function unlockResolution() {
    const $vtList = $('#player-ctrl-wrap .player-videotype-list');
    if (!$vtList.length) return;

    const unlockRES = () => {
      const $highRes = $vtList.children(':has(.bitrate-right-btn.common-enjoy-btn)');
      if ($highRes.length) {
        $highRes.each((i, e) => {
          $(e).data('data').status = 0;
          // 自动选择最高清晰度
          if (i === 0) {
            setTimeout(() => e.click(), 0);
          }
        });
      } else if ($vtList.children().length > 1) {
        $vtList.children()[0].click();
      }
    };

    // 观察视频清晰度列表变化
    new MutationObserver(unlockRES).observe($vtList[0], {
      attributes: false,
      childList: true,
      subtree: false
    });
    unlockRES();
  }

  // 删除礼物打赏区
  function removeGiftWrap() {
    const giftWrap = document.getElementById('player-gift-wrap');
    if (giftWrap) {
      giftWrap.remove();
    }
  }

    function freezePlayerControlBar() {
    const bar = document.getElementById('player-ctrl-wrap');
    if (bar) {
      // 禁用动画 + 固定位置
      bar.style.transition = 'none';
      bar.style.bottom = '0px'; // 或你想固定的高度
      // 防止 JS 后续改回来，使用样式优先级 hack
      const style = document.createElement('style');
      style.innerHTML = `
        #player-ctrl-wrap {
          transition: none !important;
          bottom: 0px !important;
        }
      `;
      document.head.appendChild(style);
    }
  }



  // 初始化，等待播放器控件加载
  new MutationObserver((mutations, ob) => {
    const playerCtrlWrap = getById('player-ctrl-wrap');
    if (playerCtrlWrap) {
      unlockResolution();
      removeGiftWrap();
      freezePlayerControlBar();
      ob.disconnect();
    }
  }).observe(document.body, {
    attributes: false,
    childList: true,
    subtree: false
  });

  // 动态检测并删除 gift-wrap（如果页面后续添加）
  new MutationObserver(() => {
    removeGiftWrap();
  }).observe(document.body, {
    childList: true,
    subtree: true
  });

})();
