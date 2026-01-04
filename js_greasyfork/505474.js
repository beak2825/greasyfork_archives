// ==UserScript==
// @name         帖子类型判断器
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  判断主题帖子类型，并盖上印章
// @match        https://linux.do/t/topic/*
// @author       https://linux.do/u/snaily
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505474/%E5%B8%96%E5%AD%90%E7%B1%BB%E5%9E%8B%E5%88%A4%E6%96%AD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/505474/%E5%B8%96%E5%AD%90%E7%B1%BB%E5%9E%8B%E5%88%A4%E6%96%AD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 添加样式
  GM_addStyle(`
       .post-type-seal {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 100;
            width: 80px;
            height: 80px;
            border: solid 3px #B4B4B4;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.5s ease;
        }
        .post-type-seal-inner {
            width: 72px;
            height: 72px;
            border: solid 1px #B4B4B4;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.8);
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transform: rotate(-45deg);
        }
        .post-type-seal-text {
            font-size: 18px;
            font-weight: 900;
            text-align: center;
            line-height: 1;
            margin-bottom: 5px;
        }
        .post-type-seal-date {
            font-size: 10px;
            text-align: center;
            line-height: 1;
        }
        .technical .post-type-seal-text, .technical .post-type-seal-date {
            color: #4CAF50;
        }
        .non-technical .post-type-seal-text, .non-technical .post-type-seal-date {
            color: #F44336;
        }
        #topic-title {
            position: relative;
        }
        .post-type-label.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        .post-type-label.hide {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        #classify-button, #config-button {
            position: fixed;
            right: -150px;
            padding: 10px 15px;
            border-radius: 30px;
            color: white;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s ease;
            border: none;
            outline: none;
            font-size: 14px;
        }
        #classify-button {
            top: 70px;
            background-color: #2196F3;
        }
        #classify-button:hover {
            background-color: #1976D2;
        }
        #config-button {
            top: 120px;
            background-color: #FF9800;
        }
        #config-button:hover {
            background-color: #F57C00;
        }
        #buttons-container {
            position: fixed;
            top: 0;
            right: 0;
            width: 170px;
            height: 100%;
            z-index: 9998;
        }
        #buttons-container:hover #classify-button,
        #buttons-container:hover #config-button {
            right: 20px;
        }

        /* 配置面板样式 */
    #config-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 10000;
        display: none;
    }
    #config-panel h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #333;
    }
    #config-panel input {
        display: block;
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    #config-panel button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
    }
    #config-panel button:hover {
        background-color: #45a049;
    }
    `);

  // 获取配置
  function getConfig() {
    return {
      apiKey: GM_getValue("apiKey", "notset"),
      baseUrl: GM_getValue("baseUrl", "https://api.openai.com"),
      model: GM_getValue("model", "gpt-4o"),
    };
  }

  // 保存配置
  function saveConfig(config) {
    GM_setValue("apiKey", config.apiKey);
    GM_setValue("baseUrl", config.baseUrl);
    GM_setValue("model", config.model);
  }

  function getTopicUrl(url) {
    const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
    const match = url.match(regex);
    return match ? match[1] : url;
  }

  // 获取帖子内容
  async function getPostContent() {
    let topicUrl = getTopicUrl(window.location.href);
    const response = await fetch(topicUrl + "/1.json", {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9",
        "x-requested-with": "XMLHttpRequest",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch post content");
    }
    const data = await response.json();
    const str = data.post_stream.posts[0].cooked;
    return str;
  }

  // 使用GPT判断帖子类型
  async function classifyPost(postContent) {
    const config = getConfig();
    const prompt = `
    Based on the following post content, determine which category it belongs to and provide the most suitable tag and reasoning:

    Post content:
    ${postContent}

    Possible classifications include:
    常规话题、读书成诗、配置调优、网络安全、软件分享、软件开发、文档、代码审查、一机难求、网络记忆、扬帆起航、非我莫属、全球工单、赏金猎人、搞七捻三、运营反馈

    Possible tags include, but are not limited to:技术贴、水贴、资源帖、调优贴、求助贴、分享贴、讨论贴etc.

    Please strictly adhere to the JSON format in your response, ensuring it includes the fields "category," "label," and "reason." The final returned result should be: {"category":"xxx","label":"xxx","reason":"xxx"}. Do not add any extra text or explanations, and do not include code block delimiters before or after the JSON string.

    Explanation of Forum Categories:
    - 常规话题：不属于其他类别的话题
    - 读书成诗：读书相关话题
    - 配置调优：服务器系统、软件、硬件配置调优
    - 网络安全：网络安全相关话题
    - 软件分享：分享软件及使用心得
    - 软件开发：软件开发相关话题
    - 文档：各种文档和资料
    - 代码审查：GitHub PR代码审查
    - 一机难求：服务器、网络供求信息
    - 网络记忆：高质量RSS订阅
    - 扬帆起航：个人成长相关
    - 非我莫属：招聘/求职信息
    - 全球工单：问题反馈
    - 赏金猎人：悬赏任务
    - 搞七捻三：闲聊吹水
    - 运营反馈：站点相关讨论

    Please respond strictly in JSON format, and ensure that the response includes the fields "category," "label," and "reason." The final return should be in the form: {"category":"xxx","label":"xxx","reason":"xxx"} without any code block delimiters before or after the JSON string,reason,please respond in Chinese
    `;

    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    let content = data.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch (error) {
      if (content.includes("```json")) {
        // 使用正则表达式提取JSON字符串
        const jsonMatch = content.match(
          /[\s\S]*?```json\n([\s\S]*?)\n```[\s\S]*?/
        );

        if (jsonMatch && jsonMatch[1]) {
          const jsonString = jsonMatch[1];
          console.log(jsonString);

          const jsonObject = JSON.parse(jsonString);
          return jsonObject;
        } else {
          console.log("未找到JSON字符串");
        }
      }
    }

    //return JSON.parse(data.choices[0].message.content);
  }

  // 显示配置面板
  function showConfigPanel() {
    const config = getConfig();
    let panel = document.getElementById("config-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "config-panel";
      panel.innerHTML = `
            <h3>配置</h3>
            <input type="text" id="api-key" placeholder="API Key" value="${config.apiKey}">
            <input type="text" id="base-url" placeholder="Base URL" value="${config.baseUrl}">
            <input type="text" id="model" placeholder="Model" value="${config.model}">
            <button id="save-config">保存</button>
        `;
      document.body.appendChild(panel);

      document.getElementById("save-config").addEventListener("click", () => {
        const newConfig = {
          apiKey: document.getElementById("api-key").value,
          baseUrl: document.getElementById("base-url").value,
          model: document.getElementById("model").value,
        };
        saveConfig(newConfig);
        panel.style.display = "none";
      });
    }
    panel.style.display = "block";
  }

  // 主函数
  async function main() {
    try {
      const postData = await getPostContent();
      const postContent = postData.post_stream.posts[0].cooked;

      const classification = await classifyPost(postContent);

      // 创建或更新印章元素
      let seal = document.querySelector(".post-type-seal");
      if (!seal) {
        seal = document.createElement("div");
        seal.className = "post-type-seal";
        seal.innerHTML = `
                <div class="post-type-seal-inner">
                    <span class="post-type-seal-category"></span>
                    <span class="post-type-seal-text"></span>
                    <span class="post-type-seal-date"></span>
                </div>
            `;
        const topicTitle = document.querySelector("#topic-title > div");
        if (topicTitle) {
          topicTitle.style.position = "relative";
          topicTitle.appendChild(seal);
        }
      }

      seal.className = `post-type-seal ${classification.label.replace(
        /贴|帖/,
        ""
      )}`;
      seal.querySelector(".post-type-seal-category").textContent =
        classification.category;
      seal.querySelector(".post-type-seal-text").textContent =
        classification.label;
      seal.querySelector(".post-type-seal-date").textContent =
        new Date().toLocaleDateString();
      seal.title = `分类：${classification.category}\n标签：${classification.label}\n理由：${classification.reason}`;

      // 添加淡入效果
      seal.style.opacity = "0";
      setTimeout(() => {
        seal.style.opacity = "1";
      }, 100);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 初始化函数
  function init() {
    setupUrlChangeListener();
    checkCurrentUrl();
  }

  // 设置 URL 变化监听器
  function setupUrlChangeListener() {
    let lastUrl = location.href;

    // 重写 history 方法
    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      checkCurrentUrl();
    };

    const replaceState = history.replaceState;
    history.replaceState = function () {
      replaceState.apply(history, arguments);
      checkCurrentUrl();
    };

    // 监听 popstate 事件
    window.addEventListener("popstate", function () {
      checkCurrentUrl();
    });

    // 定期检查 URL 变化（作为后备方案）
    setInterval(function () {
      if (lastUrl !== location.href) {
        lastUrl = location.href;
        checkCurrentUrl();
      }
    }, 1000);
  }

  // 检查当前 URL 并相应地显示或隐藏按钮
  function checkCurrentUrl() {
    if (checkUrl(window.location.href)) {
      createButtons();
    } else {
      removeButtons();
    }
  }

  // 检查URL是否匹配
  function checkUrl(url) {
    return url.startsWith("https://linux.do/t/topic/");
  }

  // 创建按钮和容器
  function createButtons() {
    if (document.getElementById("buttons-container")) return; // 如果按钮已存在，不重复创建

    const buttonsContainer = document.createElement("div");
    buttonsContainer.id = "buttons-container";
    document.body.appendChild(buttonsContainer);

    const classifyButton = document.createElement("button");
    classifyButton.id = "classify-button";
    classifyButton.textContent = "判断帖子类型";
    classifyButton.addEventListener("click", main);
    buttonsContainer.appendChild(classifyButton);

    const configButton = document.createElement("button");
    configButton.id = "config-button";
    configButton.textContent = "配置";
    configButton.addEventListener("click", showConfigPanel);
    buttonsContainer.appendChild(configButton);
  }

  // 移除按钮
  function removeButtons() {
    const buttonsContainer = document.getElementById("buttons-container");
    if (buttonsContainer) {
      buttonsContainer.remove();
    }
  }

  // 在页面加载完成后运行初始化函数
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
