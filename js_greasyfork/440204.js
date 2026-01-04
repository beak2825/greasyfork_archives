// ==UserScript==
// @name         百度网盘直接下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不使用客户端，直接从百度网盘直接下载
// @author       gfreezy
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/main*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @icon              https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant             GM_xmlhttpRequest
// @grant             GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440204/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/440204/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function get(url, headers, type, progress) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers,
      responseType: type || "json",
      onload: (res) => {
        resolve(res);
      },
      onprogress: progress,
      onerror: (err) => {
        reject(err);
      }
    });
  });
}
function addButton() {
  const toolbarEl = document.querySelector(".nd-file-list-toolbar__wrapper");
  const el = document.createElement("div");
  const progress = document.createElement("span");
  el.addEventListener("click", () => {
    getLink(progress);
  });
  el.innerHTML = `<button class="u-btn u-btn--primary u-btn--default u-btn--small is-has-icon"><i class="iconfont icon-download"></i><span>\u76F4\u63A5\u4E0B\u8F7D</span></button>`;
  el.append(progress);
  toolbarEl?.prepend(el);
}
async function getLink(progressEl) {
  const selectedItems = document.querySelector(".nd-main-list").__vue__.selectedList;
  const selectedFids = selectedItems.map((v) => v.fs_id);
  const fids = "[" + selectedFids + "]";
  const fidList = encodeURIComponent(fids);
  const urlPrefix = "https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1";
  const url = `${urlPrefix}&fsids=${fidList}`;
  const ua = "pan.baidu.com";
  const resp = await get(url, {
    "User-Agent": ua
  });
  const res = resp.response;
  const data = res.list.map((d) => {
    return { link: d.dlink, filename: d.filename.replace(" ", "_") };
  });
  await Promise.all(data.map(({ link, filename }) => {
    console.log(`Download ${link} to ${filename}`);
    let prevLoaded = 0;
    let prevTs = Date.now();
    let duration = 0;
    let speed = 0;
    GM_download({
      url: link,
      name: filename,
      saveAs: true,
      headers: {
        "User-Agent": ua
      },
      onerror: (e) => {
        console.error(e);
      },
      onload: () => {
        console.log("download finished");
      },
      onprogress: (res2) => {
        const now = Date.now();
        duration = now - prevTs;
        if (duration > 1e3) {
          speed = (res2.loaded - prevLoaded) / duration / 1024 * 1e3;
          prevLoaded = res2.loaded;
          prevTs = now;
        }
        const progress = res2.total > 0 ? (res2.loaded * 100 / res2.total).toFixed(2) : 0;
        if (progressEl) {
          progressEl.innerHTML = `${progress}% ${speed.toFixed(2)}KB/s`;
        }
      }
    });
  }));
}
addButton();
