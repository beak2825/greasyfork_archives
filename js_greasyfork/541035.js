// ==UserScript==
// @name         civitai 助手
// @namespace    https://github.com/zhisenyang/civitai-helper
// @version      0.0.2
// @description  当前版本只有快捷下载功能，会有些 bug，后续将更新更多功能。
// @author       Johnsen Young
// @match        https://civitai.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/541035/civitai%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541035/civitai%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 下载记录管理
  const DOWNLOAD_RECORDS_KEY = "civitai_download_records";

  // 获取下载记录
  function getDownloadRecords() {
    return GM_getValue(DOWNLOAD_RECORDS_KEY, {});
  }

  // 保存下载记录
  function saveDownloadRecord(url, fileName) {
    const records = getDownloadRecords();
    records[url] = {
      fileName: fileName,
      downloadTime: new Date().toISOString(),
    };
    GM_setValue(DOWNLOAD_RECORDS_KEY, records);
  }

  // 检查URL是否已下载
  function isUrlDownloaded(url) {
    const records = getDownloadRecords();
    return !!records[url];
  }

  // 清除所有下载记录
  function clearAllDownloadRecords() {
    GM_setValue(DOWNLOAD_RECORDS_KEY, {});
  }

  // 样式配置对象，便于统一管理和修改
  const BUTTON_STYLES = {
    position: "absolute",
    top: "40px",
    left: "10px",
    width: "40px",
    height: "40px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "50%",
    zIndex: "10",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease, background-color 0.2s ease",
  };

  // 全局下载按钮样式
  const GLOBAL_BUTTON_STYLES = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "50%",
    zIndex: "1000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease, background-color 0.2s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  };

  // 下载视频文件的函数
  function downloadMP4(url) {
    // 检查是否已经下载过
    if (isUrlDownloaded(url)) {
      console.log("该视频已经下载过");
      return "already_downloaded";
    }

    // 从URL中提取文件名
    const urlParts = url.split("/");
    urlParts.splice(urlParts.length - 2, 1);
    let fileName = urlParts[urlParts.length - 1];

    // 如果文件名不是以.mp4结尾，添加时间戳和扩展名
    if (!fileName.endsWith(".mp4")) {
      fileName = "civitai-video-" + new Date().getTime() + ".mp4";
    }

    const downloadUrl = urlParts.join("/");

    GM_download({
      url: downloadUrl,
      name: fileName,
      onload: function () {
        console.log("下载完成");
        // 保存下载记录
        saveDownloadRecord(url, fileName);
      },
      onerror: function (e) {
        console.error("下载失败:", e.error);
      },
    });

    return true;
  }

  // 创建下载按钮并添加事件监听器的函数
  function createDownloadButton(link) {
    // 检查是否已经添加了下载按钮
    if (link.querySelector(".download-button")) {
      return; // 如果已存在下载按钮，则不重复创建
    }

    // 检查视频是否已下载，添加标记
    const videoElement = link.querySelector("video");
    if (videoElement) {
      const mp4Source = videoElement.querySelector('source[type="video/mp4"]');
      if (mp4Source && mp4Source.src && isUrlDownloaded(mp4Source.src)) {
        // 添加已下载标记
        const downloadedMark = document.createElement("div");
        downloadedMark.className = "downloaded-mark";
        downloadedMark.style.position = "absolute";
        downloadedMark.style.top = "10px";
        downloadedMark.style.right = "40px";
        downloadedMark.style.backgroundColor = "rgba(0, 128, 0, 0.7)";
        downloadedMark.style.color = "white";
        downloadedMark.style.padding = "2px 6px";
        downloadedMark.style.borderRadius = "10px";
        downloadedMark.style.fontSize = "12px";
        downloadedMark.style.zIndex = "10";
        downloadedMark.textContent = "已下载";
        link.appendChild(downloadedMark);
      }
    }

    // 创建下载按钮元素
    const downloadBtn = document.createElement("div");
    downloadBtn.className = "download-button";

    // 应用样式
    Object.assign(downloadBtn.style, BUTTON_STYLES);
    downloadBtn.style.display = "none";

    // 添加下载图标
    downloadBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';

    // 确保link元素有相对定位，这样下载按钮可以正确定位
    if (getComputedStyle(link).position === "static") {
      link.style.position = "relative";
    }

    // 添加鼠标悬停事件
    link.addEventListener("mouseenter", function () {
      downloadBtn.style.display = "flex";
    });

    link.addEventListener("mouseleave", function () {
      downloadBtn.style.display = "none";
    });

    // 添加按钮悬停效果
    downloadBtn.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
      this.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    });

    downloadBtn.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    });

    // 添加下载按钮点击事件
    downloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // 获取视频元素中的MP4源文件URL
      const videoElement = link.querySelector("video");
      if (videoElement) {
        // 查找MP4源
        const mp4Source = videoElement.querySelector(
          'source[type="video/mp4"]'
        );
        if (mp4Source && mp4Source.src) {
          // 下载MP4文件
          const result = downloadMP4(mp4Source.src);

          // 视觉反馈
          if (result === "already_downloaded") {
            // 显示已下载的视觉反馈
            const originalColor = this.style.backgroundColor;
            this.style.backgroundColor = "rgba(255, 165, 0, 0.7)";
            setTimeout(() => {
              this.style.backgroundColor = originalColor;
            }, 500);

            // 显示提示
            alert("该视频已经下载过");
          } else if (result) {
            // 显示下载成功的视觉反馈
            const originalColor = this.style.backgroundColor;
            this.style.backgroundColor = "rgba(0, 128, 0, 0.7)";
            setTimeout(() => {
              this.style.backgroundColor = originalColor;
            }, 500);

            // 添加已下载标记
            if (!link.querySelector(".downloaded-mark")) {
              const downloadedMark = document.createElement("div");
              downloadedMark.className = "downloaded-mark";
              downloadedMark.style.position = "absolute";
              downloadedMark.style.top = "10px";
              downloadedMark.style.right = "10px";
              downloadedMark.style.backgroundColor = "rgba(0, 128, 0, 0.7)";
              downloadedMark.style.color = "white";
              downloadedMark.style.padding = "2px 6px";
              downloadedMark.style.borderRadius = "10px";
              downloadedMark.style.fontSize = "12px";
              downloadedMark.style.zIndex = "10";
              downloadedMark.textContent = "已下载";
              link.appendChild(downloadedMark);
            }
          }
        }
      }
    });

    // 将下载按钮添加到链接元素中
    link.appendChild(downloadBtn);
  }

  /**
   * 处理页面上的所有目标元素
   * 查找所有符合条件的卡片链接并添加下载按钮
   */
  function processCardLinks() {
    try {
      // 查找所有class为EdgeVideo_iosScroll___eG2B 的元素
      const cardLinks = document.querySelectorAll(
        ".EdgeVideo_iosScroll___eG2B "
      );

      // 如果找到了目标元素，就为每个元素添加下载按钮
      if (cardLinks.length > 0) {
        console.log(`找到 ${cardLinks.length} 个视频卡片，添加下载按钮...`);
        cardLinks.forEach(createDownloadButton);
      }
    } catch (error) {
      console.error("处理卡片链接时出错:", error);
    }
  }

  /**
   * 防抖函数 - 用于优化频繁触发的事件
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间（毫秒）
   * @returns {Function} - 防抖处理后的函数
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // 创建下载记录管理界面
  function createDownloadRecordsUI() {
    // 检查是否已经添加了下载记录界面
    if (document.querySelector(".download-records-ui")) {
      return; // 如果已存在下载记录界面，则不重复创建
    }

    // 创建下载记录界面容器
    const recordsUI = document.createElement("div");
    recordsUI.className = "download-records-ui";
    recordsUI.style.position = "fixed";
    recordsUI.style.top = "50%";
    recordsUI.style.left = "50%";
    recordsUI.style.transform = "translate(-50%, -50%)";
    recordsUI.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    recordsUI.style.color = "white";
    recordsUI.style.padding = "20px";
    recordsUI.style.borderRadius = "10px";
    recordsUI.style.zIndex = "2000";
    recordsUI.style.maxWidth = "80%";
    recordsUI.style.maxHeight = "80%";
    recordsUI.style.overflow = "auto";
    recordsUI.style.display = "none";

    // 添加标题
    const title = document.createElement("h2");
    title.textContent = "下载记录管理";
    title.style.marginTop = "0";
    title.style.marginBottom = "15px";
    recordsUI.appendChild(title);

    // 添加关闭按钮
    const closeBtn = document.createElement("div");
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.cursor = "pointer";
    closeBtn.innerHTML = "&times;";
    closeBtn.style.fontSize = "24px";
    closeBtn.addEventListener("click", function () {
      recordsUI.style.display = "none";
    });
    recordsUI.appendChild(closeBtn);

    // 添加记录列表容器
    const recordsList = document.createElement("div");
    recordsList.className = "records-list";
    recordsList.style.marginBottom = "15px";
    recordsUI.appendChild(recordsList);

    // 添加清除所有记录按钮
    const clearAllBtn = document.createElement("button");
    clearAllBtn.textContent = "清除所有记录";
    clearAllBtn.style.padding = "8px 15px";
    clearAllBtn.style.backgroundColor = "#ff4d4d";
    clearAllBtn.style.border = "none";
    clearAllBtn.style.borderRadius = "5px";
    clearAllBtn.style.color = "white";
    clearAllBtn.style.cursor = "pointer";
    clearAllBtn.addEventListener("click", function () {
      if (confirm("确定要清除所有下载记录吗？这将不会删除已下载的文件。")) {
        clearAllDownloadRecords();
        updateRecordsList();
        // 刷新页面上的已下载标记
        processCardLinks();
      }
    });
    recordsUI.appendChild(clearAllBtn);

    // 更新记录列表的函数
    function updateRecordsList() {
      recordsList.innerHTML = "";
      const records = getDownloadRecords();
      const urls = Object.keys(records);

      if (urls.length === 0) {
        const noRecords = document.createElement("p");
        noRecords.textContent = "暂无下载记录";
        recordsList.appendChild(noRecords);
        return;
      }

      // 创建记录表格
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.marginBottom = "15px";

      // 添加表头
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      ["文件名", "下载时间", "操作"].forEach((text) => {
        const th = document.createElement("th");
        th.textContent = text;
        th.style.padding = "8px";
        th.style.textAlign = "left";
        th.style.borderBottom = "1px solid #444";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // 添加表格内容
      const tbody = document.createElement("tbody");
      urls.forEach((url) => {
        const record = records[url];
        const row = document.createElement("tr");

        // 文件名列
        const fileNameCell = document.createElement("td");
        fileNameCell.textContent = record.fileName;
        fileNameCell.style.padding = "8px";
        fileNameCell.style.borderBottom = "1px solid #444";
        row.appendChild(fileNameCell);

        // 下载时间列
        const timeCell = document.createElement("td");
        const downloadDate = new Date(record.downloadTime);
        timeCell.textContent = downloadDate.toLocaleString();
        timeCell.style.padding = "8px";
        timeCell.style.borderBottom = "1px solid #444";
        row.appendChild(timeCell);

        // 操作列
        const actionCell = document.createElement("td");
        actionCell.style.padding = "8px";
        actionCell.style.borderBottom = "1px solid #444";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "删除记录";
        deleteBtn.style.padding = "5px 10px";
        deleteBtn.style.backgroundColor = "#ff4d4d";
        deleteBtn.style.border = "none";
        deleteBtn.style.borderRadius = "3px";
        deleteBtn.style.color = "white";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.addEventListener("click", function () {
          const records = getDownloadRecords();
          delete records[url];
          GM_setValue(DOWNLOAD_RECORDS_KEY, records);
          updateRecordsList();
          // 刷新页面上的已下载标记
          processCardLinks();
        });
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      recordsList.appendChild(table);
    }

    // 初始更新记录列表
    updateRecordsList();

    // 将下载记录界面添加到页面
    document.body.appendChild(recordsUI);

    return recordsUI;
  }

  // 创建全局下载按钮
  function createGlobalDownloadButton() {
    // 检查是否已经添加了全局下载按钮
    if (document.querySelector(".global-download-button")) {
      return; // 如果已存在全局下载按钮，则不重复创建
    }

    // 创建全局下载按钮元素
    const globalDownloadBtn = document.createElement("div");
    globalDownloadBtn.className = "global-download-button";

    // 应用样式
    Object.assign(globalDownloadBtn.style, GLOBAL_BUTTON_STYLES);

    // 添加下载图标
    globalDownloadBtn.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>' +
      '<span class="download-count" style="position: absolute; top: -5px; right: -5px; background-color: red; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; display: flex; align-items: center; justify-content: center;">0</span>';

    // 添加按钮悬停效果
    globalDownloadBtn.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
      this.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    });

    globalDownloadBtn.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    });

    // 添加全局下载按钮点击事件
    globalDownloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      downloadAllVideos();
    });

    // 创建下载记录按钮
    const recordsBtn = document.createElement("div");
    recordsBtn.className = "records-button";
    Object.assign(recordsBtn.style, GLOBAL_BUTTON_STYLES);
    recordsBtn.style.bottom = "80px"; // 位置在全局下载按钮上方

    // 添加记录图标
    recordsBtn.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';

    // 添加按钮悬停效果
    recordsBtn.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
      this.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    });

    recordsBtn.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    });

    // 添加记录按钮点击事件
    recordsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // 显示下载记录界面
      const recordsUI = createDownloadRecordsUI();
      recordsUI.style.display = "block";
    });

    // 将记录按钮添加到页面
    document.body.appendChild(recordsBtn);

    // 将全局下载按钮添加到页面
    document.body.appendChild(globalDownloadBtn);
    updateGlobalButtonCount();
  }

  // 更新全局下载按钮上的视频计数
  function updateGlobalButtonCount() {
    const countElement = document.querySelector(
      ".global-download-button .download-count"
    );
    if (countElement) {
      const videoCount = document.querySelectorAll(
        ".EdgeVideo_iosScroll___eG2B  video"
      ).length;
      countElement.textContent = videoCount;

      // 如果没有视频，隐藏按钮
      const globalButton = document.querySelector(".global-download-button");
      if (globalButton) {
        globalButton.style.display = videoCount > 0 ? "flex" : "none";
      }
    }
  }

  // 下载所有视频
  function downloadAllVideos() {
    // 获取所有视频元素
    const cardLinks = document.querySelectorAll(".EdgeVideo_iosScroll___eG2B ");
    let downloadCount = 0;
    let totalVideos = 0;

    // 计算可下载的视频总数
    cardLinks.forEach((link) => {
      const videoElement = link.querySelector("video");
      if (videoElement) {
        const mp4Source = videoElement.querySelector(
          'source[type="video/mp4"]'
        );
        if (mp4Source && mp4Source.src) {
          totalVideos++;
        }
      }
    });

    if (totalVideos === 0) {
      alert("当前页面没有找到可下载的视频");
      return;
    }

    // 创建下载进度提示
    const progressElement = document.createElement("div");
    progressElement.style.position = "fixed";
    progressElement.style.bottom = "80px";
    progressElement.style.right = "20px";
    progressElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    progressElement.style.color = "white";
    progressElement.style.padding = "10px";
    progressElement.style.borderRadius = "5px";
    progressElement.style.zIndex = "1000";
    progressElement.textContent = `准备下载 0/${totalVideos} 个视频...`;
    document.body.appendChild(progressElement);

    // 视觉反馈 - 开始下载
    const globalButton = document.querySelector(".global-download-button");
    if (globalButton) {
      globalButton.style.backgroundColor = "rgba(255, 165, 0, 0.7)";
    }

    // 逐个下载视频
    cardLinks.forEach((link) => {
      const videoElement = link.querySelector("video");
      if (videoElement) {
        const mp4Source = videoElement.querySelector(
          'source[type="video/mp4"]'
        );
        if (mp4Source && mp4Source.src) {
          // 检查是否已下载
          if (isUrlDownloaded(mp4Source.src)) {
            downloadCount++;
            progressElement.textContent = `跳过已下载视频 ${downloadCount}/${totalVideos}...`;

            // 所有视频处理完成
            if (downloadCount === totalVideos) {
              progressElement.textContent = `已完成处理全部 ${totalVideos} 个视频！`;

              // 视觉反馈 - 完成
              if (globalButton) {
                globalButton.style.backgroundColor = "rgba(0, 128, 0, 0.7)";
                setTimeout(() => {
                  globalButton.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                  // 3秒后移除进度提示
                  setTimeout(() => {
                    document.body.removeChild(progressElement);
                  }, 3000);
                }, 1000);
              }
            }
          } else {
            // 延迟下载，避免浏览器限制
            setTimeout(() => {
              const success = downloadMP4(mp4Source.src);
              if (success === true) {
                // 确保不是 "already_downloaded"
                downloadCount++;
                progressElement.textContent = `正在下载 ${downloadCount}/${totalVideos} 个视频...`;

                // 所有视频下载完成
                if (downloadCount === totalVideos) {
                  progressElement.textContent = `已完成全部 ${totalVideos} 个视频下载！`;

                  // 视觉反馈 - 下载完成
                  if (globalButton) {
                    globalButton.style.backgroundColor = "rgba(0, 128, 0, 0.7)";
                    setTimeout(() => {
                      globalButton.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                      // 3秒后移除进度提示
                      setTimeout(() => {
                        document.body.removeChild(progressElement);
                      }, 3000);
                    }, 1000);
                  }
                }
              }
            }, downloadCount * 300); // 每个下载间隔300ms
          }
        }
      }
    });
  }

  // 等待页面加载完成
  window.addEventListener("load", function () {
    console.log("Civitai视频下载脚本已加载");

    // 创建一个观察器来监视DOM变化，因为civitai可能使用动态加载
    // 使用防抖函数优化性能，避免短时间内多次触发
    const debouncedProcess = debounce(processCardLinks, 300);
    const observer = new MutationObserver(debouncedProcess);

    // 配置观察器
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 立即检查一次当前页面
    processCardLinks();

    // 创建全局下载按钮和下载记录界面
    createGlobalDownloadButton();
    createDownloadRecordsUI();

    // 添加页面滚动事件监听，处理懒加载内容
    window.addEventListener(
      "scroll",
      debounce(() => {
        processCardLinks();
        updateGlobalButtonCount();
      }, 500)
    );
  });
})();
