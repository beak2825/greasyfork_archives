// ==UserScript==
// @name         ChatGPT-Pin-Helper
// @name:en      ChatGPT-Pin-Helper
// @name:en-US   ChatGPT-Pin-Helper
// @name:zh-CN   ChatGPT-Pin助手
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Enable users to easily pin important conversations to the top for quick access and better organization, enhancing productivity and user experience.
// @description:zh-CN  让用户能够轻松地将重要对话置顶，以便快速访问，从而提高生产力和用户体验。
// @author       NevainK
// @license      GPL-3.0
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues

// @downloadURL https://update.greasyfork.org/scripts/523022/ChatGPT-Pin-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/523022/ChatGPT-Pin-Helper.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const messages = {
    pin: "Pin",
    unpin: "Unpin",
    pinnedChatsSidebarTitle: "Pinned Chats",
  };

  function getMessage(key) {
    return messages[key] || key;
  }

  const PIN_PATH_D =
    "M12 2C8.13401 2 5 5.13401 5 9C5 11.4087 6.71776 14.8163 12 22C17.2822 14.8163 19 11.4087 19 9C19 5.13401 15.866 2 12 2ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z";
  const UNPIN_PATH_D =
    "M12 2C8.13401 2 5 5.13401 5 9C5 11.4087 6.71776 14.8163 12 22C17.2822 14.8163 19 11.4087 19 9C19 5.13401 15.866 2 12 2ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11ZM4.70711 2.29289L21.7071 19.2929L20.2929 20.7071L3.29289 3.70711L4.70711 2.29289Z";
  const WAITING_PATH_D =
    "M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z";

  const pinnedChatsSidebarID = "chatgpt-pinnedChats-1122334";
  const pinnedChatsOrderListID = "chatgpt-pinnedChats-OL-1122334";

  // 创建一个状态管理对象，用于处理绑定按钮触发的弹窗与对应会话条目的关联
  const state = {
    chatID: null,
    associatedH3Text: null,
    promiseResolve: null,
    currentPromise: null,

    setChatInfo(id, name) {
      this.chatID = id;
      this.associatedH3Text = name;
      if (this.promiseResolve) {
        this.promiseResolve({ id: this.chatID, name: this.associatedH3Text });
      }
      // oneshot: 设置完就立即重置所有状态
      this.reset();
    },

    async waitForChatInfo() {
      if (this.chatID !== null && this.associatedH3Text !== null) {
        const info = { id: this.chatID, name: this.associatedH3Text };
        this.reset(); // oneshot: 获取完就立即重置
        return info;
      }

      if (!this.currentPromise) {
        this.currentPromise = new Promise((resolve) => {
          this.promiseResolve = resolve;
        });
      }

      const result = await this.currentPromise;
      return result;
    },

    reset() {
      this.chatID = null;
      this.associatedH3Text = null;
      this.promiseResolve = null;
      this.currentPromise = null;
    },
  };

  class sidebarManager {
    constructor(db, state) {
      this.pinnedChatsDB = db;
      this.chatInfoState = state;
    }
    // 在处理点击事件时获取当前点击的聊天 ID 和对应的 H3 标题文本
    addListenEventsOnClick() {
      // 处理点击事件
      const handleClick = (event) => {
        const navElement = event.target.closest("nav");
        if (navElement) {
          const listItem = event.target.closest("li");
          const link = listItem?.querySelector("a");
          const chatId = link?.href?.split("/c/").pop();
          const associatedH3Text =
            listItem.parentElement.previousElementSibling.querySelector(
              "h3"
            ).textContent;

          this.chatInfoState.setChatInfo(chatId, associatedH3Text);
        }
      };

      // 绑定点击事件监听器
      document.addEventListener("click", handleClick, true);
    }

    // 当菜单弹窗弹出时绑定新建pin按钮事件，需要搭配 addListenEventsOnClick 获取当前点击的聊天ID和对应的H3标题文本
    addDomMutationObserver() {
      // 处理 DOM 变化
      const handleMutation = (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLElement &&
              node.hasAttribute("data-radix-popper-content-wrapper") &&
              node.getAttribute("dir") === "ltr"
            ) {
              this.insertPinUnpinButton(node);
            }
          });
        });
      };
      // 创建并绑定 MutationObserver
      const observer = new MutationObserver(handleMutation);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    insertPinUnpinButton(node) {
      const menu = node.querySelector('[role="menu"]');
      if (!menu) return;
      const newitem = menu.querySelector('[role="menuitem"]').cloneNode(true);

      newitem.querySelector("path").setAttribute("d", WAITING_PATH_D);
      this.#updateSubTextNodeContent(newitem, "Loading...");

      const s = menu.firstChild;

      this.chatInfoState
        .waitForChatInfo()
        .then(({ id: currentChatId, name: associatedH3Text }) => {
          if (this.pinnedChatsDB.has(currentChatId)) {
            newitem.querySelector("path").setAttribute("d", UNPIN_PATH_D);
            this.#updateSubTextNodeContent(newitem, getMessage("unpin"));
          } else {
            newitem.querySelector("path").setAttribute("d", PIN_PATH_D);
            this.#updateSubTextNodeContent(newitem, getMessage("pin"));
          }

          newitem.addEventListener("click", () => {
            if (newitem.textContent === getMessage("pin")) {
              this.pinnedChatsDB.insert(currentChatId, associatedH3Text);
              this.#moveChatToPinnedSection(currentChatId);
              newitem.querySelector("path").setAttribute("d", UNPIN_PATH_D);
              this.#updateSubTextNodeContent(newitem, getMessage("unpin"));
            } else {
              this.#moveChatOutOfPinnedSection(
                currentChatId,
                this.pinnedChatsDB.get(currentChatId)
              );
              this.pinnedChatsDB.remove(currentChatId);
              newitem.querySelector("path").setAttribute("d", PIN_PATH_D);
              this.#updateSubTextNodeContent(newitem, getMessage("pin"));
            }
            menu.remove();
          });
        });

      s.insertBefore(newitem, s.firstChild);
    }

    initPinnedChatsSidebar() {
      const sidebarSection = document.querySelector("nav").querySelector("h3")
        ?.parentElement?.parentElement?.parentElement;
      if (!sidebarSection) return;
      this.sidebarSectionTemplate = sidebarSection?.cloneNode(true);
      this.menuSectionParent = sidebarSection?.parentNode;

      const menu = document.querySelector("nav").querySelector("h3");
      const menuParent = menu?.parentElement?.parentElement?.parentElement;

      // 如果找不到目标父元素，则退出
      if (!menuParent) return;

      // 克隆菜单部分的模板，并设置其 ID 和标题
      const pinnedChatsSection = this.sidebarSectionTemplate.cloneNode(true);
      pinnedChatsSection.id = pinnedChatsSidebarID;
      pinnedChatsSection.querySelector("h3").textContent = getMessage(
        "pinnedChatsSidebarTitle"
      );

      // 将新的固定聊天区域插入到菜单容器中
      this.menuSectionParent.insertBefore(pinnedChatsSection, menuParent);

      // 获取固定聊天区域的列表容器，并克隆第一个列表项作为模板
      const pinnedChatsOl = pinnedChatsSection.querySelector("ol");

      pinnedChatsOl.innerHTML = "";
      pinnedChatsOl.id = pinnedChatsOrderListID;

      // 遍历历史固定聊天数据，生成列表项
      const pinnedChatsInfo = this.pinnedChatsDB.getAll();
      Object.keys(pinnedChatsInfo).forEach((chatId) => {
        try {
          this.#moveChatToPinnedSection(chatId);
        } catch (error) {
          console.error(`Error moving chat ${chatId} to pinned section:`, error);
          // 可以选择继续处理后续的 chatId
        }
      });
    }

    #updateSubTextNodeContent(domNode, newText) {
      // 创建 TreeWalker
      const walker = document.createTreeWalker(
        domNode, // 根节点
        NodeFilter.SHOW_TEXT, // 只筛选文本节点
        null,
        false
      );

      // 遍历文本节点
      while (walker.nextNode()) {
        const textNode = walker.currentNode;
        textNode.textContent = newText; // 修改文本内容
      }
    }

    #moveChatToPinnedSection(chatId) {
      const chatItem = document.querySelector(`a[href$='/c/${chatId}']`)
        ?.parentElement?.parentElement;

      const pinnedChatsOl = document.getElementById(pinnedChatsOrderListID);
      pinnedChatsOl.appendChild(chatItem);
    }

    #moveChatOutOfPinnedSection(chatId, associatedH3Text) {
      const chatItem = document.querySelector(`a[href$='/c/${chatId}']`)
        ?.parentElement?.parentElement;
      const h3Node = this.#findH3ByText(associatedH3Text);

      const preChatOl =
        h3Node[0].parentElement.parentElement.nextElementSibling;
      preChatOl.appendChild(chatItem);
    }

    // 大小写敏感的文本查找
    #findH3ByText(text) {
      const h3Elements = document.querySelectorAll("h3");
      const targetH3 = [];

      for (const h3 of h3Elements) {
        if (h3.textContent.trim() === text) {
          targetH3.push(h3);
        }
      }

      return targetH3;
    }
  }

  class DBService {
    /**
     * 添加一个键值对, 如果键已存在则覆盖
     * @param {string} key 键
     * @param {*} value 值
     */
    insert(key, value) {
      GM_setValue(key, value);
    }

    /**
     * 获取指定键的值
     * @param {string} key 键
     * @returns {*} 存储的值，如果键不存在则返回 undefined
     */
    get(key) {
      return GM_getValue(key, undefined);
    }

    /**
     * 检查键是否存在
     * @param {string} key 键
     * @returns {boolean} 是否存在
     */
    has(key) {
      return this.get(key) !== undefined;
    }

    /**
     * 删除指定键
     * @param {string} key 键
     */
    remove(key) {
      GM_deleteValue(key);
    }

    /**
     * 获取所有键值对
     * @returns {Object} 包含所有键值对的对象
     */
    getAll() {
      const allKeys = GM_listValues();
      const result = {};
      allKeys.forEach((key) => {
        result[key] = GM_getValue(key);
      });
      return result;
    }

    /**
     * 清空所有键值对
     */
    clear() {
      const allKeys = GM_listValues();
      allKeys.forEach((key) => {
        GM_deleteValue(key);
      });
    }
  }

  const db = new DBService();
  const manager = new sidebarManager(db, state);

  const run = () => {
    manager.initPinnedChatsSidebar();
    manager.addListenEventsOnClick();
    manager.addDomMutationObserver();
  };

  const observer = new MutationObserver(() => {
    const nav = document.querySelector("nav");
    const h3 = nav?.querySelector("h3");

    if (h3) {
      run(); 
      observer.disconnect(); // 停止观察
    }
  });

  // 开始观察文档根节点的子树变化
  observer.observe(document.body, { childList: true, subtree: true });
})();
