// ==UserScript==
// @name         七象影视解析
// @namespace    qx-parse
// @version      0.0.1
// @description  优酷、爱奇艺、腾讯、B站等视频网站视频解析，悬浮面板
// @author       通天教主
// @icon         data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPgoJPHRpdGxlPmJyb3dzZXItY2hyb21lPC90aXRsZT4KCTxzdHlsZT4KCQkuczAgeyBmaWxsOiAjYWZjZGZmIH0gCgkJLnMxIHsgZmlsbDogIzM4ODNmZiB9IAoJPC9zdHlsZT4KCTxwYXRoIGlkPSLlm77lsYIgNCIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGFzcz0iczAiIGQ9Im02IDBoMjBjMy4zIDAgNiAyLjcgNiA2djIwYzAgMy4zLTIuNyA2LTYgNmgtMjBjLTMuMyAwLTYtMi43LTYtNnYtMjBjMC0zLjMgMi43LTYgNi02eiIvPgoJPHBhdGggaWQ9IuW9oueKtiAxIiBjbGFzcz0iczEiIGQ9Im0yMiAxNy41YzAuNS0wLjcgMC41LTEuOSAwLTIuN2wtNy40LTYuMmMtMC42LTAuNS0xLjUtMC42LTIuMy0wLjMtMC44IDAuMi0xLjMgMC44LTEuMyAxLjR2MTIuOWMwIDAuNyAwLjUgMS4zIDEuMyAxLjUgMC44IDAuMyAxLjcgMC4xIDIuMy0wLjMgMCAwIDcuNC02LjMgNy40LTYuM3oiLz4KPC9zdmc+
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/resource/pcw/play/*
// @match        *://*.iq.com/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://v.qq.com/tv/*
// @match        *://m.v.qq.com/x/cover/*
// @match        *://m.v.qq.com/x/page/*
// @match        *://m.v.qq.com/*
// @match        *://*.bilibili.com/**
// @match        *://*.mgtv.com/b/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.pptv.com/show/*
// @match        *://*.1905.com/video/*
// @match        *://*.1905.com/play/*
// @match        *://*.1905.com/*/play/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528818/%E4%B8%83%E8%B1%A1%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/528818/%E4%B8%83%E8%B1%A1%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(
    navigator.userAgent
  );

  const parseApiListStr = GM_getValue("parseApiList", "[]");

  let parseApiList = JSON.parse(parseApiListStr);

  function parseApi2Text(parseApiList) {
    let texts = [];
    parseApiList.forEach((api) => {
      let line = api.name + "," + api.url;
      texts.push(line);
    });
    return texts.join("\n");
  }

  function text2ParseApi(text) {
    let lines = text.split("\n");
    let apis = [];
    lines.forEach((line) => {
      let res = line.split(",");
      if (res.length !== 2) {
        if (res.length === 1) {
          res.unshift(getSLDFromUrl(res[0]));
        } else return;
      }
      let [name, url] = res;
      apis.push({
        name: name.trim(),
        url: url.trim(),
      });
    });
    return apis;
  }

  let parseBtns = [];

  function setParseBtns() {
    const singleParsePanel = document.getElementById("qxjfal-singleParsePanel");
    parseBtns.forEach((btn) => singleParsePanel.removeChild(btn));
    parseBtns = [];
    parseApiList.forEach((api, index) => {
      const parseBtn = document.createElement("button");
      parseBtn.textContent = api.name;
      parseBtn.title = api.name + " " + api.url;
      if (index === fastUrlIndex) {
        parseBtn.style.backgroundColor = "#ff9999";
      }
      parseBtn.addEventListener("click", () => {
        fastUrlIndex = index;
        GM_setValue("fastUrlIndex", index);
        parseBtns.forEach((btn) => {
          btn.style.backgroundColor = "";
        });
        parseBtns[index].style.backgroundColor = "#ff9999";
        const fastbootBtn = document.getElementById("qxjfal-fastboot");
        fastbootBtn.title = `快速开始（当前所选接口：${api.name}）`;
        parseVideo(api.url, showMode);
      });
      parseBtns.push(parseBtn);
      singleParsePanel.appendChild(parseBtn);
    });
  }

  function openSettingPanel() {
    const settingPanel = document.createElement("div");
    settingPanel.id = "qxjfal-setting-panel";
    const settingHtml = `
      <div class='qxjfal-setting-panel-header'>
        <div class='qxjfal-setting-panel-title'>设置自定义解析接口</div>
        <div class='qxjfal-setting-panel-closebtn'>X</div>
      </div>
      <div style='padding: 15px;'>
        <div>
          <p>自定义解析接口
          </p>
          <p>数据格式：[名字] + [,] + [接口地址]</p>
          <p>例如：名字,https://xxxxxx?url=</p>
          <p>一行一个自定义接口，如果不提供名字，则自动将二级域名作为名字
          </p>
        </div>
        <div>
          <textarea class="qxjfal-setting-panel-textarea" rows="10" cols="50"></textarea>
        </div>
        <div>
          <button class="qxjfal-setting-savebtn">保存</button>
        </div>
      </div>
    `;
    settingPanel.innerHTML = settingHtml;
    const settingPanelHeader = settingPanel.querySelector(
      ".qxjfal-setting-panel-header"
    );
    makeDraggable({
      element: settingPanel,
      handle: settingPanelHeader,
      enableX: true,
      enableY: true,
    });
    const settingPanelCloseBtn = settingPanel.querySelector(
      ".qxjfal-setting-panel-closebtn"
    );
    settingPanelCloseBtn.addEventListener("click", () => {
      document.body.removeChild(settingPanel);
    });
    const settingPanelTextarea = settingPanel.querySelector(
      ".qxjfal-setting-panel-textarea"
    );
    settingPanelTextarea.value = parseApi2Text(parseApiList);
    const settingSaveBtn = settingPanel.querySelector(
      ".qxjfal-setting-savebtn"
    );
    settingSaveBtn.addEventListener("click", () => {
      parseApiList = text2ParseApi(settingPanelTextarea.value);
      GM_setValue("parseApiList", JSON.stringify(parseApiList));
      setParseBtns();
      settingPanelCloseBtn.click();
    });
    document.body.appendChild(settingPanel);
  }

  const parseVideoAgainLater = () => {
    setTimeout(parseVideoAgain, 1000);
  };

  // 网站与解析规则的映射
  const siteRules = {
    "v.qq.com": {
      node: [".player__container", "#player-container"],
      area: "playlist-list",
    },
    "iqiyi.com": { node: ["#video"], area: "" },
    "iq.com": { node: [".intl-video-wrap"], area: "m-sliding-list" },
    "youku.com": { node: ["#ykPlayer"], area: "new-box-anthology-items" },
    "bilibili.com": {
      node: ["#bilibili-player", ".bpx-player-primary-area"],
      area: "video-episode-card",
    },
    "mgtv.com": { node: ["#mgtv-player-wrap"], area: "episode-items" },
    "le.com": { node: ["#le_playbox"], area: "juji_grid" },
    "tudou.com": { node: ["#player"], area: "" },
    "pptv.com": { node: ["#pptv_playpage_box"], area: "" },
    "1905.com": { node: ["#player", "#vodPlayer"], area: "" },
  };

  let floatVideoContainer = null;
  let originalVideoContainer = null;
  let originalVideoContainerSelector = null;
  let currentIframeContainer = null;
  let distanceTop = null;
  let distanceLeft = null;
  let videoContainerWidth = null;
  let videoContainerHeight = null;
  let hidePanelTimeout = null; // 隐藏面板的定时器
  let lastUrl = "";
  let parsed = false;
  let lastWindow = null;
  let parseAutoPause = GM_getValue("parseAutoPause", true);
  let parseAutoMute = GM_getValue("parseAutoMute", true);
  let showMode = GM_getValue("showMode", "emb"); // 1 为悬浮播放，2 为新窗口，3 为新标签页
  let fastUrlIndex = GM_getValue("fastUrlIndex", -1);

  function getSiteRule(host) {
    return (
      siteRules[Object.keys(siteRules).find((key) => host.includes(key))] ||
      null
    );
  }

  function getDomainFromUrl(url) {
    let domain;
    try {
      let parsedUrl = new URL(url);
      domain = parsedUrl.hostname;
    } catch (error) {
      console.error("Invalid URL", error);
    }
    return domain;
  }

  function getSLDFromUrl(url) {
    const domain = getDomainFromUrl(url);
    const domainLs = domain.split(".");
    if (domainLs.length >= 2) {
      return domainLs[domainLs.length - 2];
    } else {
      return "😊";
    }
  }

  function createParseElements() {
    const iconSize = isMobile ? 30 : GM_getValue("iconWidth", 24);
    const iconTop = isMobile ? 360 : GM_getValue("iconTop", 100);
    const iconPosition = isMobile
      ? "left"
      : GM_getValue("iconPosition", "left");

    const iconStyle = `
    #qxjfal-iconContainer {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 0px;
      text-align: center;
      opacity: ${isMobile ? 1 : GM_getValue("iconOpacity", 100) / 100};
      width: ${iconSize}px;
      box-sizing: border-box;
      opacity: 0.5;
      /* transition: 0.1s; */
    }
    #qxjfal-iconContainer:hover {
      opacity: 1;
    }
    #qxjfal-optionIcons {
      cursor: pointer;
    }
    #qxjfal-optionIcons>div {
      padding: 6px 0px;
    }
    #qxjfal-container {
      position: fixed;
      top: ${iconTop}px;
      ${iconPosition}: 0px;
      z-index: 999999;
      display: flex;
      flex-direction: ${iconPosition === "left" ? "row" : "row-reverse"};
    }
    #qxjfal-dragIcon {
      cursor: move;
    }
    #qxjfal-dragIcon:hover {
      transform: scale(1.2);
    }
    #qxjfal-fastboot:hover {
      transform: scale(1.2);
    }
    #qxjfal-vidParseIcon:hover {
      transform: scale(1.2);
    }

    #qxjfal-parsePanel {
      position: fixed; /* 绝对定位 */
      top: 0px; /*  图标高度+5px的间距*/
      ${
        iconPosition === "left" ? "left" : "right"
      }: ${iconSize}px; /* 根据图标位置调整 */
      z-index: 999998;
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 12px 15px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      width: 310px; /* 调整面板宽度 */
      height: 100vh;
      overflow: auto;
      display: none; /* 初始隐藏 */
      box-sizing: border-box;
    }

    #qxjfal-parsePanel button, #qxjfal-setting-panel button {
      margin: 3px 0;
      padding: 8px 18px;
      background-color: #285aa6;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      width: 100%;
      box-sizing: border-box;
    }
    #qxjfal-parsePanel button:hover {
      background-color: #1e4888;
    }
    #qxjfal-parsePanel * {
      color: #333333;
    }

    #qxjfal-configPanel {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }

    #qxjfal-configPanel label {
      display: block;
      margin-bottom: 8px;
      color: #333;
    }
    #qxjfal-configPanel input[type="radio"] {
      margin-right: 6px;
    }

    #qxjfal-saveConfigBtn {
      background-color: #4CAF50 !important;
    }
    #qxjfal-saveConfigBtn:hover {
      background-color: #45a049 !important;
    }

    #qxjfal-aboutPanel, #qxjfal-singleParsePanel {
      margin: 3px 0;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    #qxjfal-aboutPanel h4 {
      margin-top: 0;
      color: #333333;
    }

    #qxjfal-aboutPanel p {
      color: #333333;
      line-height: 1.6;
    }

    #qxjfal-singleParsePanel {
      padding: 6px;
      max-height: 300px;
      overflow: auto;
    }

    #qxjfal-singleParsePanel button {
      padding: 6px 8px;
      width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 6px;
      text-wrap: nowrap;
      background-color: #ffffff;
      color: #333333;
      margin: 3px;
    }

    #qxjfal-singleParsePanel button:hover {
      background-color: #dfeffd;
    }

    #qxjfal-telegramLink {
      color: #007bff;
      text-decoration: underline;
      cursor: pointer;
    }

    #qxjfal-showmode-select {
      border: 1px solid #999;
      padding: 4px 10px;
      border-radius: 4px;
      margin: 3px 0;
    }

    #qxjfal-parse-autopause {
      margin: 3px 0;
    }

    #qxjfal-parse-automute {
      margin: 3px 0;
    }

    /* ... 其他样式保持不变 ... */
    #qxjfal-float-video-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 100px;
      z-index: 999997;
      display: flex;
      flex-direction: column;
    }

    .qxjfal-video-top-handle {
      background: #333333;
      width: 100%;
      box-sizing: border-box;
      padding: 4px;
    }

    .qxjfal-video-expand-handle {
      user-select: none;
      width: 50px;
      box-sizing: border-box;
      padding: 4px 6px;
      text-align: center;
      cursor: pointer;
    }

    .qxjfal-video-drag-handle {
      text-align: center;
      box-sizing: border-box;
      padding: 4px 6px;
      width: 50px;
      background: #333333;
      cursor: move;
    }
    .qxjfal-video-drag-title {
      color: #fff;
      display: none;
    }

    .qxjfal-iframe-container {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, auto);
      grid-auto-rows: minmax(200px, auto);
      grid-gap: 1px;
      width: 100%;
      height: 100%;
    }
    .qxjfal-one-chunk {
      grid-template-columns: repeat(1, 1fr);
      grid-template-rows: repeat(1, auto);
    }
    .qxjfal-one-chunk .qxjfal-iframe-option {
      display: none;
    }
    .qxjfal-four-chunk {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, auto);
    }
    .qxjfal-six-chunk {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, auto);
    }
    .qxjfal-iframe-container iframe {
      flex: 1;
      border: 1px solid #ddd;
    }
      /* 可选：添加响应式设计 */
    @media (max-width: 768px) {
      .qxjfal-iframe-container {
          grid-template-columns: repeat(2, 1fr); /* 在小屏幕上显示两列 */
      }
    }

    @media (max-width: 480px) {
      .qxjfal-iframe-container {
          grid-template-columns: 1fr; /* 在非常小的屏幕上显示一列 */
      }
    }

    .qxjfal-iframe-wrapper {
      display: flex;
      flex-direction: column;
      items-align: stretch;
    }

    .qxjfal-iframe-wrapper button {
      margin: 0;
      padding: 2px 6px;
      background-color: #2871a6;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      box-sizing: border-box;
    }

    .qxjfal-iframe-option {
      display: flex;
      column-gap: 4px;
      background-color: #777777;
      color: white;
      text-align: center;
      padding: 4px;
      transition: 0.3s;
    }
    .qxjfal-expand-button {
      flex: 1;
    }
    .qxjfal-eliminate-button {
      background-color: #333333 !important;
      flex: 1;
    }

    #qxjfal-setting-panel {
      font-size: 14px;
      position: fixed;
      top: 0;
      ${iconPosition === "left" ? "left" : "right"}: 0px;
      margin: 0 auto;
      max-height: 100%;
      width: 100%;
      max-width: 500px;
      background-color: #ffffff;
      border-radius: 6px;
      overflow: auto;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      box-sizing: border-box;
    }

    .qxjfal-setting-panel-header {
      padding: 4px 10px;
      text-align: center;
      background-color: #efefef;
    }

    .qxjfal-setting-panel-title {
      display: inline-block;
      font-weight: bold;
      user-select: none;
    }
    .qxjfal-setting-panel-closebtn {
      font-size: 1.2em;
      line-height: 1.2em;
      vertical-align: middle;
      float: right;
      cursor: pointer;
    }
    .qxjfal-setting-panel-textarea {
      width: 99%;
      margin: 0 auto;
    }
    `;

    const styleEl = document.createElement("style");
    styleEl.textContent = iconStyle;
    document.head.appendChild(styleEl);

    const iconHtml = `
        <div id="qxjfal-iconContainer">
            <div id="qxjfal-optionIcons">
                <div id="qxjfal-dragIcon" title="拖拽调整位置">Ⓜ️</div>
                <div id="qxjfal-fastboot" title="快速开始（当前所选接口：${
                  fastUrlIndex === -1 ? "无" : parseApiList[fastUrlIndex].name
                }）">🩷</div>
                <div id="qxjfal-vidParseIcon" title="解析">✨</div>
            </div>
        </div>
        <div id="qxjfal-parsePanel">
            <div>
                <button id="qxjfal-parseBtn">👉解析</button>
                <button id="qxjfal-restoreBtn" style="background:#5a6268;">还原</button>
            </div>
            <div id="qxjfal-singleParsePanel">
            </div>
            <div>
              <select id="qxjfal-showmode-select" name="showmode">
                <option value="emb">当前页面中</option>
                <option value="win">新窗口打开</option>
                <option value="tab">新标签打开</option>
              </select>
            </div>
            <div>
                <label><input type="checkbox" id="qxjfal-parse-autopause" ${
                  parseAutoPause ? "checked" : ""
                }> 解析时自动暂停原视频（部分网站可能无法成功暂停）</label>
            </div>
            <div>
                <label><input type="checkbox" id="qxjfal-parse-automute" ${
                  parseAutoMute ? "checked" : ""
                }> 解析时自动静音原视频</label>
            </div>
            <div id="qxjfal-configPanel">
                <label><input type="radio" name="qxjfal-iframeCount" value="6"> 6个格子解析</label>
                <label><input type="radio" name="qxjfal-iframeCount" value="4"> 4个格子解析</label>
                <label><input type="radio" name="qxjfal-iframeCount" value="1"> 1个格子解析</label>
                <button id="qxjfal-saveConfigBtn">保存配置</button>
                <div id="qxjfal-configTips" style="margin-top: 10px; padding: 5px 10px; color: red; display: none;font-size:12px;">配置已保存并生效！</div>
            </div>
            <div>
                <button id="qxjfal-setting-btn">更多设置</button>
            </div>
            <div id="qxjfal-aboutPanel">
                <h4>🎥 视频解析工具</h4>
                ${
                  GM_getValue("qxjfal-disclaimer", null) === "true"
                    ? ""
                    : `<p><b>免责声明：</b></p>
                <p>
                  1、<b style='color:red;'>需要使用视频解析的，请在更多设置自行添加接口</b>，版权问题请联系相关解析接口所有者，脚本不承担相关责任！"<br>
                  2、为创造良好的创作氛围，请大家支持正版！<br>
                  3、脚本仅限个人学习交流，使用即已代表您已经充分了解相关问题，否则后果自负，特此声明！<br>
                </p>
                <button id="qxjfal-disclaimer-btn" title="点击后表示确认，不再展示">确认</button>
                `
                }
            </div>
        </div>
    `;

    const container = document.createElement("div");
    container.id = "qxjfal-container";
    container.innerHTML = iconHtml;
    document.body.appendChild(container);

    const parsePanel = document.getElementById("qxjfal-parsePanel");
    const dragIcon = document.getElementById("qxjfal-dragIcon");
    const vidParseIcon = document.getElementById("qxjfal-vidParseIcon");
    const parseBtn = document.getElementById("qxjfal-parseBtn");
    const configPanel = document.getElementById("qxjfal-configPanel");
    const saveConfigBtn = document.getElementById("qxjfal-saveConfigBtn");
    const restoreBtn = document.getElementById("qxjfal-restoreBtn");
    const fastbootBtn = document.getElementById("qxjfal-fastboot");
    const settingBtn = document.getElementById("qxjfal-setting-btn");
    settingBtn.addEventListener("click", openSettingPanel);

    const showmodeSelector = document.getElementById("qxjfal-showmode-select");
    showmodeSelector.value = showMode;
    showmodeSelector.addEventListener("change", (e) => {
      showMode = e.target.value;
      GM_setValue("showMode", showMode);
    });

    const parseAutoPauseInput = document.getElementById(
      "qxjfal-parse-autopause"
    );
    parseAutoPauseInput.checked = parseAutoPause;
    parseAutoPauseInput.addEventListener("change", (e) => {
      parseAutoPause = e.target.checked;
      GM_setValue("parseAutoPause", parseAutoPause);
    });

    const parseAutoMuteInput = document.getElementById("qxjfal-parse-automute");
    parseAutoMuteInput.checked = parseAutoMute;
    parseAutoMuteInput.addEventListener("change", (e) => {
      parseAutoMute = e.target.checked;
      GM_setValue("parseAutoMute", parseAutoMute);
    });

    const icon = dragIcon;

    const disclaimerBtn = document.getElementById("qxjfal-disclaimer-btn");
    disclaimerBtn.addEventListener("click", () => {
      GM_setValue("qxjfal-disclaimer", "true");
    });

    setParseBtns();

    fastbootBtn.addEventListener("click", () => {
      if (fastUrlIndex === -1) {
        alert("请先使用一个解析接口！快速开始会自动使用最近一次使用的解析接口");
        return;
      } else {
        parseVideo(parseApiList[fastUrlIndex].url);
      }
    });

    // 初始化配置
    const iframeCount = GM_getValue("iframeCount", "6");
    configPanel.querySelector(`input[value="${iframeCount}"]`).checked = true;

    // 鼠标移入图标：显示面板，清除隐藏定时器
    icon.addEventListener("mouseover", () => {
      clearTimeout(hidePanelTimeout);
      parsePanel.style.display = "block";
    });

    // 鼠标移出图标：启动隐藏面板定时器
    icon.addEventListener("mouseleave", () => {
      hidePanelTimeout = setTimeout(() => {
        parsePanel.style.display = "none";
      }, 300);
    });

    // 鼠标移入面板：清除隐藏定时器
    parsePanel.addEventListener("mouseover", () => {
      clearTimeout(hidePanelTimeout);
    });

    // 鼠标移出面板：启动隐藏面板定时器
    parsePanel.addEventListener("mouseleave", () => {
      hidePanelTimeout = setTimeout(() => {
        parsePanel.style.display = "none";
      }, 300);
    });

    // 保存配置
    saveConfigBtn.addEventListener("click", () => {
      const newIframeCount = configPanel.querySelector(
        'input[name="qxjfal-iframeCount"]:checked'
      ).value;
      GM_setValue("iframeCount", newIframeCount);
      if (originalVideoContainer) {
        parseVideoAgain();
      }
      // 获取提示元素
      const tips = document.getElementById("qxjfal-configTips");
      tips.style.display = "block";
      // 3秒后隐藏
      setTimeout(() => {
        tips.style.display = "none";
      }, 3000);
    });

    parsePanel.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    parseBtn.addEventListener("click", (e) => parseVideo());
    vidParseIcon.addEventListener("click", (e) => parseVideo());
    restoreBtn.addEventListener("click", restoreVideo);

    makeDraggable({
      element: container,
      handle: dragIcon,
      enableY: true,
      rememberY: "iconTop",
    });
  }

  function getVideoContainer() {
    const siteRule = getSiteRule(location.hostname);
    if (!siteRule) {
      console.log("未找到匹配的网站规则");
      return null;
    }
    let videoContainer = null;
    for (const node of siteRule.node) {
      videoContainer = document.querySelector(node);
      if (videoContainer) {
        originalVideoContainerSelector = node;
        distanceTop =
          videoContainer.getBoundingClientRect().top + window.scrollY;
        distanceLeft =
          videoContainer.getBoundingClientRect().left + window.scrollX;
        videoContainerWidth = videoContainer.offsetWidth;
        videoContainerHeight = videoContainer.offsetHeight;
        break;
      }
    }
    return videoContainer;
  }

  function expandIframe(iframeWrappers, index) {
    const videoContainer = getVideoContainer();
    if (!videoContainer) return;
    iframeWrappers.forEach((iframeWrapper, id) => {
      if (id !== index) currentIframeContainer.removeChild(iframeWrapper);
      // else {
      //   const iframeOption = iframeWrapper.querySelector(
      //     ".qxjfal-iframe-option"
      //   );
      //   iframeWrapper.removeChild(iframeOption);
      // }
    });
    currentIframeContainer.className =
      "qxjfal-iframe-container qxjfal-one-chunk";
  }

  function stopVideos() {
    let videos = document.querySelectorAll("video");
    for (let i = 0; i < videos.length; i++) {
      videos[i].pause();
    }
    videos = null;
  }
  function muteVideos() {
    let videos = document.querySelectorAll("video");
    for (let i = 0; i < videos.length; i++) {
      videos[i].muted = true;
    }
    videos = null;
  }

  function parseVideoAgain() {
    if (!parsed) return;
    if (lastUrl !== "") parseVideo(lastUrl, showMode);
    else parseVideo();
  }

  function parseVideo(url, showMode = "emb") {
    const videoContainer = getVideoContainer();
    if (parseAutoPause) stopVideos();
    if (parseAutoMute) muteVideos();
    parsed = true;
    if (url) lastUrl = url;
    else lastUrl = "";

    if (floatVideoContainer !== null) {
      document.body.removeChild(floatVideoContainer);
      floatVideoContainer = null;
    }

    if (showMode === "emb") {
      if (!videoContainer) return;
      //     if (!originalVideoContainer) {
      //       originalVideoContainer = videoContainer.innerHTML;
      //     }

      let iframeCount = 0;
      let urls = [];
      if (url) {
        iframeCount = 1;
        urls = [url];
      } else {
        iframeCount = parseInt(GM_getValue("iframeCount", "6"));
        urls = parseApiList.slice(0, iframeCount).map((api) => api.url);
      }

      let gridClass = "qxjfal-one-chunk";
      if (iframeCount === 6) {
        gridClass = "qxjfal-six-chunk";
      } else if (iframeCount === 4) {
        gridClass = "qxjfal-four-chunk";
      }

      let iframeHTML = `
      <div class="qxjfal-video-top-handle">
        <span class="qxjfal-video-drag-handle">Ⓜ️<span class="qxjfal-video-drag-title">拖拽窗口</span></span>
        <span class="qxjfal-video-expand-handle" title="收起/展开">🚥</span>
      </div>
      `;
      iframeHTML += `<div class="qxjfal-iframe-container ${gridClass}">`;
      urls.forEach((url) => {
        iframeHTML += `
                <div class="qxjfal-iframe-wrapper">
                    <iframe src="${url}${encodeURIComponent(
          location.href
        )}" allowfullscreen allowtransparency></iframe>
                    <div class="qxjfal-iframe-option">
                        <button class="qxjfal-expand-button">⬆️用这个视频继续播放</button>
                    </div>
                </div>
            `;
      });
      iframeHTML += "</div>";

      floatVideoContainer = document.createElement("div");
      floatVideoContainer.id = "qxjfal-float-video-container";
      floatVideoContainer.style.top = `${distanceTop}px`;
      floatVideoContainer.style.left = `${distanceLeft}px`;
      floatVideoContainer.style.width = `${videoContainerWidth}px`;
      floatVideoContainer.style.height = `${videoContainerHeight}px`;
      floatVideoContainer.innerHTML = iframeHTML;

      document.body.appendChild(floatVideoContainer);

      const videoDragHandle = floatVideoContainer.querySelector(
        ".qxjfal-video-drag-handle"
      );
      const videoDragTitle = floatVideoContainer.querySelector(
        ".qxjfal-video-drag-title"
      );
      const videoExpandHandle = floatVideoContainer.querySelector(
        ".qxjfal-video-expand-handle"
      );
      currentIframeContainer = floatVideoContainer.querySelector(
        ".qxjfal-iframe-container"
      );

      videoExpandHandle.addEventListener("click", function (e) {
        currentIframeContainer.style.display =
          currentIframeContainer.style.display === "" ? "none" : "";
        floatVideoContainer.style.height =
          floatVideoContainer.style.height === "28px"
            ? `${videoContainerHeight}px`
            : "28px";
      });

      videoDragHandle.addEventListener("mousedown", function (e) {
        videoDragHandle.style.position = "absolute";
        videoDragHandle.style.top = "0px";
        videoDragHandle.style.left = "0px";
        videoDragHandle.style.width = "100%";
        videoDragHandle.style.height = "100%";
        videoDragHandle.style.borderRadius = "0";
        videoDragHandle.style.textAlign = "center";
        videoDragTitle.style.display = "inline-block";
      });
      videoDragHandle.addEventListener("mouseup", function (e) {
        videoDragHandle.style.cssText = "";
        videoDragTitle.style.cssText = "";
      });

      makeDraggable({
        element: floatVideoContainer,
        handle: videoDragHandle,
        enableX: true,
        enableY: true,
      });

      //videoContainer.innerHTML = iframeHTML;

      const expandButtons = floatVideoContainer.querySelectorAll(
        ".qxjfal-expand-button"
      );
      expandButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
          expandIframe(
            floatVideoContainer.querySelectorAll(".qxjfal-iframe-wrapper"),
            index
          );
        });
      });
    } else if (showMode === "win") {
      let windowOption = "width=600,height=400,top=100,left=100,resizable=yes";
      if (videoContainer)
        windowOption = `width=${videoContainerWidth - 10},height=${Math.max(
          400,
          videoContainerHeight - 150
        )},top=${distanceTop + 150},left=${distanceLeft},resizable=yes`;
      if (!url) url = parseApiList[0].url;
      if (lastWindow !== null) lastWindow.close();
      lastWindow = window.open(
        `${url}${encodeURIComponent(location.href)}`,
        "qx_parse_win",
        windowOption
      );
    } else if (showMode === "tab") {
      if (!url) url = parseApiList[0].url;
      if (lastWindow !== null) lastWindow.close();
      lastWindow = window.open(
        `${url}${encodeURIComponent(location.href)}`,
        "_blank"
      );
    }

    const siteRule = getSiteRule(location.hostname);
    if (siteRule && siteRule.area) {
      const areaSelector = `.${siteRule.area}`;
      if (!videoContainer.dataset.eventBound) {
        const bindAreaEvent = () => {
          const areaElement = document.querySelector(areaSelector);
          if (areaElement) {
            areaElement.addEventListener("click", parseVideoAgainLater);
            videoContainer.dataset.eventBound = "true";
          }
        };
        bindAreaEvent();
        const observer = new MutationObserver(bindAreaEvent);
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  function restoreVideo() {
    // 直接刷新页面
    location.reload();
  }

  function makeDraggable({
    element,
    handle,
    enableX,
    enableY,
    rememberX,
    rememberY,
  }) {
    let isDragging = false;
    let startX, startY, startTop, startLeft;

    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (e.button !== 0) return;

      isDragging = true;
      if (enableX) {
        startX = e.clientX;
        startLeft = element.offsetLeft;
      }
      if (enableY) {
        startY = e.clientY;
        startTop = element.offsetTop;
      }

      document.addEventListener("mousemove", onMouseMoveWrapper);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMoveX(e) {
      const deltaX = e.clientX - startX;
      let newLeft = startLeft + deltaX;
      const maxWidth = window.innerWidth - element.offsetWidth - 20;
      newLeft = Math.max(0, Math.min(newLeft, maxWidth));
      element.style.left = `${newLeft}px`;
    }

    function onMouseMoveY(e) {
      const deltaY = e.clientY - startY;
      let newTop = startTop + deltaY;
      const maxHeight = window.innerHeight - element.offsetHeight - 10;
      newTop = Math.max(0, Math.min(newTop, maxHeight));
      element.style.top = `${newTop}px`;
    }

    function getMouseMoveHandle() {
      if (enableX && enableY) {
        return function (e) {
          onMouseMoveX(e);
          onMouseMoveY(e);
        };
      } else if (enableX) {
        return onMouseMoveX;
      } else {
        return onMouseMoveY;
      }
    }

    function onMouseMoveWrapper(e) {
      if (!isDragging) return;
      const onMouseMove = getMouseMoveHandle();
      onMouseMove(e);
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMoveWrapper);
      document.removeEventListener("mouseup", onMouseUp);
      if (rememberX) GM_setValue(rememberX, element.offsetLeft);
      if (rememberY) GM_setValue(rememberY, element.offsetTop);
    }
  }

  window.addEventListener("load", () => {
    if (getSiteRule(location.hostname)) {
      createParseElements();

      const siteRule = getSiteRule(location.hostname);
      if (siteRule && siteRule.area) {
        const areaSelector = `.${siteRule.area}`;
        const videoContainer = getVideoContainer();
        if (videoContainer && !videoContainer.dataset.eventBound) {
          const bindAreaEvent = () => {
            const areaElement = document.querySelector(areaSelector);
            if (areaElement) {
              areaElement.addEventListener("click", parseVideoAgainLater);
              videoContainer.dataset.eventBound = "true";
            }
          };

          bindAreaEvent();
          const observer = new MutationObserver(bindAreaEvent);
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
    }
  });

  GM_registerMenuCommand("设置解析线路", openSettingPanel);
})();
