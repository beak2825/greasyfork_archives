// ==UserScript==
// @name         ChatGPT Degraded
// @name:zh-CN   ChatGPT 服务降级监控
// @name:zh-TW   ChatGPT 服務降級監控
// @namespace    https://github.com/lroolle/chatgpt-degraded
// @version      0.2.9
// @description  Monitor ChatGPT service level, IP quality and PoW difficulty
// @description:zh-CN  监控 ChatGPT 服务状态、IP 质量和 PoW 难度
// @description:zh-TW  監控 ChatGPT 服務狀態、IP 質量和 PoW 難度
// @author       lroolle
// @license      AGPL-3.0
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @connect      chatgpt.com
// @connect      chat.openai.com
// @connect      status.openai.com
// @connect      scamalytics.com
// @connect      cloudflare.com
// @connect      www.cloudflare.com
// @connect      ipinfo.io
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmE5ZDhmO3N0b3Atb3BhY2l0eToxIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJhOWQ4ZjtzdG9wLW9wYWNpdHk6MC44Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Zz4KICAgIDxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjI4IiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KPCEtLU91dGVyIGNpcmNsZSBtb2RpZmllZCB0byBsb29rIGxpa2UgIkMiLS0+CiAgICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1kYXNoYXJyYXk9IjEyNSA1NSIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjIwIi8+CiAgICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiNmZmYiLz4KICA8L2c+Cjwvc3ZnPg==
// @homepageURL  https://github.com/lroolle/chatgpt-degraded
// @supportURL   https://github.com/lroolle/chatgpt-degraded/issues
// @downloadURL https://update.greasyfork.org/scripts/522323/ChatGPT%20Degraded.user.js
// @updateURL https://update.greasyfork.org/scripts/522323/ChatGPT%20Degraded.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let displayBox, collapsedIndicator;
  let monitoringStarted = false;
  let reinjectObserverStarted = false;
  let themeObserverStarted = false;
  let statusCheckTimer = null;
  let reinjectScheduled = false;

  // Store handler on element to avoid global pollution and memory leaks
  const HANDLER_KEY = "_chatgptDegradedHandler";

  const UI_IDS = {
    display: "chatgpt-degraded-display",
    indicator: "chatgpt-degraded-indicator",
  };

  function isConnected(el) {
    return !!(el && el.isConnected);
  }

  function ensureUIElements() {
    if (isConnected(displayBox) && isConnected(collapsedIndicator)) return true;

    displayBox = document.getElementById(UI_IDS.display);
    collapsedIndicator = document.getElementById(UI_IDS.indicator);

    if (isConnected(displayBox) && isConnected(collapsedIndicator)) return true;
    if (!document.body) return false;

    createUIElements();
    return isConnected(displayBox) && isConnected(collapsedIndicator);
  }

  function scheduleReinject() {
    if (reinjectScheduled) return;
    reinjectScheduled = true;
    setTimeout(() => {
      reinjectScheduled = false;
      if (!document.body) return;
      if (document.getElementById(UI_IDS.display)) return;
      createUIElements();
      updateTheme();
    }, 250);
  }

  const i18n = {
    en: {
      service: "Service",
      ip: "IP",
      pow: "PoW",
      status: "Status",
      unknown: "Unknown",
      copyHistory: "Click to copy history",
      historyCopied: "History copied!",
      copyFailed: "Copy failed",
      riskLevels: {
        veryEasy: "Very Easy",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        critical: "Critical",
      },
      tooltips: {
        powDifficulty: "PoW Difficulty: Lower (green) means faster responses.",
        ipHistory: "IP History (recent 10):",
        warpPlus: "Protected by Cloudflare WARP+",
        warp: "Protected by Cloudflare WARP",
        clickToCopy: "Click to copy full history",
      },
    },
    "zh-CN": {
      service: "服务",
      ip: "IP",
      pow: "算力",
      status: "状态",
      unknown: "未知",
      copyHistory: "点击复制历史",
      historyCopied: "已复制历史!",
      copyFailed: "复制失败",
      riskLevels: {
        veryEasy: "非常容易",
        easy: "容易",
        medium: "中等",
        hard: "困难",
        critical: "严重",
      },
      tooltips: {
        powDifficulty: "PoW 难度：越低（绿色）响应越快",
        ipHistory: "IP 历史（最近10条）:",
        warpPlus: "已启用 Cloudflare WARP+",
        warp: "已启用 Cloudflare WARP",
        clickToCopy: "点击复制完整历史",
      },
    },
    "zh-TW": {
      service: "服務",
      ip: "IP",
      pow: "算力",
      status: "狀態",
      unknown: "未知",
      copyHistory: "點擊複製歷史",
      historyCopied: "已複製歷史!",
      copyFailed: "複製失敗",
      riskLevels: {
        veryEasy: "非常容易",
        easy: "容易",
        medium: "中等",
        hard: "困難",
        critical: "嚴重",
      },
      tooltips: {
        powDifficulty: "PoW 難度：越低（綠色）回應越快",
        ipHistory: "IP 歷史（最近10筆）:",
        warpPlus: "已啟用 Cloudflare WARP+",
        warp: "已啟用 Cloudflare WARP",
        clickToCopy: "點擊複製完整歷史",
      },
    },
  };

  // Get user language
  const userLang = (navigator.language || "en").toLowerCase();
  const lang = i18n[userLang]
    ? userLang
    : userLang.startsWith("zh-tw")
      ? "zh-TW"
      : userLang.startsWith("zh")
        ? "zh-CN"
        : "en";
  const t = (key) => {
    const keys = key.split(".");
    return (
      keys.reduce((obj, k) => obj?.[k], i18n[lang]) ||
      i18n.en[keys[keys.length - 1]]
    );
  };

  function updateUserType(type) {
    const userTypeElement = document.getElementById("user-type");
    if (!userTypeElement) return;
    const isPaid =
      type &&
      (type === "plus" ||
        type === "chatgpt-paid" ||
        type.includes("paid") ||
        type.includes("premium") ||
        type.includes("pro"));
    userTypeElement.textContent = isPaid ? "Paid" : "Free";
    userTypeElement.dataset.tooltip = `ChatGPT Account Type: ${isPaid ? "Paid" : "Free"}`;
    userTypeElement.style.color = isPaid
      ? "var(--success-color, #10a37f)"
      : "var(--text-primary, #374151)";
  }

  function getRiskColorAndLevel(difficulty) {
    if (!difficulty || difficulty === "N/A") {
      return { color: "#e63946", level: "Unknown", percentage: 0 };
    }
    const cleanDifficulty = difficulty.replace(/^0x/, "").replace(/^0+/, "");
    const hexLength = cleanDifficulty.length;
    if (hexLength <= 2) {
      return { color: "#e63946", level: "Critical", percentage: 100 };
    } else if (hexLength <= 3) {
      return { color: "#FAB12F", level: "Hard", percentage: 75 };
    } else if (hexLength <= 4) {
      return { color: "#859F3D", level: "Medium", percentage: 50 };
    } else if (hexLength <= 5) {
      return { color: "#2a9d8f", level: "Easy", percentage: 25 };
    } else {
      return { color: "#4CAF50", level: "Very Easy", percentage: 0 };
    }
  }

  function setProgressBar(bar, label, percentage, text, gradient, title) {
    bar.style.width = "100%";
    bar.style.background = gradient;
    bar.dataset.tooltip = title;
    label.innerText = text;
  }

  function updateProgressBars(difficulty) {
    const powBar = document.getElementById("pow-bar");
    const powLevel = document.getElementById("pow-level");
    const difficultyElement = document.getElementById("difficulty");
    if (!powBar || !powLevel || !difficultyElement) return;
    const { color, level, percentage } = getRiskColorAndLevel(difficulty);
    const gradient = `linear-gradient(90deg, ${color} ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%)`;
    setProgressBar(
      powBar,
      powLevel,
      percentage,
      level,
      gradient,
      "PoW Difficulty: Lower (green) means faster responses.",
    );
    difficultyElement.style.color = color;
    powLevel.style.color = color;

    // Update icon animation based on difficulty level
    if (collapsedIndicator) {
      const outerRingAnim =
        collapsedIndicator.querySelector("#outer-ring-anim");
      const middleRingAnim =
        collapsedIndicator.querySelector("#middle-ring-anim");
      const centerDotAnim =
        collapsedIndicator.querySelector("#center-dot-anim");
      const gradientStops = collapsedIndicator.querySelector("#gradient");

      // Adjust animation speed based on difficulty level
      const animationSpeed = percentage < 25 ? 0.5 : percentage / 25; // Make it more still when easy
      if (outerRingAnim)
        outerRingAnim.setAttribute("dur", `${8 / animationSpeed}s`);
      if (middleRingAnim)
        middleRingAnim.setAttribute("dur", `${4 / animationSpeed}s`);
      if (centerDotAnim) {
        centerDotAnim.setAttribute("dur", `${2 / animationSpeed}s`);
        // Smaller pulse for easy difficulty
        centerDotAnim.setAttribute(
          "values",
          percentage < 25 ? "4;4.5;4" : "4;5;4",
        );
      }

      // Update gradient color using DOM methods (avoid innerHTML with dynamic values)
      if (gradientStops) {
        const stops = gradientStops.querySelectorAll("stop");
        if (stops.length >= 2) {
          stops[0].setAttribute("style", `stop-color:${color};stop-opacity:1`);
          stops[1].setAttribute("style", `stop-color:${color};stop-opacity:0.8`);
        }
      }
    }
  }

  // Guard: ensure unsafeWindow.fetch exists before patching
  if (!unsafeWindow.fetch) {
    console.error("ChatGPT Degraded: unsafeWindow.fetch not available");
  } else {
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function (resource, options) {
      let response;
      try {
        response = await originalFetch.call(this, resource, options);
      } catch (fetchErr) {
        throw fetchErr; // Re-throw original fetch errors, don't break ChatGPT
      }

      const url = typeof resource === "string" ? resource : resource?.url;
      const isChatRequirements =
        url &&
        (url.includes("/backend-api/sentinel/chat-requirements") ||
          url.includes("/backend-anon/sentinel/chat-requirements") ||
          url.includes("/api/sentinel/chat-requirements"));

      if (isChatRequirements) {
        // Process in background - NEVER block the response
        (async () => {
          try {
            ensureUIElements();
            // Guard response.clone() - can throw if body is locked
            let clonedResponse;
            try {
              clonedResponse = response.clone();
            } catch (cloneErr) {
              console.warn("ChatGPT Degraded: Could not clone response:", cloneErr.message);
              return;
            }
            const contentType = clonedResponse.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) return;

            const data = await clonedResponse.json();
            const difficulty = data?.proofofwork?.difficulty;
            const userType = data?.persona || data?.user_type || data?.account_type;
            const difficultyElement = document.getElementById("difficulty");
            const hasDifficulty = typeof difficulty === "string" && difficulty.length;

            if (difficultyElement && hasDifficulty) {
              difficultyElement.innerText = difficulty;
              difficultyElement.dataset.tooltip = `Raw Difficulty Value: ${difficulty}`;
              const ipElement = document.getElementById("ip-address");
              if (ipElement) {
                const fullIP = ipElement.dataset.fullIp;
                const ipQualityElement = document.getElementById("ip-quality");
                const score = ipQualityElement
                  ? parseInt(ipQualityElement.dataset.score, 10)
                  : null;
                if (fullIP) {
                  const logs = addIPLog(fullIP, score, difficulty);
                  if (logs.length) {
                    const formattedLogs = formatIPLogs(logs);
                    ipElement.dataset.tooltip = [
                      t("tooltips.ipHistory"),
                      formattedLogs,
                      "\n---",
                      t("tooltips.clickToCopy"),
                    ].join("\n");
                  }
                }
              }
            } else if (difficultyElement && !difficultyElement.innerText) {
              difficultyElement.innerText = "N/A";
              difficultyElement.dataset.tooltip = "No difficulty value found";
            }
            if (userType) updateUserType(userType);
            if (hasDifficulty) updateProgressBars(difficulty);
          } catch (error) {
            console.error("ChatGPT Degraded: Error processing chat requirements:", error);
            const difficultyElement = document.getElementById("difficulty");
            if (difficultyElement && !difficultyElement.innerText) {
              difficultyElement.innerText = "N/A";
              difficultyElement.dataset.tooltip = `Error: ${error.message}`;
              updateProgressBars("N/A");
            }
          }
        })();
      }

      return response; // ALWAYS return immediately
    };
  }

  function createUIElements() {
    const existingDisplay = document.getElementById(UI_IDS.display);
    const existingIndicator = document.getElementById(UI_IDS.indicator);
    if (existingDisplay && existingIndicator) {
      displayBox = existingDisplay;
      collapsedIndicator = existingIndicator;
      return;
    }

    if (!document.body) return;
    if (existingDisplay) existingDisplay.remove();
    if (existingIndicator) existingIndicator.remove();

    displayBox = document.createElement("div");
    displayBox.id = UI_IDS.display;
    displayBox.style.position = "fixed";
    displayBox.style.bottom = "10px";
    displayBox.style.right = "55px";
    displayBox.style.width = "360px";
    displayBox.style.padding = "24px";
    displayBox.style.backgroundColor =
      "var(--surface-primary, rgb(255, 255, 255))";
    displayBox.style.color = "var(--text-primary, #374151)";
    displayBox.style.fontSize = "14px";
    displayBox.style.borderRadius = "16px";
    displayBox.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.08)";
    displayBox.style.zIndex = "10000";
    displayBox.style.transition = "opacity 0.15s ease, transform 0.15s ease";
    displayBox.style.display = "none";
    displayBox.style.opacity = "0";
    displayBox.style.transform = "translateX(10px)";
    displayBox.style.border =
      "1px solid var(--border-light, rgba(0, 0, 0, 0.05))";

    displayBox.innerHTML = `
      <div id="content">
        <div class="monitor-item">
          <div class="monitor-row">
            <span class="label">${t("service")}</span>
            <span id="user-type" class="value" data-tooltip="ChatGPT Account Type"></span>
          </div>
        </div>

        <!-- Proof of Work Difficulty -->
        <div class="monitor-item">
          <div class="monitor-row">
            <span class="label">${t("pow")}</span>
            <div class="pow-container">
              <span id="difficulty" class="value monospace" data-tooltip="PoW Difficulty Value"></span>
              <span id="pow-level" class="value-tag" data-tooltip="Difficulty Level"></span>
            </div>
          </div>
          <div class="progress-wrapper" data-tooltip="${t("tooltips.powDifficulty")}">
            <div class="progress-container">
              <div id="pow-bar" class="progress-bar"></div>
            </div>
            <div class="progress-background"></div>
          </div>
        </div>

        <!-- IP + IP Quality -->
        <div class="monitor-item">
          <div class="monitor-row">
            <span class="label">${t("ip")}</span>
            <div class="ip-container">
              <span id="ip-address" class="value monospace" data-tooltip="Click to copy IP address"></span>
              <span id="warp-badge" class="warp-badge"></span>
              <span id="ip-quality" class="value-tag" data-tooltip="IP Risk Info (Scamlytics)"></span>
            </div>
          </div>
        </div>

        <!-- OpenAI System Status -->
        <div class="monitor-item">
          <div class="monitor-row">
            <span class="label">${t("status")}</span>
            <a id="status-description"
               href="https://status.openai.com"
               target="_blank"
               class="value"
               data-tooltip="Click to open status.openai.com">
               ${t("unknown")}
            </a>
          </div>
        </div>
      </div>

      <style>
        :root {
          --warning-color: #FAB12F;
          --warning-background: rgba(251, 177, 47, 0.1);
          --error-color: #e63946;
          --error-background: rgba(230, 57, 70, 0.1);
        }
        .monitor-item {
          margin-bottom: 16px;
        }
        .monitor-item:last-child {
          margin-bottom: 0;
        }
        .monitor-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .monitor-row:last-child {
          margin-bottom: 4px;
        }
        .label {
          font-size: 14px;
          color: var(--text-secondary, #6B7280);
          flex-shrink: 0;
          min-width: 40px;
        }
        .value {
          font-size: 14px;
          color: var(--text-primary, #374151);
          flex: 1;
        }
        .monospace {
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
        }
        .value-tag {
          font-size: 14px;
          color: var(--success-color, #10a37f);
          white-space: nowrap;
          font-weight: 500;
          transition: opacity 0.15s ease;
          cursor: pointer;
          display: inline-block;
        }
        .value-tag:hover {
          opacity: 0.8;
        }
        .progress-wrapper {
          position: relative;
          margin-left: 40px;
          margin-top: 4px;
        }
        .progress-container {
          position: relative;
          height: 4px;
          background: transparent;
          border-radius: 2px;
          overflow: hidden;
          z-index: 1;
        }
        .progress-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--surface-secondary, rgba(0, 0, 0, 0.08));
          border-radius: 2px;
        }
        .progress-bar {
          height: 100%;
          width: 0%;
          transition: all 0.3s ease;
          background: var(--success-color, #10a37f);
        }
        #status-description {
          text-decoration: none;
          color: inherit;
        }
        #status-description:hover {
          text-decoration: underline;
        }
        #ip-address {
          cursor: pointer;
        }
        #ip-address:hover {
          opacity: 0.7;
        }
        #user-type {
          font-weight: 500;
        }
        .ip-container,
        .pow-container {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        /* Ensure IP risk level (ip-quality) is right-aligned, just like pow-level */
        #ip-quality {
          margin-left: auto;
        }
        .warp-badge {
          font-size: 12px;
          color: var(--success-color, #10a37f);
          background-color: var(--surface-secondary, rgba(16, 163, 127, 0.1));
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
          cursor: help;
          display: none;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .warp-badge:hover {
          opacity: 0.8;
        }
        .ip-container .value-tag {
          padding-right: 0;
          position: relative;
        }
        /* Special handling for IP Risk tooltip */
        .ip-container .value-tag[data-tooltip]::after {
          left: auto;
          right: 0;
          transform: translateY(4px);
        }
        .ip-container .value-tag[data-tooltip]:hover::after {
          transform: translateY(0);
          left: auto;
          right: 0;
        }
        /* General tooltip styles */
        [data-tooltip] {
          position: relative;
          cursor: help;
        }
        [data-tooltip]::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: var(--surface-primary, rgba(0, 0, 0, 0.8));
          color: #fff;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 12px;
          white-space: pre-line;
          width: max-content;
          max-width: 600px;
          min-width: 450px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          pointer-events: none;
          margin-bottom: 8px;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
        }
        [data-tooltip]:hover::after {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        /* Arrow styles */
        [data-tooltip]::before {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          border: 6px solid transparent;
          border-top-color: var(--surface-primary, rgba(0, 0, 0, 0.8));
          margin-bottom: -4px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        [data-tooltip]:hover::before {
          opacity: 1;
          transform: translateY(0);
        }
        /* Special handling for IP Risk tooltip arrow */
        .ip-container .value-tag[data-tooltip]::before {
          left: auto;
          right: 12px;
          transform: translateY(4px);
        }
        .ip-container .value-tag[data-tooltip]:hover::before {
          transform: translateY(0);
          left: auto;
          right: 12px;
        }
        /* Ensure tooltips don't get cut off at viewport edges */
        @media screen and (max-width: 768px) {
          [data-tooltip]::after {
            min-width: 300px;
            max-width: calc(100vw - 48px);
          }
        }
      </style>
    `;
    document.body.appendChild(displayBox);

    collapsedIndicator = document.createElement("div");
    collapsedIndicator.id = UI_IDS.indicator;
    collapsedIndicator.style.position = "fixed";
    collapsedIndicator.style.bottom = "10px";
    collapsedIndicator.style.right = "15px";
    collapsedIndicator.style.width = "24px";
    collapsedIndicator.style.height = "24px";
    collapsedIndicator.style.backgroundColor = "transparent";
    collapsedIndicator.style.border =
      "1px solid var(--token-border-light, rgba(0, 0, 0, 0.1))";
    collapsedIndicator.style.borderRadius = "50%";
    collapsedIndicator.style.cursor = "pointer";
    collapsedIndicator.style.zIndex = "10000";
    collapsedIndicator.style.display = "flex";
    collapsedIndicator.style.alignItems = "center";
    collapsedIndicator.style.justifyContent = "center";
    collapsedIndicator.style.transition = "all 0.3s ease";

    collapsedIndicator.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#666;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#666;stop-opacity:0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g id="icon-group" filter="url(#glow)" transform="rotate(165, 32, 32)">
          <circle cx="32" cy="32" r="28" fill="url(#gradient)" stroke="#fff" stroke-width="1"/>
          <circle cx="32" cy="32" r="20" fill="none" stroke="#fff" stroke-width="1"
                  stroke-dasharray="80 40" transform="rotate(-90, 32, 32)">
            <animate attributeName="stroke-dashoffset"
                     dur="4s"
                     values="0;120"
                     repeatCount="indefinite"
                     id="outer-ring-anim"/>
          </circle>
          <circle cx="32" cy="32" r="12" fill="none" stroke="#fff" stroke-width="1">
            <animate attributeName="r"
                     dur="2s"
                     values="12;14;12"
                     repeatCount="indefinite"
                     id="middle-ring-anim"/>
          </circle>
          <circle id="center-dot" cx="32" cy="32" r="4" fill="#fff">
            <animate attributeName="r"
                     dur="1s"
                     values="4;5;4"
                     repeatCount="indefinite"
                     id="center-dot-anim"/>
          </circle>
        </g>
      </svg>
    `;
    document.body.appendChild(collapsedIndicator);

    collapsedIndicator.addEventListener("mouseenter", () => {
      displayBox.style.display = "block";
      requestAnimationFrame(() => {
        displayBox.style.opacity = "1";
        displayBox.style.transform = "translateX(0)";
      });
    });

    displayBox.addEventListener("mouseleave", () => {
      displayBox.style.opacity = "0";
      displayBox.style.transform = "translateX(10px)";
      setTimeout(() => {
        displayBox.style.display = "none";
      }, 150);
    });
  }

  function initUI() {
    createUIElements();
    if (!ensureUIElements()) return;

    updateTheme();

    if (!themeObserverStarted) {
      themeObserverStarted = true;
      const observer = new MutationObserver(updateTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    if (!reinjectObserverStarted) {
      reinjectObserverStarted = true;
      const observer = new MutationObserver(() => {
        if (!document.getElementById(UI_IDS.display)) scheduleReinject();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (!monitoringStarted) {
      monitoringStarted = true;
      fetchIPInfo().catch((err) => console.error("ChatGPT Degraded: IP fetch failed:", err));
      fetchChatGPTStatus().catch((err) => console.error("ChatGPT Degraded: Status fetch failed:", err));

      const statusCheckInterval = 60 * 60 * 1000;
      statusCheckTimer = setInterval(
        () => fetchChatGPTStatus().catch((err) => console.error("ChatGPT Degraded: Status check failed:", err)),
        statusCheckInterval,
      );

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== "visible") return;
        if (statusCheckTimer) clearInterval(statusCheckTimer);
        fetchChatGPTStatus().catch((err) => console.error("ChatGPT Degraded: Status fetch failed:", err));
        statusCheckTimer = setInterval(
          () => fetchChatGPTStatus().catch((err) => console.error("ChatGPT Degraded: Status check failed:", err)),
          statusCheckInterval,
        );
      });

      // Cleanup timer on page unload
      window.addEventListener("beforeunload", () => {
        if (statusCheckTimer) {
          clearInterval(statusCheckTimer);
          statusCheckTimer = null;
        }
      });
    }
  }

  if (document.readyState !== "loading") {
    initUI();
  } else {
    document.addEventListener("DOMContentLoaded", initUI);
  }

  function maskIP(ip) {
    if (!ip || ip === "Unknown") return ip;
    if (ip.includes(".")) {
      const parts = ip.split(".");
      if (parts.length === 4) {
        return `${parts[0]}.*.*.${parts[3]}`;
      }
    }
    if (ip.includes(":")) {
      const parts = ip.split(":");
      // Shorten IPv6 to just show first and last part
      if (parts.length > 2) {
        return `${parts[0]}:*:${parts[parts.length - 1]}`;
      }
    }
    return ip;
  }

  async function fetchIPQuality(ip) {
    try {
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: `https://scamalytics.com/ip/${ip}`,
          timeout: 3000,
          onload: (r) =>
            r.status === 200
              ? resolve(r.responseText)
              : reject(new Error(`HTTP ${r.status}`)),
          onerror: reject,
          ontimeout: () => reject(new Error("Request timed out")),
        });
      });
      console.log("fetchIPQuality.response", response);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response, "text/html");
      const scoreElement = doc.querySelector(".score_bar .score");
      const scoreMatch =
        scoreElement?.textContent.match(/Fraud Score:\s*(\d+)/i);
      if (!scoreMatch) {
        return {
          label: "Unknown",
          color: "#aaa",
          tooltip: "Could not determine IP quality",
          score: null,
        };
      }
      const score = parseInt(scoreMatch[1], 10);
      const riskElement = doc.querySelector(".panel_title");
      const riskText = riskElement?.textContent.trim() || "Unknown Risk";
      const panelColor = riskElement?.style.backgroundColor || "#aaa";
      const descriptionElement = doc.querySelector(".panel_body");
      const description = descriptionElement?.textContent.trim() || "";
      const trimmedDescription =
        description.length > 150
          ? `${description.substring(0, 147)}...`
          : description;

      function extractTableValue(header) {
        const row = Array.from(doc.querySelectorAll("th")).find(
          (th) => th.textContent.trim() === header,
        )?.parentElement;
        return row?.querySelector("td")?.textContent.trim() || null;
      }
      function isRiskYes(header) {
        const row = Array.from(doc.querySelectorAll("th")).find(
          (th) => th.textContent.trim() === header,
        )?.parentElement;
        return row?.querySelector(".risk.yes") !== null;
      }
      const details = {
        location: extractTableValue("City") || "Unknown",
        state: extractTableValue("State / Province"),
        country: extractTableValue("Country Name"),
        isp: extractTableValue("ISP Name") || "Unknown",
        organization: extractTableValue("Organization Name"),
        isVPN: isRiskYes("Anonymizing VPN"),
        isTor: isRiskYes("Tor Exit Node"),
        isServer: isRiskYes("Server"),
        isProxy:
          isRiskYes("Public Proxy") ||
          isRiskYes("Web Proxy") ||
          isRiskYes("Proxy"),
      };
      let label, color;
      if (riskText && riskText !== "Unknown Risk") {
        label = riskText;
        color = panelColor !== "#aaa" ? panelColor : getColorForScore(score);
      } else {
        ({ label, color } = getLabelAndColorForScore(score));
      }
      const warnings = [];
      if (details.isVPN) warnings.push("VPN");
      if (details.isTor) warnings.push("Tor");
      if (details.isServer) warnings.push("Server");
      if (details.isProxy) warnings.push("Proxy");
      const location = [details.location, details.state, details.country]
        .filter(Boolean)
        .join(", ");
      const tooltip = [
        "IP Risk Info (Scamlytics):",
        label !== "Unknown" ? `Risk: ${label} (${score}/100)` : "",
        `Location: ${location}`,
        `ISP: ${details.isp}${details.organization ? ` (${details.organization})` : ""}`,
        warnings.length ? `Warnings: ${warnings.join(", ")}` : "",
        trimmedDescription ? `\n${trimmedDescription}` : "",
        "\nClick to view full analysis",
      ]
        .filter(Boolean)
        .join("\n");
      return { label, color, tooltip, score };
    } catch (error) {
      return {
        label: "Unknown",
        color: "#aaa",
        tooltip: "Could not check IP quality",
        score: null,
      };
    }
  }

  function getColorForScore(score) {
    if (score < 25) return "#4CAF50";
    if (score < 50) return "#859F3D";
    if (score < 75) return "#FAB12F";
    return "#e63946";
  }

  function getLabelAndColorForScore(score) {
    if (score < 25)
      return { label: t("riskLevels.veryEasy"), color: "#4CAF50" };
    if (score < 50) return { label: t("riskLevels.easy"), color: "#859F3D" };
    if (score < 75) return { label: t("riskLevels.medium"), color: "#FAB12F" };
    return { label: t("riskLevels.critical"), color: "#e63946" };
  }

  function getIPLogs() {
    try {
      const logs = localStorage.getItem("chatgpt_ip_logs");
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error("Error reading IP logs:", error);
      return [];
    }
  }

  function addIPLog(ip, score, difficulty) {
    const logs = getIPLogs();
    const timestamp = new Date().toISOString();
    const newLog = { timestamp, ip, score, difficulty };
    if (logs.length > 0 && logs[0].ip === ip) {
      logs[0] = newLog;
    } else {
      logs.unshift(newLog);
    }
    const trimmedLogs = logs.slice(0, 10);
    try {
      localStorage.setItem("chatgpt_ip_logs", JSON.stringify(trimmedLogs));
    } catch (error) {
      // localStorage might be full or disabled (privacy mode)
      console.warn("ChatGPT Degraded: Could not save IP log:", error.message);
      // Return in-memory logs anyway so UI still works
    }
    return trimmedLogs;
  }

  function formatIPLogs(logs) {
    return logs
      .map((log) => {
        const date = new Date(log.timestamp);
        // Use direct component formatting - locale-independent
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const formattedDate = `[${year}-${month}-${day} ${hour}:${min}]`;
        const { level: powLevel } = getRiskColorAndLevel(log.difficulty);
        const scoreDisplay =
          log.score !== null && log.score !== undefined ? log.score : "N/A";
        return `${formattedDate} ${log.ip}(${scoreDisplay}), ${log.difficulty || "N/A"}(${powLevel})`;
      })
      .join("\n");
  }

  async function fetchIPInfo() {
    ensureUIElements();
    const fallbackServices = [
      {
        url: "https://chatgpt.com/cdn-cgi/trace",
        parser: (text) => {
          const data = text.split("\n").reduce((obj, line) => {
            const [key, value] = line.split("=");
            if (key && value) obj[key.trim()] = value.trim();
            return obj;
          }, {});
          return {
            ip: data.ip,
            warp: data.warp || "off",
            location: data.loc,
            colo: data.colo,
          };
        },
      },
      {
        url: "https://www.cloudflare.com/cdn-cgi/trace",
        parser: (text) => {
          const data = text.split("\n").reduce((obj, line) => {
            const [key, value] = line.split("=");
            if (key && value) obj[key.trim()] = value.trim();
            return obj;
          }, {});
          return {
            ip: data.ip,
            warp: data.warp || "off",
            location: data.loc,
            colo: data.colo,
          };
        },
      },
      {
        url: "https://ipinfo.io/json",
        parser: (text) => {
          const data = JSON.parse(text);
          return {
            ip: data.ip,
            warp: "off", // ipinfo.io doesn't provide WARP status
            location: data.loc,
            city: data.city,
            country: data.country,
          };
        },
      },
    ];

    let lastError = null;

    for (let i = 0; i < fallbackServices.length; i++) {
      const service = fallbackServices[i];
      try {
        console.log(
          `Attempting to fetch IP info from service ${i + 1}:`,
          service.url,
        );

        const response = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: service.url,
            timeout: 5000,
            onload: (r) => {
              if (r.status === 200) {
                resolve(r.responseText);
              } else {
                reject(new Error(`HTTP ${r.status}: ${r.statusText}`));
              }
            },
            onerror: (err) =>
              reject(
                new Error(`Network error: ${err.message || "Unknown error"}`),
              ),
            ontimeout: () => reject(new Error("Request timed out")),
          });
        });

        console.log(`Service ${i + 1} response:`, response);
        const data = service.parser(response);
        console.log(`Parsed data from service ${i + 1}:`, data);

        if (!data.ip) {
          throw new Error("No IP address found in response");
        }

        await updateIPDisplay(data);
        return; // Success, exit function
      } catch (error) {
        console.error(`Service ${i + 1} failed:`, error.message);
        lastError = error;

        // If not the last service, wait a bit before trying next
        if (i < fallbackServices.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    // All services failed
    console.error("All IP services failed. Last error:", lastError);
    await handleIPFetchFailure(lastError);
  }

  async function updateIPDisplay(data) {
    if (!ensureUIElements()) return;

    const ipElement = document.getElementById("ip-address");
    const warpBadge = document.getElementById("warp-badge");
    const ipQualityElement = document.getElementById("ip-quality");

    if (!ipElement || !warpBadge || !ipQualityElement) {
      scheduleReinject();
      return;
    }

    const maskedIP = maskIP(data.ip);
    const fullIP = data.ip;
    const warpStatus = data.warp || "off";

    ipElement.innerText = maskedIP;
    ipElement.dataset.fullIp = fullIP;

    // Only show WARP badge when active (don't nag users who don't use it)
    if (warpStatus === "on" || warpStatus === "plus") {
      warpBadge.style.display = "inline-flex";
      warpBadge.innerText = warpStatus === "plus" ? "warp+" : "warp";
      warpBadge.dataset.tooltip = t(
        `tooltips.${warpStatus === "plus" ? "warpPlus" : "warp"}`,
      );
      warpBadge.style.backgroundColor =
        "var(--success-color, rgba(16, 163, 127, 0.1))";
      warpBadge.style.color = "var(--success-color, #10a37f)";
    } else {
      warpBadge.style.display = "none";
    }

    // Fetch IP quality
    try {
      const { label, color, tooltip, score } = await fetchIPQuality(fullIP);
      // console.log("IP Quality result:", { label, color, tooltip, score });

      ipElement.style.color = color;
      ipQualityElement.innerText =
        score !== null ? `${label} (${score})` : label;
      ipQualityElement.style.color = color;
      ipQualityElement.dataset.score = score;
      ipQualityElement.dataset.tooltip = tooltip;

      // Update IP logs
      const difficultyElement = document.getElementById("difficulty");
      const currentDifficulty = difficultyElement?.innerText || "N/A";
      const logs = addIPLog(fullIP, score, currentDifficulty);
      const formattedLogs = formatIPLogs(logs);
      const ipContainerTooltip = [
        t("tooltips.ipHistory"),
        formattedLogs,
        "\n---",
        t("tooltips.clickToCopy"),
      ].join("\n");
      ipElement.dataset.tooltip = ipContainerTooltip;

      // Add click handlers
      ipQualityElement.onclick = () =>
        window.open(`https://scamalytics.com/ip/${fullIP}`, "_blank");

      // Remove old handler if exists (stored on element to avoid global pollution)
      if (ipElement[HANDLER_KEY]) {
        ipElement.removeEventListener("click", ipElement[HANDLER_KEY]);
      }
      ipElement[HANDLER_KEY] = async () => {
        try {
          const logs = getIPLogs();
          const formattedHistory = formatIPLogs(logs);
          await navigator.clipboard.writeText(formattedHistory);
          const originalText = ipElement.innerText;
          ipElement.innerText = t("historyCopied");
          setTimeout(() => {
            ipElement.innerText = originalText;
          }, 1000);
        } catch (err) {
          console.error("ChatGPT Degraded: Copy failed:", err);
          const originalText = ipElement.innerText;
          ipElement.innerText = t("copyFailed");
          setTimeout(() => {
            ipElement.innerText = originalText;
          }, 1000);
        }
      };
      ipElement.addEventListener("click", ipElement[HANDLER_KEY]);
    } catch (qualityError) {
      console.error("Failed to fetch IP quality:", qualityError);
      ipQualityElement.innerText = "Quality check failed";
      ipQualityElement.style.color = "#aaa";
      ipQualityElement.dataset.tooltip = `Could not check IP quality: ${qualityError.message}`;
    }
  }

  async function handleIPFetchFailure(error) {
    console.error("ChatGPT Degraded: All IP fetch attempts failed:", error);

    const ipElement = document.getElementById("ip-address");
    const warpBadge = document.getElementById("warp-badge");
    const ipQualityElement = document.getElementById("ip-quality");

    if (ipElement) {
      ipElement.innerText = "Failed";
      ipElement.style.color = "#e63946";
      ipElement.dataset.tooltip = `IP fetch failed: ${error?.message || "Unknown error"}\nTry refreshing the page`;
    }

    if (warpBadge) {
      warpBadge.style.display = "none";
    }

    if (ipQualityElement) {
      ipQualityElement.innerText = "Error";
      ipQualityElement.style.color = "#e63946";
      ipQualityElement.dataset.tooltip =
        "Could not check IP quality due to network error";
    }
  }

  async function fetchChatGPTStatus() {
    try {
      if (typeof GM_xmlhttpRequest === "undefined") {
        throw new Error("GM_xmlhttpRequest not supported");
      }
      if (!ensureUIElements()) return;
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://status.openai.com/api/v2/status.json",
          timeout: 3000,
          ontimeout: () => reject(new Error("Status check timed out")),
          onload: (response) => {
            if (response.status === 200) {
              try {
                const data = JSON.parse(response.responseText);
                const status = data.status;
                const statusDescription =
                  document.getElementById("status-description");
                const statusMonitorItem =
                  statusDescription?.closest(".monitor-item");
                if (!statusDescription || !statusMonitorItem) {
                  scheduleReinject();
                  resolve();
                  return;
                }
                statusMonitorItem.style.display = "block";
                if (status) {
                  const indicator = (status.indicator || "").toLowerCase();
                  const description =
                    status.description || "All Systems Operational";
                  const indicatorColors = {
                    none: "var(--success-color, #10a37f)",
                    minor: "#FAB12F",
                    major: "#FFA500",
                    critical: "#e63946",
                  };
                  if (description === "All Systems Operational") {
                    statusDescription.style.color =
                      "var(--success-color, #10a37f)";
                  } else {
                    statusDescription.style.color =
                      indicatorColors[indicator] || "#aaa";
                  }
                  statusDescription.textContent = description;
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            } else {
              reject(new Error(`HTTP error: ${response.status}`));
            }
          },
          onerror: (err) => reject(err),
        });
      });
    } catch (error) {
      const statusDescription = document.getElementById("status-description");
      const statusMonitorItem = statusDescription?.closest(".monitor-item");
      if (statusMonitorItem) statusMonitorItem.style.display = "none";
    }
  }

  function updateTheme() {
    if (!ensureUIElements()) return;
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark" ||
      document.documentElement.dataset.theme === "dark";
    displayBox.style.backgroundColor = isDark
      ? "var(--surface-primary, rgba(0, 0, 0, 0.8))"
      : "var(--surface-primary, rgba(255, 255, 255, 0.9))";
    displayBox.style.color = isDark
      ? "var(--text-primary, #fff)"
      : "var(--text-primary, #000)";
    displayBox.querySelectorAll(".label").forEach((label) => {
      label.style.color = isDark
        ? "var(--text-secondary, #aaa)"
        : "var(--text-secondary, #666)";
    });
  }
})();
