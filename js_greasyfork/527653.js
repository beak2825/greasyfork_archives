// ==UserScript==
// @name         画世界下载原图
// @name:zh-CN   画世界下载原图
// @namespace    画世界下载原图
// @homepage     https://gist.github.com/kaixinol/a7521662de470d427db2eb9d45cd843e/
// @version      0.4
// @license      MIT
// @description:zh-cn  从画世界网页版（PC端UA）下载原图的脚本
// @description  从画世界网页版（PC端UA）下载原图的脚本
// @author       Kaesinol
// @match        https://*.huashijie.art/work/detail/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      app.huashijie.art
// @downloadURL https://update.greasyfork.org/scripts/527653/%E7%94%BB%E4%B8%96%E7%95%8C%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/527653/%E7%94%BB%E4%B8%96%E7%95%8C%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 存储拦截到的图片URL和作品信息
  let interceptedImages = [];
  let workInfo = null;

  // 获取作品ID
  function getWorkId() {
    const path = window.location.pathname;
    return path.split("/").pop();
  }

  // 获取文件扩展名
  function getFileExtension(url) {
    const match = url.match(/\.([^.]+)(?:\?|$)/);
    return match ? match[1].toLowerCase() : "jpg";
  }

  // 从API获取作品信息
  async function fetchWorkInfo(workId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://app.huashijie.art/api/work/detailV2?workId=${workId}`,
        headers: {
          Accept: "application/json",
        },
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            if (data && data.data) {
              resolve(data.data);
            } else {
              reject("Invalid API response");
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  // 拦截 canvas.drawImage()
  const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (img, ...args) {
    if (
      img instanceof HTMLImageElement &&
      !interceptedImages.includes(img.src)
    ) {
      interceptedImages.push(img.src);
      console.log("Intercepted image:", img.src);
    }
    return originalDrawImage.apply(this, [img, ...args]);
  };

  // 添加下载按钮
  async function addDownloadButton() {
    const likeButton = document.querySelector(".common-like.click-hover");
    if (!likeButton) {
      setTimeout(addDownloadButton, 1000);
      return;
    }

    // 获取作品信息
    const workId = getWorkId();
    try {
      workInfo = await fetchWorkInfo(workId);
    } catch (error) {
      console.error("Failed to fetch work info:", error);
    }

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "下载图片";
    downloadButton.style.cssText = `
            margin-left: 10px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

    downloadButton.addEventListener("click", async () => {
      if (interceptedImages.length === 0) {
        alert("未检测到图片，请先浏览作品");
        return;
      }

      if (!workInfo) {
        alert("未能获取作品信息，将使用默认文件名");
      }

      let filename = null;
      for (let i = 0; i < interceptedImages.length; i++) {
        const url = interceptedImages[i];
        const extension = getFileExtension(url);
        if (!workInfo) {
          filename = `${Date.now()} - ${i + 1}.${extension}`;
        } else {
          filename = `${workInfo.user.nick} - ${workInfo.id} - ${
            workInfo.userId
          } - ${i + 1}.${extension}`;
        }

        GM_download({
          url: url,
          name: filename,
          saveAs: false,
          onerror: (error) => {
            console.error("Download failed:", error);
            alert(`下载失败: ${error}`);
          },
        });
      }
      console.log(`开始下载 ${interceptedImages.length} 张图片`);
    });

    likeButton.parentNode.insertBefore(downloadButton, likeButton.nextSibling);
  }

  // 页面加载完成后添加按钮
  window.addEventListener("load", addDownloadButton);
})();