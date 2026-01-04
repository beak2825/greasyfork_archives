// ==UserScript==
// @name         bookwalker图源下载
// @namespace    summer-script
// @version      0.7
// @description  bookwalker图源自动下载
// @author       summer
// @match        https://viewer.bookwalker.jp/*
// @match        https://viewer-trial.bookwalker.jp/*
// @match        https://pcreader.bookwalker.com.tw/*
// @match        https://preview.bookwalker.com.tw/*
// @icon         https://bookwalker.jp/favicon.ico
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      bookwalker.jp
// @connect      bookwalker.com.tw
// @downloadURL https://update.greasyfork.org/scripts/500575/bookwalker%E5%9B%BE%E6%BA%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/500575/bookwalker%E5%9B%BE%E6%BA%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var tip = {
    initializing:  '初始化中',
    notSupport:    '发生错误, 当前作品不支持或脚本已失效',
    downloadBtn:   '下载图源',
    downloadBtnPack: '打包下载',
    downloadBtnPart: '起始页码',
    downloadPreparing: '下载准备开始...',
    downloadTip01: '下载期间请勿操作阅读器(包括键盘和鼠标',
    downloadTip02: '下载期间可以切换到其他标签页',
    downloadTipPack01: '将进行打包下载, 压缩包将在全部下载完成时生成',
    downloadTipPack02: '打包功能可能在较旧的浏览器中无法运作',
    downloadTipPart: '从第 {1} 页开始下载',
    downloadRetry: '图源获取失败, 正在重试...',
    downloadNetRetry: '网络故障, 正在重试...',
    downloading: '正在下载',
    downloadFinish: '下载完毕',
    downloadPacking: '正在生成压缩包...',
    downloadPackFailed: '无法下载压缩包',
    downloadProgress: '正在下载: {1} / {2}',
    packFailed: '打包失败',
    fatalError: '脚本运行错误, 请关掉页面稍后再试',
    invalidPageNumber: '输入的页数无效',
    warnMultiPage: '检测到暂不支持的数据',
  };
  var config = {
    packFileName: 'configuration_pack.json',
    lsKeyBrowserId: 'NFBR.Global/BrowserId',
    urlAuthInfo: '/browserWebApi/c',
    urlAuthInfoTrial: '/trial-page/c',
    urlGetLoader: '/browserWebApi/03/getLoader',
    hostTrial: ['viewer-trial.bookwalker.jp', 'preview.bookwalker.com.tw'],
    fontSize: 'normal_default',
    waitStartMs: 5000,
    waitNextImgMs: 2000,
    waitRetryMs: 4000,
    downloadPackage: false,
    downloadPageFrom: 1,
    downloadPageTo: -1,
  };
  var downloadStatus = {
    now: 0,
    sum: 0,
  };
  var ui = initUI();
  var authInfo = {
    // bs: BOOKMARK_SHARED
    // cti: CONTENT_TITLE
    // cty: CONTENT_TYPE
    // lin: LOOK_INSIDE
    // lp:
    // lpd: last page info
    // ms: MARKER_SHARED
  };
  var imageList = [];
  var packFiles = [];
  var downloadZip = downloadZipInit();
  var Y4jNum = null;

  if (! checkSupport()) {
    ui.updateBtnText(tip.notSupport);
    return;
  }

  initNFBR();

  waitStart(config.waitStartMs)
    .then(getLoader)
    .then(getAuthInfo)
    .then(getConfigPack)
    .then(decryptConfigPack)
    .then(parseImage)
    .then(downloadImageList)
    .catch(function (err) {
      console.warn(err);
      ui.updateBtnText(tip.notSupport);
    });

  function checkSupport() {
    var cid = (new URLSearchParams(window.location.search)).get('cid');
    if (! cid) {
      return false;
    }
    if (! localStorage.getItem(config.lsKeyBrowserId)) {
      return false;
    }

    return true;
  }

  function waitStart(ms) {
    return new Promise(function (resolve, reject) {
      function download() {
        config.downloadPackage = GM_getValue('settingsPackDownload', false);
        ui.disableBtn();
        ui.disableSettings();
        ui.showMsgBox();
        ui.updateBtnText(tip.downloadPreparing);
        ui.newMsg(tip.downloadPreparing);
        ui.newMsg(tip.downloadTip01);
        ui.newMsg(tip.downloadTip02);
        if (config.downloadPackage) {
          ui.newMsg(tip.downloadTipPack01);
          ui.newMsg(tip.downloadTipPack02);
        }
        if (config.downloadPageFrom > 1) {
          ui.newMsg(tip.downloadTipPart, config.downloadPageFrom);
        }
        resolve();
      }
      function start() {
        ui.updateBtnText(tip.downloadBtn);
        ui.listenBtn(function () {
          download();
        });
      }
      // TODO check viewer loaded
      setTimeout(start, ms);
    });
  }

  function getLoader() {
    var reqURL = config.urlGetLoader;
    document.head.querySelectorAll("script").forEach((e) => {
      var url = e.getAttribute('src');
      var reg = new RegExp('^/browserWebApi/');
      var match = reg.exec(url);
      if (! match) {
        return;
      }
      reqURL = match.input;
    });

    if (config.hostTrial.includes(window.location.hostname)) {
      config.urlAuthInfo = config.urlAuthInfoTrial;
      return Promise.resolve(null);
    }
    return fetch(reqURL)
      .then(function (resp) {
        return resp.text();
      })
      .then(function (data) {
        var reg = new RegExp('^(\\w+)=function\\(\\).+?;\\}', 'm');
        var match = reg.exec(data);
        // console.log(match);
        return new Promise(function (resolve, reject) {
          if (!match) {
            reject('Error: getLoader match failed');
          } else {
            resolve({code: match[0], name: match[1]});
          }
        });
      })
      .then(function (func) {
        return safeExecuteRemoteCode(func.name, func.code);
      })
      .then(function (num) {
        Y4jNum = num;
        return num;
      });
  }

  function safeExecuteRemoteCode(funcName, code) {
    const timeout = 1000;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("code exec timeout")), timeout);

      try {
        const fn = new Function(
          "args",
          `
          with (args) {  // Object Whitelist
            ${code}
            return ${funcName}();
          }
        `
        );

        const safeArgs = {
          // Math,
          // Date,
          // JSON,
        };

        const result = fn(safeArgs);
        clearTimeout(timer);
        resolve(result);
      } catch (e) {
        clearTimeout(timer);
        reject(e);
      }
    });
  }

  function getAuthInfo() {
    var p = {
      cid: new URLSearchParams(window.location.search).get('cid')
    };
    if (getCookieValue('u1')) {
      p.u1 = getCookieValue('u1');
    }
    if (getCookieValue('u2')) {
      p.u2 = getCookieValue('u2');
    }
    if (localStorage.getItem(config.lsKeyBrowserId)) {
      p.BID = localStorage.getItem(config.lsKeyBrowserId);
    }
    if (Y4jNum) {
      p.cr = Y4jNum;
    }
    // TODO: params [lin, w, h]
    var q = new URLSearchParams(p).toString();
    var url = config.urlAuthInfo + '?' + q;

    return fetch(url)
      .then(function (resp) {
      return resp.json();
    }).then(function (data) {
      authInfo = data;
      return data;
    });
  }

  function getConfigPack() {
    try {
      var url = resURLBuilder(config.packFileName);
    } catch (error) {
      ui.newMsg(`${tip.fatalError}, `
        + `URL: ${authInfo.url}, Path: ${config.packFileName}`);
      return Promise.reject();
    }

    return fetch(url).then(function (resp) {
      return resp.json();
    });
  }

  function decryptConfigPack(conf64) {
    if (! conf64.data) {
      return Promise.resolve({
        config: conf64,
        key1: [],
        key2: [],
        key3: [],
        key1Arr: '',
        key2Arr: '',
        key3Arr: '',
      });
    }
    var confEnc = atob(conf64.data);
    var keyArr = [];
    for (var k = 0; k < 3; k++) {
      keyArr[k] = [];
      for (var i = 0; i < 32; i++) {
        keyArr[k].push(confEnc.charCodeAt(k * 32 + i));
      }
    }
    var confData = confEnc.substring(k * 32);
    var key1 = keyArr[0];
    var key2 = keyArr[1];
    var key3 = keyArr[2];
    var dataArr = new Uint8Array(confData.length);

    for (var d = 0; d < confData.length; d++) {
      dataArr[d] = confData.charCodeAt(d);
    }

    return window.NFBR.decryptConfig(dataArr, key1, key2, key3);
  }

  function parseImage(configData) {
    // console.log(configData);
    configData.config.configuration.contents.forEach(function (item) {
      var keyInfo = {
        key1: configData.key1,
        key2: configData.key2,
        key3: configData.key3,
        key1Arr: configData.key1Arr,
        key2Arr: configData.key2Arr,
        key3Arr: configData.key3Arr,
      };
      var imgInfo = configData.config[item.file];
      imgInfo.FileLinkInfo.PageLinkInfoList.forEach(function (pageInfo) {
        var imgName = item.file;
        pageInfo.Page.imgName = imgName;
        var imgHash = window.NFBR.getImgURLHash(pageInfo.Page, keyInfo, configData.config);
        imgName += '/' + imgHash + '.' + item.type;
        if (1 == item.index) {
          imgName += 'bvCoverImage';
        }
        var widthCut = pageInfo.Page.DummyWidth ? pageInfo.Page.DummyWidth : 0;
        var heightCut = pageInfo.Page.DummyHeight ? pageInfo.Page.DummyHeight : 0;
        imageList.push({
          url: imgName,
          widthCut: widthCut,
          heightCut: heightCut,
          pageInfo: pageInfo,
          keyInfo: keyInfo,
        });
      });
    });

    downloadStatus.sum = imageList.length;
    ui.updateBtnText(tip.downloading);

    // console.log(imageList);
    return Promise.resolve(imageList);
  }

  function downloadImageList(imgList) {
    var imgInfo = imgList.shift();
    if (! imgInfo) {
      ui.updateBtnText(tip.downloadFinish);
      ui.newMsg(tip.downloadFinish);
      downloadPackage();
      return;
    }
    // 跳过前几页
    if (config.downloadPageFrom > 1) {
      config.downloadPageFrom--;
      downloadImageList(imgList);
      return;
    }
    downloadStatus.now = downloadStatus.sum - imageList.length;
    ui.newMsg(
      tip.downloadProgress,
      downloadStatus.now,
      downloadStatus.sum
    );
    var img = new Image();
    img.addEventListener('load', function () {
      var imgWidth  = img.naturalWidth  - imgInfo.widthCut;
      var imgHeight = img.naturalHeight - imgInfo.heightCut;
      var pageInfo = imgInfo.pageInfo;
      var keyInfo = imgInfo.keyInfo;
      var blocks = getImageBlocks(pageInfo, keyInfo, img.naturalWidth, img.naturalHeight);
      var canvas = reOrderImage(img, blocks, imgWidth, imgHeight);
      downloadImage(canvas, config.waitNextImgMs, function () {
        URL.revokeObjectURL(img.src);
        downloadImageList(imgList);
      });
    });
    try {
      var imgSrc = resURLBuilder(imgInfo.url);
    } catch (error) {
      ui.newMsg(`${tip.fatalError}, `
        + `URL: ${authInfo.url}, Path: ${imgInfo.url}`);
      return;
    }
    function retryDownload() {
      // console.log('Parameter expired, retry');
      ui.newMsg(tip.downloadRetry);
      getAuthInfo()
        .then(function () {
          waitRetry(config.waitRetryMs)
            .then(function () {
              imgList.unshift(imgInfo);
              downloadImageList(imgList);
            });
          })
        .catch(function () {
          ui.newMsg(tip.downloadNetRetry);
          waitRetry(config.waitRetryMs)
            .then(function () {
              retryDownload();
            });
        });
    }
    GM_xmlhttpRequest({
        method: 'GET',
        url: imgSrc,
        responseType: 'blob',
        onload: function (resp) {
          if (200 !== resp.status) {
            retryDownload();
            return;
          }
          img.src = URL.createObjectURL(resp.response);
        },
        onerror: retryDownload
    });
  }

  function reOrderImage(img, blocks, imgWidth, imgHeight) {
    var canvas = document.createElement('canvas');
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

    for (var i = 0; i < blocks.length; i++) {
        ctx.drawImage(img,
          blocks[i].destX, blocks[i].destY, blocks[i].width, blocks[i].height,
          blocks[i].srcX, blocks[i].srcY, blocks[i].width, blocks[i].height
        );
    }

    return canvas;
  }

  function downloadImage(canvas, delay, cb) {
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';

    var pageNo = downloadStatus.now.toString();
    pageNo = pageNo.padStart(downloadStatus.sum.toString().length, '0');
    var filename = `${authInfo.cti} - ${pageNo}.png`;

    if (config.downloadPackage) {
      canvas.toBlob(function (blob) {
        addImageToPackage(blob, filename);
        setTimeout(cb, delay);
      });
    } else {
      GM_download({
        name: filename,
        url: canvas.toDataURL(),
        onload: function () {
          setTimeout(cb, delay);
        }
      });
    }
  }

  function addImageToPackage(blob, filename) {
    packFiles.push({
      name: filename,
      input: blob,
      lastModified: new Date()
    });
  }

  function downloadPackage() {
    if (0 === packFiles.length) {
      return;
    }
    ui.newMsg(tip.downloadPacking);
    downloadZip(packFiles).blob().then(function (blob) {
      var filename = `${authInfo.cti}.zip`;
      var blobURL = URL.createObjectURL(blob);
      // GM_download({
      //   name: filename,
      //   url: blobURL,
      //   onload: function () {
      //     packFiles = [];
      //     URL.revokeObjectURL(blobURL);
      //     ui.newMsg(tip.downloadFinish);
      //   },
      //   onerror: function (err) {
      //     ui.newMsg(`${tip.downloadPackFailed}: ${err}`);
      //   }
      // });
      var a = document.createElement("a");
      a.href = blobURL;
      a.download = filename;
      a.click();
      packFiles = [];
      ui.newMsg(tip.downloadFinish);
    }).catch(function (err) {
      ui.newMsg(`${tip.packFailed}: ${err}`);
    });
  }

  function getImageBlocks(pageInfo, keyInfo, fullWidth, fullHeight) {
    if (! pageInfo.Page.BlockWidth) {
      return [];
    }
    window.NFBR.calcU2F(pageInfo.Page, keyInfo);
    var size = pageInfo.Page.Size;
    var imgBlocks = window.NFBR.getBlocks(pageInfo.Page, fullWidth, fullHeight);

    return imgBlocks;
  }

  function resURLBuilder(fileName) {
    var path;
    if (1 == authInfo.cty || 2 == authInfo.cty) {
      path = fileName;
    } else {
      path = config.fontSize + '/' + fileName;
    }
    var url = (new URL(authInfo.url + path)).toString();
    url += '?';
    url += (new URLSearchParams(authInfo.auth_info)).toString();

    return url;
  }

  function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) {
      return match[2];
    }
  }

  function waitRetry(ms){
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function initUI() {
    var ui = {
      btn: null,
      btnR: null,
      settingPack: null,
      settingPart: null,
      cover: null,
      msgBox: null,
      listenBtn: function (cb) {
        this.btn.addEventListener('click', cb);
      },
      disableBtn: function () {
        this.btn.disabled = true;
      },
      enableBtn: function () {
        this.btn.disabled = false;
      },
      disableSettings: function () {
        this.settingPack.disabled = true;
        this.settingPart.disabled = true;
      },
      updateBtnText: function (text) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.btn.innerText = text.replace(/{(\d+)}/g, function (match, num) {
          var key = num - 1;
          return 'undefined' !== typeof args[key] ? args[key] : match;
        });
      },
      showMsgBox: function () {
        this.cover.style.display = 'block';
        this.msgBox.style.display = 'block';
      },
      hideMsgBox: function () {
        this.cover.style.display = 'none';
        this.msgBox.style.display = 'none';
      },
      newMsg: function (text) {
        var args = Array.prototype.slice.call(arguments, 1);
        text = text.replace(/{(\d+)}/g, function (match, num) {
          var key = num - 1;
          return 'undefined' !== typeof args[key] ? args[key] : match;
        });
        this.msgBox.value += text;
        this.msgBox.value += "\n";
        this.msgBox.scrollTop = this.msgBox.scrollHeight;
      }
    };
    var btn = document.createElement('button');
    btn.innerText = tip.initializing;
    btn.style.position = 'fixed';
    btn.style.top = '40px';
    btn.style.right = '50px';
    btn.style.zIndex = '10030';
    btn.style.padding = '9px';
    btn.style.background = '#fff';
    btn.style.border = '1px solid #aaa';
    btn.style.borderRadius = '4px 0 0 4px';
    btn.style.minWidth = '112px';
    btn.style.color = '#000';
    btn.style.cursor = 'pointer';
    btn.style.lineHeight = '16px';
    btn.style.verticalAlign = 'middle';

    document.body.appendChild(btn);
    ui.btn = btn;

    var btnR = document.createElement('button');
    btnR.style.position = 'fixed';
    btnR.style.top = '40px';
    btnR.style.right = '20px';
    btnR.style.zIndex = '10030';
    btnR.style.padding = '9px 0px 9px 0px';
    btnR.style.background = '#fff';
    btnR.style.border = '1px solid #aaa';
    btnR.style.borderLeft = 'none';
    btnR.style.borderRadius = '0 4px 4px 0';
    btnR.style.width = '30px';
    btnR.style.color = '#000';
    btnR.style.cursor = 'pointer';
    btnR.style.lineHeight = '16px';

    document.body.appendChild(btnR);
    ui.btnR = btnR;

    var btnRSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    btnRSvg.setAttribute('viewBox', '64 64 896 896');
    btnRSvg.setAttribute('fill', 'currentColor');
    btnRSvg.setAttribute('width', '12px');
    btnRSvg.setAttribute('height', '12px');
    btnRSvg.style.verticalAlign = 'top';
    btnRSvg.style.padding = '2px';

    var btnRSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    btnRSvgPath.setAttribute(
      'd',
      'M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 '
      + '227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 '
      + '7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 '
      + '0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z'
    );
    btnRSvg.appendChild(btnRSvgPath);
    btnR.appendChild(btnRSvg);

    var btnDropMenuC = document.createElement('div');
    btnDropMenuC.style.position = 'fixed';
    btnDropMenuC.style.top = '79px';
    btnDropMenuC.style.right = '20px';
    btnDropMenuC.style.zIndex = '10031';
    btnDropMenuC.style.transition = '100ms ease-in-out';
    btnDropMenuC.style.opacity = 0;
    btnDropMenuC.style.padding = '0 9px 9px 9px';
    btnDropMenuC.style.borderRadius = '4px';
    btnDropMenuC.style.background = '#fff';
    btnDropMenuC.style.border = '1px solid #aaa';
    // btnDropMenuC.style.boxShadow = '0 6px 10px 0 rgba(0, 0, 0, 0.09)';

    var settingPack = document.createElement('label');
    settingPack.style.display = 'block';
    settingPack.style.marginTop = '9px';
    settingPack.style.minWidth = '116px';
    settingPack.style.color = '#000';
    settingPack.style.lineHeight = '16px';
    settingPack.style.verticalAlign = 'middle';
    settingPack.style.background = '#fff';
    settingPack.style.border = 'none';
    btnDropMenuC.appendChild(settingPack);

    var settingPackText = document.createElement('span');
    settingPackText.innerText = tip.downloadBtnPack;
    settingPackText.style.fontSize = '12px';
    settingPack.appendChild(settingPackText);

    var settingPackCheckBox = document.createElement('input');
    settingPackCheckBox.type = 'checkbox';
    settingPackCheckBox.checked = GM_getValue('settingsPackDownload', false);
    settingPackCheckBox.style.marginLeft = '10px';
    settingPackCheckBox.style.verticalAlign = 'middle';
    settingPackCheckBox.style.cursor = 'pointer';
    settingPack.appendChild(settingPackCheckBox);

    var settingPart = document.createElement('label');
    settingPart.style.display = 'block';
    settingPart.style.marginTop = '9px';
    settingPart.style.minWidth = '116px';
    settingPart.style.color = '#000';
    settingPart.style.lineHeight = '16px';
    settingPart.style.verticalAlign = 'middle';
    settingPart.style.background = '#fff';
    settingPart.style.border = 'none';
    btnDropMenuC.appendChild(settingPart);

    var settingPartText = document.createElement('span');
    settingPartText.innerText = tip.downloadBtnPart;
    settingPartText.style.fontSize = '12px';
    settingPartText.style.verticalAlign = 'middle';
    settingPart.appendChild(settingPartText);

    var settingPartInput = document.createElement('input');
    settingPartInput.type = 'text';
    settingPartInput.value = '1';
    settingPartInput.style.width = '50px';
    settingPartInput.style.marginLeft = '10px';
    settingPartInput.style.verticalAlign = 'middle';
    settingPartInput.style.fontSize = '12px';
    settingPart.appendChild(settingPartInput);

    btnR.addEventListener('mouseenter', function () {
      btnDropMenuShow(btnDropMenuC);
    });
    btnR.addEventListener('click', function () {
      btnDropMenuShow(btnDropMenuC);
    });
    btnR.addEventListener('mouseleave', function () {
      btnDropMenuHide(btnDropMenuC);
    });
    btnDropMenuC.addEventListener('mouseenter', function () {
      btnDropMenuShow(btnDropMenuC);
    });
    btnDropMenuC.addEventListener('mouseleave', function () {
      btnDropMenuHide(btnDropMenuC);
    });
    settingPackCheckBox.addEventListener('change', function () {
      if (this.checked) {
        config.downloadPackage = true;
        GM_setValue('settingsPackDownload', true);
      } else {
        config.downloadPackage = false;
        GM_setValue('settingsPackDownload', false);
      }
    });
    settingPartInput.addEventListener('keyup', function () {
      var val = this.value.trim();
      if ('' === val) {
        return;
      }
      if (isNaN(val) || val < 1) {
        this.value = config.downloadPageFrom;
        return;
      }
      config.downloadPageFrom = parseInt(val);
    });

    ui.settingPack = settingPackCheckBox;
    ui.settingPart = settingPartInput;
    document.body.appendChild(btnDropMenuC);

    function btnDropMenuShow(btn) {
      clearTimeout(btn.dataset.hidetimer);
      btn.style.opacity = 1;
    }

    function btnDropMenuHide(btn) {
      btn.dataset.hidetimer = setTimeout(function () {
        btn.style.opacity = 0;
      }, 500);
    }

    var cover = document.createElement('div');
    cover.style.width = '100%';
    cover.style.height = '100%';
    cover.style.position = 'fixed';
    cover.style.zIndex = '10010';
    cover.style.top = '0';
    cover.style.left = '0';
    cover.style.background = '#000';
    cover.style.opacity = '0.1';
    cover.style.display = 'none';
    document.body.appendChild(cover);
    ui.cover = cover;

    var msgBox = document.createElement('textarea');
    msgBox.style.width = '600px';
    msgBox.style.height = '500px';
    msgBox.style.position = 'fixed';
    msgBox.style.zIndex = '10020';
    msgBox.style.top = '50%';
    msgBox.style.left = '50%';
    msgBox.style.opacity = '0.9';
    msgBox.style.display = 'none';
    msgBox.style.padding = '30px';
    msgBox.style.transform = 'translate(-50%, -50%)';
    msgBox.readOnly = true;
    document.body.appendChild(msgBox);
    ui.msgBox = msgBox;

    return ui;
  }

  function initNFBR() {
    var Gdq = window;
    Gdq.NFBR = {};

    (function () {
      var Xn3 = [
          [1, 3, 10], [1, 5, 16], [1, 5, 19], [1, 9, 29], [1, 11, 6], [1, 11, 16], [1, 19, 3],
          [1, 21, 20], [1, 27, 27], [2, 5, 15], [2, 5, 21], [2, 7, 7], [2, 7, 9], [2, 7, 25],
          [2, 9, 15], [2, 15, 17], [2, 15, 25], [2, 21, 9], [3, 1, 14], [3, 3, 26], [3, 3, 28],
          [3, 3, 29], [3, 5, 20], [3, 5, 22], [3, 5, 25], [3, 7, 29], [3, 13, 7], [3, 23, 25],
          [3, 25, 24], [3, 27, 11], [4, 3, 17], [4, 3, 27], [4, 5, 15], [5, 3, 21], [5, 7, 22],
          [5, 9, 7], [5, 9, 28], [5, 9, 31], [5, 13, 6], [5, 15, 17], [5, 17, 13], [5, 21, 12],
          [5, 27, 8], [5, 27, 21], [5, 27, 25], [5, 27, 28], [6, 1, 11], [6, 3, 17], [6, 17, 9],
          [6, 21, 7], [6, 21, 13], [7, 1, 9], [7, 1, 18], [7, 1, 25], [7, 13, 25], [7, 17, 21],
          [7, 25, 12], [7, 25, 20], [8, 7, 23], [8, 9, 23], [9, 5, 14], [9, 5, 25], [9, 11, 19],
          [9, 21, 16], [10, 9, 21], [10, 9, 25], [11, 7, 12], [11, 7, 16], [11, 17, 13],
          [11, 21, 13], [12, 9, 23], [13, 3, 17], [13, 3, 27], [13, 5, 19], [13, 17, 15],
          [14, 1, 15], [14, 13, 15], [15, 1, 29], [17, 15, 20], [17, 15, 23], [17, 15, 26]
        ],
        tn3 = [
          function (gr3, Br3, Hr3, Rr3) {
            return (
              (gr3 ^= gr3 << Br3), (gr3 ^= gr3 >>> Hr3), (gr3 ^= gr3 << Rr3)
            );
          },
          function (Rsm, DMm, UMm, AMm) {
            return (
              (Rsm ^= Rsm << AMm), (Rsm ^= Rsm >>> UMm), (Rsm ^= Rsm << DMm)
            );
          },
          function (LMm, jMm, lMm, qMm) {
            // qLs_MBv(Hsm, 18);
            // zsm(t6s[pBv] - Y6s[FDs]);
            return (
              (LMm ^= LMm >>> jMm), (LMm ^= LMm << lMm), (LMm ^= LMm >>> qMm)
            );
          },
          function (vMm, sMm, MMm, mMm) {
            return (
              (vMm ^= vMm >>> mMm), (vMm ^= vMm << MMm), (vMm ^= vMm >>> sMm)
            );
          },
          function (EMm, dMm, OMm, kMm) {
            return (
              (EMm ^= EMm << dMm), (EMm ^= EMm << kMm), (EMm ^= EMm >>> OMm)
            );
          },
          function (fMm, TMm, CMm, KMm) {
            // qLs_MBv(Hsm, 19);
            // zsm(t6s[rBv] - Y6s[XDs]);
            return (
              (fMm ^= fMm >>> TMm), (fMm ^= fMm >>> KMm), (fMm ^= fMm << CMm)
            );
          },
        ],
        Yn3 = Xn3["length"],
        zn3 = tn3["length"],
        gn3 = 2463534242,
        Bn3 = Xn3[74],
        Hn3 = tn3[0];
      (Gdq["NFBR"]["T8n"] = function () {
        var Rn3 = gn3,
          D83 = Bn3[0],
          U83 = Bn3[1],
          A83 = Bn3[2],
          L83 = Hn3;
        (this["e7Ks"] = function (j83, l83) {
          Rn3 = gn3;
          var q83 = Xn3[j83];
          (D83 = q83[0]), (U83 = q83[1]), (A83 = q83[2]), (L83 = tn3[l83]);
        }),
          (this["j7p"] = function (v83) {
            var s83 = v83 >>> 0;
            0 === s83 && (s83 = gn3), (Rn3 = s83);
          }),
          (this["W5C"] = function (M83) {
            if (M83 <= 1) return 0;
            for (
              var m83, E83, d83 = Rn3, O83 = 4294967295 - M83;
              (m83 = (E83 = (d83 = L83(d83, D83, U83, A83) >>> 0) - 1) % M83),
                O83 < E83 - m83;

            );
            return (Rn3 = d83), m83;
          });
      }),
        Gdq["NFBR"]["T8n"]["prototype"],
        (Gdq["NFBR"]["T8n"]["M2e"] = Yn3),
        (Gdq["NFBR"]["T8n"]["B4d"] = zn3),
        (Gdq["NFBR"]["T8n"]["n2C"] = Yn3 * zn3);
    })();

    Gdq["NFBR"]["C6A"] = {};
    var cJm = Gdq["window"],
      NJm = "e7Ks",
      WJm = "j7p",
      ZJm = cJm["NFBR"]["T8n"],
      xJm = ZJm["M2e"],
      wJm = ZJm["B4d"],
      PJm = cJm["Math"]["floor"],
      JJm = function (func, context) {
        return Function.prototype.bind.apply(
          func,
          Array.prototype.slice.call(arguments, 1)
        );
      },
      GJm = cJm["Array"]["prototype"]["push"];
    Gdq["NFBR"]["C6A"]["a3f"] = function (hJm, rJm, nJm, bJm) {
      var pJm = new ZJm(),
        SJm = rJm ^ nJm ^ bJm,
        XJm = PJm(hJm / 65536),
        tJm = PJm(rJm / 65536),
        YJm = PJm(nJm / 65536),
        zJm = PJm(bJm / 65536),
        gJm = xJm,
        BJm = wJm,
        HJm = tJm ^ YJm ^ zJm,
        RJm = XJm ^ zJm,
        DGm = hJm ^ rJm,
        UGm = hJm ^ nJm,
        AGm = hJm ^ bJm,
        LGm = (HJm >>>= 16) % BJm,
        jGm = ((HJm - LGm) / BJm) % gJm,
        lGm = JJm(pJm["W5C"], pJm);
      pJm[NJm](jGm, LGm), pJm[WJm](SJm);
      var qGm = lGm(65536) | (lGm(65536) << 16),
        vGm = tJm >>> 16,
        sGm = YJm >>> 16;
      (DGm = (DGm ^ qGm) >>> 0),
        (UGm = (UGm ^ qGm) >>> 0),
        (AGm = (AGm ^ qGm) >>> 0);
      var MGm = (RJm = (RJm >>> 16) ^ lGm(512)) % BJm,
        mGm = ((RJm - MGm) / BJm) % gJm;
      pJm[NJm](mGm, MGm), pJm[WJm](DGm);
      var EGm = dGm(lGm, vGm * sGm);
      pJm[WJm](UGm);
      var OGm = kGm(lGm, vGm),
        fGm = kGm(lGm, sGm),
        TGm = CGm(lGm, OGm, vGm),
        KGm = CGm(lGm, fGm, sGm);
      pJm[WJm](AGm);
      var VGm = [],
        QGm = [];
      FGm(lGm, VGm, QGm, OGm, fGm, vGm, sGm);
      var IGm = dGm(lGm, vGm),
        cGm = dGm(lGm, sGm),
        NGm = [],
        WGm = [];
      return (
        FGm(lGm, WGm, NGm, TGm, KGm, vGm, sGm),
        ZGm(vGm, sGm, EGm, IGm, cGm, NGm, WGm, TGm, KGm, QGm, VGm, OGm, fGm)
      );
    };
    var ZGm = function (
        xGm, wGm, PGm, JGm, GGm, hGm,
        rGm, nGm, bGm, pGm, SGm, XGm, tGm
      ) {
        var YGm,
          zGm,
          gGm,
          BGm,
          HGm,
          RGm,
          Dhm,
          Uhm,
          Ahm = [],
          Lhm = xGm + 1,
          jhm = wGm + 1,
          lhm = Lhm << 1,
          qhm = jhm << 1,
          vhm = JJm(GJm, Ahm);
        for (BGm = 0; BGm < xGm; BGm++)
          for (HGm = 0; HGm < wGm; HGm++)
            (Dhm = ((Uhm = PGm[BGm + HGm * xGm]) - (RGm = Uhm % xGm)) / xGm),
              (YGm = BGm < SGm[HGm] ? BGm : BGm + Lhm),
              (zGm = HGm < pGm[BGm] ? HGm : HGm + jhm),
              (gGm = RGm < rGm[Dhm] ? RGm : RGm + Lhm),
              vhm((Dhm < hGm[RGm] ? Dhm : Dhm + jhm) * lhm + YGm),
              vhm(gGm * qhm + zGm);
        for (
          vhm(bGm * lhm + XGm), vhm(nGm * qhm + tGm), BGm = 0;
          BGm < xGm;
          BGm++
        )
          (HGm = pGm[BGm]),
            (gGm = (RGm = JGm[BGm]) < nGm ? RGm : RGm + Lhm),
            vhm((Dhm = hGm[RGm]) * lhm + (YGm = BGm < XGm ? BGm : BGm + Lhm)),
            vhm(gGm * qhm + HGm);
        for (HGm = 0; HGm < wGm; HGm++)
          (BGm = SGm[HGm]),
            (RGm = rGm[(Dhm = GGm[HGm])]),
            (zGm = HGm < tGm ? HGm : HGm + jhm),
            vhm((Dhm < bGm ? Dhm : Dhm + jhm) * lhm + BGm),
            vhm(RGm * qhm + zGm);
        return Ahm;
      },
      kGm = function (gPm, BPm) {
        return BPm < 4 ? gPm(BPm + 1) : gPm(BPm - 1) + 1;
      },
      CGm = function (HPm, RPm, DJm) {
        // qLs_MBv(zPm, 40);
        // XPm(t6s[IHv] - Y6s[fUs]);
        if (0 === DJm) return 0;
        var UJm = HPm(DJm);
        return UJm < RPm ? UJm : UJm + 1;
      },
      FGm = function (AJm, LJm, jJm, lJm, qJm, vJm, sJm) {
        for (
          var MJm,
            mJm,
            EJm,
            dJm = vJm,
            OJm = sJm,
            kJm = lJm,
            fJm = qJm,
            TJm = 0,
            CJm = 0;
          0 < dJm + OJm;

        )
          if ((MJm = AJm(dJm + OJm)) < dJm) {
            if (MJm < kJm) {
              for (mJm = CJm; 0 < mJm && !(TJm >= LJm[mJm - 1]); mJm--);
              for (EJm = CJm + OJm; EJm < sJm && !(TJm >= LJm[EJm]); EJm++);
              (jJm[TJm] = AJm(EJm - mJm) + mJm), TJm++, kJm--;
            } else {
              for (mJm = CJm; 0 < mJm && !(TJm + dJm <= LJm[mJm - 1]); mJm--);
              for (
                EJm = CJm + OJm;
                EJm < sJm && !(TJm + dJm <= LJm[EJm]);
                EJm++
              );
              jJm[TJm + dJm - 1] = AJm(EJm - mJm) + mJm;
            }
            dJm--;
          } else {
            if (MJm - dJm < fJm) {
              for (mJm = TJm; 0 < mJm && !(CJm >= jJm[mJm - 1]); mJm--);
              for (EJm = TJm + dJm; EJm < vJm && !(CJm >= jJm[EJm]); EJm++);
              (LJm[CJm] = AJm(EJm - mJm) + mJm), CJm++, fJm--;
            } else {
              for (mJm = TJm; 0 < mJm && !(CJm + OJm <= jJm[mJm - 1]); mJm--);
              for (
                EJm = TJm + dJm;
                EJm < vJm && !(CJm + OJm <= jJm[EJm]);
                EJm++
              );
              LJm[CJm + OJm - 1] = AJm(EJm - mJm) + mJm;
            }
            OJm--;
          }
      },
      dGm = function (KJm, VJm) {
        for (var QJm, FJm = [], IJm = 0; IJm < VJm; IJm++)
          (QJm = KJm(IJm + 1)), (FJm[IJm] = FJm[QJm]), (FJm[QJm] = IJm);
        return FJm;
      },
      qd3 = function (vd3, sd3, Md3) {
        ////
        var md3 = [],
          Ed3 = vd3["BlockWidth"],
          dd3 = vd3["BlockWidth"];
        // if (vd3["U2F"] === undefined)
        //   md3 = gE3[SE3](sd3, Md3, Ed3, dd3, vd3["M1R"]);
        var Od3 = vd3["Q1i"],
          kd3 = vd3["b0F"],
          fd3 = vd3["v5m"],
          Td3 = vd3["U2F"],
          Cd3 = window["NFBR"]["T8n"]["M2e"],
          Kd3 = window["NFBR"]["T8n"]["B4d"],
          Vd3 = Math.floor(sd3 / Ed3),
          Qd3 = Math.floor(Md3 / dd3),
          Fd3 = sd3 % Ed3,
          Id3 = Md3 % dd3,
          cd3 = (Vd3 + 1) << 1,
          Nd3 = (Qd3 + 1) << 1,
          Wd3 = (Vd3 + 1) * Ed3 - Fd3,
          Zd3 = (Qd3 + 1) * dd3 - Id3,
          xd3 = new window["NFBR"]["T8n"](),
          wd3 = Td3 ^ Vd3 ^ Qd3,
          Pd3 = wd3 % Kd3,
          Jd3 = ((wd3 - Pd3) / Kd3) % Cd3;
        xd3["e7Ks"](Jd3, Pd3), xd3["j7p"](Od3 ^ kd3 ^ fd3);
        var Gd3 = xd3["W5C"](65536);
        (Gd3 += 65536 * xd3["W5C"](65536)),
          (Gd3 += 4294967296 * xd3["W5C"](512));
        var hd3 = 4294967296 * Vd3 + Od3,
          rd3 = 4294967296 * Qd3 + kd3,
          nd3 = 4294967296 * Td3 + fd3,
          bd3 = window["NFBR"]["C6A"]["a3f"](Gd3, hd3, rd3, nd3),
          pd3 = function (Sd3, Xd3, td3, Yd3) {
            var zd3,
              gd3,
              Bd3,
              Hd3,
              Rd3,
              DO3,
              UO3 = Ed3,
              AO3 = dd3,
              LO3 = Vd3,
              jO3 = Qd3,
              lO3 = cd3,
              qO3 = Nd3,
              vO3 = Wd3,
              sO3 = Zd3,
              MO3 = bd3;
            if (0 !== td3 && 0 !== Yd3)
              for (; Sd3 < Xd3; ) {
                (zd3 = MO3[Sd3++]),
                  (Rd3 = ((gd3 = MO3[Sd3++]) - (Hd3 = gd3 % qO3)) / qO3),
                  (DO3 = (zd3 - (Bd3 = zd3 % lO3)) / lO3);
                var dO3 = {};
                (dO3["srcX"] = Bd3 * UO3 - (LO3 < Bd3 ? vO3 : 0)),
                  (dO3["srcY"] = Hd3 * AO3 - (jO3 < Hd3 ? sO3 : 0)),
                  (dO3["destX"] = Rd3 * UO3 - (LO3 < Rd3 ? vO3 : 0)),
                  (dO3["destY"] = DO3 * AO3 - (jO3 < DO3 ? sO3 : 0)),
                  (dO3["width"] = td3),
                  (dO3["height"] = Yd3),
                  md3.push(dO3);
              }
          },
          OO3 = 0,
          kO3 = (Vd3 * Qd3) << 1;
        pd3(OO3, kO3, Ed3, dd3),
          pd3((OO3 = kO3), (kO3 += 2), Fd3, Id3),
          pd3((OO3 = kO3), (kO3 += Vd3 << 1), Ed3, Id3),
          pd3((OO3 = kO3), (kO3 += Qd3 << 1), Fd3, dd3);
        return md3;
      };
    Gdq["NFBR"]["getBlocks"] = qd3;
    Gdq["NFBR"]["calcU2F"] = calcU2F;
    Gdq["NFBR"]["decryptConfig"] = decryptConfig;
    Gdq["NFBR"]["getImgURLHash"] = getImgURLHash;

    function decryptConfig(dataArr, key1, key2, key3) {
      var lYs = 0;
      var confName = "configuration_pack.json";
      var vYs = vYsInit();
      // console.log(dataArr, key1, key2, key3);
      return d2j(dataArr, dataArr.length, key1, key2, key3)
        .then(function (returnData) {
          // console.log(returnData);
          return b9q.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return u6D.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return l3I.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return x3U.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return N3P.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return d2j.apply(null, returnData);
        })
        .then(function (returnData) {
          return d2j.apply(null, returnData);
        })
        .then(function (returnData) {
          return d2j.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return T2l.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return Y7p.apply(null, returnData);
        })
        .then(function (returnData) {
          // console.log(returnData);
          return Promise.resolve({
            config: JSON.parse(returnData[0]),
            key1: returnData[1],
            key2: returnData[2],
            key3: returnData[3],
            key1Arr: returnData[4],
            key2Arr: returnData[5],
            key3Arr: returnData[6],
          });
        });

      function vYsInit() {
        var sYs = confName;
        for (var MYs, mYs = sYs["length"], EYs = [], kYs = 0; kYs < mYs; )
          (MYs = sYs.charCodeAt(kYs++)) < 128
            ? EYs.push(MYs)
            : (MYs < 2048
                ? EYs.push(192 | (MYs >> 6))
                : (MYs < 55296 || 57344 <= MYs || kYs === mYs
                    ? EYs.push(224 | (MYs >> 12))
                    : (EYs.push(
                        240 |
                          ((MYs =
                            65536 +
                            (((1023 & MYs) << 10) |
                              (1023 & sYs.charCodeAt(kYs++)))) >>
                            18)
                      ),
                      EYs.push(128 | ((MYs >> 12) & 63))),
                  EYs.push(128 | ((MYs >> 6) & 63))),
              EYs.push(128 | (63 & MYs)));
        return EYs;
      }

      function LYs(pGM) {
        var SGM,
          XGM,
          tGM,
          YGM = [],
          zGM = [],
          gGM = pGM["length"];
        for (XGM = SGM = 0; SGM < 256; SGM++, XGM++)
          XGM === gGM && (XGM = 0), (zGM[(YGM[SGM] = SGM)] = pGM[XGM]);
        for (XGM = SGM = 0; SGM < 256; SGM++)
          (XGM = (XGM + YGM[SGM] + zGM[SGM]) & 255),
            (tGM = YGM[SGM]),
            (YGM[SGM] = YGM[XGM]),
            (YGM[XGM] = tGM);
        return YGM;
      }

      function I1s(k7s, f7s, T7s) {
        var C7s = [];
        C7s = C7s.concat(k7s).concat(f7s).concat(T7s);
        return LYs(C7s);
      }

      function a0FBin(pGM) {
        var SGM,
          XGM,
          tGM,
          YGM = [],
          zGM = [],
          gGM = pGM["length"];
        for (XGM = SGM = 0; SGM < 256; SGM++, XGM++)
          XGM === gGM && (XGM = 0), (zGM[(YGM[SGM] = SGM)] = pGM[XGM]);
        for (XGM = SGM = 0; SGM < 256; SGM++)
          (XGM = (XGM + YGM[SGM] + zGM[SGM]) & 255),
            (tGM = YGM[SGM]),
            (YGM[SGM] = YGM[XGM]),
            (YGM[XGM] = tGM);
        return YGM;
      }

      function jYs(vhM, shM) {
        var MhM,
          mhM,
          EhM,
          dhM,
          OhM,
          khM = [];
        (khM["length"] = vhM["length"]), (dhM = a0FBin(shM)), (mhM = MhM = 0);
        for (var fhM = vhM["length"], ThM = 0; ThM < fhM; ThM++)
          (mhM = (mhM + dhM[(MhM = (MhM + 1) & 255)]) & 255),
            (OhM = dhM[MhM]),
            (dhM[MhM] = dhM[mhM]),
            (dhM[mhM] = OhM),
            (EhM = (dhM[MhM] + dhM[mhM]) & 255),
            (khM[ThM] = vhM[ThM] ^ dhM[EhM]);
        return khM;
      }

      function dgs(K7s, V7s, Q7s, F7s) {
        var I7s = [];
        I7s = I7s.concat(V7s).concat(Q7s).concat(F7s);
        return jYs(K7s, I7s);
      }

      function chunkCB(cb) {
        var isResolve = false;
        var thenData;
        var resolveCall = function (data) {
          isResolve = true;
          thenData = data;
        };
        return new Promise(function (resolve, reject) {
          while (true) {
            if (isResolve) {
              resolve(thenData);
              break;
            } else {
              cb(resolveCall);
            }
          }
        });
      }

      function d2j(Ggs, hgs, rgs, ngs, bgs) {
        var pgs,
          Sgs,
          Xgs,
          tgs,
          Ygs,
          zgs,
          ggs = [];
        switch (lYs) {
          case 0:
            (pgs = Ggs),
              (Sgs = hgs),
              (zgs = 65536),
              (Xgs = rgs),
              (tgs = ngs),
              (Ygs = bgs);
            break;
          case 1:
            (pgs = bgs),
              (zgs = Sgs = 32),
              (Xgs = rgs),
              (tgs = ngs),
              (Ygs = null);
            break;
          case 2:
            (pgs = ngs),
              (zgs = Sgs = 32),
              (Xgs = rgs),
              (tgs = bgs),
              (Ygs = null);
            break;
          case 3:
            (pgs = rgs),
              (zgs = Sgs = 32),
              (Xgs = ngs),
              (tgs = bgs),
              (Ygs = null);
        }
        var Bgs,
          Hgs = 0,
          Rgs = 0;
        for (Bgs = 0; Bgs < 32; Bgs++)
          (Hgs = (Hgs + Xgs[Bgs]) & 255), (Rgs ^= Xgs[Bgs]);
        for (Bgs = 0; Bgs < 32; Bgs++)
          (Hgs = (Hgs + tgs[Bgs]) & 255), (Rgs ^= tgs[Bgs]);
        if (Ygs)
          for (Bgs = 0; Bgs < 32; Bgs++)
            (Hgs = (Hgs + Ygs[Bgs]) & 255), (Rgs ^= Ygs[Bgs]);
        var D2s = 2 != (2 & Hgs),
          U2s = 4 != (4 & Hgs),
          A2s = 8 != (8 & Hgs),
          L2s = Rgs >>> 5,
          l2s = 8 - L2s,
          q2s = 0;
        return chunkCB(function (resolve) {
          var v2s = ggs,
            s2s = D2s,
            M2s = U2s,
            m2s = A2s,
            E2s = L2s,
            d2s = l2s,
            k2s = pgs,
            f2s = q2s,
            C2s = f2s + zgs;
          Sgs < C2s && (C2s = Sgs);
          for (
            var K2s,
              V2s,
              Q2s,
              F2s,
              I2s,
              c2s,
              N2s,
              W2s,
              Z2s,
              w2s,
              P2s,
              J2s,
              G2s,
              h2s,
              r2s,
              n2s;
            f2s < C2s;

          ) {
            for (
              Q2s = (V2s = C2s < (K2s = f2s + 32)) ? (K2s = C2s) - f2s : 32,
                W2s = Hgs,
                Z2s = Rgs,
                I2s = 0,
                c2s = f2s;
              I2s < Q2s;

            )
              (F2s = k2s[c2s++]),
                s2s && (F2s = ((85 & F2s) << 1) | ((F2s >>> 1) & 85)),
                M2s && (F2s = ((51 & F2s) << 2) | ((F2s >>> 2) & 51)),
                m2s && (F2s = ((15 & F2s) << 4) | ((F2s >>> 4) & 15)),
                (W2s = (W2s + (v2s[I2s++] = F2s)) & 255),
                (Z2s ^= F2s);
            for (
              J2s = 2 != (2 & W2s),
                G2s = 4 != (4 & W2s),
                h2s = 8 != (8 & W2s),
                r2s = 16 != (16 & W2s),
                n2s = 32 != (32 & W2s),
                I2s = 0;
              I2s < Q2s;
              I2s++
            )
              if (
                1 == (1 & I2s) &&
                (J2s &&
                  ((c2s = I2s - 1),
                  (F2s = v2s[I2s]),
                  (v2s[I2s] = v2s[c2s]),
                  (v2s[c2s] = F2s)),
                3 == (3 & I2s))
              ) {
                if (G2s)
                  for (N2s = w2s = (c2s = I2s) - 2; w2s < c2s; )
                    (F2s = v2s[c2s]),
                      (v2s[c2s--] = v2s[N2s]),
                      (v2s[N2s--] = F2s);
                if (7 == (7 & I2s)) {
                  if (h2s)
                    for (N2s = w2s = (c2s = I2s) - 4; w2s < c2s; )
                      (F2s = v2s[c2s]),
                        (v2s[c2s--] = v2s[N2s]),
                        (v2s[N2s--] = F2s);
                  if (15 == (15 & I2s)) {
                    if (r2s)
                      for (N2s = w2s = (c2s = I2s) - 8; w2s < c2s; )
                        (F2s = v2s[c2s]),
                          (v2s[c2s--] = v2s[N2s]),
                          (v2s[N2s--] = F2s);
                    if (31 == (31 & I2s) && n2s)
                      for (N2s = w2s = (c2s = I2s) - 16; w2s < c2s; )
                        (F2s = v2s[c2s]),
                          (v2s[c2s--] = v2s[N2s]),
                          (v2s[N2s--] = F2s);
                  }
                }
              }
            if (
              ((P2s = Z2s >>> 3), V2s ? (P2s %= Q2s) : (P2s &= 31), 0 === E2s)
            )
              for (I2s = f2s, c2s = Q2s - P2s; I2s < K2s; )
                c2s === Q2s && (c2s = 0), (k2s[I2s++] = v2s[c2s++]);
            else
              for (I2s = f2s, c2s = Q2s - P2s - 1; I2s < K2s; )
                (F2s = v2s[c2s] << d2s),
                  ++c2s === Q2s && (c2s = 0),
                  (F2s |= v2s[c2s] >>> E2s),
                  (k2s[I2s++] = 255 & F2s);
            f2s = K2s;
          }
          Sgs <= f2s
            ? (lYs++, resolve([Ggs, hgs, rgs, ngs, bgs]))
            : (q2s = f2s);
        });
      }

      function b9q(D7s, U7s, A7s, L7s, j7s) {
        var l7s = I1s(L7s, vYs, j7s);
        var q7s = 0,
          v7s = 0,
          s7s = 65536;

        return chunkCB(function (resolve) {
          var M7s = D7s,
            m7s = l7s,
            E7s = q7s,
            d7s = v7s,
            O7s = E7s + s7s;
          for (U7s < O7s && (O7s = U7s); E7s < O7s; )
            (M7s[E7s++] ^= m7s[d7s++]), (d7s &= 255);
          U7s <= E7s
            ? resolve([M7s, U7s, A7s, L7s, j7s])
            : ((q7s = E7s), (v7s = d7s));
        });
      }

      function u6D(kgs, fgs, Tgs, Cgs, Kgs) {
        var Vgs = I1s(vYs, Tgs, Cgs),
          Qgs = (1 | fgs) - 2,
          Fgs = 65536 << 1,
          Igs = 0,
          cgs = 0;
        return chunkCB(function (resolve) {
          var Ngs,
            Wgs = kgs,
            Zgs = Vgs,
            xgs = Qgs,
            wgs = Igs,
            Pgs = cgs,
            Jgs = xgs - Fgs;
          for (Jgs < 0 && (Jgs = 0); Jgs < xgs; )
            (Pgs = (Pgs + Zgs[(wgs = (wgs + 1) & 255)]) & 255),
              (Ngs = Zgs[wgs]),
              (Zgs[wgs] = Zgs[Pgs]),
              (Zgs[Pgs] = Ngs),
              (Wgs[xgs] ^= Zgs[(Zgs[wgs] + Zgs[Pgs]) & 255]),
              (xgs -= 2);
          xgs < 0
            ? resolve([Wgs, fgs, Tgs, Cgs, Kgs])
            : ((Qgs = xgs), (Igs = wgs), (cgs = Pgs));
        });
      }

      function l3I(b1s, p1s, S1s, X1s, t1s) {
        var Y1s = I1s(t1s, vYs, S1s),
          g1s = (p1s - 1) & -2,
          B1s = 65536 << 1,
          H1s = 0,
          R1s = 0;
        return chunkCB(function (resolve) {
          var Dgs,
            Ugs = b1s,
            Ags = Y1s,
            Lgs = g1s,
            jgs = H1s,
            lgs = R1s,
            qgs = Lgs - B1s;
          for (qgs < -1 && (qgs = -1); qgs < Lgs; )
            (lgs = (lgs + Ags[(jgs = (jgs + 1) & 255)]) & 255),
              (Dgs = Ags[jgs]),
              (Ags[jgs] = Ags[lgs]),
              (Ags[lgs] = Dgs),
              (Ugs[Lgs] ^= Ags[(Ags[jgs] + Ags[lgs]) & 255]),
              (Lgs -= 2);
          Lgs < 0
            ? resolve([Ugs, p1s, S1s, X1s, t1s])
            : ((g1s = Lgs), (H1s = jgs), (R1s = lgs));
        });
      }

      function x3U(b2s, p2s, S2s, X2s, t2s) {
        var Y2s,
          z2s,
          g2s,
          B2s = p2s;
        32 < B2s && (B2s = 32);
        for (var H2s = 0; H2s < B2s; H2s++) {
          switch (12 & (g2s = b2s[H2s] ^ S2s[H2s] ^ X2s[H2s] ^ t2s[H2s])) {
            case 0:
              Y2s = S2s[H2s];
              break;
            case 4:
              Y2s = X2s[H2s];
              break;
            case 8:
              Y2s = t2s[H2s];
              break;
            case 12:
              Y2s = b2s[H2s];
          }
          switch (3 & g2s) {
            case 0:
              (z2s = S2s[H2s]), (S2s[H2s] = Y2s);
              break;
            case 1:
              (z2s = X2s[H2s]), (X2s[H2s] = Y2s);
              break;
            case 2:
              (z2s = t2s[H2s]), (t2s[H2s] = Y2s);
              break;
            case 3:
              (z2s = b2s[H2s]), (b2s[H2s] = Y2s);
          }
          switch (12 & g2s) {
            case 0:
              S2s[H2s] = z2s;
              break;
            case 4:
              X2s[H2s] = z2s;
              break;
            case 8:
              t2s[H2s] = z2s;
              break;
            case 12:
              b2s[H2s] = z2s;
          }
          switch (192 & g2s) {
            case 0:
              Y2s = S2s[H2s];
              break;
            case 64:
              Y2s = X2s[H2s];
              break;
            case 128:
              Y2s = t2s[H2s];
              break;
            case 192:
              Y2s = b2s[H2s];
          }
          switch (48 & g2s) {
            case 0:
              (z2s = S2s[H2s]), (S2s[H2s] = Y2s);
              break;
            case 16:
              (z2s = X2s[H2s]), (X2s[H2s] = Y2s);
              break;
            case 32:
              (z2s = t2s[H2s]), (t2s[H2s] = Y2s);
              break;
            case 48:
              (z2s = b2s[H2s]), (b2s[H2s] = Y2s);
          }
          switch (192 & g2s) {
            case 0:
              S2s[H2s] = z2s;
              break;
            case 64:
              X2s[H2s] = z2s;
              break;
            case 128:
              t2s[H2s] = z2s;
              break;
            case 192:
              b2s[H2s] = z2s;
          }
        }

        return chunkCB(function (resolve) {
          resolve([b2s, p2s, S2s, X2s, t2s]);
        });
      }

      function N3P(vgs, sgs, Mgs, mgs, Egs) {
        Egs = dgs(Egs, mgs, Mgs, vYs);
        mgs = dgs(mgs, Mgs, vYs, Egs);
        Mgs = dgs(Mgs, vYs, Egs, mgs);
        return chunkCB(function (resolve) {
          resolve([vgs, sgs, Mgs, mgs, Egs]);
        });
      }

      function T2l(T1s, C1s, K1s, V1s, Q1s) {
        var F1s = I1s(Q1s, V1s, vYs),
          c1s = 0,
          N1s = 65536,
          W1s = 0,
          Z1s = 0;
        return chunkCB(function (resolve) {
          var x1s,
            w1s = T1s,
            J1s = F1s,
            G1s = c1s,
            h1s = W1s,
            r1s = Z1s,
            n1s = G1s + N1s;
          for (C1s < n1s && (n1s = C1s); G1s < n1s; )
            (r1s = (r1s + F1s[(h1s = (h1s + 1) & 255)]) & 255),
              (x1s = F1s[h1s]),
              (J1s[h1s] = F1s[r1s]),
              (J1s[r1s] = x1s),
              (w1s[G1s++] ^= J1s[(J1s[h1s] + J1s[r1s]) & 255]);
          C1s <= G1s
            ? resolve([w1s, C1s, K1s, V1s, Q1s])
            : ((c1s = G1s), (W1s = h1s), (Z1s = r1s));
        });
      }

      function Y7p(TYs, CYs, KYs, VYs, QYs) {
        var FYs = undefined,
          cYs = 0,
          NYs = 0,
          WYs = [],
          ZYs = new Array(16384),
          xYs = 65536;
        return chunkCB(function (resolve) {
          var PYs = "length",
            JYs = FYs,
            hYs = TYs,
            rYs = CYs,
            nYs = cYs,
            bYs = NYs,
            pYs = WYs,
            SYs = ZYs,
            tYs = nYs + xYs;
          rYs < tYs && (tYs = rYs);
          var YYs,
            zYs,
            gYs,
            BYs,
            HYs,
            RYs,
            Dzs = hYs[tYs - 1];
          for (
            128 <= Dzs &&
            (128 == (192 & Dzs)
              ? tYs < rYs &&
                128 == (192 & (YYs = hYs[tYs])) &&
                ++tYs < rYs &&
                128 == (192 & (zYs = hYs[tYs])) &&
                tYs++
              : tYs < rYs &&
                194 <= Dzs &&
                Dzs <= 244 &&
                128 == (192 & (YYs = hYs[tYs])) &&
                (224 !== Dzs || 160 <= YYs) &&
                (237 !== Dzs || YYs < 160) &&
                (240 !== Dzs || 144 <= YYs) &&
                (244 !== Dzs || YYs < 144) &&
                ++tYs < rYs &&
                224 <= Dzs &&
                128 == (192 & (zYs = hYs[tYs])) &&
                ++tYs < rYs &&
                240 <= Dzs &&
                128 == (192 & (gYs = hYs[tYs])) &&
                tYs++);
            nYs < tYs;

          )
            if (
              ((Dzs = hYs[nYs]),
              nYs++,
              Dzs < 128
                ? (SYs[bYs++] = Dzs)
                : ((YYs = hYs[nYs]),
                  tYs <= nYs ||
                  Dzs < 194 ||
                  244 < Dzs ||
                  128 != (192 & YYs) ||
                  (224 === Dzs && YYs < 160) ||
                  (237 === Dzs && 160 <= YYs) ||
                  (240 === Dzs && YYs < 144) ||
                  (244 === Dzs && 144 <= YYs)
                    ? (SYs[bYs++] = 65533)
                    : (nYs++,
                      Dzs < 224
                        ? ((BYs = (63 & YYs) | ((31 & Dzs) << 6)),
                          (SYs[bYs++] = BYs))
                        : ((zYs = hYs[nYs]),
                          tYs <= nYs || 128 != (192 & zYs)
                            ? (SYs[bYs++] = 65533)
                            : (nYs++,
                              Dzs < 240
                                ? ((BYs =
                                    (63 & zYs) |
                                    ((63 & YYs) << 6) |
                                    ((15 & Dzs) << 12)),
                                  (SYs[bYs++] = BYs))
                                : ((gYs = hYs[nYs]),
                                  tYs <= nYs || 128 != (192 & gYs)
                                    ? (SYs[bYs++] = 65533)
                                    : (nYs++,
                                      (HYs =
                                        ((48 & zYs) >> 4) |
                                        ((63 & YYs) << 2) |
                                        ((7 & Dzs) << 8)),
                                      (RYs = (63 & gYs) | ((15 & zYs) << 6)),
                                      (SYs[bYs++] = 55232 + HYs),
                                      (SYs[bYs++] = NaN + RYs))))))),
              16383 <= bYs)
            ) {
              SYs[PYs] = bYs;
              var Uzs = String.fromCharCode.apply(null, SYs);
              (SYs[16383] = JYs), WYs.push(Uzs), (bYs = 0);
            }
          if (rYs <= nYs) {
            var Azs,
              Lzs = KYs,
              jzs = VYs,
              lzs = QYs;
            (TYs = hYs = null),
              (SYs[PYs] = bYs),
              (Azs = pYs[PYs]
                ? (WYs.push(String.fromCharCode.apply(null, SYs)),
                  pYs["join"](""))
                : String.fromCharCode.apply(null, SYs)),
              (ZYs = WYs = SYs = pYs = null);
            var qzs,
              vzs,
              szs,
              Mzs,
              mzs = new Array(64);
            for (vzs = qzs = 0; qzs < 32; qzs++)
              (szs = (Mzs = Lzs[qzs]) >>> 4),
                (mzs[vzs++] = (szs < 10 ? 48 : 87) + szs),
                (szs = 15 & Mzs),
                (mzs[vzs++] = (szs < 10 ? 48 : 87) + szs);
            var Ezs = String.fromCharCode.apply(null, mzs);
            for (vzs = qzs = 0; qzs < 32; qzs++)
              (szs = (Mzs = jzs[qzs]) >>> 4),
                (mzs[vzs++] = (szs < 10 ? 48 : 87) + szs),
                (szs = 15 & Mzs),
                (mzs[vzs++] = (szs < 10 ? 48 : 87) + szs);
            var dzs = String.fromCharCode.apply(null, mzs);
            for (vzs = qzs = 0; qzs < 32; qzs++)
              (szs = (Mzs = lzs[qzs]) >>> 4),
                (mzs[vzs++] = (szs < 10 ? 48 : 87) + szs),
                (szs = 15 & Mzs),
                (mzs[vzs++] = (szs < 10 ? 48 : 87) + szs);
            var Ozs = String.fromCharCode.apply(null, mzs);
            resolve([Azs, Ezs, dzs, Ozs, Lzs, jzs, lzs]);
          } else (cYs = nYs), (NYs = bYs);
        });
      }
    }

    function getImgURLHash(pageInfo, keyInfo, Zjm) {
      function Ojm(kjm, fjm) {
        for (var Tjm = fjm.length, Cjm = 0; Cjm < Tjm; Cjm++)
          kjm[Cjm] ^= fjm[Cjm];
      }
      var keyXor = [];
      Ojm(keyXor, keyInfo.key1Arr);
      Ojm(keyXor, keyInfo.key2Arr);
      Ojm(keyXor, keyInfo.key3Arr);

      if ("string" != typeof Zjm["configuration"]["file-name-version"]) {
        return pageInfo.No + "";
      }

      return (
        (function (wjm, Pjm) {
          var Jjm = Pjm.No,
            Gjm = parseInt(Jjm, 10);
          if (!isNaN(Gjm) && 0 <= Gjm && Gjm < 1152921504606847000) {
            var hjm = Gjm.toString(16);
            return hjm.length.toString(16) + hjm;
          }
          return "0" + Jjm;
        })(0, pageInfo) +
        (function (rjm, njm) {
          var bjm,
            pjm,
            Sjm,
            Xjm,
            tjm,
            Yjm = njm.imgName + "/",
            zjm = njm.No + "",
            gjm = keyXor,
            Bjm = Yjm.length,
            Hjm = zjm.length,
            Rjm = gjm.length,
            D6m = Yjm + zjm,
            U6m = Bjm + Hjm,
            A6m = Hjm << 1,
            L6m = (1 + Bjm) << 1,
            j6m = (1 + U6m) << 1,
            l6m = new Array(j6m);
          for (
            pjm = 0, l6m[pjm++] = 0, l6m[pjm++] = 59, bjm = 0;
            bjm < U6m;
            bjm++
          )
            (tjm = D6m.charCodeAt(bjm)),
              (l6m[pjm++] = tjm >>> 8),
              (l6m[pjm++] = 255 & tjm);
          for (var v6m = A6m + j6m + j6m, s6m = 3; v6m < 256; s6m++)
            v6m += j6m;
          var M6m,
            m6m,
            E6m,
            d6m = 1670739,
            O6m = 1282576,
            k6m = 2237221;
          for (bjm = L6m, Sjm = pjm = 0; ; ) {
            for (
              ;
              (M6m =
                435 * d6m +
                ((3 & O6m) << 19) +
                ((4194296 & (k6m ^= l6m[bjm++] ^ gjm[pjm++])) >>> 3) +
                ((m6m =
                  435 * O6m +
                  ((7 & k6m) << 18) +
                  ((E6m = 435 * k6m) >>> 22)) >>>
                  21)),
                (k6m = 4194303 & E6m),
                (O6m = 2097151 & m6m),
                (d6m = 2097151 & M6m),
                Rjm <= pjm && (pjm = 0),
                !(j6m <= bjm);

            );
            if (++Sjm >= s6m) break;
            bjm = 0;
          }
          var f6m = new Array(16);
          return (
            (tjm = (Xjm = (d6m >>> 13) ^ gjm[0]) >>> 4),
            (f6m[0] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[1] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = (Xjm = ((d6m >>> 5) & 255) ^ gjm[1]) >>> 4),
            (f6m[2] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[3] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = (Xjm = (((31 & d6m) << 3) | (O6m >>> 18)) ^ gjm[2]) >>> 4),
            (f6m[4] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[5] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = (Xjm = ((O6m >>> 10) & 255) ^ gjm[3]) >>> 4),
            (f6m[6] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[7] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = (Xjm = ((O6m >>> 2) & 255) ^ gjm[4]) >>> 4),
            (f6m[8] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[9] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = (Xjm = (((3 & O6m) << 6) | (k6m >>> 16)) ^ gjm[5]) >>> 4),
            (f6m[10] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[11] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = (Xjm = ((k6m >>> 8) & 255) ^ gjm[6]) >>> 4),
            (f6m[12] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[13] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = (Xjm = (255 & k6m) ^ gjm[7]) >>> 4),
            (f6m[14] = (tjm < 10 ? 48 : 87) + tjm),
            (tjm = 15 & Xjm),
            (f6m[15] = (tjm < 10 ? 48 : 87) + tjm),
            String.fromCharCode.apply(null, f6m)
          );
        })(Zjm, pageInfo)
      );
    }

    function calcU2F(pageInfo, keyInfo) {
      var imgName = pageInfo.imgName;
      var fileName = pageInfo.No + "";
      var U2F = 47;
      var i;
      for (i = 0; i < imgName.length; i++) {
        U2F += imgName.charCodeAt(i);
      }
      for (i = 0; i < fileName.length; i++) {
        U2F += fileName.charCodeAt(i);
      }
      var keySum = 0;
      var keyArr = [keyInfo.key1Arr, keyInfo.key2Arr, keyInfo.key3Arr];
      var keyAS3Arr = [];
      for (i = 0; i < keyArr.length; i++) {
        keyAS3Arr[i] = S03(keyArr[i]);
        for (var ii = 0; ii < keyArr[i].length; ii++) {
          keySum += keyArr[i][ii];
        }
      }
      var FS3 = pageInfo["NS"];
      var IS3 = pageInfo["PS"];
      var cS3 = pageInfo["RS"];
      U2F += keySum;
      var NS3 = 255 & U2F;
      NS3 |= NS3 << 8;
      var WS3 =
          ((NS3 |= NS3 << 16) ^ keyAS3Arr[0] ^ Gdq["parseInt"](FS3)) >>> 0,
        ZS3 = (NS3 ^ keyAS3Arr[1] ^ Gdq["parseInt"](IS3)) >>> 0,
        xS3 = (NS3 ^ keyAS3Arr[2] ^ Gdq["parseInt"](cS3)) >>> 0;

      pageInfo["U2F"] = U2F % window["NFBR"]["T8n"]["n2C"];
      pageInfo["Q1i"] = WS3;
      pageInfo["b0F"] = ZS3;
      pageInfo["v5m"] = xS3;

      function S03(X03) {
        var t03 = 0,
          Y03 = -4 & X03.length;
        32 < Y03 && (Y03 = 32);
        for (var z03 = 0; z03 < Y03; )
          (t03 ^= X03[z03++] << 24),
            (t03 ^= X03[z03++] << 16),
            (t03 ^= X03[z03++] << 8),
            (t03 ^= X03[z03++]);
        return t03 >>> 0;
      }
    }
  }
  /*
    client-zip v1.6.2
    https://github.com/Touffy/client-zip
  */
  function downloadZipInit() {
    "stream" in Blob.prototype||Object.defineProperty(Blob.prototype,"stream",{value(){return new Response(this).body}});var e=e=>new DataView(new ArrayBuffer(e)),n=e=>new Uint8Array(e.buffer||e),t=e=>(new TextEncoder).encode(String(e));function r(e,r){if(void 0===r||r instanceof Date||(r=new Date(r)),e instanceof File)return{t:r||new Date(e.lastModified),o:e.stream()};if(e instanceof Response)return{t:r||new Date(e.headers.get("Last-Modified")||Date.now()),o:e.body};if(void 0===r)r=new Date;else if(isNaN(r))throw new Error("Invalid modification date.");if("string"==typeof e)return{t:r,o:t(e)};if(e instanceof Blob)return{t:r,o:e.stream()};if(e instanceof Uint8Array||e instanceof ReadableStream)return{t:r,o:e};if(e instanceof ArrayBuffer||ArrayBuffer.isView(e))return{t:r,o:n(e)};if(Symbol.asyncIterator in e)return{t:r,o:o(e)};throw new TypeError("Unsupported input format.")}function o(e){const n="next"in e?e:e[Symbol.asyncIterator]();return new ReadableStream({async pull(e){let t=0;for(;e.desiredSize>t;){const r=await n.next();if(!r.value){e.close();break}{const n=i(r.value);e.enqueue(n),t+=n.byteLength}}},async cancel(e){var t;try{await(null==(t=n.throw)?void 0:t.call(n,e))}catch(e){}}})}function i(e){return"string"==typeof e?t(e):e instanceof Uint8Array?e:n(e)}function a(e,r,o){let[i,a]=function(e){return e?e instanceof Uint8Array?[e,1]:ArrayBuffer.isView(e)||e instanceof ArrayBuffer?[n(e),1]:[t(e),0]:[void 0,0]}(r);if(e instanceof File)return{i:s(i||t(e.name)),u:e.size,l:a};if(e instanceof Response){const n=e.headers.get("content-disposition"),r=n&&n.match(/;\s*filename\*?=["']?(.*?)["']?$/i),f=r&&r[1]||e.url&&new URL(e.url).pathname.split("/").findLast(Boolean),u=f&&decodeURIComponent(f),d=o||+e.headers.get("content-length");return{i:s(i||t(u)),u:d,l:a}}return i=s(i),"string"==typeof e?{i,u:t(e).length,l:a}:e instanceof Blob?{i,u:e.size,l:a}:e instanceof ArrayBuffer||ArrayBuffer.isView(e)?{i,u:e.byteLength,l:a}:{i,u:f(e,o),l:a}}function f(e,n){return n>-1?n:e?void 0:0}function s(e){if(!e||e.every((c=>47===c)))throw new Error("The file must have a name.");for(;47===e[e.length-1];)e=e.subarray(0,-1);return e}var u=new Uint32Array(256);for(let e=0;e<256;++e){let n=e;for(let e=0;e<8;++e)n=n>>>1^(1&n&&3988292384);u[e]=n}function d(e,n=0){n^=-1;for(var t=0,r=e.length;t<r;t++)n=n>>>8^u[255&n^e[t]];return(-1^n)>>>0}function l(e,n,t=0){const r=e.getSeconds()>>1|e.getMinutes()<<5|e.getHours()<<11,o=e.getDate()|e.getMonth()+1<<5|e.getFullYear()-1980<<9;n.setUint16(t,r,1),n.setUint16(t+2,o,1)}function y({i:e,l:n},t){return 8*(!n||(null!=t?t:function(e){try{w.decode(e)}catch(e){return 0}return 1}(e)))}var w=new TextDecoder("utf8",{fatal:1});function p(t,r=0){const o=e(30);return o.setUint32(0,1347093252),o.setUint32(4,335546368|r),l(t.t,o,10),o.setUint16(26,t.i.length,1),n(o)}async function*b(e){let{o:n}=e;if("then"in n&&(n=await n),n instanceof Uint8Array)yield n,e.m=d(n,0),e.u=n.length;else{e.u=0;const t=n.getReader();for(;;){const{value:n,done:r}=await t.read();if(r)break;e.m=d(n,e.m),e.u+=n.length,yield n}}}function B(t){const r=e(16);return r.setUint32(0,1347094280),r.setUint32(4,t.m,1),r.setUint32(8,t.u,1),r.setUint32(12,t.u,1),n(r)}function v(t,r,o=0){const i=e(46);return i.setUint32(0,1347092738),i.setUint32(4,352523264),i.setUint16(8,2048|o),l(t.t,i,12),i.setUint32(16,t.m,1),i.setUint32(20,t.u,1),i.setUint32(24,t.u,1),i.setUint16(28,t.i.length,1),i.setUint16(40,33204,1),i.setUint32(42,r,1),n(i)}function D(e){return e instanceof File||e instanceof Response?[[e],[e]]:[[e.input,e.name,e.size],[e.input,e.lastModified]]}var h=e=>function(e){var n;let t=22;for(const r of e){if(!r.i)throw new Error("Every file must have a non-empty name.");if(isNaN(null!=(n=r.u)?n:NaN))throw new Error(`Missing size for file "${(new TextDecoder).decode(r.i)}".`);t+=2*r.i.length+r.u+92}return t}(function*(e){for(const n of e)yield a(...D(n)[0])}(e));function N(t,i={}){const f={"Content-Type":"application/zip","Content-Disposition":"attachment"};return Number.isInteger(i.length)&&i.length>0&&(f["Content-Length"]=i.length),i.metadata&&(f["Content-Length"]=h(i.metadata)),new Response(o(async function*(t,r){const o=[];let i=0,a=0;for await(const e of t){const n=y(e,r.buffersAreUTF8);yield p(e,n),yield e.i,yield*b(e),yield B(e),o.push(v(e,i,n)),o.push(e.i),a++,i+=46+e.i.length+e.u}let f=0;for(const e of o)yield e,f+=e.length;const s=e(22);s.setUint32(0,1347093766),s.setUint16(8,a,1),s.setUint16(10,a,1),s.setUint32(12,f,1),s.setUint32(16,i,1),yield n(s)}(async function*(e){for await(const n of e){const[e,t]=D(n);yield Object.assign(r(...t),a(...e))}}(t),i)),{headers:f})};
    return N;
  }
})();
