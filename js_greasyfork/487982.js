// ==UserScript==
// @name         18Comic 之路
// @namespace    https://github.com/zyf722
// @version      1.0
// @author       zyf722
// @description  JM / 18Comic 车牌号划词查询工具
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18comic.vip
// @match        *://weibo.com/*
// @match        *://*.weibo.com/*
// @match        *://*.weibo.cn/*
// @match        *://tieba.baidu.com/*
// @match        *://*.bilibili.com/
// @match        *://*.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487982/18Comic%20%E4%B9%8B%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/487982/18Comic%20%E4%B9%8B%E8%B7%AF.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(" .jm-select-none,.jm-select-none *{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.jm-overflow{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#jm-popup{position:absolute;background-color:#fff;padding:10px;margin-top:10px;border:1px solid #ddd;box-shadow:0 4px 8px #0003;z-index:999999999999;display:none;max-width:25%;column-gap:10px;align-items:center}.jm-title{max-width:100%;font-size:14px;grid-column:1;grid-row:2}#jm-title-text{display:none}#jm-number-container{max-width:100%;grid-column:1;grid-row:1;display:flex;align-items:center}#jm-number{font-size:18px;font-weight:700}#jm-number-icon{width:16px;height:16px;margin-right:5px}#jm-copy{border:none;background-color:#fff;width:32px;height:32px;font-size:16px;cursor:pointer;grid-column:2;grid-row:1 / 3;transition:background-color .3s;display:flex;align-items:center;justify-content:center}#jm-copy:hover:not(:disabled){background-color:#f6f6f6}#jm-copy:active:not(:disabled){background-color:#e6e6e6}#jm-copy-icon{width:16px;height:16px;transition:opacity .25s}.jm-copy-icon-hide{opacity:0}#jm-details-container{grid-column:1 / span 2;grid-row:3;display:grid;gap:5px;font-size:12px;margin-top:10px;border-top:1px solid #eee;padding-top:10px}.jm-detail-row{display:contents}.jm-detail-row>span{padding:2px 0}.jm-detail-label{font-weight:700;color:#555;white-space:nowrap}.jm-detail-value{color:#333}.jm-tags-container{display:flex;flex-wrap:wrap;gap:4px}.jm-tag-item{vertical-align:middle;background:#00000012;color:#777;font-size:12px;line-height:16px;display:inline-block;padding:0 3px;margin:-2px 0 0 2px;border-radius:2px;letter-spacing:-.6px;bottom:0}#rt18-config-dialog-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}#rt18-config-dialog{background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 12px #00000026;width:500px;max-width:90%;position:relative}.rt18-config-close-button{position:absolute;top:10px;right:10px;background:none;border:none;font-size:1.5em;cursor:pointer}.rt18-config-section{margin-top:10px;margin-bottom:10px;display:flex;flex-direction:column;gap:10px}#rt18-source-list{list-style:none;padding:0;max-height:200px;overflow-y:auto;border:1px solid #ddd;border-radius:4px}#rt18-source-list li{padding:8px 12px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}.rt18-source-text{flex-grow:1;margin-right:10px}.rt18-source-controls{display:flex;align-items:center}.rt18-source-button{margin-left:5px;padding:4px 8px;font-size:.9em;cursor:pointer;border:1px solid #ccc;border-radius:3px;background-color:#f0f0f0;display:inline-flex;align-items:center;justify-content:center;min-width:20px;text-align:center}.rt18-source-button:hover{background-color:#e0e0e0}.rt18-source-button-delete{background-color:#f8d7da;color:#721c24;border-color:#f5c6cb}.rt18-source-button-delete:hover{background-color:#f1b0b7}.rt18-button-disabled{opacity:.5;cursor:not-allowed;background-color:#e9ecef}.rt18-button-disabled:hover{background-color:#e9ecef}.rt18-add-source-container{display:flex;margin-top:10px}#rt18-add-source-input{flex-grow:1;padding:8px;border:1px solid #ccc;border-radius:4px 0 0 4px}#rt18-add-source-btn{padding:8px 15px;border:1px solid #ccc;border-left:none;background-color:#007bff;color:#fff;cursor:pointer;border-radius:0 4px 4px 0;display:inline-flex;align-items:center;justify-content:center}#rt18-add-source-btn:hover{background-color:#0056b3}.rt18-config-input{width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box}.rt18-config-description{font-size:.9em;color:#666;margin-top:0} ");

(function (CryptoJS) {
  'use strict';

  const loadingIcon = "data:image/svg+xml,%3csvg%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M512%20170.666667a341.333333%20341.333333%200%201%200%200%20682.666666%20341.333333%20341.333333%200%200%200%200-682.666666zM85.333333%20512C85.333333%20276.352%20276.352%2085.333333%20512%2085.333333s426.666667%20191.018667%20426.666667%20426.666667-191.018667%20426.666667-426.666667%20426.666667S85.333333%20747.648%2085.333333%20512z%20m426.666667-256a42.666667%2042.666667%200%200%201%2042.666667%2042.666667v195.669333l115.498666%20115.498667a42.666667%2042.666667%200%200%201-60.330666%2060.330666l-128-128A42.666667%2042.666667%200%200%201%20469.333333%20512V298.666667a42.666667%2042.666667%200%200%201%2042.666667-42.666667z'%20fill='currentColor'/%3e%3c/svg%3e";
  const failIcon = "data:image/svg+xml,%3csvg%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M512%2097.52381c228.912762%200%20414.47619%20185.563429%20414.47619%20414.47619s-185.563429%20414.47619-414.47619%20414.47619S97.52381%20740.912762%2097.52381%20512%20283.087238%2097.52381%20512%2097.52381z%20m0%2073.142857C323.486476%20170.666667%20170.666667%20323.486476%20170.666667%20512s152.81981%20341.333333%20341.333333%20341.333333%20341.333333-152.81981%20341.333333-341.333333S700.513524%20170.666667%20512%20170.666667z%20m129.29219%20160.304762l51.736381%2051.736381L563.687619%20512l129.316571%20129.29219-51.73638%2051.736381L512%20563.687619l-129.29219%20129.316571-51.736381-51.73638L460.312381%20512l-129.316571-129.26781%2051.73638-51.73638L512%20460.263619l129.26781-129.29219z'%20fill='currentColor'/%3e%3c/svg%3e";
  const successIcon = "data:image/svg+xml,%3csvg%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M512%2097.52381c228.912762%200%20414.47619%20185.563429%20414.47619%20414.47619s-185.563429%20414.47619-414.47619%20414.47619S97.52381%20740.912762%2097.52381%20512%20283.087238%2097.52381%20512%2097.52381z%20m0%2073.142857C323.486476%20170.666667%20170.666667%20323.486476%20170.666667%20512s152.81981%20341.333333%20341.333333%20341.333333%20341.333333-152.81981%20341.333333-341.333333S700.513524%20170.666667%20512%20170.666667z%20m193.194667%20145.188571l52.467809%2050.956191-310.662095%20319.683047-156.379429-162.230857%2052.662858-50.761143%20103.936%20107.812572%20257.974857-265.45981z'%20fill='currentColor'/%3e%3c/svg%3e";
  const warningIcon = "data:image/svg+xml,%3csvg%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M545.718857%20130.608762c11.337143%206.265905%2020.699429%2015.555048%2026.989714%2026.819048l345.014858%20617.667047a68.87619%2068.87619%200%200%201-26.989715%2093.915429c-10.313143%205.705143-21.942857%208.704-33.718857%208.704H166.985143A69.266286%2069.266286%200%200%201%2097.52381%20808.643048c0-11.751619%202.998857-23.28381%208.752761-33.548191l344.990477-617.642667a69.656381%2069.656381%200%200%201%2094.451809-26.819047zM512%20191.000381L166.985143%20808.643048H856.990476L512%20191.000381zM546.718476%20670.47619v69.071239h-69.461333V670.47619h69.485714z%20m0-298.374095v252.318476h-69.461333V372.102095h69.485714z'%20fill='currentColor'/%3e%3c/svg%3e";
  const doneIcon = "data:image/svg+xml,%3csvg%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M512%2016C238.066%2016%2016%20238.066%2016%20512s222.066%20496%20496%20496%20496-222.066%20496-496S785.934%2016%20512%2016z%20m0%2096c221.064%200%20400%20178.902%20400%20400%200%20221.064-178.902%20400-400%20400-221.064%200-400-178.902-400-400%200-221.064%20178.902-400%20400-400m280.408%20260.534l-45.072-45.436c-9.334-9.41-24.53-9.472-33.94-0.136L430.692%20607.394l-119.584-120.554c-9.334-9.41-24.53-9.472-33.94-0.138l-45.438%2045.072c-9.41%209.334-9.472%2024.53-0.136%2033.942l181.562%20183.032c9.334%209.41%2024.53%209.472%2033.94%200.136l345.178-342.408c9.408-9.336%209.468-24.532%200.134-33.942z'%20fill='currentColor'/%3e%3c/svg%3e";
  const copyIcon = "data:image/svg+xml,%3csvg%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M931.882%20131.882l-103.764-103.764A96%2096%200%200%200%20760.236%200H416c-53.02%200-96%2042.98-96%2096v96H160c-53.02%200-96%2042.98-96%2096v640c0%2053.02%2042.98%2096%2096%2096h448c53.02%200%2096-42.98%2096-96v-96h160c53.02%200%2096-42.98%2096-96V199.764a96%2096%200%200%200-28.118-67.882zM596%20928H172a12%2012%200%200%201-12-12V300a12%2012%200%200%201%2012-12h148v448c0%2053.02%2042.98%2096%2096%2096h192v84a12%2012%200%200%201-12%2012z%20m256-192H428a12%2012%200%200%201-12-12V108a12%2012%200%200%201%2012-12h212v176c0%2026.51%2021.49%2048%2048%2048h176v404a12%2012%200%200%201-12%2012z%20m12-512h-128V96h19.264c3.182%200%206.234%201.264%208.486%203.514l96.736%2096.736a12%2012%200%200%201%203.514%208.486V224z'%20fill='currentColor'/%3e%3c/svg%3e";
  const uiHtml = '<div id="jm-popup" class="jm-select-none" style="display: none;">\r\n  <div id="jm-number-container">\r\n    <div id="jm-number-icon"></div>\r\n    <div id="jm-number" class="jm-overflow"></div>\r\n  </div>\r\n  <a id="jm-title-text" class="jm-overflow jm-title" target="_blank" rel="noopener noreferrer" style="display: none;"></a>\r\n  <div id="jm-title-loading" class="jm-title">加载中...</div>\r\n  <div id="jm-details-container" style="display: none;"></div>\r\n  <button id="jm-copy" title="复制漫画名" disabled>\r\n    <div id="jm-copy-icon"></div>\r\n  </button>\r\n</div>\r\n';
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const configHtml = '<div id="rt18-config-dialog-overlay">\r\n  <div id="rt18-config-dialog">\r\n    <h2>18Comic 之路配置</h2>\r\n    <button id="rt18-config-close-btn" class="rt18-config-close-button">×</button>\r\n    <div class="rt18-config-section">\r\n      <h3>API 线路配置</h3>\r\n      <ul id="rt18-source-list"></ul>\r\n      <div class="rt18-add-source-container">\r\n        <input type="text" id="rt18-add-source-input" placeholder="输入新线路域名">\r\n        <div id="rt18-add-source-btn" class="rt18-config-button">添加线路</div>\r\n      </div>\r\n      <p class="rt18-config-description">脚本运行时将按照配置的 API 线路顺序获取车牌对应信息，直到成功获取为止。</p>\r\n    </div>\r\n    <div class="rt18-config-section">\r\n      <h3>API 请求超时配置</h3>\r\n      <input type="number" id="rt18-config-timeout-input" class="rt18-config-input" min="1000" step="1000">\r\n      <p class="rt18-config-description">网络请求的超时时间，单位为毫秒。</p>\r\n    </div>\r\n    <div class="rt18-config-section">\r\n      <h3>JM 网站线路</h3>\r\n      <input type="url" id="rt18-config-jm-url-input" class="rt18-config-input" placeholder="例如: https://18comic.vip">\r\n      <p class="rt18-config-description">用于拼接最终跳转的 18Comic / JM 网站地址。可访问 <a href="https://jmcomic-fb.vip" target="_blank" rel="noopener noreferrer">jmcomic-fb.vip</a> 获取最新线路。</p>\r\n    </div>\r\n    <div class="rt18-config-section">\r\n      <h3>布局选择</h3>\r\n      <select id="rt18-config-layout-select" class="rt18-config-input">\r\n        <option value="details">详细布局（显示漫画详细信息）</option>\r\n        <option value="compact">紧凑布局（旧版布局，仅显示漫画名称）</option>\r\n      </select>\r\n      <p class="rt18-config-description">漫画浮窗窗口的布局样式。</p>\r\n    </div>\r\n  </div>\r\n</div>\r\n';
  const defaultConfig = {
    sources: ["www.cdnmhwscc.vip", "www.cdnblackmyth.club", "www.cdnmhws.cc", "www.cdnuc.vip"],
    timeout: 5e3,
    jmWebsiteUrl: "https://18comic.vip",
    layout: "details"
  };
  const loadConfig = () => {
    const configString = localStorage.getItem("rt18_config");
    if (configString) {
      const parsedConfig = JSON.parse(configString);
      return { ...defaultConfig, ...parsedConfig };
    }
    return { ...defaultConfig };
  };
  const config = loadConfig();
  let isConfigDialogOpen = false;
  const saveConfig = () => {
    localStorage.setItem("rt18_config", JSON.stringify(config));
  };
  const resetConfig = () => {
    if (confirm("确定要重置所有配置吗？")) {
      localStorage.removeItem("rt18_config");
      alert("配置已重置为默认值，请刷新页面以应用更改。");
    }
  };
  const openConfigDialog$1 = () => {
    const dialogContainerId = "rt18-config-dialog-container";
    let dialogContainer = document.getElementById(dialogContainerId);
    if (dialogContainer) {
      dialogContainer.style.display = "flex";
      return;
    }
    dialogContainer = document.createElement("div");
    dialogContainer.id = dialogContainerId;
    dialogContainer.innerHTML = configHtml;
    document.body.appendChild(dialogContainer);
    isConfigDialogOpen = true;
    const closeButton = document.getElementById("rt18-config-close-btn");
    const sourceList = document.getElementById("rt18-source-list");
    const addSourceInput = document.getElementById("rt18-add-source-input");
    const addSourceButton = document.getElementById("rt18-add-source-btn");
    const timeoutInput = document.getElementById("rt18-config-timeout-input");
    const jmWebsiteUrlInput = document.getElementById("rt18-config-jm-url-input");
    const layoutSelect = document.getElementById("rt18-config-layout-select");
    if (timeoutInput) {
      timeoutInput.value = String(config.timeout);
      timeoutInput.addEventListener("change", () => {
        const newTimeout = parseInt(timeoutInput.value, 10);
        if (!isNaN(newTimeout) && newTimeout > 0) {
          config.timeout = newTimeout;
          localStorage.setItem("rt18_config", JSON.stringify(config));
          config.timeout = newTimeout;
        } else {
          timeoutInput.value = String(config.timeout);
          alert("请输入有效的超时毫秒数。");
        }
      });
    }
    if (jmWebsiteUrlInput) {
      jmWebsiteUrlInput.value = config.jmWebsiteUrl;
      jmWebsiteUrlInput.addEventListener("change", () => {
        const newUrl = jmWebsiteUrlInput.value.trim();
        if (newUrl) {
          try {
            new URL(newUrl);
            config.jmWebsiteUrl = newUrl;
            localStorage.setItem("rt18_config", JSON.stringify(config));
          } catch (e) {
            jmWebsiteUrlInput.value = config.jmWebsiteUrl;
            alert("请输入有效的 URL。");
          }
        } else {
          jmWebsiteUrlInput.value = config.jmWebsiteUrl;
          alert("URL 不能为空。");
        }
      });
    }
    if (layoutSelect) {
      layoutSelect.value = config.layout;
      layoutSelect.addEventListener("change", () => {
        const newLayout = layoutSelect.value;
        if (newLayout === "compact" || newLayout === "details") {
          config.layout = newLayout;
          localStorage.setItem("rt18_config", JSON.stringify(config));
        } else {
          layoutSelect.value = config.layout;
        }
      });
    }
    const renderSourceList = () => {
      sourceList.innerHTML = "";
      config.sources.forEach((source, index) => {
        const listItem = document.createElement("li");
        listItem.className = "rt18-source-list-item";
        const sourceText = document.createElement("span");
        sourceText.className = "rt18-source-text";
        sourceText.textContent = source;
        listItem.appendChild(sourceText);
        const controlsContainer = document.createElement("div");
        controlsContainer.className = "rt18-source-controls";
        const upButton = document.createElement("div");
        upButton.className = "rt18-source-button rt18-source-button-up";
        upButton.innerHTML = "<span>↑</span>";
        if (index === 0) {
          upButton.classList.add("rt18-button-disabled");
        } else {
          upButton.addEventListener("click", () => {
            const temp = config.sources[index];
            config.sources[index] = config.sources[index - 1];
            config.sources[index - 1] = temp;
            saveConfig();
            renderSourceList();
          });
        }
        const downButton = document.createElement("div");
        downButton.className = "rt18-source-button rt18-source-button-down";
        downButton.innerHTML = "<span>↓</span>";
        if (index === config.sources.length - 1) {
          downButton.classList.add("rt18-button-disabled");
        } else {
          downButton.addEventListener("click", () => {
            const temp = config.sources[index];
            config.sources[index] = config.sources[index + 1];
            config.sources[index + 1] = temp;
            saveConfig();
            renderSourceList();
          });
        }
        const deleteButton = document.createElement("div");
        deleteButton.className = "rt18-source-button rt18-source-button-delete";
        deleteButton.textContent = "删除";
        deleteButton.addEventListener("click", () => {
          if (confirm(`确定删除源 "${source}" 吗？`)) {
            config.sources.splice(index, 1);
            saveConfig();
            renderSourceList();
          }
        });
        controlsContainer.appendChild(upButton);
        controlsContainer.appendChild(downButton);
        controlsContainer.appendChild(deleteButton);
        listItem.appendChild(controlsContainer);
        sourceList.appendChild(listItem);
      });
    };
    addSourceButton.addEventListener("click", () => {
      const newSource = addSourceInput.value.trim();
      if (newSource && !config.sources.includes(newSource)) {
        config.sources.push(newSource);
        saveConfig();
        config.sources = [...config.sources];
        renderSourceList();
        addSourceInput.value = "";
      }
    });
    renderSourceList();
    closeButton.addEventListener("click", () => {
      if (dialogContainer) {
        dialogContainer.style.display = "none";
        dialogContainer.remove();
        isConfigDialogOpen = false;
      }
    });
  };
  const APP_TOKEN_SECRET = "18comicAPP";
  const APP_DATA_SECRET = "185Hcomic3PAPP7R";
  const APP_VERSION = "1.7.9";
  const getTokenWithTokenparam = (ts, ver = APP_VERSION, secret = APP_TOKEN_SECRET) => {
    const tokenparam = `${ts},${ver}`;
    const token = CryptoJS.MD5(`${ts}${secret}`).toString();
    return {
      token,
      tokenparam
    };
  };
  const decodeData = (data, ts, secret = APP_DATA_SECRET) => {
    const dataWordArray = CryptoJS.enc.Base64.parse(data);
    const token = CryptoJS.MD5(`${ts}${secret}`).toString();
    const tokenWordArray = CryptoJS.enc.Utf8.parse(token);
    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: dataWordArray
    });
    const decrypted = CryptoJS.AES.decrypt(encrypted, tokenWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };
  const JMFetchAlbumInfo = (jmSite, jmId, callback) => {
    const timestamp = Math.floor(Date.now() / 1e3);
    _GM_xmlhttpRequest({
      method: "GET",
      url: `https://${jmSite}/album?id=${jmId}`,
      timeout: config.timeout,
      headers: {
        ...getTokenWithTokenparam(timestamp),
        "Accept-Encoding": "gzip, deflate",
        "User-Agent": navigator.userAgent
      },
      onload: (gmResponse) => {
        try {
          const resp = JSON.parse(gmResponse.responseText);
          const album = decodeData(resp.data, timestamp);
          callback(album);
        } catch (error) {
          callback(null);
        }
      },
      onerror: () => callback(null),
      ontimeout: () => callback(null)
    });
  };
  const openConfigDialog = () => {
    var _a;
    (_a = window.getSelection()) == null ? void 0 : _a.empty();
    if (popupWindow.checkVisibility()) {
      popupWindow.style.display = "none";
    }
    openConfigDialog$1();
  };
  _GM_registerMenuCommand("⚙ 打开配置菜单", openConfigDialog);
  _GM_registerMenuCommand("⚠ 重置配置", resetConfig);
  const setSVGWithColor = (wrapper, svgUrl, color) => {
    wrapper.style.backgroundColor = color;
    wrapper.style.mask = `url("${svgUrl}") no-repeat center`;
    wrapper.style.webkitMask = `url("${svgUrl}") no-repeat center`;
  };
  const uiContainer = document.createElement("div");
  uiContainer.innerHTML = uiHtml;
  document.body.appendChild(uiContainer);
  const popupWindow = document.getElementById("jm-popup");
  const numberIcon = document.getElementById("jm-number-icon");
  const numberText = document.getElementById("jm-number");
  const titleText = document.getElementById("jm-title-text");
  const titleLoadingText = document.getElementById("jm-title-loading");
  const copyBtn = document.getElementById("jm-copy");
  const copyBtnIcon = document.getElementById("jm-copy-icon");
  const detailsContainer = document.getElementById("jm-details-container");
  setSVGWithColor(numberIcon, loadingIcon, "black");
  const populateDetails = (album) => {
    detailsContainer.innerHTML = "";
    const createDetailRow = (field, value, isHtml = false) => {
      const isValueArray = Array.isArray(value);
      if (!value || isValueArray && value.length === 0) return;
      const row = document.createElement("div");
      row.className = "jm-detail-row";
      const labelSpan = document.createElement("span");
      labelSpan.className = "jm-detail-label";
      labelSpan.textContent = `${field}:`;
      row.appendChild(labelSpan);
      const valueSpan = document.createElement("span");
      valueSpan.className = "jm-detail-value";
      if (isHtml) {
        valueSpan.innerHTML = isValueArray ? value.join(", ") : value;
      } else {
        valueSpan.textContent = isValueArray ? value.join(", ") : value;
      }
      if (isValueArray) {
        valueSpan.classList.add("jm-tags-container");
        valueSpan.innerHTML = "";
        value.forEach((tag) => {
          const tagSpan = document.createElement("span");
          tagSpan.className = "jm-tag-item";
          tagSpan.textContent = tag;
          valueSpan.appendChild(tagSpan);
        });
      }
      row.appendChild(valueSpan);
      detailsContainer.appendChild(row);
    };
    if (config.layout === "details") {
      createDetailRow("作者", album.author);
      createDetailRow("标签", album.tags);
      createDetailRow("系列", album.works);
      createDetailRow("角色", album.actors);
      createDetailRow(
        "统计",
        `浏览: ${album.total_views || 0} / 喜欢: ${album.likes || 0} / 评论: ${album.comment_total || 0}`
      );
      if (album.addtime) {
        const date = new Date(parseInt(album.addtime) * 1e3);
        createDetailRow("上传于", date.toLocaleString());
      }
      detailsContainer.style.display = "grid";
    } else {
      detailsContainer.style.display = "none";
    }
  };
  const toggleLoading = async (status, albumOrMessage, link) => {
    let numberIconUrl = loadingIcon;
    let numberTextColor = "black";
    let titleTextColor = "gray";
    detailsContainer.style.display = "none";
    if (status === "fail") {
      numberIconUrl = failIcon;
      numberTextColor = "red";
      titleText.innerHTML = titleText.title = typeof albumOrMessage === "string" ? albumOrMessage : "获取信息失败";
    } else if (status === "done" && albumOrMessage && typeof albumOrMessage !== "string") {
      const album = albumOrMessage;
      numberIconUrl = successIcon;
      numberTextColor = "green";
      titleTextColor = null;
      titleText.innerHTML = titleText.title = album.name;
      populateDetails(album);
    } else if (status === "warning") {
      numberIconUrl = warningIcon;
      numberTextColor = "orange";
      titleText.innerHTML = titleText.title = typeof albumOrMessage === "string" ? albumOrMessage : "发生错误";
    } else if (status === "loading") {
      titleText.innerHTML = titleText.title = "加载中...";
    }
    setSVGWithColor(numberIcon, numberIconUrl, numberTextColor);
    numberText.style.color = numberTextColor;
    const isLoading = status === "loading";
    titleLoadingText.style.display = isLoading ? "inline" : "none";
    titleText.style.display = !isLoading ? "inline" : "none";
    titleText.style.color = titleTextColor || "";
    if (link) {
      titleText.href = link;
    }
  };
  setSVGWithColor(copyBtnIcon, copyIcon, "dodgerblue");
  const disableCopyBtn = (status) => {
    copyBtn.disabled = status;
    copyBtn.style.pointerEvents = status ? "none" : "auto";
    copyBtnIcon.style.backgroundColor = status ? "gray" : "dodgerblue";
  };
  disableCopyBtn(true);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(titleText.innerText);
    copyBtn.style.pointerEvents = "none";
    copyBtnIcon.classList.toggle("jm-copy-icon-hide");
    setTimeout(() => {
      copyBtnIcon.classList.toggle("jm-copy-icon-hide");
      setSVGWithColor(copyBtnIcon, doneIcon, "dodgerblue");
    }, 250);
    setTimeout(() => {
      copyBtnIcon.classList.toggle("jm-copy-icon-hide");
      setTimeout(() => {
        setSVGWithColor(copyBtnIcon, copyIcon, "dodgerblue");
        copyBtnIcon.classList.toggle("jm-copy-icon-hide");
        copyBtn.style.pointerEvents = "auto";
      }, 250);
    }, 1500);
  };
  copyBtn.addEventListener("click", copyToClipboard);
  const showPopup = (event) => {
    const selectedText = window.getSelection();
    if (!event.target || !event.target.closest("#jm-popup")) {
      popupWindow.style.display = "none";
      disableCopyBtn(true);
    }
    if (!isConfigDialogOpen && selectedText && selectedText.toString().trim() !== "") {
      const number = parseInt(selectedText.toString().replace(/\D/g, ""));
      if (popupWindow.style.display !== "grid" && !Number.isNaN(number)) {
        const range = selectedText.getRangeAt(0);
        const activeEl = document.activeElement;
        const rect = activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT" ? activeEl.getBoundingClientRect() : range.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let top = Math.floor(scrollTop + rect.top + rect.height);
        const left = Math.floor(rect.left);
        if (top === 0 && left === 0 && rect.width === 0 && rect.height === 0) return;
        popupWindow.style.left = `${left}px`;
        popupWindow.style.top = `${top}px`;
        numberText.innerHTML = number.toString();
        numberText.style.color = "";
        popupWindow.style.display = "grid";
        const nbnhhsh = document.getElementsByClassName(
          "nbnhhsh-box nbnhhsh-box-pop"
        )[0];
        const originalNbnhhshTop = parseInt(nbnhhsh.style.top);
        const nbnhhshAdjust = () => {
          if (nbnhhsh) {
            const popupHeight = popupWindow.offsetHeight;
            const offset = popupHeight > 80 ? popupHeight + 10 : 80;
            if (!isNaN(originalNbnhhshTop)) {
              nbnhhsh.style.top = `${originalNbnhhshTop + offset}px`;
            } else {
              const rectNbnhhsh = nbnhhsh.getBoundingClientRect();
              const scrollTopNbnhhsh = document.documentElement.scrollTop || document.body.scrollTop;
              nbnhhsh.style.top = `${scrollTopNbnhhsh + rectNbnhhsh.top + offset}px`;
            }
          }
        };
        const configuredSources = config.sources;
        if (!configuredSources || configuredSources.length === 0) {
          toggleLoading("warning", "无可用线路，请先配置");
          disableCopyBtn(true);
          nbnhhshAdjust();
          return;
        }
        let sourceIndex = 0;
        toggleLoading("loading");
        nbnhhshAdjust();
        const tryNextSource = () => {
          if (sourceIndex >= configuredSources.length) {
            toggleLoading("fail", "获取信息失败或未找到车牌");
            disableCopyBtn(true);
            nbnhhshAdjust();
            return;
          }
          const currentSite = configuredSources[sourceIndex];
          JMFetchAlbumInfo(currentSite, number, (albumData) => {
            if (!albumData || albumData.id === 0 || !albumData.name) {
              sourceIndex++;
              tryNextSource();
              return;
            }
            toggleLoading("done", albumData, `${config.jmWebsiteUrl}/album/${albumData.id}`);
            disableCopyBtn(false);
            nbnhhshAdjust();
          });
        };
        tryNextSource();
      }
    }
  };
  const _showPopup = (event) => {
    setTimeout(() => {
      showPopup(event);
    }, 1);
  };
  document.addEventListener("mouseup", _showPopup);
  document.addEventListener("keyup", _showPopup);

})(CryptoJS);