// ==UserScript==
// @name         「漫画」打包下载
// @namespace    https://www.wdssmq.com/
// @version      1.0.5
// @author       沉冰浮水
// @description  按章节打包下载漫画柜的资源，自用为主
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.com/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @run-at       document-end
// @match        https://www.manhuagui.com/comic/*/*.html
// @match        https://tw.manhuagui.com/comic/*/*.html
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/comlink@4.3.0/dist/umd/comlink.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/416523/%E3%80%8C%E6%BC%AB%E7%94%BB%E3%80%8D%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/416523/%E3%80%8C%E6%BC%AB%E7%94%BB%E3%80%8D%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

(function () {
  'use strict';

  const gm_name = "comic";

  const _sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // -------------------------------------

  const _log = (...args) => console.log(`[${gm_name}]\n`, ...args);

  // -------------------------------------

  // const $ = window.$ || unsafeWindow.$;
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }

  // -------------------------------------

  // 添加内容到指定元素后面
  function fnAfter($ne, e) {
    const $e = typeof e === "string" ? $n(e) : e;
    $e.parentNode.insertBefore($ne, $e.nextSibling);
  }

  // localStorage 封装
  const lsObj = {
    setItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem(key, def = "") {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return def;
    },
  };

  // 初始化 gobInfo
  const gobInfo = {
    // key: [默认值, 是否记录至 ls]
    curImgUrl: ["", 0],
    curInfo: [{}, 0],
    autoNextC: [0, 1],
    autoNextChap: [0, 1],
    wgetImgs: [[], 1],
    maxWget: [7, 0],
  };

  // 数据读写封装
  const gob = {
    _lsKey: `${gm_name}_data`,
    _bolLoaded: false,
    data: {},
    // 初始
    init() {
      // 根据 gobInfo 设置 gob 属性
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          this.data[key] = item[0];
          Object.defineProperty(this, key, {
            // value: item[0],
            // writable: true,
            get() { return this.data[key] },
            set(value) { this.data[key] = value; },
          });
        }
      }
      return this;
    },
    // 读取
    load() {
      if (this._bolLoaded) {
        return;
      }
      const lsData = lsObj.getItem(this._lsKey, this.data);
      _log("[log]gob.load()\n", lsData);
      for (const key in lsData) {
        if (Object.hasOwnProperty.call(lsData, key)) {
          const item = lsData[key];
          this.data[key] = item;
        }
      }
      this._bolLoaded = true;
    },
    // 保存
    save() {
      const lsData = {};
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          if (item[1]) {
            lsData[key] = this.data[key];
          }
        }
      }
      _log("[log]gob.save()\n", lsData);
      lsObj.setItem(this._lsKey, lsData);
    },
  };

  // 初始化
  gob.init().load();

  /* global Comlink, saveAs */


  // -----------------------

  // 当前项目的各种函数
  function fnGenUrl() {
    // 用于下载图片
    const imgUrl = $n(".mangaFile").getAttribute("src");
    if (gob.curImgUrl !== imgUrl) {
      _log("[log]fnGenUrl()\n", imgUrl);
      gob.curImgUrl = imgUrl;
    }
    // return encodeURI(imgUrl);
    return gob.curImgUrl;
  }

  function fnGenInfo() {
    const name = $n(".title h1 a").innerHTML; // 漫画名
    const chapter = $n(".title h2").innerHTML; // 章节
    const pages = $na("option").length; // 总页数
    return { name, chapter, pages };
  }

  // 自动下载下一章
  function fnAutoNextChap() {
    const $nextBtn = $n("#pb .pb-ok");
    if ($nextBtn) {
      $n("#pb .pb-ft").style.display = "flex";
      // 居中 + 垂直居中
      $n("#pb .pb-ft").style.justifyContent = "center";
      $n("#pb .pb-ft").style.alignItems = "center";
      // alert(gob.autoNextChap);
      // 追加一个按钮，用于设置 gob.autoNextChap
      if (!$n("#gm-btn-autoNextChap")) {
        const $btn = "<a id='gm-btn-autoNextChap' class='pb-btn' style='background:#0077D1;color: #fff;'>自动下载下一章</a>";
        $nextBtn.insertAdjacentHTML("afterend", $btn);
        $n("#gm-btn-autoNextChap").addEventListener("click", () => {
          gob.autoNextChap = 1;
          gob.save();
          $nextBtn.click();
        });
      }
    }
  }

  // 网络请求
  function fnGet(url, responseType = "json", retry = 2) {
    return new Promise((resolve, reject) => {
      try {
        // console.log(navigator.userAgent);
        GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: {
            "User-Agent": navigator.userAgent, // If not specified, navigator.userAgent will be used.
            "referer": "https://www.manhuagui.com/",
          },
          responseType,
          onerror: (e) => {
            if (retry === 0) {
              reject(e);
            }
            else {
              console.warn("Network error, retry.");
              setTimeout(() => {
                resolve(fnGet(url, responseType, retry - 1));
              }, 1000);
            }
          },
          onload: ({ status, response }) => {
            if (status === 200) {
              resolve(response);
            }
            else if (retry === 0) {
              reject(new Error(`${status} ${url}`));
            }
            else {
              console.warn(status, url);
              setTimeout(() => {
                resolve(fnGet(url, responseType, retry - 1));
              }, 500);
            }
          },
        });
      }
      catch (error) {
        reject(error);
      }
    });
  }

  const JSZip = (() => {
    const blob = new Blob(
      [
        "importScripts(\"https://cdn.jsdelivr.net/npm/comlink@4.3.0/dist/umd/comlink.min.js\",\"https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js\");class JSZipWorker{constructor(){this.zip=new JSZip}file(name,{data:data}){this.zip.file(name,data)}generateAsync(options,onUpdate){return this.zip.generateAsync(options,onUpdate).then(data=>Comlink.transfer({data:data},[data]))}}Comlink.expose(JSZipWorker);",
      ],
      { type: "text/javascript" },
    );
    const worker = new Worker(URL.createObjectURL(blob));
    return Comlink.wrap(worker);
  })();

  function getCompressionOptions(level = 4) {
    if (level === 0)
      return {};
    return {
      compression: "DEFLATE",
      compressionOptions: { level },
    };
  }

  // 处理章节名，仅提取 `第xxx话` 的部分，并补全前导 0
  function fnGetChapName(chapName, len = 3) {
    const reg = /第(\d+)(?:话|回)/;
    const match = chapName.match(reg);
    if (match) {
      const num = match[1];
      return `第${String(num).padStart(len, 0)}话`;
    }
    return chapName;
  }

  async function fnDownload($btn = null) {
    const info = fnGenInfo();
    info.chapter = fnGetChapName(info.chapter);
    const cfName = `${info.name}_${info.chapter}`;
    info.done = 0;
    info.error = 0;
    info.bad = {};
    _log("[log]fnDownload()\n", info);
    // zip
    const zip = await new JSZip();
    //
    const btnDownloadProgress = (curPage = 0) => {
      if ($btn) {
        $btn.innerHTML = `正在下载：${curPage} /${info.pages}`;
      }
    };
    const btnCompressingProgress = (percent = 0) => {
      if ($btn) {
        $btn.innerHTML = percent === 100 ? "已完成√" : `正在压缩：${percent}`;
      }
    };
    // 下载并添加到 zip
    // page 从 1 开始
    const fileNameLen = (len => len > 2 ? len : 2)(info.pages.toString().length);
    const dlPromise = async (url, page, _threadID = 0) => {
      const fileName = ((i) => {
        return `${String(i).padStart(fileNameLen, 0)}.jpg`;
      })(page);
      try {
        const data = await fnGet(url, "arraybuffer");
        await zip.file(fileName, Comlink.transfer({ data }, [data]));
        info.done++;
      }
      catch (e) {
        _log("[error]dlPromise()\n", e);
        await zip.file(`${fileName}.bad.txt`, "");
        info.bad[page] = `${url}`;
        info.error++;
      }
    };
    for (let page = 0; page < info.pages; page++) {
      const url = fnGenUrl();
      btnDownloadProgress(page + 1);
      await dlPromise(url, page + 1);
      await _sleep(137);
      if (info.error) {
        alert("下载失败");
        break;
      }
      $n("#next").click();
      await _sleep(137);
      fnAutoNextChap();
    }
    // await multiThread(urls, dlPromise);
    return async () => {
      // info.compressing = true;
      // let lastZipFile = "";
      const { data } = await zip.generateAsync(
        { type: "arraybuffer", ...getCompressionOptions() },
        Comlink.proxy(({ percent, _currentFile }) => {
          // if (lastZipFile !== _currentFile && _currentFile) {
          //   lastZipFile = _currentFile;
          //   console.log(`Compressing ${percent.toFixed(2)}%`, _currentFile);
          // }
          btnCompressingProgress(percent.toFixed(2));
          info.compressingPercent = percent;
        }),
      );
      console.log(info);
      // console.log("Done");
      return {
        name: `${cfName}.zip`,
        data: new Blob([data]),
        error: info.error,
      };
    };
  }

  // 单图查看
  function setCurImgLink() {
    if ($n("#curimg")) {
      $n("#curimg").href = fnGenUrl();
      return;
    }
    const $imgLink = document.createElement("a");
    $imgLink.id = "curimg";
    $imgLink.innerHTML = "查看单图";
    $imgLink.className = "btn-red";
    $imgLink.href = fnGenUrl();
    $imgLink.target = "_blank";
    $imgLink.style.background = "#0077D1";
    $imgLink.style.cursor = "pointer";
    $n(".main-btn").insertBefore($imgLink, $n("#viewList"));
  }
  setCurImgLink();

  // 下载按钮
  function setBtnDownload() {
    const $btn = document.createElement("a");
    $btn.id = "gm-btn-download";
    $btn.className = "btn-red";
    $btn.innerHTML = "开始下载";
    $n(".main-btn").appendChild($btn);
    $btn.style.background = "#0077D1";
    $btn.style.cursor = "pointer";
    $btn.addEventListener("click", async () => {
      const curPage = Number.parseInt($n("#page").innerHTML);
      if (curPage > 1) {
        alert("请从第一页开始下载");
        return false;
      }
      const fnDL = await fnDownload($btn);
      const { data, name, error } = await fnDL();
      if (!error) {
        saveAs(data, name);
      }
    });
    if (gob.autoNextChap) {
      gob.autoNextChap = 0;
      gob.save();
      $btn.click();
    }
  }
  setBtnDownload();

  window.addEventListener("hashchange", () => {
    setCurImgLink();
  });

  gob.curImgUrl = fnGenUrl();
  gob.curInfo = fnGenInfo();
  // gob.wgetImgs = [];

  // _log("[TEST]gob.data", gob.data);

  // const fnGenBash = () => {
  //   let bash = "";
  //   const wgetImgs = gob.wgetImgs;
  //   wgetImgs.forEach((img) => {
  //     bash += `wget "${img.url}" "${img.name}-${img.chapter}.jpg"\n`;
  //   });
  //   return bash;
  // };

  async function fnDLImg(pageInfo) {
    // const data = await fnGet(pageInfo.url, "arraybuffer");
    // const data = await fnGet(pageInfo.url, "blob");
    fnGet(pageInfo.url, "arraybuffer").then(
      (res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const a = document.createElement("a");
        a.setAttribute("download", `${pageInfo.chapter}.jpg`);
        a.href = url;
        a.click();
      },
    );
  }

  function fnCheckFistPage(cur, list) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.name === cur.name && item.chapter === cur.chapter) {
        return true;
      }
    }
    return false;
  }

  function fnGenFistPage(auto = false) {
    // _log("[log]fnGenFistPage()", auto);
    // 当前页面信息
    const curPage = {
      url: gob.curImgUrl,
      name: gob.curInfo.name,
      chapter: gob.curInfo.chapter,
    };
    // 已收集的首图
    const wgetImgs = gob.wgetImgs;
    // 检查当前页面是否已收集，并写入变量
    const bolHasWget = fnCheckFistPage(curPage, wgetImgs);
    _log("[log]fnGenFistPage\n", wgetImgs, "\n", curPage, "\n", bolHasWget);
    // 重复收集或收集数量达到上限，停止自动收集
    if (bolHasWget || wgetImgs.length >= gob.maxWget) {
      gob.autoNextC = 0;
      // gob.save();
      // return;
    }
    else {
      gob.autoNextC = auto ? 1 : 0;
    }
    // 自动下载，并加入已收集列表
    if (!bolHasWget) {
      fnDLImg(curPage);
      wgetImgs.push(curPage);
      gob.wgetImgs = wgetImgs;
      // gob.save();
    }
    // 询问是否重复下载
    if (bolHasWget && confirm("已收集过该首图，是否重复下载？")) {
      fnDLImg(curPage);
    }
    _log("[log]fnGenFistPage\n", gob.wgetImgs, "\n", gob.autoNextC);
    if (gob.autoNextC && $n(".nextC")) {
      setTimeout(() => {
        $n(".nextC").click();
      }, 3000);
    }
    gob.save();
  }

  function fnBtn() {
    const btn = document.createElement("span");
    if (gob.wgetImgs.length >= gob.maxWget || gob.wgetImgs.length === 0) {
      btn.innerHTML = "收集首图";
    }
    else {
      btn.innerHTML = `收集首图(${gob.wgetImgs.length + 1} / ${gob.maxWget})`;
    }
    btn.style = "color: #f00; font-size: 12px; cursor: pointer; font-weight: bold; text-decoration: underline; padding-left: 1em;";
    btn.onclick = () => {
      if (gob.wgetImgs.length >= gob.maxWget) {
        gob.wgetImgs = [];
      }
      fnGenFistPage(true);
    };
    fnAfter(btn, $n("#lighter"));
  }

  fnBtn();

  if (gob.autoNextC) {
    fnGenFistPage(true);
  }

})();
