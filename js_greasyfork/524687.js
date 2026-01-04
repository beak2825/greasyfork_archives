// ==UserScript==
// @name         Lofter(乐乎)原图下载 修改版
// @namespace    LofterSpiderFix
// @license      原作者保留
// @version      1.3.0
// @author       Kaesinol
// @author       兰陵笑笑生
// @homepage     https://gist.github.com/kaixinol/3652d2484de12818e9b402808db30801
// @description  批量下载Lofter图片，修改重写自 兰陵笑笑生的Lofter原图查看下载。
// @match        https://*.lofter.com/post/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @icon         https://www.lofter.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @downloadURL https://update.greasyfork.org/scripts/524687/Lofter%28%E4%B9%90%E4%B9%8E%29%E5%8E%9F%E5%9B%BE%E4%B8%8B%E8%BD%BD%20%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/524687/Lofter%28%E4%B9%90%E4%B9%8E%29%E5%8E%9F%E5%9B%BE%E4%B8%8B%E8%BD%BD%20%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /** 注入样式 */
  const injectStyle = () => {
    if (!document.getElementById("spidercss")) {
      const style = document.createElement("style");
      style.id = "spidercss";
      style.textContent = `
        #spiderboprt {
          position: fixed;
          top: 7px;
          right: 15px;
          margin: 0 5px 0 0;
          z-index: 100;
        }
        #spiderboprt a,
        #spiderboprt em {
          height: 23px;
          line-height: 23px;
          float: left;
          background: url(//l.bst.126.net/rsc/img/control/operatenew24.png?005) no-repeat;
        }
        #spiderboprt a {
          padding: 0 2px 0 0;
          cursor: pointer;
          text-decoration: none;
          background-position: right 0;
        }
        #spiderboprt a:hover em,
        #spiderboprt em {
          color: #fff;
          padding: 0 5px 0 26px;
          white-space: nowrap;
          font-weight: 400;
          font-style: normal;
        }
        #spiderboprt em {
          background-position: 0 -750px;
          font-size: 12px;
        }
        #spiderboprt a:hover {
          background-position: right -870px;
        }
        #spiderboprt a:hover em {
          background-position: 0 -780px;
        }
      `;
      document.head.appendChild(style);
    }
  };

  /** 创建下载按钮 */
  const createButton = () => {
    if (!document.getElementById("spiderboprt")) {
      const scope = document.getElementById("control_frame");
      if (scope) {
        scope.style.right = "77px";
        const btn = document.createElement("div");
        btn.id = "spiderboprt";
        btn.innerHTML = `<a><em>下载</em></a>`;
        scope.parentNode.insertBefore(btn, scope.nextSibling);
      }
    }
  };

  /** 获取所有图片和视频 */
  const getAllMediaUrls = () => {
    const imgs = [...document.getElementsByClassName("imgclasstag")]
      .map((img) =>
        img.getAttribute("bigimgsrc")?.match(/(.*?)\.(jpg|png|jpeg|gif)/i)?.[0]
      )
      .filter(Boolean);

    const videos = [...document.getElementsByTagName("video")].map((v) => v.src);

    return [...imgs, ...videos];
  };

  /** 获取 URL 后缀名 */
  const getFileExtension = (url) => {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.match(/\.([a-zA-Z0-9]+)$/)?.[1] ?? "";
  };

  /** 保存文件（通过 a 标签） */
  const saveFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // 在短延迟后释放，确保下载触发
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  /** 使用 GM_xmlhttpRequest 下载并返回 blob/arraybuffer */
  const fetchResource = (url, responseType = "blob") =>
    new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType,
          headers: {
            // 部分站点需要 referer，保留当前页面引用
            referer: location.href,
          },
          onload: (xhr) => {
            resolve(xhr.response);
          },
          onerror: (err) => reject(err),
          ontimeout: (err) => reject(err),
        });
      } catch (e) {
        reject(e);
      }
    });

  /** 下载逻辑（使用 fflate 打包替代 JSZip） */
  const downloadMedia = async (urls) => {
    if (!urls.length) return;

    const username =
      location.href.match(/https:\/\/(.+?)\.lofter\.com/)?.[1] ?? "user";
    const postId = location.href.match(/post\/(.+)/)?.[1] ?? "post";
    const safeTitle = document.title.replace(/[\\/:*?"<>|]/g, "_"); // 避免非法文件名

    if (urls.length > 2) {
      // 多图打包（使用 fflate）
      try {
        const files = {}; // { filename: Uint8Array }

        await Promise.all(
          urls.map(async (url, index) => {
            const fileExt = getFileExtension(url) || "bin";
            // 请求 arraybuffer
            const dataBuffer = await fetchResource(url, "arraybuffer");
            // 在 GM_xmlhttpRequest 下，responseType=arraybuffer 返回的是 ArrayBuffer
            const uint8 = new Uint8Array(dataBuffer);
            const entryName = `${username} - ${safeTitle} - ${postId}_${index + 1}.${fileExt}`;
            files[entryName] = uint8;
          })
        );

        // fflate.zipSync 接受 { name: Uint8Array } 并返回 Uint8Array（zip 内容）
        const zipped = fflate.zipSync(files, { level: 6 });
        const blob = new Blob([zipped], { type: "application/zip" });
        saveFile(blob, `${username} - ${postId}.zip`);
      } catch (e) {
        console.error("打包/下载失败:", e);
        alert("打包或下载失败，详见控制台（可能是跨域或请求被拒）。");
      }
    } else {
      // 单/双图直接保存
      for (let i = 0; i < urls.length; i++) {
        try {
          const url = urls[i];
          const fileExt = getFileExtension(url) || "bin";
          const filename =
            urls.length === 1
              ? `${username} - ${safeTitle} - ${postId}.${fileExt}`
              : `${username} - ${safeTitle} - ${postId}_${i + 1}.${fileExt}`;
          const blob = await fetchResource(url, "blob");
          saveFile(blob, filename);
        } catch (e) {
          console.error("单文件下载失败:", e);
        }
      }
    }
  };

  /** 按钮绑定事件 */
  const bindClickHandler = () => {
    const btn = document.getElementById("spiderboprt");
    if (btn) {
      btn.onclick = async () => {
        const urls = getAllMediaUrls();
        if (!urls.length) {
          alert("未找到可下载的图片或视频。");
          return;
        }
        await downloadMedia(urls);
      };
    }
  };

  /** 初始化 */
  const init = () => {
    injectStyle();
    createButton();
    bindClickHandler();
  };

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();