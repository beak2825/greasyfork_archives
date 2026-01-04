// ==UserScript==
// @name         ChatGPT PoW 智商监控(实时终极优化版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  页面右下角实时显示 ChatGPT PoW 算力值，判断降智程度
// @match        https://chatgpt.com/*
// @match        https://openai.com/*
// @match        https://chat.chatgpt.com/*
// @match        https://*.openai.com/*
// @grant        none
// @license      FREE
// @run-at       document-start     /* ← 提前注入脚本，确保能拦截首个 fetch */
// @downloadURL https://update.greasyfork.org/scripts/537966/ChatGPT%20PoW%20%E6%99%BA%E5%95%86%E7%9B%91%E6%8E%A7%28%E5%AE%9E%E6%97%B6%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537966/ChatGPT%20PoW%20%E6%99%BA%E5%95%86%E7%9B%91%E6%8E%A7%28%E5%AE%9E%E6%97%B6%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function ready(fn) {
    if (document.body) return fn();
    const timer = setInterval(() => {
      if (document.body) {
        clearInterval(timer);
        fn();
      }
    }, 50);
  }

  ready(() => {
    let powDifficulty = 'N/A';
    let containerInitialized = false;

    function tryUpdatePoW(val) {
      if (val && val !== powDifficulty) {
        powDifficulty = val;
        updatePowText();
      }
    }

    // fetch hook
    const origFetch = window.fetch;
    window.fetch = function (...args) {
      return origFetch.apply(this, args).then(res => {
        if (
          (typeof args[0] === 'string' && args[0].includes('/sentinel/chat-requirements')) ||
          (typeof args[0]?.url === 'string' && args[0].url.includes('/sentinel/chat-requirements'))
        ) {
          res.clone().json().then(data => {
            tryUpdatePoW(data?.proofofwork?.difficulty || 'N/A');
          }).catch(() => {});
        }
        return res;
      }).catch(() => {});
    };

    // XHR hook
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
      this.addEventListener('load', function () {
        if (this.responseURL?.includes('/sentinel/chat-requirements')) {
          try {
            const data = JSON.parse(this.responseText);
            tryUpdatePoW(data?.proofofwork?.difficulty || 'N/A');
          } catch (e) {}
        }
      });
      return origOpen.apply(this, args);
    };

    // 首屏主动兜底请求一次
    setTimeout(() => {
      fetch('https://chatgpt.com/backend-api/sentinel/chat-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        credentials: 'include',
      })
        .then(r => r.json())
        .then(d => tryUpdatePoW(d?.proofofwork?.difficulty || 'N/A'))
        .catch(() => {});
    }, 1000);

    // 浮窗UI
    function initPowUI() {
      if (containerInitialized) return;
      containerInitialized = true;

      const floatContainer = document.createElement('div');
      floatContainer.id = 'pow-float-container';
      Object.assign(floatContainer.style, {
        position: 'fixed',
        bottom: '-2.5px',
        right: '25px',
        zIndex: 9999,
        padding: '12px 16px',
        borderRadius: '12px',
        backdropFilter: 'none',
        backgroundColor: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
        color: '#333',
        pointerEvents: 'none',
      });

      const powWrapper = document.createElement('div');
      powWrapper.id = 'pow-wrapper';
      powWrapper.style.position = 'relative';
      powWrapper.style.pointerEvents = 'auto';

      const powText = document.createElement('div');
      powText.id = 'pow-text';
      powText.style.fontWeight = 'bold';
      powText.style.display = 'inline-flex';
      powText.style.alignItems = 'center';
      powText.style.gap = '6px';
      powText.style.whiteSpace = 'nowrap';

      const tooltip = document.createElement('div');
      tooltip.id = 'custom-tooltip';
      Object.assign(tooltip.style, {
        display: 'none',
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translate(-50%, -8px)',
        background: '#333',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
      });
      tooltip.innerHTML = `
        <div style="color:#00FF00;">绿色：全模型智商在线，且 4o 可答对推理问题</div>
        <div style="color:#FFFF00;">黄色：降智概率高，且未降智也不如绿色</div>
        <div style="color:#FF0000;">红色：全模型智商下线，推理 & 画图大概率错误</div>
      `;

      powWrapper.appendChild(powText);
      powWrapper.appendChild(tooltip);
      floatContainer.appendChild(powWrapper);
      document.body.appendChild(floatContainer);

      powWrapper.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        requestAnimationFrame(() => {
          const rect = tooltip.getBoundingClientRect();
          const margin = 8;
          if (rect.right > window.innerWidth - margin) {
            const overflow = rect.right - (window.innerWidth - margin);
            tooltip.style.transform = `translate(calc(-50% - ${overflow}px), -8px)`;
          }
        });
      });
      powWrapper.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        tooltip.style.transform = 'translate(-50%, -8px)';
      });

      console.log('PoW浮窗已初始化');
    }

    function parsePowDifficulty(difficulty) {
      if (difficulty === 'N/A') {
        return { color: '#999999', label: 'N/A', decimal: 'N/A' };
      }
      const trimmed = difficulty.replace(/^0x/i, '').replace(/^0+/, '') || '0';
      const decimal = parseInt(trimmed || '0', 16).toString(10);
      const len = trimmed.length;
      if (len >= 5) return { color: '#00FF00', label: '智商Top', decimal };
      if (len === 4) return { color: '#FFFF00', label: '高风险', decimal };
      return { color: '#FF0000', label: '强降智', decimal };
    }

    function getPulseExpandIcon(color) {
      return `
        <svg width="16" height="16" viewBox="0 0 64 64" style="vertical-align:middle">
          <circle cx="32" cy="32" r="4" fill="${color}">
            <animate attributeName="r" dur="1.5s" values="4;10;4" repeatCount="indefinite"/>
          </circle>
          <circle cx="32" cy="32" r="10" fill="none" stroke="${color}" stroke-width="2">
            <animate attributeName="r" dur="2s" values="10;20;10" repeatCount="indefinite"/>
          </circle>
          <circle cx="32" cy="32" r="20" fill="none" stroke="${color}" stroke-width="2">
            <animate attributeName="r" dur="3s" values="20;30;20" repeatCount="indefinite"/>
          </circle>
        </svg>`;
    }

    function updatePowText() {
      const el = document.getElementById('pow-text');
      if (!el) return;
      const { color, label, decimal } = parsePowDifficulty(powDifficulty);
      el.innerHTML = `${getPulseExpandIcon(color)}
        <span style="color:${color};">${decimal} ${label}</span>`;
    }

    new MutationObserver(() => {
      if (!document.getElementById('pow-float-container')) {
        containerInitialized = false;
        initPowUI();
        updatePowText();
      }
    }).observe(document.documentElement, { childList: true, subtree: true });

    setInterval(updatePowText, 300);

    initPowUI();
    updatePowText();
  });

})();
