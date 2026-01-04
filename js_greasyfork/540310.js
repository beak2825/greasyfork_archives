// ==UserScript==
// @name        NODELOC ReadBoost
// @namespace   nodeloc.cc_ReadBoost
// @match       https://nodeloc.cc/t/topic/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.5
// @author      Sunwuyuan
// @description NODELOC ReadBoost是一个NODELOC刷取已读帖量脚本，理论上支持所有Discourse论坛
// @description:zh-TW NODELOC ReadBoost是一個NODELOC刷取已讀帖量腳本，理論上支持所有Discourse論壇
// @description:en NODELOC ReadBoost is a script for NODELOC to boost the number of read posts. It theoretically supports all Discourse forums.
// @downloadURL https://update.greasyfork.org/scripts/540310/NODELOC%20ReadBoost.user.js
// @updateURL https://update.greasyfork.org/scripts/540310/NODELOC%20ReadBoost.meta.js
// ==/UserScript==

const hasAgreed = GM_getValue("hasAgreed", false);
if (!hasAgreed) {
  const userInput = prompt(
    "[ LINUXDO ReadBoost ]\n此程序由 adodo 为 LINUX DO 社区开发，你可以在 https://linux.do/t/topic/283062 了解（设置页面包含链接）。\n[ LINUXDO ReadBoost ]\n此程序由 Sunwuyuan 移植，你可以在 https://github.com/Sunwuyuan/NODELOC_ReadBoost 查看（设置页面包含链接）。\n[ NODELOC ReadBoost ]\n检测到这是你第一次使用NODELOC ReadBoost，使用前你必须知晓：使用该第三方脚本可能会导致包括并不限于账号被限制、被封禁的潜在风险，脚本不对出现的任何风险负责，这是一个开源脚本，你可以自由审核其中的内容，如果你同意以上内容，请输入“明白”"
  );
  if (userInput !== "明白") {
    alert("您未同意风险提示，脚本已停止运行。");
    throw new Error("未同意风险提示");
  }

  GM_setValue("hasAgreed", true);
}

// 初始化

const headerButtons = document.querySelector(".header-buttons");
const topicID = window.location.pathname.split("/")[3];
const repliesInfo = document
  .querySelector("div[class=timeline-replies]")
  .textContent.trim();
const [currentPosition, totalReplies] = repliesInfo
  .split("/")
  .map((part) => parseInt(part.trim(), 10));
const csrfToken = document
  .querySelector("meta[name=csrf-token]")
  .getAttribute("content");

console.log("NODELOC ReadBoost 已加载");
console.log(`帖子ID：${topicID}`);
console.log(`当前位置：${currentPosition}`);
console.log(`总回复：${totalReplies}`);

// 默认参数
const DEFAULT_CONFIG = {
  baseDelay: 2500,
  randomDelayRange: 800,
  minReqSize: 8,
  maxReqSize: 20,
  minReadTime: 800,
  maxReadTime: 3000,
  autoStart: true,
};
let config = { ...DEFAULT_CONFIG, ...getStoredConfig() };

// 设置按钮和状态UI
const settingsButton = createButton("设置", "settingsButton", "btn-icon-text");
const statusLabel = createStatusLabel("NODELOC ReadBoost待命中");

headerButtons.appendChild(statusLabel);
headerButtons.appendChild(settingsButton);
// 绑定设置按钮事件
settingsButton.addEventListener("click", showSettingsUI);

// 自启动处理
if (config.autoStart) {
  startReading(topicID, totalReplies);
}

function getStoredConfig() {
  return {
    baseDelay: GM_getValue("baseDelay", DEFAULT_CONFIG.baseDelay),
    randomDelayRange: GM_getValue(
      "randomDelayRange",
      DEFAULT_CONFIG.randomDelayRange
    ),
    minReqSize: GM_getValue("minReqSize", DEFAULT_CONFIG.minReqSize),
    maxReqSize: GM_getValue("maxReqSize", DEFAULT_CONFIG.maxReqSize),
    minReadTime: GM_getValue("minReadTime", DEFAULT_CONFIG.minReadTime),
    maxReadTime: GM_getValue("maxReadTime", DEFAULT_CONFIG.maxReadTime),
    autoStart: GM_getValue("autoStart", DEFAULT_CONFIG.autoStart),
  };
}

/**
 * 按钮封装
 */
function createButton(label, id, extraClass = "") {
  const outerSpan = document.createElement("span");
  outerSpan.className = "auth-buttons";

  const button = document.createElement("button");
  button.className = `btn btn-small ${extraClass}`;
  button.id = id;

  const span = document.createElement("span");
  span.className = "d-button-label";
  span.textContent = label;

  button.appendChild(span);
  outerSpan.appendChild(button);

  return outerSpan;
}

/**
 * 状态标签封装
 */
function createStatusLabel(initialText) {
  const labelSpan = document.createElement("span");
  labelSpan.id = "statusLabel";
  labelSpan.style.marginLeft = "10px";
  labelSpan.style.marginRight = "10px";

  labelSpan.textContent = initialText;
  return labelSpan;
}

/**
 * 更新状态标签内容
 */
function updateStatus(text, color = "#555") {
  const statusLabel = document.getElementById("statusLabel");
  if (statusLabel) {
    statusLabel.textContent = text;
    statusLabel.style.color = color;
  }
}

/**
 * 显示设置UI界面
 */
function showSettingsUI() {
  const settingsDiv = document.createElement("div");
  settingsDiv.style.position = "fixed";
  settingsDiv.style.top = "50%";
  settingsDiv.style.left = "50%";
  settingsDiv.style.transform = "translate(-50%, -50%)";
  settingsDiv.style.padding = "20px";
  settingsDiv.style.border = "1px solid #ccc";
  settingsDiv.style.borderRadius = "10px";
  settingsDiv.style.zIndex = "1000";
  settingsDiv.style.backgroundColor = "var(--secondary)";
  settingsDiv.style.color = "var(--primary)";
  settingsDiv.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.3)";

  const autoStartChecked = config.autoStart ? "checked" : "";
  const settingsHtml = `
     <h3>设置参数</h3>
      <label>基础延迟(ms): <input id="baseDelay" type="number" value="${config.baseDelay}"></label><br>
    <label>随机延迟范围(ms): <input id="randomDelayRange" type="number" value="${config.randomDelayRange}"></label><br>
    <label>最小每次请求阅读量: <input id="minReqSize" type="number" value="${config.minReqSize}"></label><br>
    <label>最大每次请求阅读量: <input id="maxReqSize" type="number" value="${config.maxReqSize}"></label><br>
    <label>最小阅读时间(ms): <input id="minReadTime" type="number" value="${config.minReadTime}"></label><br>
    <label>最大阅读时间(ms): <input id="maxReadTime" type="number" value="${config.maxReadTime}"></label><br>
    <label><input type="checkbox" id="advancedMode"> 高级设置（解锁参数选项）</label><br>
    <label><input type="checkbox" id="autoStart" ${autoStartChecked}> 自动运行</label><br><br>
      <button class="btn btn-small" onclick="window.open('https://github.com/Sunwuyuan/NODELOC_ReadBoost', '_blank')">
        <span class="d-button-label">开源于 GitHub</span>
    </button>
    <button class="btn btn-small" onclick="window.open('https://linux.do/t/topic/283062', '_blank')">
        <span class="d-button-label">原作者帖子</span>
    </button>
    <br><br>
    <button class="btn btn-small" id="startManually" >
        <span class="d-button-label">手动开始</span>
    </button>
    <button class="btn btn-small" id="saveSettings" >
        <span class="d-button-label">保存</span>
    </button>
    <button class="btn btn-small" id="closeSettings">
        <span class="d-button-label">关闭</span>
    </button>
    <button class="btn btn-small" id="resetDefaults">
        <span class="d-button-label">恢复默认值</span>
    </button>

`;

  settingsDiv.innerHTML = settingsHtml;

  document.body.appendChild(settingsDiv);

  // 手动开始按钮
  document.getElementById("startManually").addEventListener("click", () => {
    settingsDiv.remove();
    startReading(topicID, totalReplies);
  });

  // 保存设置
  document.getElementById("saveSettings").addEventListener("click", () => {
    config.baseDelay = parseInt(document.getElementById("baseDelay").value, 10);
    config.randomDelayRange = parseInt(
      document.getElementById("randomDelayRange").value,
      10
    );
    config.minReqSize = parseInt(
      document.getElementById("minReqSize").value,
      10
    );
    config.maxReqSize = parseInt(
      document.getElementById("maxReqSize").value,
      10
    );
    config.minReadTime = parseInt(
      document.getElementById("minReadTime").value,
      10
    );
    config.maxReadTime = parseInt(
      document.getElementById("maxReadTime").value,
      10
    );
    config.autoStart = document.getElementById("autoStart").checked;

    // 持久化保存设置
    GM_setValue("baseDelay", config.baseDelay);
    GM_setValue("randomDelayRange", config.randomDelayRange);
    GM_setValue("minReqSize", config.minReqSize);
    GM_setValue("maxReqSize", config.maxReqSize);
    GM_setValue("minReadTime", config.minReadTime);
    GM_setValue("maxReadTime", config.maxReadTime);
    GM_setValue("autoStart", config.autoStart);

    alert("设置已保存！");
    location.reload();
  });
  document.getElementById("resetDefaults").addEventListener("click", () => {
    // 重置为默认配置
    config = { ...DEFAULT_CONFIG };

    // 保存默认配置到存储
    GM_setValue("baseDelay", DEFAULT_CONFIG.baseDelay);
    GM_setValue("randomDelayRange", DEFAULT_CONFIG.randomDelayRange);
    GM_setValue("minReqSize", DEFAULT_CONFIG.minReqSize);
    GM_setValue("maxReqSize", DEFAULT_CONFIG.maxReqSize);
    GM_setValue("minReadTime", DEFAULT_CONFIG.minReadTime);
    GM_setValue("maxReadTime", DEFAULT_CONFIG.maxReadTime);
    GM_setValue("autoStart", DEFAULT_CONFIG.autoStart);

    alert("已恢复默认设置！");
    location.reload();
  });

  /**
   * 切换输入框状态，在默认状态下禁用
   */
  function toggleSettingsInputs(enabled) {
    const inputs = [
      "baseDelay",
      "randomDelayRange",
      "minReqSize",
      "maxReqSize",
      "minReadTime",
      "maxReadTime",
    ];

    inputs.forEach((inputId) => {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.disabled = !enabled;
      }
    });
  }

  toggleSettingsInputs(false);

  // 启用高级设置告警弹窗
  document
    .getElementById("advancedMode")
    .addEventListener("change", (event) => {
      if (event.target.checked) {
        const userInput = prompt(
          "[ NODELOC ReadBoost ]\n如果你不知道你在修改什么，那么不建议开启高级设置，随意修改可能会提高脚本崩溃、账号被禁等风险的可能！请输入 '明白' 确认继续开启高级设置："
        );

        if (userInput !== "明白") {
          alert("您未确认风险，高级设置未启用。");
          event.target.checked = false;
          return;
        }

        // 启用所有输入框
        toggleSettingsInputs(true);
      } else {
        // 禁用所有输入框
        toggleSettingsInputs(false);
      }
    });

  // 关闭设置UI
  document.getElementById("closeSettings").addEventListener("click", () => {
    settingsDiv.remove();
  });
}

/**
 * 开始刷取已读帖子
 * @param {string} topicId 主题ID
 * @param {number} totalReplies 总回复数
 */
async function startReading(topicId, totalReplies) {
  console.log("启动阅读处理...");

  const baseRequestDelay = config.baseDelay;
  const randomDelayRange = config.randomDelayRange;
  const minBatchReplyCount = config.minReqSize;
  const maxBatchReplyCount = config.maxReqSize;
  const minReadTime = config.minReadTime;
  const maxReadTime = config.maxReadTime;

  // 随机数生成
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 发起读帖请求
  async function sendBatch(startId, endId, retryCount = 3) {
    const params = createBatchParams(startId, endId);
    try {
      const response = await fetch("https://nodeloc.cc/topics/timings", {
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "discourse-background": "true",
          "discourse-logged-in": "true",
          "discourse-present": "true",
          priority: "u=1, i",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": csrfToken,
          "x-requested-with": "XMLHttpRequest",
          "x-silence-logger": "true",
        },
        referrer: `https://nodeloc.cc/`,
        body: params.toString(),
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP请求失败，状态码：${response.status}`);
      }
      console.log(`成功处理回复 ${startId} - ${endId}`);
      updateStatus(`成功处理回复 ${startId} - ${endId}`, "green");
    } catch (e) {
      console.error(`处理回复 ${startId} - ${endId} 失败: `, e);

      if (retryCount > 0) {
        console.log(
          `重试处理回复 ${startId} - ${endId}，剩余重试次数：${retryCount}`
        );
        updateStatus(
          `重试处理回复 ${startId} - ${endId}，剩余重试次数：${retryCount}`,
          "orange"
        );

        // 等待一段时间再重试
        const retryDelay = 2000; // 重试间隔时间（毫秒）
        await new Promise((r) => setTimeout(r, retryDelay));
        await sendBatch(startId, endId, retryCount - 1);
      } else {
        console.error(`处理回复 ${startId} - ${endId} 失败，自动跳过`);
        updateStatus(`处理回复 ${startId} - ${endId} ，自动跳过`, "red");
      }
    }
    const delay = baseRequestDelay + getRandomInt(0, randomDelayRange);
    await new Promise((r) => setTimeout(r, delay));
  }

  // 生成请求body参数
  function createBatchParams(startId, endId) {
    const params = new URLSearchParams();

    for (let i = startId; i <= endId; i++) {
      params.append(
        `timings[${i}]`,
        getRandomInt(minReadTime, maxReadTime).toString()
      );
    }
    const topicTime = getRandomInt(
      minReadTime * (endId - startId + 1),
      maxReadTime * (endId - startId + 1)
    ).toString();
    params.append("topic_time", topicTime);
    params.append("topic_id", topicId);
    return params;
  }

  // 批量阅读处理
  for (let i = 1; i <= totalReplies; ) {
    const batchSize = getRandomInt(minBatchReplyCount, maxBatchReplyCount);
    const startId = i;
    const endId = Math.min(i + batchSize - 1, totalReplies);

    await sendBatch(startId, endId);
    i = endId + 1;
  }
  updateStatus(`所有回复处理完成`, "green");
  console.log("所有回复处理完成");
}
