// ==UserScript==
// @name         4d4y Markdown Enhancer
// @namespace    http://tampermonkey.net/
// @version      2.7
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

        function storeBlock(html) {
            let placeholder = `%%BLOCK${blockIndex}%%`;
            blocks[placeholder] = html;
            blockIndex++;
            return placeholder;
        }

        function escapeHtml(text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }

        function highlightWithPatterns(code, patterns) {
            let result = "";
            let index = 0;

            while (index < code.length) {
                let next = null;
                for (let i = 0; i < patterns.length; i++) {
                    let pattern = patterns[i];
                    pattern.regex.lastIndex = index;
                    let match = pattern.regex.exec(code);
                    if (match && (!next || match.index < next.index)) {
                        next = { match, style: pattern.style };
                    }
                }

                if (!next) {
                    result += code.slice(index);
                    break;
                }

                if (next.match.index > index) {
                    result += code.slice(index, next.match.index);
                }

                result += `<span style="${next.style}">${next.match[0]}</span>`;
                index = next.match.index + next.match[0].length;
            }

            return result;
        }

        function highlightCode(code, lang) {
            let escaped = escapeHtml(code);
            let language = (lang || "").toLowerCase();

            let styles = {
                comment: "color: #7f848e;",
                string: "color: #c3e88d;",
                number: "color: #f78c6c;",
                keyword: "color: #82aaff; font-weight: 600;",
                literal: "color: #ffcb6b;",
                tag: "color: #ff6363;",
                attr: "color: #c792ea;",
                prop: "color: #82aaff;",
            };

            let jsPatterns = [
                { regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\//g, style: styles.comment },
                { regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, style: styles.string },
                { regex: /\b\d+(?:\.\d+)?\b/g, style: styles.number },
                { regex: /\b(?:true|false|null|undefined)\b/g, style: styles.literal },
                {
                    regex: /\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|class|extends|import|from|export|default|async|await|typeof|instanceof)\b/g,
                    style: styles.keyword,
                },
            ];

            let jsonPatterns = [
                { regex: /"(?:\\.|[^"\\])*"/g, style: styles.string },
                { regex: /\b\d+(?:\.\d+)?\b/g, style: styles.number },
                { regex: /\b(?:true|false|null)\b/g, style: styles.literal },
            ];

            let bashPatterns = [
                { regex: /#[^\n]*/g, style: styles.comment },
                { regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, style: styles.string },
                { regex: /\b\d+(?:\.\d+)?\b/g, style: styles.number },
                { regex: /\b(?:cd|ls|pwd|cat|echo|grep|rg|find|awk|sed|curl|wget|git|npm|yarn|pnpm|python|node|bash|zsh|ssh)\b/g, style: styles.keyword },
            ];

            let htmlPatterns = [
                { regex: /&lt;\/?[^\s&]+(?:\s+[^&]*?)?&gt;/g, style: styles.tag },
                { regex: /\b[a-zA-Z-]+(?==)/g, style: styles.attr },
                { regex: /"(?:\\.|[^"\\])*"/g, style: styles.string },
            ];

            let cssPatterns = [
                { regex: /\/\*[\s\S]*?\*\//g, style: styles.comment },
                { regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, style: styles.string },
                { regex: /\b\d+(?:\.\d+)?(px|em|rem|vh|vw|%)?\b/g, style: styles.number },
                { regex: /\b[a-z-]+(?=\s*:)/g, style: styles.prop },
            ];

            let genericPatterns = [
                { regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\//g, style: styles.comment },
                { regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, style: styles.string },
                { regex: /\b\d+(?:\.\d+)?\b/g, style: styles.number },
            ];

            if (["js", "javascript", "ts", "tsx", "jsx"].includes(language)) {
                return highlightWithPatterns(escaped, jsPatterns);
            }
            if (["json"].includes(language)) {
                return highlightWithPatterns(escaped, jsonPatterns);
            }
            if (["bash", "sh", "shell", "zsh"].includes(language)) {
                return highlightWithPatterns(escaped, bashPatterns);
            }
            if (["html", "xml"].includes(language)) {
                return highlightWithPatterns(escaped, htmlPatterns);
            }
            if (["css"].includes(language)) {
                return highlightWithPatterns(escaped, cssPatterns);
            }

            return highlightWithPatterns(escaped, genericPatterns);
        }

        // **1. 处理带语言标签的代码块**
        md = md.replace(
            /```(\w+)\s*(?:<br\s*\/?>|\n)?\s*([\s\S]*?)```/g,
            (match, lang, code) => {
                let cleanCode = code.replace(/<br\s*\/?>/g, "\n").trimEnd();

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

                return storeBlock(`
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
                  "><code>${highlightCode(cleanCode, lang)}</code></pre>
              </div>`);
            },
        );

        // **2. 处理普通代码块**
        md = md.replace(/```([\s\S]*?)```/g, (match, code) => {
            let cleanCode = code.replace(/<br\s*\/?>/g, "\n").trimEnd();

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

            return storeBlock(`<div style="
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
              "><code>${highlightCode(cleanCode)}</code></pre>
          </div>`);
        });

        // **3. 处理行内代码（先占位，避免被粗体/斜体误伤）**
        md = md.replace(/`([^`]+)`/g, (match, code) => {
            return storeBlock(`<code style="
              background-color: #f5f5f5;
              color: #d63384;
              padding: 2px 5px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              font-size: 90%;
          ">${escapeHtml(code)}</code>`);
        });

        // **4. 还原 Markdown 形式的超链接**
        md = md.replace(
            /\[([^\]]+)\]\(<a href="([^"]+)"[^>]*>.*?<\/a>\)/g,
            "[$1]($2)",
        );

        // **5. 统一换行符（Discuz 常用 <br>）**
        md = md.replace(/<br\s*\/?>/gi, "\n");

        // **6. 处理标题**
        md = md
            .replace(/^### (.*$)/gm, "<h3>$1</h3>")
            .replace(/^## (.*$)/gm, "<h2>$1</h2>")
            .replace(/^# (.*$)/gm, "<h1>$1</h1>");

        // **7. 处理水平线与引用**
        md = md
            .replace(/^[-*_]{3,}\s*$/gm, "<hr>")
            .replace(/^>\s?(.*$)/gm, "<blockquote style=\"margin: 8px 0; padding: 6px 12px; border-left: 4px solid #ccc; color: #555;\">$1</blockquote>");

        // **8. 解析 Markdown 列表**
        md = processLists(md);

        // **9. 处理图片**
        md = md.replace(
            /!\[([^\]]*)\]\(\s*([^)]+)\s*\)/g,
            '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">',
        );

        // **10. 处理加粗、斜体、删除线**
        md = md
            .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
            .replace(/~~([^~]+?)~~/g, "<del>$1</del>")
            .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");

        // **11. 还原 Markdown 超链接为标准 HTML `<a>`**
        md = md.replace(
            /\[([^\[\]]+)\]\(\s*([a-zA-Z][a-zA-Z\d+\-.]*:(?:\/\/)?[^\s)]+)\s*\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
        );

        // **12. 还原行内换行**
        md = md.replace(/\n/g, "<br>");

        // **13. 恢复占位块**
        Object.keys(blocks).forEach((placeholder) => {
            md = md.replace(placeholder, blocks[placeholder]);
        });

        return md;
    }

    function processLists(md) {
        if (!md) return "";

        let lines = md.split("\n");
        let output = [];

        lines.forEach((line) => {
            let cleanedLine = line.replace(/<br\s*\/?>$/i, "");
            let leadingNbsp = (cleanedLine.match(/^(?:&nbsp;)+/) || [""])[0].length;
            let leadingSpaces = (cleanedLine.match(/^ +/) || [""])[0].length;
            let spaces = Math.floor(leadingNbsp / 6) + Math.floor(leadingSpaces / 2);
            let reducedLine = cleanedLine.replace(/^(?:&nbsp;)+/, "").replace(/^ +/, "").trim();

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
            } else if (matchUnordered) {
                let bullet = matchUnordered[1] === "-" ? "•" : "◦"; // 使用不同符号区分 - 和 *
                let content = matchUnordered[2];
                let marginLeft = spaces * 20;
                let listItem = `<div style="margin-left: ${marginLeft}px;"><span style="font-weight:bold;">${bullet}</span> ${content}</div>`;
                output.push(listItem);
            } else {
                output.push(line);
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
