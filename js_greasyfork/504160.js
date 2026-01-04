// ==UserScript==
// @name         bomtoon长截图
// @namespace    summer-script
// @version      0.5
// @description  获取bomtoon图源
// @author       summer
// @match        https://www.bomtoon.com/*
// @match        https://www.bomtoon.tw/*
// @icon         https://image.balcony.studio/BOMTOON_COM/images/common/favicon.ico
// @license      GPL-3.0
// @grant        GM_download
// @connect      image.balcony.studio
// @downloadURL https://update.greasyfork.org/scripts/504160/bomtoon%E9%95%BF%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/504160/bomtoon%E9%95%BF%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const IMG_HEIGHT_MAX = 32000;
  const IMG_HEIGHT_DEFAULT = 9000;
  const WAIT_GET_IMG = 1000;
  const DOMAIN_KO = "www.bomtoon.com";
  const DOMAIN_TW = "www.bomtoon.tw";

  var tip = {
    initializing: "初始化中",
    startRun: "开始截图",
    running: "正在截图",
    progress: "正在截图 {1}%",
    finish: "截图完毕",
    notSupport: "发生错误, 当前作品不支持或脚本已失效",
    maxHeightLab: "截图高度",
    maxHeightTip: "最大" + IMG_HEIGHT_MAX,
  };
  var ui = initUI();
  var cache = {};

  // 0: 未运行, 1: 正在运行, 2: 正在停止, 3: 已完成
  var runstatus = 0;

  ui.listenBtn(run);
  ui.updateBtnText(tip.startRun);

  setInterval(function () {
    var inViewerPage = location.pathname.startsWith("/viewer/");
    if (!inViewerPage) {
      ui.hide();
      if (3 === runstatus) {
        runstatus = 0;
      }
      if (0 !== runstatus) {
        runstatus = 2;
      }
    } else {
      if (0 === runstatus) {
        ui.show();
        ui.updateBtnText(tip.startRun);
        ui.enableBtn();
      }
    }
  }, 1000);

  async function run() {
    runstatus = 1;
    ui.disableBtn();
    cleanDecryptScrambleKey();
    var maxHeight = ui.getInput();
    if (!maxHeight) {
      maxHeight = IMG_HEIGHT_DEFAULT;
      ui.setInput(maxHeight);
    }
    ui.updateBtnText(tip.running);

    var progress = 0;
    var bookData = await getBookData();
    var images = bookData.images;
    var canvas = initPageCanvas(bookData, maxHeight);

    for (var i = 0; i < images.length; i++) {
      if (2 === runstatus) {
        runstatus = 0;
        return;
      }
      await waitMs(WAIT_GET_IMG);
      progress = Math.round(((i + 1) / images.length) * 100);
      ui.updateBtnText(tip.progress, progress);
      var page = images[i];
      var img = await getPageImage(page);
      if (!img) {
        i--;
        cleanDecryptScrambleKey();
        images = await getBookImages();
        continue;
      }
      drawPageImage(canvas, page, img);

      if (!isDrawFull(canvas)) {
        revokeImgBlobURL(img);
        continue;
      }
      await downloadCanvas(canvas, bookData);
      resetPageDraw(canvas);

      if (isDrawOverflow(canvas)) {
        i--;
        continue;
      }
      revokeImgBlobURL(img);
    }
    ui.updateBtnText(tip.finish);
    runstatus = 3;
  }

  async function decryptScramble(cipherText, key) {
    var iv = key.substring(0, 16);
    var cipherData = base64ToArrayBuffer(cipherText);
    key = new TextEncoder().encode(key);
    iv = new TextEncoder().encode(iv);

    var keyObj = await window.crypto.subtle.importKey(
      "raw",
      key,
      {
        name: "AES-CBC",
        length: 256,
      },
      true,
      ["decrypt"]
    );

    var plainData = await window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      keyObj,
      cipherData
    );
    var json = new TextDecoder().decode(new Uint8Array(plainData));

    return JSON.parse(json);
  }

  async function getDecryptScrambleKey(dataLine) {
    var defaultKey = "thisisBalconyScrambledKey1234!@#";
    if (!dataLine) {
      cache.scrambleKey = defaultKey;
    }
    if (cache.scrambleKey) {
      return cache.scrambleKey;
    }
    var pathName = location.pathname;
    var regex = new RegExp(/\/viewer\/(.+?)\/(.+?)(\/|$)/);
    var urlParam = regex.exec(pathName);
    var queryParam = {
      alias: urlParam[1],
      epAlias: urlParam[2],
    };
    var pathEpisode = `/${queryParam.alias}/${queryParam.epAlias}`;
    var keyAPI = "/api/balcony-api-v2/contents/images" + pathEpisode;
    var dataPost = { line: dataLine };
    var resp = await apiReq(keyAPI, "POST", dataPost);
    cache.scrambleKey = resp.data ? resp.data : defaultKey;

    return cache.scrambleKey;
  }

  async function getAuthToken() {
    var resp = await fetch("/api/auth/session");
    var data = await resp.json();

    if (!data.user) {
      return null;
    }

    return data.user.accessToken.token;
  }

  async function apiReq(url, method, dataPost) {
    var authToken = await getAuthToken();
    var headerBalconyKO = {
      "x-balcony-id": "BOMTOON_COM",
      "x-balcony-timezone": "Asia/Seoul",
      "x-platform": "WEB",
    };
    var headerBalconyTW = {
      "x-balcony-id": "BOMTOON_TW",
      "x-balcony-timezone": "Asia/Taipei",
      "x-platform": "WEB",
    };
    var body = null;
    var headers = DOMAIN_KO === location.host
      ? headerBalconyKO
      : headerBalconyTW;

    headers.accept = "application/json";

    if ("POST" === method.toLocaleUpperCase()) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(dataPost);
    }
    if (authToken) {
      headers.authorization = "Bearer " + authToken;
    }
    var opt = { headers, method, body };
    var resp = await fetch(url, opt);
    var data = await resp.json();

    return data;
  }

  async function getBookData() {
    var dataAPI = getAPIUrl();
    var resp = await fetch(dataAPI, { headers: { "X-Nextjs-Data": 1 } });
    var respData = await resp.json();

    if (respData.pageProps.episodeData) {
      return respData.pageProps.episodeData.result;
    }
    var pathName = location.pathname;
    var dataAPI = `/api/balcony-api-v2/contents${pathName}?isNotLoginAdult=false`;
    var respData = await apiReq(dataAPI, "GET");
    return respData.data;
  }

  async function getBookImages() {
    var bookData = await getBookData();
    return bookData.images;
  }

  async function getPageImage(page) {
    var imgURL = page.imagePath;
    var img = null;
    try {
      img = await loadImage(imgURL);
    } catch (error) {
      console.log("img load failed");
      return null;
    }
    if (page.point) {
      page.scrambleIndex = page.point;
    }
    if (!page.scrambleIndex) {
      return img;
    }
    var decryptKey = await getDecryptScrambleKey(page.line);
    page.scrambleIndex = await decryptScramble(page.scrambleIndex, decryptKey);
    img = await drawImageScramble(img, page);
    page.imagePath = img.src;
    page.scrambleIndex = null;
    page.point = null;
    page.line = null;

    return img;
  }

  function getBuildId() {
    var json = document.getElementById("__NEXT_DATA__").innerHTML;

    var data = JSON.parse(json);
    if (!data) {
      return null;
    }
    return data.buildId;
  }

  function getAPIUrl() {
    var buildId = getBuildId();
    var pathName = location.pathname;
    var regex = new RegExp(/\/viewer\/(.+?)\/(.+?)(\/|$)/);
    var urlParam = regex.exec(pathName);
    var queryParam = new URLSearchParams();
    queryParam.append("alias", urlParam[1]);
    queryParam.append("epAlias", urlParam[2]);
    var dataAPI = `/_next/data/${buildId}${pathName}.json?${queryParam}`;

    return dataAPI;
  }

  function cleanDecryptScrambleKey() {
    cache.scrambleKey = null;
  }

  function waitMs(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function drawImageScramble(img, page) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");

    page.scrambleIndex.forEach(function (i, r) {
      let s = page.width / 4,
        a = page.defaultHeight / 4,
        d = (r % 4) * s,
        c = Math.floor(r / 4) * a,
        u = (i % 4) * s,
        g = Math.floor(i / 4) * a;
      ctx.drawImage(img, d, c, s, a, u, g, s, a);
    });

    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        loadImage(url).then(resolve);
      });
    });
  }

  function initPageCanvas(bookData, maxHeight) {
    var images = bookData.images;
    var canvas = document.createElement("canvas");
    var width = 0;
    var heightSum = 0;

    images.forEach(function (image) {
      if (!width) {
        width = image.width;
      }
      heightSum += image.height;
    });
    if (heightSum < maxHeight) {
      maxHeight = heightSum;
    }
    canvas.width = width;
    canvas.height = maxHeight;

    canvas.dataset.heightcurrent = 0;
    canvas.dataset.heightremain = heightSum;
    canvas.dataset.downloadno = 1;

    return canvas;
  }

  function drawPageImage(canvas, page, img) {
    var heightCurrent = parseInt(canvas.dataset.heightcurrent);
    var heightRemain = parseInt(canvas.dataset.heightremain);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, heightCurrent);

    if (heightCurrent < 0) {
      // overflow remain draw
      heightRemain -= heightCurrent;
    }
    heightCurrent += page.height;

    // heightCurrent(9000) + page.height(3000) = heightCurrent(12000)
    // heightCurrent(12000) > canvas.height(10000)
    // heightCurrent(12000) - canvas.height(10000) = drawRemaining(2000)
    // page.height(3000) - drawRemaining(2000) = drawnHeight(1000)
    // drawnHeight(1000) * -1 = drawOffset(-1000)

    if (heightCurrent > canvas.height) {
      // overflow
      var drawRemaining = heightCurrent - canvas.height;
      var drawnHeight = page.height - drawRemaining;
      var drawOffset = -1 * drawnHeight;
      heightCurrent = drawOffset;
      heightRemain -= drawnHeight;
    } else {
      // no overflow
      heightRemain -= page.height;
    }

    canvas.dataset.heightcurrent = heightCurrent;
    canvas.dataset.heightremain = heightRemain;
  }

  function isDrawFull(canvas) {
    var heightCurrent = parseInt(canvas.dataset.heightcurrent);

    return heightCurrent < 0 || heightCurrent >= canvas.height;
  }

  function isDrawOverflow(canvas) {
    var heightCurrent = parseInt(canvas.dataset.heightcurrent);

    return heightCurrent < 0;
  }

  function resetPageDraw(canvas) {
    var heightRemain = parseInt(canvas.dataset.heightremain);
    var heightCurrent = parseInt(canvas.dataset.heightcurrent);
    var downloadNo = parseInt(canvas.dataset.downloadno);

    if (heightRemain < canvas.height) {
      canvas.height = heightRemain;
    }
    if (heightCurrent >= canvas.height) {
      canvas.dataset.heightcurrent = 0;
    }
    canvas.dataset.downloadno = downloadNo + 1;

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        resolve(this);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  function downloadCanvas(canvas, bookData) {
    var title = `${bookData.contentsTitle} - ${bookData.title}`;
    var pageNo = canvas.dataset.downloadno;
    pageNo = pageNo.padStart(2, "0");
    var filename = `${title} - ${pageNo}.png`;

    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        if (!blob) {
          console.log("blob null");
          resolve();
          return;
        }
        var blobURL = URL.createObjectURL(blob);
        GM_download({
          name: filename,
          url: blobURL,
          onload: function () {
            URL.revokeObjectURL(blobURL);
            resolve();
          },
        });
      });
    });
  }

  function revokeImgBlobURL(img) {
    var url = img.src;
    var protocol = new URL(url).protocol;

    if ("blob:" === protocol) {
      URL.revokeObjectURL(url);
    }
  }

  function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function initUI() {
    var ui = {
      btn: null,
      inputLm: null,
      labelLm: null,
      listenBtn: function (cb) {
        this.btn.addEventListener("click", cb);
      },
      disableBtn: function () {
        this.btn.disabled = true;
        this.inputLm.disabled = true;
      },
      enableBtn: function () {
        this.btn.disabled = false;
        this.inputLm.disabled = false;
      },
      show: function () {
        this.btn.style.display = "block";
        this.inputLm.style.display = "block";
        this.labelLm.style.display = "block";
      },
      hide: function () {
        this.btn.style.display = "none";
        this.inputLm.style.display = "none";
        this.labelLm.style.display = "none";
      },
      getInput: function () {
        return this.inputLm.value;
      },
      setInput: function (val) {
        this.inputLm.value = val;
      },
      updateBtnText: function (text) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.btn.innerText = text.replace(/{(\d+)}/g, function (match, num) {
          var key = num - 1;
          return "undefined" !== typeof args[key] ? args[key] : match;
        });
      },
    };
    var btn = document.createElement("button");
    btn.innerText = tip.initializing;
    btn.style.display = "none";
    btn.style.position = "fixed";
    btn.style.top = "40px";
    btn.style.right = "50px";
    btn.style.zIndex = "10030";
    btn.style.padding = "9px";
    btn.style.background = "#fff";
    btn.style.border = "1px solid #aaa";
    btn.style.borderRadius = "4px";
    btn.style.minWidth = "112px";
    btn.style.color = "#000";
    btn.style.cursor = "pointer";
    btn.style.lineHeight = "16px";
    btn.style.fontSize = "14px";
    document.body.appendChild(btn);
    ui.btn = btn;

    var label = document.createElement("label");
    label.innerText = tip.maxHeightLab;
    label.style.display = "none";
    label.style.position = "fixed";
    label.style.top = "90px";
    label.style.right = "50px";
    label.style.zIndex = "10030";
    label.style.padding = "9px";
    label.style.background = "#eee";
    label.style.border = "1px solid #aaa";
    label.style.borderRadius = "4px 4px 0 0";
    label.style.color = "#000";
    label.style.lineHeight = "16px";
    label.style.borderBottom = "none";
    label.style.fontSize = "14px";
    label.style.textAlign = "center";
    label.style.width = "112px";
    document.body.appendChild(label);
    ui.labelLm = label;

    var text = document.createElement("input");
    text.placeholder = tip.maxHeightTip;
    text.type = "text";
    text.style.display = "none";
    text.style.position = "fixed";
    text.style.top = "124px";
    text.style.right = "50px";
    text.style.zIndex = "10030";
    text.style.padding = "9px";
    text.style.background = "#fff";
    text.style.border = "1px solid #aaa";
    text.style.borderRadius = "0 0 4px 4px";
    text.style.width = "112px";
    text.style.color = "#000";
    text.style.lineHeight = "16px";
    text.style.fontSize = "14px";
    text.style.textAlign = "center";

    text.addEventListener("keyup", function () {
      this.value = this.value.replace(/\D/g, "");
      var value = parseInt(this.value);
      var min = 0;
      var max = IMG_HEIGHT_MAX;
      if (value > max) {
        this.value = max;
      }
      if (value < min) {
        this.value = min;
      }
    });
    document.body.appendChild(text);
    ui.inputLm = text;

    return ui;
  }
})();
