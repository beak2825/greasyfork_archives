// ==UserScript==
// @name        Nexus Mods 直接下载
// @namespace   su226
// @match       https://www.nexusmods.com/*
// @grant       none
// @version     1.1
// @author      su226
// @description 跳过选择 "Slow Download" 和 "Fast Download" 的界面
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/544221/Nexus%20Mods%20%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/544221/Nexus%20Mods%20%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

async function download(e) {
  try {
    e.preventDefault();
    const params = new URL(this.href).searchParams;
    if (params.get("nmm") == "1") {
      const response = await fetch(this.href);
      const text = await response.text();
      const url = text.match(/nxm:\/\/[^'"]+/)[0];
      location.href = url;
    } else {
      const form = new FormData();
      form.append("fid", params.get("file_id"));
      form.append("game_id", window.current_game_id);
      const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      location.href = data.url;
    }
  } catch (e) {
    console.exception(e);
    location.href = this.href;
  }
}

function waitForClass(el, className) {
  if (el.classList.contains(className)) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const observer = new MutationObserver(muts => {
      for (const mut of muts) {
        if (mut.attributeName == "class" && el.classList.contains(className)) {
          observer.disconnect();
          return resolve();
        }
      }
    });
    observer.observe(el, {attributes: true});
  });
}

async function processDialog(el) {
  if (!el.classList.contains("mfp-wrap")) {
    return;
  }
  const container = el.querySelector(".mfp-container");
  await waitForClass(container, "mfp-s-ready");
  const btn = container.querySelector(".widget-mod-requirements .btn");
  if (btn) {
    btn.addEventListener("click", download);
  }
}

if (window.USER_ID) {
  const icons = [...document.querySelectorAll(".icon-manual"), ...document.querySelectorAll(".icon-nmm")]
  for (const icon of icons) {
    const el = icon.parentElement;
    if (!el.classList.contains("popup-btn-ajax")) {
      el.addEventListener("click", download);
    }
  }
  const el = document.querySelector("#action-nmm .btn");
  if (!el.classList.contains("popup-btn-ajax")) {
    el.addEventListener("click", download);
  }

  const observer = new MutationObserver(muts => {
    for (const mut of muts) {
      for (const el of mut.addedNodes) {
        processDialog(el);
      }
    }
  });
  observer.observe(document.body, {childList: true});
}
