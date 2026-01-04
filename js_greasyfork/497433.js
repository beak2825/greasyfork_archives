// ==UserScript==
// @name         weibo_pic_download
// @namespace    npm/vite-plugin-monkey
// @version      0.0.0
// @author       monkey
// @description  微博图片批量下载
// @license      Apache License 2.0
// @icon         https://vitejs.dev/logo.svg
// @match        https://weibo.com/*/*
// @match        https://weibo.com/u/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.27/dist/vue.global.prod.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497433/weibo_pic_download.user.js
// @updateURL https://update.greasyfork.org/scripts/497433/weibo_pic_download.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .float-btn{position:fixed;top:100px;right:50px} ");

(function (vue) {
  'use strict';

  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const test = async function() {
        let articles = document.getElementsByTagName("article");
        if (articles && articles.length !== 0) {
          for (let i = 0; i < articles.length; i++) {
            let article = articles[i];
            let bts = article.getElementsByTagName("download-btn");
            if (bts && bts.length === 0) {
              const downloadBtn = document.createElement("download-btn");
              downloadBtn.setAttribute("class", "download-btn");
              downloadBtn.innerHTML = "Download";
              downloadBtn.addEventListener("click", () => {
                let boxes = article.getElementsByClassName("woo-box-item-inlineBlock");
                if (boxes) {
                  boxes.forEach(async function(box) {
                    let imgs = box.getElementsByTagName("img");
                    let videos = box.getElementsByTagName("video");
                    if (videos && videos.length) {
                      let src = videos[0].src;
                      console.log(src);
                      let pattern = /%2F([a-zA-Z0-9]+)\.mov/;
                      let match = src.match(pattern);
                      if (match) {
                        const vid = match[1];
                        fetchAndDownload(src, vid + ".mov");
                      } else {
                        console.log("No match found " + src);
                      }
                      return;
                    }
                    if (imgs && imgs.length) {
                      let src = imgs[0].src;
                      let pattern = /orj360\/([a-zA-Z0-9]+)\.jpg/;
                      let match = src.match(pattern);
                      if (match) {
                        const pid = match[1];
                        let url = "https://weibo.com/ajax/common/download?pid=" + pid;
                        await download(pid, "jpg", url);
                      } else {
                        console.log("No match found " + src);
                      }
                    }
                  });
                }
              });
              article.appendChild(downloadBtn);
            }
          }
        }
      };
      function fetchAndDownload(url, filename) {
        fetch(url).then((response) => response.blob()).then((blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
        }).catch((error) => console.error("Error downloading file:", error));
      }
      const download = async function(id, type, url) {
        let downBtn = document.createElement("a");
        downBtn.href = url;
        downBtn.download = id + type === "jpg" ? ".jpg" : ".mov";
        downBtn.click();
      };
      setTimeout(test, 3e3);
      window.onscroll = function() {
        setTimeout(test, 1500);
      };
      return (_ctx, _cache) => {
        return null;
      };
    }
  };
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);