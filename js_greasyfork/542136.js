// ==UserScript==
// @name         Iwara → Aria2 离线下载助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动获取 iwara 视频最高分辨率下载链接，并调用 Aria2 RPC 实现离线下载，同时提供前端配置面板设置 Aria2 RPC 地址、密钥和下载路径。新增：自动清理 Windows 非法文件名字符；若文件名以“Iwara - ”开头则移除。
// @match        *://*.iwara.tv/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/542136/Iwara%20%E2%86%92%20Aria2%20%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542136/Iwara%20%E2%86%92%20Aria2%20%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /////////////////////////////
  // 配置存储与获取函数
  const ARIA2_CONFIG_KEY = "aria2Config";

  const defaultConfig = {
    rpcUrl: "http://localhost:6800/jsonrpc",
    rpcSecret: "",
    downloadPath: "/downloads/iwara"
  };

  function getConfig() {
    return GM_getValue(ARIA2_CONFIG_KEY, defaultConfig);
  }

  function saveConfig(cfg) {
    GM_setValue(ARIA2_CONFIG_KEY, cfg);
  }

  /////////////////////////////
  // 工具：检测是否 Windows 目录（盘符或反斜杠风格）
  function looksLikeWindowsPath(p) {
    if (!p) return false;
    // 盘符: D:\... 或 UNC \\server\share
    return /^[a-zA-Z]:[\\/]/.test(p) || /^\\\\/.test(p);
  }

  /////////////////////////////
  // 从 Iwara 下载链接中提取并净化文件名（适配 Windows 非法字符）
  function getFilenameFromUrl(url, isWindowsTarget) {
    try {
      const urlObj = new URL(url);

      // 1. 优先取 ?download= 参数（最完整）
      let rawName = urlObj.searchParams.get('download');
      if (!rawName) {
        // 2. 其次取 ?filename= 参数
        rawName = urlObj.searchParams.get('filename');
      }
      if (!rawName) {
        // 3. 兜底：从路径里取
        rawName = urlObj.pathname.split('/').pop();
      }
      if (!rawName) return null;

      // 解码
      let name = decodeURIComponent(rawName);

      // 如果以 "Iwara - " 开头则移除
      if (name.startsWith("Iwara - ")) {
        name = name.substring("Iwara - ".length);
      }

      // 替换路径分隔符，避免被误识别为目录
      name = name.replace(/[\\/]+/g, "_");

      // 如果目标是 Windows，清理 Windows 不允许的字符
      if (isWindowsTarget) {
        // Windows 禁止的字符: < > : " / \ | ? *
        name = name.replace(/[<>:"/\\|?*]/g, "_");

        // 清理控制字符（0x00-0x1F）
        name = name.replace(/[\x00-\x1F]/g, "_");

        // 去除结尾的空格和点（Windows 不允许文件名以空格或点结尾）
        name = name.replace(/[ .]+$/g, "");

        // Windows 保留名（大小写不敏感），如 CON、PRN、AUX、NUL、COM1..COM9、LPT1..LPT9
        const base = name.replace(/\.[^.]+$/g, ""); // 不含扩展名的部分
        const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
        if (reserved.test(base)) {
          name = "_" + name;
        }
      }

      // 兜底：如果清理后为空，则给一个默认名
      if (!name.trim()) {
        name = "iwara_video.mp4";
      }

      return name;
    } catch (e) {
      console.error('解析 URL 或处理文件名失败', e);
      return null;
    }
  }

  /////////////////////////////
  // 调用 Aria2 RPC 添加下载任务
  function addDownloadToAria2(downloadUrl, filename) {
    const cfg = getConfig();
    if (!cfg.rpcUrl) {
      alert("请先在配置面板中设置 Aria2 RPC 地址！");
      return;
    }

    // 判断下载路径是否为 Windows 风格，影响文件名清理策略
    const isWindowsTarget = looksLikeWindowsPath(cfg.downloadPath);

    // 构建下载选项，包括下载目录和文件名
    const options = {
      dir: cfg.downloadPath
    };

    // 如果成功提取到文件名，就使用 'out' 选项指定它
    if (filename) {
      // 再做一层防御性清理，确保与目标平台一致
      options.out = getFilenameFromUrl(downloadUrl, isWindowsTarget) || filename;
    }

    const params = [];
    if (cfg.rpcSecret) {
      params.push(`token:${cfg.rpcSecret}`);
    }
    params.push([downloadUrl]);
    params.push(options); // 将包含目录和文件名的选项对象推入

    const payload = {
      jsonrpc: "2.0",
      id: `iwara-${Date.now()}`,
      method: "aria2.addUri",
      params: params
    };

    // 使用 GM_xmlhttpRequest 发送请求以绕过混合内容限制
    GM_xmlhttpRequest({
      method: "POST",
      url: cfg.rpcUrl,
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(payload),
      onload: function(response) {
        if (response.status >= 200 && response.status < 300) {
          try {
            const data = JSON.parse(response.responseText);
            if (data.error) {
              console.error("Aria2 RPC 调用失败", data.error);
              alert(`添加到 Aria2 失败：${data.error.message}`);
            } else if (data.result) {
              console.log("成功添加到 Aria2 下载队列, GID:", data.result);
              alert("成功添加到 Aria2 下载队列！");
            } else {
              console.error("未知的 Aria2 响应", data);
              alert("收到未知的 Aria2 响应。");
            }
          } catch (e) {
            console.error("解析 Aria2 响应失败", e);
            alert("解析 Aria2 响应失败，请检查控制台日志。");
          }
        } else {
          console.error(`HTTP error! status: ${response.status}`);
          alert(`请求 Aria2 RPC 接口失败，HTTP 状态码: ${response.status}`);
        }
      },
      onerror: function(error) {
        console.error("请求 Aria2 RPC 接口出错", error);
        alert("请求 Aria2 RPC 接口出错, 请检查：\n1. RPC 地址是否正确。\n2. Aria2 是否正在运行。\n3. 油猴脚本的 @connect 权限是否允许该地址。");
      }
    });
  }

  /////////////////////////////
  // 添加美观的设置面板
  function createAria2ConfigPanel() {
    if (document.getElementById("aria2-config-panel")) return;

    const div = document.createElement("div");
    div.id = "aria2-config-panel";
    div.style.position = "fixed";
    div.style.top = "20%";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.zIndex = "9999";
    div.style.backgroundColor = "#fff";
    div.style.border = "1px solid #aaa";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 0 12px rgba(0,0,0,0.2)";
    div.style.padding = "16px";
    div.style.width = "420px";
    div.style.fontFamily = "Arial, sans-serif";
    div.style.color = "#333";

    div.innerHTML = `
      <h3 style="text-align:center; margin-top:0; margin-bottom: 16px;">Aria2 RPC 设置</h3>
      <div style="margin-bottom:12px;">
        <label style="display:block; margin-bottom:4px;">RPC 地址:</label>
        <input id="aria2-rpc-url" type="text" style="width:100%; box-sizing: border-box; padding: 4px;" placeholder="如: http://192.168.1.10:6800/jsonrpc">
      </div>
      <div style="margin-bottom:12px;">
        <label style="display:block; margin-bottom:4px;">RPC 密钥 (Token):</label>
        <input id="aria2-rpc-secret" type="password" style="width:100%; box-sizing: border-box; padding: 4px;" placeholder="如果未设置可留空">
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block; margin-bottom:4px;">下载路径:</label>
        <input id="aria2-download-path" type="text" style="width:100%; box-sizing: border-box; padding: 4px;" placeholder="如: D:\\iwara 或 /downloads/iwara">
        <div style="color:#777;font-size:12px;margin-top:4px;">提示：如填写 Windows 路径（例如 D:\\iwara 或 \\\\NAS\\share），脚本会自动清理 Windows 非法文件名字符。</div>
      </div>
      <div style="text-align:right;">
        <button id="aria2-save-btn" style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">保存</button>
        <button id="aria2-cancel-btn" style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; margin-left: 8px;">取消</button>
      </div>
    `;
    document.body.appendChild(div);

    const cfg = getConfig();
    document.getElementById("aria2-rpc-url").value = cfg.rpcUrl;
    document.getElementById("aria2-rpc-secret").value = cfg.rpcSecret;
    document.getElementById("aria2-download-path").value = cfg.downloadPath;

    document.getElementById("aria2-save-btn").onclick = function () {
      const newCfg = {
        rpcUrl: document.getElementById("aria2-rpc-url").value.trim(),
        rpcSecret: document.getElementById("aria2-rpc-secret").value.trim(),
        downloadPath: document.getElementById("aria2-download-path").value.trim()
      };
      saveConfig(newCfg);
      alert("Aria2 配置已保存！");
      document.body.removeChild(div);
    };

    document.getElementById("aria2-cancel-btn").onclick = function () {
      document.body.removeChild(div);
    };
  }

  GM_registerMenuCommand("Aria2 设置", createAria2ConfigPanel);

  /////////////////////////////
  // 针对动态生成的下拉菜单添加按钮
  function processDropdown(dropdown) {
    if (!dropdown) return;
    const links = dropdown.querySelectorAll("a");
    if (!links || links.length === 0) return;

    let highestLink = null;
    links.forEach(a => {
      if (a.textContent.trim().toLowerCase() === "source") {
        highestLink = a;
      }
    });
    if (!highestLink && links.length > 0) {
      highestLink = links[0];
    }

    if (!highestLink) return;

    if (highestLink.nextElementSibling && highestLink.nextElementSibling.classList.contains("aria2-download-btn"))
      return;

    const btn = document.createElement("button");
    btn.textContent = "Aria2离线下载";
    btn.classList.add("aria2-download-btn");
    btn.style.marginLeft = "10px";
    btn.style.padding = "2px 6px";
    btn.style.fontSize = "12px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid " + (document.documentElement.classList.contains("dark") ? "#555" : "#ccc");
    btn.style.borderRadius = "4px";
    btn.style.backgroundColor = document.documentElement.classList.contains("dark") ? "#333" : "#f0f0f0";
    btn.style.color = document.documentElement.classList.contains("dark") ? "#eee" : "#000";

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const downloadUrl = highestLink.href;
      if (!downloadUrl) {
        alert("未找到下载链接！");
        return;
      }
      const cfg = getConfig();
      const isWindowsTarget = looksLikeWindowsPath(cfg.downloadPath);
      const filename = getFilenameFromUrl(downloadUrl, isWindowsTarget);
      addDownloadToAria2(downloadUrl, filename);
    });

    highestLink.parentNode.insertBefore(btn, highestLink.nextSibling);
  }

  // MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.classList && node.classList.contains("dropdown__content")) {
          processDropdown(node);
        } else if (node.querySelectorAll) {
          const dropdowns = node.querySelectorAll(".dropdown__content");
          dropdowns.forEach(dropdown => processDropdown(dropdown));
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();