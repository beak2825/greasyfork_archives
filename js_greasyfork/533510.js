// ==UserScript==
// @name         chd刷课（chd）
// @namespace    http://tampermonkey.net/
// @version      42914
// @description  解决自动播放被阻止问题，确保视频持续播放，60分钟自动刷新，拦截弹窗，自动完成所有课程。本地记录
// @author       chd
// @match        *.hnsydwpx.cn/*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      192.168.1.107
// @connect      192.168.0.110
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533510/chd%E5%88%B7%E8%AF%BE%EF%BC%88chd%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533510/chd%E5%88%B7%E8%AF%BE%EF%BC%88chd%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置参数
  const config = {
    checkInterval: 10000,
    interactionWait: 3000,
    maxRetry: 300,
    debugMode: true,
    countdownDuration: 60 * 60, // 60分钟（秒数）
    studentID: "aaaaa",
    dataAttribute1: "li[data-v-290b612e]",
    dataAttribute2: "div[data-v-6a18900e]",
  };

  // 添加UI指示器
  GM_addStyle(`
        .script-indicator {
                  position: fixed;
                  top: 20px;
                  right: 1000px;
                  background: linear-gradient(135deg, rgba(0,0,0,0.8), #B8860B);
                  color: white;
                  padding: 15px 22px;
                  border-radius: 10px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.4);
                  z-index: 9999;
                  font-size: 25px;
              }
              .script-indicator.error {
                  background: #F44336;
              }

              .pro-label {
                  position: absolute;
                  bottom: -10px;
                  right: 10px;
                  background: rgba(0, 0, 0, 0.5);
                  color: #FFD700;
                  padding: 5px 10px;
                  border-radius: 5px;
                  font-size: 14px;
                  font-weight: bold;
                  opacity: 0.8;
              }

              .countdown-display {
                  font-size: 14px;
                  margin-top: 5px;
                  opacity: 0.8;
              }
          `);

  const indicator = document.createElement("div");
  indicator.className = "script-indicator";
  indicator.innerHTML =
    '刷课脚本已经启动啦<div class="pro-label">Pro</div> <div class="countdown-display"></div>';
  document.body.appendChild(indicator);

  // 倒计时管理器
  class CountdownManager {
    constructor() {
      this.timer = null;
      this.startTime = null;
      this.remaining = GM_getValue(
        "countdownRemaining",
        config.countdownDuration
      );
      this.init();
    }

    init() {
      logProcess("CountdownManager: 初始化开始");
      log("CountdownManager: 初始化开始");
      this.updateDisplay();
      if (!GM_getValue("countdownRunning", false)) {
        GM_setValue("countdownRunning", true);
        this.startTime = Date.now();
        this.start();
      } else {
        const elapsed = Math.floor(
          (Date.now() - GM_getValue("countdownStartTime")) / 1000
        );
        this.remaining = Math.max(config.countdownDuration - elapsed, 0);
        this.start();
      }
      logProcess("CountdownManager: 初始化完成");
      log("CountdownManager: 初始化完成");
    }

    start() {
      logProcess("CountdownManager: 开始倒计时");
      log("CountdownManager: 开始倒计时");
      GM_setValue("countdownStartTime", Date.now());
      this.timer = setInterval(() => {
        this.remaining--;
        GM_setValue("countdownRemaining", this.remaining);

        if (this.remaining <= 0) {
          this.handleTimeout();
          return;
        }

        this.updateDisplay();
      }, 1000);
    }

    updateDisplay() {
      const minutes = Math.floor(this.remaining / 60);
      const seconds = this.remaining % 60;
      indicator.querySelector(
        ".countdown-display"
      ).textContent = `下次刷新: ${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    handleTimeout() {
      logProcess("CountdownManager: 倒计时结束，处理超时");
      log("CountdownManager: 倒计时结束，处理超时");
      clearInterval(this.timer);
      GM_setValue("countdownRunning", false);
      GM_setValue("countdownRemaining", config.countdownDuration);

      if (1) {
        logProcess("CountdownManager: 60分钟倒计时结束，返回课程中心");
        log("CountdownManager: 60分钟倒计时结束，返回课程中心");
        window.location.href = "https://www.hnsydwpx.cn/mineCourse";
      } else {
        // 如果在课程中心页面则重新开始倒计时
        this.remaining = config.countdownDuration;
        this.init();
      }
    }

    notify(message) {
      if (config.debugMode) {
        GM_notification({
          title: `[倒计时通知]`,
          text: message,
          timeout: 5000,
        });
      }
    }
  }

  // 解决自动播放问题的视频控制器
  class VideoController {
    constructor() {
      this.player = null;
      this.retryCount = 0;
      this.isWaitingInteraction = false;
      logProcess("VideoController: 初始化开始");
      log("VideoController: 初始化开始");
      this.init();
    }

    async init() {
      try {
        this.player = await this.waitForElement("#coursePlayer video");
        this.addFakeInteractionLayer();
        this.startMonitoring();
        logProcess("VideoController: 初始化完成");
        log("VideoController: 初始化完成");
      } catch (error) {
        logProcess(`VideoController: 初始化失败: ${error.message}`);
        log(`VideoController: 初始化失败: ${error.message}`);
        indicator.classList.add("error");
        indicator.textContent = "脚本初始化失败";
      }
    }

    // 添加伪交互层解决自动播放限制
    addFakeInteractionLayer() {
      logProcess("VideoController: 添加伪交互层");
      log("VideoController: 添加伪交互层");
      GM_addStyle(`
                          .interaction-overlay {
                              position: fixed;
                              top: 0;
                              left: 0;
                              width: 100%;
                              height: 100%;
                              background: transparent;
                              z-index: 9998;
                              cursor: pointer;
                          }
                          .interaction-notice {
                              position: fixed;
                              bottom: 80px;
                              right: 20px;
                              background: rgba(0,0,0,0.7);
                              color: white;
                              padding: 10px 15px;
                              border-radius: 4px;
                              z-index: 9999;
                              max-width: 300px;
                              font-size: 14px;
                              text-align: center;
                              box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                          }
                      `);

      // 创建覆盖层
      const overlay = document.createElement("div");
      overlay.className = "interaction-overlay";
      overlay.onclick = () => this.handleUserInteraction();
      document.body.appendChild(overlay);

      // 添加提示
      const notice = document.createElement("div");
      notice.className = "interaction-notice";
      notice.innerHTML =
        "点击页面任意位置激活自动播放功能<br><small>3秒后自动尝试播放</small>";
      document.body.appendChild(notice);

      this.isWaitingInteraction = true;
      setTimeout(() => {
        if (this.isWaitingInteraction) {
          this.handleUserInteraction();
          notice.innerHTML = "已自动激活播放功能";
          setTimeout(() => notice.remove(), 2000);
        }
      }, config.interactionWait);
    }

    // 处理用户交互
    handleUserInteraction() {
      if (!this.isWaitingInteraction) return;
      logProcess("VideoController: 处理用户交互");
      log("VideoController: 处理用户交互");
      this.isWaitingInteraction = false;
      document.querySelector(".interaction-overlay")?.remove();
      document.querySelector(".interaction-notice")?.remove();

      // 首次播放需要用户触发
      this.playVideo()
        .then(() => {
          logProcess(`VideoController: 用户交互后自动播放已启动`);
          log(`VideoController: 用户交互后自动播放已启动`);
        })
        .catch((error) => {
          logProcess(`VideoController: 交互后播放失败: ${error}`);
          log(`VideoController: 交互后播放失败: ${error}`);
          this.notify(`交互后播放失败: ${error}`, "error");
        });
    }

    // 新增检查覆盖层的方法
    intervalCheck() {
      removeSpecificOverlays();
      this.checkPlayingProgress();
    }

    // 开始监控
    startMonitoring() {
      logProcess("VideoController: 开始监控视频播放状态");
      log("VideoController: 开始监控视频播放状态");
      this.monitorInterval = setInterval(() => {
        if (
          !this.isWaitingInteraction &&
          this.player.paused &&
          !this.player.ended
        ) {
          logProcess("VideoController: 监控到视频播放状态异常");
          log("VideoController: 监控到视频播放状态异常");
          this.playVideo();
          logProcess("VideoController: 恢复视频播放");
          log("VideoController: 恢复视频播放");
        }
        // 检查覆盖层
        this.intervalCheck();
      }, config.checkInterval);

      // 监听视频事件
      this.player.addEventListener("pause", () => {
        if (!this.isWaitingInteraction) {
          logProcess("VideoController: 检测到视频等待交互，尝试移除交互层");
          log("VideoController: 检测到视频等待交互，尝试移除交互层");
          this.playVideo();
          removeSpecificOverlays();
        }
      });

      this.player.addEventListener("ended", () => {
        logProcess("VideoController: 当前视频播放完毕");
        log("VideoController: 当前视频播放完毕");
        this.nextChapter();
      });
    }

    // 播放视频（处理自动播放限制）
    async playVideo() {
      if (this.retryCount >= config.maxRetry) {
        logProcess("VideoController: 达到最大重试次数，停止尝试播放");
        log("VideoController: 达到最大重试次数，停止尝试播放");
        GM_notification({
          title: "自动播放被阻止",
          text: "请手动点击播放按钮",
          timeout: 5000,
        });
        indicator.classList.add("error");
        indicator.textContent = "自动播放被阻止";
        return;
      }

      try {
        const playPromise = this.player.play();

        if (playPromise !== undefined) {
          await playPromise;
          this.retryCount = 0;
          indicator.classList.remove("error");
          indicator.innerHTML =
            '刷课运行中……<div class="pro-label">Pro</div> <div class="countdown-display"></div>';
          logProcess("VideoController: 视频播放成功");
          log("VideoController: 视频播放成功");
        }
      } catch (error) {
        this.retryCount++;
        this.notify(
          `播放失败 (${this.retryCount}/${config.maxRetry}): ${error}`,
          "error"
        );
        logProcess(
          `VideoController: 播放失败 (${this.retryCount}/${config.maxRetry}): ${error}`
        );
        log(
          `VideoController: 播放失败 (${this.retryCount}/${config.maxRetry}): ${error}`
        );

        // 尝试通过点击按钮播放
        const playBtn = await this.waitForElement(
          ".xgplayer-play",
          document,
          1000
        ).catch(() => null);
        if (playBtn) {
          playBtn.click();
          logProcess("VideoController: 已尝试点击播放按钮");
          log("VideoController: 已尝试点击播放按钮");
        }

        // 直接尝试静音播放
        if (this.retryCount >= 1) {
          this.player.muted = true;
          this.player.play().catch((e) => {
            logProcess(`VideoController: 静音播放也失败: ${e}`);
            log(`VideoController: 静音播放也失败: ${e}`);
          });
        }
      }
    }

    checkPlayingProgress() {
      const items = document.querySelectorAll("li[data-v-290b612e]");
      const ifChangeClass = false;
      for (let item of items) {
        if (item.className === "playlist_li_active") {
          const progressElement = item.querySelector(".progress");
          const progress = progressElement
            ? progressElement.textContent.trim()
            : null;

          if (typeof progress === "string" && progress.includes("%")) {
            // 将百分数转换为数值
            const progressValue = parseFloat(progress.replace("%", ""));
            if (progressValue === 100) {
              // item.click();
              // 点击后等待视频加载并开始播放
              // setTimeout(() => this.playVideo(), 10000);
              logProcess(`VideoController: 当前已满100%，切换章节`);
              log(`VideoController: 当前已满100%，切换章节`);
              this.nextChapter();
            }
          }
          return;
        }
      }
    }
    // 切换到下一章节
    nextChapter() {
      logProcess("VideoController: 当前视频播放完毕，尝试切换到下一章节");
      log("VideoController: 当前视频播放完毕，尝试切换到下一章节");
      const items = document.querySelectorAll(config.dataAttribute1);
      for (let item of items) {
        const progressElement = item.querySelector(".progress");
        const progress = progressElement
          ? progressElement.textContent.trim()
          : null;
        logProcess(`章节进度文本内容: ${progress}`);
        log(`章节进度文本内容: ${progress}`);

        if (typeof progress === "string" && progress.includes("%")) {
          // 将百分数转换为数值
          const progressValue = parseFloat(progress.replace("%", ""));
          logProcess(`当前章节进度数值: ${progressValue}`);
          log(`当前章节进度数值: ${progressValue}`);
          if (progressValue < 98) {
            item.click();
            // 点击后等待视频加载并开始播放
            setTimeout(() => this.playVideo(), 10000);
            logProcess(
              `VideoController: 已切换到章节: ${
                item.querySelector(".name").textContent
              }`
            );
            log(
              `VideoController: 已切换到章节: ${
                item.querySelector(".name").textContent
              }`
            );
            return;
          }
        }
      }
      window.location.href = "https://www.hnsydwpx.cn/mineCourse";
      logProcess("VideoController: 所有章节已完成，返回课程中心");
      log("VideoController: 所有章节已完成，返回课程中心");
    }

    // 等待元素出现
    waitForElement(selector, parent = document, timeout = 10000) {
      logProcess(`VideoController: 开始等待元素 ${selector} 出现`);
      log(`VideoController: 开始等待元素 ${selector} 出现`);
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
          const el = parent.querySelector(selector);
          if (el) {
            logProcess(`VideoController: 元素 ${selector} 已找到`);
            log(`VideoController: 元素 ${selector} 已找到`);
            resolve(el);
          } else if (Date.now() - startTime < timeout) {
            setTimeout(check, 500);
          } else {
            logProcess(`VideoController: 元素 ${selector} 未找到`);
            log(`VideoController: 元素 ${selector} 未找到`);
            reject(new Error(`元素未找到: ${selector}`));
          }
        };
        check();
      });
    }

    // 弹窗通知
    notify(message, type = "info") {
      if (config.debugMode) {
        GM_notification({
          title: `[视频控制]`,
          text: message,
          timeout: 5000,
        });
      }
    }
  }

  // 查找包含“防作弊问答”的元素并获取其 Base64 编码
  // 该函数用于在文档中通过 XPath 表达式查找包含“防作弊问答”文本的元素，
  // 然后在其祖先元素中查找 img 元素，并获取其 Base64 编码形式的图片数据
  function getBase64FromAntiCheatImage() {
    logProcess(
      "getBase64FromAntiCheatImage: 开始查找防作弊问答图片并获取 Base64 编码"
    );
    log(
      "getBase64FromAntiCheatImage: 开始查找防作弊问答图片并获取 Base64 编码"
    );
    const xpath = "//span[contains(text(), '防作弊问答')]";
    try {
      // 使用 document.evaluate 方法根据给定的 XPath 表达式在文档中查找元素
      // 这里指定返回第一个匹配的有序节点
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      const antiCheatElement = result.singleNodeValue;
      if (antiCheatElement) {
        let parentElement = antiCheatElement.parentElement;
        while (parentElement) {
          const imgElement = parentElement.querySelector("img");
          // 检查找到的 img 元素的 src 属性是否以"data:image"开头，
          // 如果是，则表示是 Base64 编码的图片数据，提取并返回
          if (imgElement && imgElement.src.startsWith("data:image")) {
            logProcess(
              "getBase64FromAntiCheatImage: 已获取到防作弊问答图片的 Base64 编码"
            );
            log(
              "getBase64FromAntiCheatImage: 已获取到防作弊问答图片的 Base64 编码"
            );
            return imgElement.src.split(",")[1];
          }
          parentElement = parentElement.parentElement;
        }
      }
    } catch (error) {
      logProcess(
        `getBase64FromAntiCheatImage: 在使用 XPath 查找元素时出错: ${error}`
      );
      log(`getBase64FromAntiCheatImage: 在使用 XPath 查找元素时出错: ${error}`);
    }
    logProcess(
      "getBase64FromAntiCheatImage: 未找到防作弊问答图片的 Base64 编码"
    );
    log("getBase64FromAntiCheatImage: 未找到防作弊问答图片的 Base64 编码");
    return null;
  }

  // 构造发送到后端的请求数据
  // 该函数接受一个 Base64 编码的图片数据，构造一个包含图片数据和 OCR 配置选项的对象
  function buildRequestData(base64Image) {
    logProcess("buildRequestData: 开始构造发送到后端的请求数据");
    log("buildRequestData: 开始构造发送到后端的请求数据");
    const options = {
      lang: "eng",
      oem: 3,
      psm: 7,
    };
    try {
      // 检查传入的 base64Image 是否为空，如果为空则抛出错误
      if (!base64Image) {
        throw new Error("传入的 base64Image 为空");
      }
      logProcess("buildRequestData: 请求数据构造完成");
      log("buildRequestData: 请求数据构造完成");
      return {
        image: base64Image,
        options: options,
      };
    } catch (error) {
      logProcess(`buildRequestData: 构造请求数据时出错: ${error}`);
      log(`buildRequestData: 构造请求数据时出错: ${error}`);
      throw error;
    }
  }

  // 发送请求到后端进行 OCR 识别
  // 该函数接受构造好的请求数据，通过 GM_xmlhttpRequest 发送 POST 请求到后端服务器，
  // 并根据响应结果进行处理，返回识别结果和算式计算结果的对象
  function sendOCRRequest(requestData) {
    logProcess("sendOCRRequest: 开始发送请求到后端进行 OCR 识别");
    log("sendOCRRequest: 开始发送请求到后端进行 OCR 识别");
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "http://192.168.0.110:3000/recognize",
        // url: "http://192.168.1.107:3000/recognize",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(requestData),
        onload: function (response) {
          if (response.status === 200) {
            try {
              // 将服务端返回的响应文本解析为 JSON 格式
              const responseData = JSON.parse(response.responseText);
              const recognitionResult = responseData.text;
              const calculationResult = responseData.calculationResult;
              logProcess("sendOCRRequest: 后端 OCR 识别请求成功，已获取结果");
              log("sendOCRRequest: 后端 OCR 识别请求成功，已获取结果");
              resolve({ recognitionResult, calculationResult });
            } catch (parseError) {
              logProcess(`sendOCRRequest: 解析服务端响应时出错: ${parseError}`);
              log(`sendOCRRequest: 解析服务端响应时出错: ${parseError}`);
              reject(new Error("解析服务端响应失败"));
            }
          } else {
            logProcess(
              `sendOCRRequest: 请求失败: ${response.statusText}，状态码: ${response.status}`
            );
            log(
              `sendOCRRequest: 请求失败: ${response.statusText}，状态码: ${response.status}`
            );
            reject(
              new Error(
                `请求失败: ${response.statusText}，状态码: ${response.status}`
              )
            );
          }
        },
        onerror: function (error) {
          logProcess(`sendOCRRequest: 发送请求时出错: ${error}`);
          log(`sendOCRRequest: 发送请求时出错: ${error}`);
          reject(
            new Error(`请求出错: ${error}，可能是网络连接问题或服务器不可达`)
          );
        },
      });
    });
  }

  // 根据计算结果点击相应的答案
  // 该函数接受一个计算结果，在页面中查找所有符合特定样式的 radio 标签，
  // 如果标签的文本内容或其关联的 input 的值与计算结果匹配，则点击该 radio 标签的 input 元素
  function clickCorrespondingAnswer(calculatedResult) {
    logProcess("clickCorrespondingAnswer: 开始根据计算结果点击相应的答案");
    log("clickCorrespondingAnswer: 开始根据计算结果点击相应的答案");
    try {
      const radioLabels = document.querySelectorAll(
        "label.el-radio.is-bordered.el-radio--large"
      );
      radioLabels.forEach((label) => {
        const labelText = label.querySelector(".el-radio__label").textContent;
        logProcess(`clickCorrespondingAnswer: 检查答案标签文本: ${labelText}`);
        log(`clickCorrespondingAnswer: 检查答案标签文本: ${labelText}`);
        const inputValue = label.querySelector(
          "input.el-radio__original"
        ).value;
        logProcess(`clickCorrespondingAnswer: 检查答案输入值: ${inputValue}`);
        log(`clickCorrespondingAnswer: 检查答案输入值: ${inputValue}`);
        if (
          labelText === calculatedResult.toString() ||
          inputValue === calculatedResult.toString()
        ) {
          const inputElement = label.querySelector("input.el-radio__original");
          inputElement.click();
          logProcess(`clickCorrespondingAnswer: 已点击答案: ${labelText}`);
          log(`clickCorrespondingAnswer: 已点击答案: ${labelText}`);
        }
      });
    } catch (error) {
      logProcess(`clickCorrespondingAnswer: 点击答案时出错: ${error}`);
      log(`clickCorrespondingAnswer: 点击答案时出错: ${error}`);
    }
  }

  function removeSpecificOverlays(videoController) {
    // 获取所有匹配的元素，这里是 class 为".el-overlay"的元素
    const overlays = document.querySelectorAll(".el-overlay");
    // 遍历并删除每个元素
    overlays.forEach((overlay) => {
      // 检查元素的 display 属性是否不为 none，即存在覆盖层
      if (overlay.style.display !== "none") {
        logProcess("removeSpecificOverlays: 检测到覆盖层不存在display属性");
        log("removeSpecificOverlays: 检测到覆盖层不存在display属性");
        // 检查元素内部是否有特定的内容，这里检查 class 为".el-dialog__title"的元素的文本内容
        const dialogTitle = overlay.querySelector(
          ".el-dialog__title, .el-message-box__title"
        );
        if (dialogTitle && dialogTitle.textContent === "防作弊问答") {
          logProcess("removeSpecificOverlays: 检测到防作弊问答");
          log("removeSpecificOverlays: 检测到防作弊问答");
          const base64Image = getBase64FromAntiCheatImage();
          if (base64Image) {
            const requestData = buildRequestData(base64Image);
            sendOCRRequest(requestData)
              .then(({ recognitionResult, calculationResult }) => {
                logProcess(
                  `removeSpecificOverlays: 防作弊问答 OCR 识别结果: ${recognitionResult}`
                );
                log(
                  `removeSpecificOverlays: 防作弊问答 OCR 识别结果: ${recognitionResult}`
                );
                if (calculationResult !== null) {
                  clickCorrespondingAnswer(calculationResult);
                } else {
                  logProcess("removeSpecificOverlays: 未成功计算算式结果");
                  log("removeSpecificOverlays: 未成功计算算式结果");
                }
              })
              .catch((error) => {
                logProcess(
                  `removeSpecificOverlays: 处理 OCR 请求结果时出错: ${error}`
                );
                log(
                  `removeSpecificOverlays: 处理 OCR 请求结果时出错: ${error}`
                );
              });
          } else {
            logProcess("removeSpecificOverlays: 未找到“防作弊问答”相关区域");
            log("removeSpecificOverlays: 未找到“防作弊问答”相关区域");
          }
        } else {
          try {
            if (dialogTitle && dialogTitle.textContent === "温馨提示") {
              const dialogContent = overlay.querySelector(
                ".el-message-box__content"
              );
              logProcess(
                `removeSpecificOverlays:  非防作弊问答覆盖层: ${dialogTitle.textContent} : ${dialogContent.textContent} `
              );
              log(
                `removeSpecificOverlays:  非防作弊问答覆盖层: ${dialogTitle.textContent} : ${dialogContent.textContent} `
              );

              if (
                dialogContent.textContent ===
                "此节已播放完毕，是否继续播放下一节！"
              ) {
                const dialogBtns = overlay.querySelector(
                  ".el-message-box__btns .el-button--primary"
                );
                dialogBtnsclick();
                logProcess(
                  `removeSpecificOverlays:  非防作弊问答覆盖层: ${dialogContent.textContent} 点击了继续播放 `
                );
                log(
                  `removeSpecificOverlays:  非防作弊问答覆盖层: ${dialogContent.textContent} 点击了继续播放 `
                );
              }
            }
            logProcess(
              `removeSpecificOverlays: 非防作弊问答覆盖层: ${dialogTitle.textContent}`
            );
            log(
              `removeSpecificOverlays: 非防作弊问答覆盖层: ${dialogTitle.textContent}`
            );
            overlay.remove();
            logProcess("removeSpecificOverlays: 已移除非防作弊问答覆盖层");
            log("removeSpecificOverlays: 已移除非防作弊问答覆盖层");
          } catch (error) {
            logProcess(
              `removeSpecificOverlays: 移除非防作弊问答覆盖层出错: ${error}`
            );
            log(`removeSpecificOverlays: 移除非防作弊问答覆盖层出错: ${error}`);
          }
        }
        // 检查 videoController 是否存在
        if (videoController) {
          videoController.playVideo();
          // this.playVideo();
        } else {
          logProcess(
            "removeSpecificOverlays: videoController 未定义，无法调用 playVideo 方法"
          );
          log(
            "removeSpecificOverlays: videoController 未定义，无法调用 playVideo 方法"
          );
        }
      }
    });
  }

  // 页面初始化
  function check2425(items, index) {
    logProcess("check2425: 开始检查课程章节");
    log("check2425: 开始检查课程章节");
    items[index].click();
    setTimeout(() => {
      //先检查元素是否存在
      const lists = document.querySelectorAll(
        ".el-tab-pane .el-row .list_title"
      );
      let button;
      if (lists.length) {
        if (index) {
          logProcess("2024年章节未完成，程序优先学习2024年章节！");
          log("2024年章节未完成，程序优先学习2024年章节！");
        }
        for (let list of lists) {
          let text;
          if (
            (text = list.querySelector(".el-progress__text span").innerText) ===
            "100%"
          )
            continue;
          logProcess(`第一个未学完的视频进度为：${text}`);
          log(`第一个未学完的视频进度为：${text}`);
          button = list.querySelector("button");
          try {
            button.click();
            logProcess("已点击未学完视频的播放按钮");
            log("已点击未学完视频的播放按钮");
            break;
          } catch (clickError) {
            logProcess(`check2425: 点击操作失败: ${clickError}`);
            log(`check2425: 点击操作失败: ${clickError}`);
          }
        }
      } else {
        logProcess("2024已经完成，学习2025年课程！");
        log("2024已经完成，学习2025年课程！");
        if (!index) {
          logProcess("全部完成啦！");
          log("全部完成啦！");
        } else check2425(items, 0);
      }

      new VideoController();
    }, 2000);
  }

  async function init() {
    logProcess("init: 脚本初始化开始");
    // 初始化倒计时
    await delay(2000);

    new CountdownManager();
    // 只在对视频页面启用
    if (
      location.pathname.includes("/videoPlayback") ||
      location.pathname.includes("/getcourseDetails")
    ) {
      logProcess("当前页面为课程学习界面，启动视频控制");
      log("当前页面为课程学习界面，启动视频控制");
      new VideoController();
    } else if (!location.pathname.includes("/mineCourse")) {
      logProcess("当前页面不是课程中心，重定向到课程中心");
      log("当前页面不是课程中心，重定向到课程中心");
      window.location.href = "https://www.hnsydwpx.cn/mineCourse";
    } else if (location.pathname.includes("/mineCourse")) {
      setTimeout(() => {
        logProcess("进入课程中心页面，开始选择课程章节");
        log("进入课程中心页面，开始选择课程章节");
        const items = document.querySelectorAll(".years div[data-v-6a18900e]");
        check2425(items, 1);
      }, 2000);
    }
    logProcess("init: 脚本初始化完成");
    log("init: 脚本初始化完成");
  }

  // 日志输出函数，区分调试和进程提示
  function logProcess(message) {
    if (config.debugMode) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      console.log(`[DEBUG] [${timestamp}] ${message}`);
    }
  }

  function logProcess(message) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    console.log(`[PROCESS] [${timestamp}] ${message}`);
  }

  function log(message) {
    // // 获取当前时间
    const now = new Date();
    const timeStr = now.toLocaleString();
    // 格式化日志信息
    const logEntry = `${timeStr}: ${message}\n`;

    // 格式化日志信息
    // const logEntry = `${message}\n`;
    // 从localStorage获取已有的日志
    let logs = localStorage.getItem(`${config.studentID}_logs`) || "";
    // 将新日志添加到已有日志后面
    logs += logEntry;
    // 将更新后的日志存回localStorage
    localStorage.setItem(`${config.studentID}_logs`, logs);
  }

  // 调用exportLogs函数可将日志导出为本地文件
  function exportLogs() {
    const logs = localStorage.getItem(`${config.studentID}_logs`);
    if (logs) {
      const blob = new Blob([logs], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.studentID}_logs.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // 定义一个模拟延迟的函数，返回一个Promise
  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  // 启动脚本
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();

