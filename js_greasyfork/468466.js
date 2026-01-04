// ==UserScript==
// @license MIT
// @name         下载USDZ
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  用来获取苹果官网的USDZ链接，方便下载
// @author       BigJie
// @match        https://www.apple.com/*
// @match        https://www.apple.com.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468466/%E4%B8%8B%E8%BD%BDUSDZ.user.js
// @updateURL https://update.greasyfork.org/scripts/468466/%E4%B8%8B%E8%BD%BDUSDZ.meta.js
// ==/UserScript==


(function() {
  'use strict';

  const links = [];

  function getLinks() {
    // 匹配glb和usdz格式的链接
    const regex = /(?:href|src)="([^"]+\.(?:glb|usdz))"/gi;
    const elements = document.getElementsByTagName("*");

    for (let i = 0; i < elements.length; i++) {
      const matches = elements[i].outerHTML.match(regex);
      if (matches) {
        for (let j = 0; j < matches.length; j++) {
          const link = matches[j].replace(/^(?:href|src)="(.+)"$/i, "$1");
          if (links.indexOf(link) === -1) {
            links.push(link);
          }
        }
      }
    }
  }

function createButton() {
  const button = document.createElement("button");
  button.id = "file-download-button";
  button.textContent = "下载3D文件";
  document.body.appendChild(button);

  button.onclick = function() {
    const linkList = links.map(link => {
      return `<div class="link-item"><a href="${link}" target="_blank">${link}</a><button class="download-button" data-link="${link}">下载</button></div>`;
    }).join("");
    const popup = document.createElement("div");
    popup.id = "file-download-list";
    popup.innerHTML = `<div class="popup-content">${linkList}</div>`;
    document.body.appendChild(popup);

    // 计算按钮和弹出窗口的位置
    const rect = button.getBoundingClientRect();
    const popupTop = rect.bottom + 10;
    const popupLeft = rect.left;

    popup.style.top = `${popupTop}px`;
    popup.style.left = `${popupLeft}px`;

    // 添加关闭按钮
    const closeBtn = document.createElement("button");
    closeBtn.id = "closePopupButton";
    closeBtn.textContent = "关闭";
    closeBtn.onclick = function() {
      document.body.removeChild(popup);
    };
    popup.appendChild(closeBtn);

    // 添加下载按钮
    const downloadButtons = document.querySelectorAll(".download-button");
    downloadButtons.forEach(button => {
      button.onclick = function(event) {
        const link = event.target.dataset.link;
        GM_download({
          url: link,
          name: link.split("/").pop(),
          onerror: function(error) {
            console.error(error);
          }
        });
      };
    });
  };
}

  function addStyles() {
    GM_addStyle(`
      #file-download-button {
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: black;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        font-size: 16px;
        cursor: pointer;
        z-index: 9999;
      }

      #file-download-list {
        position: fixed;
        background-color: white;
        border: 1px solid black;
        padding: 10px;
        z-index: 9998;
        overflow-y: auto;
        max-height: 50vh;
      }

      .popup-content {
        display: flex;
        flex-direction: column;
      }

      .link-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .download-button {
        background-color: black;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
      }

      #closePopupButton {
        background-color: black;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        margin-top: 10px;
      }
    `);
  }


  function parseGLB(url) {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
      onload: function(response) {
        const gltf = JSON.parse(new TextDecoder().decode(response.response));
        glbBuffer = response.response.slice(gltf.buffers[0].byteOffset, gltf.buffers[0].byteOffset + gltf.buffers[0].byteLength);
        const blob = new Blob([glbBuffer], { type: "model/gltf-binary" });
        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = url.split("/").pop();
        link.click();
      },
      onerror: function(error) {
        console.error(error);
      }
    });
  }

  function observeXHR() {
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      this.addEventListener("load", function() {
        if (url.endsWith(".glb")) {
          if (this.responseType === "arraybuffer") {
            const blob = new Blob([this.response], { type: "model/gltf-binary" });
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = url.split("/").pop();
            link.click();
          } else {
            parseGLB(url);
          }
        }
      });
      open.apply(this, arguments);
    };
  }

  function main() {
    getLinks();
    createButton();
    addStyles();
    observeXHR();
  }

  main();
})();