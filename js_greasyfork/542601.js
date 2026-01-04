// ==UserScript==
// @name         🚀 Delete AI Conversation
// @namespace    https://github.com/xianghongai/Tampermonkey-UserScript
// @version      1.0.1
// @description        Delete AI conversation quickly and directly. Support shortcut key(Alt+Command+Backspace)
// @description:zh-CN  快速/直接删除 AI 对话，支持快捷键(Alt+Command+Backspace)
// @description:zh-TW  快速/直接删除 AI 對話，支持快捷鍵(Alt+Command+Backspace)
// @description:ja-JP  AI 会話を迅速に/直接に削除します。ショートカットキー(Alt+Command+Backspace)をサポートします。
// @description:ko-KR  AI 대화를 빠르고 직접적으로 삭제합니다. 단축키(Alt+Command+Backspace)를 지원합니다.
// @description:ru-RU  Быстро/непосредственно удалить AI-диалог. Поддерживает горячую клавишу(Alt+Command+Backspace)
// @description:es-ES  Eliminar rápidamente/ directamente una conversación de IA. Soporta el atajo de teclado(Alt+Command+Backspace)
// @description:fr-FR  Supprimer rapidement/ directement une conversation AI. Prise en charge des raccourcis clavier(Alt+Command+Backspace)
// @author       Nicholas Hsiang
// @icon         https://xinlu.ink/favicon.ico
// @match        https://monica.im/home*
// @match        https://grok.com/*
// @match        https://chatgpt.com/c/*
// @match        https://chat.deepseek.com/*
// @match        https://gemini.google.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542601/%F0%9F%9A%80%20Delete%20AI%20Conversation.user.js
// @updateURL https://update.greasyfork.org/scripts/542601/%F0%9F%9A%80%20Delete%20AI%20Conversation.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log(GM_info.script.name);

  // 两种删除交互
  // 1. 通过右下角按钮，删除当前页面的对话
  // 2. 在对话列表中，点击删除按钮，删除对应的对话

  // 两种删除方式
  // 1. API：通过服务删除
  // 2. UI：借助原站点 UI 删除交互

  // 两种获取初始对话数据方式
  // 1. ID：从 URL 中获取
  // 2. TITLE：从对话标题中获取 (借助 Developer Tools + getElementPath(temp) 获取元素路径)

  // 模式
  const MODE = {
    ID_API: 'id_api',
    ID_UI: 'id_ui',
    TITLE_UI: 'title_ui',
  };

  const CONFIG = {
    'https://gemini.google.com': {
      mode: MODE.ID_UI,
      conversation_url_pattern: 'https://gemini.google.com/app/{id}',
      conversation_item_selector: '.conversation-items-container',
      conversation_item_action_selector: '.conversation-actions-menu-button',
      conversation_item_action_menu_item_selector: '[data-test-id="delete-button"]',
      delete_confirm_modal_button_selector: '[data-test-id="confirm-button"]',
      getConversationItemById(conversationId) {
        const conversationItems = Array.from(document.querySelectorAll('.conversation-items-container'));
        const conversationItem = conversationItems.find((item) => {
          const conversationIdElement = item.querySelector('.mat-mdc-tooltip-trigger.conversation');
          return conversationIdElement?.getAttribute('jslog').includes(conversationId);
        });
        return conversationItem;
      },
    },
    'https://grok.com': {
      mode: MODE.ID_API,
      api_url: 'https://grok.com/rest/app-chat/conversations/soft/{id}',
      method: 'DELETE',
      // 以从 URL 中提取对话 ID
      conversation_url_pattern: 'https://grok.com/chat/{id}',
      // 获取所有"对话项"的 CSS 选择器。不能带层级。
      // THINK: 通过选择器，可以做两件事：
      //        1. 获取所有对话项；
      //        2. 点击内部操作，获取该对话项。
      conversation_item_selector: '[data-sidebar="menu-button"][href^="/chat/"]',
      // 从对话项中获取携带对话 ID 元素
      getConversationIdElement(conversationItem) {
        const conversationIdElement = conversationItem.querySelector('[href^="/chat/"]') || conversationItem;
        return conversationIdElement;
      },
      // 获取对话 ID，通过对话项中的元素 (对话项，或其内部元素)
      getConversationIdFormItem(element) {
        return element.getAttribute('href').split('/chat/')[1]
      },
    },
    'https://monica.im': {
      mode: MODE.ID_UI,
      conversation_url_pattern: '?convId={id}',
      conversation_item_selector: '[class^="conversation-name-item-wrapper"]',
      conversation_item_action_selector: '[class^="popover-content-wrapper"]',
      conversation_item_action_menu_item_selector: '[class^="dropdown-menu-item"]',
      delete_confirm_modal_button_selector: '[class^="monica-btn"]',
      // 通过对话 ID 获取对话项元素，以进入更多菜单
      getConversationItemById(conversationId) {
        const conversationItemSelector = '[href$="{id}"]'.replace('{id}', conversationId);
        return document.querySelector(conversationItemSelector);
      },
      getConversationIdFormQueryValue(queryValue) {
        return queryValue.split('conv:')[1];
      },
    },
    'https://chatgpt.com': {
      mode: MODE.ID_API,
      api_url: 'https://chatgpt.com/backend-api/conversation/{id}',
      method: 'PATCH',
      api_body: JSON.stringify({
        is_visible: false,
        conversation_id: '{id}',
      }),
      need_authorization: true,
      conversation_url_pattern: 'https://chatgpt.com/c/{id}',
      // THINK：不通过选择器，需要两个函数分别处理
      // 获取所有对话项
      getConversationItems() {
        return Array.from(document.querySelectorAll('.group.__menu-item')).filter((item) => item.getAttribute('href')?.startsWith('/c/'));
      },
      // 点击内部操作，获取该对话项
      getConversationItem(event) {
        const target = event.target;
        const conversationItem = parent(target, '.group.__menu-item');
        return conversationItem;
      },
      getConversationIdElement(conversationItem) {
        return conversationItem;
      },
      getConversationIdFormItem(element) {
        return element.getAttribute('href').split('/c/')[1];
      },
    },
    'https://chat.deepseek.com': {
      mode: MODE.TITLE_UI,
      conversation_url_pattern: 'https://chat.deepseek.com/a/chat/s/{id}',
      conversation_item_selector: 'html > body:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > div[tabindex]',
      conversation_item_action_selector: 'div[tabindex]',
      conversation_item_action_menu_item_selector: '.ds-dropdown-menu-option.ds-dropdown-menu-option--error',
      delete_confirm_modal_button_selector: '.ds-modal-content .ds-button.ds-button--error',
      getConversationTitle() {
        return document.querySelector('html > body:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').textContent.trim();
      },
    },

    // TODO: document_title_ui/document_title_api 模式
    // 1. 获取 Document Title
    // 2. 获取 Document 中的所有对话项
    // 3. 遍历对话项，找到与 Document Title 匹配的对话项
    // 4. 点击对话项的操作按钮
    // 5. 遍历对话项的操作菜单项，找到删除按钮
    // 6. 点击删除按钮
    // 7. 点击确认删除按钮
  };

  let config = null;
  // 添加删除状态跟踪变量
  let isDeleting = false;
  // 保存删除按钮引用
  let deleteButton = null;

  function getConfig() {
    if (config) {
      return config;
    }

    config = CONFIG[window.location.origin];

    if (!config) {
      throw new Error(`未找到当前网站的配置: ${window.location.origin}`);
    }

    return config;
  }

  function getConversationIdFormUrl() {
    const currentUrl = window.location.href;
    const config = getConfig();
    const { conversation_url_pattern, getConversationIdFormQueryValue } = config;

    // 如果模式以?开头，表示从查询参数中获取
    if (conversation_url_pattern.startsWith('?')) {
      const paramName = conversation_url_pattern.slice(1, conversation_url_pattern.indexOf('='));
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(paramName);

      if (!paramValue) {
        console.error(`未找到查询参数: ${paramName}`);
        return null;
      }

      if (typeof getConversationIdFormQueryValue === 'function') {
        return getConversationIdFormQueryValue(paramValue);
      }

      return paramValue;
    }
    // 否则从路径中提取
    else {
      const pattern = conversation_url_pattern.replace('{id}', '(.+)');
      const regex = new RegExp(pattern);
      const match = currentUrl.match(regex);

      if (match && match[1]) {
        return match[1];
      }

      console.error('无法从URL中提取对话ID');
      return null;
    }
  }

  function deleteForIdUi(conversationItem) {
    setButtonLoading(true);

    const { conversation_item_action_selector, conversation_item_action_menu_item_selector, delete_confirm_modal_button_selector } = getConfig();

    if (!conversationItem) {
      notification('未找到对话项', { type: 'error' });
      setButtonLoading(false);
      return;
    }

    const itemActionElement = conversationItem.querySelector(conversation_item_action_selector);

    if (itemActionElement) {
      // 点击对话操作按钮
      itemActionElement.click();

      setTimeout(() => {
        // 更多菜单列表项
        const menuItemElements = document.querySelectorAll(conversation_item_action_menu_item_selector);
        let foundDeleteButton = false;

        for (let i = 0; i < menuItemElements.length; i++) {
          const menuItemElement = menuItemElements[i];
          const menuItemText = menuItemElement.textContent.trim();
          const isDeleteElement = menuItemText.includes('Delete') || menuItemText.includes('删除');

          if (isDeleteElement) {
            foundDeleteButton = true;
            // 点击删除按钮
            menuItemElement.click();

            // 需要“确认删除”
            if (delete_confirm_modal_button_selector) {
              setTimeout(() => {
                const confirmModalButtonElements = document.querySelectorAll(delete_confirm_modal_button_selector);

                let foundConfirmButton = false;

                for (let i = 0; i < confirmModalButtonElements.length; i++) {
                  const confirmModalButtonElement = confirmModalButtonElements[i];
                  const confirmModalButtonText = confirmModalButtonElement.textContent.trim();
                  const isDeleteElement = confirmModalButtonText.includes('Delete') || confirmModalButtonText.includes('删除');

                  if (isDeleteElement) {
                    foundConfirmButton = true;
                    // 点击确认删除按钮
                    confirmModalButtonElement.click();
                    notification('已发起删除请求');

                    // 在操作完成后延迟重置按钮状态
                    setButtonLoading(false);

                    break;
                  }
                }

                if (!foundConfirmButton) {
                  notification('未找到确认按钮', { type: 'error' });
                  setButtonLoading(false);
                }
              }, 500);
            }
            // 没有确认按钮，直接删除
            else {
              notification('已发起删除请求');
              // 在操作完成后延迟重置按钮状态
              setButtonLoading(false);
            }
            break;
          }
        }

        if (!foundDeleteButton) {
          notification('未找到删除按钮', { type: 'error' });
          setButtonLoading(false);
        }
      }, 500);
    } else {
      notification('未找到操作按钮', { type: 'error' });
      setButtonLoading(false);
    }
  }

  async function deleteForIdApi(conversationId) {
    setButtonLoading(true);

    if (!conversationId) {
      notification('无法获取对话ID', { type: 'error' });
      setButtonLoading(false);
      return;
    }

    const { api_url, method, api_body, need_authorization } = getConfig();

    // 请求 URL 中替换 {id} 为对话 ID
    const url = api_url.replace('{id}', conversationId);

    const headers = {
      'Content-Type': 'application/json',
    };

    let cacheAuthorization = null;
    const cacheAuthorizationKey = `authorization__${window.location.origin}`;

    if (need_authorization) {
      // 从 localStorage 中获取 Authorization 值
      cacheAuthorization = localStorage.getItem(cacheAuthorizationKey);
      if (cacheAuthorization) {
        headers.Authorization = cacheAuthorization;
      } else {
        // 提示用户提供 Authorization 值
        const authorization = prompt('请输入 Authorization 值 (将通过 localStorage 缓存，下次删除时无需再次输入)');
        if (authorization) {
          headers.Authorization = authorization;
        } else {
          notification('请输入 Authorization 值', { type: 'error' });
          setButtonLoading(false);
          return;
        }
      }
    }

    try {
      if (method === 'DELETE') {
        const response = await fetch(url, {
          method,
        });

        if (response.ok) {
          notification('已发起删除请求，通过 API 删除，需要刷新页面查看结果');
        } else {
          console.error(response);
          notification('删除出现异常，请查看 Developer Tools 中的 Console 输出、检查 Network 请求', { type: 'error' });
        }
      } else if (method === 'PATCH') {
        const response = await fetch(url, {
          method,
          body: api_body.replace('{id}', conversationId),
          headers,
        });

        if (response.ok) {
          notification('已发起删除请求，通过 API 删除，需要刷新页面查看结果');
          if (need_authorization) {
            // 缓存 Authorization 值，以当前网站的 origin 为 key
            localStorage.setItem(cacheAuthorizationKey, headers.Authorization);
          }
        } else {
          console.error(response);
          notification('删除出现异常，请查看 Developer Tools 中的 Console 输出、检查 Network 请求', { type: 'error' });
        }
      }
    } catch (error) {
      console.error(error);
      notification('删除请求失败: ' + error.message, { type: 'error' });
    } finally {
      // 无论成功或失败，都在1秒后恢复按钮状态
      setTimeout(() => {
        setButtonLoading(false);
      }, 1000);
    }
  }

  function deleteForTitleUi(conversationTitle) {
    const config = getConfig();
    const {
      conversation_item_selector,
      conversation_item_action_selector,
      conversation_item_action_menu_item_selector,
      delete_confirm_modal_button_selector
    } = config;

    const conversationItemElements = document.querySelectorAll(conversation_item_selector);

    for (let i = 0; i < conversationItemElements.length; i++) {
      const conversationItemElement = conversationItemElements[i];
      const conversationItemText = conversationItemElement.textContent.trim();
      if (conversationItemText === conversationTitle) {
        const conversationItemActionElement = conversationItemElement.querySelector(conversation_item_action_selector);
        // 点击对话操作按钮
        conversationItemActionElement.click();

        setTimeout(() => {
          const conversationItemActionMenuElements = document.querySelectorAll(conversation_item_action_menu_item_selector);

          for (let j = 0; j < conversationItemActionMenuElements.length; j++) {
            const conversationItemActionMenuElement = conversationItemActionMenuElements[j];
            const conversationItemActionMenuElementText = conversationItemActionMenuElement.textContent.trim();

            if (conversationItemActionMenuElementText.includes('Delete') || conversationItemActionMenuElementText.includes('删除')) {
              // 点击删除按钮
              conversationItemActionMenuElement.click();

              setTimeout(() => {
                const deleteConfirmModalButtonElements = document.querySelectorAll(delete_confirm_modal_button_selector);

                for (let k = 0; k < deleteConfirmModalButtonElements.length; k++) {
                  const deleteConfirmModalButtonElement = deleteConfirmModalButtonElements[k];
                  const deleteConfirmModalButtonElementText = deleteConfirmModalButtonElement.textContent.trim();
                  if (deleteConfirmModalButtonElementText.includes('Delete') || deleteConfirmModalButtonElementText.includes('删除')) {
                    // 点击确认删除按钮
                    deleteConfirmModalButtonElement.click();
                    notification('已删除对话');

                    break;
                  }
                }
              }, 500);

              break;
            }
          }
        }, 500);

        break;
      }
    }
  }

  function handleDelete() {
    if (isDeleting) {
      notification('正在处理删除请求，请稍候...', { type: 'warning' });
      return;
    }

    const config = getConfig();

    if (!config) {
      notification('无法获取配置信息', { type: 'error' });
      return;
    }

    const { mode, getConversationTitle, getConversationItemById } = config;

    const conversationId = getConversationIdFormUrl();

    if (mode === MODE.ID_API) {
      deleteForIdApi(conversationId);
    } else if (mode === MODE.ID_UI) {
      deleteForIdUi(getConversationItemById(conversationId));
    } else if (mode === MODE.TITLE_UI) {
      deleteForTitleUi(getConversationTitle());
    }
  }

  function createElement() {
    const wrap = document.createElement('div');
    wrap.className = 'x-conversation-action-wrap';

    // 删除按钮
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.className = 'x-conversation-action x-conversation-delete';
    btn.onclick = handleDelete;
    deleteButton = btn;
    wrap.appendChild(btn);

    // 侦测对话项，添加删除按钮
    const inspectConversationItemBtn = document.createElement('button');
    inspectConversationItemBtn.textContent = 'Inspect';
    inspectConversationItemBtn.className = 'x-conversation-action x-conversation-inspect';
    inspectConversationItemBtn.onclick = createRemoveActionForConversationItem;
    wrap.appendChild(inspectConversationItemBtn);

    document.body.appendChild(wrap);
  }

  // 为每个对话项添加删除按钮
  function createRemoveActionForConversationItem() {
    const config = getConfig();
    const { getConversationItems, conversation_item_selector } = config;

    let conversationItemElements = []

    if (typeof getConversationItems === 'function') {
      conversationItemElements = getConversationItems();
    } else {
      conversationItemElements = document.querySelectorAll(conversation_item_selector);
    }

    for (let i = 0; i < conversationItemElements.length; i++) {
      const conversationItemElement = conversationItemElements[i];
      conversationItemElement.style.position = 'relative';

      // 是否已经添加过删除按钮
      const removeIconElement = conversationItemElement.querySelector('.x-conversation-item-remove');

      if (removeIconElement) {
        // 切换显示状态
        if (removeIconElement.classList.contains('hidden')) {
          removeIconElement.classList.remove('hidden');
        } else {
          removeIconElement.classList.add('hidden');
        }
        continue;
      }

      // 添加删除按钮
      const iconElement = document.createElement('i');
      iconElement.innerHTML = getRemoveIcon();
      iconElement.className = 'x-conversation-item-remove';
      iconElement.setAttribute('title', 'Delete Conversation');
      conversationItemElement.appendChild(iconElement);
    }
  }

  // 添加快捷键监听功能
  function setupKeyboardShortcut() {
    document.addEventListener('keydown', function (event) {
      // 检测 Alt+Command+Backspace 组合键 (macOS)
      // 或 Alt+Win+Backspace (Windows)
      if (event.altKey && event.metaKey && event.key === 'Backspace') {
        event.preventDefault(); // 阻止默认行为
        handleDelete();

        // 显示快捷键触发提示
        notification('通过快捷键触发删除操作');
      }
    });
  }

  // 为对话项删除按钮委托事件
  function addEventListenerForConversationItem() {
    document.addEventListener('click', function (event) {
      const target = event.target;
      const { mode, conversation_item_selector, getConversationItem, getConversationIdElement, getConversationIdFormItem } = getConfig();

      if (matches(target, '.x-conversation-item-remove')) {
        // 1. 能从对话项中获取到对话 ID 的网站
        if (mode === MODE.ID_UI) {
          event.stopPropagation();
          event.preventDefault();
          const conversationItem = parent(target, conversation_item_selector);
          deleteForIdUi(conversationItem);
          return;
        } else if (mode === MODE.ID_API) {
          event.stopPropagation();
          event.preventDefault();
          let conversationItem = null;

          if (typeof getConversationItem === 'function') {
            conversationItem = getConversationItem(event);
          } else if (typeof conversation_item_selector === 'string') {
            conversationItem = parent(target, conversation_item_selector);
          }

          const conversationIdElement = getConversationIdElement(conversationItem);
          const conversationId = getConversationIdFormItem(conversationIdElement);
          deleteForIdApi(conversationId);
          return;
        }

        // 2. 不能从对话项中获取对话 ID 的网站，只能将事件先冒泡，进入对话项之后，再调用通过 URL 删除逻辑
        setTimeout(() => {
          handleDelete();
        }, 1000);
      }
    });
  }

  function main() {
    createStyle();
    createElement();
    setupKeyboardShortcut();
    addEventListenerForConversationItem();
  }

  main();

  // 添加通知
  function notification(message, { type = 'success', duration = 5000 } = {}) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `x-conversation-delete-notification ${type}`;

    // 移除旧提示
    const existing = document.querySelector('.x-conversation-delete-notification');
    if (existing) existing.remove();

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duration);
  }

  // 设置按钮为加载状态
  function setButtonLoading(loading) {
    if (!deleteButton) return;

    isDeleting = loading;

    if (loading) {
      deleteButton.classList.add('loading');
      deleteButton.textContent = '正在删除...';
      deleteButton.disabled = true;
    } else {
      deleteButton.classList.remove('loading');
      deleteButton.textContent = 'Delete';
      deleteButton.disabled = false;
    }
  }

  function createStyle() {
    // 初始化
    GM_addStyle(`

    .x-conversation-action-wrap {
        position: fixed;
        bottom: 18px;
        right: 18px;
        z-index: 99999;
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .x-conversation-action {
        padding: 4px 8px;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .x-conversation-inspect {
        background:rgb(255, 163, 24);
    }

    .x-conversation-inspect:hover {
        background: #ff9800;
    }

    .x-conversation-delete {
        background: #ff4444;
        color: white;
    }

    .x-conversation-delete:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }

    .x-conversation-delete.loading {
        background: #999;
        position: relative;
        padding-right: 24px; /* 为加载图标留出空间 */
    }

    .x-conversation-delete.loading::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        top: 50%;
        right: 8px;
        margin-top: -5px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-top-color: white;
        border-radius: 50%;
        animation: loader-spin 1s linear infinite;
    }

    .x-conversation-delete-notification {
        position: fixed;
        bottom: 62px;
        right: 18px;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
        font-family: system-ui;
        font-size: 12px;
        animation: slideIn 0.3s;
        z-index: 99999;
    }

    .x-conversation-item-remove {
        position: absolute;
        left: 100%;
        transform: translateX(-60px) translateY(-50%);
        top: 50%;
        display: block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        cursor: pointer;
    }

    .x-conversation-item-remove.hidden {
        display: none;
    }

    .x-conversation-delete-notification.success { background: #4CAF50; }
    .x-conversation-delete-notification.error { background: #ff4444; }
    .x-conversation-delete-notification.warning { background: #ff9800; }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes loader-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`);
  }

  function getRemoveIcon() {
    const removeIcon = `<?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.4237 10.5379C18.794 10.1922 19.2817 10 19.7883 10H42C43.1046 10 44 10.8954 44 12V36C44 37.1046 43.1046 38 42 38H19.7883C19.2817 38 18.794 37.8078 18.4237 37.4621L4 24L18.4237 10.5379Z" fill="#d0021b" stroke="#d0021b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 19L26 29" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 19L36 29" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return removeIcon;
  }

  // 获取元素的绝对路径作为 CSS 选择器，用于 DevTools
  function getElementPath(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const path = [];

    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.tagName.toLowerCase();

      const parent = element.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-child(${index})`;
      }

      path.unshift(selector);
      element = parent;
    }

    return path.join(' > ');
  }

  /**
   * 判断当前元素及父元素是否匹配给定的 CSS 选择器
   * @param {Element} currentElement 当前元素
   * @param {string} selector CSS 选择器
   * @returns {boolean} 是否匹配
   */
  function matches(currentElement, selector) {
    while (currentElement !== null && currentElement !== document.body) {
      if (currentElement.matches(selector)) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }

    // 检查 body 元素
    return document.body.matches(selector);
  }

  /**
   * 获取当前元素的父元素，直到找到匹配给定 CSS 选择器的元素
   * @param {Element} currentElement 当前元素
   * @param {string} selector CSS 选择器
   * @returns {Element|null} 匹配的父元素或 null
   */
  function parent(currentElement, selector) {
    for (; currentElement && currentElement !== document; currentElement = currentElement.parentNode) {
      if (currentElement.matches(selector)) return currentElement;
    }
    return null;
  }

})();
