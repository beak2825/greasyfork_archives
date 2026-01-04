// ==UserScript==
// @name         qBittorrent-wiki-plugins-packager
// @name:zh-CN  一键下载qBittorrent插件文件
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Package and download qBittorrent unoffical public plugins's .py files on qBittorrent plugin wiki page.
// @description:zh-CN 自动下载qbittorrent公用插件py文件并保存到压缩包中
// @author       ValueGreasyFork
// @homepage     https://github.com/ValueXu/qBittorrent-wiki-plugins-packager/
// @homepageURL  https://github.com/ValueXu/qBittorrent-wiki-plugins-packager/
// @supportURL   https://github.com/ValueXu/qBittorrent-wiki-plugins-packager/issues
// @match        https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins
// @icon         http://github.com/favicon.icoa
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484217/qBittorrent-wiki-plugins-packager.user.js
// @updateURL https://update.greasyfork.org/scripts/484217/qBittorrent-wiki-plugins-packager.meta.js
// ==/UserScript==

// must add this requirement for jszip 3.10.x. For the reason, see the issuses below
// https://github.com/Stuk/jszip/issues/909
// https://github.com/Tampermonkey/tampermonkey/issues/1600
// //@require      data:application/javascript,window.setImmediate%20%3D%20window.setImmediate%20%7C%7C%20((f%2C%20...args)%20%3D%3E%20window.setTimeout(()%20%3D%3E%20f(args)%2C%200))%3B

(function () {
  "use strict";

  /**
   * @description get urls from page element
   * @returns {string[]}
   */
  const getUrlsFromEl = () => {
    // get unoffical public plugin table element
    const tableEl = document.querySelector(
      "#wiki-body > div.markdown-body > table:nth-child(7) > tbody"
    );
    if (!tableEl) {
      return;
    }
    // get tr elements
    const trEls = tableEl.getElementsByTagName("tr");
    const pluginUrls = [];
    // start from second row
    for (let i = 1; i < trEls.length; i++) {
      const cTrEl = trEls.item(i);
      if (!cTrEl) {
        continue;
      }
      // get url from fifth row cell
      const tdEl = cTrEl.cells.item(4);
      if (!tdEl) {
        continue;
      }
      const aEl = tdEl.querySelector("a");
      if (!aEl) {
        continue;
      }
      if (!aEl.href) {
        continue;
      }
      pluginUrls.push("" + aEl.href);
    }
    return pluginUrls;
  };

  /**
   *
   * @param {string} url
   * @returns {string}   fileName
   */
  const getFileNameFromUrl = (url) => {
    if (typeof url !== "string") {
      return null;
    }
    const startIndex = url.lastIndexOf("/") + 1;
    return url.substring(startIndex);
  };

  /**
   * @typedef {{blob:Blob;name:string;url?:string}} FileObj
   */

  /**
   *
   * @param {string|URL} url
   * @returns {Promise<FileObj>}
   */
  const downloadFile = (url) => {
    return new Promise((resolve, reject) => {
      const _url =
        typeof url === "string"
          ? url
          : url instanceof URL
          ? url.toString()
          : null;
      if (!url) {
        reject("invalid url");
      }

      /**
       * @typedef {{ readyState:number; status:number; statusText:string; responseText:string; responseHeaders:string; responseXML?:Document; response:string|Blob|ArrayBuffer|Document|Object|null; finalUrl:string; context:any; }} ResponseObject
       */

      /**
       * @description on request load
       * @param {ResponseObject} res
       */
      const onLoad = (res) => {
        if (res.status < 200 || res.status >= 300) {
          reject(`response status is ${res.status}`);
        }
        const encoder = new TextEncoder();
        const ui8Arr = encoder.encode(res.responseText);
        const blob = new Blob([ui8Arr], { type: "text/plain" });
        const fileName = getFileNameFromUrl(_url);
        resolve({
          blob,
          url: _url,
          name: fileName,
        });
      };
      /**
       * @description on request error
       * @param {ResponseObject} res
       */
      const onErr = (res) => {
        reject(`download file error, status is ${res.status}`);
      };
      GM_xmlhttpRequest({
        url,
        method: "GET",
        headers: {
          accept: "text/html,text/plain",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
        onload: onLoad,
        onerror: onErr,
      });
    });
  };

  /**
   *
   * @param {FileObj[]} files
   * @returns {FileObj|null}
   */
  const packageFiles = async (files) => {
    const { JSZip } = window;
    if (!JSZip) {
      GM_notification({
        text: "第三方库未初始化，请更新脚本或检查网络\nexternal lib not inited, please update the script or check the internet connection.",
        title: "Error",
        timeout: 2000,
      });
      return null;
    }
    if (!files) {
      return null;
    }
    const jsZip = new JSZip();
    files.forEach((file) => {
      jsZip.file(file.name, file.blob);
    });

    /** @type {Uint8Array} */
    const ui8Arr = await jsZip.generateAsync({
      type: "uint8array",
      compression: "STORE",
    });
    const blob = new Blob([ui8Arr], { type: "application/zip" });
    return {
      blob,
      name: "qBittorrent_plugins.zip",
    };
  };

  /**
   * downfile fileobj via tampermonkey
   * @param {FileObj} fileObj
   * @returns {Promise<undefined>}
   */
  const downloadFileObj = (fileObj) => {
    const url = URL.createObjectURL(fileObj.blob);
    return new Promise((resolve, reject) => {
      const onFinish = () => {
        URL.revokeObjectURL(url);
      };
      /**
       *
       * @param {string} error
       * @param {string} details
       */
      const onErr = (error, details) => {
        onFinish();
        reject(error);
      };
      const onLoad = () => {
        onFinish();
        resolve();
      };
      const onTimeout = () => {
        const errMsg = "download timeout";
        onFinish();
        reject(errMsg);
      };
      GM_download({
        url,
        name: fileObj.name,
        saveAs: true,
        onerror: onErr,
        onload: onLoad,
        ontimeout: onTimeout,
      });
    });
  };

  const onClick = async () => {
    const urls = getUrlsFromEl();
    GM_notification({
      text: `找到${urls ? urls.length : 0}个脚本，开始下载\nfound ${
        urls ? urls.length : 0
      } scripts, start to download.`,
      title: "Info",
      timeout: 1500,
    });
    const res = await Promise.allSettled(urls.map((url) => downloadFile(url)));
    /** @type {PromiseFulfilledResult<FileObj>[]} */
    const successRes = [];
    /** @type {PromiseRejectedResult<FileObj>[]} */
    const failedRes = [];
    res.forEach((value) => {
      if (value.status === "fulfilled") {
        successRes.push(value);
      } else {
        failedRes.push(value);
      }
    });
    if (failedRes.length) {
      console.error(`download file error: `, failedRes);
    }
    GM_notification({
      title: "Info",
      text: `成功${successRes.length}个，失败${failedRes.length}个，打包中\n${successRes.length} success, ${failedRes.length} failed, packaging`,
      timeout: 1000,
      silent: true,
    });
    const zipFile = await packageFiles(successRes.map((res) => res.value));
    GM_notification({
      text: `打包成功，请选择保存位置\nPackage success, please choose the floder to save`,
      title: "Info",
      timeout: 1500,
    });
    await downloadFileObj(zipFile);
  };

  const onWindowLoaded = () => {
    const button = document.createElement("button");
    button.style.display = "flex";
    button.style.justifyContent = "center";
    button.style.alignItems = "center";

    button.style.position = "fixed";
    button.style.zIndex = "999";
    button.style.bottom = "1rem";
    button.style.right = "1.5rem";

    button.style.height = "";
    button.style.width = "";
    button.style.minHeight = "64px";

    button.style.border = "2px solid transparent";
    button.style.boxShadow = String.raw`0 1px 3px #0000001a, 0 1px 2px #0000000f`;

    button.style.fontFamily = String.raw`-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`;
    button.style.fontSize = "1.6rem";
    button.style.textAlign = "center";

    const svgHtml = String.raw`<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>`;
    button.innerHTML = svgHtml;
    button.addEventListener("click", onClick);
    document.body.appendChild(button);
  };
  window.addEventListener("load", onWindowLoaded);
})();
