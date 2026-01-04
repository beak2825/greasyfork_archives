// ==UserScript==
// @name         提取b站视频cc字幕内容(自行配合GPT)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键复制视频字幕文本，可以配合GPT对视频进行总结
// @author       Josh
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468429/%E6%8F%90%E5%8F%96b%E7%AB%99%E8%A7%86%E9%A2%91cc%E5%AD%97%E5%B9%95%E5%86%85%E5%AE%B9%28%E8%87%AA%E8%A1%8C%E9%85%8D%E5%90%88GPT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468429/%E6%8F%90%E5%8F%96b%E7%AB%99%E8%A7%86%E9%A2%91cc%E5%AD%97%E5%B9%95%E5%86%85%E5%AE%B9%28%E8%87%AA%E8%A1%8C%E9%85%8D%E5%90%88GPT%29.meta.js
// ==/UserScript==

var currentCCText = "";

function createBtn() {
  const right = document.querySelector(".video-toolbar-right");
  const btn = document.createElement("div");
  btn.innerHTML = `<div class="bpx-player-dm-btn-send bui bui-button">
  <div id="fetchCCBtn" style="border-radius: 10px;padding: 8px;" class="bui-area bui-button-blue">复制视频字幕内容</div>
  </div>`;
  right.appendChild(btn);
  _setBtnCopyEvent();
}

function createFailBtn() {
  const right = document.querySelector(".video-toolbar-right");
  const btn = document.createElement("div");
  btn.innerHTML = `<div class="bpx-player-dm-btn-send bui bui-button bui-disabled">
  <div style="border-radius: 10px;padding: 8px;" class="bui-area bui-button-blue">该视频无字幕</div>
  </div>`;
  right.appendChild(btn);
}

function _setBtnCopyEvent() {
  const btn = document.querySelector("#fetchCCBtn");
  btn.addEventListener("click", function () {
    GM_setClipboard(currentCCText);
    btn.innerText = "复制成功";
    setTimeout(() => {
      btn.innerText = "复制视频字幕内容";
    }, 2000);
  });
}

function getSubtitleUrl() {
  return unsafeWindow.__INITIAL_STATE__.videoData.subtitle.list[0].subtitle_url;
}

function main() {
  try {
    GM_xmlhttpRequest({
      method: "GET",
      url: getSubtitleUrl(),
      onload: function (res) {
        const data = JSON.parse(res.response);
        for (const e of data.body) {
          currentCCText += e.content + "  ";
        }
        createBtn();
      },
    });
  } catch (e) {
    createFailBtn();
  }
}

setTimeout(main, 5000);
