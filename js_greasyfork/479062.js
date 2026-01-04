// ==UserScript==
// @name         taobao-upload
// @namespace    https://github.com/bosens-China/taobao-upload
// @version      1.0.0
// @description  淘宝快速上传图片
// @author       yliu
// @match        https://sell.publish.tmall.com/tmall/publish.htm*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479062/taobao-upload.user.js
// @updateURL https://update.greasyfork.org/scripts/479062/taobao-upload.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  const onUpload = (file) => __async(void 0, null, function* () {
    const formData = new FormData();
    formData.append("file", file);
    fetch(
      `https://stream-upload.taobao.com/api/upload.api?appkey=tu&folderId=0&watermark=false&_input_charset=utf-8`,
      {
        method: "POST",
        body: formData,
        credentials: "include"
      }
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }).then((data) => {
      console.log("Upload successful:", data);
    }).catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
  });

  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = "image/*";
  inp.style.cssText = `display: none`;
  document.body.appendChild(inp);
  inp.addEventListener("change", (e) => {
    const target = e.target;
    const file = target.files ? target.files[0] : null;
    if (!file) {
      return;
    }
    onUpload(file);
    target.value = "";
  });
  const observer = new MutationObserver(function() {
    var _a, _b;
    const dom = document.querySelector(".upload-img-btn");
    if (!dom || dom.getAttribute("data-private") === "true") {
      return;
    }
    const newDom = dom.cloneNode(true);
    (_a = dom.parentNode) == null ? void 0 : _a.insertBefore(newDom, dom);
    (_b = dom.parentNode) == null ? void 0 : _b.removeChild(dom);
    newDom.setAttribute("data-private", "true");
    newDom.addEventListener("click", () => {
      inp.click();
    });
  });
  observer.observe(document.body, {
    childList: true,
    attributes: true
  });

})();
