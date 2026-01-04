// ==UserScript==
// @name         ComicAggDownloader
// @namespace    https://github.com/ans/comic-agg-downloader
// @version      0.4
// @license      GPL-3.0
// @author       Ans
// @description  Comic Manga downloader that aggregates multiple websites
// @icon         https://komiflo.com/assets/img/favicon.ico
// @homepageURL  https://github.com/ans/comic-agg-downloader
// @supportURL   https://github.com/ans/comic-agg-downloader
// @match        https://komiflo.com/comics/*/read/*
// @match        https://komiflo.com/#!/comics/*/read/*
// @match        https://book.dmm.com/*
// @match        https://book.dmm.co.jp/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/loglevel@1.9.2/dist/loglevel.min.js
// @require      https://unpkg.com/loglevel-plugin-prefix@0.8.4/dist/loglevel-plugin-prefix.min.js
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451811/1096709/PublusConfigDecoder.js
// @require      https://update.greasyfork.org/scripts/451812/1096723/PublusCoordsGenerator.js
// @require      https://update.greasyfork.org/scripts/451813/1128858/PublusNovelPage.js
// @require      https://update.greasyfork.org/scripts/451814/1159347/PublusPage.js
// @require      https://update.greasyfork.org/scripts/456423/1128886/SpeedReaderTools.js
// @downloadURL https://update.greasyfork.org/scripts/515171/ComicAggDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/515171/ComicAggDownloader.meta.js
// ==/UserScript==

(async function(log, axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusCoordsGenerator, PublusNovelPage, PublusPage, SpeedReaderTools) {
  'use strict';

  // 页面会 hack 掉部分对象的方法，以阻上脚本使用这些方法，这里通过代理的方式阻止页面修改这些对象
  // 一定要放在最前面执行
  proxyHackObj();

  // map from host to script
  const scriptDict = {
    'komiflo.com': 'https://update.greasyfork.org/scripts/513665/KomifloDownloader.js',
    'book.dmm.com': 'https://update.greasyfork.org/scripts/451867/dmmdownloader.js',
    'book.dmm.co.jp': 'https://update.greasyfork.org/scripts/451867/dmmdownloader.js',
  };

  const scriptData = scriptDict[window.location.host];
  if(scriptData) {
    // get and run the script
    GM_xmlhttpRequest({
      method: 'GET',
      url: scriptData,
      onload: res => eval(res.response)
    });
  }

  function proxyHackObj() {
    // 定义需要阻止被hack的对象的数组
    const preventObjs = [
      window.HTMLDocument.prototype,
      window.HTMLCanvasElement.prototype,
      window.CanvasRenderingContext2D.prototype,
      window.HTMLIFrameElement.prototype,
      window.URL,
    ];

    // 保存原始 Object.defineProperties 方法
    const originalDefineProperties = Object.defineProperties;
    // 使用 Proxy 创建代理，以阻止这些对象的属性被重新定义或修改
    Object.defineProperties = new Proxy(originalDefineProperties, {
      apply(target, thisArg, args) {
        const [ obj ] = args;
        // 检查传入的对象是否为要阻止的对象
        if(preventObjs.includes(obj)) {
          // 如果是，则返回对象本身（不进行重新定义或修改）
          return obj;
        } else {
          // 否则，调用原始的 Object.defineProperties 方法进行重新定义或修改
          return Reflect.apply(target, thisArg, args);
        }
      }
    });

    // 保存原始 Object.freeze 方法
    const originalFreeze = Object.freeze;
    // 使用 Proxy 创建代理，以阻止这些对象被冻结
    Object.freeze = new Proxy(originalFreeze, {
      apply(target, thisArg, args) {
        const [ obj ] = args;
        // 检查传入的对象是否为要阻止的对象
        if(preventObjs.includes(obj)) {
          // 如果是，则返回对象本身（不进行冻结）
          return obj;
        } else {
          // 否则，调用原始的 Object.freeze 方法进行冻结
          return Reflect.apply(target, thisArg, args);
        }
      }
    });
  }

})(log, axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusCoordsGenerator, PublusNovelPage, PublusPage, SpeedReaderTools);
