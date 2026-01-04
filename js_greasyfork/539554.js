// ==UserScript==
// @name         GitHub Copilot 免费额度显示（美化 + 主动查询）
// @namespace    https://github.com/weberyap/GitHub-Copilot-Free-Quota-Display
// @version      1.2
// @description  主动查询 GitHub Copilot 免费额度并以美观方式显示
// @author       weberyap
// @homepageURL  https://github.com/weberyap/GitHub-Copilot-Free-Quota-Display
// @supportURL   https://github.com/weberyap/GitHub-Copilot-Free-Quota-Display/issues
// @match        https://github.com/settings/copilot/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539554/GitHub%20Copilot%20%E5%85%8D%E8%B4%B9%E9%A2%9D%E5%BA%A6%E6%98%BE%E7%A4%BA%EF%BC%88%E7%BE%8E%E5%8C%96%20%2B%20%E4%B8%BB%E5%8A%A8%E6%9F%A5%E8%AF%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539554/GitHub%20Copilot%20%E5%85%8D%E8%B4%B9%E9%A2%9D%E5%BA%A6%E6%98%BE%E7%A4%BA%EF%BC%88%E7%BE%8E%E5%8C%96%20%2B%20%E4%B8%BB%E5%8A%A8%E6%9F%A5%E8%AF%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_URL = 'https://github.com/github-copilot/chat/entitlement';

  function createQuotaBox(data) {
    const { chat, completions } = data.quotas.remaining;
    const { chat: chatTotal, completions: compTotal } = data.quotas.limits;

    const chatUsed = chatTotal - chat;
    const compUsed = compTotal - completions;
    const chatPct = Math.round((chatUsed / chatTotal) * 100);
    const compPct = Math.round((compUsed / compTotal) * 100);

    const box = document.createElement('div');
    box.style = `
      background: #f5faff;
      border: 1px solid #1b7eff;
      border-left: 6px solid #1b7eff;
      padding: 1em 1.5em;
      margin: 2em auto;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: 600px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    `;

    box.innerHTML = `
      <h3 style="margin-top:0">🚀 GitHub Copilot 免费额度</h3>
      <div style="margin-bottom: 0.8em">
        <strong>💬 Chat:</strong> ${chatUsed} / ${chatTotal} (${chatPct}%)
        <div style="background:#ddd; border-radius:4px; overflow:hidden;">
          <div style="width:${chatPct}%; background:#1b7eff; height:10px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 0.8em">
        <strong>⚡ Completion:</strong> ${compUsed} / ${compTotal} (${compPct}%)
        <div style="background:#ddd; border-radius:4px; overflow:hidden;">
          <div style="width:${compPct}%; background:#00b36b; height:10px;"></div>
        </div>
      </div>
      <div>📅 重置时间：${data.quotas.resetDate}</div>
      <div>📦 当前计划：${data.plan}</div>
      <div style="margin-top: 1em">
        <button id="copilot-refresh" style="
          padding: 6px 12px;
          background-color: #0366d6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">📥 重新查询</button>
      </div>
    `;

    // 添加按钮逻辑
    box.querySelector('#copilot-refresh').onclick = () => {
      box.innerHTML = "⏳ 正在重新获取 Copilot 额度...";
      fetchQuota(true);
    };

    return box;
  }

  async function fetchQuota(force = false) {
    try {
      const response = await fetch(API_URL, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': force ? 'no-cache' : 'default'
        }
      });

      if (!response.ok) {
        throw new Error(`Copilot 额度查询失败，状态码：${response.status}`);
      }

      const data = await response.json();
      const existing = document.getElementById('copilot-quota-box');
      const newBox = createQuotaBox(data);
      newBox.id = 'copilot-quota-box';

      if (existing) {
        existing.replaceWith(newBox);
      } else {
        const container = document.querySelector('main') || document.body;
        container.prepend(newBox);
      }
    } catch (err) {
      alert(err.message || 'Copilot 额度查询出错');
      console.error(err);
    }
  }

  // 初始化查询
  window.addEventListener('load', () => {
    setTimeout(() => fetchQuota(), 1200); // 等待页面元素渲染
  });
})();