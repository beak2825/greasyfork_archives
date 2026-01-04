// ==UserScript==
// @name         Bilibili Redirect
// @namespace    http://github.com/Kr328/bilibili-redirect
// @version      1.8
// @author       Kr328
// @description  允许使用 Bilibili 的播放器播放本地视频。
// @license      GPLv3
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459876/Bilibili%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/459876/Bilibili%20Redirect.meta.js
// ==/UserScript==

(i=>{if(typeof GM_addStyle=="function"){GM_addStyle(i);return}const e=document.createElement("style");e.textContent=i,document.head.append(e)})(" .bilibili-redirect-base div{display:flex;flex-direction:column}.bilibili-redirect-base input{padding:4px;margin-left:8px;margin-right:8px;border:none;border-bottom:1px solid #000000B2}.bilibili-redirect-base .--br-clickable{background-color:transparent;transition:background-color .2s ease;clip-path:circle(50%);padding:4px;margin:1px}.bilibili-redirect-base .--br-clickable:hover{background-color:#00000025}.bilibili-redirect-base .--br-clickable:active{background-color:#00000035}.bilibili-redirect-base .--br-hidden{display:none}.bilibili-redirect-base .--br-spacing-row{flex-direction:row;justify-content:space-between;align-items:center;padding-top:5px;padding-bottom:5px}.bilibili-redirect-base .--br-popup-window{width:400px;height:100px;z-index:100000;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;border-radius:10px;box-shadow:0 10px 16px #00000060;padding:10px}.bilibili-redirect-base .--br-input-container{flex:1;justify-content:center} ");

(function () {
  'use strict';

  const closeSvg = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20height='48'%20width='48'%3e%3cpath%20d='m12.45%2037.65-2.1-2.1L21.9%2024%2010.35%2012.45l2.1-2.1L24%2021.9l11.55-11.55%202.1%202.1L26.1%2024l11.55%2011.55-2.1%202.1L24%2026.1Z'/%3e%3c/svg%3e";

  // src/native/alias.ts
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();

  (() => {
    const injectHtml = `
        <div id="bilibili-redirect-root" class="--br-popup-window --br-hidden">
            <div class="--br-spacing-row">
                <span style="font-size: 18px">使用本地源</span>
                <img src="${closeSvg}" id="bilibili-redirect-close" class="--br-clickable" style="width: 24px;height: 24px" alt="关闭"/>
            </div>
            <div class="--br-input-container">
                <input id="bilibili-redirect-file-picker" type="file" accept="video/mp4" />
            </div>
        </div>
    `;
    class Injector {
      injected = false;
      destroyed = false;
      inject() {
        if (this.injected) {
          return true;
        }
        let added = this.addOption(
          ".squirtle-setting-panel-wrap",
          ".squirtle-single-select.squirtle-setting-more"
        ) || this.addOption(
          ".bpx-player-ctrl-setting-menu-left",
          ".bpx-player-ctrl-setting-more"
        );
        if (added) {
          this.injected = true;
          this.injectPopupWindow();
          this.resizePanel();
        }
        return added;
      }
      injectPopupWindow() {
        const wrap = document.createElement("div");
        wrap.classList.add("bilibili-redirect-base");
        wrap.innerHTML = injectHtml;
        document.body.appendChild(wrap);
        setTimeout(() => {
          const root = wrap.querySelector("#bilibili-redirect-root");
          const close = wrap.querySelector("#bilibili-redirect-close");
          close.onclick = () => {
            root.classList.add("--br-hidden");
          };
          const picker = wrap.querySelector("#bilibili-redirect-file-picker");
          picker.onchange = () => {
            if (picker.files) {
              const video = document.querySelector("video");
              if (video) {
                const player = _unsafeWindow.player;
                let core;
                if (player.core) {
                  core = player.core();
                } else if (player.__core) {
                  core = player.__core();
                } else {
                  alert("UNSUPPORTED PLAYER");
                  root.classList.add("--br-hidden");
                  return;
                }
                if (!this.destroyed) {
                  this.destroyed = true;
                  core.destroy();
                }
                core.seek = async (t) => {
                  try {
                    video.currentTime = t;
                  } catch (e) {
                    console.warn(e);
                  }
                };
                video.src = URL.createObjectURL(picker.files[0]);
                root.classList.add("--br-hidden");
              }
            }
          };
        });
      }
      resizePanel() {
        const panels = document.querySelectorAll(".bui-panel-wrap");
        if (panels == null) {
          return;
        }
        for (let i = 0; i < panels.length; i++) {
          const panel = panels.item(i);
          console.log(panel);
          const button = panel.querySelector("#bilibili-redirect-button");
          if (!button) {
            continue;
          }
          const height = panel.style.height;
          if (!height || height == "") {
            continue;
          }
          panel.style.height = (parseInt(height) + button.offsetHeight + 30).toString() + "px";
          panel.querySelectorAll("div.bui-panel-item").forEach((elm) => {
            elm.style.height = "100%";
          });
        }
      }
      addOption(containerSelector, cloneSelector) {
        const container = document.querySelector(containerSelector);
        if (container == null) {
          return false;
        }
        const clone = document.querySelector(cloneSelector);
        if (clone == null) {
          console.error("src style not found.");
          return true;
        }
        const cloned = clone.cloneNode(true);
        cloned.querySelector("span").innerText = "使用本地源";
        cloned.id = "bilibili-redirect-button";
        cloned.onclick = () => {
          document.querySelector("#bilibili-redirect-root").classList.remove("--br-hidden");
          document.querySelector("#bilibili-redirect-file-picker").value = "";
        };
        container.appendChild(cloned);
        return true;
      }
    }
    const injector = new Injector();
    let retry = 0;
    const poller = setInterval(() => {
      if (injector.inject() || retry++ > 20) {
        clearInterval(poller);
      }
    }, 500);
  })();

})();