// ==UserScript==
// @name         KindleMangaSpider
// @namespace    https://read.amazon.co.jp/
// @version      0.3
// @description  Image spider for read.amazon.co.jp | V0.3 添加AlloyLever控制台
// @author       DD1969
// @match        https://read.amazon.co.jp/manga/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/alloylever@1.0.4/alloy-lever.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443459/KindleMangaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/443459/KindleMangaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  if (!window.location.href.includes('vconsole')) {
    window.location.href = window.location.origin + window.location.pathname + '?vconsole=hide';
  }

  setupLoadingPanel();

  let data;
  try {
    const apiURL = `https://read.amazon.co.jp/api/manga/open-next-book/${window.location.pathname.replace(/\/manga\//, '')}`;
    data = await axios.get(apiURL).then(res => res.data);
  } catch (err) {
    alert('无法获取数据，请刷新页面重试或联系脚本作者');
    return;
  }

  const token = data.adpDeviceToken;
  const manifest = JSON.parse(data.manifest).manifest.resources;
  const imageDict = getImageDict();
  const mergedMap = await getMergedScrambleMap(manifest, token);

  setupDownloadPanel();

  // 设置数据未加载时的Loading面板
  function setupLoadingPanel() {
    const style = document.createElement('style');
    style.id = 'panel-style';
    style.innerText = `
      #panel {
        width: 212px;
        height: 124px;
        padding: 20px;
        position: fixed;
        top: 100px;
        left: calc(50% - 106px);
        z-index: 99999;
        background-color: #ffffff;
        border: 1px solid #229af6;
        border-radius: 4px;
        text-align: center;
        line-height: 84px;
        color: #0984e3;
      }
    `;

    const panel = document.createElement('div');
    panel.id = 'panel';
    panel.innerHTML = `<span>Loading...</span>`;

    document.head.appendChild(style);
    document.body.appendChild(panel);
  }

  // 设置加载完数据后的操作面板
  function setupDownloadPanel() {
    const style = document.getElementById('panel-style');
    style.innerText = `
      #panel {
        width: 212px;
        height: 124px;
        padding: 20px;
        position: fixed;
        top: 100px;
        left: calc(50% - 106px);
        z-index: 99999;
        background-color: #ffffff;
        border: 1px solid #229af6;
        border-radius: 4px;
      }

      .page-num-input {
        width: 74px;
        height: 32px !important;
        padding: 0 10px !important;
        text-align: center;
      }

      #dl-btn {
        display: block;
        width: 100%;
        margin-top: 6px;
        color: #fff;
        background-color: #0984e3;
        border: 1px solid #0984e3;
        border-radius: 4px;
      }

      #dl-btn:active {
        background-color: #53b0f8;
        border: 1px solid #53b0f8;
      }

      #dl-btn.disabled {
        background-color: #aaa;
        border: 1px solid #aaa;
        cursor: not-allowed;
      }

      #progress-bar {
        display: block;
        width: 100%;
        height: 18px;
        margin-top: 2px;
      }
    `;

    const panel = document.getElementById('panel');
    panel.innerHTML = `
      <div>
        <input class="page-num-input" id="start-input" type="number" placeholder="起始页码" />
        至
        <input class="page-num-input" id="end-input" type="number" placeholder="终止页码" />
      </div>
      <button id="dl-btn">Download</button>
      <progress id="progress-bar" value="0" max="999"></progress>
    `;

    // setup download button
    const dlBtn = document.getElementById('dl-btn');
    dlBtn.addEventListener('click', () => {
      const isValid = isValidDownloadRange();
      if (!isValid) return;

      dlBtn.innerText = 'Processing';
      dlBtn.disabled = true;
      dlBtn.classList.add('disabled');

      const startNum = parseInt(document.getElementById('start-input').value);
      const endNum = parseInt(document.getElementById('end-input').value);
      download(startNum, endNum);
    });
  }

  // 根据用户填写的起始和终止页码下载加密图片、解密、打包成zip、发起下载
  async function download(startNum, endNum) {
    updateProgressBar(0, endNum - startNum + 1);

    const images = [];
    for (let i = startNum; i <= endNum; i++) {
      const image = await getDecryptedImageBase64(imageDict[i - 1]);
      images.push(image);
      updateProgressBar(i - startNum + 1);
    }

    const title = `package_${Date.now()}`;
    const zip = new JSZip();
    const folder = zip.folder(title);

    for (let i = 0; i < images.length; i++) {
      folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, images[i], { base64: true });
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${title}.zip`);

      const dlBtn = document.getElementById('dl-btn');
      dlBtn.innerText = 'Download';
      dlBtn.disabled = false;
      dlBtn.classList.remove('disabled');

      updateProgressBar(0, 999);
    });
  }

  // 检查用户填写的起始和终止页码是否有效
  function isValidDownloadRange() {
    const maxNum = Object.keys(mergedMap).length;
    const startNum = parseInt(document.getElementById('start-input').value);
    const endNum = parseInt(document.getElementById('end-input').value);

    if (isNaN(startNum) || isNaN(endNum)) { alert("请正确输入数值"); return false; }
    if (startNum < 1 || endNum < 1) { alert("页码的值不能小于1"); return false; }
    if (startNum > maxNum || endNum > maxNum) { alert("页码的值不能大于" + maxNum); return false; }
    if (startNum > endNum) { alert("起始页码的值不能大于终止页码的值"); return false; }

    return true;
  }

  // 更新数据处理进度条的属性
  function updateProgressBar(value, max) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.value = value;
    max && (progressBar.max = max);
  }

  // 根据图片文件名下载加密图片、解密
  function getDecryptedImageBase64(imgFilename) {
    return new Promise(async resolve => {
      // 获取对应的解密map
      const map = mergedMap[imgFilename];
      const parsedCoords = [];
      for (let i = 0; i < 64; i++) {
        const [xdest, ydest, xsrc, ysrc, width, height] = map.slice(i * 6, i * 6 + 6);
        parsedCoords.push({ xdest, ydest, xsrc, ysrc, width, height });
      }

      // 获取被加密打乱的图片
      const encryptedImage = document.createElement('img');
      const encryptedImageBuffer = await getResource(manifest[imgFilename]);
      encryptedImage.src = 'data:image/jpg;base64,' + btoa(new Uint8Array(encryptedImageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      encryptedImage.onload = function() {
        // 创建临时canvas画布
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = encryptedImage.width;
        tempCanvas.height = encryptedImage.height;
        tempCtx.drawImage(encryptedImage, 0, 0);

        // 创建目标canvas画布
        const destCanvas = document.createElement('canvas');
        const destCtx = destCanvas.getContext('2d');
        destCanvas.width = imgFilename.match(/img_\d+_\d+_\d+_(\d+)_(\d+)/)[1];
        destCanvas.height = imgFilename.match(/img_\d+_\d+_\d+_(\d+)_(\d+)/)[2];

        // 提取所有碎片，然后将碎片放到目标画布正确的位置上
        for (let i = 0; i < parsedCoords.length; i++) {
          const piece = tempCtx.getImageData(parsedCoords[i].xsrc, parsedCoords[i].ysrc, parsedCoords[i].width, parsedCoords[i].height)
          destCtx.putImageData(piece, parsedCoords[i].xdest, parsedCoords[i].ydest);
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''));
      }
    });
  }

  // 生成由加密图片文件名构成的数组，数组下标和文件名一一对应
  function getImageDict() {
    const imageDict = [];
    Object.keys(manifest)
      .filter(key => key.startsWith('img'))
      .forEach(key => {
        const index = key.match(/img_(\d+)/)[1];
        imageDict[index] = key;
      });

    return imageDict;
  }

  // 获取所有用于解密的数据表，合并成一个表
  async function getMergedScrambleMap() {
    const promises = [];
    Object.entries(manifest).forEach(item => {
      item[0].startsWith('scramble_maps') && promises.push(getResource(item[1], token));
    });

    const maps = await Promise.all(promises);
    const mergedMap = maps.reduce((acc, cur) => Object.assign(acc, cur), {});

    return mergedMap;
  }

  // 发起请求，获取数据表或者加密图片
  async function getResource(config) {
    const {cde, requestDigest} = JSON.parse(config.url);

    const typeDict = {
      'image/jpeg': 'arraybuffer',
      'application/scramble-map+json': 'json'
    }

    const resource = await axios.get(cde, {
      withCredential: true,
      responseType: typeDict[config.type],
      headers: {
        'x-adp-attemptcount': 1,
        'x-adp-authentication-token': token,
        'x-adp-correlationid': getCorrelationId(),
        'x-adp-reason': 'DevicePurchase',
        'x-adp-request-digest': requestDigest,
        'x-adp-sw': '1170760200',
        'x-adp-transport': 'WiFi'
      }
    }).then(res => res.data);

    return resource;
  }

  // 生成请求header中所需的x-adp-correlationid
  function getCorrelationId() {
    function c() {
      return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
    }

    return c() + c() + "-" + c() + "-" + c() + "-" + c() + "-" + c() + c() + c();
  }

})(axios, JSZip, saveAs);