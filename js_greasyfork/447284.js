// ==UserScript==
// @name         DMMSpider
// @namespace    https://book.dmm.com/
// @version      0.3
// @description  Image spider for book.dmm.com | V0.3 修改cid和lin的值的判断方式
// @author       DD1969
// @match        https://book.dmm.com/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/jszip/3.7.1/jszip.min.js
// @require      https://lib.baomitu.com/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447284/DMMSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/447284/DMMSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    if (!window.location.href.includes('cid=')) return;

    const cid = new URLSearchParams(window.location.search).get('cid');
    const lin = new URLSearchParams(window.location.search).get('lin');

    if (cid === null) {
      throw Error(`Can't find 'cid' in url`);
      return;
    }

    if (lin === null) {
      throw Error(`Can't find 'lin' in url`);
      return;
    }

    const authURL = `https://book.dmm.com/viewerapi/auth/?cid=${cid}&lin=${lin}`;
    const auth = await new Promise(resolve => {
      GM_xmlhttpRequest ({
        method: 'GET',
        url: authURL,
        responseType: 'json',
        onload: res => resolve(res.response)
      });
    });

    const authParams = auth.auth_info ? `?Policy=${auth.auth_info.Policy}&Signature=${auth.auth_info.Signature}&Key-Pair-Id=${auth.auth_info['Key-Pair-Id']}` : '';

    const configURL = `${auth.url}configuration_pack.json${authParams}`;
    const config = await new Promise(resolve => {
      GM_xmlhttpRequest ({
        method: 'GET',
        url: configURL,
        responseType: 'json',
        onload: res => resolve(res.response)
      });
    });

    const imageData = [];
    for (let i = 0; i < config.configuration.contents.length; i++) {
      imageData.push({
        url: `${auth.url}${config.configuration.contents[i].file}/0.jpeg${authParams}`,
        pattern: Array.from(config.configuration.contents[i].file + '/0').reduce((acc, cur) => acc + cur.charCodeAt(0), 0) % 4 + 1
      });
    }

    // setup download panel
    const tocData = config.configuration['toc-list'];
    setupDownloadPanel(tocData, imageData);
  }

  function setupDownloadPanel(tocData, imageData) {
    tocData = tocData.map(item => {
      const from = item.href.match(/p-(.*)\.xhtml/)[1];
      return {
        from: from === 'cover' ? 1 : parseInt(from),
        title: item.label
      }
    });

    for (let i = 0; i < tocData.length; i++) {
      tocData[i].to = (i === tocData.length - 1) ? imageData.length : tocData[i + 1].from - 1;
    }

    // setup download panel
    const downloadPanel = document.createElement('div');
    document.body.appendChild(downloadPanel);
    downloadPanel.outerHTML = `
      <div class="download-panel" style="position: absolute; top: 60px; left: 40px; z-index: 99999999999; display: flex; flex-direction: column;">
        <select id="work-select" style="height: 28px; margin-bottom: 6px;">
          ${ tocData.map((data, index) => `<option value="${index}">${`[P${data.from} - P${data.to}] ${data.title}`}</option>`).join('') }
        </select>
        <button id="dl-btn" style="width: 100px; height: 30px; cursor: pointer;">下载</button>
      </div>
    `;

    // setup download button
    const dlBtn = document.getElementById('dl-btn');
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";

      const select = document.getElementById('work-select');
      const selectedWork = tocData[select.selectedIndex];
      download(imageData.slice(selectedWork.from - 1, selectedWork.to), selectedWork.title, dlBtn);
    }
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
        destCanvas.width = this.width - 2;
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
        dlBtn.disabled = false;
        dlBtn.innerText = "下载";
      });
    });
  }

})(axios, JSZip, saveAs);