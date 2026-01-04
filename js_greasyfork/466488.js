// ==UserScript==
// @name         阿里云盘多账号localStorage管理器
// @namespace    http://tampermonkey-multiple-accounts
// @version      1.0.3
// @description  用于管理多个账号的localStorage信息
// @match        https://www.aliyundrive.com/*
// @match        https://www.alipan.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/466488/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%9A%E8%B4%A6%E5%8F%B7localStorage%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/466488/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%9A%E8%B4%A6%E5%8F%B7localStorage%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 定义变量
  var accounts = GM_getValue('accounts', {});
  var currentAccount = null;
  var currentLocalStorage = null;
  var currentHost = window.location.host;
  var currentName = JSON.parse(localStorage.token).nick_name || ''

  // 创建设置按钮
  var settingsButton = document.createElement('div');
  settingsButton.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; width: 40px; height: 40px;border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center;">
      <i class="fas fa-cog" style="color: white;"><svg t="1684308224035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2408" width="28" height="28"><path d="M682.666667 273.066667H580.266667V102.4h-477.866667v477.866667H273.066667V682.666667H0V0h682.666667v273.066667zM443.733333 443.733333v477.866667h477.866667v-477.866667h-477.866667zM341.333333 341.333333h682.666667v682.666667H341.333333V341.333333z" fill="#1296db" p-id="2409"></path></svg></i>
    </div>
  `;
  document.body.appendChild(settingsButton);

  // 显示管理面板
  function showManagementPanel() {
    // 移除之前的管理页面
    var previousPanel = document.getElementById('multiple-accounts-panel');
    if (previousPanel) {
      previousPanel.parentNode.removeChild(previousPanel);
    }

    // 创建弹出元素
    var panel = document.createElement('div');
    panel.id = 'multiple-accounts-panel';
    panel.style.position = 'fixed';
    panel.style.top = '0';
    panel.style.left = '0';
    panel.style.width = '100%';
    panel.style.height = '100%';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    panel.style.zIndex = '9999';
    panel.innerHTML = `
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); width: 600px;">
        <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 24px;">多账号localStorage管理器</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 18px;">
          <div style="flex: 1; font-weight: bold;">账号名称</div>
          <div style="flex: 1; display: flex; justify-content: flex-end; font-weight: bold;">操作</div>
        </div>
        <div style="overflow-y: auto; max-height: 400px;">
          ${Object.keys(accounts[currentHost] || {}).map(function (account) {
            return `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="flex: 1;">${account}</div>
                <div style="flex: 1; display: flex; justify-content: flex-end;">
                  <button class="login-button" data-account="${account}" style="margin-right: 10px; padding: 5px 10px; border: none; background-color: #007fff; color: #fff; border-radius: 4px; cursor: pointer;">登录</button>
                  <button class="update-button" data-account="${account}" style="margin-right: 10px; padding: 5px 10px; border: 1px solid #ccc; background-color: #fff; color: #007fff; border-radius: 4px; cursor: pointer;">更新</button>
                  <button class="delete-button" data-account="${account}" style="padding: 5px 10px; border: none; background-color: #ff4d4f; color: #fff; border-radius: 4px; cursor: pointer;">删除</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <hr style="margin-top: 20px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; margin-top: 10px;">
          <input type="text" value="${currentName}" id="account-name-input" style="flex: 1; padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;" placeholder="请输入账号名称">
          <button id="save-current-button" style="margin-left: 10px; padding: 5px 10px; border: none; background-color: #007fff; color: #fff; border-radius: 4px; cursor: pointer;">保存当前账号</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // 绑定事件
    panel.addEventListener('click', function (e) {
      var accountName = e.target.getAttribute('data-account');
      if (e.target.classList.contains('login-button')) {
        localStorage.clear();
        var data = accounts[currentHost][accountName];
        for (var key in data) {
          localStorage.setItem(key, data[key]);
        }
        location.reload();
      } else if (e.target.classList.contains('update-button')) {
        accounts[currentHost][accountName] = getLocalStorageData();
        GM_setValue('accounts', accounts);
        showManagementPanel();
      } else if (e.target.classList.contains('delete-button')) {
        delete accounts[currentHost][accountName];
        GM_setValue('accounts', accounts);
        showManagementPanel();
      }
      else if(e.target == panel){
          panel.parentNode.removeChild(panel);
      }
    });

    // 保存当前账号
    document.getElementById('save-current-button').onclick = function () {
      var accountName = document.getElementById('account-name-input').value.trim();
      if (accountName === '') {
        alert('请输入账号名称');
        return;
      }
      if (!accounts[currentHost]) {
        accounts[currentHost] = {};
      }
      accounts[currentHost][accountName] = getLocalStorageData();
      GM_setValue('accounts', accounts);
      showManagementPanel();
    };
  }

  // 获取当前localStorage数据
  function getLocalStorageData() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return data;
  }

  // 设置按钮点击事件
  settingsButton.onclick = function () {
    showManagementPanel();
  };
})();