// ==UserScript==
// @name         WebUI 이미지 자동 다운
// @namespace    https://greasyfork.org/users/815641
// @match        *://*.gradio.app/*
// @match        *://*.ngrok.io/*
// @version      1.0.0
// @author       우흐
// @description  WebUI 이미지 자동 다운로드
// @license      MIT
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/453428/WebUI%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/453428/WebUI%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let autoDownInit = false;
  onUiUpdate(function () {
    if (autoDownInit) return;

    const t2i = gradioApp().querySelector("#txt2img_gallery");
    if (!t2i) return;
    const i2i = gradioApp().querySelector("#img2img_gallery");
    if (!i2i) return;
    autoDownInit = true;
    console.log("auto downloader init");

    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const dateString = `${year}_${month}_${day}__${hours}_${minutes}_${seconds}`;

    const config = {
      attributes: true,
      attributeFilter: ["src"],
      childList: true,
      subtree: true,
    };

    let downloadNumber = 0;
    let src;
    let prefix;

    const callback = (mutations) => {
      for (const mutation of mutations) {
        switch (mutation.type) {
          case "childList":
            if (!(mutation.target.parentNode.classList[0] === "grid")) continue;
            if (src === mutation.target.childNodes[0].getAttribute("src")) continue;
            mutation.target.parentElement.parentElement.parentElement.id === "txt2img_gallery"
              ? (prefix = "t2i")
              : (prefix = "i2i");

            src = mutation.target.childNodes[0].getAttribute("src");

            GM_download(src, `${prefix}__${dateString}__${downloadNumber}.png`);
            downloadNumber += 1;
            break;

          case "attributes":
            if (!(mutation.target.parentNode.classList[0] === "gallery-item")) continue;
            mutation.target.parentElement.parentElement.parentElement.parentElement.id ===
            "txt2img_gallery"
              ? (prefix = "t2i")
              : (prefix = "i2i");

            src = mutation.target.getAttribute("src");
            GM_download(src, `${prefix}__${dateString}__${downloadNumber}.png`);
            downloadNumber += 1;

            break;
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(t2i, config);
    observer.observe(i2i, config);
  });
})();
