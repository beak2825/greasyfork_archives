// ==UserScript==
// @name         JPKI在留申请在线系统证明书模拟提交
// @name:ja      JPKI在留申請オンラインシステムにおける証明書の模擬提出
// @namespace    https://www.ras-immi.moj.go.jp/
// @version      1.0.5
// @description  模拟点击按钮后直接跳过证书验证并进行下一步操作；支持保存证书内容，可折叠并记住折叠状态
// @description:ja ボタンをクリックした後、証明書の検証をスキップして次の操作に進む。証明書の内容を保存し、折りたたんで折りたたみ状態を記憶することができます。
// @match        *://www.ras-immi.moj.go.jp/WC01/*
// @match        *://app.api.myna.go.jp/online-authorization-web/login/check-client*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521576/JPKI%E5%9C%A8%E7%95%99%E7%94%B3%E8%AF%B7%E5%9C%A8%E7%BA%BF%E7%B3%BB%E7%BB%9F%E8%AF%81%E6%98%8E%E4%B9%A6%E6%A8%A1%E6%8B%9F%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/521576/JPKI%E5%9C%A8%E7%95%99%E7%94%B3%E8%AF%B7%E5%9C%A8%E7%BA%BF%E7%B3%BB%E7%BB%9F%E8%AF%81%E6%98%8E%E4%B9%A6%E6%A8%A1%E6%8B%9F%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 检查当前URL，如果是myna.go.jp的登录检查页面，则修改loginType
  if (window.location.href.includes('app.api.myna.go.jp/online-authorization-web/login/check-client')) {
    modifyLoginType();
    return; // 在myna页面上只执行loginType修改，不执行其他功能
  }

  // 1. 读取 localStorage 中已经保存的证书信息
  let mockAuthCert = localStorage.getItem("mockAuthCert") || "";
  let mockSignCert = localStorage.getItem("mockSignCert") || "";

  // 2. 读取面板折叠状态（默认 "true"：显示面板；"false"：折叠）
  // 如果从未设置过，就将其初始化为 "true"
  let panelOpen = localStorage.getItem("panelOpen");
  if (panelOpen === null) {
    panelOpen = "true";
    localStorage.setItem("panelOpen", "true");
  }

  // 3. 将“现代化”CSS插入 <head> 中
  injectModernStyle();

  // 4. 创建证书设置面板 和 小圆标按钮
  const panel = createSettingPanel();
  const openBtn = createOpenButton();

  // 5. 根据 localStorage 中的 panelOpen 值，设置初始显示/隐藏
  if (panelOpen === "true") {
    // 显示面板，隐藏小圆标
    panel.style.display = "block";
    openBtn.style.display = "none";
  } else {
    // 隐藏面板，显示小圆标
    panel.style.display = "none";
    openBtn.style.display = "block";
  }

  // 6. 绑定页面按钮（登录/届出等）事件
  bindButtonEvents();

  /**
   * 面板样式
   */
  function injectModernStyle() {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
            /* 悬浮面板总体样式 */
            #custom-cert-panel {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 320px;
                padding: 15px 15px 10px;
                background-color: #fff;
                border: 1px solid #dadada;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
                z-index: 99999;
                color: #333;
            }
            /* 面板标题 */
            #custom-cert-panel h2 {
                margin: 0 0 10px 0;
                font-size: 16px;
                font-weight: 600;
                padding-right: 24px; /* 给右上角的关闭按钮留空间 */
            }
            /* 通用标签样式 */
            .modern-label {
                display: block;
                margin-top: 10px;
                font-weight: 600;
            }
            /* 文本域样式 */
            .modern-textarea {
                width: 100%;
                height: 50px;
                resize: vertical;
                padding: 6px 8px;
                margin-top: 4px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-family: inherit;
                font-size: 14px;
                box-sizing: border-box;
            }
            /* 按钮容器 */
            .button-container {
                margin-top: 12px;
                text-align: right;
            }
            /* 通用按钮样式 */
            .modern-button {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background-color: #387ef5;
                color: #fff;
                cursor: pointer;
                font-size: 14px;
                margin-right: 10px;
            }
            .modern-button:hover {
                background-color: #226ad4;
            }
            .modern-button:active {
                background-color: #1c56a5;
            }
            /* 关闭按钮 (右上角的 × ) */
            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 18px;
                color: #999;
            }
            .close-btn:hover {
                color: #666;
            }

            /* 小圆标按钮样式（折叠后的“+”按钮） */
            #open-panel-button {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 45px;
                height: 45px;
                background-color: #387ef5;
                color: #fff;
                border-radius: 22px;
                cursor: pointer;
                text-align: center;
                line-height: 40px;
                font-weight: bold;
                font-size: 26px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                user-select: none;
                z-index: 99998;
            }
            #open-panel-button:hover {
                background-color: #226ad4;
            }
            #open-panel-button:active {
                background-color: #1c56a5;
            }
        `;
    document.head.appendChild(styleEl);
  }

  /**
   * 面板
   */
  function createSettingPanel() {
    // 容器
    const panel = document.createElement("div");
    panel.id = "custom-cert-panel";

    // 关闭按钮
    const closeBtn = document.createElement("div");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => {
      // 隐藏面板
      panel.style.display = "none";
      // 显示小圆标
      openBtn.style.display = "block";
      // 记住折叠状态
      localStorage.setItem("panelOpen", "false");
    });
    panel.appendChild(closeBtn);

    // 标题
    const title = document.createElement("h2");
    title.innerText = "模拟证书设置";
    panel.appendChild(title);

    // 利用者証明書
    const labelAuth = document.createElement("label");
    labelAuth.className = "modern-label";
    labelAuth.innerText = "利用者証明書:";
    panel.appendChild(labelAuth);

    const inputAuth = document.createElement("textarea");
    inputAuth.className = "modern-textarea";
    inputAuth.value = mockAuthCert;
    panel.appendChild(inputAuth);

    // 署名証明書
    const labelSign = document.createElement("label");
    labelSign.className = "modern-label";
    labelSign.innerText = "署名証明書:";
    panel.appendChild(labelSign);

    const inputSign = document.createElement("textarea");
    inputSign.className = "modern-textarea";
    inputSign.value = mockSignCert;
    panel.appendChild(inputSign);

    // 按钮容器
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    // 保存按钮
    const saveButton = document.createElement("button");
    saveButton.className = "modern-button";
    saveButton.innerText = "保存";
    saveButton.addEventListener("click", function () {
      let authVal = inputAuth.value.trim();
      let signVal = inputSign.value.trim();

      // 如果包含 BEGIN/END，则自动去除头尾
      const regCert = /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/i;

      // 去除認証証明書头尾并去除换行
      if (regCert.test(authVal)) {
        authVal = authVal.replace(regCert, "$1").trim();
        authVal = authVal.replace(/\r?\n/g, "");
      }
      // 去除署名証明書头尾并去除换行
      if (regCert.test(signVal)) {
        signVal = signVal.replace(regCert, "$1").trim();
        signVal = signVal.replace(/\r?\n/g, "");
      }

      // 去除空行空格
      authVal = authVal.replace(/\s+/g, "");
      authVal = authVal.replace(/^\s*[\r\n]/gm, "");
      signVal = signVal.replace(/\s+/g, "");
      signVal = signVal.replace(/^\s*[\r\n]/gm, "");

      // 存入 localStorage
      localStorage.setItem("mockAuthCert", authVal);
      localStorage.setItem("mockSignCert", signVal);

      // 同步脚本内的变量
      mockAuthCert = authVal;
      mockSignCert = signVal;

      alert("证书内容已保存！（已自动去除 CERT 头尾和多余换行）");
    });
    buttonContainer.appendChild(saveButton);

    // 清空按钮
    const clearButton = document.createElement("button");
    clearButton.className = "modern-button";
    clearButton.innerText = "清空";
    clearButton.addEventListener("click", function () {
      localStorage.removeItem("mockAuthCert");
      localStorage.removeItem("mockSignCert");
      mockAuthCert = "";
      mockSignCert = "";
      inputAuth.value = "";
      inputSign.value = "";
      alert("证书内容已清空！");
    });
    buttonContainer.appendChild(clearButton);

    panel.appendChild(buttonContainer);

    // 把面板插入页面
    document.body.appendChild(panel);

    return panel;
  }

  /**
   * 创建折叠后的“小圆标”按钮，用于重新展开面板
   */
  function createOpenButton() {
    const openBtn = document.createElement("div");
    openBtn.id = "open-panel-button";
    openBtn.innerHTML = "+";
    // 先不设置 display: none，这里会通过脚本动态决定
    openBtn.style.display = "none";

    openBtn.addEventListener("click", () => {
      // 显示面板
      panel.style.display = "block";
      // 隐藏小圆标
      openBtn.style.display = "none";
      // 记住展开状态
      localStorage.setItem("panelOpen", "true");
    });

    document.body.appendChild(openBtn);
    return openBtn;
  }

  /**
   * 绑定页面按钮（登录/届出）事件：当用户点击时，拦截并自动填充表单
   */
  function bindButtonEvents() {
    // 监听 clickLogInKjnBtn
    waitForElement("[name=clickLogInKjnBtn]", function (button) {
      console.log("找到按钮 clickLogInKjnBtn");
      button.addEventListener("click", function (event) {
        event.preventDefault();
        simulateCertSuccess("clickLogInKjnBtn");
      });
    });

    // 监听 clickTurkKjnBtn
    waitForElement("[name=clickTurkKjnBtn]", function (button) {
      console.log("找到按钮 clickTurkKjnBtn");
      button.addEventListener("click", function (event) {
        event.preventDefault();
        simulateCertSuccess("clickTurkKjnBtn");
      });
    });
  }

  /**
   * 自动填充并提交表单的核心逻辑
   */
  function simulateCertSuccess(btnname) {
    console.log("模拟证书处理...");

    // 没有填写必要证书时，阻止操作
    if (!mockAuthCert) {
      alert("模拟证书：未填写認証用証明書");
      return;
    }
    if (btnname === "clickTurkKjnBtn" && !mockSignCert) {
      alert("模拟证书：未填写署名用証明書");
      return;
    }

    // 将证书写入隐藏字段（根据实际页面的字段名称来修改）
    document.getElementById("hdnUsrCert").value = mockAuthCert;
    if (btnname === "clickTurkKjnBtn") {
      document.getElementById("hdnSignCert").value = mockSignCert;
    }

    // 创建隐藏按钮用于提交
    const form = document.getElementById("WCAAS010Dto"); // 根据实际表单 ID 修改
    let input = document.getElementById(btnname);
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.id = btnname;
      input.name = btnname;
      form.appendChild(input);
    }

    // 提交表单
    form.submit();
    console.log("表单已提交！按钮：" + btnname);
  }

  /**
   * 等待某个选择器元素出现
   */
  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 500);
    }
  }

  /**
   * 修改loginType值为0
   */
  function modifyLoginType() {
    waitForElement("#loginType", function(element) {
      console.log("找到loginType元素，修改值为0");
      element.value = "0";
      console.log("loginType值已修改为:", element.value);
    });
  }
})();
