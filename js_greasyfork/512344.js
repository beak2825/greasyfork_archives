// ==UserScript==
// @name         Text2Speech
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Read selected text using OpenAI TTS API
// @author       snaily, Ethan
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/512344/Text2Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/512344/Text2Speech.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 创建按钮
  const button = document.createElement("button");
  button.innerText = "TTS";
  button.style.position = "absolute";
  button.style.width = "auto";
  button.style.zIndex = "1000";
  button.style.display = "none"; // 初始隐藏
  button.style.backgroundColor = "#007BFF"; // 蓝色背景
  button.style.color = "#FFFFFF"; // 白色文字
  button.style.border = "none";
  button.style.borderRadius = "3px"; // 调整圆角
  button.style.padding = "5px 10px"; // 减少内边距
  button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  button.style.cursor = "pointer";
  button.style.fontSize = "12px";
  button.style.fontFamily = "Arial, sans-serif";
  document.body.appendChild(button);

  // 获取选中的文本
  function getSelectedText() {
    let text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    console.log("Selected Text:", text); // 调试用
    return text;
  }

  // 判断文本是否为有效内容 (非空白)
  function isTextValid(text) {
    return text.trim().length > 0;
  }

  // 调用 OpenAI TTS API
  function callOpenAITTS(text, voice, model) {
    const cachedAudioUrl = getCachedAudio(text);
    if (cachedAudioUrl) {
      console.log("使用缓存的音频");
      playAudio(cachedAudioUrl);
      resetButton();
      return;
    }

    const baseUrl = "https://api.520521.best";
    const apiKey = "sk-VYgaBMlQ0SQ8FYfhCa174792Bf4e456c84744e171935F024";
    const url = `${baseUrl}/v1/audio/speech`;
    console.log("调用 OpenAI TTS API，文本：", text);
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      data: JSON.stringify({
        model: model,
        input: text,
        voice: voice,
      }),
      responseType: "arraybuffer",
      onload: function (response) {
        if (response.status === 200) {
          console.log("API 调用成功"); // 调试用
          const audioBlob = new Blob([response.response], {
            type: "audio/mpeg",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          playAudio(audioUrl);
          cacheAudio(text, audioUrl);
        } else {
          console.error("错误：", response.statusText);
          showCustomAlert(
            `TTS API 错误：${response.status} ${response.statusText}`
          );
        }
        // 请求完成后重置按钮
        resetButton();
      },
      onerror: function (error) {
        console.error("请求失败", error);
        showCustomAlert("TTS API 请求失败。");
        // 请求失败后重置按钮
        resetButton();
      },
    });
  }

  // 播放音频
  function playAudio(url) {
    const audio = new Audio(url);
    audio.play();
  }

  // 使用浏览器内建 TTS
  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  // 设置按钮为加载状态
  function setLoadingState() {
    button.disabled = true;
    button.innerText = "Loading";
    button.style.backgroundColor = "#6c757d"; // 灰色背景
    button.style.cursor = "not-allowed";
  }

  // 重置按钮到原始状态
  function resetButton() {
    button.disabled = false;
    button.innerText = "TTS";
    button.style.backgroundColor = "#007BFF"; // 蓝色背景
    button.style.cursor = "pointer";
  }

  // 获取缓存的音频 URL
  function getCachedAudio(text) {
    const cache = GM_getValue("cache", {});
    const item = cache[text];
    if (item) {
      const now = new Date().getTime();
      const weekInMillis = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数
      if (now - item.timestamp < weekInMillis) {
        return item.audioUrl;
      } else {
        delete cache[text]; // 删除过期的缓存
        GM_setValue("cache", cache);
      }
    }
    return null;
  }

  // 缓存音频 URL
  function cacheAudio(text, audioUrl) {
    const cache = GM_getValue("cache", {});
    cache[text] = {
      audioUrl: audioUrl,
      timestamp: new Date().getTime(),
    };
    GM_setValue("cache", cache);
  }

  // 清除缓存
  function clearCache() {
    GM_setValue("cache", {});
    showCustomAlert("缓存已成功清除。");
  }

  // 按钮点击事件
  button.addEventListener("click", (event) => {
    event.stopPropagation(); // 防止点击按钮时触发全局点击事件
    const selectedText = getSelectedText();
    if (selectedText && isTextValid(selectedText)) {
      // 添加有效性检查
      let model = GM_getValue("model", "tts-audio-fish");
      let voice = GM_getValue("voice", "738d0cc1a3e9430a9de2b544a466a7fc");
      setLoadingState(); // 设置按钮为加载状态
      if (window.location.hostname === "github.com") {
        speakText(selectedText);
        resetButton(); // 使用内建 TTS 后立即重置按钮
      } else {
        callOpenAITTS(selectedText, voice, model);
      }
    } else {
      showCustomAlert("请选择一些有效的文本以朗读。");
    }
  });

  // 在选中文本附近显示按钮
  document.addEventListener("mouseup", (event) => {
    // 设置一个短暂的延迟，确保选区状态已更新
    setTimeout(() => {
      // 检查 mouseup 事件是否由按钮本身触发
      if (event.target === button) {
        return;
      }

      const selectedText = getSelectedText();
      if (selectedText && isTextValid(selectedText)) {
        // 添加有效性检查
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        button.style.left = `${mouseX + 30}px`; // 调整按钮位置
        button.style.top = `${mouseY - 10}px`;
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
    }, 10); // 10毫秒延迟
  });

  // 监听点击页面其他部分以隐藏按钮
  document.addEventListener("click", (event) => {
    if (event.target !== button) {
      const selectedText = getSelectedText();
      if (!selectedText || !isTextValid(selectedText)) {
        button.style.display = "none";
      }
    }
  });

  // 初始化配置模态框
  function initModal() {
    const modalHTML = `
        <div id="configModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 10000;">
            <div style="background: white; padding: 30px; border-radius: 15px; width: 350px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="margin-top: 0; margin-bottom: 20px; color: #333; font-size: 24px; text-align: center;">TTS 设置</h2>
                <div style="margin-bottom: 20px;">
                    <label for="model" style="display: block; margin-bottom: 5px; color: #555; font-weight: bold;">模型:</label>
                    <select id="model" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; color: #333;">
                        <option value="tts-1">tts-1</option>
                        <option value="tts-1-hd">tts-1-hd</option>
                        <option value="tts-audio-fish">tts-audio-fish</option>
                    </select>
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="voice" style="display: block; margin-bottom: 5px; color: #555; font-weight: bold;">语音:</label>
                    <select id="voice" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; color: #333;">
                        <option value="alloy">Alloy</option>
                        <option value="echo">Echo</option>
                        <option value="fable">Fable</option>
                        <option value="onyx">Onyx</option>
                        <option value="nova">Nova</option>
                        <option value="shimmer">Shimmer</option>
                    </select>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button id="saveConfig" style="flex: 1; margin-right: 10px; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s;">保存</button>
                    <button id="cancelConfig" style="flex: 1; padding: 10px; background-color: #f44336; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s;">取消</button>
                </div>
            </div>
        </div>
      `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.getElementById("saveConfig").addEventListener("click", saveConfig);
    document
      .getElementById("cancelConfig")
      .addEventListener("click", closeModal);
    document
      .getElementById("model")
      .addEventListener("change", updateVoiceOptions);

    // Add hover effects
    const buttons = document.querySelectorAll("#configModal button");
    buttons.forEach((button) => {
      button.addEventListener("mouseover", function () {
        this.style.opacity = "0.8";
      });
      button.addEventListener("mouseout", function () {
        this.style.opacity = "1";
      });
    });
  }

  // 根据选择的模型更新语音选项
  function updateVoiceOptions() {
    const modelSelect = document.getElementById("model");
    const voiceSelect = document.getElementById("voice");

    if (modelSelect.value === "tts-1" || modelSelect.value === "tts-1-hd") {
      voiceSelect.innerHTML = `
              <option value="alloy">Alloy</option>
              <option value="echo">Echo</option>
              <option value="fable">Fable</option>
              <option value="onyx">Onyx</option>
              <option value="nova">Nova</option>
              <option value="shimmer">Shimmer</option>
          `;
    } else {
      // tts-audio-fish options
      voiceSelect.innerHTML = `
              <option value="738d0cc1a3e9430a9de2b544a466a7fc">雷军</option>
              <option value="54a5170264694bfc8e9ad98df7bd89c3">丁真</option>
              <option value="7f92f8afb8ec43bf81429cc1c9199cb1">AD学姐</option>
              <option value="0eb38bc974e1459facca38b359e13511">赛马娘</option>
              <option value="e4642e5edccd4d9ab61a69e82d4f8a14">蔡徐坤</option>
              <option value="332941d1360c48949f1b4e0cabf912cd">丁真（锐刻五代版）</option>
              <option value="f7561ff309bd4040a59f1e600f4f4338">黑手</option>
              <option value="e80ea225770f42f79d50aa98be3cedfc">孙笑川258</option>
              <option value="1aacaeb1b840436391b835fd5513f4c4">芙宁娜</option>
              <option value="59cb5986671546eaa6ca8ae6f29f6d22">央视配音</option>
              <option value="3b55b3d84d2f453a98d8ca9bb24182d6">邓紫琪</option>
              <option value="e1cfccf59a1c4492b5f51c7c62a8abd2">永雏塔菲</option>
              <option value="7af4d620be1c4c6686132f21940d51c5">东雪莲</option>
              <option value="7c66db6e457c4d53b1fe428a8c547953">郭德纲</option>
              <option value="e488ebeadd83496b97a3cd472dcd04ab">爱丽丝（中配）</option>
              <option value="b1ce0a88c79f4e3180217a7fe2c72969">飞凡高启强</option>
              <option value="57a14f36492d4d0eb207b9fe9d335f95">国恒</option>
              <option value="787159b6d13542afbaff4f933689bab6">伯邑考</option>
              <option value="f4913edba8844da9827c28210ff5f884">机智张</option>
              <option value="c1fc72257200410587a557758b320700">彭海兵</option>
              <option value="8a112f7f56694daaa3c7a55c08f6e5a0">申公豹</option>
              <option value="af450a74e5f94095bbf009e2c7b6b0e7">赵德汉</option>
              <option value="b1602dc301a84093aabe97da41e59ee7">神魔暗信</option>
              <option value="de5e904b61214ed5bad3e4757cd5aed9">诸葛</option>
          `;
    }
  }

  // 保存配置
  function saveConfig() {
    const model = document.getElementById("model").value;
    const voice = document.getElementById("voice").value;

    GM_setValue("model", model);
    GM_setValue("voice", voice);
    showCustomAlert("设置已成功保存。");
    closeModal();
  }

  // 关闭模态框
  function closeModal() {
    const modal = document.getElementById("configModal");
    if (modal) {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  }

  // 打开模态框
  function openModal() {
    if (!document.getElementById("configModal")) {
      initModal();
    }
    const modal = document.getElementById("configModal");
    modal.style.display = "flex";
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.opacity = "1";
      modal.style.transition = "opacity 0.3s ease-in-out";
    }, 10);

    // 设置当前值
    document.getElementById("model").value = GM_getValue("model", "tts-1");
    updateVoiceOptions(); // 根据模型更新语音选项
    document.getElementById("voice").value = GM_getValue("voice", "onyx");
  }

  // 创建自定义弹窗
  function createCustomAlert() {
    const alertBox = document.createElement("div");
    alertBox.id = "customAlertBox";
    alertBox.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 2147483647; // 使用最高的 z-index 值
      display: none;
      color: #333; // 设置默认文字颜色
      font-family: Arial, sans-serif; // 设置字体
      max-width: 80%;
      width: 300px;
      text-align: center;
    `;

    const message = document.createElement("p");
    message.id = "alertMessage";
    message.style.cssText = `
      margin-bottom: 15px;
      color: #333; // 确保消息文本颜色
      word-wrap: break-word;
    `;

    const closeButton = document.createElement("button");
    closeButton.textContent = "确定";
    closeButton.style.cssText = `
      padding: 5px 10px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-family: inherit; // 继承父元素的字体
    `;
    closeButton.onclick = () => {
      alertBox.style.opacity = "0";
      setTimeout(() => (alertBox.style.display = "none"), 300);
    };

    alertBox.appendChild(message);
    alertBox.appendChild(closeButton);
    document.body.appendChild(alertBox);
    // 添加淡入淡出效果
    alertBox.style.transition = "opacity 0.3s ease-in-out";
  }

  // 显示自定义弹窗
  function showCustomAlert(text) {
    const alertBox =
      document.getElementById("customAlertBox") || createCustomAlert();
    document.getElementById("alertMessage").textContent = text;
    alertBox.style.display = "block";
    alertBox.style.opacity = "0";
    setTimeout(() => (alertBox.style.opacity = "1"), 10); // 短暂延迟以确保过渡效果生效
  }

  // 注册菜单命令以打开配置
  GM_registerMenuCommand("配置 TTS 设置", openModal);

  // 注册菜单命令以清除缓存
  GM_registerMenuCommand("清除 TTS 缓存", clearCache);
})();
