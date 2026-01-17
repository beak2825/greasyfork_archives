// ==UserScript==
// @name         海角社区
// @name:zh-TW   海角社區
// @namespace    http://tampermonkey.net/
// @version      v1.93
// @description  🚀新功能上线，不浪费一秒，会员随时停启💰。付费内容无限次观看、便捷下载和即时分享链接。受益于保存的登录信息、媒体帖子视觉提示(红色标题)、内容自动展开和完全无广告的环境🚀。
// @description:zh-TW 🚀新功能上線，不浪費一秒，會員隨時停啟💰。付費內容無限次觀看、便捷下載和即時分享連結受益於保存的登錄信息、媒體帖子視覺提示（紅色標題）、內容自動展開和完全無廣告的環境🚀。
// @author            lx
// @match          https://hjcx.org/*
// @match          https://hjcx.org/*
// @match          https://www.huajitv.com/*
// @match          https://huajitv.com/*
// @match          https://www.haijiao.com/*
// @match          https://haijiao.com/*
// @match          https://haijiao.ai/*
// @match          */post/details?pid=*
// @exclude			  *://www.haijiaom.cc/*
// @run-at 			  document-start
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @connect 		  haijiao.live
// @charset		      UTF-8
// @antifeature       payment
// @license           MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/542833/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/542833/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==
(function () {
  let baseUrl = "https://www.haijiaom.cc/api/app-api";
  // let baseUrl = "http://127.0.0.1:8080/api/app-api";
  let vipUser = {};
  let isPlaying = false;
  let siteCode = "HJSQ";
  let sDataId = "";
  let slefVideo = {
    videoPlayUrl: "",
    videoDuration: 0,
    id: 0,
    articleId: 0,
    videoBaseUrl: "",
    videoArticleId: "",
    downloadUrl: "",
    isNormal: true,
  };
  let hjsqUserKye = "hjsq_gm_key";
  let baseDownadloadUrl = baseUrl + "/business/download/down.m3u8?token=";
  let m3u8Url = "";
  let hasPrev = false;
  let m3u8Content = "";
  waitForPageLoad()
    .then((body) => {
      fetchUserInfo();
      createNavbar(body);
      removeAdds();
      initHlsPlayer();
    })
    .catch((error) => {
      console.error("Failed to load page:", error);
    });

  //创建导航栏
  function createNavbar(body) {
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
    document.head.appendChild(fontAwesome);

    const navbar = document.createElement("div");
    navbar.id = "custom-navbar";
    navbar.style.cssText = `
    position: fixed;
    top: 20%;
    right:-20px;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0);
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    z-index: 99999;
  `;
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 20px;
  `;
    // Add event.preventDefault() to button actions
    const buttons = [
      {
        id: "personalInfoBtn",
        icon: "fas fa-user",
        action: (e) => {
          e.preventDefault();
          createPersonalInfoDialog();
        },
      },
      {
        id: "downloadBtn",
        icon: "fas fa-download",
        action: (e) => {
          e.preventDefault();
          createDownloadDialog();
        },
      },
      {
        id: "playBtn",
        icon: "fas fa-play",
        action: (e) => {
          e.preventDefault();
          togglePlay();
        },
      },
      {
        id: "toggleBtn",
        icon: "fas fa-eye-slash",
        action: (e) => {
          e.preventDefault();
          toggleVisibility();
        },
      },
    ];

    const buttonStyle = `
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background: rgb(0, 0, 0,0.2);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  `;
    buttons.forEach((btn) => {
      const button = document.createElement("button");
      button.id = btn.id;
      button.innerHTML = `<i class="${btn.icon}"></i>`;
      button.style.cssText = buttonStyle;
      button.addEventListener("click", btn.action);
      buttonsContainer.appendChild(button);
    });
    navbar.appendChild(buttonsContainer);
    body.appendChild(navbar);

    // Floating toggle button
    const floatingBtn = document.createElement("button");
    floatingBtn.id = "floating-toggle-btn";
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 20px;
        height: 20px;
        border: none;
        border-radius: 50%;
        background: #4a90e2;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        z-index: 9998;
      `;
    floatingBtn.innerHTML = '<i class="fas fa-eye"></i>';
    floatingBtn.addEventListener("click", toggleVisibility);
    document.body.appendChild(floatingBtn);
  }
  // 等待页面加载完成
  function createLoginFormView() {
    const loginDialog = document.createElement("div");
    let existingDialog = document.querySelector('[id^="login-dialog"]');
    if (existingDialog) return;
    loginDialog.innerHTML = `
    <style>
      .login-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        width: 90%;
        max-width: 400px;
        box-sizing: border-box;
      }

      .login-input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
      }

      .login-btn {
        width: 100%;
        padding: 12px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 15px;
        cursor: pointer;
      }

      .login-error {
        color: #ff4d4f;
        font-size: 13px;
        margin-top: 8px;
      }

      @media (max-width: 480px) {
        .login-container {
          padding: 20px;
          width: 70%;
        }

        h2 {
          font-size: 20px !important;
          margin-bottom: 8px !important;
        }

        p {
          font-size: 13px hai;
        }

        .login-input {
          padding: 10px;
          font-size: 13px;
        }

        .login-btn {
          padding: 10px;
          font-size: 14px;
        }
        .home-link {
          text-align: center;
          margin-top: 15px;
        }
        .home-link a {
          color: #4a90e2;
          text-decoration: none;
          font-size: 14px;
        }
        .home-link a:hover {
          text-decoration: underline;
        }
      }
    </style>

    <div class="login-container" id="login-dialog">
      <div style="text-align: right;">
        <span class="dialog-close" style="cursor: pointer; font-size: 18px;">×</span>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="margin: 0 0 8px; color: #333; font-size: 22px; font-weight: 600;">欢迎登录</h2>
        <p style="margin: 0; color: #666; font-size: 14px;">请输入您的账号密码</p>
      </div>

      <div style="margin-bottom: 15px;">
        <input type="text" id="username" placeholder="用户名" class="login-input">
      </div>

      <div style="margin-bottom: 20px;">
        <input type="password" id="password" placeholder="密码" class="login-input">
      </div>

      <button id="loginSubmit" class="login-btn">
        <span id="loginText">登 录</span>
        <span id="loginLoading" style="display:none;">
          <i class="fas fa-spinner fa-spin"></i>
        </span>
      </button>
      <div class="home-link">
        <a href="https://www.haijiaom.cc" id="goHome">
        <i class="fas fa-home"></i> 会员注册
         </a>
      </div>

      <div id="loginError" class="login-error"></div>
    </div>
  `;

    document.body.appendChild(loginDialog);
    // Make login dialog responsive

    // Close dialog when clicking X
    document.querySelector(".dialog-close").addEventListener("click", () => {
      loginDialog.remove();
    });

    // 添加输入框焦点效果
    const inputs = loginDialog.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.style.borderColor = "#4a90e2";
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "#ddd";
      });
    });

    document
      .getElementById("loginSubmit")
      .addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const loginBtn = document.getElementById("loginSubmit");
        const loginText = document.getElementById("loginText");
        const loginLoading = document.getElementById("loginLoading");

        loginText.style.display = "none";
        loginLoading.style.display = "inline-block";
        loginBtn.disabled = true;
        if (!username || !password) {
          const errorDiv = document.getElementById("loginError");
          errorDiv.textContent = "请输入用户名和密码";
          errorDiv.style.display = "block";
          return;
        }

        try {
          const response = await fetch(baseUrl + "/business/member/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (data.code == 200 && data.data.access_token) {
            GM_setValue("myToken", data.data.access_token);
            // localStorage.setItem("token", data.accessToken);
            loginDialog.remove();
          } else {
            throw new Error(data.msg || "登录失败");
          }
        } catch (error) {
          const errorDiv = document.getElementById("loginError");
          errorDiv.textContent = error.message;
          errorDiv.style.display = "block";
          loginText.style.display = "inline-block";
          loginLoading.style.display = "none";
          loginBtn.disabled = false;
        }
      });
  }

  function createLoginForm() {
    // 防止重复创建
    if (document.getElementById("login-container-unique-v8")) {
      return;
    }

    // 创建主容器
    const container = document.createElement("div");
    container.id = "login-container-unique-v8";

    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

            #login-container-unique-v8 {
                all: initial !important;

                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: transparent !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                z-index: 2147483647 !important;
                font-family: 'Poppins', sans-serif !important;
                font-size: 12px !important;

                opacity: 0;
                transition: opacity 0.5s ease !important;
            }

            #login-container-unique-v8 * {
                font-family: inherit !important;
                box-sizing: border-box !important;
            }

            .login-box-v8 {
                background: rgba(75, 75, 214, 0.85) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border-radius: 20px !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
                padding: 16px 40px !important;
                width: 60% !important;
                max-width: 400px !important;
                text-align: center !important;
                color: white !important;
                position: relative !important;

                transform: scale(0.9);
                transition: transform 0.5s ease !important;
            }

            .login-title-v8 {
                font-size: 16px !important;
                font-weight: 600 !important;
                margin-bottom: 32px !important;
            }

            .input-group-v8 {
                position: relative !important;
                margin-bottom: 24px !important;
            }

            .login-input-v8 {
                width: 100% !important;
                padding: 6px 6px 6px 48px !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                border-radius: 10px !important;
                font-size: 12px !important;
                background: rgba(255, 255, 255, 0.2) !important;
                color: white !important;
                transition: background-color 0.3s, box-shadow 0.3s !important;
            }

            .login-input-v8::placeholder {
                color: rgba(255, 255, 255, 0.7) !important;
            }

            .login-input-v8:focus {
                outline: none !important;
                background: rgba(255, 255, 255, 0.3) !important;
                box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5) !important;
            }

            .input-icon-v8 {
                position: absolute !important;
                left: 16px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                color: rgba(255, 255, 255, 0.8) !important;
                width: 20px !important;
                height: 20px !important;
            }

            .login-button-v8 {
                width: 100% !important;
                padding: 6px !important;
                border: none !important;
                border-radius: 10px !important;
                background: #ff6b6b !important;
                color: white !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: background-color 0.3s, transform 0.2s !important;
                margin-bottom: 16px !important; /* 为下方的链接留出空间 */
            }

            .login-button-v8:hover {
                background: #ff4757 !important;
                transform: translateY(-2px) !important;
            }

            .close-button-v8 {
                position: absolute !important;
                top: 15px !important;
                right: 15px !important;
                background: none !important;
                border: none !important;
                font-size: 16px !important;
                color: rgba(255, 255, 255, 0.8) !important;
                cursor: pointer !important;
                transition: color 0.3s, transform 0.3s !important;
                line-height: 1 !important;
                padding: 0 !important;
            }

            .close-button-v8:hover {
                color: white !important;
                transform: rotate(90deg) !important;
            }

            /* 新增: 注册链接区域样式 */
            .extra-links-v8 {
                font-size: 12px !important;
                color: rgba(255, 255, 255, 0.8) !important;
            }

            .register-link-v8 {
                color: #ff8c8c !important;
                text-decoration: none !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: color 0.3s !important;
            }

            .register-link-v8:hover {
                text-decoration: underline !important;
                color: #ffffff !important;
            }

            .error-message-v8 {
                color: #ffcdd2 !important;
                font-size: 14px !important;
                text-align: left !important;
                margin-top: -16px !important; /* 放在输入框和按钮之间 */
                margin-bottom: 16px !important;
                min-height: 21px !important; /* 预留空间防止布局抖动 */
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.3s ease-in-out !important;
            }

            .error-message-v8.visible {
                visibility: visible;
                opacity: 1;
            }

        </style>
        <div class="login-box-v8">
            <button class="close-button-v8">&times;</button>
            <h2 class="login-title-v8">欢迎回来</h2>
            <div class="input-group-v8">
                <svg class="input-icon-v8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 2.5a2.5 2.5 0 012.5 2.5V7h-5V7a2.5 2.5 0 012.5-2.5z"></path></svg>
                <input type="text" class="login-input-v8" placeholder="用户名">
            </div>
            <div class="input-group-v8">
                <svg class="input-icon-v8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                <input type="password" class="login-input-v8" placeholder="密码">
            </div>
            <p class="error-message-v8"></p>
            <button class="login-button-v8">登录</button>
            <!-- 新增: 注册链接 -->
            <div class="extra-links-v8">
                <span>没有账户? <a class="register-link-v8">立即注册</a></span>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    const loginBox = container.querySelector(".login-box-v8");
    const errorElement = container.querySelector(".error-message-v8");
    requestAnimationFrame(() => {
      container.style.opacity = "1";
      if (loginBox) {
        loginBox.style.transform = "scale(1)";
      }
    });
    const showError = (message) => {
      errorElement.textContent = message;
      errorElement.classList.add("visible");
    };

    const hideError = () => {
      errorElement.classList.remove("visible");
    };
    const close = () => {
      container.style.opacity = "0";
      if (loginBox) {
        loginBox.style.transform = "scale(0.9)";
      }
      setTimeout(() => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }, 500);
    };
    container.querySelector(".close-button-v8").onclick = close;
    container.querySelector(".login-button-v8").onclick = async () => {
      const username = container.querySelector('input[type="text"]').value;
      const password = container.querySelector('input[type="password"]').value;
      if (!username || !password) {
        showError("请输入用户名和密码！");
        return;
      }
      try {
        const response = await fetch(baseUrl + "/business/member/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.code == 200 && data.data.access_token) {
          GM_setValue("myToken", data.data.access_token);
          // localStorage.setItem("token", data.accessToken);
          fetchUserInfo();
          container.remove();
        } else {
          throw new Error(data.msg || "登录失败");
        }
      } catch (error) {
        showError("用户名或密码错误。");
      }
    };

    // 新增: 注册链接点击事件
    container.querySelector(".register-link-v8").onclick = (e) => {
      e.preventDefault();
      window.location.href = "https://www.haijiaom.cc";
      // 在这里可以添加跳转到注册页或显示注册模态框的逻辑
    };
  }

  function createPersonalInfoDialog() {
    if (!checkToken()) {
      return;
    }
    let featureEnabled = GM_getValue("feature_enabled", true);

    let memberLvel = vipUser.sites.filter((item) => {
      return item.siteCode === siteCode;
    });

    if (memberLvel[0]) {
      featureEnabled = memberLvel[0].scriptOpen;
    }

    const dialog = document.createElement("div");
    dialog.innerHTML = `
        <style>
            .info-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                width: 90%;
                max-width: 320px;
                box-sizing: border-box;
                z-index: 10000;
            }

            .info-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .info-close {
                width: 24px;
                height: 24px;
                border: none;
                border-radius: 50%;
                background: #f5f5f5;
                color: #666;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .info-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #4a90e2;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
            }

            .info-stats {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 15px 0;
            }

            .info-stat-item {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 8px;
                text-align: center;
            }

            .info-actions {
                display: grid;
                gap: 10px;
                margin-top: 15px;
            }

            .vip-btn {
                background: #4a90e2;
                color: white;
                padding: 10px;
                border-radius: 8px;
                text-decoration: none;
                text-align: center;
                font-size: 14px;
            }

            .logout-btn {
                background: #f44336;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
            }

            .expired-notice {
                background: #fff3cd;
                color: #856404;
                padding: 10px;
                border-radius: 8px;
                margin: 10px 0;
                font-size: 13px;
            }
            .script-settings {
                border-top: 1px solid #f0f0f0;
                margin-top: 15px;
                padding-top: 10px;
            }
            .setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
            }
            .setting-item span {
                font-size: 14px;
                color: #333;
            }
            .switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: #4a90e2;
            }
            input:checked + .slider:before {
                transform: translateX(20px);
            }
        </style>

        <div class="info-dialog">
            <div class="info-header">
                <h3 style="margin:0">个人信息</h3>
                <button class="info-close">×</button>
            </div>

            <div class="info-avatar">
                <i class="fas fa-user fa-2x"></i>
            </div>

            <div style="text-align:center">
                <h2 style="margin:0;font-size:18px">${
                  vipUser.username || "未登录"
                }</h2>
                <p style="margin:5px 0;color:#666;font-size:13px">
                    ${vipUser.vipLevel || "普通用户"}
                </p>
            </div>

            <div class="info-stats">
                <div class="info-stat-item">
                    <div style="font-size:18px;color:#4a90e2;font-weight:bold">
                        ${vipUser.downloadNum || 0}
                    </div>
                    <div style="font-size:12px;color:#666">下载次数</div>
                </div>
                <div class="info-stat-item">
                    <div style="font-size:18px;color:#4a90e2;font-weight:bold">
                        ${vipUser.watchNum || 0}
                    </div>
                    <div style="font-size:12px;color:#666">观看次数</div>
                </div>
            </div>

            ${
              vipUser.expireTime
                ? `
                <div class="expired-notice">
                    ${
                      new Date(vipUser.expireTime) > new Date()
                        ? `会员有效期至：${new Date(
                            vipUser.expireTime
                          ).toLocaleDateString()}`
                        : "您的会员已过期，请重新开通"
                    }
                </div>
            `
                : ""
            }

            <div class="script-settings">
                <div class="setting-item">
                    <span>脚本开关</span>
                    <label class="switch">
                        <input type="checkbox" id="featureToggle" ${
                          featureEnabled ? "checked" : ""
                        }>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="info-actions">
                <a href="https://www.haijiaom.cc/" class="vip-btn">
                    <i class="fas fa-crown"></i>
                    ${
                      vipUser.expireTime &&
                      new Date(vipUser.expireTime) > new Date()
                        ? "续费会员"
                        : "开通会员"
                    }
                </a>
                <button class="logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> 退出登录
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    const featureToggle = dialog.querySelector("#featureToggle");
    if (featureToggle) {
      featureToggle.addEventListener("change", async () => {
        const isEnabled = featureToggle.checked;
        featureToggle.disabled = true;
        try {
          const result = await putAsync(
            baseUrl + "/business/member/script-operation",
            {
              scriptOpen: isEnabled,
              siteCode: siteCode,
            }
          );
          if (result.code == 200) {
            GM_setValue("feature_enabled", isEnabled);

            showApiMessage(
              `功能已${isEnabled ? "开启" : "关闭"}，页面即将刷新...`
            );
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showApiMessage(result.msg || "操作失败", "error");
            featureToggle.checked = !isEnabled;
          }
        } catch (error) {
          showApiMessage("请求失败，请检查网络连接", "error");
          featureToggle.checked = !isEnabled;
        } finally {
          featureToggle.disabled = false;
        }
      });
    }

    // Add logout handler
    dialog.querySelector("#logoutBtn").addEventListener("click", () => {
      GM_setValue("myToken", "");
      dialog.remove();

      setTimeout(() => window.location.reload(), 1000);
    });

    // Add close handler
    dialog.querySelector(".info-close").addEventListener("click", () => {
      dialog.remove();
    });
  }
  const baseTools = [
    {
      name: "在线下载1",
      icon: "fas fa-bolt",
      url: "https://tools.thatwind.com/tool/m3u8downloader",
      clients: ["windows", "mac"],
    },

    {
      name: "在线下载2",
      icon: "fas fa-cloud-download-alt",
      url: "http://tools.bugscaner.com/m3u8.html",
      clients: ["windows", "mac", "linux"],
    },
  ];

  // 根据客户端类型获取工具列表
  function getDownloadTools() {
    const client = detectClient();
    const mobileTools = [
      {
        name: "安卓视频下载软件",
        icon: "fas fa-mobile-alt",
        url: "market://details?id=com.xunlei.downloadprovider",
        clients: ["android"],
      },
      {
        name: "苹果视频下载软件",
        icon: "fas fa-file-download",
        url: "https://apps.apple.com/cn/app/m3u8-mpjex/id6449724938",
        clients: ["ios"],
      },
    ];

    const tools = [...baseTools, ...mobileTools].filter((tool) =>
      tool.clients.includes(client)
    );

    return tools;
  }

  // 检测客户端类型
  function detectClient() {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/i.test(ua)) return "android";
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    if (/macintosh/i.test(ua)) return "mac";
    if (/linux/i.test(ua)) return "linux";
    return "windows";
  }

  function createDownloadDialog(downloadUrl) {
    if (!checkToken()) {
      return;
    }
    const firstDialog = document.createElement("div");
    firstDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 25px;
      padding-top: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      z-index: 10000;
      min-width: 320px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      animation: fadeIn 0.3s ease;
  `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
      }
      .dialog-btn {
          padding: 10px 24px;
          margin: 0 8px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
      }
      .dialog-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .primary-btn {
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
      }
      .secondary-btn {
          background: #f5f5f5;
          color: #666;
      }
      .dialog-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f5f5f5;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #666;
          font-size: 14px;
      }
      .dialog-close:hover {
          background: #e0e0e0;
          transform: rotate(90deg);
      }
  `;
    document.head.appendChild(styleSheet);

    firstDialog.innerHTML = `
      <button class="dialog-close">✕</button>
      <h3 style="margin: 0 0 20px; font-size: 20px; color: #333; font-weight: 500;">下载确认</h3>
      <p style="margin: 0 0 8px; color: #666; font-size: 15px;">本次下载将消耗1次下载机会</p>
      <p style="margin: 0 0 25px; font-size: 15px;">
          剩余下载次数：<span style="color: #ff4444; font-weight: 600;">${
            vipUser.downloadNum || "免费"
          }</span>
      </p>
      <div style="margin-top: 25px;">
          <button id="confirmDownload" class="dialog-btn primary-btn">确认下载</button>
          <button id="cancelDownload" class="dialog-btn secondary-btn">取消</button>
      </div>
  `;

    document.body.appendChild(firstDialog);

    function showDownloadOptions() {
      const secondDialog = document.createElement("div");
      secondDialog.style.cssText = firstDialog.style.cssText;

      const downloadTools = getDownloadTools();
      const toolButtons = downloadTools
        .map(
          (tool) => `
      <button id="${tool.name}" class="dialog-btn primary-btn" style="
          width: 100%;
          margin: 8px 0;
          background: linear-gradient(135deg, #4CAF50, #45a049);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
      ">
          <i class="${tool.icon}"></i>${tool.name}
      </button>
  `
        )
        .join("");

      secondDialog.innerHTML = `
      <button class="dialog-close">✕</button>
      <h3 style="margin: 0 0 20px; font-size: 20px; color: #333; font-weight: 500;">下载选项</h3>
      <div style="margin: 20px 0;">
          <button id="copyLink" class="dialog-btn primary-btn" style="
              width: 100%;
              margin: 8px 0;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
          ">
              <i class="fas fa-copy"></i>复制下载链接
          </button>
          ${toolButtons}
      </div>
  `;

      document.body.appendChild(secondDialog);

      // 为每个工具添加点击事件
      downloadTools.forEach((tool) => {
        document.getElementById(tool.name)?.addEventListener("click", () => {
          window.open(tool.url, "_blank");
        });
      });

      // 复制链接事件
      document.getElementById("copyLink").addEventListener("click", () => {
        navigator.clipboard.writeText(slefVideo.downloadUrl);
        console.log("下载链接已复制到剪贴板", slefVideo.downloadUrl);
        showApiMessage("下载链接已复制到剪贴板");
      });

      // 关闭按钮事件
      secondDialog
        .querySelector(".dialog-close")
        .addEventListener("click", () => {
          secondDialog.remove();
        });
    }

    // 确认下载事件
    document
      .getElementById("confirmDownload")
      .addEventListener("click", async () => {
        firstDialog.remove();
        if (slefVideo.isNormal) {
          slefVideo.videoPlayUrl = slefVideo.downloadUrl;
        } else {
          let result = await gcreateDownloadUrl();
          if (result.code == 200) {
            slefVideo.downloadUrl = baseDownadloadUrl + result.data;
            if (vipUser.downloadNum == 0) {
              showApiMessage("下载次数已用完", "error");
              return;
            }
          }
        }
        showDownloadOptions();
      });

    // 取消下载事件
    document.getElementById("cancelDownload").addEventListener("click", () => {
      firstDialog.remove();
    });

    // 关闭按钮事件
    firstDialog.querySelector(".dialog-close").addEventListener("click", () => {
      firstDialog.remove();
    });
  }

  function initHlsPlayer() {
    const hlsScript = document.createElement("script");
    hlsScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js";
    document.head.appendChild(hlsScript);

    const playerContainer = document.createElement("div");
    playerContainer.id = "hls-player-container";
    playerContainer.style.cssText = `
      position: fixed;
      top: 0;
      bottom: 0;
      left:0;
      right:0;
      background: rgba(0, 0, 0, 1);
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 9996;
      display: none;
  `;
    // Add close button for player
    const closeButton = document.createElement("button");
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size:16px;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeButton.onclick = () => {
      window.hlsPlayer.hide();
    };
    playerContainer.appendChild(closeButton);
    let currentUrl = "";

    // Create video element
    const video = document.createElement("video");
    video.id = "hls-video";
    video.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;
    video.controls = true;

    playerContainer.appendChild(video);
    document.body.appendChild(playerContainer);
    hlsScript.onload = () => {
      window.hlsPlayer = {
        setContent: (input) => {
          if (isM3U8Content(input)) {
            // Handle M3U8 content string
            currentUrl = createBlobUrl(input);
          } else {
            // Handle URL
            currentUrl = input;
          }
        },
        play: () => {
          if (!currentUrl) {
            console.error("Please set URL first");
            return;
          }
          playerContainer.style.display = "block";
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(currentUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play();
              isPlaying = true;
              updatePlayButton();
            });
          }
        },
        pause: () => {
          video.pause();
          isPlaying = false;
          updatePlayButton();
        },
        toggle: () => {
          if (isPlaying) {
            window.hlsPlayer.pause();
          } else {
            window.hlsPlayer.play();
          }
        },
        hide: () => {
          playerContainer.style.display = "none";
          video.pause();
          isPlaying = false;
          updatePlayButton();
          toggleVisibility();
        },
      };
    };
  }
  function isM3U8Content(str) {
    return str.trim().startsWith("#EXTM3U");
  }
  function updatePlayButton() {
    const playBtn = document.getElementById("playBtn");
    if (playBtn) {
      playBtn.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
      playBtn.style.background = isPlaying ? "#4CAF50" : "#4a90e2";
    }
  }
  async function togglePlay() {
    if (!(await checkToken())) {
      return;
    }
    if (!(await checkPermission())) {
      return;
    }
    if (slefVideo.videoPlayUrl == "") {
      showApiMessage(
        "当前页面没有视频，或者当前视频无需VIP权限，请在原有网站观看",
        "error"
      );
      return;
    }
    if (slefVideo.isNormal) {
      window.hlsPlayer.setContent(slefVideo.videoPlayUrl);
      window.hlsPlayer.play();
    } else {
      if (slefVideo.m3u8Content == "") {
        showApiMessage("视频解析失败，请尝试刷新", "error");
        return;
      }
      window.hlsPlayer.setContent(m3u8Content);
      window.hlsPlayer.play();
    }

    toggleVisibility();
  }
  function generateM3U8FromVideo(slefVideo, duration) {
    // Generate segment duration between 1.0 and 1.25 seconds
    let segmentDuration = (Math.random() * 0.25 + 1.0).toFixed(6);
    const totalSegments = Math.ceil(duration / segmentDuration);

    let m3u8Content = "#EXTM3U" + "\r\n";
    m3u8Content += "#EXT-X-VERSION:3" + "\r\n";
    m3u8Content += "#EXT-X-TARGETDURATION:11" + "\r\n";
    m3u8Content += "#EXT-X-MEDIA-SEQUENCE:0" + "\r\n";

    // 添加加密信息
    if (slefVideo.uri) {
      m3u8Content += `#EXT-X-KEY:METHOD=AES-128,URI="${slefVideo.videoBaseUrl}/${slefVideo.uri}"`;
      if (slefVideo.iv) {
        m3u8Content += `,IV=0x${slefVideo.iv}`;
      }
      m3u8Content += "\n";
    }

    // 生成视频片段
    for (let i = 0; i < totalSegments; i++) {
      const remainingDuration = duration - i * segmentDuration;
      const currentSegmentDuration = Math.min(
        segmentDuration,
        remainingDuration
      );

      m3u8Content += `#EXTINF:${currentSegmentDuration},\n`;
      m3u8Content += `${slefVideo.videoBaseUrl}/${slefVideo.tsFileName}${i}.ts\n`;
    }

    m3u8Content += "#EXT-X-ENDLIST";
    return m3u8Content;
  }
  function createBlobUrl(m3u8Content) {
    const blob = new Blob([m3u8Content], { type: "application/x-mpegURL" });
    return URL.createObjectURL(blob);
  }
  function serializeM3u8() {
    let m3u8Content = "";
    fetch(m3u8Url, {
      method: "GET",
    })
      .then((res) => res.text())
      .then((data) => {
        m3u8Content = data;
        let lines = m3u8Content.split("\n");
        slefVideo.m3u8Url = lines[lines.length - 2];
      });
  }

  function toggleVisibility() {
    const navbar = document.getElementById("custom-navbar");
    const floatingBtn = document.getElementById("floating-toggle-btn");
    const isVisible = navbar.style.display !== "none";
    navbar.style.display = isVisible ? "none" : "block";
    floatingBtn.style.display = isVisible ? "flex" : "none";
  }
  const OriginalXHR = unsafeWindow.XMLHttpRequest || window.XMLHttpRequest;

  function CustomXHR() {
    const xhr = new OriginalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    let requestURL = "";

    let modifiedRequestURL = "";

    const urlMappings = {
      "videos/v2/getUrl": (url) => {
        // Example: Change URL for video requests
        return url.replace(
          url,
          "https://api.qianyuewenhua.xyz/videos/getPreUrl"
        );
      },
    };

    function modifyURL(originalURL) {
      for (const [pattern, modifier] of Object.entries(urlMappings)) {
        if (originalURL.includes(pattern)) {
          modifiedRequestURL = modifier(originalURL);
          return modifiedRequestURL;
        }
      }
      return originalURL;
    }
    // Add URL modifications before open() is called
    xhr.open = function () {
      requestURL = arguments[1];
      let modifiedURL = modifyURL(requestURL);
      arguments[1] = modifiedURL;
      return originalOpen.apply(this, arguments);
    };

    // xhr.open = function () {
    //   requestURL = arguments[1];

    //   return originalOpen.apply(this, arguments);
    // };

    xhr.send = function () {
      const originalOnReadyStateChange = xhr.onreadystatechange;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              // URL pattern matching
              Object.keys(urlPatterns).forEach((pattern) => {
                if (new RegExp(pattern).test(requestURL)) {
                  let response = JSON.parse(xhr.responseText);
                  const modifiedResponse = urlPatterns[pattern](response);
                  if (modifiedResponse) {
                    Object.defineProperty(xhr, "response", {
                      value: JSON.stringify(modifiedResponse),
                    });
                    Object.defineProperty(xhr, "responseText", {
                      value: JSON.stringify(modifiedResponse),
                    });
                  }
                  console.log(
                    "[Modified Response]:",
                    requestURL,
                    modifiedResponse
                  );
                }
              });
            } catch (error) {
              console.error("[XHR Error]:", error, requestURL);
            }
          }
        }

        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };

      return originalSend.apply(this, arguments);
    };

    return xhr;
  }

  if (GM_getValue("feature_enabled", true)) {
    // Replace XMLHttpRequest
    if (typeof unsafeWindow !== "undefined") {
      unsafeWindow.XMLHttpRequest = CustomXHR;
    } else {
      window.XMLHttpRequest = CustomXHR;
    }
  }
  const urlPatterns = {
    "api\\/video\\/checkVideoCanPlay(\\?[^/]*)?$": (response) => {
      let decodeData = response.data;

      let jsonStr = decodeURIComponent(escape(atob(atob(atob(response.data)))));
      let objectData = JSON.parse(jsonStr, `utf-8`);
      const freeVideo = { type: 1, amount: 0, money_type: 0, vip: 0 };
      response.data = Object.assign({}, objectData, freeVideo);
      return response;
    },
    "api\\/banner\\/banner_list(\\?[^/]*)?$": (response) => {
      return null;
    },
    "videos\\/getInfo(\\?[^/]*)?$": (response) => {
      if (checkToken() && hasPrev) {
        response.data.canPlay = true;
        slefVideo.id = response.data.info.id;
      }
      return response;
    },
    "videos\\/v2\\/getUrl(\\?[^/]*)?$": (response) => {
      if (checkToken() && hasPrev) {
        response.data.url = response.data.url.replace(
          /start=\d+\&end=\d+\&/,
          ""
        );
        m3u8Url = response.data.url;
        serializeM3u8();
      }
      return response;
    },
    "api\\/favorite\\/v2\\/folderList(\\?[^/]*)?$": (response) => {
      return null;
    },
    "api\\/topic\\/\\d+": (response) => {
      let decodeData = response.data;
      analysisVideo(decodeData);
      return response;
    },
    "api\\/topic\\/hot\\/topics(\\?.*)?$": (response) => {
      let decodeData = response.data;
      let refStr = analysisTitle(decodeData);
      response.data = btoaUnicode(refStr);
      return response;
    },
    "api\\/login\\/signin": (response) => {
      if (response.success) {
        let username = $(".login-form input").first().val();
        let password = $(".login-form input").eq(1).val();
        GM_setValue(hjsqUserKye, JSON.stringify({ username, password }));
      }
      return response;
    },
  };
  function btoaUnicode(str) {
    return btoa(
      btoa(
        btoa(
          encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
          })
        )
      )
    );
  }
  // 你想要填充的用户名和密码
  let username = "";
  let password = "";

  // 目标选择器
  const formSelector = ".login-form"; // 根据实际情况修改
  const inputSelector = "input";

  // 当找到输入框时进行填充
  function fillInputsIfAvailable(mutationsList, observer) {
    // 检查是否找到了目标表单
    const form = document.querySelector(formSelector);
    if (form) {
      // 获取所有的 input 元素
      let user = JSON.parse(GM_getValue(hjsqUserKye));
      if (user) {
        username = user.username || username;
        password = user.password || password;
      }
      const inputs = form.querySelectorAll(inputSelector);
      if (inputs.length >= 2) {
        // 停止观察，因为我们已经找到了需要的元素
        observer.disconnect();

        // 填充用户名和密码
        inputs[0].value = username;
        inputs[1].value = password;

        // 触发事件，确保页面上的任何事件监听器都能捕获到值的变化
        ["input", "change"].forEach((eventType) => {
          inputs[0].dispatchEvent(new Event(eventType));
          inputs[1].dispatchEvent(new Event(eventType));
        });
      }
    }
  }

  // 创建一个 MutationObserver 实例，传递回调函数
  const observer = new MutationObserver(fillInputsIfAvailable);

  // 配置观察选项：
  const config = { attributes: false, childList: true, subtree: true };

  // 选择需要观察的节点（在这里是整个 body，但你可以根据情况调整）
  const targetNode = document.body;

  if (GM_getValue("feature_enabled", true)) {
    // 开始观察目标节点
    observer.observe(targetNode, config);

    // 初始检查一次，以防元素已经存在
    fillInputsIfAvailable([], observer);
  }
  async function analysisVideo(content) {
    let jsonStr = decodeURIComponent(escape(atob(atob(atob(content)))));
    let objectData = JSON.parse(jsonStr, `utf-8`);
    slefVideo.articleId = objectData.topicId;
    objectData.attachments.forEach(async (item) => {
      if (item.category == "video" && item.remoteUrl != "") {
        slefVideo.videoPlayUrl = item.remoteUrl;
        slefVideo.m3u8Url = item.remoteUrl;
        slefVideo.videoDuration = item.video_time_length;
        slefVideo.id = item.id;
        slefVideo.isNormal = false;
        // Extract URI from preview URL
      }
      if (item.category == "video" && item.remoteUrl == "") {
        const uid = getCookie("uid");
        const token = getCookie("token");
        await analysisNormalVideo(uid, token, item.id, objectData.topicId);
      }
    });
    if (!slefVideo.isNormal) {
      let params = Object.assign(
        {},
        {
          remoteUrl: slefVideo.videoPlayUrl,
          videoArticleId: slefVideo.articleId,
          videoDuration: slefVideo.videoDuration,
          videoId: slefVideo.id,
          siteCode: siteCode,
        }
      );
      let result = await postAsync(
        baseUrl + "/business/video/serialize",
        params
      );
      slefVideo.iv = result.data.iv;
      slefVideo.videoBaseUrl = result.data.videoBaseUrl;
      slefVideo.uri = result.data.videoKeyUri;
      slefVideo.tsFileName = result.data.videoTsName;
      m3u8Content = generateM3U8FromVideo(slefVideo, slefVideo.videoDuration);
    }
  }
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^|;\\s)" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  function analysisNormalVideo(uid, token, itemId, topicId) {
    fetch(location.origin + "/api/attachment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": uid,
        "X-User-Token": token,
      },
      body: JSON.stringify({
        id: itemId,
        resource_type: "topic",
        resource_id: topicId,
        line: "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        let res = JSON.parse(
          decodeURIComponent(escape(atob(atob(atob(data.data))))),
          `utf-8`
        );
        slefVideo.m3u8Url = res.remoteUrl;
        slefVideo.videoPlayUrl = res.remoteUrl;
        slefVideo.downloadUrl = res.remoteUrl;
        slefVideo.isNormal = true;
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  }

  function analysisTitle(content) {
    let jsonStr = decodeURIComponent(escape(atob(atob(atob(content)))));
    let objectData = JSON.parse(jsonStr, `utf-8`);
    objectData.results.forEach((item) => {
      if (item.attachments) {
        let dataId = "";
        item.attachments.forEach((e) => {
          if (item.hasVideo && dataId) {
            sDataId = dataId;
            markTitle();
          }
          dataId = e.id;
        });
      }
    });
    return JSON.stringify(objectData);
  }
  function showApiMessage(message = "操作成功", type = "success") {
    // 防止重复弹窗
    if (document.getElementById("api-message-dialog")) return;
    const colorMap = {
      success: "#43a047",
      error: "#d32f2f",
      info: "#1976d2",
      warning: "#ffa000",
    };
    const iconMap = {
      success: "fa-check-circle",
      error: "fa-exclamation-triangle",
      info: "fa-info-circle",
      warning: "fa-exclamation-circle",
    };
    const dialog = document.createElement("div");
    dialog.id = "api-message-dialog";
    dialog.innerHTML = `
      <style>
        .api-message-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          color: ${colorMap[type] || "#333"};
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          padding: 24px 20px 16px 20px;
          min-width: 220px;
          z-index: 10001;
          text-align: center;
          font-size: 15px;
        }
        .api-message-close {
          margin-top: 18px;
          background: ${colorMap[type] || "#333"};
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 24px;
          font-size: 14px;
          cursor: pointer;
        }
      </style>
      <div class="api-message-dialog">
        <div style="font-size:18px;margin-bottom:10px;">
          <i class="fas ${iconMap[type] || "fa-info-circle"}"></i>
        </div>
        <div>${message}</div>
        <button class="api-message-close">关闭</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector(".api-message-close").onclick = () => dialog.remove();
    setTimeout(() => dialog.remove(), 4500);
  }
  function waitForPageLoad() {
    return new Promise((resolve, reject) => {
      // Set timeout for safety
      const timeout = setTimeout(() => {
        reject("Page load timeout");
      }, 10000);

      // Check if page is already loaded
      if (document.readyState === "complete") {
        clearTimeout(timeout);
        resolve(document.body);
        return;
      }

      // Create observer to monitor DOM changes
      const observer = new MutationObserver((mutations, obs) => {
        if (document.readyState === "complete" && document.body) {
          clearTimeout(timeout);
          obs.disconnect();
          resolve(document.body);
        }
      });

      // Start observing
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    });
  }
  function checkToken() {
    const token = GM_getValue("myToken", "");
    if (!token) {
      createLoginForm();
      return false;
    }
    return true;
  }
  async function fetchUserInfo() {
    try {
      const response = await fetch(
        baseUrl + "/business/member/info?siteCode=" + siteCode,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${GM_getValue("myToken", "")}`,
          },
        }
      );
      const data = await response.json();
      vipUser = data.data;
      if (data.code == 401) {
        createLoginForm();
        // createLoginView();
      } else {
        checkPermission();
      }
      return data.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }
  async function postAsync(url, body) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GM_getValue("myToken", "")}`, // Add token from localStorage
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP 错误！状态码：${response.status}`);
      }
      if (result.code != 200) {
        showApiMessage(result.msg, "error");
      }
      if (result.code == 401) {
        GM_setValue("myToken", "");
        createLoginForm();
      }
      return result;
    } catch (error) {
      showApiMessage("操作失败", "error");
      throw error;
    }
  }
  async function putAsync(url, body) {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GM_getValue("myToken", "")}`,
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP 错误！状态码：${response.status}`);
      }
      if (result.code != 200) {
        showApiMessage(result.msg, "error");
      }
      if (result.code == 401) {
        GM_setValue("myToken", "");
        createLoginForm();
      }
      return result;
    } catch (error) {
      showApiMessage("操作失败", "error");
      throw error;
    }
  }
  async function getAsync(url, params) {
    try {
      // Build query string from params if they exist
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      const response = await fetch(baseUrl + url + queryString, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GM_getValue("myToken", "")}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP 错误！状态码：${response.status}`);
      }
      if (result.code != 200 && result.code != 401) {
        showApiMessage(result.msg, "error");
      }
      if (result.code == 401) {
        GM_setValue("myToken", "");
        createLoginForm();
      }
      return result;
    } catch (error) {
      showApiMessage("操作失败", "error");
      throw error;
    }
  }

  async function checkPermission() {
    var result = await getAsync("/business/member/has-permission", {
      siteCode: siteCode,
    });
    if (result.code == 200) {
      hasPrev = true;
      return true;
    } else {
      return false;
    }
  }
  async function serializeVideo() {
    let params = Object.assign(
      {},
      {
        videoId: slefVideo.id,
        m3u8Url: slefVideo.m3u8Url,
        siteCode: siteCode,
      }
    );
    let result = await postAsync(baseUrl + "/business/video/serialize", params);
  }

  async function gcreateDownloadUrl() {
    if (slefVideo.m3u8Url) {
      let params = Object.assign(
        {},
        {
          videoId: slefVideo.id,
          m3u8Url: slefVideo.m3u8Url,
          siteCode: siteCode,
        }
      );
      return await postAsync(
        baseUrl + "/business/download/generate-token",
        params
      );
    } else {
      showApiMessage("请等待视频加载完成");
    }
  }
  function markTitle() {
    waitForElement("img[data-id='" + sDataId + "']").then((element) => {
      if (element) {
        // 2. 获取目标元素的父元素
        const parent = element.parentElement;
        // 3. 获取父元素的兄弟元素（即 parent 的父元素下的所有子元素）
        const parentSiblings = Array.from(parent.parentElement.children);
        // 4. 过滤出 class 包含 "title" 的兄弟元素
        const titleElements = parentSiblings.filter((sibling) => {
          // 排除自己（parent）
          return sibling !== parent && sibling.classList.contains("t-title");
        });

        const titlePcElements = parentSiblings.filter((sibling) => {
          // 排除自己（parent）
          return sibling !== parent && sibling.tagName === "H4";
        });

        titleElements.forEach((element) => {
          element.style.color = "red";
        });
        titlePcElements.forEach((h4Element) => {
          const childElements = h4Element.children;
          for (let child of childElements) {
            child.style.color = "red";
          }
        });
        // 5. 输出结果
      }
    });
  }
  function waitForElement(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector(selector)) {
          obs.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
  function removeAdds() {
    GM_addStyle(
      //海角
      ".containeradvertising { display: none; } .my-swipe{ display: none;} .bannerliststyle{display: none;} .topbanmer{display: none;} .btnbox{display: none;} .addbox{display: none;}  .van-swipe__track{display: none;} .html-bottom-box{display: none;} #bbs_float_menu{display: none;} #tidio-chat{display: none;} .ishide {max-height: unset !important; overflow: visible !important;position: relative;}"
    );
    waitForElement(".my-swipe").then((e) => {
      e.style.display = "none";
    });
    waitForElement(".addbox").then((e) => {
      e.style.display = "none";
    });
  }
})();