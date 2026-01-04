// ==UserScript==
// @name         MangaFactorySpider
// @namespace    https://mangafactory.jp/
// @version      0.3
// @description  Image spider for mangafactory.jp | V0.3 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        *://r-cbs.mangafactory.jp/*/*/*
// @match        *://binb-cbs.mangafactory.jp/*/*/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     fontNotoSansSC https://fonts.loli.net/css2?family=Noto+Sans+SC&display=swap
// @downloadURL https://update.greasyfork.org/scripts/428479/MangaFactorySpider.user.js
// @updateURL https://update.greasyfork.org/scripts/428479/MangaFactorySpider.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs) {
  'use strict';

  function generateRandomString16() {
    let e = "";
    let n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for (let i = 0; i < 16; i++) {
      e += n.charAt(Math.floor(Math.random() * n.length));
    }

    return e;
  }

  function generateRandomString32(id) {
    let n = generateRandomString16(),
        i = Array(Math.ceil(16 / id.length) + 1).join(id),
        r = i.substr(0, 16),
        e = i.substr(-16, 16),
        s = 0,
        h = 0,
        u = 0;
    return n.split("").map(function(t, i) {
        return s ^= n.charCodeAt(i),
        h ^= r.charCodeAt(i),
        u ^= e.charCodeAt(i),
        t + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[s + h + u & 63]
    }).join("");
  }

  function decryptTable(t, i, n) { // id, randomString, table
    for (var r = t + ":" + i, e = 0, s = 0; s < r.length; s++)
        e += r.charCodeAt(s) << s % 16;
    0 == (e &= 2147483647) && (e = 305419896);
    var h = ""
      , u = e;

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

  function getDecryptionKey(t) { // filename
    var i = [0, 0];
    if (t) {
        for (var n = t.lastIndexOf("/") + 1, r = t.length - n, e = 0; e < r; e++)
            i[e % 2] += t.charCodeAt(e + n);
        i[0] %= 8,
        i[1] %= 8
    }
    var s = config.ptbl[i[0]]
      , h = config.ctbl[i[1]];

    return [h, s];
  }

  function getDecryptedImage(file) {
    return new Promise(async resolve => {
      const encryptedImageBuffer = await axios.get(file.src, { responseType: 'arraybuffer' }).then(res => res.data);
      const encryptedImageBase64 = 'data:image/jpg;base64,' + btoa(new Uint8Array(encryptedImageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
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
        const coords = decoder.getCoords({ width: encryptedImage.width, height: encryptedImage.height });

        // extract all pieces
        const pieces = [];
        for (let i = 0; i < coords.length; i++) {
          pieces.push(tempCtx.getImageData(coords[i].xsrc, coords[i].ysrc, coords[i].width, coords[i].height));
        }

        // create dest canvas
        const destCanvas = document.createElement('canvas');
        const destCtx = destCanvas.getContext('2d');
        destCanvas.width = file.width;
        destCanvas.height = file.height;

        // put pieces on the right place
        for (let i = 0; i < coords.length; i++) {
          destCtx.putImageData(pieces[i], coords[i].xdest, coords[i].ydest);
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''));
      }
      encryptedImage.src = encryptedImageBase64;
    });
  }

  function download(files, dlBtn) {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(getDecryptedImage(files[i]));
    }

    Promise.all(promises).then(pages => {
      const zip = new JSZip();
      const folder = zip.folder(config.title);

      for (let i = 0; i < pages.length; i++) {
        folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, pages[i], { base64: true });
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${config.title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    });
  }

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



  // get comic ID
  const contentElement = document.getElementById('content');
  const comicID = contentElement ? contentElement.dataset.ptbinbCid : null;
  if (!comicID) return;

  // collect config data
  const randomString = generateRandomString32(comicID);
  const contentInfoResponse = await axios.get(`http://r-cbs.mangafactory.jp/~/bibGetCntntInfo?cid=${comicID}&dmytime=${Date.now()}&k=${randomString}`);
  const config = {
    id: comicID,
    title: contentInfoResponse.data.items[0].Title,
    contentServer: 'http:' + contentInfoResponse.data.items[0].ContentsServer,
    ctbl: contentInfoResponse.data.items[0].ctbl,
    ptbl: contentInfoResponse.data.items[0].ptbl
  }

  // collect encrypted files data
  const getContentResponse = await axios.get(`http:${contentInfoResponse.data.items[0].ContentsServer}sbcGetCntnt.php?cid=${comicID}`);
  let files = Array.from(getContentResponse.data.ttx.matchAll(/(pages\/[a-zA-Z0-9_]*.jpg)[^A-Z]*orgwidth="(\d*)" orgheight="(\d*)"/gm))
                  .map(page => ({
                    filename: page[1],
                    width: parseInt(page[2]),
                    height: parseInt(page[3]),
                    src: `${config.contentServer}sbcGetImg.php?cid=${config.id}&src=${page[1]}`
                  }));
  files = files.slice(0, files.length / 2);

  // decrypt ctbl and ptbl in config
  config.ctbl = decryptTable(config.id, randomString, config.ctbl);
  config.ptbl = decryptTable(config.id, randomString, config.ptbl);

  // font setting
  GM_addStyle(GM_getResourceText('fontNotoSansSC'));

  // setup download button
  const titleElement = document.querySelector('.cst_title');
  const titleText = titleElement.innerText;
  titleElement.outerHTML = `
    <div class="cst_title" style="display: flex; flex-direction: column; justify-content: left; padding-bottom: 10px;">
      ${titleText}
      <button id="dl-btn" style="width: 6em; height: 2em; margin-top: 6px; padding-bottom: 6px; cursor: pointer; font-family: 'Noto Sans SC'; font-size: 0.8em;">下载全篇</button>
    </div>`;

  const dlBtn = document.querySelector('#dl-btn');
  dlBtn.addEventListener('click', function(e) {
    dlBtn.innerText = "正在处理";
    dlBtn.disabled = true;
    download(files, dlBtn);
  });

})(axios, JSZip, saveAs);