// ==UserScript==
// @name         Bilibili Video Detail
// @name:zh-CN   哔哩哔哩视频详情
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Insert a hyperlink under video title named "info" to get the video details by BV code through Bilibili API.
// @description:zh-CN  在视频标题下方插入链接，点击可以通过访问B站API查看视频详情
// @author       philimao
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/opus/*
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429667/Bilibili%20Video%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/429667/Bilibili%20Video%20Detail.meta.js
// ==/UserScript==

(async function () {
  // for video
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
        if (counter === 10000) {
          console.log("[BiliDetail] Player Timeout, Increase Interval");
        }
        counter++;
        const timeout = counter < 10000 ? 500 : 2000;
        if (counter % 10000 === 0)
          console.log("[BiliDetail] Waiting", counter, timeout);
        setTimeout(wait, timeout);
      }
      setTimeout(wait, 3000);
    });
  }

  // for dynamic
  async function titleReady(titleClass) {
    let counter = 0;
    return new Promise((resolve, reject) => {
      const id = setInterval(() => {
        if (document.querySelector(titleClass)) resolve(clearInterval(id));
        if (counter > 50) {
          reject(clearInterval(id));
        }
        counter++;
      }, 200);
    });
  }

  function setSessionSpeed(speed) {
    const data = JSON.parse(
      window.sessionStorage.getItem("bilibili_player_settings")
    );
    data.video_status.videospeed = speed;
    window.sessionStorage.setItem(
      "bilibili_player_settings",
      JSON.stringify(data)
    );
  }
  function injectSpeedIcon() {
    const video = document.querySelector("video");
    const playerStyle = document.querySelector(".bpx-player-container") ? 0 : 1;
    let ul;
    if (playerStyle) ul = document.querySelector("ul.bilibili-player-video-btn-speed-menu");
    else ul = document.querySelector("ul.bpx-player-ctrl-playbackrate-menu");
    if (!ul) return console.log("[BiliDetail] Speed Icon Not Detected");
    let x3 = playerStyle ?
      document.querySelector(".bilibili-player-video-btn-speed-menu-list[data-value='3']") :
      document.querySelector(".bpx-player-ctrl-playbackrate-menu-item[data-value='3']");
    if (x3) return;

    const sp3 = document.createElement("li");
    sp3.innerText = "3.0x";
    if (playerStyle) sp3.className = "bilibili-player-video-btn-speed-menu-list ";
    else sp3.className = "bpx-player-ctrl-playbackrate-menu-item ";
    sp3.setAttribute("data-value", "3");
    sp3.addEventListener("click", () => {
      if (playerStyle) sp3.classList.add("bilibili-player-active");
      else sp3.classList.add("bpx-state-active");
      video.playbackRate = 3;
      setSessionSpeed(3);
      // showSpeed.innerText = "3.0x";
    });
    const sp4 = document.createElement("li");
    sp4.innerText = "4.0x";
    if (playerStyle) sp4.className = "bilibili-player-video-btn-speed-menu-list ";
    else sp4.className = "bpx-player-ctrl-playbackrate-menu-item ";
    sp4.setAttribute("data-value", "4");
    sp4.addEventListener("click", () => {
      if (playerStyle) sp4.classList.add("bilibili-player-active");
      else sp4.classList.add("bpx-state-active");
      video.playbackRate = 4;
      setSessionSpeed(4);
      // showSpeed.innerText = "4.0x";
    });
    ul.insertBefore(sp3, ul.firstElementChild);
    ul.insertBefore(sp4, ul.firstElementChild);
    document
      .querySelectorAll(".bilibili-player-video-btn-speed-menu-list")
      .forEach((el) =>
        el.addEventListener("click", () => {
          document
            .querySelectorAll(
              playerStyle ?
              ".bilibili-player-video-btn-speed-menu-list.bilibili-player-active" :
              ".bpx-player-ctrl-playbackrate-menu-item.bpx-state-active"
            )
            .forEach((active) => {
              // 切回1.0x时有问题
              if (active && active.innerHTML !== el.innerHTML) {
                  if (playerStyle) active.classList.remove("bilibili-player-active");
                  else active.classList.remove("bpx-state-active");
              }
            });
        })
      );
  }

  function registerPageObserver() {
    const target = unsafeWindow.__INITIAL_STATE__;
    let videoData = target.videoData;
    const desc = Object.getOwnPropertyDescriptor(target, "videoData");
    const vueHook = desc.set;
    Object.defineProperty(target, "videoData", {
      get: desc.get || (() => videoData),
      set(data) {
        videoData = data;
        injectSpeedIcon();
        if (vueHook) vueHook.call(this, data);
      },
      enumerable: true,
      configurable: true,
    });
  }

  const info = document.createElement("a");
  info.id = "custom_info";
  info.innerText = "info";
  info.style.height = "16px";
  info.style.color = "#999";
  info.style.marginLeft = "12px";
  info.target = "_blank";

  let titleClass, isVideo;
  if (window.location.href.includes("video")) {
    const match = window.location.href.match(/BV[^?#&\/]*/);
    if (match) {
      info.href =
        "https://api.bilibili.com/x/web-interface/view?bvid=" + match[0];
      titleClass = ".video-info-detail-list";
      isVideo = true;
      info.style.paddingBottom = "3px";
    }
  } else {
    const match = window.location.href
      .split("spm_id_from")[0]
      .split("tab")[0]
      .match(/\d+/);
    if (match) {
      info.href =
        "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=" +
        match[0];
      if (window.location.href.includes("opus")) titleClass = ".opus-module-author__pub"
      else titleClass = ".bili-dyn-time";
    }
  }
  if (titleClass) {
    if (isVideo) await playerReady();
    else await titleReady(titleClass);
    const bvid = unsafeWindow?.__INITIAL_STATE__?.bvid;
    if (bvid) info.innerText = bvid;
    document.querySelector(titleClass).appendChild(info);
    console.log("[BiliDetail] Custom Info Icon Injected.", bvid);

    if (isVideo) {
      injectSpeedIcon();
      registerPageObserver();
      console.log("[BiliDetail] Speed Control Injected.");

      const observer = new MutationObserver((mutationList, observer) => {
        console.log(
          "[BiliDetail] New Custom Info Icon Injected",
          bvid
        );
        info.innerText = bvid;
        info.href =
          "https://api.bilibili.com/x/web-interface/view?bvid=" +
          bvid;
        document.querySelector(titleClass).appendChild(info);
      });
      observer.observe(document.querySelector(".video-info").children[0], {
        attributes: true,
      });
    }
  }
})();
