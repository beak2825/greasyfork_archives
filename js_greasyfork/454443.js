// @name         SakuraDanmakuClasses
// @namespace    https://muted.top/
// @version      0.9.1
// @description  Classes for SakuraDanmaku
// @author       MUTED64

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
  #makeGetRequest(url) {
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
        await this.#makeGetRequest(
          `${this.constructor.#KEYWORD_API_BASE}&keyword=${this.keyword}`
        )
      ).data.result;

      this.mdid = fetchedFromKeyword[0].media_id;
      this.ssid = fetchedFromKeyword[0].season_id;
      this.epid = fetchedFromKeyword[0].eps[0].id;

      // 获取cid
      let { code, message, result } = JSON.parse(
        await this.#makeGetRequest(
          `${this.constructor.#EP_API_BASE}?ep_id=${this.epid}`
        )
      );
      if (code) {
        throw new Error(message);
      }
      this.cid = result.episodes[this.episode - 1].cid;

      // 获取弹幕
      this.comments = this.#parseBilibiliDanmaku(
        await this.#makeGetRequest(
          `${this.constructor.#DANMAKU_API_BASE}?oid=${this.cid}`
        )
      );
      this.basic_info = {
        mdid: this.mdid,
        ssid: this.ssid,
        epid: this.epid,
        cid: this.cid,
        comments: this.comments,
      };
      return this.basic_info;
    } else {
      this.basic_info = { comments: this.#parseBilibiliDanmaku(xml) };
      return this.basic_info;
    }
  }
}

class DanmakuLoader {
  danmaku;

  constructor(keyword, episode, container, video) {
    this.keyword = keyword;
    this.episode = episode;
    this.container = container;
    this.video = video;
  }

  async #loadDanmaku(xml) {
    const bilibiliDanmaku = new BilibiliDanmaku(this.keyword, this.episode);
    this.basic_info = await bilibiliDanmaku.getInfoAndDanmaku(xml);
    this.danmaku = new Danmaku({
      container: this.container,
      media: this.video,
      comments: this.basic_info.comments,
      speed: 144,
    });
  }

  async showDanmaku(xml) {
    await this.#loadDanmaku(xml);
    this.video.style.position = "absolute";
    this.danmaku.show();
    let resizeObserver = new ResizeObserver(() => {
      this.danmaku.resize();
    });
    resizeObserver.observe(this.container);
    return this.danmaku;
  }
}

class DanmakuSettings {
  danmakuWrapper;
  danmakuButton;
  danmakuSettingBox;
  buttonHtml =
    "<button class=\"dplayer-icon dplayer-comment-icon\" data-balloon=\"弹幕设置\" data-balloon-pos=\"up\"><span class=\"dplayer-icon-content\"><svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 32 32\"><path d=\"M27.128 0.38h-22.553c-2.336 0-4.229 1.825-4.229 4.076v16.273c0 2.251 1.893 4.076 4.229 4.076h4.229v-2.685h8.403l-8.784 8.072 1.566 1.44 7.429-6.827h9.71c2.335 0 4.229-1.825 4.229-4.076v-16.273c0-2.252-1.894-4.076-4.229-4.076zM28.538 19.403c0 1.5-1.262 2.717-2.819 2.717h-8.36l-0.076-0.070-0.076 0.070h-11.223c-1.557 0-2.819-1.217-2.819-2.717v-13.589c0-1.501 1.262-2.718 2.819-2.718h19.734c1.557 0 2.819-0.141 2.819 1.359v14.947zM9.206 10.557c-1.222 0-2.215 0.911-2.215 2.036s0.992 2.035 2.215 2.035c1.224 0 2.216-0.911 2.216-2.035s-0.992-2.036-2.216-2.036zM22.496 10.557c-1.224 0-2.215 0.911-2.215 2.036s0.991 2.035 2.215 2.035c1.224 0 2.215-0.911 2.215-2.035s-0.991-2.036-2.215-2.036zM15.852 10.557c-1.224 0-2.215 0.911-2.215 2.036s0.991 2.035 2.215 2.035c1.222 0 2.215-0.911 2.215-2.035s-0.992-2.036-2.215-2.036z\"></path></svg></span></button>";

  constructor(danmakuLoader, danmakuDOM, iconsBar, iframe) {
    this.danmaku = danmakuLoader.danmaku;
    this.danmakuLoader = danmakuLoader;
    this.danmakuDOM = danmakuDOM;
    this.iconsBar = iconsBar;
    this.iframe = iframe;
    this.danmakuSettings = GM_getValue("danmakuSettings", {
      show: true,
      speed: 144,
      opacity: 1,
      fontSize: 25,
      limit: 1,
    });
    this.#createButton();
    this.#createSettingBox();
    this.#addSettingItems();
  }

  #createButton() {
    if(this.iframe.querySelector("#danmaku-wrapper")){
      this.iframe.querySelector("#danmaku-wrapper").remove();
    }
    // 创建按钮
    this.danmakuWrapper = this.iframe.createElement("div");
    this.danmakuWrapper.setAttribute("id", "danmaku-wrapper");
    this.danmakuWrapper.setAttribute("class", "dplayer-setting");
    this.danmakuWrapper.setAttribute(
      "style",
      "display:inline-block;height:100%;"
    );
    this.danmakuWrapper.innerHTML = this.buttonHtml;
    // 添加到播放器
    this.iconsBar.prepend(this.danmakuWrapper);
    this.danmakuButton = this.danmakuWrapper.firstChild;

    // 设定打开和关闭面板的操作
    this.danmakuButton.addEventListener("click", () => {
      if (
        this.danmakuSettingBox.style.transform === "scale(0)" ||
        !this.danmakuSettingBox.style.transform
      ) {
        this.danmakuSettingBox.style.transform = "scale(1)";
      } else {
        this.danmakuSettingBox.style.transform = "scale(0)";
      }
    });
    this.iframe.addEventListener("click", (e) => {
      if (
        !e.composedPath().includes(this.danmakuButton) &&
        !e.composedPath().includes(this.danmakuSettingBox)
      ) {
        this.danmakuSettingBox.style.transform = "scale(0)";
      }
    });

    // 调整一下底栏样式，原来的看不太清
    this.iframe.querySelector(".dplayer-controller").style.backgroundColor =
      "#0002";
  }

  #createSettingBox() {
    this.danmakuSettingBox = this.iframe.createElement("div");
    this.danmakuSettingBox.setAttribute("class", "dplayer-setting-box");
    this.danmakuSettingBox.setAttribute("style", "transform: scale(0);");
    this.danmakuSettingBox.setAttribute("style", "width: 200px;");
    this.danmakuWrapper.appendChild(this.danmakuSettingBox);
  }

  #addSettingItems() {
    this.#addShowOrHide();
    this.#addDanmakuSpeed();
    this.#addDanmakuOpacity();
    this.#addDanmakuFontSize();
    this.#addDanmakuLimit();
    this.#addOffsetSetting();
  }

  #addShowOrHide() {
    this.showOrHideDanmaku = this.iframe.createElement("div");
    this.showOrHideDanmaku.setAttribute(
      "class",
      "dplayer-setting-item show-danmaku"
    );
    this.showOrHideDanmaku.style.display = "block";
    this.showOrHideDanmaku.innerHTML =
      "<span class=\"dplayer-label\">显示弹幕</span>";
    this.showOrHideToggle = this.iframe.createElement("input");
    this.showOrHideToggle.setAttribute("type", "checkbox");
    this.danmakuSettings.show
      ? this.showOrHideToggle.setAttribute("checked", "checked")
      : null;
    this.showOrHideToggle.style.float = "right";
    this.danmakuDOM.setAttribute(
      "style",
      this.danmakuSettings.show ? "display:block;" : "display:none;"
    );
    this.showOrHideToggle.addEventListener("click", () => {
      if (this.showOrHideToggle.checked) {
        this.danmakuDOM.setAttribute("style", "display:block;");
        this.danmakuSettings.show = true;
        GM_setValue("danmakuSettings", this.danmakuSettings);
      } else {
        this.danmakuDOM.setAttribute("style", "display:none;");
        this.danmakuSettings.show = false;
        GM_setValue("danmakuSettings", this.danmakuSettings);
      }
    });
    this.showOrHideDanmaku.appendChild(this.showOrHideToggle);
    this.danmakuSettingBox.appendChild(this.showOrHideDanmaku);
  }

  #addDanmakuSpeed() {
    this.danmakuSpeed = this.iframe.createElement("div");
    this.danmakuSpeed.setAttribute(
      "class",
      "dplayer-setting-item speed-danmaku"
    );
    this.danmakuSpeed.style.display = "block";
    this.danmakuSpeed.innerHTML = "<span class=\"dplayer-label\">弹幕速度</span>";
    this.danmakuSpeedRange = this.iframe.createElement("input");
    this.danmakuSpeedRange.setAttribute("type", "range");
    this.danmakuSpeedRange.style.display = "inline-block";
    this.danmakuSpeedRange.style.float = "right";
    this.danmakuSpeedRange.style.width = "50%";
    this.danmakuSpeedRange.setAttribute("min", 72);
    this.danmakuSpeedRange.setAttribute("max", 288);
    this.danmakuSpeedRange.setAttribute("value", this.danmakuSettings.speed);
    this.danmaku.speed = this.danmakuSettings.speed;
    this.danmakuSpeedRange.addEventListener("input", () => {
      this.danmakuSettings.speed = Number(this.danmakuSpeedRange.value);
      GM_setValue("danmakuSettings", this.danmakuSettings);
      this.danmaku.speed = this.danmakuSettings.speed;
    });
    this.danmakuSpeed.appendChild(this.danmakuSpeedRange);
    this.danmakuSettingBox.appendChild(this.danmakuSpeed);
  }

  #addDanmakuOpacity() {
    this.danmakuOpacity = this.iframe.createElement("div");
    this.danmakuOpacity.setAttribute(
      "class",
      "dplayer-setting-item transparency-danmaku"
    );
    this.danmakuOpacity.style.display = "block";
    this.danmakuOpacity.innerHTML =
      "<span class=\"dplayer-label\">弹幕透明度</span>";
    this.danmakuOpacityRange = this.iframe.createElement("input");
    this.danmakuOpacityRange.setAttribute("type", "range");
    this.danmakuOpacityRange.style.display = "inline-block";
    this.danmakuOpacityRange.style.float = "right";
    this.danmakuOpacityRange.style.width = "50%";
    this.danmakuOpacityRange.setAttribute("min", 0);
    this.danmakuOpacityRange.setAttribute("max", 1);
    this.danmakuOpacityRange.setAttribute("step", 0.1);
    this.danmakuOpacityRange.setAttribute(
      "value",
      this.danmakuSettings.opacity
    );
    this.danmakuDOM.style.opacity = this.danmakuSettings.opacity;
    this.danmakuOpacityRange.addEventListener("input", () => {
      this.danmakuSettings.opacity = Number(this.danmakuOpacityRange.value);
      GM_setValue("danmakuSettings", this.danmakuSettings);
      this.danmakuDOM.style.opacity = this.danmakuSettings.opacity;
    });
    this.danmakuOpacity.appendChild(this.danmakuOpacityRange);
    this.danmakuSettingBox.appendChild(this.danmakuOpacity);
  }

  #addDanmakuFontSize() {
    this.danmakuFontSize = this.iframe.createElement("div");
    this.danmakuFontSize.setAttribute(
      "class",
      "dplayer-setting-item font-size-danmaku"
    );
    this.danmakuFontSize.style.display = "block";
    this.danmakuFontSize.innerHTML =
      "<span class=\"dplayer-label\">弹幕字体大小</span>";
    this.danmakuFontSizeRange = this.iframe.createElement("input");
    this.danmakuFontSizeRange.setAttribute("type", "range");
    this.danmakuFontSizeRange.style.display = "inline-block";
    this.danmakuFontSizeRange.style.float = "right";
    this.danmakuFontSizeRange.style.width = "50%";
    this.danmakuFontSizeRange.setAttribute("min", 16);
    this.danmakuFontSizeRange.setAttribute("max", 32);
    this.danmakuFontSizeRange.setAttribute("step", 1);
    this.danmakuFontSizeRange.setAttribute(
      "value",
      this.danmakuSettings.fontSize
    );
    setDanmakuFontSize(this.danmakuSettings.fontSize, this.danmaku);
    this.danmakuFontSizeRange.addEventListener("input", () => {
      this.danmakuSettings.fontSize = Number(this.danmakuFontSizeRange.value);
      GM_setValue("danmakuSettings", this.danmakuSettings);
      setDanmakuFontSize(this.danmakuSettings.fontSize, this.danmaku);
    });
    this.danmakuFontSize.appendChild(this.danmakuFontSizeRange);
    this.danmakuSettingBox.appendChild(this.danmakuFontSize);

    function setDanmakuFontSize(fontSize, danmaku) {
      for (const i of danmaku.comments) {
        i.style.font = `${fontSize}px sans-serif`;
      }
    }
  }

  #addDanmakuLimit() {
    this.danmakuLimit = this.iframe.createElement("div");
    this.danmakuLimit.setAttribute(
      "class",
      "dplayer-setting-item limit-danmaku"
    );
    this.danmakuLimit.style.display = "block";
    this.danmakuLimit.innerHTML = "<span class=\"dplayer-label\">弹幕密度</span>";
    this.danmakuLimitRange = this.iframe.createElement("input");
    this.danmakuLimitRange.setAttribute("type", "range");
    this.danmakuLimitRange.style.display = "inline-block";
    this.danmakuLimitRange.style.float = "right";
    this.danmakuLimitRange.style.width = "50%";
    this.danmakuLimitRange.setAttribute("min", 0);
    this.danmakuLimitRange.setAttribute("max", 1);
    this.danmakuLimitRange.setAttribute("step", 0.01);
    this.danmakuLimitRange.setAttribute("value", this.danmakuSettings.limit);
    limitDanmaku(this.danmakuSettings.limit, this.danmaku);
    this.danmakuLimitRange.addEventListener("input", () => {
      this.danmakuSettings.limit = Number(this.danmakuLimitRange.value);
      GM_setValue("danmakuSettings", this.danmakuSettings);
      limitDanmaku(this.danmakuSettings.limit, this.danmaku);
    });
    this.danmakuLimit.appendChild(this.danmakuLimitRange);
    this.danmakuSettingBox.appendChild(this.danmakuLimit);

    function limitDanmaku(percent, danmaku) {
      for (const i of danmaku.comments) {
        i.style.display = "block";
        if (Math.random() > percent) {
          i.style.display = "none";
        }
      }
    }
  }

  #addOffsetSetting() {
    this.offsetSetting = this.iframe.createElement("div");
    this.offsetSetting.setAttribute("class", "dplayer-setting-item offset");
    this.offsetSetting.style.display = "block";
    this.offsetSetting.innerHTML =
      "<span class=\"dplayer-label\">弹幕偏移(s)</span>";
    this.offsetNumber = this.iframe.createElement("input");
    this.offsetNumber.setAttribute("type", "number");
    this.offsetNumber.style.display = "inline-block";
    this.offsetNumber.style.float = "right";
    this.offsetNumber.style.width = "47%";
    this.offsetNumber.setAttribute("min", -10);
    this.offsetNumber.setAttribute("max", 10);
    this.offsetNumber.setAttribute("step", 0.1);
    this.offsetNumber.setAttribute("value", 0);
    this.offsetNumber.addEventListener("input", () => {
      for (const comment of this.danmaku.comments) {
        comment.time = comment.baseTime - Number(this.offsetNumber.value);
      }
      this.danmakuLoader.video.currentTime = Number(
        this.danmakuLoader.video.currentTime
      );
    });
    this.offsetSetting.appendChild(this.offsetNumber);
    this.danmakuSettingBox.appendChild(this.offsetSetting);
  }
}
