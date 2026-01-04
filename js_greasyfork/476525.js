// ==UserScript==
// @name         PixivComicDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      1.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic.pixiv.net
// @icon         https://comic.pixiv.net/static/images/icons/icon-192x192.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451877-pixivcomicdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic.pixiv.net/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/crypto-js@4.1.1/crypto-js.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/476525/PixivComicDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/476525/PixivComicDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, CryptoJS, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/comic\.pixiv\.net\/viewer\/stories\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  // get salt
  const salt = await new Promise(resolve => {
    const timer = setInterval(() => {
      const salt = unsafeWindow?.__NEXT_DATA__?.props?.pageProps?.salt;
      if (salt) { clearInterval(timer); resolve(salt); }
    }, 200);
  });

  // generate time string and hash
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  const time = `${year}-${month}-${date}T${hour}:${minute}:${second}+08:00`;
  const hash = CryptoJS.SHA256(`${time}${salt}`).toString();

  // get title and pages
  const { work_title, title, pages } = await axios({
    method: 'GET',
    url: `https://comic.pixiv.net/api/app/episodes/${window.location.pathname.split('/').pop()}/read_v4`,
    headers: {
      'x-client-time': time,
      'x-client-hash': hash,
      'x-requested-with': 'pixivcomic'
    }
  }).then(res => res.data.data.reading_episode);

  const newtitle = `${work_title} ${title}`;
  let lasttitle = newtitle.replace(/(\?|\~|\/|\:|\<|\>)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            '<':'＜',
            '>':'＞',
            }[$1];
            });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: lasttitle,
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(page) {
    return new Promise(async resolve => {
      // get image in arraybuffer
      const imageArrayBuffer = await axios.get(page.url, {
        headers: { 'X-Cobalt-Thumber-Parameter-Gridshuffle-Key': page.key },
        responseType: 'arraybuffer'
      }).then(res => res.data);

      // load image on canvas
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = async function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = page.width;
        canvas.height = page.height;
        ctx.drawImage(image, 0, 0);

        // process image data
        const imageData = ctx.getImageData(0, 0, page.width, page.height);
        const decryptedImageData = await decryptImage(imageData.data, 4, page.width, page.height, page.gridsize, page.gridsize, "4wXCKprMMoxnyJ3PocJFs4CYbfnbazNe", page.key, true);
        ctx.putImageData(new ImageData(decryptedImageData, page.width, page.height), 0, 0);

        canvas.toBlob(resolve);
      }
    });
  }

  // scramble code extracted from scripts loaded by page
  async function decryptImage(e, t, r, i, s, n, a, l, o) {
    function tE(e, t) {
      return (e << (t %= 32) >>> 0 | e >>> 32 - t) >>> 0
    }

    class tS {
      next() {
        let e = 9 * tE(5 * this.s[1] >>> 0, 7) >>> 0,
          t = this.s[1] << 9 >>> 0;
        return this.s[2] = (this.s[2] ^ this.s[0]) >>> 0, this.s[3] = (this.s[3] ^ this.s[1]) >>> 0, this.s[1] = (this.s[1] ^ this.s[2]) >>> 0, this.s[0] = (this.s[0] ^ this.s[3]) >>> 0, this.s[2] = (this.s[2] ^ t) >>> 0, this.s[3] = tE(this.s[3], 11), e
      }
      constructor(e) {
        if (4 !== e.length) throw Error("seed.length !== 4 (seed.length: ".concat(e.length, ")"));
        this.s = new Uint32Array(e), 0 === this.s[0] && 0 === this.s[1] && 0 === this.s[2] && 0 === this.s[3] && (this.s[0] = 1)
      }
    }

    if (t <= 0 || r <= 0 || i <= 0 || s <= 0 || n <= 0) throw Error("bytesPerElement <= 0 || width <= 0 || height <= 0 || blockSizeH <= 0 || blockSizeV <= 0 (bytesPerElement: ".concat(t, ", width: ").concat(r, ", height: ").concat(i, ", blockSizeH: ").concat(s, ", blockSizeV: ").concat(n, ")"));
    if (!Number.isSafeInteger(t) || !Number.isSafeInteger(r) || !Number.isSafeInteger(i) || !Number.isSafeInteger(s) || !Number.isSafeInteger(n)) throw Error("!Number.isSafeInteger(bytesPerElement) || !Number.isSafeInteger(width) || !Number.isSafeInteger(height) || !Number.isSafeInteger(blockSizeH) || !Number.isSafeInteger(blockSizeV) (bytesPerElement: ".concat(t, ", width: ").concat(r, ", height: ").concat(i, ", blockSizeH: ").concat(s, ", blockSizeV: ").concat(n, ")"));
    if (e.length !== r * i * t) throw Error("data.length !== width * height * bytesPerElement (data.length: ".concat(e.length, ", width: ").concat(r, ", height: ").concat(i, ", bytesPerElement: ").concat(t, ")"));
    let d = Math.ceil(i / n),
      c = Math.floor(r / s),
      u = Array(d).fill(null).map(() => Array.from(Array(c).keys())); {
      let e = new TextEncoder().encode(a + l),
        t = await crypto.subtle.digest("SHA-256", e),
        r = new Uint32Array(t, 0, 4),
        i = new tS(r);
      for (let e = 0; e < 100; e++) i.next();
      for (let e = 0; e < d; e++) {
        let t = u[e];
        for (let e = c - 1; e >= 1; e--) {
          let r = i.next() % (e + 1),
            s = t[e];
          t[e] = t[r], t[r] = s
        }
      }
    }
    if (o)
      for (let e = 0; e < d; e++) {
        let t = u[e],
          r = t.map((e, r) => t.indexOf(r));
        if (r.some(e => e < 0)) throw Error("Failed to reverse shuffle table");
        u[e] = r
      }
    let h = new Uint8ClampedArray(e.length);
    for (let a = 0; a < i; a++) {
      let i = Math.floor(a / n),
        l = u[i];
      for (let i = 0; i < c; i++) {
        let n = l[i],
          o = i * s,
          d = (a * r + o) * t,
          c = n * s,
          u = (a * r + c) * t,
          p = s * t;
        for (let t = 0; t < p; t++) h[d + t] = e[u + t]
      } {
        let i = c * s,
          n = (a * r + i) * t,
          l = (a * r + r) * t;
        for (let t = n; t < l; t++) h[t] = e[t]
      }
    }
    return h
  }

})(axios, JSZip, saveAs, CryptoJS, ImageDownloader);
