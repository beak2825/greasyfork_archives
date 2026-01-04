// ==UserScript==
// @name         Linux.do 下崽器
// @namespace    http://linux.do/
// @source       https://github.com/
// @version      1.1.1
// @description  备份你珍贵的水贴为Markdown。
// @author       xdd
// @match        https://www.linux.do/t/topic/*
// @match        https://linux.do/t/topic/*
// @license      MIT
// @icon         https://cdn.linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_32x32.png
// @grant        none
// @require      https://unpkg.com/turndown@7.1.3/dist/turndown.js
// @downloadURL https://update.greasyfork.org/scripts/493855/Linuxdo%20%E4%B8%8B%E5%B4%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493855/Linuxdo%20%E4%B8%8B%E5%B4%BD%E5%99%A8.meta.js
// ==/UserScript==

/** 更新日志
 * 1: 脚本开写
 *
 *
 *
 */

(function () {
  "use strict";

  console.log("Starting watering…");

  /**
   * Make a button element.
   */
  function makeButton(buttonText) {
    var $button = document.createElement("button");
    $button.setAttribute("type", "button");
    $button.classList.add("linuxdocopier-button");
    $button.innerText = buttonText; // Set the button text to the passed argument
    // $button.style.position = "fixed";
    // $button.style.bottom = "10px";
    // $button.style.right = "10px";
    $button.style.top = "-2em";
    $button.style.zIndex = "999";
    // $button.style.width = "120px";
    $button.style.height = "2em";
    $button.style.backgroundColor = "rgba(85, 85, 85, 0.9)";
    $button.style.color = "white";
    $button.style.outline = "none";
    $button.style.cursor = "pointer";
    $button.style.borderRadius = "1em";
    // $button.style.margin = "0 .2em 1em .2em";
    $button.style.fontSize = "1.2em";
    $button.style.padding = ".4em";
    return $button;
  }


  // 插入按钮到页面
  const button = makeButton(" 下载为Markdown ")
  document.querySelector("#topic-title > div > div").appendChild(button);

  // 点击事件的处理函数
  button.addEventListener("click", function () {
    // 使用Turndown库将HTML转换成Markdown
    const turndownService = new TurndownService();
    // Use Turndown service to convert target element's HTML to Markdown
    const articleDom = document.querySelector("#ember48");
    if (articleDom) {

      // 创建targetElement的副本
      const articleContent = articleDom.cloneNode(true);

      const titleElement = document.querySelector("#topic-title > div > div > h1 > a.fancy-title > span");
      let repliesElement = document.querySelector("#post_1 > div > div.topic-body.clearfix > div.topic-map > section > ul > li.replies > span");


      // Check if the elements exist
      if (!titleElement) {

        console.log("未找到 titleElement ")
        alert("论坛更新了 脚本没更新 可能不适配 ");
        return;
      }
      if (!repliesElement) {
        repliesElement = "0";
      } else {

      }

      articleContent.querySelector(".post-menu-area")?.remove();
      articleContent.querySelector(".topic-map")?.remove();
      articleContent.querySelector(".linuxdocopier-button")?.remove();
      articleContent.querySelector(".selected-posts")?.remove();
      articleContent.querySelector(".topic-navigation")?.remove();
      articleContent.querySelector(".with-timeline")?.remove();
      articleContent.querySelector(".more-topics__container")?.remove();
      articleContent.querySelector("#topic-footer-buttons")?.remove();

      // 初始化一个数组来存储所有Markdown列表项
      let markdownList = [];
      markdownList.push(`\n\n## ${repliesElement.innerText.trim()}个回复 \n\n`);
      let nodes = articleContent.querySelectorAll("#ember63 > div > div");
      nodes.forEach((element, index) => {
        // 如果不是第一个元素，则移除
        if (index !== 0) {


          // 查找用户名
          const username = element.querySelector(".full-name")?.innerText.trim() + " " + element.querySelector(".username")?.innerText.trim();

          // 查找回复时间
          let timeele = element.querySelector(".relative-date");
          const timestamp = timeele ? timeele.title : "未知时间";


          // 查找回复内容，这里假设回复内容是放在 <p dir="ltr"> 标签内的
          const content = element.querySelector(".cooked")?.innerText.trim();
          const contentMd = turndownService.turndown(content)


          // 如果用户名和内容都存在，则将它们格式化为Markdown列表项
          if (username && content) {
            markdownList.push(`- **${username}** - ${timestamp}\n  > ${contentMd}`);
          }

          element.remove();
        }
      });

      // 将所有Markdown列表项合并成一个字符串
      const markdownReply = markdownList.join("\n\n");
      const markdown = turndownService.turndown(articleContent.innerHTML) + "\n\n " + markdownReply;


      // Retrieve the text contents of the elements
      const titleText = titleElement.innerText.trim();
      const repliesText = repliesElement.innerText.trim();


      // Form the filename
      const filename = `【Linux.c】${titleText} - 含水量${repliesText}.md`;


      // 创建一个blob并生成一个下载链接
      const blob = new Blob([markdown], {type: "text/markdown;charset=utf-8"});
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;

      // 触发下载
      downloadLink.click();

      // 清理创建的URL对象

      URL.revokeObjectURL(downloadLink.href);
    } else {
      console.log("未找到 articleContent")
      alert("论坛更新了 脚本没更新 可能不适配 ");
    }

  });
})();
