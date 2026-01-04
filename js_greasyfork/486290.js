// ==UserScript==
// @name         BYR图片转内链
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BYR转种，外链图片一键转存
// @author       Qvixote
// @match        https://byr.pt/upload.php*
// @icon         https://byr.pt/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486290/BYR%E5%9B%BE%E7%89%87%E8%BD%AC%E5%86%85%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/486290/BYR%E5%9B%BE%E7%89%87%E8%BD%AC%E5%86%85%E9%93%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("load", function () {
    function easyUpload(file) {
      return new Promise(async (resolve, reject) => {
        var form = new FormData();
        form.append("file", file);
        form.append("type", "torrent");
        var xhr = new XMLHttpRequest();
        var action = "/uploadimage.php"; // 上传服务的接口地址
        xhr.open("POST", action);
        xhr.send(form); // 发送表单数据
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var resultObj = JSON.parse(xhr.responseText);
            resolve(resultObj.location);
          }
        };
      });
    }
    async function getFileFromURL(url) {
      return new Promise(async (resolve, reject) => {
        const fetchRes = await fetch(
          "https://img.qvixote.asia:2087/getimg?uri=" + encodeURIComponent(url)
        );
        resolve(
          new File(
            [await fetchRes.blob()],
            Math.round(Math.random() * 100000000).toString(16),
            { type: fetchRes.headers.get("Content-Type") }
          )
        );
      });
    }

    var btnPending = false;

    var btnsParent = document
      .querySelector("#descr")
      .nextSibling.querySelector(".tox-menubar");
    var buttonEl = document.createElement("button");
    buttonEl.setAttribute("class", "tox-mbtn tox-mbtn--select");
    buttonEl.setAttribute("style", "user-select: none; width: unset !important;");
    buttonEl.innerHTML = `<span class="tox-mbtn__select-label">转图片</span><div class="tox-mbtn__select-chevron"></div>`;
    btnsParent.append(buttonEl);
    var targetSpan = buttonEl.querySelector("span.tox-mbtn__select-label")
    buttonEl.onclick = async function (e) {
      e.stopPropagation()
      e.preventDefault()
      if (btnPending) return;
      var tinyContent = window.tinymce.activeEditor.getContent()
      let targetImgs = [...tinyContent.matchAll(/<img.*?src="(.*?)".*?>/g)]
      targetImgs = targetImgs.filter(item => item[1].indexOf("ckfinder/userfiles") === -1)
      let imgLen = targetImgs.length
      targetSpan.innerHTML = `转图片 外链:::${targetImgs.length}张`
      if (imgLen === 0) return
      for (let i = 0, len = targetImgs.length; i < len; ++i) {
        try {
          const targetURI = targetImgs[i][1]
          const fileRes = await getFileFromURL(targetURI);
          const uploadRes = await easyUpload(fileRes);
          tinyContent = tinyContent.replace(targetURI, uploadRes)
          targetSpan.innerHTML = `转图片 上传:::${targetImgs.length - (imgLen--)}/${targetImgs.length}张`
        } catch(e) {
          console.log(e)
        }
      }
      if (imgLen === 0) {
        btnPending = true
        targetSpan.innerHTML = `转图片 完成`
      } else {
        btnPending = false
        targetSpan.innerHTML = `转图片 成功${imgLen}张 失败${targetImgs.length - imgLen}张 重试`
      }
      window.tinymce.activeEditor.setContent(tinyContent)
    };
  });
})();
