// ==UserScript==
// @name         Bilibili File
// @namespace    npm/bilibili-file
// @version      1.1.0
// @author       https://github.com/WJZ-P
// @description  一款基于哔哩哔哩弹幕网(B站)的文件托管插件（￣▽￣）
// @license      Eclipse Public License 2.0
// @icon         https://i0.hdslb.com/bfs/material_up/12d89bc3fa38ffd23e1e8bad1e26037ddcf2f152.png
// @match        https://www.bilibili.com/*
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.runtime.global.prod.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536378/Bilibili%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/536378/Bilibili%20File.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const a=document.createElement("style");a.textContent=e,document.head.append(a)})(" .cyber-title[data-v-f31f94ef]{position:relative;text-align:center;margin:2rem 0;perspective:1000px;width:fit-content;display:flex;justify-content:center}.gradient-text[data-v-f31f94ef]{font-size:3.5rem;font-weight:900;background:linear-gradient(90deg,#00aeec,#7be7ff,#00aeec,#7be7ff,#00aeec);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradient-f31f94ef 4s linear infinite;display:inline-block;transform:translateZ(0);transition:transform .3s;width:fit-content}.glow[data-v-f31f94ef]{position:absolute;top:0;left:50%;transform:translate(-50%);width:80%;height:100%;background:radial-gradient(circle at 50% 50%,rgba(0,174,236,.4) 0%,transparent 70%);filter:blur(30px);z-index:-1}@keyframes gradient-f31f94ef{0%{background-position:0% center}to{background-position:-200% center}}.cyber-title:hover .gradient-text[data-v-f31f94ef]{transform:scale(1.05) rotateX(10deg) rotateY(-5deg);text-shadow:0 10px 20px rgba(0,174,236,.4)}.main-menu[data-v-f31f94ef]{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%}.file-manager[data-v-f31f94ef]{display:flex;flex-direction:column;width:95%;margin:20px auto;background:#fff;border-radius:12px;box-shadow:0 4px 12px #0000001a;padding:20px;height:calc(100vh - 150px);justify-content:flex-start;align-items:center;box-sizing:border-box}.action-bar[data-v-f31f94ef]{width:100%;display:flex;gap:20px;margin-bottom:30px;justify-content:center;align-items:center}.upload-area[data-v-f31f94ef]{flex:1;border:2px dashed #00aeec;border-radius:8px;padding:20px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;transition:all .3s}.upload-area[data-v-f31f94ef][data-v-f31f94ef]:hover{background:#f5fbff;border-color:#09c}.share-link-area[data-v-f31f94ef]{flex:1;display:flex;gap:10px;align-items:center;background:#fff;border:2px solid #00aeec;border-radius:8px;padding:0 15px;transition:all .3s}.share-link-area[data-v-f31f94ef][data-v-f31f94ef]:hover{border-color:#09c;box-shadow:0 2px 8px #00aeec1f}.share-link-area[data-v-f31f94ef] input[data-v-f31f94ef]{flex:1;border:none;outline:none;padding:12px 0;font-size:14px;color:#18191c;background:transparent}.share-link-area[data-v-f31f94ef] input[data-v-f31f94ef][data-v-f31f94ef]::placeholder{color:#9499a0}.share-link-area[data-v-f31f94ef] .download-btn[data-v-f31f94ef]{background:none;border:none;padding:8px;cursor:pointer;border-radius:6px;transition:all .2s;display:flex;align-items:center;justify-content:center}.share-link-area[data-v-f31f94ef] .download-btn[data-v-f31f94ef][data-v-f31f94ef]:hover{background:#00aeec1a;transform:scale(1.05)}.share-link-area[data-v-f31f94ef] .download-btn[data-v-f31f94ef] .iconfont[data-v-f31f94ef]{color:#00aeec;font-size:20px}.search-box[data-v-f31f94ef]{width:320px;position:relative;transition:all .3s cubic-bezier(.4,0,.2,1);display:flex;justify-content:center;height:45px}.search-box[data-v-f31f94ef] input[data-v-f31f94ef]{width:100%;padding:14px 48px 14px 24px;border:2px solid #00aeec;border-radius:40px;background:#f5fbffcc;font-size:14px;color:#18191c;transition:all .3s}.search-box[data-v-f31f94ef] input[data-v-f31f94ef][data-v-f31f94ef]::placeholder{color:#9499a0;font-weight:400}.search-box[data-v-f31f94ef] input[data-v-f31f94ef][data-v-f31f94ef]:hover{border-color:#09c;box-shadow:0 2px 8px #00aeec1f}.search-box[data-v-f31f94ef] input[data-v-f31f94ef][data-v-f31f94ef]:focus{outline:none;border-color:#0088b7;box-shadow:0 4px 16px #00aeec29;background:#fff}.search-box[data-v-f31f94ef] .iconfont[data-v-f31f94ef]{position:absolute;right:20px;top:50%;transform:translateY(-50%);color:#00aeec;font-size:20px;transition:all .3s}.search-box[data-v-f31f94ef]:hover .iconfont[data-v-f31f94ef]{color:#09c;transform:translateY(-50%) scale(1.1)}.search-box[data-v-f31f94ef] input:focus~.iconfont[data-v-f31f94ef]{color:#0088b7;animation:searchPulse-f31f94ef 1.5s infinite}@keyframes searchPulse-f31f94ef{0%,to{transform:translateY(-50%) scale(1)}50%{transform:translateY(-50%) scale(1.15)}}.file-list[data-v-f31f94ef]{width:100%;overflow-y:auto;flex:1;position:relative}.file-table[data-v-f31f94ef]{width:100%;border-collapse:collapse;border-spacing:0;table-layout:fixed}.file-table th[data-v-f31f94ef],.file-table td[data-v-f31f94ef]{padding:12px;text-align:center;border-bottom:1px solid #eee}.file-table .col-name[data-v-f31f94ef]{width:45%}.file-table .col-size[data-v-f31f94ef]{width:15%}.file-table .col-date[data-v-f31f94ef],.file-table .col-actions[data-v-f31f94ef]{width:20%}.file-table th[data-v-f31f94ef]{color:#666;font-weight:500;background:#fafafa}.file-row[data-v-f31f94ef]{position:relative;transition:background .2s}.file-row[data-v-f31f94ef]:hover{background:#f9f9f9}.file-name-cell[data-v-f31f94ef]{position:relative;display:flex;align-items:center;gap:10px;cursor:pointer;transition:color .2s;text-align:left;padding-bottom:4px}.file-name-cell[data-v-f31f94ef]:hover{color:#00aeec}.file-name[data-v-f31f94ef]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.action-buttons[data-v-f31f94ef]{display:flex;gap:8px;justify-content:center}.col-actions button[data-v-f31f94ef]{background:#00c1ff;border:none;padding:6px;border-radius:6px;cursor:pointer;transition:.2s;width:70px;display:flex;justify-content:center;align-items:center;gap:4px}.col-actions button[data-v-f31f94ef] .iconfont[data-v-f31f94ef]{color:#fff;font-size:18px}.col-actions button[data-v-f31f94ef] span[data-v-f31f94ef]{color:#fff;font-weight:400;font-size:14px}.col-actions button[data-v-f31f94ef][data-v-f31f94ef]:hover{background:#6cf;transform:translateY(-2px);box-shadow:0 3px 12px #00aeec4d}.col-actions button[data-v-f31f94ef].btn-delete[data-v-f31f94ef]{background:#f54b4cdb}.col-actions button[data-v-f31f94ef].btn-delete[data-v-f31f94ef][data-v-f31f94ef]:hover{background:#ff6668;box-shadow:0 3px 12px #ff4d4f4d}.col-actions button[data-v-f31f94ef].btn-preview[data-v-f31f94ef]{background:#00ff438f}.col-actions button[data-v-f31f94ef].btn-preview[data-v-f31f94ef][data-v-f31f94ef]:hover{background:#00ff43c2;box-shadow:0 3px 12px #00ff434d}.progress-bar[data-v-f31f94ef]{position:absolute;bottom:0;left:0;width:100%;height:2px;background:#00aeec1a;overflow:hidden;border-radius:1px;z-index:1}.progress-inner[data-v-f31f94ef]{height:100%;background:#00aeec;transition:width .3s ease;border-radius:1px}@font-face{font-family:iconfont;src:url(//at.alicdn.com/t/c/font_123456_xxxxxx.css)}.modal-fade-enter-active[data-v-f31f94ef],.modal-fade-leave-active[data-v-f31f94ef]{transition:opacity .25s ease}.modal-fade-enter-from[data-v-f31f94ef],.modal-fade-leave-to[data-v-f31f94ef]{opacity:0}.preview-modal[data-v-f31f94ef]{position:fixed;top:0;right:0;bottom:0;left:0;background:#e5e8e833;z-index:9999;display:flex;justify-content:center;align-items:center;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.modal-container[data-v-f31f94ef]{position:relative;background:#fff;border-radius:12px;box-shadow:0 12px 24px #66ccff59;max-width:90vw;max-height:90vh;overflow:hidden}.close-btn[data-v-f31f94ef]{position:absolute;top:16px;right:16px;background:#ffffff1a;border:none;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;z-index:1}.close-btn[data-v-f31f94ef]:hover{background:#fff3;transform:scale(1.1)}.icon-close[data-v-f31f94ef]{color:#fff;font-size:24px}.image-wrapper[data-v-f31f94ef]{position:relative;width:80vw;max-width:2000px;height:80vh;display:flex;align-items:center;justify-content:center;padding:40px}.image-wrapper img[data-v-f31f94ef]{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px}.loading-indicator[data-v-f31f94ef]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;color:#fffc}.spinner[data-v-f31f94ef]{width:40px;height:40px;border:4px solid rgba(255,255,255,.1);border-top-color:#00aeec;border-radius:50%;animation:spin-f31f94ef 1s linear infinite;margin-bottom:12px}@keyframes spin-f31f94ef{to{transform:rotate(360deg)}}.error-message[data-v-f31f94ef]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff4d4f;font-size:1.2em}.file-info[data-v-f31f94ef]{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,#66ccffc2);color:#1e1d1d;padding:15px;text-align:center;font-size:1em;-webkit-backdrop-filter:blur(1px);backdrop-filter:blur(1px)}.footer-info[data-v-f31f94ef]{width:90%;text-align:center;color:#777;font-size:1em;border-top:1px solid #eee}.footer-info[data-v-f31f94ef] a[data-v-f31f94ef]{color:#6cf}.copy-toast[data-v-f31f94ef]{position:fixed;background:#00aeecd9;color:#fff;padding:12px 24px;border-radius:8px;box-shadow:0 4px 12px #00aeec4d;z-index:100;font-size:14px;font-weight:500;pointer-events:none;white-space:nowrap;transform:translate(-50%)}.toast-fade-enter-active[data-v-f31f94ef],.toast-fade-leave-active[data-v-f31f94ef]{transition:all .3s ease}.toast-fade-enter-from[data-v-f31f94ef],.toast-fade-leave-to[data-v-f31f94ef]{opacity:0;transform:translate(-50%,10px)}.col-name[data-v-f31f94ef]{position:relative;cursor:pointer;transition:color .2s}.col-name[data-v-f31f94ef]:hover{color:#00aeec}.file-list[data-v-f31f94ef]::-webkit-scrollbar{width:8px}.file-list[data-v-f31f94ef]::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.file-list[data-v-f31f94ef]::-webkit-scrollbar-thumb{background:#6cf;border-radius:4px}.file-list[data-v-f31f94ef]::-webkit-scrollbar-thumb:hover{background:#09c}.file-table thead[data-v-f31f94ef],.file-table th[data-v-f31f94ef]{position:sticky;top:0;background:#fafafa;z-index:2}.main-container{width:100%;height:95%;display:flex;justify-content:center;align-items:center} ");

(async function (vue) {
  'use strict';

  var _a;
  const uploadUrl = "https://member.bilibili.com/x/material/up/upload";
  const pixelPath = "https://i0.hdslb.com/bfs/material_up/49f20d9277765f51227fecb4db010350c3ed90ad.gif";
  const headers = new Headers({
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
    "origin": "https://member.bilibili.com",
    //"priority": "u=1, i",
    "referer": "https://member.bilibili.com/york/image-material-upload",
    "sec-ch-ua": '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0"
    //"Cookie": credentials.cookie
  });
  const credentials = {};
  async function uploadFile(file, onProgress) {
    if (!file || !(credentials == null ? void 0 : credentials.bili_jct)) {
      throw new Error("缺少必要参数：file/csrf");
    }
    if (!isImage(file)) {
      const pixelBuffer = await (await fetch(pixelPath)).arrayBuffer();
      const mergedBlob = new Blob([pixelBuffer, new Blob([file])]);
      file = new File([mergedBlob], file.name);
    }
    const formData = new FormData();
    const filename = file.name || `bili_upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    formData.append("bucket", "material_up");
    formData.append("dir", "");
    formData.append("file", file, filename);
    formData.append("csrf", credentials.bili_jct);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round(event.loaded / event.total * 100);
          onProgress(progress);
        }
      });
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            if (result.code !== 0) {
              reject(new Error(`上传失败: ${result.message} (code: ${result.code})`));
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(new Error("解析响应失败"));
          }
        } else {
          reject(new Error(`HTTP错误: ${xhr.status}`));
        }
      });
      xhr.addEventListener("error", () => {
        reject(new Error("网络请求失败"));
      });
      xhr.open("POST", uploadUrl);
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  }
  function isImage(file) {
    var _a2;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
    const extension = ((_a2 = file.name.split(".").pop()) == null ? void 0 : _a2.toLowerCase()) || "";
    return imageExtensions.includes(extension);
  }
  const SAVE_FILES_KEY = "bili_files";
  function saveFiles(files) {
    try {
      localStorage.setItem(SAVE_FILES_KEY, JSON.stringify(files));
    } catch (error) {
      console.error("[Bilibili-File] 本地存储失败", error);
    }
  }
  function loadFiles() {
    try {
      const data = localStorage.getItem(SAVE_FILES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log("存储读取失败", error);
      return [];
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-f31f94ef"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "main-menu" };
  const _hoisted_2 = { class: "file-manager" };
  const _hoisted_3 = { class: "cyber-title" };
  const _hoisted_4 = { class: "gradient-text" };
  const _hoisted_5 = /* @__PURE__ */ vue.createTextVNode("Bilibili File ( ｡・▽・｡ )ﾉ");
  const _hoisted_6 = /* @__PURE__ */ vue.createTextVNode("Bilibili File (*ﾉωﾉ)");
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "glow" }, null, -1));
  const _hoisted_8 = { class: "action-bar" };
  const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "iconfont icon-upload" }, null, -1));
  const _hoisted_10 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "点击上传文件", -1));
  const _hoisted_11 = { class: "share-link-area" };
  const _hoisted_12 = ["onKeyup"];
  const _hoisted_13 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "iconfont icon-download" }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "20px",
      viewBox: "0 -960 960 960",
      width: "20px",
      fill: "#5f6368"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", { d: "M480-328.46 309.23-499.23l42.16-43.38L450-444v-336h60v336l98.61-98.61 42.16 43.38L480-328.46ZM252.31-180Q222-180 201-201q-21-21-21-51.31v-108.46h60v108.46q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-108.46h60v108.46Q780-222 759-201q-21 21-51.31 21H252.31Z" })
    ])
  ], -1));
  const _hoisted_14 = [
    _hoisted_13
  ];
  const _hoisted_15 = { class: "search-box" };
  const _hoisted_16 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "iconfont icon-search" }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24px",
      viewBox: "0 -960 960 960",
      width: "24px",
      fill: "#5f6368"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", { d: "M781.69-136.92 530.46-388.16q-30 24.77-69 38.77-39 14-80.69 14-102.55 0-173.58-71.01-71.03-71.01-71.03-173.54 0-102.52 71.01-173.6 71.01-71.07 173.54-71.07 102.52 0 173.6 71.03 71.07 71.03 71.07 173.58 0 42.85-14.38 81.85-14.39 39-38.39 67.84l251.23 251.23-42.15 42.16ZM380.77-395.38q77.31 0 130.96-53.66 53.66-53.65 53.66-130.96t-53.66-130.96q-53.65-53.66-130.96-53.66t-130.96 53.66Q196.15-657.31 196.15-580t53.66 130.96q53.65 53.66 130.96 53.66Z" })
    ])
  ], -1));
  const _hoisted_17 = { class: "file-list" };
  const _hoisted_18 = { class: "file-table" };
  const _hoisted_19 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("thead", null, [
    /* @__PURE__ */ vue.createElementVNode("tr", null, [
      /* @__PURE__ */ vue.createElementVNode("th", { class: "col-name" }, "文件名"),
      /* @__PURE__ */ vue.createElementVNode("th", { class: "col-size" }, "大小"),
      /* @__PURE__ */ vue.createElementVNode("th", { class: "col-date" }, "上传日期"),
      /* @__PURE__ */ vue.createElementVNode("th", { class: "col-actions" }, "操作")
    ])
  ], -1));
  const _hoisted_20 = ["onClick"];
  const _hoisted_21 = { class: "file-name-cell" };
  const _hoisted_22 = {
    key: 0,
    class: "iconfont icon-file"
  };
  const _hoisted_23 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 -960 960 960",
    width: "24px",
    fill: "#5f6368"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM270-290h423.07L561.54-465.38 449.23-319.23l-80-102.31L270-290Zm-70 90v-560 560Z" })
  ], -1));
  const _hoisted_24 = [
    _hoisted_23
  ];
  const _hoisted_25 = {
    key: 1,
    class: "iconfont icon-file"
  };
  const _hoisted_26 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 -960 960 960",
    width: "24px",
    fill: "#5f6368"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M640-480v-80h80v80h-80Zm0 80h-80v-80h80v80Zm0 80v-80h80v80h-80ZM447.38-640l-80-80H172.31q-5.39 0-8.85 3.46t-3.46 8.85v455.38q0 5.39 3.46 8.85t8.85 3.46H560v-80h80v80h147.69q5.39 0 8.85-3.46t3.46-8.85v-375.38q0-5.39-3.46-8.85t-8.85-3.46H640v80h-80v-80H447.38ZM172.31-180Q142-180 121-201q-21-21-21-51.31v-455.38Q100-738 121-759q21-21 51.31-21h219.61l80 80h315.77Q818-700 839-679q21 21 21 51.31v375.38Q860-222 839-201q-21 21-51.31 21H172.31ZM160-240v-480 480Z" })
  ], -1));
  const _hoisted_27 = [
    _hoisted_26
  ];
  const _hoisted_28 = {
    key: 2,
    class: "iconfont icon-file"
  };
  const _hoisted_29 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 -960 960 960",
    width: "24px",
    fill: "#5f6368"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" })
  ], -1));
  const _hoisted_30 = [
    _hoisted_29
  ];
  const _hoisted_31 = { class: "file-name" };
  const _hoisted_32 = { class: "col-size" };
  const _hoisted_33 = { class: "col-date" };
  const _hoisted_34 = { class: "col-actions" };
  const _hoisted_35 = { class: "action-buttons" };
  const _hoisted_36 = ["onClick"];
  const _hoisted_37 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "iconfont icon-preview" }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "20px",
      viewBox: "0 -960 960 960",
      width: "20px",
      fill: "#5f6368"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", { d: "M480.09-336.92q67.99 0 115.49-47.59t47.5-115.58q0-67.99-47.59-115.49t-115.58-47.5q-67.99 0-115.49 47.59t-47.5 115.58q0 67.99 47.59 115.49t115.58 47.5ZM480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm.05 172q-137.97 0-251.43-76.12Q115.16-372.23 61.54-500q53.62-127.77 167.02-203.88Q341.97-780 479.95-780q137.97 0 251.43 76.12Q844.84-627.77 898.46-500q-53.62 127.77-167.02 203.88Q618.03-220 480.05-220ZM480-500Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" })
    ])
  ], -1));
  const _hoisted_38 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "预览", -1));
  const _hoisted_39 = [
    _hoisted_37,
    _hoisted_38
  ];
  const _hoisted_40 = ["onClick"];
  const _hoisted_41 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "iconfont icon-download" }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "20px",
      viewBox: "0 -960 960 960",
      width: "20px",
      fill: "#5f6368"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", { d: "M480-328.46 309.23-499.23l42.16-43.38L450-444v-336h60v336l98.61-98.61 42.16 43.38L480-328.46ZM252.31-180Q222-180 201-201q-21-21-21-51.31v-108.46h60v108.46q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-108.46h60v108.46Q780-222 759-201q-21 21-51.31 21H252.31Z" })
    ])
  ], -1));
  const _hoisted_42 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "下载", -1));
  const _hoisted_43 = [
    _hoisted_41,
    _hoisted_42
  ];
  const _hoisted_44 = ["onClick"];
  const _hoisted_45 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "iconfont icon-delete" }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "20px",
      viewBox: "0 -960 960 960",
      width: "20px",
      fill: "#5f6368"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", { d: "M292.31-140q-29.92 0-51.12-21.19Q220-182.39 220-212.31V-720h-40v-60h180v-35.38h240V-780h180v60h-40v507.69Q740-182 719-161q-21 21-51.31 21H292.31ZM680-720H280v507.69q0 5.39 3.46 8.85t8.85 3.46h375.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-720ZM376.16-280h59.99v-360h-59.99v360Zm147.69 0h59.99v-360h-59.99v360ZM280-720v520-520Z" })
    ])
  ], -1));
  const _hoisted_46 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "删除", -1));
  const _hoisted_47 = [
    _hoisted_45,
    _hoisted_46
  ];
  const _hoisted_48 = {
    key: 0,
    class: "progress-bar"
  };
  const _hoisted_49 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "footer-info" }, [
    /* @__PURE__ */ vue.createTextVNode(" © 2025 "),
    /* @__PURE__ */ vue.createElementVNode("a", {
      href: "https://github.com/WJZ-P/Bilibili-File",
      target: "_blank",
      title: "GitHub地址"
    }, "Bilibili File"),
    /* @__PURE__ */ vue.createTextVNode(". Made by WJZ_P with love. （￣▽￣） ")
  ], -1));
  const _hoisted_50 = ["onClick"];
  const _hoisted_51 = { class: "modal-container" };
  const _hoisted_52 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", { class: "iconfont icon-close" }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24px",
      viewBox: "0 -960 960 960",
      width: "24px",
      fill: "#5f6368"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", { d: "M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" })
    ])
  ], -1));
  const _hoisted_53 = [
    _hoisted_52
  ];
  const _hoisted_54 = { class: "image-wrapper" };
  const _hoisted_55 = ["src", "alt"];
  const _hoisted_56 = {
    key: 0,
    class: "loading-indicator"
  };
  const _hoisted_57 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "spinner" }, null, -1));
  const _hoisted_58 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "加载中...", -1));
  const _hoisted_59 = [
    _hoisted_57,
    _hoisted_58
  ];
  const _hoisted_60 = { class: "file-info" };
  const _sfc_main$1 = {
    setup(__props) {
      const fileInputEl = vue.ref(null);
      const isHovered = vue.ref(false);
      const files = vue.ref([]);
      const previewImg = vue.ref(null);
      const loading = vue.ref(false);
      const loadError = vue.ref(false);
      const showViewModel = vue.ref(false);
      const searchQuery = vue.ref("");
      const sliceIndex = 35;
      vue.onMounted(() => {
        files.value = loadFiles();
      });
      const filteredFiles = vue.computed(() => {
        if (!searchQuery.value.trim()) return files.value;
        const query = searchQuery.value.trim().toLowerCase();
        return files.value.filter((file) => {
          return file.name.toLowerCase().includes(query);
        });
      });
      const handleUpload = () => fileInputEl.value.click();
      const fileProgress = vue.ref({});
      const shareLink = vue.ref("");
      const handleFileSelect = async (event) => {
        console.log("下面打印出传入的文件参数");
        console.log(event.target.files);
        const filePromises = Array.from(event.target.files).map((file) => {
          const resultFile = {
            name: file.name,
            size: file.size,
            url: "",
            lastModified: Date.now(),
            status: "uploading"
          };
          files.value.push(resultFile);
          fileProgress.value[file.name] = 0;
          return { file, resultFile };
        });
        try {
          const uploadPromises = filePromises.map(
            ({ file, resultFile }) => uploadFile(file, (progress) => {
              fileProgress.value[file.name] = progress;
            }).then((result) => {
              resultFile.url = result.data.location.replace(/^http:\/\//i, "https://");
              resultFile.status = "success";
              delete fileProgress.value[file.name];
            }).catch((error) => {
              console.error(`文件 ${file.name} 上传失败:`, error);
              resultFile.status = "error";
              delete fileProgress.value[file.name];
              showToastMessage(`文件 ${file.name} 上传失败，请重试`, {
                clientX: window.innerWidth / 2,
                clientY: 100
              });
            })
          );
          await Promise.all(uploadPromises);
          saveFiles(files.value);
        } catch (error) {
          console.error("批量上传过程中发生错误:", error);
          showToastMessage("上传过程中发生错误，请重试", {
            clientX: window.innerWidth / 2,
            clientY: 100
          });
        }
      };
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0];
      };
      const formatSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const units = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
      };
      const handleDownload = async (file) => {
        try {
          fileProgress.value[file.name] = 0;
          const response = await fetch(file.url);
          const reader = response.body.getReader();
          const contentLength = +response.headers.get("Content-Length");
          let receivedLength = 0;
          let chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            chunks.push(value);
            receivedLength += value.length;
            fileProgress.value[file.name] = Math.round(receivedLength / contentLength * 100);
          }
          let blob = new Blob(chunks);
          if (!isImage2(file)) blob = blob.slice(sliceIndex);
          const url2 = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url2;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url2);
          setTimeout(() => {
            delete fileProgress.value[file.name];
          }, 1e3);
        } catch (error) {
          console.error("下载失败:", error);
          showToastMessage("下载失败，请重试", { clientX: window.innerWidth / 2, clientY: 100 });
          delete fileProgress.value[file.name];
        }
      };
      const handleDelete = (file) => {
        files.value = files.value.filter(
          (f) => !(f.name === file.name && f.size === file.size)
        );
        console.log("删除后的总文件列表");
        console.log(files.value);
        saveFiles(files.value);
      };
      const handlePreview = (file) => {
        showViewModel.value = true;
        previewImg.value = file;
      };
      const closePreview = () => {
        showViewModel.value = false;
        previewImg.value = null;
      };
      const handleImageLoad = () => {
        loading.value = false;
      };
      const handleImageError = () => {
        loading.value = false;
        loadError.value = true;
      };
      function isImage2(file) {
        var _a2;
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
        const extension = ((_a2 = file.name.split(".").pop()) == null ? void 0 : _a2.toLowerCase()) || "";
        return imageExtensions.includes(extension);
      }
      function isCompressed(file) {
        var _a2;
        const compressedExtensions = [
          "zip",
          "rar",
          "7z",
          "tar",
          "gz",
          "bz2",
          "xz",
          "dmg",
          "iso",
          "cab",
          "arj",
          "z",
          "lz",
          "lzma",
          "tgz"
        ];
        const extension = ((_a2 = file.name.split(".").pop()) == null ? void 0 : _a2.toLowerCase()) || "";
        return compressedExtensions.includes(extension);
      }
      const handleMouseEnter = () => isHovered.value = true;
      const handleMouseLeave = () => isHovered.value = false;
      const showToast = vue.ref(false);
      const toastMessage = vue.ref("");
      const toastPosition = vue.ref({ x: 0, y: 0 });
      const toastStyle = vue.computed(() => ({
        left: `${toastPosition.value.x}px`,
        top: `${toastPosition.value.y}px`
      }));
      const showToastMessage = (message, event) => {
        toastMessage.value = message;
        const x = event.clientX;
        const y = event.clientY - 40;
        const maxX = window.innerWidth - 200;
        const maxY = window.innerHeight - 50;
        toastPosition.value = {
          x: Math.min(Math.max(x + 100, 0), maxX),
          // 水平居中
          y: Math.min(Math.max(y, 0), maxY)
        };
        showToast.value = true;
        setTimeout(() => {
          showToast.value = false;
        }, 1e3);
      };
      const copyFileLink = async (file, event) => {
        try {
          await navigator.clipboard.writeText(file.url);
          showToastMessage("链接已复制到剪贴板", event);
        } catch (err) {
          console.error("复制失败:", err);
          showToastMessage("复制失败，请重试", event);
        }
      };
      const handleShareLinkDownload = async () => {
        if (!shareLink.value.trim()) {
          showToastMessage("请输入分享链接", { clientX: window.innerWidth / 2, clientY: 100 });
          return;
        }
        try {
          if (!shareLink.value.startsWith("https://")) {
            showToastMessage("请输入有效的链接", { clientX: window.innerWidth / 2, clientY: 100 });
            return;
          }
          const fileName2 = shareLink.value.split("/").pop() || "downloaded_file";
          fileProgress.value[fileName2] = 0;
          const response = await fetch(shareLink.value);
          const reader = response.body.getReader();
          const contentLength = +response.headers.get("Content-Length");
          let receivedLength = 0;
          let chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            fileProgress.value[fileName2] = Math.round(receivedLength / contentLength * 100);
          }
          const blob = new Blob(chunks);
          const url2 = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url2;
          a.download = fileName2;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url2);
          shareLink.value = "";
          setTimeout(() => {
            delete fileProgress.value[fileName2];
          }, 1e3);
          showToastMessage("文件下载成功", { clientX: window.innerWidth / 2, clientY: 100 });
        } catch (error) {
          console.error("下载失败:", error);
          showToastMessage("下载失败，请检查链接是否正确", { clientX: window.innerWidth / 2, clientY: 100 });
          delete fileProgress.value[fileName];
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("h1", _hoisted_3, [
                vue.createElementVNode("a", {
                  href: "https://github.com/WJZ-P/Bilibili-File",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  class: "title-link",
                  onMouseenter: handleMouseEnter,
                  onMouseleave: handleMouseLeave
                }, [
                  vue.createElementVNode("span", _hoisted_4, [
                    !isHovered.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                      _hoisted_5
                    ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      _hoisted_6
                    ], 64))
                  ]),
                  _hoisted_7
                ], 32)
              ]),
              vue.createElementVNode("div", _hoisted_8, [
                vue.createElementVNode("div", {
                  class: "upload-area",
                  onClick: handleUpload
                }, [
                  _hoisted_9,
                  _hoisted_10,
                  vue.createElementVNode("input", {
                    type: "file",
                    ref_key: "fileInputEl",
                    ref: fileInputEl,
                    multiple: "",
                    style: { "display": "none" },
                    onChange: handleFileSelect
                  }, null, 544)
                ]),
                vue.createElementVNode("div", _hoisted_11, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => shareLink.value = $event),
                    placeholder: "粘贴分享链接...",
                    onKeyup: vue.withKeys(handleShareLinkDownload, ["enter"])
                  }, null, 40, _hoisted_12), [
                    [vue.vModelText, shareLink.value]
                  ]),
                  vue.createElementVNode("button", {
                    class: "download-btn",
                    onClick: handleShareLinkDownload
                  }, _hoisted_14)
                ]),
                vue.createElementVNode("div", _hoisted_15, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => searchQuery.value = $event),
                    placeholder: "搜索文件...",
                    onInput: _cache[2] || (_cache[2] = (...args) => _ctx.handleSearch && _ctx.handleSearch(...args))
                  }, null, 544), [
                    [vue.vModelText, searchQuery.value]
                  ]),
                  _hoisted_16
                ])
              ]),
              vue.createElementVNode("div", _hoisted_17, [
                vue.createElementVNode("table", _hoisted_18, [
                  _hoisted_19,
                  vue.createElementVNode("tbody", null, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(filteredFiles), (file) => {
                      return vue.openBlock(), vue.createElementBlock("tr", {
                        key: file.name + file.size,
                        class: "file-row"
                      }, [
                        vue.createElementVNode("td", {
                          class: "col-name",
                          onClick: ($event) => copyFileLink(file, $event),
                          title: "点击复制下载链接"
                        }, [
                          vue.createElementVNode("div", _hoisted_21, [
                            isImage2(file) ? (vue.openBlock(), vue.createElementBlock("i", _hoisted_22, _hoisted_24)) : isCompressed(file) ? (vue.openBlock(), vue.createElementBlock("i", _hoisted_25, _hoisted_27)) : (vue.openBlock(), vue.createElementBlock("i", _hoisted_28, _hoisted_30)),
                            vue.createElementVNode("span", _hoisted_31, vue.toDisplayString(file.name), 1)
                          ])
                        ], 8, _hoisted_20),
                        vue.createElementVNode("td", _hoisted_32, vue.toDisplayString(formatSize(file.size)), 1),
                        vue.createElementVNode("td", _hoisted_33, vue.toDisplayString(formatDate(file.lastModified)), 1),
                        vue.createElementVNode("td", _hoisted_34, [
                          vue.createElementVNode("div", _hoisted_35, [
                            isImage2(file) ? (vue.openBlock(), vue.createElementBlock("button", {
                              key: 0,
                              class: "btn-preview",
                              onClick: vue.withModifiers(($event) => handlePreview(file), ["stop"])
                            }, _hoisted_39, 8, _hoisted_36)) : vue.createCommentVNode("", true),
                            file.status === "success" ? (vue.openBlock(), vue.createElementBlock("button", {
                              key: 1,
                              class: "btn-download",
                              onClick: vue.withModifiers(($event) => handleDownload(file), ["stop"])
                            }, _hoisted_43, 8, _hoisted_40)) : vue.createCommentVNode("", true),
                            vue.createElementVNode("button", {
                              class: "btn-delete",
                              onClick: vue.withModifiers(($event) => handleDelete(file), ["stop"])
                            }, _hoisted_47, 8, _hoisted_44)
                          ])
                        ]),
                        file.status === "uploading" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_48, [
                          vue.createElementVNode("div", {
                            class: "progress-inner",
                            style: vue.normalizeStyle({ width: `${fileProgress.value[file.name] || 0}%` })
                          }, null, 4)
                        ])) : vue.createCommentVNode("", true)
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ]),
            _hoisted_49
          ]),
          (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
            vue.createVNode(vue.Transition, { name: "modal-fade" }, {
              default: vue.withCtx(() => [
                showViewModel.value ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "preview-modal",
                  onClick: vue.withModifiers(closePreview, ["self"])
                }, [
                  vue.createElementVNode("div", _hoisted_51, [
                    vue.createElementVNode("button", {
                      class: "close-btn",
                      onClick: closePreview
                    }, _hoisted_53),
                    vue.createElementVNode("div", _hoisted_54, [
                      vue.createElementVNode("img", {
                        src: previewImg.value.url,
                        alt: previewImg.value.name,
                        onLoad: handleImageLoad,
                        onError: handleImageError
                      }, null, 40, _hoisted_55),
                      loading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_56, _hoisted_59)) : vue.createCommentVNode("", true)
                    ]),
                    vue.createElementVNode("div", _hoisted_60, vue.toDisplayString(previewImg.value.name), 1)
                  ])
                ], 8, _hoisted_50)) : vue.createCommentVNode("", true)
              ]),
              _: 1
            })
          ])),
          (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
            vue.createVNode(vue.Transition, { name: "toast-fade" }, {
              default: vue.withCtx(() => [
                showToast.value ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "copy-toast",
                  style: vue.normalizeStyle(vue.unref(toastStyle))
                }, vue.toDisplayString(toastMessage.value), 5)) : vue.createCommentVNode("", true)
              ]),
              _: 1
            })
          ]))
        ], 64);
      };
    }
  };
  const MainMenu = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f31f94ef"]]);
  const _hoisted_1 = { class: "main-container" };
  const _sfc_main = {
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(MainMenu)
        ]);
      };
    }
  };
  vue.createApp(_sfc_main).mount(
    (() => {
      if (document.contentType !== "text/html" || window.location.href !== "https://www.bilibili.com/bilibili-file") return;
      const app = document.createElement("div");
      document.querySelector(".error-container").remove();
      document.body.append(app);
      return app;
    })()
  );
  console.log("[Bilibili-File] 启动");
  console.log("为了防止未加载完成，先等待一秒");
  await( sleep(1e3));
  credentials["bili_jct"] = (_a = document.cookie.split("; ").find((row) => row.startsWith("bili_jct="))) == null ? void 0 : _a.split("=")[1];
  credentials["cookie"] = document.cookie;
  const url = new URL(window.location.href);
  if (url.hostname.includes("www.bilibili.com")) addMyBtn();
  else console.log("[Bilibili-File] 不在B站首页，不添加上传按钮");
  if (url.pathname.includes("bilibili-file")) {
    document.title = "文件上传 - Bilibili-File";
  }
  function addMyBtn() {
    const list = document.querySelector(".right-entry");
    const button = document.querySelector(".right-entry-item--upload");
    let cloneBtn;
    if (list && button) {
      cloneBtn = button.cloneNode(true);
      cloneBtn.id = "bilibili-file-uploadFile";
      list.appendChild(cloneBtn);
    } else {
      console.log("[Bilibili-File] 元素未找到，添加上传按钮失败");
    }
    cloneBtn.querySelector(".header-upload-entry__text").textContent = "传输";
    cloneBtn.querySelector(".header-upload-entry__icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M450-224.62h60V-402l74 74 42.15-42.77L480-516.92 333.85-370.77l42.77 42.15L450-402v177.38ZM252.31-100Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z"/></svg>`;
    cloneBtn.onclick = null;
    cloneBtn.removeAttribute("onclick");
    cloneBtn.addEventListener("click", (event) => {
      window.location.href = "https://www.bilibili.com/bilibili-file";
    });
  }
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

})(Vue);