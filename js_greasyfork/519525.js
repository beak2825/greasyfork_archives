// ==UserScript==
// @name         check in Stash
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  调用 Stashapp API，突出显示本地不存在的影片
// @author       bix
// @license      MIT
// @match        https://www.javbus.com/*
// @match        https://sukebei.nyaa.si/*
// @match        https://javstash.org/*
// @match        https://javdb.com/*
// @icon         https://avatars.githubusercontent.com/u/24867479?s=48&v=4
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/519525/check%20in%20Stash.user.js
// @updateURL https://update.greasyfork.org/scripts/519525/check%20in%20Stash.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const defaultSettings = {
    // api,如果 stashapp 设置了用户名、密码，则必须填写此项
    apiKey: "",
    // 本地安装的 stashapp 服务器地址，如果没有安装，可以留为空
    serverUrl: "http://localhost:9999",
    // 是否从在线播放中查找 (jable, missav)
    onlineChecking: true,
    // 是否用边框高亮来显示条目在 stash 中的存在与否
    highlightWithFrame: true,
    // 默认为高亮缺少的
    highlightMissing: true,
    // 可自定义突出显示样式
    highlightStyle: {
      outline: "2px solid red",
    },
    // 若为true，则在页面加载完成后自动触发过滤，后面的快捷键设置会失效
    triggerOnload: false,
    // 自定义快捷键，可以是任意长度的数字或字母
    hotKeys: "ee",
    // 规定时间内按完快捷键才会触发，单位为毫秒，不建议修改
    timeout: 500,
    // 快捷键触发方式，不建议修改
    eventType: "keypress",
  };

  const missSvg =
    '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="30%" style="stop-color:#AA5CC3;stop-opacity:1" /><stop offset="100%" style="stop-color:#00A4DC;stop-opacity:1" /></linearGradient><path style="fill:url(#grad3)" d="M12 .002C8.826.002-1.398 18.537.16 21.666c1.56 3.129 22.14 3.094 23.682 0C25.384 18.573 15.177 0 12 0zm7.76 18.949c-1.008 2.028-14.493 2.05-15.514 0C3.224 16.9 9.92 4.755 12.003 4.755c2.081 0 8.77 12.166 7.759 14.196zM12 9.198c-1.054 0-4.446 6.15-3.93 7.189.518 1.04 7.348 1.027 7.86 0 .511-1.027-2.874-7.19-3.93-7.19z"/></svg>';
  const jableSvg =
    '<svg  role="img" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M469.333333 85.333333L256 298.666667l42.666667 42.666666-213.333334 213.333334 213.333334 213.333333 42.666666-42.666667 213.333334 213.333334 213.333333-213.333334-42.666667-42.666666 213.333334-213.333334-213.333334-213.333333-42.666666 42.666667-213.333334-213.333334m-42.666666 277.333334l256 149.333333-256 149.333333v-298.666666z" fill="#05b010" p-id="1934"></path></svg>';

  const stashSvg = `
<svg id="svg2" viewBox="105.96 293.312 112.02 75.883" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com" width="112.02px" height="112.02px">
  <desc>Source: openclipart.org/detail/209545</desc>
  <defs>
    <bx:export>
      <bx:file format="png" href="#object-0" excluded="true" />
      <bx:file format="png" href="#object-0" path="Untitled 5.png" excluded="true" />
      <bx:file format="png" path="Untitled 4.png" />
      <bx:file format="svg" path="Untitled 2.svg" />
      <bx:file format="png" href="#object-2" path="Untitled 3.png" />
    </bx:export>
    <bx:guide x="90.956" y="385.602" angle="90" />
    <bx:guide x="24.34" y="260.057" angle="0" />
    <bx:guide x="503.461" y="247.247" angle="-90" />
    <bx:export>
      <bx:file format="png" href="#object-0" excluded="true" />
      <bx:file format="png" path="Untitled 4.png" excluded="true" />
      <bx:file format="svg" path="Untitled 2.svg" excluded="true" />
    </bx:export>
  </defs>
  <desc>Source: openclipart.org/detail/209545</desc>
  <desc>Created with Fabric.js 3.6.6</desc>
  <g transform="matrix(0.558092, 0, 0, 0.558092, 161.97226, 331.254639)" id="object-0" style="">
    <g style="">
      <g transform="matrix(1 0 0 1 0 0)">
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill-rule: nonzero; opacity: 1; fill: rgb(255, 255, 255);" transform=" translate(-281.27, -403.33)" d="m 281.375 335.34375 l -84.3125 24.53125 l -16.15625 20.4375 l 73.375 25.59375 l 21.28125 -25.8125 l 5.59375 2.375 l 5.59375 -2.375 l 22.15625 26.46875 l 72.71875 -25.8125 l -17 -22.15625 l -83.25 -23.25 z m 0 6.6875 l 58.96875 17.40625 L 281.375 376 l -59.59375 -17.21875 l 59.59375 -16.75 z m 4.625 51.1875 l -0.21875 77.875 l 78.3125 -32.0625 l 0.21875 -43.65625 l -58.71875 19.34375 l -17.21875 -21.5 l -2.375 0 z M 274.71875 393.4375 L 257.5 414.9375 L 198.78125 395.59375 L 199 439.25 l 78.3125 32.0625 l -0.21875 -77.875 l -2.375 0 z" stroke-linecap="round" id="object-2" />
      </g>
      <g transform="matrix(1 0 0 1 -30.72 -218.61)" style="">
        <text style="fill: rgb(255, 255, 255); font-family: Arial; font-size: 64px; white-space: pre;" />
      </g>
    </g>
  </g>
  <desc>Source: openclipart.org/detail/209545</desc>
  <desc>Created with Fabric.js 3.6.6</desc>
</svg>
`;

  const CONFIG = [
    {
      site: "javstash",
      cb: () =>
        findCode(
          ".SceneCard",
          (box) => {
            const td = box.querySelectorAll(".w-100")[1];
            return td.textContent;
          },
          "svgxxx",
        ),
    },
    {
      site: "nyaa",
      cb: () =>
        findCode(
          ".success",
          (box) => {
            const td = box.querySelector("td:nth-of-type(2)");
            const title = td.textContent.trim();
            const code = title
              .replace(/^[\+ ]+/, "") // +++
              .replace(/^\[[A-Z]+\]/, "") // [FHD]
              .trim()
              .split(" ")[0];
            return code;
          },
          ".text-center",
        ),
    },
    {
      site: "javbus",
      cb: () => findCode("a.movie-box", "date", ".item-tag"),
    },
    {
      site: "javlibrary",
      cb: () => findCode(".video", ".id", "a[href]"),
    },
    {
      site: "javdb",
      cb: () =>
        findCode(
          ".movie-list .item",
          ".video-title strong",
          ".tags.has-addons",
        ),
    },
    {
      site: "jinjier",
      cb: () =>
        findCode(
          "tbody tr",
          (box) => {
            const td = box.querySelector("td:nth-of-type(3)");
            return td.textContent.split(" ")[0];
          },
          "td:nth-of-type(3)",
        ),
    },
  ];

  let settings = {
    ...defaultSettings,
    ...GM_getValue("settings"),
  };
  const modal = createModal();
  const submitBtn = modal.querySelector("#jv-submit");
  const cancelBtn = modal.querySelector("#jv-cancel");
  const resetBtn = modal.querySelector("#jv-reset");
  const contentEle = modal.querySelector("#jv-content");

  var boxesAll = [];
  var boxes_shown = true;
  class AsyncQueue {
    constructor(concurrent = 5) {
      this.concurrent = concurrent;
      this.activeCount = 0;
      this.queue = [];
    }

    push(promiseCreator) {
      this.queue.push(promiseCreator);
      this.next();
    }

    next() {
      if (this.activeCount < this.concurrent && this.queue.length) {
        const promiseCreator = this.queue.shift();
        this.activeCount++;
        promiseCreator().finally(() => {
          this.activeCount--;
          this.next();
        });
      }
      if (this.activeCount === 0) {
        console.log("=======interesting.");
        showNotification("Check Complete!", 3000);
        toggleboxes();
      }
    }
  }

  const queue = new AsyncQueue();

  function request(url, code, method = "POST") {
    const data = {
      query: `query($filter: SceneFilterType){findScenes(scene_filter:$filter){scenes{id,title,files{path}}}}`,
      variables: {
        filter: {
          code: {
            value: code,
            modifier: "INCLUDES",
          },
        },
      },
    };
    var header = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Connection: "keep-alive",
      DNT: "1",
    };
    if (settings.apiKey) {
      header["ApiKey"] = settings.apiKey;
    }
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers: header,
        data: JSON.stringify(data),
        onload(response) {
          if (response.status === 200) {
            try {
              resolve(JSON.parse(response.responseText));
            } catch (error) {
              reject(error);
            }
          } else {
            reject(response);
          }
        },
        onerror(error) {
          reject(error);
        },
      });
    });
  }

  async function fetchStashScenes(params) {
    const url = `${settings.serverUrl}/graphql`;
    try {
      const response = await request(url, params.searchTerm);
      return response.data.findScenes.scenes;
    } catch (error) {
      console.error("请检查apiKey与serverUrl是否设置正确");
      console.error(error);
    }
  }

  async function fetchOnline(url) {
    try {
      console.log(`trying to fetch ${url}`);
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "HEAD",
          url: url,
          onload: function (response) {
            if (response.status === 200) {
              console.log(`Valid URL: ${url}`);
              resolve(true);
            } else {
              console.log(`Invalid URL (status: ${response.status}): ${url}`);
              resolve(false);
            }
          },
          onerror: function () {
            console.error(`Error checking URL: ${url}`);
            reject(new Error(`Error checking URL: ${url}`));
          },
        });
      });
      return response;
    } catch (error) {
      console.error("请检查apiKey与serverUrl是否设置正确");
      console.error(error);
    }
  }

  function setStyle(element, styles) {
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        element.style[key] = styles[key];
      }
    }
  }

  function findCode(boxSelector, codeSelector, iconParentSelector) {
    const boxes = document.querySelectorAll(boxSelector);
    boxesAll = boxes;
    console.log(`boxes: ${boxes.length}`);
    for (const box of boxes) {
      const code =
        typeof codeSelector === "function"
          ? codeSelector(box)
          : box.querySelector(codeSelector)?.textContent;
      if (!code) {
        console.log("no code");
        return;
      }
      console.log(`code: ${code}`);
      const iconParent = box.querySelector(iconParentSelector) || box;
      if (settings.serverUrl) {
        queue.push(async () => {
          const items_all = await fetchStashScenes({ searchTerm: code });
          const items = items_all.filter((item) => item.files.length > 0);
          if (
            settings.highlightWithFrame &&
            (settings.highlightMissing ? items.length === 0 : items.length > 0)
          ) {
            setStyle(box, settings.highlightStyle);
          }
          if (items.length > 0) {
            let url = `${settings.serverUrl}/scenes/${items[0].id}`;
            addClickableIconBtn(iconParent, stashSvg, url, "stashdb");
          }
        });
      }
      if (settings.onlineChecking) {
        const online = {
          missav: {
            url: "https://missav.com",
            icon: missSvg,
          },
          jable: {
            url: "https://jable.tv/videos",
            icon: jableSvg,
          },
        };
        for (const key in online) {
          let url = online[key].url + "/" + code.toLowerCase() + "/";
          queue.push(async () => {
            const x = await fetchOnline(url);
            console.log(`response for ${url}: ${x}`);
            if (x) {
              addClickableIconBtn(iconParent, online[key].icon, url, key);
            }
          });
        }
      }
    }
  }

  function addClickableIconBtn(iconParent, SvgIcon, url, name) {
    if (!(iconParent && SvgIcon && url)) return;
    // if (!iconParent || !item) return;
    if (iconParent.querySelector(`.jv-icon-wrapper.${name}`)) return;

    const iconWrapper = document.createElement("span");
    iconWrapper.classList.add("jv-icon-wrapper");
    iconWrapper.classList.add(name);
    iconWrapper.innerHTML = SvgIcon;

    iconParent.appendChild(iconWrapper);
    console.log(`add icon for ${url}`);
    iconWrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      GM_openInTab(url, { active: true, insert: true, setParent: true });
    });
  }

  function registerKeysEvent(eventType, keys, callback, timeout = 500) {
    if (!keys) {
      throw new Error("keys不能为空");
    }
    const innerKeys = keys.split("");
    let firstTime = 0;
    let index = 0;
    document.addEventListener(eventType, (e) => {
      const currentTime = Date.now();
      const key = innerKeys[index];
      if (
        index > innerKeys.length - 1 ||
        e.key.toLowerCase() !== key.toLowerCase()
      ) {
        firstTime = 0;
        index = 0;
        return;
      }
      if (currentTime - firstTime > timeout) {
        firstTime = 0;
        index = 0;
      }
      if (index === innerKeys.length - 1) {
        try {
          callback();
        } catch (error) {
          console.error(error);
        }
        firstTime = 0;
        index = 0;
        return;
      }
      if (index === 0) {
        firstTime = currentTime;
      }
      index++;
    });
  }

  function createModal() {
    const modal = document.createElement("div");
    modal.id = "jv-modal";
    modal.innerHTML = `
            <div id='jv-content' contenteditable='true'></div>
            <div class='jv-btn-group'>
                <button id='jv-submit'>确定</button>
                <button id='jv-cancel'>关闭</button>
                <button id='jv-reset'>重置</button>
            </div>
       `;
    document.body.appendChild(modal);
    return modal;
  }

  function refreshModal(currentSettings) {
    contentEle.textContent = JSON.stringify(currentSettings, null, 4);
  }

  function showModal() {
    modal.style.display = "flex";
    refreshModal(settings);
  }

  function hideModal() {
    modal.style.display = "none";
  }

  function shakeSettings(userSettings) {
    const newSettings = {};
    Object.keys(defaultSettings).forEach((key) => {
      const value = userSettings[key];
      newSettings[key] = value != null ? value : defaultSettings[key];
    });
    return newSettings;
  }

  function handleSubmit() {
    try {
      const userSettings = JSON.parse(contentEle.textContent);

      // if (userSettings.apiKey && userSettings.serverUrl) {
      if (true) {
        const newSettings = shakeSettings(userSettings);
        GM_setValue("settings", newSettings);
        settings = newSettings;
        hideModal();
        setTimeout(() => {
          window.location.reload();
        });
      } else {
        alert("apiKey与serverUrl是必填项");
      }
    } catch (error) {
      alert("设置填写错误，请重新检查");
    }
  }

  function registerMenuListener() {
    GM_registerMenuCommand("自定义设置", showModal);
  }

  function registerEventListeners() {
    submitBtn.addEventListener("click", handleSubmit);
    cancelBtn.addEventListener("click", hideModal);
    resetBtn.addEventListener("click", () => {
      refreshModal(defaultSettings);
    });
  }
  function toggleboxes() {
    boxes_shown = !boxes_shown;
    for (const box of boxesAll) {
      if (box.querySelectorAll(".jv-icon-wrapper.stashdb").length === 0) {
        box.style.visibility = boxes_shown? "visible":"hidden";
        // box.style.display = boxes_shown?"block":"none";
        // box.style.opacity = boxes_shown ? "1" : "0.5";
      }
    }
  }
  // Function to create a notification
  function showNotification(message, duration = 3000) {
    // Create the notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    // Append the notification to the document body
    document.body.appendChild(notification);

    // Show the notification with an animation
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    // Remove the notification after the specified duration
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 500); // Wait for the fade-out animation
    }, duration);
  }
  function start() {
    registerMenuListener();
    registerEventListeners();
    CONFIG.forEach(({ site, cb }) => {
      if (!location.href.includes(site)) return;

      const { eventType, hotKeys, timeout, triggerOnload } = settings;
      if (triggerOnload) {
        cb();
      } else {
        registerKeysEvent(eventType, hotKeys, cb, timeout);
      }
      registerKeysEvent(eventType, "eh", toggleboxes, timeout);
    });
  }

  start();

  const css = `
        #jv-modal {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1100;
            overflow: auto;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        #jv-content {
            white-space: pre-wrap;
            color: white;
            background: #183956;
            width: 50%;
            padding: 30px;
        }

        #jv-content:focus-visible {
            outline: none;
        }

        .jv-btn-group {
            margin-top: 10px;
        }
        .jv-icon-wrapper {
            display: inline-block;
            margin-left: 6px;
            cursor: pointer;
        }
        .jv-icon-wrapper svg {
            width: 1em;
            vertical-align: middle;
        }
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background-color: #333;
            color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
            z-index: 9999;
        }
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;

  GM_addStyle(css);
})();
