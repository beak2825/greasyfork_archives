// ==UserScript==
// @name         超星学习通章节内ppt下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ctrl+s保存ppt，ctrl+d查看ppt
// @author       white
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA11JREFUeF7tmmGO1DAMRrMnAU4CnAQ4CXASlpMAJwFOAvOkfpIVdbpO6k4ctf2zq06axs+fHSfpUzn59XRy+8sF4FLAyQm0hsDnG68vD2DGuHgX1/dSyp+j3tkDgLF8PWpAN8P/3foXgI+L8Z+OgpAdgDgDAgg/o8FHAHhXSnm7DOxvKeV5+V8S5h4S1uB1X7bUarIKkNp4x7el79CQiACAQQwQAyXZ94uUyRevl9/lQQy0ecQDABD08yM6JKIAMDgMBABA3phYZvCCJDBb711TgFU+ffEe+tqdHKMAyPMoAe/iVRnC4GswMkhtrYEvAbD98R6FXFd6iAKA4QzGJikLAK9JJfb+2qA9AGxIAKA7L0QBkHG1JxXr/EWyAIoCoHeRHPX+5pCIAID3GUAtRZvtrYe4v1VHeBWwlheap8oIAF2xt/GQBdBTdQLBnRcyA4gGu9pfVgA9npeBv1oqxowA6kqxRQkqyNxrlYwAWgyu2wreBcBL8VKAl1S1wnNLrLH/vc2vEFgIuh00KgR+L9Xgq+DdpSkUQO3O6hD4rO8jt7umAGD3BgDhLlsdCWI6ACyimldwGyCmAGA3R1S5OZzrajIFAIwm9tk2Y8DkgKhrCgDInlmADZIPZwSAt1EAINghOp0CBIBQaNq8cMTJFCGgXV3qAe0TOmxzNZkOADXAqUOAGqB5I3P2OkDTIIbrvC9KBVOEADMAF/EPACXDiJPf9ADkfSU/HXgKyN6yOD0Azf9UgbpUGGH83gPP1ABs7NcrwCglpAaw5n2b0C0E8gGK0LGbbaePLdZ2fdICqGPfyp/1gIoje5//NU3a+3yNotPoe+eR6bbElPmZ7jBYnpU369Mc1EA7TojUhgNWzRT8rrWEVUdKBbD+Z7pj8DpF9h5f6fMaQdMswX0SaT1rpATA0lcZ3lXQ32kkr/PzvZohDQANlni1H0fsAeB5NgUAJI9kSUTEfvSCZwvEcAD6XIWC5qVpz+PR1jZDAdjtbv5/pPQFahgAfclJZtacv/YJXKtHW9sPA4Dcmac56sLwEcYDaxgAJT59rhaxtG31/lAAPYM94plhCjjCmJ4+LwALtXSLoR5v9jxzKeARCtjzEWOPV1ufaZqCWz+RaR1M+vYXgPQuOniAlwIOBpy++/888BVQhuoCAQAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538809/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%86%85ppt%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/538809/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%86%85ppt%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function getPdfInfo() {
    try {
      var objectId = document
        .getElementsByTagName("iframe")[0]
        .contentDocument.body.getElementsByClassName("ans-attach-ct")[0]
        .getElementsByTagName("iframe")[0]
        .getAttribute("objectid");
    } catch (e) {
      window.alert("获取objectId失败！");
      throw new Error("获取objectId失败！");
    }
    var url = `https://mooc1.chaoxing.com/ananas/status/${objectId}?flag=normal&_dc=${Date.now()}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    var data = JSON.parse(xhr.responseText);
    return {
      pdfUrl: data.pdf,
      fileName: (data.filename += ".pdf"),
    };
  }

  function createStyle() {
    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    var cssRules = `
        #__w_progressBarWrp {
            width: 100%;
            background-color: #f3f3f3;
            height: 30px;
            text-align: center;
            line-height: 30px;
            color: white;
        }
        #__w_progressBar{
            background-color: #4caf50;
        }

        /* 弹窗样式 */
        #__w_myModal {
            display: none;
            position: fixed;
            z-index: 99999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
        }

        #__w_modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 300px;
            text-align: center;
            position: relative;
        }

        /* 关闭按钮样式 */
        #__w_close {
            color: #aaa;
            position: absolute;
            top: 0;
            right: 15px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        #__w_close:hover,
        #__w_close:focus {
            color: black;
            text-decoration: none;
        }

        #__w_fileName {
            width: 200px;
            /*超出隐藏*/
            overflow: hidden;
            /*超出不换行*/
            white-space: nowrap;
            /*超出使用...*/
            text-overflow: ellipsis;
        }
        #__w_boardPreview{
            z-index: 9999;
            position: fixed;
            top: 50px;
            right: 100px;
            display: flex;
            flex-direction: column;
        }`;
    styleElement.appendChild(document.createTextNode(cssRules));
    document.head.appendChild(styleElement);
  }
  function createProgressDiv() {
    const divContent = `
      <div id="__w_modal-content">
        <span id="__w_close">×</span>
        <p id="__w_fileName"></p>
        <div id="__w_progressBarWrp">
            <div id="__w_progressBar"></div>
        </div>
      </div>`;
    const newDiv = document.createElement("div");
    // 设置div的内容
    newDiv.innerHTML = divContent;
    newDiv.id = "__w_myModal";
    // 将div添加到body中
    document.body.appendChild(newDiv);
  }
  function createBtnDiv() {
    const divContent = `
      <button id="__w_downloadPdf">下载课件</button>
      <button id="__w_previewDdf">预览课件</button>
    `;
    const newDiv = document.createElement("div");
    // 设置div的内容
    newDiv.innerHTML = divContent;
    newDiv.id = "__w_boardPreview"
    // 将div添加到body中
    document.body.appendChild(newDiv);
  }
  function previewPdf() {
    const data = getPdfInfo();
    window.open(data.pdfUrl, "_blank");
  }
  function downlodePdf() {
    const data = getPdfInfo();

    showText(data.fileName + "下载中...");
    modal.style.display = "block";

    xhr = new XMLHttpRequest();
    xhr.open("GET", data.pdfUrl, true);
    xhr.responseType = "blob";
    // 监听响应进度
    xhr.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        progressBar.style.width = percentComplete + "%";
        progressBar.textContent = Math.round(percentComplete) + "%";
      }
    });
    // 监听请求响应
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          // 获取响应的blob对象
          var blob = xhr.response;
          // 创建下载链接
          var downloadUrl = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = downloadUrl;
          a.download = data.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // 释放URL对象
          window.URL.revokeObjectURL(downloadUrl);
          closeSuccess()
        } else {
          const text = "下载失败:" + xhr.statusText;
          console.error("下载失败:", xhr.statusText);
          showText(text);
        }
      }
    };
    xhr.onerror = function () {
      console.error("请求出错");
      showText("请求出错");
      closeSuccess();
    };

    xhr.send();
  }

  createStyle();
  createProgressDiv();
  createBtnDiv();
  const modal = document.getElementById("__w_myModal");
  document.getElementById("__w_close").onclick = function () {
    if (xhr && xhr.readyState !== XMLHttpRequest.DONE) {
      xhr.abort();
    }
    closeSuccess();
  };
  const progressBar = document.getElementById("__w_progressBar");
  const fileNameP = document.getElementById("__w_fileName");

  document.getElementById("__w_downloadPdf").onclick = downlodePdf;
  document.getElementById("__w_previewDdf").onclick = previewPdf;
  let xhr;

  function closeSuccess() {
    progressBar.style.width = 0;
    progressBar.textContent = "";
    modal.style.display = "none";
  }
  function showText(msg) {
    msg = msg ? msg : "文件下载中...";
    fileNameP.innerHTML = msg;
  }

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "d") {
      event.preventDefault();
      previewPdf()
    } else if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      downlodePdf()
    }
  });
})();
