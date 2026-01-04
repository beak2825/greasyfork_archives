// ==UserScript==
// @name         Arkrec Wiki Assistant
// @name:zh-CN   明日方舟少人WIKI辅助插件
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Automatically query if this video has been in the arkrec wiki database on video loading
// @description:zh-CN  在打开视频时自动判断是否已上传至少人WIKI数据库，并提供上传捷径链接
// @author       philimao
// @match        https://www.bilibili.com/video/BV*
// @icon         https://www.google.com/s2/favicons?domain=arkrec.com
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433392/Arkrec%20Wiki%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/433392/Arkrec%20Wiki%20Assistant.meta.js
// ==/UserScript==

const maxRetries = 100;
async function delay(timeout) {
  return new Promise(r => setTimeout(r, timeout));
}
async function waitForDom(selector, retries) {
  // console.log("[Arkrec]",selector);
  let dom, r;
  r = retries || maxRetries;
    console.log("retries", r);
  for (let i = 0; i < r; i++) {
    dom = document.querySelector(selector);
    if (dom) return dom;
    await delay(500);
  }
  console.log(`[Arkrec] Dom element ${selector} not loaded in given time`);
}

async function waitForVar(v, retries, path) {
  let res;
  let r = retries || maxRetries;
  for (let i = 0; i < r; i++) {
    res = v;
    if (path) {
      for (let key of path) {
        res = res[key];
      }
    }
    if (res) return res;
    console.log("[Arkrec]", res);
    await delay(500);
  }
  console.log("[Arkrec] variable not loaded in given time");
}

(async function () {
  GM_registerMenuCommand(
    "Global Mode",
    () => GM_setValue("mode", "global"),
    "g"
  );
  GM_registerMenuCommand(
    "Exclusive Mode",
    () => GM_setValue("mode", "exclusive"),
    "e"
  );

  const wikiBtn = document.createElement("button");

  // https://greasyfork.org/en/scripts/398655-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E9%A1%B5%E9%9D%A2%E5%B8%B8%E9%A9%BB%E6%98%BE%E7%A4%BAav-bv%E5%8F%B7-%E5%B7%B2%E5%AE%8C%E5%85%A8%E9%87%8D%E6%9E%84-%E6%94%AF%E6%8C%81%E6%98%BE%E7%A4%BA%E5%88%86p%E6%A0%87%E9%A2%98
  async function playerReady() {
    let counter = 0;
    return new Promise((resolve) => {
      function wait() {
        if (
          unsafeWindow.player &&
          unsafeWindow.player.isInitialized &&
          unsafeWindow.player.isInitialized()
        ) {
          return resolve();
        }
        if (counter === 1000) {
          console.log("[Arkrec] Player Timeout, Increase Interval");
        }
        counter++;
        const timeout = counter < 1000 ? 100 : 1000;
        if (counter % 10000 === 0)
          console.log("[Arkrec] Waiting", counter, timeout);
        setTimeout(wait, timeout);
      }
      setTimeout(wait, 2000);
    });
  }

  async function injection() {
    const elem = document.querySelector("[data-inject='arkrec']");
    if (elem) elem.remove();

    const tags = unsafeWindow.__INITIAL_STATE__.tags.map((el) => el.tag_name);
    console.log("[Arkrec]", tags);
    if (
      ["明日方舟", "危机合约", /arknights/i].every(
        (re) =>
          tags.every((tag) => tag.search(re) < 0) ||
          (GM_getValue("mode") === "global" && !tags.includes("手机游戏"))
      )
    )
      return console.log("[Arkrec] No Arknights Tag Detected, Abort Injection");

    const username = await waitForVar(unsafeWindow, 100, ["__INITIAL_STATE__","user","uname"]);
    if (username === "philimao") {
        const playerStyle = document.querySelector(".bpx-player-container") ? 0 : 1;
        let x2 = playerStyle ?
          await waitForDom(".bilibili-player-video-btn-speed-menu-list[data-value='2']") :
          await waitForDom(".bpx-player-ctrl-playbackrate-menu-item[data-value='2']");
        if (x2) x2.click();
        else console.log("[Arkrec] Speed Icon Not Detected");
    }

    let host = "https://arkrec.com";
    // host = "http://127.0.0.1:3001";
    const { bvid, p } = unsafeWindow.__INITIAL_STATE__;
    const url =
      "https://www.bilibili.com/video/" + bvid + (p === 1 ? "" : "?p=" + p);
    try {
      const resRaw = await fetch(host + "/api/query-url", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      let toolbar = document.querySelector(".video-toolbar");
      if (toolbar) toolbar.appendChild(wikiBtn);
      else {
        wikiBtn.style.transform = "none";
        toolbar = await waitForDom(".video-toolbar-right");
        toolbar.insertBefore(wikiBtn, toolbar.firstChild);
      }
      if (resRaw.ok) {
        console.log("[Arkrec] Record Exists.");
        const wikiBtn = document.querySelector("[data-inject='arkrec']");
        wikiBtn.style.filter = "invert(0.8)";
        wikiBtn.style.pointerEvents = "none";
        wikiBtn.setAttribute("disabled", "true");
      } else {
        console.log("[Arkrec] Wiki Icon Injecting", bvid, "Page", p);
      }
    } catch (err) {
      console.log(err);
      document.querySelector(".video-toolbar").appendChild(wikiBtn);
      console.log(
        "[Arkrec] Fail to Connect to Arkrec Server. Wiki Icon Injecting",
        bvid,
        "Page",
        p
      );
    }
  }

  // https://greasyfork.org/en/scripts/398542-bilibili-%E6%98%BE%E7%A4%BA-av-%E5%8F%B7
  function registerObserver() {
    console.log("[Arkrec] Register Re-Injection Listener");
    const target = unsafeWindow.__INITIAL_STATE__;
    let videoData = target.videoData;
    const desc = Object.getOwnPropertyDescriptor(target, "videoData");
    const vueHook = desc.set;
    Object.defineProperty(target, "videoData", {
      get: desc.get || (() => videoData),
      set(data) {
        videoData = data;
        injection();
        if (vueHook) vueHook.call(this, data);
      },
      enumerable: true,
      configurable: true,
    });
  }

  const wikiSvg =
    "data:image/svg+xml,%3Csvg%20id%3D%22svg%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%22400%22%20height%3D%22176.24521072796932%22%20viewBox%3D%220%2C%200%2C%20400%2C176.24521072796932%22%20version%3D%221.1%22%3E%3Cg%20id%3D%22svgg%22%3E%3Cpath%20id%3D%22path0%22%20d%3D%22M0.000%2081.302%20C%200.000%20178.729%2C-0.539%20176.253%2C20.648%20176.239%20C%2035.296%20176.230%2C36.588%20174.889%2C57.999%20137.469%20C%2068.404%20119.283%2C77.715%20103.341%2C78.689%20102.042%20C%2080.149%20100.093%2C83.915%20105.722%2C100.158%20134.127%20C%20123.163%20174.358%2C124.902%20176.245%2C138.968%20176.245%20C%20148.294%20176.245%2C149.315%20175.895%2C154.176%20171.034%20L%20159.387%20165.824%20159.387%2082.912%20L%20159.387%200.000%20141.762%200.000%20L%20124.138%200.000%20124.138%2052.487%20L%20124.138%20104.974%20107.142%2075.475%20L%2090.146%2045.977%2080.303%2045.977%20L%2070.460%2045.977%2065.395%2054.023%20C%2062.610%2058.448%2C54.860%2071.635%2C48.173%2083.326%20L%2036.015%20104.583%2035.612%2052.292%20L%2035.209%200.000%2017.604%200.000%20L%200.000%200.000%200.000%2081.302%20M163.985%2088.123%20L%20163.985%20176.245%20180.843%20176.245%20L%20197.701%20176.245%20197.701%2088.123%20L%20197.701%200.000%20180.843%200.000%20L%20163.985%200.000%20163.985%2088.123%20M202.299%2088.123%20L%20202.299%20176.245%20213.374%20176.245%20L%20224.450%20176.245%20292.685%20108.065%20L%20360.920%2039.884%20361.424%2019.942%20L%20361.929%200.000%20344.183%200.000%20L%20326.437%200.000%20326.437%2012.654%20L%20326.437%2025.307%20281.992%2069.732%20L%20237.548%20114.156%20237.548%2057.078%20L%20237.548%200.000%20219.923%200.000%20L%20202.299%200.000%20202.299%2088.123%20M364.751%2088.123%20L%20364.751%20176.245%20382.375%20176.245%20L%20400.000%20176.245%20400.000%2088.123%20L%20400.000%200.000%20382.375%200.000%20L%20364.751%200.000%20364.751%2088.123%20M301.143%20102.688%20L%20288.948%20114.956%20307.692%20133.745%20L%20326.437%20152.535%20326.437%20164.390%20L%20326.437%20176.245%20344.061%20176.245%20L%20361.686%20176.245%20361.686%20159.487%20C%20361.686%20150.270%2C360.962%20140.787%2C360.078%20138.414%20C%20358.678%20134.659%2C316.353%2090.421%2C314.160%2090.421%20C%20313.708%2090.421%2C307.850%2095.942%2C301.143%20102.688%20%22%20stroke%3D%22none%22%20fill%3D%22%23000000%22%20fill-rule%3D%22evenodd%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E";
  wikiBtn.setAttribute("data-inject", "arkrec");
  wikiBtn.style.width = "5rem";
  wikiBtn.style.height = "1.8rem";
  wikiBtn.style.marginRight = "2rem";
  wikiBtn.style.float = "right";
  wikiBtn.style.backgroundColor = "initial";
  wikiBtn.style.border = "none";
  wikiBtn.style.backgroundImage = `url(${wikiSvg})`;
  wikiBtn.style.backgroundSize = "contain";
  wikiBtn.style.backgroundRepeat = "no-repeat";
  wikiBtn.style.backgroundPosition = "center";
  wikiBtn.style.filter = "invert(0.4)";
  wikiBtn.style.transform = "translateY(2px)";
  wikiBtn.style.cursor = "pointer";

  const toast = document.querySelector("div");
  toast.id = "arkrec_toast";
  toast.style.width = "80px";
  toast.style.height = "30px";
  toast.style.position = "absolute";
  toast.style.left = 0;
  toast.style.top = 0;
  toast.style.backgroundColor = "black";
  toast.style.color = "white";
  toast.style.fontSize = "13px";
  toast.style.textAlign = "center";
  toast.style.lineHeight = "30px";
  toast.style.opacity = 0;
  toast.style.display = "none";
  toast.style.borderRadius = "4px";
  toast.style.transition = "all 0.3s ease-in-out";
  toast.style.zIndex = 3000;

  async function getScreenshot() {
    return new Promise((resolve, reject) => {
      const video = document.querySelector("video");
      if (!video) {
        alert(
          "检测到播放器不支持截图，请在设置-更多设置-播放策略中选择非HEVC的选项并刷新页面"
        );
        reject();
      }
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      const { ClipboardItem } = window;
      canvas.toBlob((blob) => {
        const clipboardItem = new ClipboardItem({
          "image/png": blob,
        });
        navigator.clipboard
          .write([clipboardItem])
          .then(() => resolve(console.log("复制成功")));
      }, "image/png");
    });
  }

  async function toastInfo(evt, text) {
    toast.innerText = text;
    toast.style.display = "block";
    toast.style.opacity = 1;
    toast.style.transform = `translate(${evt.x - 40}px, ${evt.y - 40}px)`;
    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => {
        toast.style.display = "none";
      }, 300);
    }, 800);
  }

  wikiBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    getScreenshot().then(() => toastInfo(evt, "复制成功"));
  });

  wikiBtn.addEventListener("contextmenu", (evt) => {
    evt.preventDefault();
    toastInfo(evt, "截图中...")
      .then(getScreenshot)
      .then(() => {
        const { bvid, p } = unsafeWindow.__INITIAL_STATE__;
        window.open(
          "https://arkrec.com/submit?bvid=" + bvid + (p === 1 ? "" : "&p=" + p)
        );
      });
  });

  wikiBtn.addEventListener("mouseenter", () => {
    wikiBtn.style.filter =
      "invert(1) brightness(0.5) sepia(1) hue-rotate(-194deg) saturate(3)";
  });
  wikiBtn.addEventListener("mouseleave", () => {
    wikiBtn.style.filter = "invert(0.4)";
  });

  await playerReady();
  await injection();
  registerObserver();
  document.querySelector("body").append(toast);
})();