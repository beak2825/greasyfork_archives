// ==UserScript==
// @name         4d4y Markdown Enhancer
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Convert potential Markdown syntax into HTML in 4d4y forum posts without removing existing HTML elements. Toggle original text with Ctrl+M, with a mode switch notification.
// @match        https://www.4d4y.com/forum/*
// @author       屋大维 + ChatGPT
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526144/4d4y%20Markdown%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/526144/4d4y%20Markdown%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.copyCode = function (button) {
    let codeElement = button.parentElement.querySelector("pre code");
    if (!codeElement) return;

    let text = codeElement.innerText;
    navigator.clipboard.writeText(text).then(() => {
      button.innerText = "已复制！";
      setTimeout(() => (button.innerText = "复制"), 1500);
    });
  };

  function markdownToHtml(md) {
    if (!md) return "";

    let blocks = {};
    let blockIndex = 0;

    // **1. 处理带语言标签的代码块**
    md = md.replace(/```(\w+)\s*<br>\s*([\s\S]*?)```/g, (match, lang, code) => {
      let placeholder = `%%CODE${blockIndex}%%`;
      let cleanCode = code.replace(/<br\s*\/?>/g, "").trim();

      let langLabel = `<div style="
            background-color: #3a3f4b;
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
            padding: 6px 12px;
            border-top-left-radius: 6px;
            font-family: sans-serif;
            display: inline-block;
            min-width: 100px;
            text-align: left;
        ">${lang}</div>`;

      let copyButton = `<button onclick="copyCode(this)" style="
            position: absolute;
            top: 6px;
            right: 10px;
            background-color: transparent;
            border: none;
            color: #ffffff;
            font-size: 12px;
            cursor: pointer;
            font-family: sans-serif;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        ">复制</button>`;

      blocks[placeholder] = `
        <div style="
            position: relative;
            display: inline-block;
            width: 100%;
            background-color: #3a3f4b;
            border-radius: 6px;
            margin-bottom: 10px;
            overflow: hidden;
        " onmouseover="this.querySelector('button').style.opacity = 1"
          onmouseout="this.querySelector('button').style.opacity = 0">
            ${langLabel}
            ${copyButton}
            <pre style="
                background-color: #2d2d2d;
                color: #f8f8f2;
                padding: 12px;
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
                overflow-x: auto;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
            "><code>${cleanCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
        </div>`;

      blockIndex++;
      return placeholder;
    });

    // **2. 处理普通代码块**
    md = md.replace(/```([\s\S]*?)```/g, (match, code) => {
      let placeholder = `%%CODE${blockIndex}%%`;
      let cleanCode = code.replace(/<br\s*\/?>/g, "").trim();

      let copyButton = `<button onclick="copyCode(this)" style="
            position: absolute;
            top: 6px;
            right: 10px;
            background-color: transparent;
            border: none;
            color: #ffffff;
            font-size: 12px;
            cursor: pointer;
            font-family: sans-serif;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        ">复制</button>`;

      blocks[placeholder] = `<div style="
            position: relative;
            display: inline-block;
            width: 100%;
            background-color: #3a3f4b;
            border-radius: 6px;
            margin-bottom: 10px;
            overflow: hidden;
        " onmouseover="this.querySelector('button').style.opacity = 1"
          onmouseout="this.querySelector('button').style.opacity = 0">
            ${copyButton}
            <pre style="
                background-color: #2d2d2d;
                color: #f8f8f2;
                padding: 12px;
                border-radius: 6px;
                overflow-x: auto;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
            "><code>${cleanCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
        </div>`;

      blockIndex++;
      return placeholder;
    });

    // **3. 还原 Markdown 形式的超链接**
    md = md.replace(
      /\[([^\]]+)\]\(<a href="([^"]+)"[^>]*>.*?<\/a>\)/g,
      "[$1]($2)",
    );

    // **4. 处理标题**
    md = md
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>");

    // **5. 处理加粗、斜体**
    md = md
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");

    // **6. 解析 Markdown 列表**
    md = processLists(md);

    // **7. 处理行内代码**
    md = md.replace(
      /`([^`]+)`/g,
      `<code style="
        background-color: #f5f5f5;
        color: #d63384;
        padding: 2px 5px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 90%;
    ">$1</code>`,
    );
    // **8. 恢复代码块**
    Object.keys(blocks).forEach((placeholder) => {
      md = md.replace(placeholder, blocks[placeholder]);
    });

    // **9. 还原 Markdown 超链接为标准 HTML `<a>`**
    // 还原 Markdown 超链接，支持各种协议（http, https, chrome-extension, file, mailto 等）
    md = md.replace(
      /\[([^\[\]]+)\]\(\s*(([a-zA-Z][a-zA-Z\d+\-.]*):\/\/[^\s)]+)\s*\)/g,
      '<a href="$2">$1</a>',
    );

    return md;
  }

  function processLists(md) {
    if (!md) return "";

    let lines = md.split("\n");
    let output = [];
    let prevWasNewList = true;

    lines.forEach((line) => {
      let isNewLine = line.trim() === "<br>";
      if (isNewLine) {
        prevWasNewList = true;
        output.push(line);
        return;
      }

      let cleanedLine = line.replace(/<br>$/, "");
      let spaces = (cleanedLine.match(/^(?:&nbsp;)+/) || [""])[0].length / 6;
      let reducedLine = cleanedLine.replace(/^(?:&nbsp;)+/, "").trim();

      // 检查有序列表 (必须是整数 + 点 + 空格)
      let matchOrdered = reducedLine.match(/^(\d+)\.\s+(.+)$/);
      // 检查无序列表 (- 或 * 后跟空格)
      let matchUnordered = reducedLine.match(/^([-*])\s+(.+)$/);

      if (matchOrdered) {
        let number = matchOrdered[1];
        let content = matchOrdered[2];
        let marginLeft = spaces * 20; // 每级缩进 20px
        let listItem = `<div style="margin-left: ${marginLeft}px;"><span style="font-weight:bold;">${number}.</span> ${content}</div>`;
        output.push(listItem);
        prevWasNewList = false;
      } else if (matchUnordered) {
        let bullet = matchUnordered[1] === "-" ? "•" : "◦"; // 使用不同符号区分 - 和 *
        let content = matchUnordered[2];
        let marginLeft = spaces * 20;
        let listItem = `<div style="margin-left: ${marginLeft}px;"><span style="font-weight:bold;">${bullet}</span> ${content}</div>`;
        output.push(listItem);
        prevWasNewList = false;
      } else {
        output.push(line);
        prevWasNewList = false;
      }
    });

    return output.join("\n");
  }

  function processForumPosts() {
    document.querySelectorAll("td.t_msgfont").forEach((td) => {
      if (!td.dataset.processed) {
        let originalDiv = document.createElement("div");
        let markdownDiv = document.createElement("div");

        originalDiv.innerHTML = td.innerHTML;
        markdownDiv.innerHTML = markdownToHtml(td.innerHTML);

        markdownDiv.style.display = "block";
        originalDiv.style.display = "none";

        td.innerHTML = "";
        td.appendChild(markdownDiv);
        td.appendChild(originalDiv);

        td.dataset.processed = "true";
        td.dataset.toggled = "true"; // **默认 Markdown 模式**
      }
    });
  }

  function toggleMarkdown(showNotification = true) {
    document.querySelectorAll("td.t_msgfont").forEach((td) => {
      if (td.dataset.processed) {
        let markdownDiv = td.children[0];
        let originalDiv = td.children[1];

        if (td.dataset.toggled === "true") {
          markdownDiv.style.display = "none";
          originalDiv.style.display = "block";
          td.dataset.toggled = "false";
          if (showNotification) showToggleNotification("原始文本模式已启用");
        } else {
          markdownDiv.style.display = "block";
          originalDiv.style.display = "none";
          td.dataset.toggled = "true";
          if (showNotification) showToggleNotification("Markdown 模式已启用");
        }
      }
    });
  }

  function showToggleNotification(message) {
    let notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.top = "10px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.padding = "10px 20px";
    notification.style.backgroundColor = "black";
    notification.style.color = "white";
    notification.style.fontSize = "16px";
    notification.style.borderRadius = "5px";
    notification.style.zIndex = "1000";
    notification.style.opacity = "1";
    notification.style.transition = "opacity 1s ease-in-out";
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => document.body.removeChild(notification), 1000);
    }, 2000);
  }

  function setupKeyboardShortcut() {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.key === "m") {
        toggleMarkdown(true); // **按 Ctrl+M 时，一定要弹出通知**
        event.preventDefault();
      }
    });
  }

  window.addEventListener("load", () => {
    processForumPosts(); // **默认 Markdown 模式**
    setupKeyboardShortcut();
  });
})();
