// ==UserScript==
// @name         copy-multi-zentao-bug-id
// @namespace    vite-plugin-monkey
// @version      0.0.1
// @author       gorvey
// @description  批量复制已解决bug的禅道bug id
// @license      MIT
// @match        http://pms.seevin.com/company-dynamic-account-*.html
// @match        http://pms.seevin.com/my/
// @require      https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539580/copy-multi-zentao-bug-id.user.js
// @updateURL https://update.greasyfork.org/scripts/539580/copy-multi-zentao-bug-id.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  let messageId = 0;
  let messageList = [];
  function getMessageContainer() {
    let container = document.getElementById("global-message-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "global-message-container";
      Object.assign(container.style, {
        position: "fixed",
        top: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        minWidth: "300px"
      });
      document.body.appendChild(container);
    }
    return container;
  }
  function renderMessages() {
    const container = getMessageContainer();
    container.innerHTML = "";
    messageList.forEach((msg) => {
      const el = document.createElement("div");
      el.textContent = msg.content;
      Object.assign(el.style, {
        margin: "8px 0",
        padding: "12px 24px",
        borderRadius: "6px",
        color: "#fff",
        fontSize: "16px",
        background: msg.type === "success" ? "#52c41a" : "#ff4d4f",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        pointerEvents: "auto",
        minWidth: "200px",
        textAlign: "center",
        opacity: "0.95",
        transition: "all 0.3s"
      });
      container.appendChild(el);
    });
  }
  function addMessage(type, content, duration = 3e3) {
    const id = ++messageId;
    messageList.push({ id, type, content });
    renderMessages();
    setTimeout(() => {
      messageList = messageList.filter((msg) => msg.id !== id);
      renderMessages();
    }, duration);
  }
  const message = {
    success(content, duration) {
      addMessage("success", content, duration);
    },
    error(content, duration) {
      addMessage("error", content, duration);
    }
  };
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  _GM_addStyle(`
.zentao-bugid-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}
.zentao-bugid-toolbar button {
  padding: 2px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}
.zentao-bugid-toolbar button:hover {
  background: #e6f7ff;
}
.zentao-bugid-toolbar label {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
  font-size: 14px;
  user-select: none;
}
.zentao-bugid-checkbox {
  margin-left: 4px;
}
#zentao-copy-title-global {
  margin-right: 2px;
}
`);
  const CONFIG = {
    wrapper: "#mainContent",
    ulList: "ul.timeline",
    searchBtn: "#bysearchTab"
  };
  function addGlobalCopyTitleCheckbox() {
    var _a;
    const searchBtn = document.querySelector(CONFIG.searchBtn);
    if (searchBtn && !document.getElementById("zentao-copy-title-global")) {
      const label = document.createElement("label");
      label.className = "zentao-bugid-toolbar-label";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "zentao-copy-title-global";
      checkbox.className = "zentao-bugid-checkbox";
      checkbox.value = localStorage.getItem("zentao-copy-title-global") || "";
      checkbox.checked = localStorage.getItem("zentao-copy-title-global") === "true";
      checkbox.addEventListener("change", () => {
        localStorage.setItem("zentao-copy-title-global", checkbox.checked ? "true" : "false");
      });
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode("是否复制标题"));
      const prefixLabel = document.createElement("label");
      prefixLabel.className = "zentao-bugid-toolbar-label";
      prefixLabel.style.marginLeft = "8px";
      const prefixInput = document.createElement("input");
      prefixInput.type = "text";
      prefixInput.id = "zentao-copy-prefix-global";
      prefixInput.placeholder = "前缀";
      prefixInput.style.width = "60px";
      prefixInput.style.marginLeft = "4px";
      prefixInput.value = localStorage.getItem("zentao-copy-prefix-global") || "";
      prefixInput.addEventListener("input", () => {
        localStorage.setItem("zentao-copy-prefix-global", prefixInput.value);
      });
      prefixLabel.appendChild(document.createTextNode("前缀"));
      prefixLabel.appendChild(prefixInput);
      label.appendChild(prefixLabel);
      (_a = searchBtn.parentElement) == null ? void 0 : _a.insertBefore(label, searchBtn.nextSibling);
    }
  }
  function injectCustomButton() {
    const panelTitle = Array.from(document.querySelectorAll(".panel-title")).find(
      (el) => {
        var _a;
        return ((_a = el.textContent) == null ? void 0 : _a.trim()) === "最新动态";
      }
    );
    if (panelTitle && !document.getElementById("zentao-custom-url-btn")) {
      const btn = document.createElement("button");
      btn.id = "zentao-custom-url-btn";
      btn.textContent = "前往复制bug";
      btn.style.marginLeft = "12px";
      btn.style.fontSize = "12px";
      btn.style.padding = "2px 8px";
      let url = localStorage.getItem("zentao-custom-url") || "";
      btn.addEventListener("click", () => {
        if (!url) {
          url = prompt("请输入跳转URL", "") || "";
          if (url) localStorage.setItem("zentao-custom-url", url);
        }
        if (url) window.open(url, "_blank");
      });
      panelTitle.appendChild(btn);
    }
  }
  function insertToolbar(ul, ulIdx) {
    var _a;
    if (ul.previousElementSibling && ul.previousElementSibling.classList.contains("zentao-bugid-toolbar")) return null;
    const toolbar = document.createElement("div");
    toolbar.className = "zentao-bugid-toolbar";
    const idSuffix = "ul-" + ulIdx;
    toolbar.innerHTML = `
    <button id="zentao-copy-btn-${idSuffix}" class="zentao-bugid-btn">复制</button>
    <button id="zentao-select-all-btn-${idSuffix}" class="zentao-bugid-btn">全选</button>
    <button id="zentao-invert-btn-${idSuffix}" class="zentao-bugid-btn">反选</button>
  `;
    (_a = ul.parentNode) == null ? void 0 : _a.insertBefore(toolbar, ul);
    return { toolbar, idSuffix };
  }
  function insertBugCheckboxes(ul) {
    const labels = ul.querySelectorAll(".label.label-id");
    labels.forEach((label) => {
      var _a, _b;
      if (!((_a = label.nextElementSibling) == null ? void 0 : _a.classList.contains("zentao-bugid-checkbox"))) {
        const value = ((_b = label.textContent) == null ? void 0 : _b.trim()) || "";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "zentao-bugid-checkbox";
        checkbox.value = value;
        checkbox.checked = true;
        label.insertAdjacentElement("afterend", checkbox);
      }
    });
  }
  function bindToolbarEvents(toolbar, ul, idSuffix) {
    var _a, _b, _c;
    const getCheckedBugIds = () => {
      const checkboxes = ul.querySelectorAll(".zentao-bugid-checkbox");
      return Array.from(checkboxes).filter((cb) => cb.checked).map((cb) => cb.value);
    };
    const setAllCheckboxes = (checked) => {
      const checkboxes = ul.querySelectorAll(".zentao-bugid-checkbox");
      checkboxes.forEach((cb) => cb.checked = checked);
    };
    const invertCheckboxes = () => {
      const checkboxes = ul.querySelectorAll(".zentao-bugid-checkbox");
      checkboxes.forEach((cb) => cb.checked = !cb.checked);
    };
    (_a = toolbar.querySelector(`#zentao-copy-btn-${idSuffix}`)) == null ? void 0 : _a.addEventListener("click", () => {
      var _a2, _b2;
      const ids = getCheckedBugIds();
      const copyTitle = (_a2 = document.getElementById("zentao-copy-title-global")) == null ? void 0 : _a2.checked;
      const prefix = ((_b2 = document.getElementById("zentao-copy-prefix-global")) == null ? void 0 : _b2.value) || "";
      if (ids.length) {
        let text = ids.join("\n");
        if (copyTitle) {
          const bugTitles = [];
          ids.forEach((id) => {
            var _a3, _b3, _c2, _d;
            const label = Array.from(ul.querySelectorAll(".label.label-id")).find((l) => {
              var _a4;
              return ((_a4 = l.textContent) == null ? void 0 : _a4.trim()) === id;
            });
            if (label) {
              const a = (_a3 = label.parentElement) == null ? void 0 : _a3.querySelector("a");
              if (a) {
                if (((_b3 = a == null ? void 0 : a.textContent) == null ? void 0 : _b3.length) ?? 0 > 28) {
                  bugTitles.push(((_c2 = a.textContent) == null ? void 0 : _c2.trim().slice(0, 28)) + "..." || "");
                } else {
                  bugTitles.push(((_d = a.textContent) == null ? void 0 : _d.trim()) || "");
                }
              } else {
                bugTitles.push("");
              }
            } else {
              bugTitles.push("");
            }
          });
          text = ids.map((id, idx) => `${prefix ? prefix + " " : ""}${id} ${bugTitles[idx] || ""}`).join("\n\n");
        } else {
          text = ids.map((id) => `${prefix ? prefix + " " : ""}${id}`).join("\n\n");
        }
        copyToClipboard(text);
        message.success("复制成功");
      } else {
        message.error("请先勾选要复制的Bug ID");
      }
    });
    (_b = toolbar.querySelector(`#zentao-select-all-btn-${idSuffix}`)) == null ? void 0 : _b.addEventListener("click", () => {
      setAllCheckboxes(true);
    });
    (_c = toolbar.querySelector(`#zentao-invert-btn-${idSuffix}`)) == null ? void 0 : _c.addEventListener("click", () => {
      invertCheckboxes();
    });
  }
  function main() {
    addGlobalCopyTitleCheckbox();
    injectCustomButton();
    const wrapper = document.querySelector(CONFIG.wrapper);
    const ulLists = wrapper.querySelectorAll(CONFIG.ulList);
    ulLists.forEach((ul, ulIdx) => {
      const toolbarInfo = insertToolbar(ul, ulIdx);
      insertBugCheckboxes(ul);
      if (toolbarInfo) {
        bindToolbarEvents(toolbarInfo.toolbar, ul, toolbarInfo.idSuffix);
      }
    });
  }
  main();

})();