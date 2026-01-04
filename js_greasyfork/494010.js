// ==UserScript==
// @name         本地表格数据筛选
// @name:zh-CN   本地表格数据筛选
// @name:zh-TW   本地表格數據篩選
// @name:en      Filter tabular data
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @license      GPL-3.0
// @author       ShineByPupil
// @description  获取<table>标签的表格元素，根据表头形成筛选列表，本地对数据进行筛选
// @description:zh-CN  获取<table>标签的表格元素，根据表头形成筛选列表，本地对数据进行筛选
// @description:zh-TW  獲取<table>標簽的表格元素，根據表頭形成篩選列表，本地對數據進行篩選
// @description:en  Obtain the table element of the <table> tag, form a filtering list based on the table header, and locally filter the data
// @match        *://*/*
// @icon data:image/png;base64,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
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494010/%E6%9C%AC%E5%9C%B0%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/494010/%E6%9C%AC%E5%9C%B0%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function findEmptyIndex(array) {
    // 寻找第一个空单元的索引
    const index = array.findIndex((_, i) => !(i in array));
    // 如果找到空单元，则将新元素插入
    if (index !== -1) {
      return index;
    } else {
      // 如果数组中没有空单元，则将新元素追加到数组末尾
      return array.length;
    }
  }
  // 渲染帧优化
  const rafDebounce = function (fn) {
    let rafId = null;

    return function (...args) {
      rafId && cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        fn.apply(this, args);
        rafId = null;
      });
    };
  };

  class MessageBox extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <div class="message"></div>
        
        <style>
          .message {
            position: fixed;
            z-index: 100;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            display: none; /* 默认隐藏 */
          }
        </style>
      `;

      this.message = this.shadowRoot.querySelector(".message");
    }

    show(message, duration = 2500) {
      this.message.textContent = message;
      this.message.style.display = "block"; // 显示消息

      // 设置一定时间后自动隐藏消息
      setTimeout(() => {
        this.message.style.display = "none";
      }, duration);
    }
  }

  class SearchDialog extends HTMLElement {
    /**
     * WeakMap 存储结构说明：
     *
     * 键：table 表格元素
     *
     * 值：SearchTable 表格状态容器
     */
    weakMap = new Map();
    form = null;
    startX = 0;
    startY = 0;
    initialX = 0;
    initialY = 0;
    x = 0;
    y = 0;

    constructor() {
      super();

      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <div class="searchDialog">
          <div class="searchDialog__header">
            <label class="searchDialog__title">搜索</label>
            <span class="closeBtn">✕</span>
          </div>
    
          <div class="searchDialog__content scroll-bar"></div>
    
          <div class="searchDialog__footer">
            <label>
              <input class="searchDialog__notClose" type="checkbox" checked/>
              <span style="margin-left: 4px">查询后不关闭</span>
            </label>
            <input type="button" class="resetBtn" value="重置"/>
            <input type="button" class="closeBtn" value="取消"/>
            <input type="button" class="confirmBtn primary" value="确定"/>
          </div>
        </div>
        
        <style>
          .searchDialog {
            font-size: 12px;
            font-family: "Microsoft YaHei", sans-serif;
            display: none;
            z-index: 9999;
            flex-direction: column;
            width: 30vw;
            min-width: 600px;
            box-sizing: border-box;
            position: fixed;
            background-color: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            user-select: none;
          }
          
          .searchDialog__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            font-size: 18px;
            cursor: move;
          }
          .searchDialog__header span {
            transition: color 0.3s;
            cursor: pointer;
            font-size: 20px;
          }
          .searchDialog__header span:hover {
            color: red;
          }
          
          .searchDialog__content {
            margin: 20px;
            padding: 0 10px;
            flex: 1;
            max-height: 400px;
            overflow-y: auto;
            overflow-x: hidden;
          }
          
          .searchDialog__footer {
            padding: 10px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            user-select: none;
          }
          .searchDialog__footer > label {
            display: flex;
          }
          .searchDialog__footer > label > * {
            cursor: pointer;
          }
          
          .fade-in {
            animation: fadeIn 0.3s;
          }
          .fade-out {
            animation: fadeOut 0.3s;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          
          input[type='button'] {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            background-color: #fff;
            border: 1px solid #dcdfe6;
            color: #606266;
            text-decoration: none;
            cursor: pointer;
            margin-left: 10px;
          }
          input[type='button']:hover {
            background-color: #f5f7fa;
            border-color: #409eff;
            color: #409eff;
          }
          input[type='button'].primary {
            background-color: #409eff;
            border-color: #409eff;
            color: #fff;
          }
          input[type='button'].primary:hover {
            background-color: #66b1ff;
            border-color: #66b1ff;
          }
          
          .scroll-bar {
            overflow-y: scroll;
          }
          .scroll-bar::-webkit-scrollbar {
            margin: 10px;
            height: 10px;
            width: 10px;
            border: 2px solid #333; /* 设置滚动条的边框颜色 */
          }
          .scroll-bar::-webkit-scrollbar-track {
            background-color: #f1f1f1;
          }
          .scroll-bar::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 5px;
          }
          .scroll-bar::-webkit-scrollbar-thumb:hover {
            background-color: #555;
          }
        </style>
      `;

      this.dialog = this.shadowRoot.querySelector(".searchDialog");
      this.content = this.shadowRoot.querySelector(".searchDialog__content");
      this.notClose = this.dialog.querySelector(".searchDialog__notClose");

      this.init();
    }

    show(table) {
      if (!this.weakMap.has(table)) {
        this.weakMap.set(table, new SearchTable(table));
      }

      const searchFrom = this.weakMap.get(table).searchFrom;

      if (this.form !== searchFrom) {
        this.form?.remove();
        this.form = searchFrom;
        this.content.appendChild(searchFrom);
      }

      requestAnimationFrame(() => {
        this.dialog.style.display = "flex";
        this.dialog.style.left = "calc(50% - 15vw)";
        this.dialog.style.top = "10vh";
        this.dialog.classList.remove("fade-out");
        this.dialog.classList.add("fade-in");
      });
    }

    close() {
      this.dialog.classList.add("fade-out");
      this.dialog.classList.remove("fade-in");
      this.dialog.onanimationend = function () {
        this.style.display = "none";
        this.onanimationend = null;
      };
    }

    init() {
      this.initEvent();
      this.initTable();
    }

    initEvent() {
      // 点击事件 - footer 按钮组
      this.dialog.addEventListener("click", async (event) => {
        const {
          target,
          target: { className, tagName },
        } = event;

        if (className.includes("closeBtn")) {
          this.close(); // 关闭
        } else if (className.includes("resetBtn")) {
          this.form.reset(); // 重置
        } else if (className.includes("confirmBtn")) {
          await this.form.confirm(); // 确定

          !this.notClose.checked && this.close();
        } else if (tagName === "INPUT" && target.type === "checkbox") {
          target.parentElement.classList.toggle("active");
        }
      });

      // 键盘事件 - esc 关闭弹窗
      document.addEventListener("keydown", (event) => {
        if (this.dialog.style.display === "flex" && event.key === "Escape")
          this.close();
      });

      const startDrag = (event) => {
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.initialX = this.x;
        this.initialY = this.y;

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", endDrag);
      };
      const onDrag = rafDebounce((event) => {
        event.preventDefault();

        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        this.x = this.initialX + dx;
        this.y = this.initialY + dy;

        this.dialog.style.transform = `translate(${this.x}px, ${this.y}px)`;
      });
      const endDrag = () => {
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", endDrag);
      };

      // 拖动事件
      this.dialog
        .querySelector(".searchDialog__header")
        .addEventListener("mousedown", startDrag);
    }

    initTable() {
      document.querySelectorAll("table").forEach((table) => {
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");

        if (thead && tbody) {
          const parent = table.parentElement;
          parent.classList.add("filter-table");
          const template_style = document.createElement("template");

          table.classList.add("scroll-bar");
          template_style.innerHTML = `
            <style>
              table {
                position: relative;
                max-height: 50vh;
                overflow-y: auto !important;
              }
              .scroll-bar {
                overflow-y: scroll;
              }
              .scroll-bar::-webkit-scrollbar {
                margin: 10px;
                height: 10px;
                width: 10px;
                border: 2px solid #333; /* 设置滚动条的边框颜色 */
              }
              .scroll-bar::-webkit-scrollbar-track {
                background-color: #f1f1f1;
              }
              .scroll-bar::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 5px;
              }
              .scroll-bar::-webkit-scrollbar-thumb:hover {
                background-color: #555;
              }
            </style>
          `;
          document.head.appendChild(template_style.content);

          const wrapper = document.createElement("div");
          const shadow = wrapper.attachShadow({ mode: "open" });

          shadow.innerHTML = `
            <button class="open-filter-Dialog-btn" title="打开筛选弹窗">F</button>
            <style>
              button {
                position: absolute;
                top: 0;
                left: 0;
                width: 20px;
                height: 20px;
                line-height: 20px;
                padding: 0 4px;
                background-color: #fff;
                border: 1px solid #409eff;
                cursor: pointer;
              }
            </style>
          `;
          shadow.querySelector("button").onclick = () => this.show(table);

          thead.appendChild(wrapper);
        }
      });
    }
  }

  class SearchFrom extends HTMLElement {
    table = null;
    filterMap = null;

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <article class="filter_form">
          <span class="add">添加</span>
    
          <form></form>
        </article>
        
        <style>
          .filter_form {
            font-size: 12px;
          }
          .filter_form form {
            position: relative;
            margin-top: 4px;
          }
          .filter_form .add,
          .filter_form .del {
            user-select: none;
            cursor: pointer;
          }
        </style>
      `;

      this.article = this.shadowRoot.querySelector("article");
      this.form = this.shadowRoot.querySelector("form");
      this.init();
    }

    init() {
      this.initEvent();
    }

    initEvent() {
      this.article.addEventListener("wheel", (event) => {
        const innerElement = event.composedPath()[0];

        if (innerElement.tagName === "SELECT") {
          event.preventDefault();

          const length = innerElement.options.length;
          const index = innerElement.selectedIndex;
          const direction = event.wheelDeltaY > 0 ? "up" : "down";

          innerElement.selectedIndex =
            direction === "up"
              ? index === 0
                ? length - 1
                : index - 1
              : index === length - 1
                ? 0
                : index + 1;
        }
      });
      this.article.addEventListener("click", (event) => {
        const innerElement = event.composedPath()[0];

        if (innerElement.className.includes("add")) {
          this.addSearchInput();
        } else if (innerElement.className.includes("del")) {
          // 删除规则
          innerElement.parentNode.remove();
        }
      });

      this.article.addEventListener("input", (event) => {
        const innerElement = event.composedPath()[0];

        if (innerElement.tagName === "INPUT") {
          innerElement.value
            ? innerElement.classList.remove("error")
            : innerElement.classList.add("error");
        }
      });
    }

    reset() {
      this.form.innerHTML = "";
    }

    async confirm() {
      try {
        this.formTrim();
        await this.validate();
        this.filter();
      } catch (e) {
        console.error(e);
      }
    }

    addSearchInput() {
      const searchInput = document.createElement("search-input");
      searchInput.setAttribute(
        "options",
        JSON.stringify([...this.filterMap.keys()]),
      );
      searchInput.filterMap = this.filterMap;
      this.form.appendChild(searchInput);
    }

    formTrim() {
      this.form.querySelectorAll("input[type=text]").forEach((input) => {
        input.value = input.value.includes(",")
          ? input.value
              .split(",")
              .map((n) => n.trim())
              .filter((n) => n)
              .join(", ")
          : input.value.trim();
      });
    }

    validate() {
      let flag = true;

      this.form.childNodes.forEach((node) => {
        const { checkbox, input } = node;
        if (checkbox.checked && !input.value) {
          flag = false;
          input.classList.add("error", "shake");
        } else {
          input.classList.remove("error");
        }
      });

      return new Promise((resolve, reject) => {
        if (flag) {
          resolve();
        } else {
          messageBox.show("表单验证未通过");
          reject(new Error("表单验证未通过"));
        }
      });
    }

    getRules() {
      const rules_AND = [];
      const rules_OR = [];
      const rules_NOT = [];

      this.form.childNodes.forEach((node) => {
        const { checkbox, select1, select2, input } = node;

        if (checkbox.checked) {
          const rules = input.value.split(",").map((keyword) => ({
            keyword: keyword.trim(),
            colIndexs: Array.from(this.filterMap.get(select2.value)),
          }));

          switch (select1.value) {
            case "AND":
              rules_AND.push(...rules);
              break;
            case "OR":
              rules_OR.push(...rules);
              break;
            case "NOT":
              rules_NOT.push(...rules);
              break;
          }
        }
      });

      return { rules_AND, rules_OR, rules_NOT };
    }

    filter() {
      const data = this.table.searchTable.data;
      const rules = this.getRules();
      const trList = Array.from(this.table.querySelector("tbody").children);
      let count = 0;

      // 筛选
      data.forEach((trData, i) => {
        if (this.isVisible(trData, rules)) {
          trList[i].style.display = "";
          count++;
        } else {
          trList[i].style.display = "none";
        }
      });

      messageBox.show(`搜索成功,一共查询出 ${count} 数据`);
    }
    // 根据给定的规则确定表格行是否可见
    isVisible(trData, rules) {
      const { rules_AND, rules_OR, rules_NOT } = rules;

      const isVisible_AND =
        rules_AND.length &&
        rules_AND.every((rule) => {
          const { keyword, colIndexs } = rule;
          return colIndexs.some((index) => trData?.[index]?.includes(keyword));
        });
      const isVisible_OR =
        rules_OR.length &&
        rules_OR.some((rule) => {
          const { keyword, colIndexs } = rule;
          return colIndexs.some((index) => trData?.[index]?.includes(keyword));
        });
      const isVisible_NOT = rules_NOT.length
        ? rules_NOT.every((rule) => {
            const { keyword, colIndexs } = rule;
            return !colIndexs.some((index) =>
              trData?.[index]?.includes(keyword),
            );
          })
        : true;

      return (
        isVisible_NOT &&
        (rules_AND.length || rules_OR.length
          ? isVisible_AND || isVisible_OR
          : true)
      );
    }
  }

  class SearchInput extends HTMLElement {
    static get observedAttributes() {
      return ["options"];
    }

    options = [];
    filterMap = null;

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <div class="form-example active">
          <input type="checkbox" checked>
  
          <select>
            <option label="AND" value="AND"></option>
            <option label="OR" value="OR"></option>
            <option label="NOT" value="NOT"></option>
          </select>
    
          <select></select>
    
          <input type="text"/>
    
          <span class="del">删除</span>
        </div>
        
        <style>
          .form-example {
            display: flex;
            align-items: center;
            margin: 0 -4px 6px;
          }
          .form-example > * {
            margin: 0 4px;
          }
          .form-example:not(.active) * {
            border-color: #d9d9d9;
            color: #d9d9d9;
          }
          input[type='text'] {
            flex: 1;
          }
          input[type='text'].error {
            border-color: red;
          }
          input[type='text'].shake {
            animation: shake 0.6s ease-in-out 1;
          }
          
          select, input[type='text'] {
            box-sizing: border-box;
            height: 32px;
            padding: 4px 11px;
            border-radius: 4px;
            border: 1px solid #d9d9d9;
            transition: all 0.3s;
          }
          select:focus, input:focus {
            outline: none;
            border-color: #4096ff;
            border-inline-end-width: 1px;
          }
          select:hover, input:hover {
            border-color: #4096ff;
            border-inline-end-width: 1px;
          }
          
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            50% { transform: translateX(4px); }
            75% { transform: translateX(-2px); }
            100% { transform: translateX(0); }
          }
        </style>
      `;

      this.example = this.shadowRoot.querySelector(".form-example");
      this.checkbox = this.shadowRoot.querySelector("input[type='checkbox']");
      this.select1 = this.shadowRoot.querySelector("select:nth-child(2)");
      this.select2 = this.shadowRoot.querySelector("select:nth-child(3)");
      this.input = this.shadowRoot.querySelector("input[type='text']");
      this.del = this.shadowRoot.querySelector(".del");

      this.init();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName === "options") {
        this.options = JSON.parse(newVal);
        this.select2.innerHTML = this.options
          .map((n) => `<option label="${n}" value="${n}"></option>`)
          .join("");
      }
    }

    init() {
      this.initEvent();
    }

    initEvent() {
      this.checkbox.onclick = () => {
        this.example.classList.toggle("active");
      };
      this.example.onanimationend = function (event) {
        const innerElement = event.composedPath()[0];

        if (innerElement.className.includes("shake")) {
          innerElement.classList.remove("shake");
        }
      };
    }
  }

  class SearchTable {
    constructor(table) {
      this.table = table;
      table.searchTable = this;

      const { header, filterMap } = this.parseTable(table);
      this.header = header;
      this.filterMap = filterMap;
      this.searchFrom = document.createElement("search-from");
      this.searchFrom.table = table;
      this.searchFrom.filterMap = filterMap;
    }

    parseTable(table) {
      const thead = table.querySelector("thead");
      if (!thead) {
        throw new Error("缺少表头");
      }

      let header = []; // 表头数据
      thead.querySelectorAll("tr").forEach((tr) => {
        header.push(
          Array.from(tr.querySelectorAll("th")).map((n) => {
            return {
              label: n.textContent,
              rowspan: n.rowSpan ?? 1, // 高度
              colspan: n.colSpan ?? 1, // 宽度
            };
          }),
        );
      });

      let dp = new Array(header.length).fill(0).map(() => []);
      header.forEach((tr, i) => {
        tr.forEach((td) => {
          const index = findEmptyIndex(dp[i]);
          const { colspan, rowspan } = td;

          for (let k = i; k < i + rowspan; k++) {
            for (let l = index; l < index + colspan; l++) {
              dp[k][l] ??= td.label;
            }
          }
        });
      });

      let filterMap = new Map(); // 过滤器映射
      for (let i = 0; i < dp.length; i++) {
        for (let j = 0; j < dp[i].length; j++) {
          if (dp[i][j]) {
            filterMap.has(dp[i][j]) || filterMap.set(dp[i][j], new Set());
            filterMap.get(dp[i][j]).add(j);
          }
        }
      }

      return { header, filterMap };
    }

    get data() {
      return Array.from(this.table.querySelectorAll("tbody > tr")).map((tr) => {
        return Array.from(tr.querySelectorAll("td")).map((n) => {
          return n.textContent;
        });
      });
    }
  }

  customElements.define("message-box", MessageBox);
  customElements.define("search-dialog", SearchDialog);
  customElements.define("search-from", SearchFrom);
  customElements.define("search-input", SearchInput);

  const messageBox = document.createElement("message-box");
  document.body.appendChild(messageBox);

  window.addEventListener("load", function (event) {
    const searchDialog = document.createElement("search-dialog");
    document.body.appendChild(searchDialog);
  });
})();
