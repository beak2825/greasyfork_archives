// ==UserScript==
// @name         B站视频合集随机播放
// @namespace    https://greasyfork.org
// @version      1.0
// @description  添加这个脚本后会在视频合集中添加一个随机播放按钮，通过点击按钮进行开关。（启用此脚本会使自动连播关闭）
// @author       NineSummer
// @match        https://www.bilibili.com/video/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535552/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/535552/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {

    const STATE_KEY = 'bili_random_play_enabled';

    function log(...args) {
        console.log('[随机播放]', ...args);
    }

    function getState() {
        return localStorage.getItem(STATE_KEY) === 'true';
    }

    function setState(val) {
        localStorage.setItem(STATE_KEY, val ? 'true' : 'false');
    }

    let observerStarted = false;

    function insertToggleButton() {
        const existing = document.getElementById('randomPlayToggle');
        if (existing) return;

        const ref = document.querySelector('.header-bottom');
        if (!ref) return;

        const btn = document.createElement('button');
        btn.id = 'randomPlayToggle';
        btn.style.cssText = `
      margin-top: 10px;
      margin-left: 10px;
      padding: 4px 8px;
      font-size: 14px;
      background-color: #00a1d6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

      function updateBtnText() {
          const current = getState();
          btn.textContent = `随机播放：${current ? '开启' : '关闭'}`;
      }

      btn.onclick = () => {
          const newState = !getState();
          setState(newState);
          updateBtnText();
          if (newState) {
              observeVideoEnded();
          }
      };

      updateBtnText();
      ref.parentElement.appendChild(btn);
      log('按钮插入完成');

      if (getState()) {
          observeVideoEnded();
      }
  }

    function getAllBVLinks() {
        const items = document.querySelectorAll('.video-pod__list .pod-item');
        return Array.from(items)
            .map(el => el.getAttribute('data-key'))
            .filter(bv => bv && bv.startsWith('BV'));
    }

    function getCurrentBV() {
        const match = location.pathname.match(/\/video\/(BV\w+)/);
        return match ? match[1] : null;
    }

    function jumpToRandomBV() {
        const currentBV = getCurrentBV();
        const all = getAllBVLinks();
        const others = all.filter(bv => bv !== currentBV);
        if (others.length === 0) {
            log('没有其他分集可跳转');
            return;
        }
        const target = others[Math.floor(Math.random() * others.length)];
        const url = `https://www.bilibili.com/video/${target}`;
        log('跳转到：', url);
        location.href = url;
    }

    function observeVideoEnded() {
        if (observerStarted) return;
        observerStarted = true;

        const check = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                clearInterval(check);
                video.addEventListener('ended', () => {
                    if (getState()) {
                        log('视频播放完，开始跳转');
                        jumpToRandomBV();
                    }
                });
                log('已监听 video 播放完毕');
            }
        }, 1000);
    }

    function init() {
        observerStarted = false;
        const interval = setInterval(() => {
            const ref = document.querySelector('.description.van-popover__reference');
            const video = document.querySelector('video');
            const pod = document.querySelector('.video-pod__list .pod-item');
            if (ref && video && pod) {
                insertToggleButton();
                clearInterval(interval);
            }
        }, 1000);
    }

    function hookPushState() {
        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            setTimeout(init, 1000);
        };
        window.addEventListener('popstate', () => {
            setTimeout(init, 1000);
        });
    }

    hookPushState();
    window.addEventListener('load', init);
})();
