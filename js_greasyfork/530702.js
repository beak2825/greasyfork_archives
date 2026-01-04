// ==UserScript==
// @name         Bilibili评论区图片批量下载
// @namespace    BilibiliCommentImageDownloader
// @version      0.9.3
// @description  批量下载B站评论区中的图片（暂仅支持动态和视频评论区）
// @author       Kaesinol
// @license      MIT
// @match        https://t.bilibili.com/*
// @match        https://*.bilibili.com/opus/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://space.bilibili.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// @grant        unsafeWindow
// @icon         https://www.gstatic.com/android/keyboard/emojikitchen/20240206/u1f4be/u1f4be_u1f4ac.png
// @downloadURL https://update.greasyfork.org/scripts/530702/Bilibili%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/530702/Bilibili%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
// 获取当前oid
document.currentIdentifier = null;
function getIdentifier() {
  // 从bili-comments元素获取oid
  const commentEl = document.querySelector("bili-comments[data-params]");
  if (commentEl) {
    const params = commentEl.getAttribute("data-params");
    const oidMatch = params && params.match(/\d{4,}/);
    return oidMatch ? oidMatch[0] : null;
  }
  return null;
}
(function () {
  "use strict";

  // 确保在脚本加载时就创建全局变量
  unsafeWindow.lastBiliReply = null;

  // 保存原始fetch方法
  const originalFetch = unsafeWindow.fetch;
  // 目标API路径配置
  const API_TYPES = {
    TRADITIONAL: "/x/v2/reply",
    WBI: "/x/v2/reply/wbi/main",
  };
  // 获取当前使用的API类型
  function getCurrentApiType() {
    return GM_getValue("biliApiType", "WBI"); // 默认使用WBI接口
  }
  // 设置API类型
  function setApiType(type) {
    GM_setValue("biliApiType", type);
    console.log(
      `[API配置] 已切换到 ${type === "WBI" ? "WBI签名" : "传统"} 接口`
    );
  }

  // 获取目标API路径
  function getTargetApiPath() {
    const apiType = getCurrentApiType();
    return API_TYPES[apiType];
  }

  // 去重函数，基于rpid去重
  function deduplicateReplies(replies) {
    const seen = new Set();
    return replies.filter((reply) => {
      if (seen.has(reply.rpid)) {
        return false;
      }
      seen.add(reply.rpid);
      return true;
    });
  }

  // 重写fetch方法
  unsafeWindow.fetch = function (...args) {
    if (getCurrentApiType() == "TRADITIONAL") {
      // 如果是传统接口，直接调用原始fetch
      return originalFetch.apply(this, args);
    }

    const requestUrl = args[0]?.url || args[0];
    const targetApiPath = getTargetApiPath();

    // 检查是否是目标API
    if (typeof requestUrl === "string" && requestUrl.includes(targetApiPath)) {
      console.log(
        `[B站API监控] 捕获评论API请求 (${getCurrentApiType()}):`,
        requestUrl
      );
      // 执行原始fetch
      return originalFetch
        .apply(this, args)
        .then((response) => {
          // 克隆响应以便读取
          const clone = response.clone();
          return clone.json().then((data) => {
            const identifier = new URL("https:" + requestUrl).searchParams.get(
              "oid"
            );
            let allStoredData = {};

            try {
              const storedDataRaw = GM_getValue("biliReplyDict", "{}");
              allStoredData = JSON.parse(storedDataRaw);
            } catch (e) {
              console.warn("解析存储的评论数据失败:", e);
              allStoredData = {};
            }

            // 确保当前oid有对应的数组
            if (!allStoredData[identifier]) {
              allStoredData[identifier] = [];
            }

            const currentReplies = Array.isArray(data?.data?.replies)
              ? data.data.replies
              : [];
            const currentTopReplies = Array.isArray(data?.data?.top_replies)
              ? data.data.top_replies
              : [];

            // 合并当前数据与已存储的数据
            const existingReplies = allStoredData[identifier];
            const mergedReplies = [
              ...currentReplies,
              ...currentTopReplies,
              ...existingReplies,
            ];

            // 去重
            const deduplicatedReplies = deduplicateReplies(mergedReplies);

            // 检查是否有新数据
            const hasNewData =
              deduplicatedReplies.length > existingReplies.length;

            // 更新存储
            allStoredData[identifier] = deduplicatedReplies;
            GM_setValue("biliReplyDict", JSON.stringify(allStoredData));

            // 修改返回的data，用于当前页面显示
            const topRepliesCount = currentTopReplies.length;
            data.data.top_replies = deduplicatedReplies.slice(
              0,
              topRepliesCount
            );
            data.data.replies = deduplicatedReplies.slice(topRepliesCount);

            console.log(
              `[评论去重] 动态${identifier}: 总计${
                deduplicatedReplies.length
              }条评论${hasNewData ? " (有新数据)" : ""}`
            );

            // 如果有新数据且下载菜单正在显示，则实时更新界面
            if (hasNewData) {
              setTimeout(() => {
                const menuContainer = document.getElementById(
                  "bili-img-download-menu"
                );
                if (menuContainer && menuContainer.style.display === "block") {
                  console.log("[实时更新] 检测到新评论，更新下载界面");
                  // 触发自定义事件通知界面更新
                  window.dispatchEvent(new CustomEvent("biliCommentUpdate"));
                }
              }, 100);
            }

            return response;
          });
        })
        .catch((error) => {
          console.error("[B站API监控] 请求出错:", error);
          throw error;
        });
    }
    // 非目标API，正常执行
    return originalFetch.apply(this, args);
  };
  if (getCurrentApiType() === "WBI") {
    console.log(`[B站API监控] 脚本已注入，开始监控评论API`);
  }
  // 暴露函数供下面的代码使用
  unsafeWindow.getCurrentApiType = getCurrentApiType;
  unsafeWindow.setApiType = setApiType;
})();

(function () {
  "use strict";

  // 当前页码
  let currentPage = 1;

  // 创建下载菜单区域
  function createDownloadMenu() {
    const menuContainer = document.createElement("div");
    menuContainer.id = "bili-img-download-menu";

    // 基础样式
    menuContainer.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    width: 400px;
    max-height: 600px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    display: none;
`;
    const style = document.createElement("style");
    style.textContent = `
#bili-img-download-menu {
    background: #fff;
    color: #000;
}
body:has(.dark_mode) #bili-img-download-menu,
html.night-mode #bili-img-download-menu {
    background: #000;
    color: #fff;
}
`;
    document.head.appendChild(style);

    const menuHeader = document.createElement("div");
    menuHeader.className = "bili-img-download-header";
    menuHeader.innerHTML = "<h3>评论图片下载</h3>";

    menuHeader.style.cssText = `
    margin-bottom: 10px;
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
`;
    const styleHeader = document.createElement("style");
    styleHeader.textContent = `
.bili-img-download-header {
    border-bottom: 1px solid #eee;
}

.bili-img-download-header h3 {
    margin: 0;
    font-size: 16px;
    color: #000;
}

/* 夜间模式 */
body:has(.dark_mode) .bili-img-download-header,
html.night-mode .bili-img-download-header {
    border-bottom: 1px solid #444;
}
body:has(.dark_mode) .bili-img-download-header h3,
html.night-mode .bili-img-download-header h3 {
    color: #fff;
}
`;
    document.head.appendChild(styleHeader);

    const closeButton = document.createElement("span");
    closeButton.innerHTML = "×";
    closeButton.style.cssText = `
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
        `;
    closeButton.onclick = function () {
      menuContainer.style.display = "none";
    };

    // 添加API配置按钮
    const configButton = document.createElement("span");
    configButton.innerHTML = "⚙️";
    configButton.title = "API配置";
    configButton.style.cssText = `
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
        `;
    configButton.onclick = function () {
      showApiConfigDialog();
    };

    menuHeader.appendChild(configButton);
    menuHeader.appendChild(closeButton);
    menuContainer.appendChild(menuHeader);

    const menuContent = document.createElement("div");
    menuContent.id = "bili-img-download-content";
    menuContainer.appendChild(menuContent);

    // 添加分页控制区域
    const paginationDiv = document.createElement("div");
    paginationDiv.id = "bili-img-pagination";
    paginationDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        `;

    const prevButton = document.createElement("button");
    prevButton.textContent = "上一页";
    prevButton.id = "bili-prev-page";
    prevButton.style.cssText = `
            padding: 5px 10px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
    prevButton.disabled = true;

    const pageInfo = document.createElement("span");
    pageInfo.id = "bili-page-info";
    pageInfo.textContent = "第1页";
    pageInfo.style.cssText = `
            line-height: 30px;
        `;

    const nextButton = document.createElement("button");
    nextButton.textContent = "下一页";
    nextButton.id = "bili-next-page";
    nextButton.style.cssText = `
            padding: 5px 10px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageInfo);
    paginationDiv.appendChild(nextButton);
    menuContainer.appendChild(paginationDiv);

    document.body.appendChild(menuContainer);
    return menuContainer;
  }

  // 获取当前使用的API类型
  function getCurrentApiType() {
    return unsafeWindow.getCurrentApiType
      ? unsafeWindow.getCurrentApiType()
      : GM_getValue("biliApiType", "WBI");
  }

  // 设置API类型
  function setApiType(type) {
    if (unsafeWindow.setApiType) {
      unsafeWindow.setApiType(type);
    } else {
      GM_setValue("biliApiType", type);
    }
  }

  // 显示API配置对话框
  function showApiConfigDialog() {
    // 注入样式（只注入一次）
    if (!document.getElementById("bili-api-dialog-style")) {
      const style = document.createElement("style");
      style.id = "bili-api-dialog-style";
      style.textContent = `
/* 覆盖视觉样式（颜色由 html.night-mode 控制）*/
.bili-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  -webkit-tap-highlight-color: transparent;
}

/* 淡色模式（默认）*/
.bili-dialog-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.bili-dialog {
  box-sizing: border-box;
  background-color: #ffffff;
  color: #111111;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  border: 1px solid #e6e6e6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* 夜间模式 */
body:has(.dark_mode) .bili-dialog-overlay,
html.night-mode .bili-dialog-overlay {
  background-color: rgba(0, 0, 0, 0.65);
}
body:has(.dark_mode) .bili-dialog,
html.night-mode .bili-dialog {
  background-color: #0f1011;
  color: #e9eef6;
  border: 1px solid #222426;
  box-shadow: 0 6px 26px rgba(0,0,0,0.6);
}

/* 标题与描述 */

.bili-dialog .bili-dialog-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  line-height: 1;
  display: block;
}

.bili-dialog .bili-dialog-desc {
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 13px;
  color: #333333;
}
body:has(.dark_mode) .bili-dialog .bili-dialog-desc,
html.night-mode .bili-dialog .bili-dialog-desc {
  color: #cfd8e6;
}

.bili-dialog .bili-dialog-desc small {
  display: block;
  margin-top: 6px;
  color: #666666;
  font-size: 12px;
}
body:has(.dark_mode) .bili-dialog .bili-dialog-desc small,
html.night-mode .bili-dialog .bili-dialog-desc small {
  color: #aeb7c6;
}

/* 选项 */
.bili-dialog label {
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
}

.bili-dialog input[type="radio"] {
  margin-right: 8px;
  vertical-align: middle;
}

/* 按钮容器与按钮 */
.bili-dialog .bili-dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.bili-dialog .btn {
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 72px;
  line-height: 1;
  box-shadow: none;
}

/* 取消（次要）*/
.bili-dialog .btn.cancel {
  background-color: #ffffff;
  color: inherit;
  border: 1px solid #ccc;
}
body:has(.dark_mode) .bili-dialog .btn.cancel,
html.night-mode .bili-dialog .btn.cancel {
  background-color: transparent;
  border: 1px solid #3a3f43;
  color: inherit;
}

/* 确定（主要）*/
.bili-dialog .btn.confirm {
  background-color: #00a1d6;
  color: #ffffff;
  border: none;
}
body:has(.dark_mode) .bili-dialog .btn.confirm,
html.night-mode .bili-dialog .btn.confirm {
  background-color: #0089b8;
  color: #ffffff;
}

/* 可聚焦轮廓 */
.bili-dialog .btn:focus,
.bili-dialog input[type="radio"]:focus {
  outline: 2px solid rgba(0,160,220,0.25);
  outline-offset: 2px;
}

/* 小屏幕下的按钮换行 */
@media (max-width: 360px) {
  .bili-dialog .bili-dialog-buttons {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .bili-dialog .btn { width: 100%; }
}
    `;
      document.head.appendChild(style);
    }

    // 保存当前滚动/overflow 状态，阻止背景滚动
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 创建遮罩层（结构化使用 class，不写颜色）
    const overlay = document.createElement("div");
    overlay.className = "bili-dialog-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    // 创建对话框
    const dialog = document.createElement("div");
    dialog.className = "bili-dialog";
    dialog.tabIndex = -1;

    // 标题
    const title = document.createElement("h3");
    title.className = "bili-dialog-title";
    title.textContent = "API接口配置";

    // 描述
    const description = document.createElement("div");
    description.className = "bili-dialog-desc";
    description.innerHTML = `
    选择要使用的评论API接口：
    <small>
      • WBI签名接口：新版接口，支持实时拦截，禁用翻页<br>
      • 传统接口：旧版接口，支持翻页功能
    </small>
  `;

    // 获取当前选择（假定外部存在函数）
    const currentApiType =
      typeof getCurrentApiType === "function" ? getCurrentApiType() : null;

    // WBI 选项
    const wbiOption = document.createElement("label");
    wbiOption.innerHTML = `
    <input type="radio" name="apiType" value="WBI">
    WBI签名接口 (实时更新，无翻页)
  `;

    // 传统选项
    const traditionalOption = document.createElement("label");
    traditionalOption.innerHTML = `
    <input type="radio" name="apiType" value="TRADITIONAL">
    传统接口 (支持翻页)
  `;

    // 按钮容器
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "bili-dialog-buttons";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "btn cancel";
    cancelButton.textContent = "取消";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.className = "btn confirm";
    confirmButton.textContent = "确定";

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);

    // 组装
    dialog.appendChild(title);
    dialog.appendChild(description);
    dialog.appendChild(wbiOption);
    dialog.appendChild(traditionalOption);
    dialog.appendChild(buttonContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 如果外部提供 currentApiType，选中对应 radio
    if (currentApiType) {
      const radio = dialog.querySelector(
        `input[name="apiType"][value="${currentApiType}"]`
      );
      if (radio) radio.checked = true;
    }

    // 初始聚焦到对话框内的第一个可聚焦元素（便于键盘操作）
    setTimeout(() => {
      const firstFocusable =
        dialog.querySelector('input[name="apiType"]') || cancelButton;
      if (firstFocusable && typeof firstFocusable.focus === "function")
        firstFocusable.focus();
    }, 0);

    // 关闭函数（负责清理）
    function closeDialog() {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      document.body.style.overflow = prevBodyOverflow || "";
      document.removeEventListener("keydown", onKeyDown);
    }

    // 取消按钮
    cancelButton.addEventListener("click", () => {
      closeDialog();
    });

    // 确定按钮
    confirmButton.addEventListener("click", () => {
      const selectedRadio = dialog.querySelector(
        'input[name="apiType"]:checked'
      );
      if (selectedRadio) {
        const newApiType = selectedRadio.value;
        if (typeof setApiType === "function") {
          // 仅在变化时调用
          if (newApiType !== currentApiType) {
            try {
              setApiType(newApiType);
            } catch (e) {
              // 若 setApiType 抛错，仍然关闭并提示
              console.error(e);
            }
            // 提示用户刷新（使用更中性的提示替代 alert 也行）
            try {
              alert(
                `API接口已切换到 ${
                  newApiType === "WBI" ? "WBI签名" : "传统"
                } 接口\n请刷新页面使配置生效`
              );
            } catch (e) {}
          }
        } else {
          // 如果没有 setApiType，仍可返回选中值（供外部接收）
          console.warn("setApiType 未定义，已选择：", newApiType);
        }
      }
      closeDialog();
    });

    // 键盘支持：Esc 关闭，Enter 触发确定（当焦点在 radio 或按钮上）
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDialog();
      } else if (e.key === "Enter") {
        // 如果焦点在 input radio 上，Enter 也等同于点击确定
        const activeEl = document.activeElement;
        if (dialog.contains(activeEl)) {
          e.preventDefault();
          confirmButton.click();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    // 点击遮罩层关闭对话框
    overlay.onclick = function (e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };
  }

  // 从存储中获取当前动态的数据
  function getStoredData(identifier) {
    try {
      const allStoredData = JSON.parse(GM_getValue("biliReplyDict", "{}"));
      return allStoredData[identifier] || [];
    } catch (e) {
      console.warn("获取存储数据失败:", e);
      return [];
    }
  }

  // 从API获取数据
  function fetchCommentData(oid, page = 1) {
    return new Promise((resolve, reject) => {
      // 根据当前页面类型选择 type
      let initialType = 11;
      if (
        window.location.href.indexOf("https://www.bilibili.com/video/") === 0
      ) {
        initialType = 1;
      }
      const fetchWithType = (type) => {
        const apiUrl = `https://api.bilibili.com/x/v2/reply?type=${type}&oid=${oid}&pn=${page}`;
        GM_xmlhttpRequest({
          method: "GET",
          url: apiUrl,
          onload: function (response) {
            try {
              const data = JSON.parse(response.responseText);
              if (data && data.code === 0) {
                resolve(data);
              } else if (type === 11) {
                console.warn("Type 11 failed, retrying with Type 17...");
                fetchWithType(17);
              } else {
                reject("获取数据失败: " + (data.message || "未知错误"));
              }
            } catch (e) {
              reject("解析数据失败: " + e.message);
            }
          },
          onerror: function (error) {
            reject("网络请求失败: " + error);
          },
        });
      };

      fetchWithType(initialType);
    });
  }

  // 处理获取到的数据
  function processData(replies, page) {
    const processedData = [];
    for (const reply of replies) {
      if (!reply.member || !reply.content) continue;

      const pictures = reply.content.pictures || [];
      if (pictures.length === 0) continue;

      const message = reply.content.message || "";
      // 储存完整消息和截断消息
      const truncatedMessage =
        message.length > 10 ? message.substring(0, 10) + "..." : message;
      // 硬截断为20个字符
      const hardTruncatedMessage =
        message.length > 20 ? message.substring(0, 20) + "..." : message;

      const displayText = `${
        reply.member.uname
      } - ${truncatedMessage} - ${formatTimestamp(reply.ctime)}`;

      const imageData = pictures.map((pic, index) => {
        const originalUrl = pic.img_src;
        const fileExtension = originalUrl.split(".").pop().split("?")[0];

        // 处理biz_scene，移除opus_前缀
        let bizScene = reply.reply_control?.biz_scene || "unknown";
        bizScene = bizScene.replace("opus_", "");

        // 新的命名格式
        return {
          url: originalUrl,
          fileName: `${reply.member.uname} - ${reply.member.mid} - ${bizScene} - ${index}.${fileExtension}`,
        };
      });

      processedData.push({
        displayText,
        fullMessage: message,
        truncatedMessage: hardTruncatedMessage,
        username: reply.member.uname,
        timestamp: formatTimestamp(reply.ctime),
        images: imageData,
      });
    }

    return processedData;
  }

  // 格式化时间戳
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
      date.getDate()
    )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  }

  // 数字补零
  function padZero(num) {
    return num < 10 ? "0" + num : num;
  }

  // 更新分页控制区域的可见性
  function updatePaginationVisibility() {
    const paginationDiv = document.getElementById("bili-img-pagination");
    const apiType = getCurrentApiType();

    if (paginationDiv) {
      // WBI接口隐藏分页，传统接口显示分页
      paginationDiv.style.display = apiType === "WBI" ? "none" : "flex";
    }
  }

  function createDownloadOptions(processedData, menuContent) {
    function injectDownloadOptionStyle() {
      if (document.getElementById("bili-download-option-style")) return;

      const style = document.createElement("style");

      style.id = "bili-download-option-style";
      style.textContent = `
/* 统计栏 */
.bili-download-stats {
  padding: 5px 0;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #eee;
}

body:has(.dark_mode) .bili-download-stats,
html.night-mode .bili-download-stats {
  color: #b0b7c3;
  border-bottom: 1px solid #333;
}

/* 下载项 */
.bili-download-option {
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #eee;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s;
}
body:has(.dark_mode) .bili-download-option,
html.night-mode .bili-download-option {
  border-color: #333;
}

/* 悬停效果 */
.bili-download-option:hover {
  background-color: #f5f5f5;
}
body:has(.dark_mode) .bili-download-option:hover,
html.night-mode .bili-download-option:hover {
  background-color: #1e2226;
}

/* 内容布局 */
.bili-download-option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 左侧信息 */
.bili-download-info {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex: 1;
}

/* 用户名 */
.bili-download-username {
  font-weight: bold;
  margin-right: 5px;
  white-space: nowrap;
}

/* 评论内容 */
.bili-download-message {
  margin: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* 时间 */
.bili-download-time {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
  margin-left: 5px;
}
body:has(.dark_mode) .bili-download-time,
html.night-mode .bili-download-time {
  color: #888;
}

/* 图片数量 */
.bili-download-count {
  color: #00a1d6;
  white-space: nowrap;
  margin-left: 10px;
}
`;
      document.head.appendChild(style);
    }

    injectDownloadOptionStyle();
    menuContent.innerHTML = "";

    if (processedData.length === 0) {
      menuContent.innerHTML = "<p>没有找到包含图片的评论</p>";
      return;
    }

    // 统计信息
    const statsDiv = document.createElement("div");
    statsDiv.className = "bili-download-stats";

    const apiType = getCurrentApiType();
    const apiTypeText =
      apiType === "WBI" ? "WBI签名接口（实时更新）" : "传统接口";

    statsDiv.textContent = `共找到 ${processedData.length} 条包含图片的评论 [${apiTypeText}]`;
    menuContent.appendChild(statsDiv);

    for (const item of processedData) {
      const downloadOption = document.createElement("div");
      downloadOption.className = "bili-download-option";

      const content = document.createElement("div");
      content.className = "bili-download-option-content";

      const infoDiv = document.createElement("div");
      infoDiv.className = "bili-download-info";

      const usernameSpan = document.createElement("span");
      usernameSpan.className = "bili-download-username";
      usernameSpan.textContent = item.username;

      const messageSpan = document.createElement("span");
      messageSpan.className = "bili-download-message";
      messageSpan.textContent = item.truncatedMessage;
      messageSpan.title = item.fullMessage;

      const timeSpan = document.createElement("span");
      timeSpan.className = "bili-download-time";
      timeSpan.textContent = item.timestamp;

      const countSpan = document.createElement("span");
      countSpan.className = "bili-download-count";
      countSpan.textContent = `[${item.images.length}张]`;

      infoDiv.appendChild(usernameSpan);
      infoDiv.appendChild(messageSpan);
      infoDiv.appendChild(timeSpan);

      content.appendChild(infoDiv);
      content.appendChild(countSpan);
      downloadOption.appendChild(content);

      downloadOption.addEventListener("click", () => {
        downloadImages(item.images);
      });

      menuContent.appendChild(downloadOption);
    }
  }

  // 下载图片
  function downloadImages(images) {
    let downloaded = 0;

    console.log("开始下载", `准备下载 ${images.length} 张图片...`);

    for (const image of images) {
      GM_download({
        url: image.url,
        name: image.fileName,
        onload: function () {
          downloaded++;
          if (downloaded === images.length) {
            console.log(`成功下载 ${downloaded} 张图片...`);
          }
        },
        onerror: function (error) {
          console.log(`图片 ${image.fileName} 下载失败`, error);
        },
      });
    }
  }

  // 实时刷新下载界面
  function refreshDownloadInterface() {
    const menuContainer = document.getElementById("bili-img-download-menu");
    if (!menuContainer || menuContainer.style.display !== "block") {
      return;
    }

    // 保持当前页码，重新加载数据
    loadAndDisplayDataSilent(currentPage);
  }

  // 静默加载数据（不显示加载提示）
  async function loadAndDisplayDataSilent(page = 1) {
    const menuContent = document.getElementById("bili-img-download-content");
    const pageInfo = document.getElementById("bili-page-info");
    const prevButton = document.getElementById("bili-prev-page");

    try {
      const identifier = document.currentIdentifier || getIdentifier();
      const apiType = getCurrentApiType();

      let allReplies = [];

      if (apiType === "WBI") {
        // WBI接口：优先从存储中获取数据
        let storedReplies = getStoredData(identifier);
        if (storedReplies.length > 0) {
          allReplies = storedReplies;
        }
      } else {
        if (!identifier) {
          menuContent.innerHTML =
            "<p>错误: 无法获取OID，请确保在正确的页面</p>";
          return;
        }

        const data = await fetchCommentData(identifier, page);
        const targetData = data.data;
        allReplies =
          page === 1
            ? [...(targetData.top_replies || []), ...(targetData.replies || [])]
            : targetData.replies || [];
      }

      const processedData = processData(allReplies, page);
      createDownloadOptions(processedData, menuContent);

      // 更新分页控制区域的可见性
      updatePaginationVisibility();

      // 更新分页信息（仅对传统接口有效）
      if (apiType === "TRADITIONAL") {
        currentPage = page;
        pageInfo.textContent = `第${page}页`;
        prevButton.disabled = page <= 1;

        // 如果没有数据，禁用下一页按钮
        const nextButton = document.getElementById("bili-next-page");
        if (processedData.length === 0) {
          nextButton.disabled = true;
        } else {
          nextButton.disabled = false;
        }
      }
    } catch (error) {
      console.error("Silent refresh error:", error);
    }
  }

  // 加载数据并显示
  async function loadAndDisplayData(page = 1) {
    const menuContainer =
      document.getElementById("bili-img-download-menu") || createDownloadMenu();
    const menuContent = document.getElementById("bili-img-download-content");
    const pageInfo = document.getElementById("bili-page-info");
    const prevButton = document.getElementById("bili-prev-page");

    menuContainer.style.display = "block";
    menuContent.innerHTML = "<p>正在加载数据...</p>";

    try {
      const identifier = document.currentIdentifier || getIdentifier();
      const apiType = getCurrentApiType();
      console.log(`当前oid: ${identifier}, API类型: ${apiType}`);

      let allReplies = [];

      if (apiType === "WBI") {
        // WBI接口：优先从存储中获取数据，不支持翻页
        let storedReplies = getStoredData(identifier);
        if (storedReplies.length > 0) {
          console.log(`从存储中加载到 ${storedReplies.length} 条评论`);
          allReplies = storedReplies;
        } else {
          // 如果存储中没有数据，提示用户滚动页面或等待
          menuContent.innerHTML =
            "<p>WBI接口模式：请先滚动评论区加载数据，或等待页面自动加载评论</p>";
          return;
        }
      } else {
        if (!identifier) {
          menuContent.innerHTML =
            "<p>错误: 无法获取OID，请确保在正确的页面</p>";
          return;
        }

        const data = await fetchCommentData(identifier, page);
        const targetData = data.data;
        allReplies =
          page === 1
            ? [...(targetData.top_replies || []), ...(targetData.replies || [])]
            : targetData.replies || [];
      }

      const processedData = processData(allReplies, page);
      createDownloadOptions(processedData, menuContent);

      // 更新分页控制区域的可见性
      updatePaginationVisibility();

      // 更新分页信息（仅对传统接口有效）
      if (apiType === "TRADITIONAL") {
        currentPage = page;
        pageInfo.textContent = `第${page}页`;
        prevButton.disabled = page <= 1;

        // 如果没有数据，禁用下一页按钮
        const nextButton = document.getElementById("bili-next-page");
        if (processedData.length === 0) {
          nextButton.disabled = true;
        } else {
          nextButton.disabled = false;
        }
      }
    } catch (error) {
      menuContent.innerHTML = `<p>错误: ${error}</p>`;
      console.error("Error:", error);
    }
  }
  function addSpaceNavButton() {
    document
      .querySelectorAll(".bili-dyn-item:has(.bili-dyn-action.comment.active)")
      ?.forEach((opus) => {
        const root1 = opus.querySelector("bili-comments")?.shadowRoot;
        if (!root1) return;
        const root2 = root1.querySelector(
          "bili-comments-header-renderer:not([data-processed])"
        )?.shadowRoot;

        if (root2) {
          const buttons = root2.querySelectorAll("bili-text-button");
          const lastButton = buttons[buttons.length - 1];

          if (lastButton) {
            const newButton = document.createElement("bili-text-button");
            newButton.textContent = "解析评论区图片";
            lastButton.after(newButton);
            newButton.addEventListener("click", function () {
              syncNightMode();
              document.currentIdentifier = root1.host
                .getAttribute("data-params")
                .match(/\d{4,}/)[0];
              loadAndDisplayData();
            });
            root2.host.setAttribute("data-processed", "true");
          }
        } else {
          return;
        }
      });
  }
  // 添加导航按钮
  function addNavButton() {
    if (/bilibili\.com\/(video|list)/.test(location.href)) {
      const root1 = document.querySelector("bili-comments")?.shadowRoot;
      const root2 = root1?.querySelector(
        "bili-comments-header-renderer"
      )?.shadowRoot;
      if (!root1 || !root2) {
        setTimeout(addNavButton, 2000);
        return;
      }
      if (root2) {
        const buttons = root2.querySelectorAll("bili-text-button");
        const lastButton = buttons[buttons.length - 1];

        if (lastButton) {
          const newButton = document.createElement("bili-text-button");
          newButton.textContent = "解析评论区图片";
          lastButton.after(newButton);
          newButton.addEventListener("click", function () {
            syncNightMode();
            loadAndDisplayData();
          });
        }
      }
    } else {
      const navContainer = document.querySelector(".bili-tabs__nav__items");
      if (!navContainer) {
        // 如果找不到导航容器，稍后再试
        setTimeout(addNavButton, 1000);
        return;
      }

      const navItem = document.createElement("div");
      navItem.className = "bili-tabs__nav__item";
      navItem.textContent = "解析评论区图片";
      navItem.style.cssText = `
            cursor: pointer;
        `;

      navItem.addEventListener("click", function () {
        syncNightMode();
        loadAndDisplayData();
      });

      navContainer.appendChild(navItem);
    }
  }

  // 将点击处理绑定到分页区域（更局部、更安全）
  function setupPaginationEvents() {
    const tryAttach = () => {
      const paginationDiv = document.getElementById("bili-img-pagination");
      if (paginationDiv) {
        attachPaginationHandlers(paginationDiv);
        return true;
      }
      return false;
    };

    // 如果已经存在，直接绑定
    if (tryAttach()) return;

    // 否则使用 MutationObserver 等待分页区域被加入 DOM（createDownloadMenu 会插入）
    const observer = new MutationObserver((mutations, obs) => {
      if (tryAttach()) {
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 作为保险：在若干秒后断开 observer（避免长期挂起）
    setTimeout(() => observer.disconnect(), 10_000);
  }

  function attachPaginationHandlers(paginationDiv) {
    // 防止重复绑定：使用一个标志
    if (paginationDiv.__bili_pagination_bound) return;
    paginationDiv.__bili_pagination_bound = true;

    const prevButton = paginationDiv.querySelector("#bili-prev-page");
    const nextButton = paginationDiv.querySelector("#bili-next-page");

    if (prevButton) {
      prevButton.addEventListener("click", (e) => {
        // 只有在传统接口下才响应
        if (getCurrentApiType() !== "TRADITIONAL") return;
        if (prevButton.disabled) return;
        if (currentPage > 1) {
          loadAndDisplayData(currentPage - 1);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", (e) => {
        if (getCurrentApiType() !== "TRADITIONAL") return;
        if (nextButton.disabled) return;
        loadAndDisplayData(currentPage + 1);
      });
    }
  }
  function syncNightMode() {
    const m = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
    if (!m) return;
    document.documentElement.classList.toggle(
      "night-mode",
      (m[0] * 299 + m[1] * 587 + m[2] * 114) / 1000 < 128
    );
  }

  // 监听评论更新事件
  function setupCommentUpdateListener() {
    window.addEventListener("biliCommentUpdate", function () {
      refreshDownloadInterface();
    });
  }
  // 主函数
  function main() {
    // 创建下载菜单但不显示
    createDownloadMenu();

    // 添加导航按钮
    addNavButton();
    if (location.hostname === "space.bilibili.com") {
      setInterval(() => {
        if (/space\.bilibili\.com\/\d+\/dynamic/.test(location.href)) {
          addSpaceNavButton();
        }
      }, 2000);
    }

    // 设置分页事件
    setupPaginationEvents();

    // 设置评论更新监听
    setupCommentUpdateListener();

    // 添加油猴脚本菜单命令，点击后弹出下载界面
    GM_registerMenuCommand("显示下载界面", function () {
      loadAndDisplayData(1);
    });
  }
  GM_registerMenuCommand("清除数据", () => {
    const keys = GM_listValues();
    for (const key of keys) {
      GM_deleteValue(key);
    }
    alert(`清除 ${keys.length} 条数据完成`);
  });

  // 添加API配置菜单命令
  GM_registerMenuCommand("API接口配置", function () {
    showApiConfigDialog();
  });

  // 页面加载完成后执行
  window.addEventListener("load", main);
})();