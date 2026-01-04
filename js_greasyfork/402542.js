// ==UserScript==
// @name         live-streaming-url
// @namespace    tampermonkey
// @version      0.1
// @description  获取虎牙直播视频流地址
// @author       microJ
// @match        https://www.huya.com/*
// @grant        none
// @homepage     https://github.com/microJ/live-streaming-url
// @downloadURL https://update.greasyfork.org/scripts/402542/live-streaming-url.user.js
// @updateURL https://update.greasyfork.org/scripts/402542/live-streaming-url.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const streamResultBox = document.createElement("div");

  try {
    const hyPlayerConfig = window.hyPlayerConfig;
    if (!hyPlayerConfig) return;

    const streamList = hyPlayerConfig.stream.data[0].gameStreamInfoList.map(
      (info) => {
        return `${info.sHlsUrl}/${info.sStreamName}.m3u8`;
      }
    );

    streamResultBox.style = `
        z-index: 999999;
        position: fixed;
        top: 0;
        left: 0;
    `;

    const hover = document.createElement("div");
    hover.innerHTML = "show live-streaming-url";

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "X";
    closeBtn.style = `
      display: inline-block;
      padding: 0 10px;
      border-radius: 4px;
      background: red;
      cursor: pointer;
    `;
    hover.appendChild(closeBtn);

    const resultText = document.createElement("div");
    resultText.innerHTML = streamList.reduce(
      (text, stream) => `${text}${stream}<br>`,
      ""
    );
    resultText.style = `
        display: none;
        padding: 10px;
        background-color: #fff;
    `;

    function handleCloseBtnClick() {
      streamResultBox.onmouseenter = null;
      document.body.removeChild(streamResultBox);
    }

    function handleStreamResultBoxMouseleave() {
      console.log(123);
      closeBtn.removeEventListener("click", handleCloseBtnClick);
      resultText.style.display = "none";
    }

    streamResultBox.onmouseenter = function () {
      closeBtn.addEventListener("click", handleCloseBtnClick);
      resultText.style.display = "block";
    };

    streamResultBox.onmouseleave = function () {
      closeBtn.removeEventListener("click", handleCloseBtnClick);
      resultText.style.display = "none";
    };

    streamResultBox.appendChild(hover);
    streamResultBox.appendChild(resultText);
    document.body.appendChild(streamResultBox);
  } catch (err) {
    console.log("--------->");
    console.log(err);
    streamResultBox && document.body.removeChild(streamResultBox);
  }
})();
