// ==UserScript==
// @name       novalai prompt editor
// @namespace  npm/vite-plugin-monkey
// @version    0.1.0
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      https://novelai.net/image
// @require    https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require    https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @grant      GM_addStyle
// @license    MIT
// @description novalai prompt editor, by liao, use it, you will know
// @downloadURL https://update.greasyfork.org/scripts/520053/novalai%20prompt%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/520053/novalai%20prompt%20editor.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(" #root{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}.logo{height:6em;padding:1.5em;will-change:filter}.logo:hover{filter:drop-shadow(0 0 2em #646cffaa)}.logo.react:hover{filter:drop-shadow(0 0 2em #61dafbaa)}@keyframes logo-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@media (prefers-reduced-motion: no-preference){a:nth-of-type(2) .logo{animation:logo-spin infinite 20s linear}}.card{padding:2em}.read-the-docs{color:#888}:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;display:flex;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}} ");

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
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
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
  const TabList = ({
    categories,
    activeTab,
    onTabChange,
    onUpdateCategory,
    onDeleteCategory,
    onReorderCategories
  }) => {
    const handleDragStart = (e, tab) => {
      e.dataTransfer.setData("text/plain", tab);
    };
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    const handleDrop = (e, targetTab) => {
      e.preventDefault();
      const sourceTab = e.dataTransfer.getData("text/plain");
      if (sourceTab !== targetTab && sourceTab !== "历史记录" && targetTab !== "历史记录") {
        onReorderCategories(sourceTab, targetTab);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      flexWrap: "wrap",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      marginBottom: "10px",
      gap: "5px",
      maxWidth: "100%",
      overflowX: "auto",
      whiteSpace: "nowrap",
      paddingBottom: "5px"
    }, children: Object.keys(categories).map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        draggable: tab !== "历史记录",
        onDragStart: (e) => handleDragStart(e, tab),
        onDragOver: handleDragOver,
        onDrop: (e) => handleDrop(e, tab),
        style: {
          display: "flex",
          alignItems: "center",
          cursor: tab !== "历史记录" ? "grab" : "default"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              contentEditable: tab !== "历史记录",
              onBlur: (e) => onUpdateCategory(tab, e.target.textContent),
              style: {
                background: "transparent",
                border: "none",
                color: activeTab === tab ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                padding: "10px 15px",
                cursor: tab !== "历史记录" ? "pointer" : "default",
                borderBottom: activeTab === tab ? "2px solid #ffffff" : "none",
                marginBottom: "-1px",
                outline: "none"
              },
              onClick: () => onTabChange(tab),
              children: tab
            }
          ),
          tab !== "历史记录" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onDeleteCategory(tab);
              },
              style: {
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                padding: "0 5px",
                fontSize: "14px",
                marginRight: "5px"
              },
              children: "×"
            }
          )
        ]
      },
      tab
    )) });
  };
  const PromptList = ({ prompts, onUpdatePrompt, onDeletePrompt, categoryName, onReorderPrompts }) => {
    const handleApplyPrompt = (prompt) => {
      const textarea = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > textarea");
      if (textarea) {
        const currentValue = textarea.value;
        textarea.value = currentValue + (currentValue ? "\n" : "") + prompt;
        const inputEvent = new Event("input", { bubbles: true });
        textarea.dispatchEvent(inputEvent);
        const changeEvent = new Event("change", { bubbles: true });
        textarea.dispatchEvent(changeEvent);
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    };
    const handleDragStart = (e, index) => {
      e.dataTransfer.setData("text/plain", index.toString());
    };
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    const handleDrop = (e, targetIndex) => {
      e.preventDefault();
      const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
      if (sourceIndex !== targetIndex) {
        onReorderPrompts(categoryName, sourceIndex, targetIndex);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      overflowY: "auto",
      overflowX: "hidden",
      flex: 1,
      width: "100%"
    }, children: prompts.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        draggable: categoryName !== "历史记录",
        onDragStart: (e) => handleDragStart(e, index),
        onDragOver: handleDragOver,
        onDrop: (e) => handleDrop(e, index),
        style: {
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "10px",
          position: "relative",
          cursor: categoryName !== "历史记录" ? "grab" : "default"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: "8px", right: "8px", display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleApplyPrompt(item.prompt),
                style: {
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontSize: "14px"
                },
                title: "应用到输入框",
                children: "←"
              }
            ),
            categoryName !== "历史记录" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => onDeletePrompt(index),
                style: {
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontSize: "14px"
                },
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                contentEditable: true,
                onBlur: (e) => onUpdatePrompt(index, "title", e.target.textContent),
                style: {
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#fff",
                  outline: "none",
                  marginRight: "8px"
                },
                children: item.title
              }
            ),
            item.count && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)"
            }, children: [
              "(",
              item.count,
              "次)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              contentEditable: true,
              onBlur: (e) => onUpdatePrompt(index, "prompt", e.target.textContent),
              style: {
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: "1.4",
                outline: "none"
              },
              children: item.prompt
            }
          )
        ]
      },
      index
    )) });
  };
  const ActionButtons = ({ onAddCategory, onAddPrompt }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onAddCategory,
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            color: "#fff",
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            flex: 1
          },
          children: "新增分类"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onAddPrompt,
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            color: "#fff",
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            flex: 1
          },
          children: "新增提示词"
        }
      )
    ] });
  };
  const Drawer = ({
    isOpen,
    onClose,
    targetRight,
    zIndex,
    categories,
    activeTab,
    onAddCategory,
    onAddPrompt,
    onUpdateCategory,
    onUpdatePrompt,
    onDeleteCategory,
    onDeletePrompt,
    onTabChange,
    onReorderCategories,
    onReorderPrompts,
    onExport,
    onImport
  }) => {
    const drawerRef = require$$0.useRef(null);
    require$$0.useEffect(() => {
      var _a;
      if (isOpen) {
        (_a = drawerRef.current) == null ? void 0 : _a.focus();
      }
    }, [isOpen]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: drawerRef,
        tabIndex: -1,
        className: "drawer",
        style: {
          position: "fixed",
          left: isOpen ? targetRight + 1 : "-100%",
          top: 0,
          minWidth: "300px",
          width: `${Math.min(300 + Object.keys(categories).length * 100, window.innerWidth * 0.8)}px`,
          height: "100%",
          background: "rgb(34, 37, 63)",
          boxShadow: isOpen ? "0 0 20px rgba(0,0,0,0.3)" : "none",
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(${isOpen ? "0" : "-30px"})`,
          opacity: isOpen ? 1 : 0,
          zIndex,
          padding: "20px",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              style: {
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                fontSize: "20px",
                padding: "4px 8px",
                lineHeight: 1,
                zIndex: 1
              },
              children: "×"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabList,
            {
              categories,
              activeTab,
              onTabChange,
              onUpdateCategory,
              onDeleteCategory,
              onReorderCategories
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActionButtons,
            {
              onAddCategory,
              onAddPrompt
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PromptList,
            {
              prompts: categories[activeTab] || [],
              onUpdatePrompt: (index, field, value) => onUpdatePrompt(activeTab, index, field, value),
              onDeletePrompt: (index) => onDeletePrompt(activeTab, index),
              categoryName: activeTab,
              onReorderPrompts
            }
          )
        ]
      }
    );
  };
  const SearchPrompts = ({ categories = [], onAddPrompt }) => {
    const [isOpen, setIsOpen] = require$$0.useState(false);
    const [searchTerm, setSearchTerm] = require$$0.useState("");
    const [searchResults, setSearchResults] = require$$0.useState([]);
    const modalRef = require$$0.useRef(null);
    const [isDragging, setIsDragging] = require$$0.useState(false);
    const [dragOffset, setDragOffset] = require$$0.useState({ x: 0, y: 0 });
    const [position, setPosition] = require$$0.useState({ x: 100, y: 100 });
    const handleMouseDown = (e) => {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    require$$0.useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, dragOffset]);
    require$$0.useEffect(() => {
      if (!searchTerm.trim() || !Array.isArray(categories)) {
        setSearchResults([]);
        return;
      }
      const results = [];
      categories.forEach((category) => {
        if (category && Array.isArray(category.prompts)) {
          category.prompts.forEach((prompt) => {
            if (prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.content.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                ...prompt,
                categoryName: category.name
              });
            }
          });
        }
      });
      setSearchResults(results);
    }, [searchTerm, categories]);
    const handleAddPrompt = (prompt) => {
      const textarea = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > textarea");
      if (textarea) {
        const currentValue = textarea.value;
        const separator = currentValue ? ", " : "";
        textarea.value = currentValue + separator + prompt.content;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setIsOpen(!isOpen),
          style: {
            position: "fixed",
            right: "320px",
            top: "10px",
            background: "#1f1f1f",
            border: "1px solid #333",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            opacity: "0.8",
            transition: "opacity 0.2s",
            zIndex: 1e3
          },
          onMouseOver: (e) => e.target.style.opacity = "1",
          onMouseOut: (e) => e.target.style.opacity = "0.8",
          children: isOpen ? "关闭搜索" : "搜索提示词"
        }
      ),
      isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: modalRef,
          style: {
            position: "fixed",
            top: position.y,
            left: position.x,
            background: "#1a1b1e",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 1001,
            width: "400px",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onMouseDown: handleMouseDown,
                style: {
                  padding: "8px",
                  marginBottom: "8px",
                  cursor: "move",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  userSelect: "none"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  width: "20px",
                  height: "2px",
                  background: "rgba(255, 255, 255, 0.3)",
                  margin: "0 auto"
                } })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                placeholder: "搜索提示词...",
                autoFocus: true,
                style: {
                  width: "100%",
                  padding: "8px",
                  background: "#2c2e33",
                  border: "1px solid #3f4147",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "14px"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  overflowY: "auto",
                  maxHeight: "60vh",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                },
                children: searchResults.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      background: "#2c2e33",
                      padding: "10px",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                          fontSize: "14px",
                          color: "#fff",
                          marginBottom: "4px"
                        }, children: result.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.5)",
                          marginBottom: "4px"
                        }, children: [
                          "分类: ",
                          result.categoryName
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.7)",
                          wordBreak: "break-all"
                        }, children: result.content })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => handleAddPrompt(result),
                          style: {
                            background: "transparent",
                            border: "none",
                            color: "rgba(255, 255, 255, 0.5)",
                            cursor: "pointer",
                            padding: "4px 8px",
                            fontSize: "14px"
                          },
                          title: "应用到输入框",
                          children: "←"
                        }
                      )
                    ]
                  },
                  index
                ))
              }
            )
          ]
        }
      )
    ] });
  };
  function App() {
    const [isDrawerOpen, setIsDrawerOpen] = require$$0.useState(false);
    const [targetRight, setTargetRight] = require$$0.useState(0);
    const [zIndex, setZIndex] = require$$0.useState(998);
    const [activeTab, setActiveTab] = require$$0.useState("历史记录");
    const [isTargetButtonVisible, setIsTargetButtonVisible] = require$$0.useState(false);
    const [categories, setCategories] = require$$0.useState(() => {
      const savedData = localStorage.getItem("promptCategories");
      return savedData ? JSON.parse(savedData) : {
        "历史记录": [],
        "人物": [
          { title: "可爱女孩", prompt: "cute girl, white hair, blue eyes, school uniform" },
          { title: "帅气男孩", prompt: "handsome boy, black hair, casual wear, smile" }
        ],
        "场景": [
          { title: "森林", prompt: "deep forest, sunlight through leaves, mystical atmosphere" },
          { title: "城市", prompt: "modern city, night scene, neon lights, rain" }
        ],
        "风格": [
          { title: "水彩画", prompt: "watercolor style, soft colors, flowing texture" },
          { title: "赛博朋克", prompt: "cyberpunk style, high tech, neon, dark" }
        ]
      };
    });
    require$$0.useEffect(() => {
      localStorage.setItem("promptCategories", JSON.stringify(categories));
    }, [categories]);
    require$$0.useEffect(() => {
      const handleButtonClick = () => {
        const textarea = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > textarea");
        if (textarea && textarea.value) {
          const newPromptText = textarea.value;
          setCategories((prev) => {
            const historyRecords = [...prev["历史记录"]];
            const existingIndex = historyRecords.findIndex((item) => item.prompt === newPromptText);
            if (existingIndex !== -1) {
              historyRecords[existingIndex] = {
                ...historyRecords[existingIndex],
                count: (historyRecords[existingIndex].count || 1) + 1,
                title: (/* @__PURE__ */ new Date()).toLocaleString()
              };
              const [item] = historyRecords.splice(existingIndex, 1);
              historyRecords.unshift(item);
            } else {
              historyRecords.unshift({
                title: (/* @__PURE__ */ new Date()).toLocaleString(),
                prompt: newPromptText,
                count: 1
              });
            }
            return {
              ...prev,
              "历史记录": historyRecords
            };
          });
        }
      };
      const setupButtonListener = () => {
        const targetButton = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(5) > button");
        if (targetButton) {
          targetButton.addEventListener("click", handleButtonClick);
          return () => targetButton.removeEventListener("click", handleButtonClick);
        }
        return null;
      };
      let cleanup = setupButtonListener();
      const observer = new MutationObserver(() => {
        if (cleanup) cleanup();
        cleanup = setupButtonListener();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return () => {
        observer.disconnect();
        if (cleanup) cleanup();
      };
    }, []);
    require$$0.useEffect(() => {
      const checkTargetButton = () => {
        const targetButton = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(5) > button");
        const isVisible = !!targetButton;
        setIsTargetButtonVisible(isVisible);
        if (!isVisible && isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      };
      checkTargetButton();
      const observer = new MutationObserver(checkTargetButton);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return () => observer.disconnect();
    }, [isDrawerOpen]);
    require$$0.useEffect(() => {
      const updatePosition = () => {
        const targetElement = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(3)");
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          setTargetRight(rect.right);
        }
      };
      const updateZIndex = () => {
        const upperElement = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN");
        if (upperElement) {
          const upperZIndex = parseInt(window.getComputedStyle(upperElement).zIndex) || 0;
          setZIndex(Math.max(1, upperZIndex - 1));
        }
      };
      updatePosition();
      updateZIndex();
      window.addEventListener("resize", updatePosition);
      const observer = new MutationObserver(() => {
        updatePosition();
        updateZIndex();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
      });
      return () => {
        window.removeEventListener("resize", updatePosition);
        observer.disconnect();
      };
    }, []);
    require$$0.useEffect(() => {
      const textarea = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > textarea");
      if (textarea && textarea.parentElement) {
        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
        display: flex;
        gap: 8px;
        position: absolute;
        right: 10px;
        top: -30px;
      `;
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = "importFile";
        fileInput.accept = ".json";
        fileInput.style.display = "none";
        fileInput.addEventListener("change", handleImport);
        const importButton = document.createElement("button");
        importButton.textContent = "导入提示词";
        importButton.style.cssText = `
        background: #1f1f1f;
        border: 1px solid #333;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0.8;
        transition: opacity 0.2s;
      `;
        importButton.onmouseover = () => importButton.style.opacity = "1";
        importButton.onmouseout = () => importButton.style.opacity = "0.8";
        importButton.onclick = () => fileInput.click();
        const exportButton = document.createElement("button");
        exportButton.textContent = "导出提示词";
        exportButton.style.cssText = `
        background: #1f1f1f;
        border: 1px solid #333;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0.8;
        transition: opacity 0.2s;
      `;
        exportButton.onmouseover = () => exportButton.style.opacity = "1";
        exportButton.onmouseout = () => exportButton.style.opacity = "0.8";
        exportButton.onclick = handleExport;
        buttonContainer.appendChild(fileInput);
        buttonContainer.appendChild(importButton);
        buttonContainer.appendChild(exportButton);
        textarea.parentElement.style.position = "relative";
        textarea.parentElement.appendChild(buttonContainer);
        return () => {
          textarea.parentElement.removeChild(buttonContainer);
        };
      }
    }, []);
    const handleAddCategory = () => {
      const newCategoryName = `新分类${Object.keys(categories).length + 1}`;
      setCategories((prev) => ({
        ...prev,
        [newCategoryName]: []
      }));
      setActiveTab(newCategoryName);
    };
    const handleAddPrompt = () => {
      setCategories((prev) => ({
        ...prev,
        [activeTab]: [
          ...prev[activeTab],
          { title: "新提示词", prompt: "在此输入提示词内容" }
        ]
      }));
    };
    const handleUpdateCategory = (oldName, newName) => {
      if (oldName === newName) return;
      if (oldName === "历史记录") return;
      setCategories((prev) => {
        const newCategories = { ...prev };
        newCategories[newName] = newCategories[oldName];
        delete newCategories[oldName];
        return newCategories;
      });
      if (activeTab === oldName) {
        setActiveTab(newName);
      }
    };
    const handleUpdatePrompt = (categoryName, index, field, value) => {
      setCategories((prev) => ({
        ...prev,
        [categoryName]: prev[categoryName].map(
          (item, i) => i === index ? { ...item, [field]: value } : item
        )
      }));
    };
    const handleDeleteCategory = (categoryName) => {
      if (categoryName === "历史记录") return;
      if (Object.keys(categories).length <= 2) {
        alert("至少保留一个分类");
        return;
      }
      setCategories((prev) => {
        const newCategories = { ...prev };
        delete newCategories[categoryName];
        if (activeTab === categoryName) {
          setActiveTab(Object.keys(newCategories)[0]);
        }
        return newCategories;
      });
    };
    const handleDeletePrompt = (categoryName, index) => {
      setCategories((prev) => ({
        ...prev,
        [categoryName]: prev[categoryName].filter((_, i) => i !== index)
      }));
    };
    const handleImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            if (typeof importedData === "object" && importedData !== null) {
              setCategories(importedData);
            } else {
              alert("无效的数据格式");
            }
          } catch (error) {
            alert("导入失败：" + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    const handleExport = () => {
      const dataStr = JSON.stringify(categories, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prompt-categories-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    const handleReorderCategories = (sourceTab, targetTab) => {
      setCategories((prev) => {
        const entries = Object.entries(prev);
        const sourceIndex = entries.findIndex(([key]) => key === sourceTab);
        const targetIndex = entries.findIndex(([key]) => key === targetTab);
        if (sourceIndex !== -1 && targetIndex !== -1) {
          const newEntries = [...entries];
          const [removed] = newEntries.splice(sourceIndex, 1);
          newEntries.splice(targetIndex, 0, removed);
          return Object.fromEntries(newEntries);
        }
        return prev;
      });
    };
    const handleReorderPrompts = (categoryName, sourceIndex, targetIndex) => {
      setCategories((prev) => {
        const category = [...prev[categoryName]];
        const [removed] = category.splice(sourceIndex, 1);
        category.splice(targetIndex, 0, removed);
        return {
          ...prev,
          [categoryName]: category
        };
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "App", children: isTargetButtonVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "drawer-trigger",
          onClick: () => setIsDrawerOpen(!isDrawerOpen),
          style: {
            position: "fixed",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "30px",
            height: "60px",
            background: "#4a4a4a",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: "pointer",
            zIndex
          },
          children: isDrawerOpen ? "←" : "→"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Drawer,
        {
          isOpen: isDrawerOpen,
          targetRight,
          zIndex,
          categories,
          activeTab,
          onAddCategory: handleAddCategory,
          onAddPrompt: handleAddPrompt,
          onUpdateCategory: handleUpdateCategory,
          onUpdatePrompt: handleUpdatePrompt,
          onDeleteCategory: handleDeleteCategory,
          onDeletePrompt: handleDeletePrompt,
          onTabChange: setActiveTab,
          onReorderCategories: handleReorderCategories,
          onReorderPrompts: handleReorderPrompts,
          onExport: handleExport
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SearchPrompts,
        {
          categories: Object.entries(categories).map(([name, prompts]) => ({
            name,
            prompts: prompts.map((p2) => ({
              name: p2.title,
              content: p2.prompt
            }))
          })),
          onAddPrompt: (prompt) => {
            const textarea = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-780ff592-0.jEOQDN > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > textarea");
            if (textarea) {
              textarea.value = prompt.content;
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
        }
      )
    ] }) });
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