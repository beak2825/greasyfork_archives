// ==UserScript==
// @name         MangaKingdomDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic.k-manga.jp
// @icon         https://comic.k-manga.jp/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/536844-mangakingdomdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic.k-manga.jp/viewer/pc/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536844/MangaKingdomDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536844/MangaKingdomDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get config of current episode
  const contentInfo = await requestContentInfo();
  const totalPageAmount = contentInfo.numOfScenes;

  // show progress info
  const infoElement = document.createElement('div');
  infoElement.style = `position: fixed; top: 72px; left: 72px; z-index: 999999999; height: 48px; padding: 0 16px; display: flex; justify-content: center; align-items: center; font-size: 14px; font-family: Consolas, Monaco, "Microsoft YaHei"; background-color: #0984E3; color: #FFFFFF; border-radius: 4px;`;
  infoElement.textContent = `Collected Images: 0 of ${totalPageAmount}`;
  document.body.appendChild(infoElement);

  // get data of images
  const imageConfigs = await requestImageConfigs(contentInfo);

  // remove info element
  infoElement.remove();

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageConfigs.length,
    getImagePromises
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageConfigs
      .slice(startNum - 1, endNum)
      .map(config => getDecryptedImage(config)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(config) {
    return new Promise(resolve => {
      const image = document.createElement('img');
      image.src = config.url;
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = config.width;
        canvas.height = config.height;

        drawScrambledImageToCanvas(context, this, config.key, 0, 0, this.width, this.height);
        canvas.toBlob(resolve);

        // CanvasRenderingContext2D, img, key, 0, 0, width, height
        function drawScrambledImageToCanvas(t, r, n, i, a, o, u) {
          let m = 32, y = 32;
          if (o > 1000 || u > 1000) {
            m *= 3;
            y *= 3;
          } else if (o > 300 || u > 300) {
            m *= 2;
            y *= 2;
          }

          const LCGSRandom = (e) => {
            return {
              seed: e,
              value: e,
              get_next_value: function () {
                return this.value = (8741 * this.value + 30873) % 131071, this.value
              }
            }
          }

          let b = m - 2,
              g = y - 2,
              w = r.width / m,
              j = r.height / y,
              k = new Array(w * j),
              x = LCGSRandom(n);

          for (let _ = 0; _ < w * j; ++_) {
            k[_] = _;
          }

          for (var T = 0; T < w * j; ++T) {
            let S = x.get_next_value() % k.length,
                C = k[S],
                M = C % w * m + 1,
                E = Math.floor(C / w) * y + 1,
                I = T,
                W = I % w * b,
                O = Math.floor(I / w) * g;
            k.splice(S, 1);
            t.drawImage(r, M, E, b, g, i + W, a + O, b, g);
          }
        }
      }
    });
  }

  function requestContentInfo() {
    return new Promise(async resolve => {
      // start connecting
      const ws = new WebSocket('wss://ws.viewer.k-manga.jp/');
      ws.onmessage = onContentInfoReceived;

      // wait until WebSocket connected
      await new Promise(_resolve => {
        const timer = setInterval(() => {
          if (ws.readyState === ws.OPEN) { clearInterval(timer); _resolve(); }
        }, 100);
      });

      // send message to request content info
      const t = (new URLSearchParams(window.location.search)).get('p0');
      const o = (new URLSearchParams(window.location.search)).get('p1');
      ws.send(`REQUEST HEADER\nt=${t}&fn=64kb_QVGA_h&o=${o}`);

      function onContentInfoReceived(event) {
        if (event.data.size === 6) return;

        const reader = new FileReader();
        reader.onloadend = () => {
          const content = reader.result;
          const endIndex = content._bcp_toInteger(6, 10);
          const info = content._bcp_toString(16, endIndex);
          resolve(JSON.parse(info));

          // disconnect
          ws.close();
        }
        reader.readAsArrayBuffer(event.data);
      }
    });
  }

  async function requestImageConfigs(contentInfo) {
    // start connecting
    const ws = new WebSocket('wss://ws.viewer.k-manga.jp/');

    // wait until WebSocket connected
    await new Promise(resolve => {
      const timer = setInterval(() => {
        if (ws.readyState === ws.OPEN) { clearInterval(timer); resolve(); }
      }, 100);
    });

    // collect config of images
    const configs = [];
    const t = (new URLSearchParams(window.location.search)).get('p0');
    const o = (new URLSearchParams(window.location.search)).get('p1');
    const dk = contentInfo.dk;
    for (let i = 0, len = contentInfo.contentInfos.length; i < len; i++) {
      infoElement.textContent = `Collected Images: ${configs.length} of ${totalPageAmount}`;
      const requestMessage = `REQUEST DATA\nt=${t}&fn=${contentInfo.contentInfos[i].name}&o=${o}&dk=${dk}`;
      await getImageBase64(requestMessage);
    }

    // disconnect
    ws.close();

    return configs;

    function getImageBase64(requestMessage) {
      return new Promise(resolve => {
        ws.onmessage = onImageDataReceived;
        ws.send(requestMessage);

        function onImageDataReceived(event) {
          if (event.data.size === 6) return;

          const reader = new FileReader();
          reader.onloadend = () => {
            const content = reader.result;
            const i = content._bcp_toInteger(6, 10);
            const a = content._bcp_toString(16, i);
            const o = JSON.parse(a);
            const s = content._bcp_toInteger(16 + i, 3);
            for (let c = 19 + i, u = 0; u < s; ++u) {
              const f = content._bcp_toInteger(c, 10);
              c += 10;
              const d = content._bcp_toBase64(c, f);
              c += f;
              configs.push({
                url: `data:image/jpeg;base64,${d}`,
                width: o.scenes.at(u).images.at(0).width,
                height: o.scenes.at(u).images.at(0).height,
                key: o.scenes.at(u).images.at(0).key,
              });
            }

            resolve();
          }
          reader.readAsArrayBuffer(event.data);
        }
      });
    }
  }

})(axios, JSZip, saveAs, ImageDownloader);