// ==UserScript==
// @name       NovelAi online Prompts Tool
// @namespace  npm/vite-plugin-monkey
// @version    0.9.9
// @author     ChatGPT4
// @icon       https://vitejs.dev/logo.svg
// @match      https://novelai.net/image
// @require    https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require    https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant      GM_addStyle
// @description NovelAi Prompts Management
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/487080/NovelAi%20online%20Prompts%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/487080/NovelAi%20online%20Prompts%20Tool.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" #root{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}.logo{height:6em;padding:1.5em;will-change:filter}.logo:hover{filter:drop-shadow(0 0 2em #646cffaa)}.logo.react:hover{filter:drop-shadow(0 0 2em #61dafbaa)}@keyframes logo-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@media (prefers-reduced-motion: no-preference){a:nth-of-type(2) .logo{animation:logo-spin infinite 20s linear}}.card{padding:2em}.read-the-docs{color:#888}.side-drawer{position:fixed;width:90%;background-color:#333;transition:transform 1s ease;z-index:100;transform:translate(-100%);top:5%}.side-drawer.visible{transform:translate(0)}.container input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.container{position:fixed;z-index:10003;display:block;cursor:pointer;-webkit-user-select:none;user-select:none}.container svg{position:relative;top:0;left:0;height:50px;width:50px;transition:all .3s;fill:#666}.container svg:hover{transform:scale(1.1)}.container input:checked~svg{fill:#f5f3c2}.starButton{position:fixed;background-color:#f5f3c2;color:#13152c;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;box-shadow:0 2px 4px #0003;transition:background-color .3s ease}.animated-button{z-index:10000;position:absolute;display:flex;align-items:center;gap:4px;padding:6px 25px;border:4px solid;border-color:transparent;font-size:14px;background-color:inherit;border-radius:100px;font-weight:600;color:#fff;box-shadow:0 0 0 2px #fff;cursor:pointer;overflow:hidden;transition:all .6s cubic-bezier(.23,1,.32,1)}.animated-button svg{position:absolute;width:24px;fill:#fff;z-index:9;transition:all .8s cubic-bezier(.23,1,.32,1)}.animated-button .arr-1{right:16px}.animated-button .arr-2{left:-25%}.animated-button .circle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;background-color:#fff;border-radius:50%;opacity:0;transition:all .8s cubic-bezier(.23,1,.32,1)}.animated-button .text{position:relative;z-index:1;transform:translate(-12px);transition:all .8s cubic-bezier(.23,1,.32,1)}.animated-button:hover{box-shadow:0 0 0 12px transparent;color:#212121;border-radius:12px}.animated-button:hover .arr-1{right:-25%}.animated-button:hover .arr-2{left:16px}.animated-button:hover .text{transform:translate(12px)}.animated-button:hover svg{fill:#212121}.animated-button:active{scale:.95;box-shadow:0 0 0 4px #fff}.animated-button:hover .circle{width:220px;height:220px;opacity:1}.thing{z-index:1;left:0}.container1{position:fixed;z-index:1005;background:transparent;border:solid white}.tab-manager-container{border:2px solid #2b2b2b;padding:2px;border-radius:5px;margin:2px auto;max-width:100%;position:fixed;top:0;left:450px;z-index:100;background-color:#1e1e1e;box-shadow:0 2px 4px #0000001a}.tabs-bar{display:flex;flex-wrap:wrap;align-items:center;padding:8px;background-color:#13152c;color:#13152c;box-shadow:0 0 10px #0003}.tab-content{padding-top:0;overflow-y:auto;max-height:500px;background-color:#34495e;color:#fff}.tab{flex:1 1 auto;text-align:center;cursor:pointer;padding:.1rem 0;color:#fff;transition:all .15s ease-in-out;border-radius:.5rem;background-color:#34495e;margin-right:5px;display:flex;justify-content:space-evenly;align-items:center}.delete-tab{background-color:#e74c3c;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;transition:opacity .3s ease}.delete-tab:hover{opacity:.8}.tab:hover,.tab.active{background-color:#fff;color:#333;font-weight:600}.button{background-color:#f5f3c2;color:#13152c;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;box-shadow:0 2px 4px #0003;transition:background-color .3s ease}.button:hover{background-color:#2980b9}.input{border:1px solid #ccc;border-radius:4px;padding:8px;width:100%}.bin-button{display:flex;flex-direction:column;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background-color:#13152c;cursor:pointer;border:2px solid #34495e;transition-duration:.3s;position:relative;overflow:hidden}.bin-bottom{width:12px;z-index:2}.bin-top{width:12px;transform-origin:right;transition-duration:.3s;z-index:2}.bin-button:hover .bin-top{transform:rotate(45deg)}.bin-button:hover{background-color:red}.bin-button:active{transform:scale(.9)}.garbage{position:absolute;width:10px;height:auto;z-index:1;opacity:0;transition:all .3s}.bin-button:hover .garbage{animation:throw .4s linear}@keyframes throw{0%{transform:translate(-400%,-700%);opacity:0}to{transform:translate(0);opacity:1}}.input-group{position:relative}.input1{border:solid 1.5px #9e9e9e;border-radius:1rem;background:none;padding:1rem;font-size:1rem;color:#f5f5f5;transition:border .15s cubic-bezier(.4,0,.2,1)}.user-label{position:absolute;left:15px;color:#e8e8e8;pointer-events:none;transform:translateY(1rem);transition:.15s cubic-bezier(.4,0,.2,1)}.input1:focus{outline:none;border:1.5px solid #1a73e8}.input1:focus~label{transform:translateY(-50%) scale(.8);background-color:#212121;padding:0 .2em;color:#2196f3}.add-tab-button{background:#f5f3c2;border:none;font-size:10px;cursor:pointer}.tabs-bar{display:flex;justify-content:space-between}.input-group{display:none}.input-group.show{display:block}.promptAddButton{align-self:flex-end}.enter-button{align-items:center;justify-content:center;padding:4px 12px;gap:25px;font-size:.7em;letter-spacing:2px;color:#fff;cursor:pointer;background:#13152c;position:relative;border-radius:8px;border:1px solid rgb(65,65,65);transition-duration:.3s}.arrow{height:10px}.enter-button:hover{transition-duration:.3s;box-shadow:0 0 2px #b9b9b9,0 0 10px #616161}.enter-button:active{transform:scale(.95)}.asdasd{display:inline-flex}.search-results{background:#13152c;overflow-y:auto;max-height:400px}.a12345,.search-result-item{display:flex}.search-result-item h4{margin:0}.search-result-item p{margin:5px 0}.more-button{padding:inherit;background:inherit;border:1px solid rgb(65,65,65)}.tags-container{display:flex;flex-wrap:wrap;gap:5px;background-color:#2c2f33;padding:5px;border-radius:4px;font-size:.7rem;z-index:2000;position:fixed;max-width:400px;overflow:visible}.tag-item.dragging{opacity:.5}::-webkit-scrollbar{display:none}.tag-item-container{position:relative}.tag-item{display:flex;align-items:center;background-color:#3b3e43;border-radius:8px;padding:1px;position:relative}.tag-content{margin-right:5px;outline:none;background-color:transparent;border:none;color:#fff;max-width:100px;white-space:normal;word-wrap:break-word;overflow-wrap:break-word}.edit-tag{display:inline-flex;justify-content:center;align-items:center}.tag-content:focus{border-bottom:1px solid #7289da}.edit-tag,.delete-tag{margin:0 5px;cursor:pointer;padding:2px 4px;font-size:.5rem;width:25px;height:25px;display:flex;justify-content:center;align-items:center}.delete-tag{background:#cd5c5c}.tag-buttons{display:flex;justify-content:center;position:absolute;top:-24px;left:50%;transform:translate(-50%);visibility:hidden;opacity:0;transition:opacity .2s linear}.tag-item-container:hover .tag-buttons,.tag-buttons:hover{visibility:visible;opacity:1}.toggle-editor-btn{position:fixed;top:50%;left:0;transform:translateY(-50%);background-color:#7289da;color:#fff;border:none;cursor:pointer;padding:10px;border-top-right-radius:5px;border-bottom-right-radius:5px;font-size:1rem;z-index:1006}.tags-container.hidden{display:none}.tags-container.visible{display:flex}:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;display:flex;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}} ");

(function (require$$0, require$$0$1) {
  'use strict';

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  function PromptHistory({ key, activeTab, setTabs, onPromptsUpdate }) {
    const [prompts, setPrompts] = require$$0.useState(() => {
      const saved = localStorage.getItem(`promptsHistory_${activeTab.id}`);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    });
    const [newPrompt, setNewPrompt] = require$$0.useState("");
    const [newName, setNewName] = require$$0.useState("");
    const addPrompt = () => {
      if (!newPrompt.trim())
        return;
      const newEntry = { name: newName.trim() || `Prompt ${prompts.length + 1}`, prompt: newPrompt };
      setTabs((tabs) => {
        const updatedTabs = tabs.map((t) => {
          if (t.id === activeTab.id) {
            const updatedPrompts = [...t.prompts, newEntry];
            return { ...t, prompts: updatedPrompts };
          }
          return t;
        });
        return updatedTabs;
      });
      setNewPrompt("");
      setNewName("");
    };
    require$$0.useEffect(() => {
      console.log("Prompts have been updated:", prompts);
    }, [prompts]);
    const deletePrompt = (index) => {
      setTabs((tabs) => {
        return tabs.map((t) => {
          if (t.id === activeTab.id) {
            const updatedPrompts = t.prompts.filter((_, i) => i !== index);
            return { ...t, prompts: updatedPrompts };
          }
          return t;
        });
      });
    };
    const addToTextarea = (promptText) => {
      const textarea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
      if (textarea) {
        const existingContent = textarea.value;
        textarea.value = existingContent + promptText;
      }
    };
    const replaceTextArea = (promptText) => {
      const textarea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
      if (textarea) {
        textarea.value;
        textarea.value = promptText;
      }
    };
    const [showInput, setShowInput] = require$$0.useState(false);
    const updatePromptContent = (e, index) => {
      const updatedPromptText = e.target.innerText;
      setTabs((tabs) => {
        return tabs.map((tab) => {
          console.log("现在扫到tab：");
          console.log(tab.id);
          console.log("现在的id是");
          console.log(key);
          if (tab.id === activeTab.id) {
            const updatedPrompts = [...tab.prompts];
            updatedPrompts[index] = { ...updatedPrompts[index], prompt: updatedPromptText };
            return { ...tab, prompts: updatedPrompts };
          }
          return tab;
        });
      });
    };
    const updatePromptName = (e, index) => {
      const updatedName = e.target.innerText;
      setTabs((tabs) => {
        return tabs.map((tab) => {
          console.log("现在扫到tab：");
          console.log(tab.id);
          console.log("现在的id是");
          console.log(key);
          if (tab.id === activeTab.id) {
            const updatedPrompts = [...tab.prompts];
            updatedPrompts[index] = { ...updatedPrompts[index], name: updatedName };
            console.log(updatedPrompts);
            return { ...tab, prompts: updatedPrompts };
          }
          return tab;
        });
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "2px",
      backgroundColor: "#13152c",
      color: "#FFF"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: activeTab.prompts.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        item && item.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            contentEditable: "true",
            suppressContentEditableWarning: true,
            onBlur: (e) => updatePromptName(e, index),
            dangerouslySetInnerHTML: { __html: item.name },
            style: {
              border: "1px solid #ccc",
              minHeight: "20px",
              cursor: "text",
              padding: "5px",
              margin: "5px 0"
            }
          }
        ),
        item && item.prompt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            contentEditable: "true",
            suppressContentEditableWarning: true,
            onBlur: (e) => updatePromptContent(e, index),
            dangerouslySetInnerHTML: { __html: item.prompt },
            style: {
              border: "1px solid #ccc",
              minHeight: "20px",
              cursor: "text",
              padding: "5px"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "asdasd", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "enter-button", onClick: () => addToTextarea(item.prompt), children: "+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "enter-button",
              onClick: () => replaceTextArea(item.prompt),
              children: "use"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bin-button", onClick: () => deletePrompt(index), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 39 7",
                className: "bin-top",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { strokeWidth: "4", stroke: "white", y2: "5", x2: "39", y1: "5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { strokeWidth: "3", stroke: "white", y2: "1.5", x2: "26.0357", y1: "1.5", x1: "12" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 33 39",
                className: "bin-bottom",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("mask", { id: "path-1-inside-1_8_19", fill: "white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: "M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      mask: "url(#path-1-inside-1_8_19)",
                      fill: "white",
                      d: "M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeWidth: "4", stroke: "white", d: "M12 6L12 29" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeWidth: "4", stroke: "white", d: "M21 6V29" })
                ]
              }
            )
          ] })
        ] })
      ] }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "promptAddButton", onClick: () => setShowInput(!showInput), children: "+" }),
      showInput && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "input-group1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: newName,
            onChange: (e) => setNewName(e.target.value),
            required: "",
            type: "text",
            name: "text",
            autoComplete: "off",
            className: "input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "user-label", children: "Prompt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: newPrompt,
            onChange: (e) => setNewPrompt(e.target.value),
            required: "",
            type: "text",
            name: "text",
            autoComplete: "off",
            className: "input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "user-label", children: "Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: addPrompt, children: "Add Prompt" })
      ] })
    ] });
  }
  function TabManager({ tabs, setTabs, searchResults, setSearchResults, onActiveTabChange }) {
    const [newTabName, setNewTabName] = require$$0.useState("");
    const [activeTabId, setActiveTabId] = require$$0.useState(() => {
      const savedActiveTabId = localStorage.getItem("activeTabId");
      return savedActiveTabId ? JSON.parse(savedActiveTabId) : 1;
    });
    const [draggingTabId, setDraggingTabId] = require$$0.useState(null);
    const [, setPosition] = require$$0.useState({ x: 0, y: 0 });
    const [dragging, setDragging] = require$$0.useState(false);
    const [startPos] = require$$0.useState({ x: 0, y: 0 });
    require$$0.useEffect(() => {
      localStorage.setItem("tabs", JSON.stringify(tabs));
      localStorage.setItem("activeTabId", JSON.stringify(activeTabId));
    }, [tabs, activeTabId]);
    require$$0.useEffect(() => {
      const handleMouseMove = (e) => {
        if (!dragging)
          return;
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        setPosition({ x: dx, y: dy });
      };
      const handleMouseUp = () => {
        if (dragging) {
          setDragging(false);
        }
      };
      if (dragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragging, startPos]);
    const addTab = () => {
      const numericIds = tabs.map((tab) => Number(tab.id)).filter((id) => !isNaN(id));
      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
      const newTabId = maxId + 1;
      const newTab = {
        id: newTabId,
        name: newTabName || `Tab ${tabs.length + 1}`,
        prompts: []
      };
      setTabs((prevTabs) => [...prevTabs, newTab]);
      setNewTabName("");
      setActiveTabId(newTabId);
      onActiveTabChange(newTabId);
      setShowAddTab(false);
      setNewTabName("");
    };
    const deleteTab = (tabId) => {
      const tabToDelete = tabs.find((tab) => tab.id === tabId);
      if (tabToDelete && !tabToDelete.isFixed) {
        const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(updatedTabs);
        if (activeTabId === tabId) {
          setActiveTabId(updatedTabs.length > 0 ? updatedTabs[0].id : null);
          onActiveTabChange(updatedTabs.length > 0 ? updatedTabs[0].id : null);
        }
        localStorage.setItem("tabs", JSON.stringify(updatedTabs));
        if (activeTabId === tabId) {
          localStorage.setItem("activeTabId", JSON.stringify(updatedTabs.length > 0 ? updatedTabs[0].id : null));
        }
        localStorage.removeItem(`promptsHistory_${tabId}`);
      }
    };
    const [, setButtonPosition] = require$$0.useState({ top: 0, left: 0 });
    require$$0.useEffect(() => {
      const updateButtonPosition = () => {
        const promptElement = document.querySelector(".sc-b22b5055-22.ktRRzG");
        if (promptElement) {
          const rect = promptElement.getBoundingClientRect();
          setButtonPosition({
            top: rect.top + window.scrollY - 10,
            left: rect.right + 10
          });
        }
      };
      const observer = new MutationObserver(() => {
        updateButtonPosition();
      });
      const config = { childList: true, subtree: true };
      const targetNode = document.body;
      observer.observe(targetNode, config);
      updateButtonPosition();
      return () => observer.disconnect();
    }, []);
    const handleTabChange = (id) => {
      setActiveTabId(id);
      onActiveTabChange(id);
    };
    const handleDragStart = (id) => () => {
      setDraggingTabId(id);
    };
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    const handleDrop = (targetId) => (e) => {
      e.preventDefault();
      const draggedTabIndex = tabs.findIndex((tab) => tab.id === draggingTabId);
      const targetTabIndex = tabs.findIndex((tab) => tab.id === targetId);
      if (draggedTabIndex !== -1 && targetTabIndex !== -1) {
        const newTabs = Array.from(tabs);
        const [removed] = newTabs.splice(draggedTabIndex, 1);
        newTabs.splice(targetTabIndex, 0, removed);
        setTabs(newTabs);
      }
      setDraggingTabId(null);
    };
    const [showAddTab, setShowAddTab] = require$$0.useState(false);
    require$$0.useEffect(() => {
      if (showAddTab) {
        const inputElement = document.querySelector(".input1");
        inputElement && inputElement.focus();
      }
    }, [showAddTab]);
    const [searchTerm, setSearchTerm] = require$$0.useState("");
    const [expandedResults, setExpandedResults] = require$$0.useState(/* @__PURE__ */ new Map());
    require$$0.useEffect(() => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      const results = /* @__PURE__ */ new Map();
      tabs.forEach((tab) => {
        tab.prompts.forEach((prompt) => {
          if (prompt.name.includes(searchTerm) || prompt.prompt.includes(searchTerm)) {
            const key = `${prompt.name}:${prompt.prompt}`;
            if (!results.has(key)) {
              results.set(key, prompt);
            }
          }
        });
      });
      setSearchResults(Array.from(results.values()));
    }, [searchTerm, tabs, setSearchResults]);
    const toggleExpandResult = (key) => {
      setExpandedResults((prev) => {
        const newExpanded = new Map(prev);
        newExpanded.set(key, !newExpanded.get(key));
        return newExpanded;
      });
    };
    function truncateText(text, maxLength) {
      if (text.length <= maxLength) {
        return text;
      }
      return `${text.substring(0, maxLength)}...`;
    }
    const addToTextarea = (promptText) => {
      const textarea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
      if (textarea) {
        const existingContent = textarea.value;
        textarea.value = existingContent + promptText;
      }
    };
    const replaceTextArea = (promptText) => {
      const textarea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
      if (textarea) {
        textarea.value;
        textarea.value = promptText;
      }
    };
    const handlePromptsUpdate = (updatedPrompts) => {
      const updatedTabs = tabs.map((tab) => {
        if (tab.id === activeTabId) {
          return { ...tab, prompts: updatedPrompts };
        }
        return tab;
      });
      console.log("修改");
      setTabs(updatedTabs);
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
    };
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tab-manager-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "search-results", children: searchResults.map((result, index) => {
        const key = `${result.name}:${index}`;
        const isExpanded = expandedResults.get(key);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-result-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: result.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isExpanded ? result.prompt : truncateText(result.prompt, 100) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "more-button",
              onClick: () => toggleExpandResult(key),
              children: isExpanded ? "less" : "more"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "enter-button", onClick: () => addToTextarea(result.prompt), children: "+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "enter-button", onClick: () => replaceTextArea(result.prompt), children: "use" })
        ] }, key);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "search-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: "Search..."
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabs-bar", children: [
        tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `tab ${tab.id === activeTabId ? "active" : ""}`,
            draggable: !tab.isFixed,
            onDragStart: tab.isFixed ? null : handleDragStart(tab.id),
            onDragOver: handleDragOver,
            onDrop: handleDrop(tab.id),
            onClick: () => handleTabChange(tab.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.name }),
              !tab.isFixed && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bin-button", onClick: () => deleteTab(tab.id), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 39 7",
                    className: "bin-top",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { strokeWidth: "4", stroke: "white", y2: "5", x2: "39", y1: "5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { strokeWidth: "3", stroke: "white", y2: "1.5", x2: "26.0357", y1: "1.5", x1: "12" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 33 39",
                    className: "bin-bottom",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("mask", { id: "path-1-inside-1_8_19", fill: "white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          mask: "url(#path-1-inside-1_8_19)",
                          fill: "white",
                          d: "M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeWidth: "4", stroke: "white", d: "M12 6L12 29" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeWidth: "4", stroke: "white", d: "M21 6V29" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 89 80",
                    className: "garbage",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        fill: "white",
                        d: "M20.5 10.5L...L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                      }
                    )
                  }
                )
              ] })
            ]
          },
          tab.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowAddTab(true);
        }, className: "add-tab-button", children: "+" }),
        showAddTab && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `input-group ${showAddTab ? "show" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: newTabName,
              onChange: (e) => setNewTabName(e.target.value),
              required: "",
              type: "text",
              name: "text",
              autoComplete: "off",
              className: "input1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "user-label", children: "Tab" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: addTab, className: "button", children: "Add Tab" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tab-content", children: activeTab ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        PromptHistory,
        {
          activeTab,
          setTabs,
          onPromptsUpdate: handlePromptsUpdate
        },
        activeTab.id
      ) : null })
    ] });
  }
  function TextAreaItemsEditor() {
    const [items, setItems] = require$$0.useState([]);
    const [isEditorVisible, setIsEditorVisible] = require$$0.useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = require$$0.useState(null);
    const [dragging, setDragging] = require$$0.useState(false);
    const handleDragStart = (e, index) => {
      setDraggedItemIndex(index);
      setDragging(true);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "");
      e.currentTarget.classList.add("dragging");
    };
    const handleDragOver = (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };
    const handleDragEnd = (e) => {
      setDragging(false);
      e.currentTarget.classList.remove("dragging");
    };
    const handleDrop = (e, targetIndex) => {
      e.preventDefault();
      if (draggedItemIndex === null || draggedItemIndex === targetIndex)
        return;
      const newItems = [...items];
      const [item] = newItems.splice(draggedItemIndex, 1);
      const newIndex = draggedItemIndex < targetIndex ? targetIndex - 1 : targetIndex;
      newItems.splice(newIndex, 0, item);
      setItems(newItems);
      updateTextArea(newItems);
      setDraggedItemIndex(null);
    };
    require$$0.useEffect(() => {
      const observer = new MutationObserver((mutations, obs) => {
        const textArea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
        if (textArea) {
          setItems(splitContent(textArea.value));
          const handleInput = () => {
            setItems(splitContent(textArea.value));
          };
          textArea.addEventListener("input", handleInput);
          obs.disconnect();
          return () => {
            textArea.removeEventListener("input", handleInput);
          };
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const splitContent = (content) => {
        const pattern = /{(.*?)}|([^,]+)/g;
        let match;
        let initialItems = [];
        while ((match = pattern.exec(content)) !== null) {
          initialItems.push(match[1] ? `{${match[1]}}` : match[0].trim());
        }
        return initialItems;
      };
      return () => observer.disconnect();
    }, []);
    const updateTextArea = (newItems) => {
      const textArea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
      if (textArea) {
        textArea.value = newItems.join(", ");
      }
    };
    const handleItemUpdate = (index, newItem) => {
      const newItems = [...items];
      newItems[index] = newItem;
      setItems(newItems);
      updateTextArea(newItems);
    };
    const handleItemDelete = (index) => {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      updateTextArea(newItems);
    };
    const handleAddBraces = (index, openingBrace, closingBrace) => {
      const newItems = [...items];
      newItems[index] = openingBrace + newItems[index] + closingBrace;
      setItems(newItems);
      updateTextArea(newItems);
    };
    const handleRemoveBraces = (index) => {
      let newItem = items[index];
      if (newItem.startsWith("{") && newItem.endsWith("}")) {
        newItem = newItem.slice(1, -1);
      } else if (newItem.startsWith("[") && newItem.endsWith("]")) {
        newItem = newItem.slice(1, -1);
      }
      const newItems = [...items];
      newItems[index] = newItem;
      setItems(newItems);
      updateTextArea(newItems);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "toggle-editor-btn",
          onClick: () => setIsEditorVisible(!isEditorVisible),
          children: isEditorVisible ? "<" : ">"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `tags-container ${isEditorVisible ? "visible" : "hidden"}`, children: items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "tag-item-container",
          draggable: "true",
          onDragStart: (e) => handleDragStart(e, index),
          onDragOver: (e) => handleDragOver(e),
          onDragEnd: handleDragEnd,
          onDrop: (e) => handleDrop(e, index),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tag-buttons", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "edit-tag", onClick: () => handleAddBraces(index, "{", "}"), children: "丄" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "edit-tag", onClick: () => handleAddBraces(index, "[", "]"), children: "丅" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "edit-tag", onClick: () => handleRemoveBraces(index), children: "一" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tag-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  contentEditable: true,
                  className: "tag-content",
                  onBlur: (e) => handleItemUpdate(index, e.target.textContent),
                  dangerouslySetInnerHTML: { __html: item }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "delete-tag", onClick: () => handleItemDelete(index), children: "x" })
            ] })
          ]
        },
        index
      )) })
    ] });
  }
  function SideDrawer({ triggerSelector }) {
    const [isVisible, setIsVisible] = require$$0.useState(true);
    const triggerRef = require$$0.useRef();
    const [buttonPosition, setButtonPosition] = require$$0.useState({ top: 0, left: 0 });
    const [tabs, setTabs] = require$$0.useState(() => {
      const savedTabs = localStorage.getItem("tabs");
      const parsedTabs = savedTabs ? JSON.parse(savedTabs) : null;
      console.log(savedTabs);
      const defaultTabs = [
        { id: "favorites", name: "收藏", prompts: [], isFixed: true },
        { id: "history", name: "历史", prompts: [], isFixed: true }
      ];
      return Array.isArray(parsedTabs) && parsedTabs.length > 0 ? parsedTabs : defaultTabs;
    });
    const [activeTabId, setActiveTabId] = require$$0.useState(null);
    const handleActiveTabChange = (newActiveTabId) => {
      setActiveTabId(newActiveTabId);
    };
    require$$0.useEffect(() => {
      localStorage.setItem("tabs", JSON.stringify(tabs));
    }, [tabs]);
    const addPromptToFavorites = () => {
      const textArea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
      if (textArea) {
        const promptText = textArea.value;
        const favoritesTab = tabs.find((tab) => tab.id === "favorites");
        if (favoritesTab && Array.isArray(favoritesTab.prompts)) {
          const isDuplicate = favoritesTab.prompts.some((prompt) => (prompt == null ? void 0 : prompt.prompt) === promptText);
          if (!isDuplicate) {
            const newName = `Prompt ${favoritesTab.prompts.length + 1}`;
            const newPrompt = { name: newName, prompt: promptText };
            const updatedTabs = tabs.map((tab) => {
              if (tab.id === "favorites") {
                const updatedPrompts = [...tab.prompts, newPrompt];
                return { ...tab, prompts: updatedPrompts };
              }
              return tab;
            });
            setTabs(updatedTabs);
            console.log(updatedTabs);
            localStorage.setItem("tabs", JSON.stringify(updatedTabs));
          }
        }
      }
    };
    const addPromptToActiveTab = () => {
      const textArea = document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
      if (textArea) {
        const promptText = textArea.value;
        console.log("标记");
        const activeTab = tabs.find((tab) => tab.id === activeTabId);
        if (activeTab && Array.isArray(activeTab.prompts)) {
          const isDuplicate = activeTab.prompts.some((prompt) => (prompt == null ? void 0 : prompt.prompt) === promptText);
          if (!isDuplicate) {
            const newName = `Prompt ${activeTab.prompts.length + 1}`;
            const newPrompt = { name: newName, prompt: promptText };
            setTabs((tabs2) => tabs2.map((tab) => {
              if (tab.id === activeTab.id) {
                return { ...tab, prompts: [...tab.prompts, newPrompt] };
              }
              return tab;
            }));
          }
        }
      }
    };
    const [isFavorited, setIsFavorited] = require$$0.useState(false);
    require$$0.useEffect(() => {
      if (isFavorited) {
        addPromptToFavorites();
        const timer = setTimeout(() => {
          setIsFavorited(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [isFavorited]);
    const handleFavoriteClick = () => {
      setIsFavorited(true);
    };
    const toggleDrawer = () => {
      setIsVisible((prevState) => !prevState);
    };
    const setTriggerPosition = require$$0.useCallback(() => {
      const triggerElement = document.querySelector(triggerSelector);
      if (triggerElement && triggerRef.current) {
        const { right, top, height } = triggerElement.getBoundingClientRect();
        triggerRef.current.style.top = `${top}px`;
        triggerRef.current.style.height = `${height}px`;
        triggerRef.current.style.left = `${right + 13}px`;
        console.log(triggerRef.current.style.left);
      }
      const promptElement1 = document.querySelector(".sc-b22b5055-22.ktRRzG");
      if (promptElement1) {
        const promptElementRect = promptElement1.getBoundingClientRect();
        setButtonPosition({
          top: promptElementRect.top + window.scrollY - 10,
          // 加上滚动偏移量
          left: promptElementRect.right + 10
          // 右侧偏移10px
        });
      }
    }, [triggerSelector]);
    require$$0.useEffect(() => {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            setTriggerPosition();
            const promptElement = document.querySelector(".sc-b22b5055-22.ktRRzG");
            if (promptElement) {
              const promptElementRect = promptElement.getBoundingClientRect();
              setButtonPosition({
                top: promptElementRect.top + window.scrollY - 10,
                // 加上滚动偏移量
                left: promptElementRect.right + 10
                // 右侧偏移10px
              });
            }
            observer.disconnect();
            break;
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }, [setTriggerPosition, triggerSelector]);
    require$$0.useEffect(() => {
      setTriggerPosition();
      window.addEventListener("resize", setTriggerPosition);
      return () => window.removeEventListener("resize", setTriggerPosition);
    }, [setTriggerPosition]);
    require$$0.useEffect(() => {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            const triggerElement = document.querySelector(triggerSelector);
            if (triggerElement) {
              setTriggerPosition();
              const targetElement = document.querySelector(".sc-b22b5055-0.kWaZHl");
              if (targetElement) {
                targetElement.style.zIndex = "1001";
              }
              observer.disconnect();
              break;
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }, [setTriggerPosition, triggerSelector]);
    const [, setOffset] = require$$0.useState(0);
    require$$0.useEffect(() => {
      if (isVisible) {
        setOffset((prevOffset) => prevOffset + 10);
      }
    }, [isVisible]);
    const addToHistory = (promptText) => {
      if (typeof promptText !== "string" || !promptText.trim()) {
        console.warn("Invalid promptText provided to addToHistory");
        return;
      }
      console.log(tabs);
      setTabs((tabs2) => tabs2.map((tab) => {
        if (tab.id === "history") {
          const isDuplicate = tab.prompts.some((prompt) => (prompt == null ? void 0 : prompt.prompt) === promptText);
          if (!isDuplicate) {
            return {
              ...tab,
              prompts: [...tab.prompts, { name: `Prompt ${tab.prompts.length + 1}`, prompt: promptText }]
            };
          } else {
            return tab;
          }
        }
        return tab;
      }));
    };
    const handleButtonClick = () => {
      const inputText = document.querySelector("textarea").value;
      addToHistory(inputText);
    };
    require$$0.useEffect(() => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            const button = document.querySelector(".sc-d72450af-1.sc-2fe5a182-20.kXFbYD.kHiDKS");
            if (button) {
              button.addEventListener("click", handleButtonClick);
              observer.disconnect();
              break;
            }
          }
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return () => {
        observer.disconnect();
        const button = document.querySelector(".sc-d72450af-1.sc-2fe5a182-20.kXFbYD.kHiDKS");
        if (button) {
          button.removeEventListener("click", handleButtonClick);
        }
      };
    }, []);
    require$$0.useEffect(() => {
      const observer = new MutationObserver((mutationsList, observer2) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            const button = document.querySelector(".sc-d72450af-1.sc-2fe5a182-20.kXFbYD.kHiDKS");
            if (button) {
              button.addEventListener("click", handleButtonClick);
              observer2.disconnect();
              break;
            }
          }
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return () => observer.disconnect();
    }, []);
    const [searchResults, setSearchResults] = require$$0.useState([]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thing", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "animated-button",
          onClick: toggleDrawer,
          style: { top: "650px", left: `0px` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className: "arr-2", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text", children: "Prompt Tab" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "circle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className: "arr-1", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: "container",
          style: { top: "645px", left: `145px` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", onClick: handleFavoriteClick, readOnly: true, checked: isFavorited }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                height: "24px",
                id: "Layer_1",
                version: "1.2",
                viewBox: "0 0 24 24",
                width: "24px",
                "xml:space": "preserve",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z" }) }) })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          className: "container1",
          style: { top: "650px", left: `215px` },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "container1", onClick: addPromptToActiveTab, children: "Add to Current->" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `side-drawer ${isVisible ? "visible" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabManager,
        {
          tabs,
          setTabs,
          onActiveTabChange: handleActiveTabChange,
          addPromptToFavorites,
          searchResults,
          setSearchResults
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextAreaItemsEditor, {})
    ] });
  }
  function App() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "App", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SideDrawer, { triggerSelector: ".sc-5db1afd3-16.bwGvYE" }) });
  }
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );

})(React, ReactDOM);