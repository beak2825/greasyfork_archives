// ==UserScript==
// @name         纷享销客CRM前后端跳转
// @namespace    https://www.zhihu.com/people/charon2050
// @icon         https://www.fxiaoke.com/favicon.ico
// @description  在纷享销客 CRM 列表页、后台对象管理、后台流程管理 3 个页面之间快速跳转
// @version      1.0
// @author       Charon2050
// @match        https://www.fxiaoke.com/XV/UI/Home
// @match        https://www.fxiaoke.com/XV/UI/manage
// @grant        none
// @license      Unlicense: dedicates works to the public domain
// @downloadURL https://update.greasyfork.org/scripts/538891/%E7%BA%B7%E4%BA%AB%E9%94%80%E5%AE%A2CRM%E5%89%8D%E5%90%8E%E7%AB%AF%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538891/%E7%BA%B7%E4%BA%AB%E9%94%80%E5%AE%A2CRM%E5%89%8D%E5%90%8E%E7%AB%AF%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const hash = location.hash;

  // 创建通用按钮1
  function createFloatingButton1({ id, text, onClick }) {
    if (document.getElementById(id)) return;

    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      zIndex: '9999',
      padding: '10px 15px',
      backgroundColor: '#F4190A',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    });
    button.onclick = onClick;

    document.body.appendChild(button);
  }

  // 创建通用按钮2
  function createFloatingButton2({ id, text, onClick }) {
    if (document.getElementById(id)) return;

    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '50px',
      right: '24px',
      zIndex: '9999',
      padding: '10px 15px',
      backgroundColor: '#F4190A',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    });
    button.onclick = onClick;

    document.body.appendChild(button);
  }

  // 📜 列表页 → 管理页
  function setupFront2Manage() {
    createFloatingButton1({
      id: 'Front2Manage',
      text: '管理对象',
      onClick: () => {
        const hash = location.hash;
        if (!hash.startsWith('#crm/list/=/')) {
          alert('ERROR: 未检测到有效的CRM列表页面；请点进特定对象的列表页后再使用此按钮！');
          return;
        }

        const api_name = hash.split('#crm/list/=/')[1].split('?')[0];
        const h2 = document.querySelector('h2');
        if (!h2) {
          alert('ERROR: 未找到标题（h2）元素；请点进特定对象的列表页后再使用此按钮！');
          return;
        }

        const name = h2.textContent.trim();
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('api_name', api_name);

        const isCustom = api_name.endsWith('__c');
        const targetUrl = isCustom
          ? 'https://www.fxiaoke.com/XV/UI/manage#crmmanage/=/module-myobject'
          : 'https://www.fxiaoke.com/XV/UI/manage#crmmanage/=/module-sysobject';

        window.open(targetUrl, '_blank');
      }
    });
  }

  // 📜 列表页 → 审批流
  function setupFront2Approval() {
    createFloatingButton2({
      id: 'Front2Approval',
      text: '管理审批',
      onClick: () => {
        const hash = location.hash;
        if (!hash.startsWith('#crm/list/=/')) {
          alert('ERROR: 未检测到有效的CRM列表页面；请点进特定对象的列表页后再使用此按钮！');
          return;
        }

        const api_name = hash.split('#crm/list/=/')[1].split('?')[0];
        const h2 = document.querySelector('h2');
        if (!h2) {
          alert('ERROR: 未找到标题（h2）元素；请点进特定对象的列表页后再使用此按钮！');
          return;
        }

        const name = h2.textContent.trim();
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('api_name', api_name);

        window.open('https://www.fxiaoke.com/XV/UI/manage#crmmanage/=/module-approval', '_blank');
      }
    });
  }

  // 👩🏻‍💻 管理页 → 前端页
  function setupManage2Front() {
    createFloatingButton1({
      id: 'Manage2Front',
      text: '回到前端',
      onClick: () => {
        const h1 = document.querySelector('h1');
        if (!h1) {
          alert('ERROR: 未找到标题（h1）元素；请点进特定对象的管理页面后再使用此按钮！');
          return;
        }

        const name = h1.textContent.trim();
        sessionStorage.setItem('name', name);
        window.open('https://www.fxiaoke.com/XV/UI/Home#crm/index', '_blank');
      }
    });
  }

  // 👩🏻‍💻 管理页 → 审批流
  function setupManage2Approval() {
    createFloatingButton2({
      id: 'Manage2Approval',
      text: '管理审批',
      onClick: () => {
        const h1 = document.querySelector('h1');
        if (!h1) {
          alert('ERROR: 未找到标题（h1）元素；请点进特定对象的管理页面后再使用此按钮！');
          return;
        }

        const name = h1.textContent.trim();
        sessionStorage.setItem('name', name);
        window.open('https://www.fxiaoke.com/XV/UI/manage#crmmanage/=/module-approval', '_blank');
      }
    });
  }

  // ☑ 审批流 → 前端页
  function setupApproval2Front() {
    createFloatingButton1({
      id: 'Approval2Front',
      text: '回到前端',
      onClick: () => {
        const input = document.querySelector('input.el-input__inner');
        if (!input) {
          alert('ERROR: 未筛选对象；请筛选特定对象的流程后再使用此按钮！');
          return;
        }
        const name = input.title.trim();
        sessionStorage.setItem('name', name);
        window.open('https://www.fxiaoke.com/XV/UI/Home#crm/index', '_blank');
      }
    });
  }

  // ☑ 审批流 → 管理页
  function setupApproval2Manage() {
    createFloatingButton2({
      id: 'Approval2Manage',
      text: '管理对象',
      onClick: () => {
        const input = document.querySelector('input.el-input__inner');
        if (!input) {
          alert('ERROR: 未筛选对象；请筛选特定对象的流程后再使用此按钮！');
          return;
        }
        const name = input.title.trim();

        fetchApiName("客户").then(api_name => {
          if (api_name) {
            sessionStorage.setItem('name', name);
            sessionStorage.setItem('api_name', api_name);

            const isCustom = api_name.endsWith('__c');
            const targetUrl = isCustom
              ? 'https://www.fxiaoke.com/XV/UI/manage#crmmanage/=/module-myobject'
              : 'https://www.fxiaoke.com/XV/UI/manage#crmmanage/=/module-sysobject';

            window.open(targetUrl, '_blank');
          }
        });
      }
    });
  }

  // 👆 模拟点击
  function autoClickModuleByName(selector, name) {
    const tryClick = setInterval(() => {
      const el = [...document.querySelectorAll(selector)].find((e) => {
        if (e.title !== undefined && e.title === name) {
          return true;
        }
        if (e.textContent.trim() === name) {
          return true;
        }
        return false;
      });
      if (el) {
        clearInterval(tryClick);
        el.click();
      }
    }, 500);
  }


  function fetchApiName(name) {
    return fetch("https://www.fxiaoke.com/FHH/EM1HNCRM/API/v1/object/search/service/find_search_object_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        const list = data?.Value?.objectDescribeList || [];
        const match = list.find(item => item.display_name === name);
        return match ? match.api_name : null;
      })
      .catch(err => {
        console.error("[CRM前后端跳转] 请求失败:", err);
        return null;
      });
  }

  // 入口处理
  const url = location.href;

  if (url.includes('/XV/UI/Home')) {
    // CRM前端页面逻辑
    setupFront2Manage(); // 添加跳转模块管理按钮
    setupFront2Approval();
    if (hash.startsWith('#crm/list/=/')) {
    } else if (hash.startsWith('#crm/index')) {
      // 自动点击模块
      const name = sessionStorage.getItem('name');
      if (name) {
        autoClickModuleByName('span[title]', name);
      }
    }
  } else if (url.includes('/XV/UI/manage')) {
    if (hash.startsWith('#crmmanage/=/module-approval')) {
      setupApproval2Front();
      setupApproval2Manage();
      // 自动点击审批流
      const name = sessionStorage.getItem('name');
      if (name) {
        autoClickModuleByName('span', name);
      }
    } else if (hash.startsWith('#crmmanage/=/module-')) {
      setupManage2Front(); // 添加返回前端按钮
      setupManage2Approval();
      // 自动点击 detail 链接
      const name = sessionStorage.getItem('name');
      if (name) {
        autoClickModuleByName('a.j-detail[title]', name);
      }
    }
  }
  sessionStorage.removeItem('name');
})();