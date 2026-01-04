// ==UserScript==
// @name         自动下载网页图片
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动滚动到页面底部以加载懒加载图片，并提供下载功能
// @author       You
// @match        https://www.v2ph.com/album*
// @license      MIT
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529206/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/529206/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    "use strict";
  
    // 检查当前URL是否包含目标域名
    if (!window.location.href.includes("https://www.v2ph.com/album")) {
      return; // 如果不是目标网站，直接退出脚本
    }
  
    // 自动滚动到页面底部以加载懒加载图片
    const autoScroll = () => {
      window.scrollBy(0, 999999);
    };
  
    // 获取页面上所有图片的URL
    const getAllImageUrls = () => {
      const images = document.querySelectorAll(".album-photo.my-2 img");
      const imageUrls = new Set();
  
      images.forEach((img) => {
        // 获取图片的src或data-src属性
        const src = img.src || img.getAttribute("data-src") || "";
        if (
          src &&
          src.trim() !== "" &&
          !src.startsWith("data:") &&
          !src.startsWith("blob:")
        ) {
          // 确保是完整的URL
          try {
            const fullUrl = new URL(src, window.location.href).href;
            imageUrls.add(fullUrl);
          } catch (e) {
            console.error("无效的URL:", src);
          }
        }
      });
  
      return Array.from(imageUrls);
    };
  
    // 使用Fetch API获取图片并转换为Blob URL进行下载
    const downloadImageWithFetch = (url, filename) => {
      return new Promise(async (resolve) => {
        try {
          // 使用Fetch API获取图片数据
          const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              Referer: window.location.href,
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          // 将响应转换为Blob
          const blob = await response.blob();
  
          // 创建Blob URL
          const blobUrl = URL.createObjectURL(blob);
  
          // 创建下载链接
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          link.style.display = "none";
  
          // 添加到文档并触发点击
          document.body.appendChild(link);
          link.click();
  
          // 清理
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl); // 释放Blob URL
            resolve(true);
          }, 100);
        } catch (e) {
          console.error(`下载出错: ${url}`, e);
  
          // 尝试使用GM_xmlhttpRequest作为备选方案
          try {
            GM_xmlhttpRequest({
              method: "GET",
              url: url,
              responseType: "blob",
              headers: {
                Referer: window.location.href,
              },
              onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                  const blob = response.response;
                  const blobUrl = URL.createObjectURL(blob);
  
                  const link = document.createElement("a");
                  link.href = blobUrl;
                  link.download = filename;
                  link.style.display = "none";
  
                  document.body.appendChild(link);
                  link.click();
  
                  setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                    resolve(true);
                  }, 100);
                } else {
                  throw new Error(
                    `GM_xmlhttpRequest error! status: ${response.status}`
                  );
                }
              },
              onerror: function (error) {
                console.error("GM_xmlhttpRequest failed:", error);
                resolve(false);
              },
            });
          } catch (gmError) {
            console.error("GM_xmlhttpRequest也失败了:", gmError);
            resolve(false);
          }
        }
      });
    };
  
    // 下载所有图片
    const downloadAllImages = async () => {
      const imageUrls = getAllImageUrls();
  
      if (imageUrls.length === 0) {
        console.error("没有找到可下载的图片，请先滚动加载");
        return;
      }
  
      // 批量下载所有图片
      const downloadPromises = imageUrls.map((url, i) => {
        // 获取文件扩展名
        const extension = url.split("/").pop().split("?")[0].split('.').pop() || 'jpg';
        // 生成基于时间戳的文件名
        const timestamp = Date.now() + i; // 加上索引以确保每个文件名唯一
        const filename = `image_${timestamp}.${extension}`;
        
        // 使用setTimeout创建延迟队列，避免浏览器同时触发太多下载
        return new Promise((resolve) => {
          setTimeout(() => {
            downloadImageWithFetch(url, filename).then(success => {
              resolve(success);
            });
          }, i * 300); // 每个下载间隔300毫秒，形成一个下载队列
        });
      });
      
      // 等待所有下载完成
      await Promise.all(downloadPromises);
    };
  
    const goNextPage = async () => {
      // 查找文本内容包含"下一页"的所有 a 标签
      const nextPageLinks = Array.from(document.querySelectorAll("a")).filter(
        (a) => a.textContent.includes("下一页")
      );
  
      // 获取第一个匹配的链接
      const nextPageLink = nextPageLinks.length > 0 ? nextPageLinks[0] : null;
  
      if (nextPageLink) {
        // 可以进行点击或其他操作
        nextPageLink.click();
      } else {
        console.error("没有找到下一页链接");
      }
    };
  
    // 初始化
    const init = () => {
      setTimeout(async () => {
        autoScroll();
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await downloadAllImages();
        goNextPage();
      }, 500);
    };
  
    // 页面加载完成后初始化
    window.addEventListener("load", init);
  })();
  