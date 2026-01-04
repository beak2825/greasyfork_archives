// ==UserScript==
// @name         批量下载套图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量下载套图，直接打包进压缩包
// @author       You
// @match        https://www.mhnew.xyz/play?*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437945/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%A5%97%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437945/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%A5%97%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 工具函数

  // 数字前面填充0，使其达到n位
  const padStartZero = (n) => (num) => {
    if (typeof num === 'number') {
      num += '';
    }
    return num.padStart(n, '0');
  };

  // 请求二进制文件
  function requestUrlBlob(url) {
    return fetch(url).then((res) => res.blob());
  }

  const padStartZeroTo5 = padStartZero(5);

  // 限制并发下载，https://github.com/rxaviers/async-pool/blob/master/lib/es7.js
  async function asyncPool(poolLimit, array, iteratorFn) {
    const ret = [];
    const executing = [];
    for (const item of array) {
      const p = Promise.resolve().then(() => iteratorFn(item, array));
      ret.push(p);

      if (poolLimit <= array.length) {
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
    }
    return Promise.all(ret);
  }

  // 页面逻辑
  // 获取图片地址列表
  function getImageUrlList() {
    var $list = document.getElementById('imgList');
    var imgList = Array.from($list.children).filter((node) => node.nodeName === 'IMG');
    var urlList = imgList.map((node) => {
      const src = node.getAttribute('src');
      if (/\/.+\/.+\/.+/.test(src)) {
        // 说明被替换过了
        return src;
      }
      // 还没加载，获取其真实地址
      return node.getAttribute('data-original');
    });

    return urlList;
  }

  // 下载并打包
  async function downloadAndPackFile(zipPack, url, filename, extname) {
    if (!extname) {
      const urlExt = url.split('.').pop();
      extname = urlExt ? `.${urlExt}` : '';
    }

    console.log(`正在下载`, filename);

    await requestUrlBlob(url).then((blob) => {
      console.log(`下载完成`, filename);
      zipPack.file(`${filename}${extname}`, blob);
    });
  }

  async function startDownload() {
    const zipPack = new window.JSZip();
    const zipName = document.querySelector('h3').innerText;

    const urlObjList = getImageUrlList()
      .filter((url) => url[0] === '/')
      .map((url, idx) => ({
        url,
        filename: padStartZeroTo5(idx),
      }));

    console.log('开始下载');
    await asyncPool(5, urlObjList, ({ url, filename }) =>
      downloadAndPackFile(zipPack, url, filename)
    );

    await zipPack.generateAsync({ type: 'blob' }).then(
      function (blob) {
        // 1) generate the zip file
        window.saveAs(blob, `${zipName}.zip`); // 2) trigger the download
      },
      function (err) {
        console.error('[批量下载] ERR', err);
      }
    );

    console.log('下载完成');
  }

  // 页面加个 button
  function initUI() {
    const btn = document.createElement('button');
    btn.style.position = 'fixed';
    btn.style.right = 0;
    btn.style.top = 0;
    btn.innerText = '批量下载';

    btn.addEventListener('click', () => {
      startDownload();
    });

    document.body.appendChild(btn);
  }

  initUI();
})();
