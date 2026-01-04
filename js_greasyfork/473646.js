// ==UserScript==
// @name         安徽大学一卡通助手
// @namespace    https://adwmh.ahu.edu.cn/
// @version      3.0.0
// @description  清空原页，注入一体式面板完成 session、验证码、登录与二维码查询
// @author       BC
// @license      MIT
// @match        https://adwmh.ahu.edu.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473646/%E5%AE%89%E5%BE%BD%E5%A4%A7%E5%AD%A6%E4%B8%80%E5%8D%A1%E9%80%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473646/%E5%AE%89%E5%BE%BD%E5%A4%A7%E5%AD%A6%E4%B8%80%E5%8D%A1%E9%80%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const ENDPOINTS = {
    session: "https://adwmh.ahu.edu.cn/user/session",
    captcha: "https://adwmh.ahu.edu.cn//remind/authcode",
    login: "https://adwmh.ahu.edu.cn/user/login",
    qrcode: "https://adwmh.ahu.edu.cn/xzxcard/qrcode",
    balance: "https://adwmh.ahu.edu.cn/xzxcard/yue",
  };

  const STORAGE_KEYS = {
    username: "adwmh-username",
    password: "adwmh-password",
  };

  const state = {
    captchaDataUrl: null,
    qrcodeValue: "",
    qrRenderer: null,
  };

  const LOGIN_HEADERS = {
    "x-requested-with": "XMLHttpRequest",
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };

  const JSON_HEADERS = {
    "x-requested-with": "XMLHttpRequest",
    Accept: "application/json, text/plain, */*",
  };

  bootstrap();

  function bootstrap() {
    purgePage();
    ensureMeta();
    injectStyles();
    injectLayout();
    initLogic();
  }

  function purgePage() {
    document.title = "adwmh Web Flow";
    document.documentElement.style.background = "#050810";
    document.body.innerHTML = "";
    document.body.style.margin = "0";
  }

  function ensureMeta() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1";
      document.head.appendChild(meta);
    }
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        font-family: "PingFang SC", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        color: #0f172a;
        background: #050810;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        background: #ffffff;
        color: inherit;
      }
      .app {
        width: 100%;
        margin: 0 auto;
        padding: 24px clamp(16px, 4vw, 28px) 48px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.8rem;
        margin: 0;
        color: rgba(226, 232, 240, 0.75);
      }
      .card {
        background: #ffffff;
        border-radius: 18px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      }
      .card h2 {
        margin: 0;
        font-size: 1.2rem;
      }
      .hidden {
        display: none !important;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.9rem;
        color: inherit;
      }
      input {
        width: 100%;
        border-radius: 14px;
        border: 1px solid rgba(15, 23, 42, 0.12);
        padding: 12px;
        font-size: 1rem;
        background: rgba(15, 23, 42, 0.03);
      }
      input:focus {
        outline: 2px solid rgba(14, 165, 233, 0.45);
        border-color: transparent;
      }
      .form-card button.primary {
        margin-top: 8px;
      }
      button {
        width: 100%;
        border: none;
        border-radius: 14px;
        padding: 14px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        background: rgba(14, 165, 233, 0.15);
        color: #0369a1;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      button.primary {
        background: linear-gradient(135deg, #0ea5e9, #2563eb);
        color: #fff;
      }
      button.ghost {
        width: auto;
        padding: 0.45rem 0.9rem;
        background: transparent;
        border: 1px solid rgba(15, 23, 42, 0.2);
        color: inherit;
      }
      button:disabled {
        opacity: 0.5;
        cursor: wait;
      }
      button:not(:disabled):active {
        transform: translateY(1px);
      }
      .hint {
        margin: 0;
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.7);
      }
      .hint.mini {
        font-size: 0.8rem;
        color: rgba(15, 23, 42, 0.55);
      }
      .captcha-row .captcha-inline {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        align-items: center;
      }
      .captcha-row .captcha-inline img {
        width: 100%;
        aspect-ratio: 10 / 4;
        border-radius: 12px;
        border: 1px dashed rgba(2, 132, 199, 0.35);
        background: rgba(15, 23, 42, 0.04);
        object-fit: cover;
        cursor: pointer;
      }
      .captcha-row .captcha-inline input {
        width: 100%;
      }
      .status {
        margin: 0;
        font-weight: 600;
        color: rgba(2, 132, 199, 0.9);
      }
      .response {
        margin: 0;
        border-radius: 16px;
        padding: 12px;
        min-height: 110px;
        background: rgba(15, 23, 42, 0.05);
        font-size: 0.9rem;
        overflow-x: auto;
      }
      .balance-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: center;
      }
      .balance-title {
        margin: 0;
        font-weight: 600;
        color: rgba(15, 23, 42, 0.75);
      }
      .response.balance {
        min-height: 80px;
        text-align: center;
        font-size: 1.4rem;
        font-weight: 700;
      }
      .qrcode-visual {
        margin-top: 12px;
        align-self: center;
        width: min(240px, 70vw);
        height: min(240px, 70vw);
        background: #fff;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }
      .toast-container {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
      }
      .toast {
        padding: 10px 18px;
        background: rgba(15, 23, 42, 0.9);
        color: #fff;
        border-radius: 999px;
        font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        animation: toast-in 0.2s ease;
      }
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translate(-50%, 10px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
      @media (min-width: 768px) {
        .app {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectLayout() {
    document.body.innerHTML = `
      <main class="app">
        <section class="card form-card" id="credential-card">
          <h2>账号与验证码</h2>
          <form id="credential-form" autocomplete="off">
            <label>
              <span>用户名</span>
              <input type="text" name="username" value="" required />
            </label>
            <label>
              <span>密码</span>
              <input type="password" name="password" value="" required />
            </label>
            <label class="captcha-row">
              <span>验证码</span>
              <div class="captcha-inline">
                <img id="captcha-preview" alt="验证码" />
                <input type="text" id="imgcode" placeholder="" maxlength="8" />
              </div>
              <p class="hint mini">点击验证码刷新一张</p>
            </label>
          </form>
          <button type="button" class="primary" id="btn-login">登录并获取二维码</button>
          <p class="status" id="login-status">等待登录</p>
          <pre class="response" id="login-response">等待登录</pre>
        </section>
        <section class="card qrcode-card hidden" id="qrcode-card">
          <h2>二维码</h2>
          <button type="button" id="btn-qrcode">刷新</button>
          <p class="status" id="qrcode-status">等待二维码</p>
          <div class="balance-block">
            <p class="balance-title">余额接口返回</p>
            <pre class="response balance" id="balance-response">等待余额</pre>
          </div>
          <div class="qrcode-visual" id="qrcode-canvas" aria-hidden="true"></div>
        </section>
      </main>
      <template id="toast-template">
        <div class="toast"></div>
      </template>
    `;
  }

  function initLogic() {
    const outputs = {
      login: document.getElementById("login-response"),
      balance: document.getElementById("balance-response"),
    };

    const statuses = {
      login: document.getElementById("login-status"),
      qrcode: document.getElementById("qrcode-status"),
    };

    const elements = {
      loginBtn: document.getElementById("btn-login"),
      qrcodeBtn: document.getElementById("btn-qrcode"),
      captchaImage: document.getElementById("captcha-preview"),
      imgcodeInput: document.getElementById("imgcode"),
      credentialsForm: document.getElementById("credential-form"),
      credentialCard: document.getElementById("credential-card"),
      qrcodeCard: document.getElementById("qrcode-card"),
      qrcodeCanvas: document.getElementById("qrcode-canvas"),
    };

    const credentialInputs = {
      username: elements.credentialsForm.querySelector('[name="username"]'),
      password: elements.credentialsForm.querySelector('[name="password"]'),
    };

    function setStatus(key, message, stateValue) {
      const el = statuses[key];
      if (!el) return;
      el.textContent = message;
      if (stateValue) el.dataset.state = stateValue;
    }

    function setCredentialVisibility(visible) {
      elements.credentialCard?.classList.toggle("hidden", !visible);
    }

    function setQrVisibility(visible) {
      elements.qrcodeCard?.classList.toggle("hidden", !visible);
    }

    function readCredentials() {
      return {
        username: (credentialInputs.username.value || "").trim(),
        password: credentialInputs.password.value || "",
        flag: "0",
      };
    }

    function readableError(err) {
      if (!err) return "未知错误";
      if (typeof err === "string") return err;
      if (err.name === "AbortError") return "请求被取消";
      return err.message || "请求失败";
    }

    async function ensureSession() {
      const resp = await fetch(ENDPOINTS.session, {
        method: "POST",
        credentials: "include",
      });
      if (!resp.ok) throw new Error(`session HTTP ${resp.status}`);
    }

    async function fetchCaptcha() {
      await ensureSession();
      const resp = await fetch(ENDPOINTS.captcha, {
        method: "GET",
        credentials: "include",
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      state.captchaDataUrl = await blobToDataUrl(blob);
      elements.captchaImage.src = state.captchaDataUrl;
      return blob;
    }

    async function loginRequest() {
      const imgcode = (elements.imgcodeInput.value || "").trim();
      if (!imgcode) {
        const err = new Error("请输入验证码");
        setStatus("login", readableError(err), "error");
        elements.imgcodeInput.focus();
        throw err;
      }

      const { username, password, flag } = readCredentials();
      if (!username || !password) {
        const err = new Error("请填写账号密码");
        setStatus("login", readableError(err), "error");
        throw err;
      }

      setStatus("login", "请求中…", "pending");
      const body = new URLSearchParams({ username, pwd: password, flag, imgcode });

      try {
        const resp = await fetch(ENDPOINTS.login, {
          method: "POST",
          credentials: "include",
          headers: LOGIN_HEADERS,
          body,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const payload = await resp.json();
        outputs.login.textContent = JSON.stringify({ code: payload.code, msg: payload.msg }, null, 2);
        const success = payload.code === 10000;
        setStatus("login", success ? "登录成功" : payload.msg || "登录失败", success ? "success" : "error");
        if (!success) {
          if (payload.msg === "账号或密码错误") await fetchCaptcha().catch(console.error);
          throw new Error(payload.msg || "登录失败");
        }
        return payload;
      } catch (error) {
        if (outputs.login.textContent === "等待登录") {
          outputs.login.textContent = readableError(error);
        }
        setStatus("login", readableError(error), "error");
        throw error;
      }
    }

    async function fetchQrCode() {
      setStatus("qrcode", "请求中…", "pending");
      try {
        const resp = await fetch(ENDPOINTS.qrcode, {
          method: "GET",
          credentials: "include",
          headers: JSON_HEADERS,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const payload = await resp.json();
        const success = payload.code === 10000 && payload.object;
        if (!success) throw new Error(payload.msg || "未拿到二维码");
        state.qrcodeValue = String(payload.object);
        await renderQrGraphic(state.qrcodeValue);
        setStatus("qrcode", payload.msg || "成功", "success");
        setQrVisibility(true);
        await fetchBalance();
        return payload;
      } catch (error) {
        setStatus("qrcode", readableError(error), "error");
        setQrVisibility(false);
        throw error;
      }
    }

    function bindAction(button, handler) {
      if (!button) return;
      button.addEventListener("click", async () => {
        if (button.disabled) return;
        button.disabled = true;
        try {
          await handler();
        } finally {
          button.disabled = false;
        }
      });
    }

    async function ensureQrLib() {
      if (typeof window.QRCode !== "undefined") return;
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/qrcodejs2@0.0.2/qrcode.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    async function renderQrGraphic(value) {
      if (!elements.qrcodeCanvas) return;
      await ensureQrLib();
      const size = elements.qrcodeCanvas.clientWidth || 200;
      if (!state.qrRenderer) {
        state.qrRenderer = new window.QRCode(elements.qrcodeCanvas, {
          width: size,
          height: size,
        });
      }
      state.qrRenderer.clear && state.qrRenderer.clear();
      state.qrRenderer.makeCode(value);
    }

    async function fetchBalance() {
      if (!outputs.balance) return;
      try {
        const resp = await fetch(ENDPOINTS.balance, {
          method: "GET",
          credentials: "include",
          headers: JSON_HEADERS,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const payload = await resp.json();
        outputs.balance.textContent = `${payload.object ?? "--"}`;
      } catch (error) {
        outputs.balance.textContent = readableError(error);
      }
    }

    function persistCredentials() {
      Object.entries(credentialInputs).forEach(([key, input]) => {
        input.addEventListener("input", () => {
          localStorage.setItem(STORAGE_KEYS[key], input.value);
        });
      });
    }

    function hydrateCredentials() {
      Object.entries(credentialInputs).forEach(([key, input]) => {
        const saved = localStorage.getItem(STORAGE_KEYS[key]);
        if (saved) input.value = saved;
      });
    }

    async function initialFlow() {
      try {
        await fetchQrCode();
        toast("已直接获取二维码");
        setCredentialVisibility(false);
        setQrVisibility(true);
        return;
      } catch (error) {
        console.info("Initial qrcode fetch failed", error);
        setCredentialVisibility(true);
        setQrVisibility(false);
      }
      try {
        await ensureSession();
        await fetchCaptcha();
        toast("请识别验证码后输入");
      } catch (error) {
        console.error("Failed to bootstrap session", error);
      }
    }

    function toast(message) {
      let container = document.querySelector(".toast-container");
      if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
      }
      const tpl = document.getElementById("toast-template");
      const node = tpl?.content?.firstElementChild?.cloneNode(true) ?? document.createElement("div");
      node.textContent = message;
      node.classList.add("toast");
      container.appendChild(node);
      setTimeout(() => {
        node.style.opacity = "0";
        node.style.transform = "translateY(10px)";
        setTimeout(() => node.remove(), 200);
      }, 1600);
    }

    bindAction(elements.loginBtn, async () => {
      setQrVisibility(false);
      await loginRequest();
      window.location.reload();
    });

    bindAction(elements.qrcodeBtn, async () => {
      await fetchQrCode();
      await fetchBalance();
    });

    elements.captchaImage?.addEventListener("click", () => {
      fetchCaptcha().catch((error) => console.error(error));
    });

    hydrateCredentials();
    persistCredentials();
    initialFlow();

    window.addEventListener("beforeunload", () => {
      state.captchaDataUrl = null;
    });

    function blobToDataUrl(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  }
})();
