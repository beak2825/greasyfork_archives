// ==UserScript==
// @name         CSDN文章导出Markdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将csdn的文章直接导出为markdown格式，直接拷贝到剪切板中，不需要登录
// @author       You
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/article/details/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://cdn.jsdelivr.net/npm/msg-alert@1.0.0-beta.2/dist/msg-alert.min.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469624/CSDN%E6%96%87%E7%AB%A0%E5%AF%BC%E5%87%BAMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/469624/CSDN%E6%96%87%E7%AB%A0%E5%AF%BC%E5%87%BAMarkdown.meta.js
// ==/UserScript==

// 添加复制按钮样式
GM_addStyle(`
.copy-btns { display: block; }

.copy-btns > button {
    margin-left: 10px;
    vertical-align: middle;
    font-size: 16px;
    background: transparent;
    border: 1px solid #ccc;
    padding: 3px 5px;
    border-radius: 3px;
    box-shadow: inset 0px 0px 0px 1px rgba(var(--dsw-green-standard-rgb), 1);
    color: rgba(var(--dsw-green-standard-rgb), 1);
    cursor: pointer;
    outline: none;
}`);

const turndownService = new TurndownService({
  emDelimiter: "*",
  bulletListMarker: "-",
});
turndownService.addRule("strikethrough", {
  filter: ["pre"],
  replacement: (content, node) =>
    "\n```txt\n" + node.innerText.trim() + "\n```\n",
});
turndownService.addRule("strikethrough", {
  filter: ["sup"],
  replacement: (content) => "^" + content,
});

// 接收HTML字符串转成Markdown格式
const htmlToMd = (htmlStr) => {
  return turndownService.turndown(htmlStr.replace(/<p>&nbsp;<\/p>/g, "<br>"));
};

const copyHandler = () => {
  const title = document.querySelector("h1.title-article");
  const article = document.querySelector("article");
  if (article) {
    let content = htmlToMd(article.innerHTML);
    let t = `# ${title.innerText}`;
    content = t + content;
    console.log(content);
    GM_setClipboard(content, "text");
    message.success({
      text: "文章复制成功",
      duration: 1000,
    });
  }
};

const copyTitleBtn = document.createElement("button");
copyTitleBtn.innerText = "复制文章";
copyTitleBtn.addEventListener("click", copyHandler);
const copyBtnsEle = document.createElement("div");
copyBtnsEle.className = "copy-btns";
copyBtnsEle.appendChild(copyTitleBtn);

const init = () => {
  console.log("好好好，你这么搞是吧！");
  // 初始化元素
  document.querySelector(".article-title-box").appendChild(copyBtnsEle);
};

(function () {
  "use strict";
  window.addEventListener("load", init);
  // Your code here...
})();
