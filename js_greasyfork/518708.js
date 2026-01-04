// ==UserScript==
// @name         CiaoPlusDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.3
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for ciao.shogakukan.co.jp
// @icon         https://ciao.shogakukan.co.jp/comics/img/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/518708-ciaoplusdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://ciao.shogakukan.co.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/crypto-js@4.1.1/crypto-js.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/518708/CiaoPlusDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/518708/CiaoPlusDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, CryptoJS, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/ciao.shogakukan\.co\.jp\/comics\/title\/\d+\/episode\/\d+/;
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

  // build config
  const config = {
    episodeID: window.location.pathname.match(/\/episode\/(?<episodeID>\d+)/).groups.episodeID,
    apiServerUrl: unsafeWindow.__NUXT__.config.public.apiServerUrl,
    version: unsafeWindow.__NUXT__.config.public.appVersion,
    platform: unsafeWindow.__NUXT__.config.public.platform.toString(),
  }

  // get episode data
  const episodeData = await fetch(`${config.apiServerUrl}/episode/list`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-Bambi-Hash': getBambiHash({ version: config.version, platform: config.platform, episode_id_list: config.episodeID }),
      'X-Bambi-Is-Crawler': 'false'
    },
    body: `version=${config.version}&platform=${config.platform}&episode_id_list=${config.episodeID}`
  }).then(res => res.json());

  // get page data
  const params = { version: config.version, platform: config.platform, episode_id: config.episodeID };
  const pageData = await fetch(`${config.apiServerUrl}/web/episode/viewer?${new URLSearchParams(params)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Bambi-Hash': getBambiHash(params),
      'X-Bambi-Is-Crawler': 'false'
    }
  }).then(res => res.json());

  // get title, url of images and scramble seed
  const title = episodeData.episode_list.pop().episode_name;
  const imageURLs = pageData.page_list;
  const scrambleSeed = pageData.scramble_seed || 1;

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageURLs
      .slice(startNum - 1, endNum)
      .map(url => getDecryptedImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(url) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data);
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);

        const xs = (e, i) => {
          e > i && ([e, i] = [i, e]);
          const t = (s, o) => s ? t(o % s, s) : o;
          return e * i / t(e, i)
        }

        const Cs = (e, i, t) => {
          if (e < t || i < t)
            return null;
          const s = xs(t, 8);
          return e > s && i > s && (e = Math.floor(e / s) * s,
          i = Math.floor(i / s) * s),
          {
            width: Math.floor(e / t),
            height: Math.floor(i / t)
          }
        }

        const Ts = function*(e) {
          const i = Uint32Array.of(e);
          for (; ;)
            i[0] ^= i[0] << 13,
            i[0] ^= i[0] >>> 17,
            i[0] ^= i[0] << 5,
            yield i[0]
        }

        const Ls = (e, i) => {
          const t = Ts(i);
          return e.map(o => [t.next().value, o]).sort( (o, l) => +(o[0] > l[0]) - +(l[0] > o[0])).map(o => o[1])
        }

        const Is = function*(e, i) {
          yield*Ls([...Array(e ** 2)].map((s, o) => o), i).map((s, o) => ({
            source: {
              x: s % e,
              y: Math.floor(s / e)
            },
            dest: {
              x: o % e,
              y: Math.floor(o / e)
            }
          }))
        }

        const o = Cs(this.width, this.height, 4);
        for (const l of Is(4, scrambleSeed)) {
          context.drawImage(this, l.source.x * o.width, l.source.y * o.height, o.width, o.height, l.dest.x * o.width, l.dest.y * o.height, o.width, o.height);
        }

        canvas.toBlob(resolve);
      }
    });
  }

  function getBambiHash(params) {
    const SHA256 = (stringContent) => CryptoJS.SHA256(stringContent).toString(CryptoJS.enc.Hex);
    const SHA512 = (stringContent) => CryptoJS.SHA512(stringContent).toString(CryptoJS.enc.Hex);
    const keys = Object.keys(params).sort();
    const arr = [];
    for (const key of keys) {
      arr.push(`${SHA256(key)}_${SHA512(params[key])}`);
    }

    return SHA512(SHA256(arr.toString()));
  }

})(axios, JSZip, saveAs, CryptoJS, ImageDownloader);