// ==UserScript==
// @name         ComicboostSpider
// @namespace    https://comic-boost.com/
// @version      0.2
// @description  Image spider for comic-boost.com | V0.2 修复域名匹配及CORS问题
// @author       DD1969
// @match        https://www.comic-boost.com/viewer.html*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439402/ComicboostSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/439402/ComicboostSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    const cid = window.location.search.replace('?', '').split('&')[0];
    const BID = window.localStorage['NFBR.Global/BrowserId'];

    if (!BID) {
      alert("请刷新页面以获取参数");
      return;
    }

    const licenseURL = `https://www.comic-boost.com/api4js/contents/license?${cid}&BID=${BID}`;
    const license = await new Promise(resolve => {
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: licenseURL,
        responseType: 'json',
        onload: res => resolve(res.response)
      });
    });

    const configURL = `${license.url}configuration_pack.json?Policy=${license.auth_info.Policy}&Signature=${license.auth_info.Signature}&Key-Pair-Id=${license.auth_info['Key-Pair-Id']}`;
    const config = await new Promise(resolve => {
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: configURL,
        responseType: 'json',
        onload: res => resolve(res.response)
      });
    });

    const title = document.querySelector('head title').innerText;
    const imageData = [];
    for (let i = 0; i < config.configuration.contents.length; i++) {
      imageData.push({
        url: `${license.url}${config.configuration.contents[i].file}/0.jpeg?Policy=${license.auth_info.Policy}&Signature=${license.auth_info.Signature}&Key-Pair-Id=${license.auth_info['Key-Pair-Id']}`,
        pattern: Array.from(config.configuration.contents[i].file + '/0').reduce((acc, cur) => acc + cur.charCodeAt(0), 0) % 4 + 1
      });
    }

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: fixed; top: 60px; left: 40px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";
      download(imageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function getDecodedImageBase64Promise(data) {
    return new Promise(async resolve => {
      const imageArraybuffer = await new Promise(resolve => {
        GM_xmlhttpRequest ( {
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const imageBase64 = 'data:image/jpg;base64,' + btoa(new Uint8Array(imageArraybuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      const image = document.createElement('img');
      image.onload = function () {
        const script = getScript(this.width, this.height, 64, 64, data.pattern);

        // 创建临时canvas画布
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.width;
        tempCanvas.height = this.height;
        tempCtx.drawImage(this, 0, 0);

        // 创建目标canvas画布
        const destCanvas = document.createElement('canvas');
        const destCtx = destCanvas.getContext('2d');
        destCanvas.width = this.width;
        destCanvas.height = this.height;

        for (let i = 0; i < script.length; i++) {
          const piece = tempCtx.getImageData(script[i].destX, script[i].destY, script[i].width, script[i].height);
          destCtx.putImageData(piece, script[i].srcX, script[i].srcY);
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''));
      }

      image.src = imageBase64;
    });
  }

  function getScript(e, t, r, i, n) {
    const calcPositionWithRest_ = function(e, t, r, i) {
      return e * i + (e >= t ? r : 0)
    }

    const calcXCoordinateXRest_ = function(e, t, r) {
      return (e + 61 * r) % t
    }

    const calcYCoordinateXRest_ = function(e, t, r, i, n) {
      var s, a, o = n % 2 == 1;
      return (e < t ? o : !o) ? (a = r,
                                 s = 0) : (a = i - r,
                                           s = r),
        (e + 53 * n + 59 * r) % a + s
    }

    const calcXCoordinateYRest_ = function(e, t, r, i, n) {
      var s, a, o = n % 2 == 1;
      return (e < r ? o : !o) ? (a = i - t,
                                 s = t) : (a = t,
                                           s = 0),
        (e + 67 * n + t + 71) % a + s
    }

    const calcYCoordinateYRest_ = function(e, t, r) {
      return (e + 73 * r) % t
    }

    var s, a, o, u, c, p, l, m, d, h, y = Math.floor(e / r), g = Math.floor(t / i), f = e % r, b = t % i, S = [];
    if (s = y - 43 * n % y,
        s = s % y == 0 ? (y - 4) % y : s,
        s = 0 == s ? y - 1 : s,
        a = g - 47 * n % g,
        a = a % g == 0 ? (g - 4) % g : a,
        a = 0 == a ? g - 1 : a,
        f > 0 && b > 0 && (o = s * r,
                           u = a * i,
                           S.push({
      srcX: o,
      srcY: u,
      destX: o,
      destY: u,
      width: f,
      height: b
    })),
        b > 0)
      for (l = 0; l < y; l++)
        d = calcXCoordinateXRest_(l, y, n),
          h = calcYCoordinateXRest_(d, s, a, g, n),
          c = calcPositionWithRest_(d, s, f, r),
          p = h * i,
          o = calcPositionWithRest_(l, s, f, r),
          u = a * i,
          S.push({
          srcX: o,
          srcY: u,
          destX: c,
          destY: p,
          width: r,
          height: b
        });
    if (f > 0)
      for (m = 0; m < g; m++)
        h = calcYCoordinateYRest_(m, g, n),
          c = (d = calcXCoordinateYRest_(h, s, a, y, n)) * r,
          p = calcPositionWithRest_(h, a, b, i),
          o = s * r,
          u = calcPositionWithRest_(m, a, b, i),
          S.push({
          srcX: o,
          srcY: u,
          destX: c,
          destY: p,
          width: f,
          height: i
        });
    for (l = 0; l < y; l++)
      for (m = 0; m < g; m++)
        h = (m + 37 * n + 41 * (d = (l + 29 * n + 31 * m) % y)) % g,
          c = d * r + (d >= calcXCoordinateYRest_(h, s, a, y, n) ? f : 0),
          p = h * i + (h >= calcYCoordinateXRest_(d, s, a, g, n) ? b : 0),
          o = l * r + (l >= s ? f : 0),
          u = m * i + (m >= a ? b : 0),
          S.push({
          srcX: o,
          srcY: u,
          destX: c,
          destY: p,
          width: r,
          height: i
        });
    return S;
  }

  function download(imageData, title, dlBtn) {
    const promises = [];
    imageData.forEach(data => promises.push(getDecodedImageBase64Promise(data)));

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);
      images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpeg`, image, { base64: true }));

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    });
  }

})(axios, JSZip, saveAs);