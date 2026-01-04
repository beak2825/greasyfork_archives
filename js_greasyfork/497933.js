// ==UserScript==
// @name         PR三思器
// @namespace    http://tampermonkey.net/
// @version      V1.2.2
// @description  创建PR前，提醒一下有没有一些遗漏的东西需要检查
// @author       liaw
// @match        https://code.fineres.com/*/pull-requests?create*
// @icon         https://code.fineres.com/projects/FX/avatar.png?s=64&v=1452596397000
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497933/PR%E4%B8%89%E6%80%9D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/497933/PR%E4%B8%89%E6%80%9D%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const prCheckerStyle = `
  :root {
    --fd-color-border: #d7d9dc;
    --fd-color-text: #141e31;
    --fd-color-white: #ffffff;
    --fd-color-text-light-solid: #ffffff;
    --fd-color-primary: #00b899;
    --fd-color-primary-hover: #4dcdb8;
  }

  .pr-checker-create-btn {
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-right: 9px;
  }

  .pr-checker-create-btn:hover #submit-form {
    --aui-btn-bg: var(--aui-button-primary-hover-bg-color);
    --aui-btn-text: var(--aui-button-primary-active-text-color);
  }

  #bitbucket-pr-checker {
    font-size: 14px;
    color: var(--fd-color-text);
    border: none;
    border-radius: 8px;
    background: #ffffff;
    width: 500px;
    padding: 0;
    box-shadow: 0 9px 28px 8px #0000000d, 0 3px 6px -4px #0000001f,
      0 6px 16px #00000014;
  }

  #bitbucket-pr-checker::backdrop {
    background-color: rgba(0, 10, 31, 0.29);
  }

  #bitbucket-pr-checker .pr-checker-title {
    border-bottom: 1px solid var(--fd-color-border);
    padding: 16px 20px;
    font-size: 18px;
    line-height: 26px;
    font-weight: 700;
  }

  #pr-checker-btns {
    margin-top: 14px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 12px 20px;
    border-top: 1px solid var(--fd-color-border);
  }

  #pr-checker-btns .operate-btn {
    border: 1px solid;
    border-radius: 4px;
    line-height: 32px;
    padding: 0px 16px;
    outline: none;
    cursor: pointer;
    transition: box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
      background 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
      border-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
      color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  #pr-checker-btns .pr-checker-close-btn {
    background: var(--fd-color-white);
    border-color: var(--fd-color-border);
  }

  #pr-checker-btns .pr-checker-close-btn:hover {
    color: var(--fd-color-primary-hover);
    border-color: var(--fd-color-primary-hover);
  }

  #pr-checker-btns .pr-checker-ensure-btn {
    color: var(--fd-color-text-light-solid);
    background: var(--fd-color-primary);
    border-color: var(--fd-color-primary);
  }

  #pr-checker-btns .pr-checker-ensure-btn:hover {
    background: var(--fd-color-primary-hover);
  }

  .pr-checker-mask-btn {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  `;
  GM_addStyle(prCheckerStyle);

  // 最大寻找次数，脚本加载后，即在页面中寻找创建按钮，查找次数超过50次后即认为当前页面没有创建按钮
  const MAX_FIND_COUNT = 50;
  const USERNAME =
    document.querySelector("[data-username]")?.dataset.username || "";
  // 自定义check项的本地缓存
  const CUSTOM_CHECK_ITEMS_KEY = `bitbucket.pr.checker.${USERNAME}`;

  // 创建元素函数
  const createElement = ({
    parent = document.body,
    tagName = "div",
    text = "",
    attributes = {},
  }) => {
    const element = document.createElement(tagName);
    element.innerText = text;
    Object.keys(attributes).forEach((key) =>
      element.setAttribute(key, attributes[key])
    );
    if (parent) {
      parent.appendChild(element);
    }
    return element;
  };

  /**
   * 初始化PR检查器
   * 脚本支持在浏览器控制台，通过 window.PrChecker.add('xxx') 的方式添加自定义check项
   * 也支持通过 window.PrChecker.clear() 的方式清除所有自定义check项
   */
  const initPrChecker = () => {
    const addCustomCheckItems = (...checkItems) => {
      const cachedItems =
        JSON.parse(window.localStorage.getItem(CUSTOM_CHECK_ITEMS_KEY)) || [];
      const uniqItems = [...new Set(checkItems.map((item) => item.toString()))];
      const customCheckItems = [...new Set([...cachedItems, ...uniqItems])];
      window.localStorage.setItem(
        CUSTOM_CHECK_ITEMS_KEY,
        JSON.stringify(customCheckItems)
      );
    };
    const clearCustomCheckItems = () => {
      window.localStorage.removeItem(CUSTOM_CHECK_ITEMS_KEY);
    };
    /**
     * 注意这里必须用 unsafeWindow，否则无法在浏览器控制台访问 PrChecker
     * @see https://www.tampermonkey.net/documentation.php#api:unsafeWindow
     * @see https://bbs.tampermonkey.net.cn/thread-249-1-1.html#%E7%BB%99%E8%AE%BA%E5%9D%9B%E6%B7%BB%E5%8A%A0%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F
     */
    unsafeWindow.PrChecker = {};
    unsafeWindow.PrChecker.add = addCustomCheckItems;
    unsafeWindow.PrChecker.clear = clearCustomCheckItems;
  };

  // 获取检查项
  const getCheckItems = () => {
    const customCheckItems =
      JSON.parse(
        window.localStorage.getItem(`bitbucket.pr.checker.${USERNAME}`)
      ) || [];
    return [
      "copy的代码检查了吗？",
      "移动端漏了吗？",
      "CRM漏了吗？",
      "KMS漏了吗？",
      "任务号有没有关联错？",
      "目标分支提对了吗？",
      "国际化有没有处理好？",
      ...customCheckItems,
    ];
  };

  // 创建检查项列表
  const createCheckItems = (parent) => {
    const fragment = document.createDocumentFragment();
    getCheckItems().forEach((item) => {
      createElement({ parent: fragment, tagName: "li", text: item });
    });
    parent.innerHTML = "";
    parent.appendChild(fragment);
  };

  // 创建对话框
  const createDialog = (createPrBtn) => {
    const existingDialog = document.getElementById("bitbucket-pr-checker");
    if (existingDialog) {
      createCheckItems(existingDialog.querySelector("#pr-check-items"));
      return existingDialog;
    }

    // 使用文档片段批量创建元素
    const fragment = document.createDocumentFragment();
    const dialog = createElement({
      parent: fragment,
      tagName: "dialog",
      attributes: { id: "bitbucket-pr-checker" },
    });

    // 创建标题
    createElement({
      parent: dialog,
      text: "创建PR前请检查以下几项！",
      attributes: { class: "pr-checker-title" },
    });

    // 创建检查项列表
    const checkItemsWrapper = createElement({
      parent: dialog,
      tagName: "ol",
      attributes: { id: "pr-check-items" },
    });
    createCheckItems(checkItemsWrapper);

    // 创建按钮组
    const btnWrapper = createElement({
      parent: dialog,
      attributes: { id: "pr-checker-btns" },
    });

    // 创建按钮
    const closeBtn = createElement({
      parent: btnWrapper,
      tagName: "button",
      text: "还需调整",
      attributes: { class: "operate-btn pr-checker-close-btn" },
    });
    closeBtn.onclick = () => dialog.close();

    const ensureBtn = createElement({
      parent: btnWrapper,
      tagName: "button",
      text: "确认创建",
      attributes: { class: "operate-btn pr-checker-ensure-btn" },
    });
    ensureBtn.onclick = () => {
      dialog.close();
      createPrBtn.click();
    };

    // 将片段一次性插入文档
    document.body.appendChild(fragment);
    return dialog;
  };

  // 轮询查找创建PR按钮
  const findCreatePrBtn = () => {
    let findCount = 0;
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const createPrBtn = document.getElementById("submit-form");
        if (createPrBtn) {
          clearInterval(interval);
          // 因为创建PR的按钮是一个input标签，无法插入子元素，所以需要一个包装元素
          const createBtnWrapper = createElement({
            parent: null,
            attributes: {
              class: "pr-checker-create-btn",
            },
          });
          createPrBtn.parentNode.insertBefore(createBtnWrapper, createPrBtn);
          createPrBtn.parentNode.removeChild(createPrBtn);
          createBtnWrapper.appendChild(createPrBtn);
          resolve({ createBtnWrapper, createPrBtn });
        } else if (findCount > MAX_FIND_COUNT) {
          clearInterval(interval);
          reject(new Error("Create PR button doesn't exist"));
        }
        findCount++;
      }, 200);
    });
  };

  findCreatePrBtn()
    .then(({ createBtnWrapper, createPrBtn }) => {
      initPrChecker();
      const maskBtn = createElement({
        parent: createBtnWrapper,
        attributes: { class: "pr-checker-mask-btn" },
      });
      maskBtn.onclick = (e) => {
        e.stopPropagation();
        const dialog = createDialog(createPrBtn);
        dialog.showModal();
      };
    })
    .catch((err) => console.error(err));
})();
