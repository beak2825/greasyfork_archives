/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable no-undef */
// ==UserScript==
// @name         SakuraDanmaku 樱花弹幕
// @namespace    https://muted.top/
// @version      1.0.5
// @description  yhdm, but with Danmaku from Bilibili  让樱花动漫和橘子动漫加载 Bilibili 弹幕
// @author       MUTED64
// @match        *://*.yhpdm.net/vp/*
// @match        *://*.mgnacg.com/bangumi/*
// @match        *://*.akkdm.com/play/*
// @match        *://*.yinghuacd.com/v/*
// @match        *://*.agemys.net/play/*
// @match        https://www.yhpdm.net/yxsf/player/dpx2/*
// @match        https://player.mknacg.top/*
// @match        https://www.akkdm.com/dp/*
// @match        https://tup.yinghuacd.com/*
// @match        https://www.agemys.net/age/player/dp2/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @icon         https://www.yhdmp.cc/yxsf/yh_pic/favicon.ico
// @require      https://bowercdn.net/c/danmaku-2.0.4/dist/danmaku.dom.min.js
// @license      GPLv3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/455196/SakuraDanmaku%20%E6%A8%B1%E8%8A%B1%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/455196/SakuraDanmaku%20%E6%A8%B1%E8%8A%B1%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

"use strict";

const sites = {
  yhdm: {
    address: /.*:\/\/.*\.yhpdm\.net\/vp\/.*/,
    videoFrame: "iframe",
    videoFrameURL: "https://www.yhpdm.net/yxsf/player/dpx2",
    bangumiTitle: "title",
    episode: "div.gohome > span",
    container: "div.dplayer-video-wrap",
    video: "div.dplayer-video-wrap > video",
    iconsBar: "div.dplayer-controller > div.dplayer-icons.dplayer-icons-right",
    panelLeft: "1em",
    panelTop: "42%",
    panelTransform: "translateY(-50%)",
  },
  mgnacg: {
    address: /.*:\/\/.*\.mgnacg\.com\/bangumi\/.*/,
    videoFrame: "iframe#videoiframe",
    videoFrameURL: "https://player.mknacg.top",
    bangumiTitle: "h1.page-title > a",
    episode: "span.btn-pc.page-title",
    container: "div.art-video-player",
    video: "div.art-video-player > video.art-video",
    iconsBar: "div.art-video-player div.art-controls > div.art-controls-right",
    panelRight: "10em",
    panelBottom: "2%",
  },
  akkdm: {
    address: /.*:\/\/.*\.akkdm\.com\/play\/.*/,
    videoFrame: "#playleft > iframe",
    videoFrameURL: "https://www.akkdm.com/dp",
    bangumiTitle:
      "body > div.page.player > div.main > div > div.module.module-player > div > div.module-player-side > div.module-player-info > div > h1 > a",
    episode: "#panel2 > div > div > a.module-play-list-link.active",
    container: "div.video-wrapper",
    video: "div.video-wrapper > video",
    iconsBar: "div.art-video-player div.art-controls > div.art-controls-right",
    panelLeft: "1px",
    panelBottom: "2%",
  },
  yinghuacd: {
    address: /.*:\/\/.*\.yinghuacd\.com\/v\/.*/,
    videoFrame: "iframe",
    videoFrameURL: "https://tup.yinghuacd.com",
    bangumiTitle: "div.gohome > h1 > a",
    episode: "div.gohome span",
    container: "div.dplayer-video-wrap",
    video: "div.dplayer-video-wrap > video",
    iconsBar: "div.dplayer-controller > div.dplayer-icons.dplayer-icons-right",
    panelLeft: "1em",
    panelTop: "42%",
    panelTransform: "translateY(-50%)",
  },
  agedm: {
    address: /.*:\/\/.*\.agemys\.net\/play\/.*/,
    videoFrame: "iframe#age_playfram",
    videoFrameURL: "https://www.agemys.net/age/player/dp2",
    bangumiTitle: "#detailname > a",
    episode: "#main0 > div:nth-child(2) > ul > li > a[style]",
    container: "div.dplayer-video-wrap",
    video: "div.dplayer-video-wrap > video",
    iconsBar: "div.dplayer-controller > div.dplayer-icons.dplayer-icons-right",
    panelLeft: "1em",
    panelTop: "42%",
    panelTransform: "translateY(-50%)",
  },
};

class BilibiliDanmaku {
  static #EP_API_BASE = "https://api.bilibili.com/pgc/view/web/season";
  static #DANMAKU_API_BASE = "https://api.bilibili.com/x/v1/dm/list.so";
  static #KEYWORD_API_BASE =
    "https://api.bilibili.com/x/web-interface/search/type?search_type=media_bangumi";

  constructor(keyword, episode) {
    this.keyword = keyword;
    this.episode = episode;
  }

  // GM_xmlhttpRequest的Promise封装
  #Get(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: (response) => {
          resolve(response.responseText);
        },
        onerror: (error) => {
          reject(error);
        },
      });
    });
  }

  // Bilibili弹幕xml串转换为可加载的对象
  #parseBilibiliDanmaku(string) {
    const $xml = new DOMParser().parseFromString(string, "text/xml");
    return [...$xml.getElementsByTagName("d")]
      .map(($d) => {
        const p = $d.getAttribute("p");
        if (p === null || $d.childNodes[0] === undefined) return null;
        const values = p.split(",");
        const mode = { 6: "ltr", 1: "rtl", 5: "top", 4: "bottom" }[values[1]];
        if (!mode) return null;
        const fontSize = Number(values[2]) || 25;
        const color = `000000${Number(values[3]).toString(16)}`.slice(-6);
        return {
          text: $d.childNodes[0].nodeValue,
          mode,
          time: values[0] * 1,
          baseTime: values[0] * 1,
          style: {
            fontSize: `${fontSize}px`,
            color: `#${color}`,
            textShadow: "0px 1px 3px #000,0px 0px 3px #000",
            font: `${fontSize}px sans-serif`,
            fillStyle: `#${color}`,
            strokeStyle: color === "000000" ? "#fff" : "#000",
            lineWidth: 2.0,
          },
        };
      })
      .filter((x) => x);
  }

  // 获取Bilibili对应视频的弹幕
  async getInfoAndDanmaku(xml = undefined) {
    if (!xml) {
      const fetchedFromKeyword = JSON.parse(
        await this.#Get(
          `${this.constructor.#KEYWORD_API_BASE}&keyword=${this.keyword}`
        )
      ).data.result;

      this.mdid = fetchedFromKeyword[0].media_id;
      this.ssid = fetchedFromKeyword[0].season_id;
      this.epid = fetchedFromKeyword[0].eps[0].id;

      // 获取cid
      let { code, message, result } = JSON.parse(
        await this.#Get(`${this.constructor.#EP_API_BASE}?ep_id=${this.epid}`)
      );
      if (code) {
        throw new Error(message);
      }
      this.cid = result.episodes[this.episode - 1].cid;

      // 获取弹幕
      this.danmaku = this.#parseBilibiliDanmaku(
        await this.#Get(`${this.constructor.#DANMAKU_API_BASE}?oid=${this.cid}`)
      );
      this.basic_info = {
        mdid: this.mdid,
        ssid: this.ssid,
        epid: this.epid,
        cid: this.cid,
        danmaku: this.danmaku,
      };
      return this.basic_info;
    } else {
      this.basic_info = { danmaku: this.#parseBilibiliDanmaku(xml) };
      return this.basic_info;
    }
  }
}

class DanmakuControl {
  danmaku;
  danmakuElement;

  constructor(keyword, episode, container, video) {
    this.keyword = keyword;
    this.episode = episode;
    this.container = document.querySelector(container);
    this.video = document.querySelector(video);
    const selectInterval = setInterval(() => {
      this.container = document.querySelector(container);
      this.video = document.querySelector(video);
      if (this.container && this.video) {
        clearInterval(selectInterval);
      }
    }, 500);
  }

  async load(xml = undefined) {
    const bilibiliDanmaku = new BilibiliDanmaku(this.keyword, this.episode);
    this.basic_info = await bilibiliDanmaku.getInfoAndDanmaku(xml);
    const loadInterval = setInterval(() => {
      if (this.container && this.video) {
        this.danmaku = new Danmaku({
          container: this.container,
          media: this.video,
          comments: this.basic_info.danmaku,
          speed: 144,
        });
        clearInterval(loadInterval);
      }
    }, 500);
  }

  show() {
    const showInterval = setInterval(() => {
      if (this.container && this.video) {
        this.video.style.position = "absolute";
        this.danmaku.show();
        this.danmakuElement = this.container.lastElementChild;
        this.danmakuElement.style.zIndex = 1000;
        this.danmakuSettings = getStoredSettings();
        this.applySettings(this.danmakuSettings);
        let resizeObserver = new ResizeObserver(() => {
          this.danmaku.resize();
        });
        resizeObserver.observe(this.container);
        clearInterval(showInterval);
      }
    }, 500);
  }

  toggleShowAndHide(show) {
    if (show) {
      this.danmakuElement.style.display = "block";
    } else {
      this.danmakuElement.style.display = "none";
    }
  }

  destroy() {
    this.danmaku.destroy();
  }

  setSpeed(speed) {
    this.danmaku.speed = Number(speed);
  }

  setFontSize(fontSize) {
    for (const i of this.danmaku.comments) {
      i.style.font = `${fontSize}px sans-serif`;
    }
  }

  setLimit(percentLimit) {
    for (const i of this.danmaku.comments) {
      i.style.display = "block";
      if (Math.random() > percentLimit) {
        i.style.display = "none";
      }
    }
  }

  setOpacity(opacity) {
    this.danmakuElement.style.opacity = opacity;
  }

  setOffset(offset) {
    for (const comment of this.danmaku.comments) {
      comment.time = comment.baseTime - Number(offset);
    }
    this.video.currentTime = Number(this.video.currentTime);
  }

  setHideTop(hideTop) {
    if (hideTop) {
      for (const i of this.danmaku.comments) {
        if (i.mode === "top") {
          i.style.display = "none";
        }
      }
    } else {
      for (const i of this.danmaku.comments) {
        if (i.mode === "top") {
          i.style.display = "block";
        }
      }
    }
  }

  setHideBottom(hideBottom) {
    if (hideBottom) {
      for (const i of this.danmaku.comments) {
        if (i.mode === "bottom") {
          i.style.display = "none";
        }
      }
    } else {
      for (const i of this.danmaku.comments) {
        if (i.mode === "bottom") {
          i.style.display = "block";
        }
      }
    }
  }

  applySettings(settings) {
    this.toggleShowAndHide(settings.show);
    this.setSpeed(settings.speed);
    this.setOpacity(settings.opacity);
    this.setFontSize(settings.fontSize);
    this.setLimit(settings.limit);
    this.setHideTop(settings.hideTop);
    this.setHideBottom(settings.hideBottom);
  }
}

function getMainPageInfo(currentSite) {
  let keyword = document
    .querySelector(currentSite.bangumiTitle)
    .textContent.replace(/ 第[0-9]+集.*/gi, "")
    .replace(/ 第[0-9]+话.*/gi, "")
    .replace(/ Part ?[0-9]+.*/, "");
  let episode = Number(
    document
      .querySelector(currentSite.episode)
      .textContent.replace(/[^0-9]+/gi, "")
  );
  let videoFrame = document.querySelector(currentSite.videoFrame);

  return {
    keyword,
    episode,
    videoFrame,
  };
}

function loadConfigToIframe(
  videoFrame,
  keyword,
  episode,
  currentSite,
  xml = undefined
) {
  videoFrame.contentWindow.postMessage(
    {
      keyword,
      episode,
      currentSite,
      xml,
    },
    currentSite.videoFrameURL
  );
}

function showChoosePanel(message, keyword, episode, currentSite, videoFrame) {
  if (document.querySelector(".danmakuChoose")) {
    document.querySelector(".danmakuChoose").remove();
  }

  const storedSettings = getStoredSettings();

  GM_addElement(document.body, "div", { class: "danmakuChoose" });
  document.querySelector(".danmakuChoose").innerHTML = `
  <button class="sakura-danmaku-button" id="folding-button">折叠面板</button>
  
  <pre id="danmaku-message">${message}</pre>
  <hr class="danmaku-panel-hr"/>

  <div class="danmaku-settings-wrapper">
    <div class="danmaku-metadata">
      <label for="keyword">番剧名</label>
      <input class="danmaku-metadata-input" id="keyword" value="${keyword}"/>
    </div>
    <div class="danmaku-metadata">
      <label for="episode">剧集数</label>
      <input class="danmaku-metadata-input" id="episode" value="${episode}"/>
    </div>
  </div>
  <button class="sakura-danmaku-button" id="manual-danmaku-button">确认</button>

  <div class="danmaku-upload">
    <p class="danmaku-upload-label">或手动上传XML弹幕文件</p>
    <button class="sakura-danmaku-button" id="upload-xml-button">选择</button>
  </div>
  <hr class="danmaku-panel-hr"/>

  <div class="danmaku-settings-wrapper danmaku-iframe-settings-wrapper">
    <div class="danmaku-settings">
      <label for="danmaku-show">显示弹幕</label>
      <input type="checkbox" id="danmaku-show" ${
        storedSettings.show ? "checked" : ""
      }/>
    </div>
    <div class="danmaku-settings">
      <label for="danmaku-speed">弹幕速度</label>
      <input type="range" id="danmaku-speed" min="72" max="288" step="2" value="${
        storedSettings.speed
      }"/>
    </div>
    <div class="danmaku-settings">
      <label for="danmaku-opacity">弹幕透明度</label>
      <input type="range" id="danmaku-opacity" min="0" max="1" step="0.1" value="${
        storedSettings.opacity
      }"/>
    </div>
    <div class="danmaku-settings">
      <label for="danmaku-font-size">字体大小</label>
      <input type="range" id="danmaku-font-size" min="16" max="32" step="2" value="${
        storedSettings.fontSize
      }"/>
    </div>
    <div class="danmaku-settings">
      <label for="danmaku-limit">弹幕密度</label>
      <input type="range" id="danmaku-limit" min="0" max="1" step="0.02" value="${
        storedSettings.limit
      }"/>
    </div>
    <div class="danmaku-settings">
      <label for="danmaku-offset">弹幕偏移</label>
      <input type="number" id="danmaku-offset" min="-30" max="30" step="2" value="0"/>
      s
    </div>
    <div class="danmaku-settings">
      <label for="danmaku-hide-top">屏蔽顶部弹幕</label>
      <input type="checkbox" id="danmaku-hide-top" ${
        storedSettings.hideTop ? "checked" : ""
      }/>
      <label for="danmaku-hide-bottom">屏蔽底部弹幕</label>
      <input type="checkbox" id="danmaku-hide-bottom" ${
        storedSettings.hideBottom ? "checked" : ""
      }/>
    </div>
  </div>`;

  const globalStyle = `.danmakuChoose {
    position:fixed;
    left:${currentSite.panelLeft ? currentSite.panelLeft : "auto"};
    top:${currentSite.panelTop ? currentSite.panelTop : "auto"};
    right:${currentSite.panelRight ? currentSite.panelRight : "auto"};
    bottom:${currentSite.panelBottom ? currentSite.panelBottom : "auto"};
    transform:${
      currentSite.panelTransform ? currentSite.panelTransform : "none"
    };
    background-color:rgba(32,32,32,0.9);
    color:white;
    font:1em sans-serif !important;
    padding:1em;
    border-radius:8px;
    border:1px solid gray;
    line-height:1.5;
    z-index:999999;
    overflow:hidden;
    display:flex;
    flex-direction:column;
    user-select:none;
  }

  pre#danmaku-message {
    font-family:sans-serif !important;
    margin:0 !important;
    text-align:center;
  }

  hr.danmaku-panel-hr {
    border-top: 1px solid lightgray;
    border-bottom: none;
    border-left: none;
    border-right: none;
    margin: 1em 0;
  }

  div.danmaku-settings-wrapper {
    display:flex;
    flex-direction:column;
    gap:0.5em;
    margin: 0 0 0.5em 0;
    text-align: initial;
  }

  div.danmaku-settings{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap: 0.5em;
  }

  div.danmaku-settings > input {
    appearance: auto;
    -moz-appearance: auto;
    -webkit-appearance: auto;
    border: 1px solid lightgray;
    flex:6 1 0;
    height:1.4em;
  }

  div.danmaku-settings > label {
    flex:4 1 0;
  }

  div.danmaku-settings > input[type="checkbox"] {
    max-width:1em;
    height:1em;
    border-radius:4px;
  }

  div.danmaku-settings > input[type="number"] {
    border-radius:4px;
    flex:5.5 1 0;
  }

  div.danmaku-settings > input[type="range"] {
    height:auto;
  }

  div.danmaku-metadata{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap: 1em;
  }

  input.danmaku-metadata-input {
    border-radius:4px;
    padding:0 0.2em;
    border:1px solid lightgray;
    height:2em;
    background-color:rgba(0,0,0,0);
    color:white;
    flex:1;
  }

  button#manual-danmaku-button {
    width:100%;
    margin-bottom:0.2em;
  }

  div.danmaku-upload {
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin:1em 0 0 0;
  }

  p.danmaku-upload-label {
    flex:3;
    display:inline-flex;
    margin:0!important;
  }

  button#upload-xml-button {
    flex:1;
  }

  button.sakura-danmaku-button {
    cursor:pointer;
    border-radius:4px;
    border:1px solid lightgray;
    height:2em;
    background-color:rgba(0,0,0,0);
    color:white;
  }

  button.sakura-danmaku-button:hover {
    background-color:lightgray;
    color:black;
  }

  button#folding-button {
    visibility:visible;
    width:7em;
    margin-bottom:0.5em;
  }
  `;

  GM_addStyle(globalStyle);

  document.querySelector("#folding-button").addEventListener("click", () => {
    const danmakuChoose = document.querySelector(".danmakuChoose");
    if (danmakuChoose.style.visibility === "hidden") {
      danmakuChoose.style.visibility = "visible";
      document.querySelector("#folding-button").textContent = "折叠面板";
    } else {
      danmakuChoose.style.visibility = "hidden";
      document.querySelector("#folding-button").textContent = "展开面板";
    }
  });

  document
    .querySelector("#manual-danmaku-button")
    .addEventListener("click", () => {
      keyword = document.querySelector("#keyword").value;
      episode = document.querySelector("#episode").value;
      loadConfigToIframe(videoFrame, keyword, episode, currentSite);
    });

  document.querySelector("#upload-xml-button").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "text/xml";
    input.addEventListener("change", () => {
      const reader = new FileReader();
      reader.onload = () => {
        const xml = reader.result;
        loadConfigToIframe(videoFrame, keyword, episode, currentSite, xml);
      };
      reader.readAsText(input.files[0]);
    });
    input.click();
  });

  document
    .querySelectorAll(".danmaku-iframe-settings-wrapper input")
    .forEach((input) => {
      input.addEventListener("input", () => {
        videoFrame.contentWindow.postMessage(
          {
            type: "danmaku-settings",
            settings: {
              show: document.querySelector("#danmaku-show").checked,
              speed: document.querySelector("#danmaku-speed").value,
              opacity: document.querySelector("#danmaku-opacity").value,
              fontSize: document.querySelector("#danmaku-font-size").value,
              limit: document.querySelector("#danmaku-limit").value,
              offset: document.querySelector("#danmaku-offset").value,
              hideTop: document.querySelector("#danmaku-hide-top").checked,
              hideBottom: document.querySelector("#danmaku-hide-bottom")
                .checked,
            },
          },
          currentSite.videoFrameURL
        );
      });
    });
}

async function loadDanmaku(keyword, episode, currentSite, xml = undefined) {
  const danmakuControl = await new DanmakuControl(
    keyword,
    episode,
    currentSite.container,
    currentSite.video,
    xml
  );
  await danmakuControl.load(xml);
  danmakuControl.show();
  return danmakuControl;
}

function getChangedSetting(settings, storedSettings) {
  for (const setting in settings) {
    if (setting === "offset" && settings[setting] !== "0") {
      return "offset";
    } else if (
      setting !== "offset" &&
      settings[setting] !== storedSettings[setting]
    ) {
      return setting;
    }
  }
}

function getStoredSettings() {
  return GM_getValue("danmakuSettings", {
    show: true,
    speed: 144,
    opacity: 1,
    fontSize: 25,
    limit: 1,
    hideTop: false,
    hideBottom: false,
  });
}

const currentSite =
  sites[
    Object.keys(sites).find((site) =>
      window.location.href.match(sites[site].address)
    )
  ];

if (currentSite) {
  const { keyword, episode, videoFrame } = getMainPageInfo(currentSite);
  videoFrame.onload = () => loadConfigToIframe(videoFrame, keyword, episode, currentSite);

  window.addEventListener("message", (event) => {
    if (event.data.includes("加载弹幕")) {
      showChoosePanel(event.data, keyword, episode, currentSite, videoFrame);
    }
  });
} else {
  let danmakuControl;
  window.addEventListener("message", async (event) => {
    if (event.data.currentSite) {
      danmakuControl?.destroy();
      const { keyword, episode, currentSite, xml } = event.data;
      try {
        danmakuControl = await loadDanmaku(keyword, episode, currentSite, xml);
        event.source.postMessage(
          `自动加载弹幕：\n${keyword} 第${episode}集\n如果不是你想要的，请手动填入对应番剧`,
          event.origin
        );
      } catch (e) {
        console.error(e);
        event.source.postMessage(
          `加载弹幕失败：\n${keyword} 第${episode}集\n请检查B站是否存在对应剧集`,
          event.origin
        );
        return;
      }
    } else if (event.data.type === "danmaku-settings") {
      switch (getChangedSetting(event.data.settings, getStoredSettings())) {
        case "show":
          danmakuControl.toggleShowAndHide(event.data.settings.show);
          break;
        case "speed":
          danmakuControl.setSpeed(event.data.settings.speed);
          break;
        case "opacity":
          danmakuControl.setOpacity(event.data.settings.opacity);
          break;
        case "fontSize":
          danmakuControl.setFontSize(event.data.settings.fontSize);
          break;
        case "limit":
          danmakuControl.setLimit(event.data.settings.limit);
          break;
        case "hideTop":
          danmakuControl.setHideTop(event.data.settings.hideTop);
          break;
        case "hideBottom":
          danmakuControl.setHideBottom(event.data.settings.hideBottom);
          break;
        case "offset":
          danmakuControl.setOffset(event.data.settings.offset);
          break;
        default:
          break;
      }

      delete event.data.settings.offset;
      GM_setValue("danmakuSettings", event.data.settings);
    }
  });
}
