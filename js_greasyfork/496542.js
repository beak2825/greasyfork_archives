// ==UserScript==
// @name        Yapi Enhance
// @description Yapi 网页增强
// @author      SpikeLeung
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version     0.1.0
// @match     https://yapi.gyenno.com/project/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/496542/Yapi%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/496542/Yapi%20Enhance.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(`
  .ant-table-small>.ant-table-content>.ant-table-body>table>.ant-table-tbody>tr>td:first-child {
  white-space: nowrap;
  cursor: copy;
  }
  .ant-table-small>.ant-table-content>.ant-table-body>table>.ant-table-tbody>tr>td:first-child:hover {
  position: relative;
  }
  .ant-table-small>.ant-table-content>.ant-table-body>table>.ant-table-tbody>tr>td:first-child::after {
  content: "点击复制";
  padding: 2px;
  display: none;
  position: absolute;
  top: 0px;
  right: -60px;
  text-align: center;
  background-color: #fef4c5;
  border: 1px solid #d4b943;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  -ms-border-radius: 2px;
  border-radius: 2px;
  }
  .ant-table-small>.ant-table-content>.ant-table-body>table>.ant-table-tbody>tr>td:first-child:hover::after {
  display: block;
  }
    `);

  const createToggleBtn = () => {
    const button = document.createElement("button");

    button.innerText = "切换侧边栏";

    button.style.cssText = `
    position: absolute;
    top: 70px;
    right: 24px;
`;

    button.className = "ant-btn ant-btn-primary";

    return button;
  };

  const createExpandAllBtn = () => {
    const button = document.createElement("button");

    button.innerText = "展开全部";

    button.style.cssText = `
    position: absolute;
    top: 70px;
    right: 134px;
`;

    button.className = "ant-btn ant-btn-primary";

    return button;
  }

  const createPromptBtn = () => {
    const button = document.createElement("button");

    button.innerText = "JSDoc prompt";

    button.style.cssText = `
    position: absolute;
    top: 70px;
    right: 234px;
`;

    button.className = "ant-btn ant-btn-primary";

    return button;
  };


  function expandAllRows() {
    // Select all elements that represent the "+" button
    // Modify the selector to target your specific buttons
    const plusButtons = document.querySelectorAll('span.ant-table-row-collapsed');
    let clicked = false

    plusButtons.forEach(button => {
      // Check if the button is already expanded; you might need to adjust the logic here
      button.click();
      clicked = true
    });

    if (clicked) {
      // Use setTimeout to allow any asynchronous operations to complete (e.g., loading new content)
      setTimeout(expandAllRows, 100); // Adjust timeout as necessary
    }
  }

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".ant-layout-sider");

    if (sidebar.style.display === "none") {
      sidebar.style.display = "block";
    } else {
      sidebar.style.display = "none";
    }
  };

  const addBtns = () => {
    const interval = setInterval(() => {
      const parentNode = document.querySelector(".m-subnav");

      if (!parentNode) return;

      const expandAll = createExpandAllBtn();
      const toggle = createToggleBtn();
      const prompt = createPromptBtn();


      parentNode.append(expandAll);
      parentNode.append(toggle);
      parentNode.append(prompt);

      expandAll.onclick = expandAllRows;
      toggle.onclick = toggleSidebar;
      prompt.onclick = getDocPrompt;
      clearInterval(interval);
    }, 500);
  };


  async function getDocPrompt() {
    const id = location.href.split('/').at(-1)
    const url = `https://yapi.gyenno.com/api/interface/get?id=${id}`; // 修改为你的API URL

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let {
        data: {
          req_query: reqQuery,
          req_body_other: reqBodyOther,
          res_body: resBody
        }
      } = await response.json();

      reqQuery = parseApiResponseData(reqQuery)
      reqBodyOther = parseApiResponseData(reqBodyOther)
      resBody = parseApiResponseData(resBody)

      const prompt = `
      生成 JSDoc 定义，生成的结构参考：

      /**
      * @typedef {Object} TrainingConfig
      * @property {string} trainingScheduleId - 训练ID
      * @property {string} title - 标题
      * @property {string} preamble - 开场白
      * @property {string} preambleAudio - 开场白语音
      * @property {number[]} allStepIds - 所有的训练步骤
      * @property {Vocal} vocal - 言语训练
      * @property {FunctionalExpression} functionalExpression - 功能性表达训练
      * @property {ScenarioDialogue} scenarioDialogue - 情景对话训练
      */

      如果类型不清楚，可以定义为 unknown

      以下是需要定义的内容:

      请求参数:

      reqQuery: ${JSON.stringify(reqQuery, null, 2)}

      对于 reqQuery, 定义 ReqQuery 的对象,  其中 name 是 property, desc 是注释

      reqBodyOther: ${JSON.stringify(reqBodyOther, null, 2)}

      对于 reqBodyOther, 定义 ReqBody 的对象, type 是类型，description 是注释

      resBody: ${JSON.stringify(resBody, null, 2)}

      对于 resBody, 定义对应的对象, description 是注释，type 是类型`

      console.log(prompt)

      copyToNavigatorClipboard(prompt);
    } catch (err) {
      console.error('There was a problem with the fetch operation:', err);
    }
  }

  function parseApiResponseData(data) {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data
    } catch (err) {
      return data
    }
  }

  function copyToNavigatorClipboard(content) {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("复制成功:", text);
      })
      .catch((err) => {
        console.error("复制失败:", err);
      });
  }

  const copyHandler = (event) => {
    // YAPI 表格中，有的是 span，有的是 div，这些点击的时候可能复制不到, 不过对于参数，只需要判断 td 就足够了。
    if (["TD"].includes(event.target.tagName)) {
      const text = event.target.textContent || event.target.innerText;
      copyToNavigatorClipboard(text)
    }
  };

  const addCopyListener = () => {
    document.querySelectorAll(".ant-table").forEach((table) => {
      table.removeEventListener("click", copyHandler);
      table.addEventListener("click", copyHandler);
    });
  };

  let timeout = null;
  // 初始化 MutationObserver 来监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(checkUrlChange, 500);
    });
  });

  // 监听特定元素，比如 body
  observer.observe(document.body, {
    childList: true,
    attributes: true,
    subtree: true, // 监听子节点变化
  });

  function checkUrlChange() {
    const url = window.location.href;
    const match = url.match(/api\/(\d+)/);
    match && addCopyListener();
  }

  addBtns()
})();
