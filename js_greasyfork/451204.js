// ==UserScript==
// @name         copy selector
// @namespace    https://github.com/Allen-1998
// @version      0.4
// @description  Gets the shortest selector for a page element. The effect is the same as Chrome DevTools Copy Selector.
// @author       Allen-1998
// @match        *://*/*
// @license      BSD-3-Clause license
// @downloadURL https://update.greasyfork.org/scripts/451204/copy%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/451204/copy%20selector.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // style
  const head = document.querySelector("head");
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerText = `
    .copy-selector-hover {
      background: #00f3;
    }
    .copy-selector-focus {
      background: #0f03;
    }

    #copy-success-message {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translate(-50%, -150%);
      padding: 0 40px;
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
      color: #67c23a;
      background-color: #e1f3d8;
      font-size: 14px !important;
      outline: 1px solid #67c23a66 !important;
      pointer-events: none !important;
      z-index: 2147483647;
    }
    .show-copy-success-message {
      animation: copySuccessMessage 2s;
    }

    #copy-selector-panel {
      position: fixed;
      top: 0;
      right: 0;
      background: #fff;
      box-shadow: 0 0 5px 5px #0002;
      padding: 10px;
      display: flex;
      align-items: center;
      font-size: 14px !important;
      outline-style: none !important;
      z-index: 2147483647;
    }
    #copy-selector-switch {
      position: relative;
      cursor: pointer;
      appearance: none;
      width: 24px;
      height: 14px;
      border: 1px solid #999;
      background: #999;
      border-radius: 10px;
      transition: background-color 0.1s, border 0.1s;
      outline-style: none !important;
    }
    #copy-selector-switch:after {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
    }
    #copy-selector-switch:checked {
      background: #67c23a;
      border: 1px solid #67c23a;
    }
    #copy-selector-switch:checked:after {
      transform: translateX(10px);
    }

    @keyframes copySuccessMessage {
      0% {
        transform: translate(-50%, -150%);
      }
      10% {
        transform: translate(-50%, 100%);
      }
      70% {
        transform: translate(-50%, 100%);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -150%);
        opacity: 0;
      }
    }
  `;
  head.append(style);

  // copy success message
  const message = document.createElement("div");
  message.setAttribute("id", "copy-success-message");
  message.innerText = "Copy success!";
  const body = document.querySelector("body");
  body.append(message);

  // switch
  const panel = document.createElement("div");
  panel.setAttribute("id", "copy-selector-panel");
  panel.innerHTML =
    'copy selector：<input type="checkbox" id="copy-selector-switch" />';
  body.append(panel);

  const copySelectorSwitch = document.querySelector("#copy-selector-switch");
  copySelectorSwitch.onclick = function (e) {
    if (e.target.checked) {
      const copySelectorModeStyle = document.createElement("style");
      copySelectorModeStyle.setAttribute("type", "text/css");
      copySelectorModeStyle.setAttribute("id", "copy-selector-mode-style");
      copySelectorModeStyle.innerText = `
        * {
          cursor: pointer;
          outline: 1px solid #000 !important;
        }
      `;
      head.append(copySelectorModeStyle);
      document.addEventListener("click", clickListenerFn, true);
      document.addEventListener("mousemove", hoverListenerFn, true);
    } else {
      head.removeChild(document.querySelector("#copy-selector-mode-style"));
      document
        .querySelector(lastClickelector)
        ?.classList.remove("copy-selector-focus");
      document
        .querySelector(lastHoverSelector)
        ?.classList.remove("copy-selector-hover");
      document.removeEventListener("click", clickListenerFn, true);
      document.removeEventListener("mousemove", hoverListenerFn, true);
    }
  };

  // copy
  function copy(value) {
    const message = document.querySelector("#copy-success-message");
    message.classList.remove("show-copy-success-message");
    navigator.clipboard.writeText(value).then(() => {
      message.classList.add("show-copy-success-message");
    });
  }

  // cssPath
  function cssPath(node, optimized = true) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const steps = [];
    let contextNode = node;
    while (contextNode) {
      const step = cssPathStep(
        contextNode,
        Boolean(optimized),
        contextNode === node
      );
      if (!step) {
        break;
      }
      steps.unshift(step);
      if (step.optimized) {
        break;
      }
      contextNode = contextNode.parentNode;
    }

    return steps.join(" > ");
  }

  function cssPathStep(node, optimized, isTargetNode) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const id = node.getAttribute("id");
    if (optimized) {
      if (id) {
        return new Step(idSelector(id), true);
      }
      const nodeNameLower = node.nodeName.toLowerCase();
      if (
        nodeNameLower === "body" ||
        nodeNameLower === "head" ||
        nodeNameLower === "html"
      ) {
        return new Step(node.nodeName.toLowerCase(), true);
      }
    }
    const nodeName = node.nodeName.toLowerCase();

    if (id) {
      return new Step(nodeName + idSelector(id), true);
    }
    const parent = node.parentNode;
    if (!parent || parent.nodeType === Node.DOCUMENT_NODE) {
      return new Step(nodeName, true);
    }

    function prefixedElementClassNames(node) {
      const classAttribute = node.getAttribute("class");
      if (!classAttribute) {
        return [];
      }

      return classAttribute
        .split(/\s+/g)
        .filter(Boolean)
        .map(function (name) {
          return "$" + name;
        });
    }

    function idSelector(id) {
      return "#" + CSS.escape(id);
    }

    const prefixedOwnClassNamesArray = prefixedElementClassNames(node);
    let needsClassNames = false;
    let needsNthChild = false;
    let ownIndex = -1;
    let elementIndex = -1;
    const siblings = parent.children;
    for (
      let i = 0;
      siblings && (ownIndex === -1 || !needsNthChild) && i < siblings.length;
      ++i
    ) {
      const sibling = siblings[i];
      if (sibling.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      elementIndex += 1;
      if (sibling === node) {
        ownIndex = elementIndex;
        continue;
      }
      if (needsNthChild) {
        continue;
      }
      if (sibling.nodeName.toLowerCase() !== nodeName) {
        continue;
      }

      needsClassNames = true;
      const ownClassNames = new Set(prefixedOwnClassNamesArray);
      if (!ownClassNames.size) {
        needsNthChild = true;
        continue;
      }
      const siblingClassNamesArray = prefixedElementClassNames(sibling);
      for (let j = 0; j < siblingClassNamesArray.length; ++j) {
        const siblingClass = siblingClassNamesArray[j];
        if (!ownClassNames.has(siblingClass)) {
          continue;
        }
        ownClassNames.delete(siblingClass);
        if (!ownClassNames.size) {
          needsNthChild = true;
          break;
        }
      }
    }

    let result = nodeName;
    if (
      isTargetNode &&
      nodeName.toLowerCase() === "input" &&
      node.getAttribute("type") &&
      !node.getAttribute("id") &&
      !node.getAttribute("class")
    ) {
      result += "[type=" + CSS.escape(node.getAttribute("type") || "") + "]";
    }
    if (needsNthChild) {
      result += ":nth-child(" + (ownIndex + 1) + ")";
    } else if (needsClassNames) {
      for (const prefixedName of prefixedOwnClassNamesArray) {
        result += "." + CSS.escape(prefixedName.slice(1));
      }
    }

    return new Step(result, false);
  }

  class Step {
    value;
    optimized;
    constructor(value, optimized) {
      this.value = value;
      this.optimized = optimized || false;
    }

    toString() {
      return this.value;
    }
  }

  // eventListener
  let lastClickelector;
  function clickListenerFn(e) {
    if (e.target.id.startsWith("copy-selector")) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    const el = e.target;
    el.classList.remove("copy-selector-hover");
    document
      .querySelector(lastClickelector)
      ?.classList.remove("copy-selector-focus");
    const clickSelector = cssPath(el);
    copy(clickSelector);
    lastClickelector = clickSelector;
    el.classList.add("copy-selector-focus");
  }

  let lastHoverSelector;
  function hoverListenerFn(e) {
    const el = e.target;
    document
      .querySelector(lastHoverSelector)
      ?.classList.remove("copy-selector-hover");
    const hoverSelector = cssPath(el);
    lastHoverSelector = hoverSelector;
    el.classList.add("copy-selector-hover");
  }
})();
