// ==UserScript==
// @name         BookliveSpider
// @namespace    https://booklive.jp/
// @version      0.2
// @description  Image spider for booklive.jp | V0.2 添加对试读作品的扒图功能
// @author       DD1969
// @match        https://booklive.jp/bviewer/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/jszip/3.7.1/jszip.min.js
// @require      https://lib.baomitu.com/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452472/BookliveSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/452472/BookliveSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  // get ID of comic from URL
  const comicID = new URL(window.location.href).searchParams.get('cid');

  // collect config data
  const randomString = generateRandomString32(comicID);
  const contentInfoResponse = await axios.get(`https://booklive.jp/bib-api/bibGetCntntInfo?cid=${comicID}&dmytime=${Date.now()}&k=${randomString}`);
  const config = {
    id: comicID,
    title: contentInfoResponse.data.items[0].Title,
    contentServer: contentInfoResponse.data.items[0].ContentsServer,
    ctbl: contentInfoResponse.data.items[0].ctbl,
    ptbl: contentInfoResponse.data.items[0].ptbl,
    p: contentInfoResponse.data.items[0].p
  }

  // decrypt ctbl and ptbl in config
  config.ctbl = getDecryptedTable(config.id, randomString, config.ctbl);
  config.ptbl = getDecryptedTable(config.id, randomString, config.ptbl);

  // check if trial
  const isTrial = config.contentServer.includes('trial');

  // collect encrypted files data
  const getContentResponse = await axios.get(
    isTrial ?
    `${config.contentServer}/content.js` :
    `${config.contentServer}/sbcGetCntnt.php?cid=${comicID}&p=${config.p}`
  );

  console.log(getContentResponse);

  let files = Array.from(
    isTrial ?
    getContentResponse.data.matchAll(/(pages\\\/[a-zA-Z0-9_]*.jpg)[^A-Z]*orgwidth=\\\"(\d*)\\\" orgheight=\\\"(\d*)\\\"/gm) :
    getContentResponse.data.ttx.matchAll(/(pages\/[a-zA-Z0-9_]*.jpg)[^A-Z]*orgwidth="(\d*)" orgheight="(\d*)"/gm)
  ).map(page => ({
    filename: isTrial ? page[1].replace('\\', '') : page[1],
    width: parseInt(page[2]),
    height: parseInt(page[3]),
    src: isTrial ? `${config.contentServer}/${page[1].replace('\\', '')}/M_H.jpg` : `${config.contentServer}/sbcGetImg.php?cid=${config.id}&src=${encodeURIComponent(page[1])}&p=${config.p}`
  }));
  files = files.slice(0, files.length / 2);

  console.log(files);

  // setup control panel
  setupControlPanel(files.length);

  // setup ImageDownloader
  ImageDownloader({
    getImagePromises: () => {
      const startNum = parseInt(document.getElementById('start-input').value);
      const endNum = parseInt(document.getElementById('end-input').value);

      return files.slice(startNum - 1, endNum).map(file => getDecryptedImage(file))
    },
    isOKToDownload,
    title: config.title,
    zipOptions: { base64: true },
    cssVerticalDistance: 'top: 120px',
  });

  function ImageDownloader({
    getImagePromises,
    isOKToDownload = () => true,
    title = `package_${Date.now()}`,
    zipOptions = {},
    imageSuffix = 'jpg',
    cssVerticalDistance = 'top: 80px',
    cssHorizontalDistance = 'left: 80px'
  }) {
    // create download button element
    const dlBtn = document.createElement('button');
    dlBtn.textContent = 'Download';
    dlBtn.style = `
      position: fixed;
      ${cssVerticalDistance};
      ${cssHorizontalDistance};
      z-index: 9999999;

      width: 128px;
      height: 48px;

      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 14px;
      font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
      color: #fff;

      background-color: #0984e3;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    // setup click event callback
    dlBtn.onclick = function () {
      if (!isOKToDownload()) return;

      dlBtn.disabled = true;
      dlBtn.textContent = "Processing";
      dlBtn.style.backgroundColor = '#aaa';
      dlBtn.style.cursor = 'not-allowed';
      download(getImagePromises, title, zipOptions);
    }

    // add button to body
    document.body.appendChild(dlBtn);

    // download
    async function download(getImagePromises, title, zipOptions) {
      const images = await Promise.all(getImagePromises());

      // create zip
      const zip = new JSZip(); // JSZip library should be imported already
      const folder = zip.folder(title);
      images.forEach((image, index) => {
        const filename = `${index + 1}`.padStart(images.length >= 100 ? 3 : 2, '0') + `.${imageSuffix}`;
        folder.file(filename, image, zipOptions);
      });

      // pop up download window
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${title}.zip`); // FileSaver library should be imported already

      // change the text of download button
      dlBtn.innerText = "Completed";
    }
  }

  // setup control panel for page number input
  function setupControlPanel(maxNum) {
    const panelElement = document.createElement('div');
    const inputStyle = `
      width: 40%;
      height: 26px;

      border: 1px solid #aaa;
      border-radius: 4px;

      font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
      text-align: center;
    `;

    panelElement.innerHTML = `
      <input id="start-input" style="${inputStyle}" type="text" placeholder="1" />
      <span style="margin: 0 4px; transform: translateY(-0.5px);">to</span>
      <input id="end-input" style="${inputStyle}" type="text" placeholder="${maxNum}" />
    `;

    panelElement.style = `
      position: fixed;
      top: 72px;
      left: 72px;
      z-index: 888;

      box-sizing: border-box;
      width: 144px;
      height: 104px;
      padding: 8px;

      display: flex;
      justify-content: center;
      align-items: baseline;

      font-size: 14px;
      font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
      background-color: #f1f1f1;
      border: 1px solid #aaa;
      border-radius: 4px;
    `;

    document.body.appendChild(panelElement);
  }

  // check validity of page nums from input
  function isOKToDownload() {
    const maxNum = files.length;
    const startNum = parseInt(document.getElementById('start-input').value);
    const endNum = parseInt(document.getElementById('end-input').value);

    if (isNaN(startNum) || isNaN(endNum)) { alert("请正确输入数值\nPlease enter page number correctly."); return false; }
    if (startNum < 1 || endNum < 1) { alert("页码的值不能小于1\nPage number should not smaller than 1."); return false; }
    if (startNum > maxNum || endNum > maxNum) { alert(`页码的值不能大于${maxNum}\nPage number should not bigger than ${maxNum}.`); return false; }
    if (startNum > endNum) { alert("起始页码的值不能大于终止页码的值\nNumber of start should not bigger than number of end."); return false; }

    return true;
  }

  // get decrypted image
  function getDecryptedImage(file) {
    return new Promise(async resolve => {
      const encryptedImageBuffer = await axios.get(file.src, { responseType: 'arraybuffer' }).then(res => res.data);
      const encryptedImageBase64 = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(encryptedImageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      const encryptedImage = document.createElement('img');
      encryptedImage.onload = function () {
        // draw the encrypted image on temp canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = encryptedImage.width;
        tempCanvas.height = encryptedImage.height;
        tempCtx.drawImage(encryptedImage, 0, 0);

        // get coords
        const key = getDecryptionKey(file.filename);
        const decoder = new CoordDecoder(key[0], key[1]);
        const coords = decoder.getCoords({
          width: encryptedImage.width,
          height: encryptedImage.height
        });

        // create dest canvas
        const destCanvas = document.createElement('canvas');
        let destCtx = destCanvas.getContext('2d');
        destCanvas.width = file.width;
        destCanvas.height = file.height;

        // place pieces on correct position
        for (const coord of coords) {
          const piece = tempCtx.getImageData(coord.xsrc, coord.ysrc, coord.width, coord.height);
          destCtx.putImageData(piece, coord.xdest, coord.ydest);
        }

        // if trial, clear those transparent pixel
        if (isTrial) {
          let originWidth;
          for (let w = destCanvas.width; w >= 0; w--) {
            const px = destCanvas.getContext('2d').getImageData(w, 0, 1, 1);
            if (!Array.from(px.data).every(data => data === 0)) {
              originWidth = w;
              break;
            }
          }

          let originHeight;
          for (let h = destCanvas.height; h >= 0; h--) {
            const px = destCanvas.getContext('2d').getImageData(0, h, 1, 1);
            if (!Array.from(px.data).every(data => data === 0)) {
              originHeight = h;
              break;
            }
          }

          destCanvas.width = originWidth;
          destCanvas.height = originHeight;
          destCtx = destCanvas.getContext('2d');

          for (const coord of coords) {
            const piece = tempCtx.getImageData(coord.xsrc, coord.ysrc, coord.width, coord.height);
            destCtx.putImageData(piece, coord.xdest, coord.ydest);
          }
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''));
      }

      encryptedImage.src = encryptedImageBase64;
    });
  }

  // scrambled code extracted from speedbinb.js
  function generateRandomString32(id) {
    function generateRandomString16() {
      let e = "";
      let n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

      for (let i = 0; i < 16; i++) {
        e += n.charAt(Math.floor(Math.random() * n.length));
      }

      return e;
    }

    let n = generateRandomString16(),
      i = Array(Math.ceil(16 / id.length) + 1).join(id),
      r = i.substr(0, 16),
      e = i.substr(-16, 16),
      s = 0,
      h = 0,
      u = 0;
    return n.split("").map(function (t, i) {
      return s ^= n.charCodeAt(i),
        h ^= r.charCodeAt(i),
        u ^= e.charCodeAt(i),
        t + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" [s + h + u & 63]
    }).join("");
  }

  // scrambled code extracted from speedbinb.js
  function getDecryptedTable(t, i, n) { // id, randomString, table
    for (var r = t + ":" + i, e = 0, s = 0; s < r.length; s++)
      e += r.charCodeAt(s) << s % 16;
    0 == (e &= 2147483647) && (e = 305419896);
    var h = "",
      u = e;

    for (let s = 0; s < n.length; s++) {
      u = u >>> 1 ^ 1210056708 & -(1 & u);
      var o = (n.charCodeAt(s) - 32 + u) % 94 + 32;

      h += String.fromCharCode(o)
    }

    try {
      return JSON.parse(h)
    } catch (t) {}

    return null
  }

  // scrambled code extracted from speedbinb.js
  function getDecryptionKey(t) { // filename
    var i = [0, 0];
    if (t) {
      for (var n = t.lastIndexOf("/") + 1, r = t.length - n, e = 0; e < r; e++)
        i[e % 2] += t.charCodeAt(e + n);
      i[0] %= 8,
        i[1] %= 8
    }
    var s = config.ptbl[i[0]],
      h = config.ctbl[i[1]];

    return [h, s];
  }

  // scrambled code extracted from speedbinb.js
  class CoordDecoder {
    constructor(t, i) {
      this.It = null;
      this.kt = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
      var n = t.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/),
        r = i.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/);
      if (null !== n && null !== r && n[1] === r[1] && n[2] === r[2] && n[4] === r[4] && "+" === n[3] && "-" === r[3] && (this.T = parseInt(n[1], 10),
          this.j = parseInt(n[2], 10),
          this.xt = parseInt(n[4], 10),
          !(8 < this.T || 8 < this.j || 64 < this.T * this.j))) {
        var e = this.T + this.j + this.T * this.j;
        if (n[5].length === e && r[5].length === e) {
          var s = this.St(n[5]),
            h = this.St(r[5]);
          this.Ct = s.n,
            this.At = s.t,
            this.Tt = h.n,
            this.Pt = h.t,
            this.It = [];
          for (var u = 0; u < this.T * this.j; u++)
            this.It.push(s.p[h.p[u]])
        }
      }
    }

    St(t) {
      var i, n = [],
        r = [],
        e = [];
      for (i = 0; i < this.T; i++)
        n.push(this.kt[t.charCodeAt(i)]);
      for (i = 0; i < this.j; i++)
        r.push(this.kt[t.charCodeAt(this.T + i)]);
      for (i = 0; i < this.T * this.j; i++)
        e.push(this.kt[t.charCodeAt(this.T + this.j + i)]);
      return {
        t: n,
        n: r,
        p: e
      }
    }

    getCoords(t) {
      for (var i = t.width - 2 * this.T * this.xt, n = t.height - 2 * this.j * this.xt, r = Math.floor((i + this.T - 1) / this.T), e = i - (this.T - 1) * r, s = Math.floor((n + this.j - 1) / this.j), h = n - (this.j - 1) * s, u = [], o = 0; o < this.T * this.j; ++o) {
        var a = o % this.T,
          f = Math.floor(o / this.T),
          c = this.xt + a * (r + 2 * this.xt) + (this.Tt[f] < a ? e - r : 0),
          l = this.xt + f * (s + 2 * this.xt) + (this.Pt[a] < f ? h - s : 0),
          v = this.It[o] % this.T,
          d = Math.floor(this.It[o] / this.T),
          b = v * r + (this.Ct[d] < v ? e - r : 0),
          g = d * s + (this.At[v] < d ? h - s : 0),
          p = this.Tt[f] === a ? e : r,
          m = this.Pt[a] === f ? h : s;
        0 < i && 0 < n && u.push({
          xsrc: c,
          ysrc: l,
          width: p,
          height: m,
          xdest: b,
          ydest: g
        })
      }
      return u
    }
  }

})(axios, JSZip, saveAs);