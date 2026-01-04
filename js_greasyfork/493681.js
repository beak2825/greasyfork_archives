// ==UserScript==
// @name         NJU Helper
// @namespace    Flying-Tom/NJU-Helper
// @version      0.3.0
// @author       Flying-Tom
// @description  A helper for you to automate your life in NJU.
// @license      AGPL-3.0
// @icon         https://authserver.nju.edu.cn/favicon.ico
// @match        *://*.nju.edu.cn:*/*
// @match        https://authserver.nju.edu.cn/authserver/login*
// @match        http://ndyy.nju.edu.cn/*
// @match        https://zhtj.youth.cn/zhtj/
// @match        https://ehall.nju.edu.cn/ywtb-portal/official/index.html*
// @match        https://mail.smail.nju.edu.cn/cgi-bin/loginpage*
// @match        https://ehallapp.nju.edu.cn/gsapp/sys/wspjapp/*
// @match        https://epay.nju.edu.cn/epay/h5/*
// @match        https://zzbdjgz.nju.edu.cn/consumer/*
// @require      https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/ort.min.js#sha256-CdOXaLKpsqac99HNMqEaQ4sKAPkm73Se4ux6F8hzSfM=
// @resource     ONNX_MODEL  https://cdn.jsdelivr.net/gh/Do1e/NJUcaptcha@main/model/checkpoints/nju_captcha.onnx
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/493681/NJU%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/493681/NJU%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function wechat_page_handler() {
    console.debug("Solving wechat page");
    if (window.location.href.includes("electric")) {
      return;
    } else if (window.location.href.includes("recharge")) {
      const styleElement = document.createElement("style");
      styleElement.textContent = `
          body {
              width: 40%;
              margin: 0 auto;
          }
        `;
      document.head.appendChild(styleElement);
    }
  }
  function resolveUrl(url) {
    try {
      return new URL(url, window.location.href).toString();
    } catch {
      return url;
    }
  }
  async function downloadByFetch(url, titleSelectors = '.arti-title, [class*="arti_title"], h1, .title, title') {
    try {
      const resp = await fetch(url, { credentials: "include" });
      if (!resp.ok) throw new Error("fetch failed");
      const blob = await resp.blob();
      const a = document.createElement("a");
      let filename = "";
      const titleEl = document.querySelector(titleSelectors);
      if (titleEl) {
        filename = titleEl.textContent?.trim() || "";
      }
      if (!filename) {
        filename = url.split("/").pop() || "download.pdf";
      }
      if (!filename.endsWith(".pdf")) {
        filename += ".pdf";
      }
      const blobUrl = URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = decodeURIComponent(filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1e3);
      return true;
    } catch (e) {
      console.warn("fetch-download failed, fallback open", e);
      window.open(url, "_blank");
      return false;
    }
  }
  function collectPdfUrls() {
    const urls = [];
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get("file");
    if (fileParam) {
      urls.push(resolveUrl(fileParam));
      return urls;
    }
    const iframes = document.querySelectorAll("iframe.wp_pdf_player");
    iframes.forEach((iframe) => {
      const src = iframe.src;
      if (src) {
        try {
          const iframeUrl = new URL(src, window.location.href);
          const iframeFileParam = iframeUrl.searchParams.get("file");
          if (iframeFileParam) {
            const resolved = resolveUrl(iframeFileParam);
            if (!urls.includes(resolved)) {
              urls.push(resolved);
            }
          }
        } catch (e) {
          console.warn("[collectPdfUrls] 解析 iframe URL 失败:", e);
        }
      }
    });
    if (urls.length > 0) {
      return urls;
    }
    let players = document.querySelectorAll("div.wp_pdf_player");
    if (players.length === 0) {
      players = document.querySelectorAll("[pdfsrc], [pdfSrc], [swsrc], [data-pdf]");
    }
    players.forEach((el) => {
      let url = el.getAttribute("pdfsrc") || el.getAttribute("pdfSrc") || el.getAttribute("swf") || el.getAttribute("swsrc") || el.getAttribute("data-pdf") || "";
      if (!url) {
        const child = el.querySelector("[pdfsrc], [pdfSrc], [data-pdf], embed, iframe");
        if (child) {
          url = child.getAttribute("pdfsrc") || child.getAttribute("pdfSrc") || child.getAttribute("data-pdf") || child.src || "";
        }
      }
      if (url) {
        const resolved = resolveUrl(url);
        if (!urls.includes(resolved)) {
          urls.push(resolved);
        }
      }
    });
    return urls;
  }
  let floatingButtonCreated = false;
  function createFloatingButton() {
    if (floatingButtonCreated || document.getElementById("njuh-pdf-download-floating-btn")) {
      floatingButtonCreated = true;
      return;
    }
    if (window.self !== window.top) {
      return;
    }
    const urls = collectPdfUrls();
    if (urls.length === 0) {
      floatingButtonCreated = true;
      return;
    }
    floatingButtonCreated = true;
    const btn = document.createElement("button");
    btn.id = "njuh-pdf-download-floating-btn";
    btn.type = "button";
    btn.innerHTML = "📥";
    btn.title = "下载页面 PDF";
    btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 24px;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.1)";
      btn.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    });
    btn.addEventListener("click", async () => {
      const urls2 = collectPdfUrls();
      if (urls2.length === 0) {
        alert("页面上未找到 PDF 文件");
        return;
      }
      btn.disabled = true;
      btn.innerHTML = "⏳";
      btn.style.opacity = "0.6";
      try {
        for (let i = 0; i < urls2.length; i++) {
          await downloadByFetch(urls2[i]);
          if (i < urls2.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
        btn.innerHTML = "✅";
        setTimeout(() => {
          btn.innerHTML = "📥";
          btn.disabled = false;
          btn.style.opacity = "1";
        }, 2e3);
      } catch (e) {
        console.error("下载失败:", e);
        btn.innerHTML = "❌";
        setTimeout(() => {
          btn.innerHTML = "📥";
          btn.disabled = false;
          btn.style.opacity = "1";
        }, 2e3);
      }
    });
    document.body.appendChild(btn);
  }
  let wp_pdf_handler_initialized = false;
  function wp_pdf_player_handler() {
    if (wp_pdf_handler_initialized) {
      return;
    }
    wp_pdf_handler_initialized = true;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        createFloatingButton();
      }, { once: true });
    } else {
      createFloatingButton();
    }
    const observer = new MutationObserver(() => {
      const urls = collectPdfUrls();
      const btn = document.getElementById("njuh-pdf-download-floating-btn");
      if (btn && urls.length > 0) {
        btn.title = `下载页面 PDF (${urls.length} 个)`;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  var _GM_getResourceURL = (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  function promiseTimeout(promise, delay) {
    const timeout = new Promise(function(_reslove, reject) {
      setTimeout(() => {
        reject(new Error("promise timeout"));
      }, delay);
    });
    return Promise.race([timeout, promise]);
  }
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function waitForElms(selector) {
    return new Promise((resolve) => {
      if (document.querySelectorAll(selector).length > 0) {
        return resolve(document.querySelectorAll(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(selector).length > 0) {
          resolve(document.querySelectorAll(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  const charset = ["1", "2", "3", "4", "5", "6", "7", "8", "a", "b", "c", "d", "e", "f", "h", "k", "n", "p", "q", "x", "y", "z"];
  const resizeWidth = 176;
  const resizeHeight = 64;
  const charCount = 4;
  const numClasses = 22;
  const mean = [0.743, 0.7432, 0.7431];
  const std = [0.1917, 0.1918, 0.1917];
  let modelSession = null;
  let modelPromise = null;
  function waitForOrt() {
    return new Promise((resolve) => {
      if (typeof ort !== "undefined") {
        resolve();
        return;
      }
      const checkOrt = () => {
        if (typeof ort !== "undefined") {
          resolve();
        } else {
          setTimeout(checkOrt, 100);
        }
      };
      checkOrt();
    });
  }
  async function initializeONNXRuntime() {
    await waitForOrt();
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
  }
  async function loadONNXModel() {
    if (modelSession) {
      return modelSession;
    }
    if (modelPromise) {
      return modelPromise;
    }
    modelPromise = (async () => {
      try {
        const modelURL = await _GM_getResourceURL("ONNX_MODEL");
        const response = await fetch(modelURL);
        if (!response.ok) {
          throw new Error(`下载ONNX模型失败，状态码: ${response.status}`);
        }
        const modelData = await response.arrayBuffer();
        const session = await ort.InferenceSession.create(modelData, {
          executionProviders: ["wasm"]
        });
        modelSession = session;
        return session;
      } catch (error) {
        console.error("ONNX模型加载失败:", error);
        throw error;
      }
    })();
    return modelPromise;
  }
  function preprocessImage(imageData) {
    const { data, width, height } = imageData;
    const float32Data = new Float32Array(3 * height * width);
    for (let i = 0; i < height * width; i++) {
      const r = data[i * 4] / 255;
      const g = data[i * 4 + 1] / 255;
      const b = data[i * 4 + 2] / 255;
      float32Data[i] = (r - mean[0]) / std[0];
      float32Data[i + height * width] = (g - mean[1]) / std[1];
      float32Data[i + 2 * height * width] = (b - mean[2]) / std[2];
    }
    return float32Data;
  }
  async function recognizeCaptcha(imageElement) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = resizeWidth;
      canvas.height = resizeHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("无法创建Canvas上下文");
      }
      ctx.drawImage(imageElement, 0, 0, resizeWidth, resizeHeight);
      const imageData = ctx.getImageData(0, 0, resizeWidth, resizeHeight);
      const float32Data = preprocessImage(imageData);
      const session = await loadONNXModel();
      const inputTensor = new ort.Tensor("float32", float32Data, [1, 3, resizeHeight, resizeWidth]);
      const feeds = { "input": inputTensor };
      const results = await session.run(feeds);
      const outputTensor = results.output;
      const outputData = outputTensor.data;
      let text = "";
      for (let i = 0; i < charCount; i++) {
        const startIndex = i * numClasses;
        const endIndex = startIndex + numClasses;
        const classScores = Array.from(outputData.slice(startIndex, endIndex));
        let maxScore = -Infinity;
        let maxIndex = -1;
        for (let j = 0; j < classScores.length; j++) {
          if (classScores[j] > maxScore) {
            maxScore = classScores[j];
            maxIndex = j;
          }
        }
        text += charset[maxIndex];
      }
      return text;
    } catch (error) {
      console.error("验证码识别出错:", error);
      throw error;
    }
  }
  async function solveCAPTCHA(image_target, captcha_input_selectors, autoLogin) {
    try {
      const result = await recognizeCaptcha(image_target);
      console.debug("验证码识别结果:", result);
      const captchaInput = document.querySelector(captcha_input_selectors);
      if (captchaInput) {
        captchaInput.value = result;
      }
      if (autoLogin.enabled === true) {
        const intervalId = setInterval(function() {
          const usernameInput = document.querySelector(autoLogin.usernameSelectors);
          const passwordInput = document.querySelector(autoLogin.passwordSelectors);
          const submitButton = document.querySelector(autoLogin.submitSelectors);
          if (usernameInput && passwordInput && submitButton) {
            if (usernameInput.value && passwordInput.value) {
              submitButton.click();
              clearInterval(intervalId);
            }
          }
        }, 1e3);
      }
    } catch (error) {
      console.error("验证码识别失败:", error);
    }
  }
  function handleCaptcha(captcha_img_selectors, captcha_input_selectors, autoLogin) {
    void initializeONNXRuntime().then(() => {
      void waitForElm(captcha_img_selectors).then((data) => {
        const image_target = data;
        if (image_target.complete === true) {
          void solveCAPTCHA(image_target, captcha_input_selectors, autoLogin);
        } else {
          image_target.addEventListener("load", () => void solveCAPTCHA(image_target, captcha_input_selectors, autoLogin));
        }
      });
    }).catch((error) => {
      console.error("ONNX Runtime 初始化失败:", error);
    });
  }
  function njuauth_handler() {
    console.debug("Solving njuauth captcha");
    const inputElement = document.querySelector("input[name=dllt][value=userNamePasswordLogin]");
    if (inputElement) {
      inputElement.value = "mobileLogin";
    }
    const showPassElement = document.getElementsByClassName("showPass")?.[0];
    if (showPassElement) {
      showPassElement.click();
    }
    handleCaptcha("#captchaImg", "#captchaResponse", {
      enabled: true,
usernameSelectors: "input[name=username]",
      passwordSelectors: "input[type=password]",
      submitSelectors: "button[type=submit]"
    });
  }
  function njuhospital_handler() {
    console.debug("Solving nju hospital captcha");
    const inputElement = document.querySelector('input[name="NewWebYzm"]');
    if (inputElement) {
      inputElement.value = "";
    }
    handleCaptcha("#refreshCaptcha", 'input[name="NewWebYzm"]', {
      enabled: false
    });
  }
  function ehall_handler() {
    console.debug("Solving ehall captcha");
    const intervalId = setInterval(function() {
      if (document.querySelector(".header-user")) {
        const spanElement = document.evaluate("//span[contains(., '首页')]", document, null, XPathResult.ANY_TYPE).iterateNext();
        if (spanElement) {
          spanElement.click();
        }
        clearInterval(intervalId);
      }
      const btnLogin = document.querySelector(".btn-login");
      if (btnLogin) {
        btnLogin.click();
      }
    }, 200);
    setTimeout(function() {
      clearInterval(intervalId);
    }, 5e3);
  }
  function email_trust_handler() {
    console.debug("Solving email trust");
    const intervalId = setInterval(function() {
      const checkbox = document.getElementById("force_wx_scan_login_tc");
      if (checkbox) {
        checkbox.checked = true;
        clearInterval(intervalId);
      }
    }, 500);
  }
  function zhtj_handler() {
    console.debug("Solving zhtj captcha");
    handleCaptcha("#codeImage", "#yzm", {
      enabled: false
    });
  }
  function wspj_handler() {
    setInterval(checkForElement, 1e3);
    function checkForElement() {
      const element = document.querySelector("#pjfooter");
      if (element) {
        console.debug("Solving wspj page");
        void waitForElms(".bh-radio-label.paper_dx").then(
          (elems) => {
            const choices = elems;
            choices.forEach((elem) => {
              const choice = elem;
              const spanElement = choice.querySelector("span");
              const input = choice.querySelector("input");
              if (spanElement && input) {
                if (spanElement.textContent === "符合") {
                  input.checked = true;
                }
              }
            });
          }
        );
      } else {
        return;
      }
    }
  }
  const STORAGE_KEY = "nju_helper_config_v1";
  const DEFAULT_CONFIG = {
    smart_party: {
      enabled: true,
      due: "0.2",
      paid: "0.2"
    }
  };
  function isObject(val) {
    return val !== null && typeof val === "object" && !Array.isArray(val);
  }
  function mergeDefaults(defaults, raw) {
    if (!raw || !isObject(raw)) return defaults;
    const out = { ...defaults };
    for (const k of Object.keys(defaults)) {
      const dv = defaults[k];
      const rv = raw[k];
      if (isObject(dv)) {
        out[k] = mergeDefaults(dv, rv);
      } else {
        out[k] = rv !== void 0 ? rv : dv;
      }
    }
    return out;
  }
  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_CONFIG;
      const parsed = JSON.parse(raw);
      return mergeDefaults(DEFAULT_CONFIG, parsed);
    } catch (e) {
      console.warn("Failed to load config, using defaults", e);
      return DEFAULT_CONFIG;
    }
  }
  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {
      console.warn("Failed to save config", e);
    }
  }
  let _cached = null;
  function getConfig() {
    if (!_cached) _cached = loadConfig();
    return _cached;
  }
  function getOption(path, fallback) {
    const cfg = getConfig();
    const parts = path.split(".");
    let cur = cfg;
    for (const p of parts) {
      if (cur == null || typeof cur !== "object") return fallback;
      cur = cur[p];
    }
    return cur === void 0 ? fallback : cur;
  }
  function setOption(path, value) {
    const cfg = getConfig();
    const parts = path.split(".");
    let cur = cfg;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!isObject(cur[p])) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
    _cached = cfg;
    saveConfig(_cached);
  }
  function resetConfig() {
    _cached = DEFAULT_CONFIG;
    saveConfig(DEFAULT_CONFIG);
  }
  const DEFAULTS = DEFAULT_CONFIG;
  function smart_party_handler() {
    function search_and_pay() {
      console.debug("Try to search for input elements.");
      if (!getOption("smart_party.enabled", true)) {
        console.debug("smart_party handler disabled by config");
        return;
      }
      if (window.location.href.includes("partyCostPay")) {
        void waitForElms(".ivu-input-number-input").then((data) => {
          const feeInputElems = data;
          const due = getOption("smart_party.due", "0");
          const paid = getOption("smart_party.paid", "0");
          const inputs = Array.from(feeInputElems);
          const visibleInputs = inputs.filter((el) => {
            try {
              return el.offsetParent !== null && !el.disabled;
            } catch {
              return true;
            }
          });
          const rowMap = new Map();
          function findRow(el) {
            return el.closest("tr") || el.closest(".ivu-row") || el.closest(".ivu-table-row") || el.parentElement || el;
          }
          visibleInputs.forEach((inp) => {
            const row = findRow(inp);
            const arr = rowMap.get(row) || [];
            arr.push(inp);
            rowMap.set(row, arr);
          });
          if (rowMap.size > 0) {
            rowMap.forEach((arr) => {
              if (arr.length >= 2) {
                arr[0].value = due;
                arr[0].dispatchEvent(new Event("input", { bubbles: true }));
                arr[1].value = paid;
                arr[1].dispatchEvent(new Event("input", { bubbles: true }));
              } else if (arr.length === 1) {
                arr[0].value = due;
                arr[0].dispatchEvent(new Event("input", { bubbles: true }));
              }
            });
          } else if (inputs.length >= 2) {
            inputs[0].value = due;
            inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
            inputs[1].value = paid;
            inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
          } else {
            inputs.forEach((inputElem) => {
              inputElem.value = due;
              inputElem.dispatchEvent(new Event("input", { bubbles: true }));
            });
          }
        });
      }
    }
    void waitForElm("#app").then((data) => {
      const observer = new MutationObserver(search_and_pay);
      observer.observe(data, {
        childList: true,
        subtree: true
      });
    });
  }
  function createEl(tag, attrs, css) {
    const el = document.createElement(tag);
    return el;
  }
  function applyStyles() {
    const id = "nju-helper-settings-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
  .nju-settings-panel { position: fixed; right: 16px; top: 64px; z-index: 999999; width: 320px; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.15); padding: 12px; font-family: Arial, Helvetica, sans-serif; }
  .nju-settings-row { display:flex; align-items:center; justify-content:space-between; margin:8px 0; }
  .nju-settings-row label { margin-right:12px; font-size:13px; }
  .nju-settings-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:12px; }
  .nju-settings-input { width:120px; }
  `;
    document.head.appendChild(style);
  }
  function buildPanel() {
    applyStyles();
    const panel = createEl("div");
    panel.className = "nju-settings-panel";
    const enabledRow = createEl("div");
    enabledRow.className = "nju-settings-row";
    const enabledLabel = createEl("label");
    enabledLabel.textContent = "智慧党建党费缴纳";
    const enabledInput = createEl("input");
    enabledInput.type = "checkbox";
    enabledRow.appendChild(enabledLabel);
    enabledRow.appendChild(enabledInput);
    const dueRow = createEl("div");
    dueRow.className = "nju-settings-row";
    const dueLabel = createEl("label");
    dueLabel.textContent = "当月应交党费";
    const dueInput = createEl("input");
    dueInput.type = "text";
    dueInput.className = "nju-settings-input";
    dueRow.appendChild(dueLabel);
    dueRow.appendChild(dueInput);
    const paidRow = createEl("div");
    paidRow.className = "nju-settings-row";
    const paidLabel = createEl("label");
    paidLabel.textContent = "当月实交党费";
    const paidInput = createEl("input");
    paidInput.type = "text";
    paidInput.className = "nju-settings-input";
    paidRow.appendChild(paidLabel);
    paidRow.appendChild(paidInput);
    const actions = createEl("div");
    actions.className = "nju-settings-actions";
    const saveBtn = createEl("button");
    saveBtn.textContent = "保存";
    const resetBtn = createEl("button");
    resetBtn.textContent = "重置默认";
    actions.appendChild(resetBtn);
    actions.appendChild(saveBtn);
    panel.appendChild(enabledRow);
    panel.appendChild(dueRow);
    panel.appendChild(paidRow);
    panel.appendChild(actions);
    function loadValues() {
      enabledInput.checked = getOption("smart_party.enabled", DEFAULTS.smart_party.enabled);
      dueInput.value = getOption("smart_party.due", DEFAULTS.smart_party.due);
      paidInput.value = getOption("smart_party.paid", DEFAULTS.smart_party.paid);
    }
    saveBtn.addEventListener("click", () => {
      setOption("smart_party.enabled", enabledInput.checked);
      setOption("smart_party.due", dueInput.value);
      setOption("smart_party.paid", paidInput.value);
      document.body.removeChild(panel);
    });
    resetBtn.addEventListener("click", () => {
      resetConfig();
      loadValues();
    });
    loadValues();
    document.body.appendChild(panel);
  }
  function settings_handler() {
    _GM_registerMenuCommand("设置面板", () => {
      if (!document.body) {
        const onReady = () => {
          buildPanel();
          window.removeEventListener("load", onReady);
        };
        window.addEventListener("load", onReady);
      } else {
        buildPanel();
      }
    });
  }
  function acm_handler() {
    promiseTimeout(waitForElm(".institution__name"), 200).then(function(data) {
      console.log(data);
      console.log("already login");
    }, function(err) {
      console.log("need to login");
      console.error(err);
      const match = window.location.href.match(/\/doi\/abs\/[a-zA-Z0-9./]+/);
      const redirectUri = match ? match[0] : "";
      const params = new URLSearchParams({
        idp: "https://idp.nju.edu.cn/idp/shibboleth",
        redirectUri,
        federationId: "urn:mace:shibboleth:carsifed"
      });
      window.location.href = "https://dl.acm.org/action/ssostart?" + params.toString();
    });
  }
  function ieee_handler() {
    promiseTimeout(waitForElm(".inst-name"), 200).then(function(data) {
      console.log(data);
      console.log("already login");
    }, function(err) {
      console.log("need to login");
      console.error(err);
      const params = new URLSearchParams({
        entityId: "https://idp.nju.edu.cn/idp/shibboleth",
        url: window.location.href
      });
      window.location.href = "https://ieeexplore.ieee.org/servlet/wayf.jsp?" + params.toString();
    });
  }
  function academic_handler() {
    const href = window.location.href;
    if (href.includes("ieee.org/abstract/document")) {
      ieee_handler();
    } else if (href.includes("acm.org")) {
      acm_handler();
    } else if (href.includes("sciencedirect")) {
      return;
    }
  }
  const HANDLERS = [
    { name: "njuauth", matches: ["https://authserver.nju.edu.cn/authserver/login*"], handler: njuauth_handler },
    { name: "njuhospital", matches: ["http://ndyy.nju.edu.cn/*"], handler: njuhospital_handler },
    { name: "zhtj", matches: ["https://zhtj.youth.cn/zhtj/"], handler: zhtj_handler },
    { name: "ehall", matches: ["https://ehall.nju.edu.cn/ywtb-portal/official/index.html*"], handler: ehall_handler },
    { name: "email", matches: ["https://mail.smail.nju.edu.cn/cgi-bin/loginpage*"], handler: email_trust_handler },
    { name: "wspj", matches: ["https://ehallapp.nju.edu.cn/gsapp/sys/wspjapp/*"], handler: wspj_handler },
    { name: "wechat", matches: ["https://epay.nju.edu.cn/epay/h5/*"], instant: true, handler: wechat_page_handler },
    { name: "smart_party", matches: ["https://zzbdjgz.nju.edu.cn/consumer/*"], instant: true, handler: smart_party_handler },
    { name: "academic", matches: ["*://ieeexplore.ieee.org/*", "*://dl.acm.org/*", "*://www.sciencedirect.com/*"], handler: academic_handler },
    { name: "wp_pdf", matches: ["*://*.nju.edu.cn/*"], handler: wp_pdf_player_handler }
  ];
  function globToRegExp(glob) {
    const special = /[.+^${}()|[\]\\]/g;
    const escaped = glob.replace(special, "\\$&");
    const replaced = escaped.replace(/\*/g, ".*").replace(/\?/g, ".");
    return new RegExp("^" + replaced + "$");
  }
  function findMatchingHandler(url) {
    for (const entry of HANDLERS) {
      for (const pattern of entry.matches) {
        const re = globToRegExp(pattern);
        if (re.test(url)) return entry;
      }
    }
    return null;
  }
  (function() {
    const url = window.location.href;
    settings_handler();
    const entry = findMatchingHandler(url);
    if (!entry) return;
    if (entry.instant) {
      try {
        entry.handler();
      } catch (e) {
        console.error("handler error", e);
      }
      return;
    }
    const run = () => {
      try {
        entry.handler();
      } catch (e) {
        console.error("handler error", e);
      }
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run);
  })();

})();