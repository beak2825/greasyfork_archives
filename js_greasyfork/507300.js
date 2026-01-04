// ==UserScript==
// @name         获取up主投稿页所有视频
// @namespace    get-bilibili-up-tougao-page-links
// @version      1.0
// @description  自动生成you-get的bat下载脚本
// @license     MIT
// @match        https://space.bilibili.com/*/video
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507300/%E8%8E%B7%E5%8F%96up%E4%B8%BB%E6%8A%95%E7%A8%BF%E9%A1%B5%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/507300/%E8%8E%B7%E5%8F%96up%E4%B8%BB%E6%8A%95%E7%A8%BF%E9%A1%B5%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


(function () {
  "use strict";

  // 创建按钮元素
  const button = document.createElement("button");
  // 设置按钮样式
  button.style.position = "fixed";
  button.style.right = "30px";
  button.style.bottom = "30px";
  button.style.width = "50px";
  button.style.height = "50px";
  button.style.borderRadius = "50%";
  button.style.backgroundColor = "#ff6699";
  button.style.border = "none";
  // 添加按钮文本
  button.textContent = "Down";
  button.style.color = "white";
  // 添加按钮到页面
  document.body.appendChild(button);

  // 按钮点击事件处理函数
  button.addEventListener("click", () => {
    // 获取所有链接并去重
  const links = [
      ...new Set(Array.from(document.querySelectorAll("ul.cube-list li a")).map(link => link.href))
    ].map(link => ({ href: link }));    // 处理链接
    const commands = links.map(
      (link) => `you-get ${link.href} -c cookie.txt`
    );
    // 将处理结果保存到文件
    const blob = new Blob([commands.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    // 下载文件
    const a = document.createElement("a");
    a.href = url;
    a.download = "youGetcommands.txt";
    a.click();
  });
})();
