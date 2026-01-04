// ==UserScript==
// @name        LSP+1
// @namespace    https://github.com/inory121/tamperscript
// @version      1.0
// @match        https://www.lspsp.me/bonus*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @description  LSP+1自动领取
// @author       hiiro
// @match        https://www.lspsp.me/bonus
// @icon         https://static.lspsp.cn/global/other/v3.png
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541353/LSP%2B1.user.js
// @updateURL https://update.greasyfork.org/scripts/541353/LSP%2B1.meta.js
// ==/UserScript==

unsafeWindow.alert = function (msg) {
  console.log('自动确认alert:', msg);
  GM_notification({
    title: 'LSP有信息！！',
    text: msg,
    image: 'https://static.lspsp.cn/global/other/v3.png',
    timeout: 6000,
  })
  closeBtn();
};

window.confirm = function (msg) {
  console.log('自动确认confirm:', msg);
  return true;
};
function closeBtn() {
  const closeBtn = $('.close-btn');
  if (closeBtn.length) {
    closeBtn.click();
  }
}
$(function () {
  "use strict"
  GM_registerMenuCommand("重新运行脚本", getGame);
  function getGame() {
    var activeBtns = document.querySelectorAll('.links>button:not([disabled]):not(.owned)')
    if (activeBtns.length != 0) {
      console.log(`【LSP+1】可领取游戏数量：${activeBtns.length}`)
      GM_notification({
        title: 'LSP有信息！！',
        text: '游戏可以领取啦！！！！',
        image: 'https://static.lspsp.cn/global/other/v3.png',
        timeout: 4000,
      })
      // 顺序处理领取按钮，避免多个弹窗同时出现
      function processBtns(btns, idx = 0) {
        if (idx >= btns.length) return;
        btns[idx].click();
        let tried = 0;
        const maxTries = 4; // 最多等待1秒
        const interval = setInterval(() => {
          const confirmBtn = $('.actions>button[name=confirm]:not([disabled])');
          if (confirmBtn.length) {
            confirmBtn.click();
            clearInterval(interval);
            setTimeout(() => processBtns(btns, idx + 1), 500); // 递归处理下一个
          } else {
            tried++;
            if (tried >= maxTries) {
              console.log('【LSP+1】没有领取次数！！！');
              clearInterval(interval);
              closeBtn()
              setTimeout(() => processBtns(btns, idx + 1), 500); // 超时也递归下一个
            }
          }
        }, 250);
      }
      processBtns(Array.from(activeBtns));
    } else {
      console.log("【LSP+1】没有游戏可以领取");
    }
  }
  // 自动刷新前清除定时器，防止多次叠加
  let autoRefreshTimer = null;
  function resetAutoRefreshTimer() {
    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    autoRefreshTimer = setInterval(function () {
      updatePanelCount();
      if (autoRefresh) {
        clearInterval(autoRefreshTimer); // 防止多次叠加
        document.location.reload();
      }
    }, refreshInterval);
  }
  setInterval(() => {
    document.location.reload();
  }, 5 * 60 * 1000);

  // 1. 插入样式
  const panelStyle = `
  #lsp-panel {
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 270px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    z-index: 99999;
    font-family: '微软雅黑', Arial, sans-serif;
    border: 1px solid #e0e0e0;
    overflow: hidden;
  }
  #lsp-panel-header {
    background: #4f8cff;
    color: #fff;
    padding: 10px 16px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #lsp-panel-close {
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
  }
  #lsp-panel-body {
    padding: 16px;
    color: #333;
  }
  #lsp-panel-btn, #lsp-panel-refresh, #lsp-panel-logout {
    background: #4f8cff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    margin-top: 10px;
    margin-right: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: background 0.2s;
    display: inline-block;
  }
  #lsp-panel-btn:hover, #lsp-panel-refresh:hover, #lsp-panel-logout:hover {
    background: #2563c9;
  }
  #lsp-panel-buttons {
    text-align: center;
    margin-top: 10px;
  }
  #lsp-panel-switch {
    vertical-align: middle;
  }
  #lsp-panel-refresh-row {
    display: flex;
    align-items: center;
    margin-top: 12px;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  #lsp-panel-refresh-row label {
    margin: 0;
    font-size: 15px;
    white-space: nowrap;
  }
  #lsp-panel-interval {
    margin-left: 6px;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
    vertical-align: middle;
    width: 48px;
    box-sizing: border-box;
  }
  #lsp-panel-interval-unit {
    margin-left: 4px;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
    vertical-align: middle;
    max-width: 60px;
    box-sizing: border-box;
  }
  `;

  $('head').append(`<style>${panelStyle}</style>`);

  // 2. 插入面板HTML
  const panelHtml = `
  <div id="lsp-panel">
    <div id="lsp-panel-header">
      LSP+1助手
      <span id="lsp-panel-close" title="关闭">×</span>
    </div>
    <div id="lsp-panel-body">
      <div id="lsp-panel-locate-row" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;gap:8px;">
        <div style="display:flex;flex-direction:column;align-items:center;min-width:70px;">
          <span>可领取游戏数：</span>
          <span id="lsp-panel-count" style="font-size:18px;font-weight:bold;">0</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
          <span style="font-weight:bold;margin-bottom:2px;">定位到游戏</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <button id="lsp-panel-locate-prev" title="上一个可领取游戏" style="padding:2px 8px;font-size:15px;">&#8592;</button>
            <span id="lsp-panel-locate-index" style="min-width:48px;text-align:center;font-size:14px;">0/0</span>
            <button id="lsp-panel-locate-next" title="下一个可领取游戏" style="padding:2px 8px;font-size:15px;">&#8594;</button>
          </div>
        </div>
      </div>
      <div id="lsp-panel-buttons">
        <button id="lsp-panel-btn" title="立即自动领取所有可领取游戏">自动领取</button>
        <button id="lsp-panel-logout" title="退出账号">退出账号</button>
      </div>
      <div id="lsp-panel-refresh-row">
        <label for="lsp-panel-switch">
          <input type="checkbox" id="lsp-panel-switch" checked>
          自动刷新页面
        </label>
        <input type="number" id="lsp-panel-interval" min="1"  step="1" value="1">
        <select id="lsp-panel-interval-unit">
          <option value="minute" selected>分钟</option>
          <option value="second">秒</option>
        </select>
      </div>
    </div>
  </div>
  `;
  $('body').append(panelHtml);

  // 3. 关闭按钮
  $('#lsp-panel-close').on('click', function () {
    $('#lsp-panel').hide();
  });

  // 5. 绑定按钮和刷新逻辑
  function updatePanelCount() {
    const count = document.querySelectorAll('.links>button:not([disabled]):not(.owned)').length;
    $('#lsp-panel-count').text(count);
  }
  updatePanelCount();

  $('#lsp-panel-btn').on('click', function () {
    getGame();
    setTimeout(updatePanelCount, 500);
  });

  // 读取油猴存储
  let autoRefresh = typeof GM_getValue === 'function' ? GM_getValue('lsp_auto_refresh', true) : true;
  let intervalValue = typeof GM_getValue === 'function' ? parseFloat(GM_getValue('lsp_refresh_interval', 1)) : 1;
  if (isNaN(intervalValue)) intervalValue = 1;
  let refreshInterval = 60000;
  let intervalUnit = typeof GM_getValue === 'function' ? GM_getValue('lsp_refresh_unit', 'minute') : 'minute';
  // 初始化界面
  $('#lsp-panel-switch').prop('checked', autoRefresh);
  $('#lsp-panel-interval').val(intervalValue);
  $('#lsp-panel-interval-unit').val(intervalUnit);
  // 计算初始刷新间隔
  if (intervalUnit === 'minute') {
    refreshInterval = intervalValue * 60 * 1000;
  } else {
    refreshInterval = intervalValue * 1000;
  }

  $('#lsp-panel-switch').on('change', function () {
    autoRefresh = this.checked;
    if (typeof GM_setValue === 'function') GM_setValue('lsp_auto_refresh', autoRefresh);
  });

  $('#lsp-panel-interval').on('change', function () {
    let min = 0.1, max = 60;
    let val = parseFloat(this.value);
    if (isNaN(val) || val < min) val = min;
    if (val > max) val = max;
    this.value = val;
    if (typeof GM_setValue === 'function') GM_setValue('lsp_refresh_interval', val);
    if (intervalUnit === 'minute') {
      refreshInterval = val * 60 * 1000;
    } else {
      refreshInterval = val * 1000;
    }
    resetAutoRefreshTimer();
  });

  $('#lsp-panel-interval-unit').on('change', function () {
    intervalUnit = this.value;
    if (typeof GM_setValue === 'function') GM_setValue('lsp_refresh_unit', intervalUnit);
    // 重新计算刷新间隔
    let val = parseFloat($('#lsp-panel-interval').val());
    if (isNaN(val) || val < 0.1) val = 0.1;
    if (val > 60) val = 60;
    if (intervalUnit === 'minute') {
      refreshInterval = val * 60 * 1000;
    } else {
      refreshInterval = val * 1000;
    }
    resetAutoRefreshTimer();
  });

  // 定时刷新（可变间隔）
  resetAutoRefreshTimer();

  // 页面变化时自动更新数量
  setInterval(updatePanelCount, 2000);

  // 退出账号功能：删除loginUser cookie并刷新页面
  $('#lsp-panel-logout').on('click', function () {
    document.cookie = 'loginUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    GM_notification({
      title: 'LSP+1',
      text: '已尝试删除loginUser，页面即将刷新',
      image: 'https://static.lspsp.cn/global/other/v3.png',
      timeout: 2000,
    });
    setTimeout(() => location.reload(), 1200);
  });

  // 上下箭头定位功能
  let locateIdx = 0;
  function updateLocateIndex() {
    const btns = document.querySelectorAll('.links>button:not([disabled]):not(.owned)');
    const total = btns.length;
    if (total === 0) {
      $('#lsp-panel-locate-index').text('0/0');
      locateIdx = 0;
    } else {
      if (locateIdx >= total) locateIdx = 0;
      if (locateIdx < 0) locateIdx = total - 1;
      $('#lsp-panel-locate-index').text(`${locateIdx + 1}/${total}`);
    }
  }
  // 初始和每次数量更新时都刷新索引
  const oldUpdatePanelCount = updatePanelCount;
  updatePanelCount = function () {
    oldUpdatePanelCount();
    updateLocateIndex();
  }
  updateLocateIndex();
  function locateToCurrent() {
    const btns = document.querySelectorAll('.links>button:not([disabled]):not(.owned)');
    if (btns.length === 0) {
      GM_notification({
        title: 'LSP+1',
        text: '没有可领取的游戏',
        image: 'https://static.lspsp.cn/global/other/v3.png',
        timeout: 2000,
      });
      return;
    }
    const btn = btns[locateIdx];
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const $btn = $(btn);
      $btn.css({ 'box-shadow': '0 0 0 3px #ff9800', 'transition': 'box-shadow 0.3s' });
      setTimeout(() => $btn.css('box-shadow', ''), 1500);
    }
  }
  $('#lsp-panel-locate-prev').on('click', function () {
    const btns = document.querySelectorAll('.links>button:not([disabled]):not(.owned)');
    if (btns.length === 0) return;
    locateIdx = (locateIdx - 1 + btns.length) % btns.length;
    updateLocateIndex();
    locateToCurrent();
  });
  $('#lsp-panel-locate-next').on('click', function () {
    const btns = document.querySelectorAll('.links>button:not([disabled]):not(.owned)');
    if (btns.length === 0) return;
    locateIdx = (locateIdx + 1) % btns.length;
    updateLocateIndex();
    locateToCurrent();
  });

  // 页面加载后默认定位到第一个可领取游戏
  $(function () {
    setTimeout(() => {
      locateIdx = 0;
      updateLocateIndex();
      locateToCurrent();
    }, 300);
  });
})
