// ==UserScript==
// @name         Telegraph to Markdown
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  将 Telegraph 文章转换为 Markdown 格式并下载
// @author       jie5143
// @match        https://telegra.ph/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jszip@3.1.5/dist/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527950/Telegraph%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/527950/Telegraph%20to%20Markdown.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 添加样式
  GM_addStyle(`
        #downloadButton {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
        }
        #downloadButton:hover {
            background-color: #45a049;
        }
    `);

  // 获取文章标题
  function getTitle() {
    const titleElement = document.querySelector("header h1");
    return titleElement ? titleElement.textContent.trim() : "untitled";
  }

  // 获取文章时间
  function getPublishTime() {
    const timeElement = document.querySelector("time");
    return timeElement ? timeElement.textContent : "";
  }

  // 将 HTML 转换为 Markdown
  function convertToMarkdown() {
    const article = document.querySelector("#_tl_editor");
    if (!article) return { markdown: "", images: [] };

    let markdown = "";
    const images = [];

    // 添加标题和发布时间
    const title = getTitle();
    const publishTime = getPublishTime();
    markdown += `# ${title}\n\n`;
    if (publishTime) {
      markdown += `发布时间：${publishTime}\n\n`;
    }

    function processNode(node) {
      if (!node) return;

      const nodeType = node.nodeName.toLowerCase();

      switch (nodeType) {
        case "h1":
          // 跳过第一个 h1，因为我们已经添加了标题
          if (!markdown.includes(`# ${node.textContent.trim()}\n\n`)) {
            markdown += `# ${node.textContent.trim()}\n\n`;
          }
          break;
        case "h2":
          markdown += `## ${node.textContent.trim()}\n\n`;
          break;
        case "h3":
          markdown += `### ${node.textContent.trim()}\n\n`;
          break;
        case "h4":
          markdown += `#### ${node.textContent.trim()}\n\n`;
          break;
        case "p":
          let text = node.innerHTML;
          const links = node.querySelectorAll("a");
          links.forEach((link) => {
            text = text.replace(
              link.outerHTML,
              `[${link.textContent}](${link.href})`
            );
          });
          markdown += `${text
            .replace(/<br[^>]*>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .trim()}\n\n`;
          break;
        case "blockquote":
          markdown += `> ${node.textContent.trim()}\n\n`;
          break;
        case "pre":
          markdown += `\`\`\`\n${node.textContent.trim()}\n\`\`\`\n\n`;
          break;
        case "figure":
          const img = node.querySelector("img");
          if (img && img.src) {
            const imgSrc = img.src;
            const fileName = `image_${images.length + 1}.${getImageExtension(
              imgSrc
            )}`;
            markdown += `![](images/${fileName})\n\n`;
            images.push({
              url: imgSrc,
              fileName: fileName,
            });
          }
          break;
        case "div":
          Array.from(node.children).forEach((child) => processNode(child));
          break;
      }
    }

    Array.from(article.children).forEach((node) => processNode(node));
    return { markdown, images };
  }

  // 获取图片扩展名
  function getImageExtension(url) {
    const ext = url.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? ext : "jpg";
  }

  // 下载 ZIP 文件
  async function downloadZip(title, markdown, images) {
    const zip = new JSZip();
    const folderName = title.replace(/[^a-zA-Z0-9]/g, "_");

    // 添加 Markdown 文件
    zip.file(`${folderName}/${title}.md`, markdown);

    // 下载并添加图片
    const imagePromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: image.url,
          responseType: "arraybuffer",
          onload: function (response) {
            zip.file(
              `${folderName}/images/${image.fileName}`,
              response.response
            );
            resolve();
          },
          onerror: reject,
        });
      });
    });

    try {
      await Promise.all(imagePromises);
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${title}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("下载过程出错：", error);
      alert("下载失败：" + error.message);
    }
  }

  // 处理下载事件
  async function handleDownload() {
    const title = getTitle();
    const { markdown, images } = convertToMarkdown();

    if (!markdown) {
      alert("未能获取到文章内容");
      return;
    }

    await downloadZip(title, markdown, images);
  }

  // 创建下载按钮
  function createDownloadButton() {
    const button = document.createElement("button");
    button.id = "downloadButton";
    button.textContent = "下载 Markdown";
    button.addEventListener("click", handleDownload);
    document.body.appendChild(button);
  }

  // 初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createDownloadButton);
  } else {
    createDownloadButton();
  }
})();
