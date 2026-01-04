// ==UserScript==
// @name         MagapokeDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for pocket.shonenmagazine.com
// @icon         https://pocket.shonenmagazine.com/img/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/536294-magapokedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://pocket.shonenmagazine.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/crypto-js@4.1.1/crypto-js.js
// @require      https://update.greasyfork.org/scripts/539610/1639733/ImageDownloaderLibla2.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536323/MagapokeDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536323/MagapokeDownloader.meta.js
// ==/UserScript==
 
(async function(axios, JSZip, saveAs, CryptoJS, ImageDownloader) {
  'use strict';
 
  // reload page when enter or leave chapter
  const re = /https:\/\/pocket\.shonenmagazine\.com\/title\/\d+\/episode\/\d+/;
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
    platform: unsafeWindow.__NUXT__.config.public.platform.toString(),
  }
 
  // get episode data
  const episodeData = await fetch(`${config.apiServerUrl}/episode/list`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-Manga-Hash': getServiceHash({ platform: config.platform, episode_id_list: config.episodeID }),
      'X-Manga-Is-Crawler': 'false',
      'X-Manga-Platform': config.platform
    },
    body: `platform=${config.platform}&episode_id_list=${config.episodeID}`
  }).then(res => res.json());
 
  // get page data
  const params = { platform: config.platform, episode_id: config.episodeID };
  const pageData = await fetch(`${config.apiServerUrl}/web/episode/viewer?${new URLSearchParams(params)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Manga-Hash': getServiceHash(params),
      'X-Manga-Is-Crawler': 'false',
      'X-Manga-Platform': config.platform
    }
  }).then(res => res.json());
 
  // get title, url of images and scramble seed
  const title0 = episodeData.episode_list.pop().episode_name;
  const title1 = document.querySelector('h1.p-episode__comic-ttl').textContent;
  const title2 = title0.replaceAll(/\[|\【/g, '').replaceAll(/\]|\】|　/g, ' ');
  const newtitle = `${title1} ${title2}`;
  let title = newtitle.replace(/(\?|\~|\/|\:)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            }[$1];
            });
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
      const imageArrayBuffer = await new Promise(_resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: 'arraybuffer',
          onload: res => _resolve(res.response)
        });
      });
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);
 
        const Cs = (a, e, s) => {
          if (a < s * 8 || e < s * 8) return null;
          const o = Math.floor(a / 8);
          const t = Math.floor(e / 8);
          const u = Math.floor(o / s);
          const r = Math.floor(t / s);
          return { width: u * 8, height: r * 8 };
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
 
        canvas.toBlob(resolve, 'image/jpeg', 1);
      }
    });
  }
 
  function getServiceHash(params) {
    const SHA256 = (stringContent) => CryptoJS.SHA256(stringContent).toString(CryptoJS.enc.Hex);
    const SHA512 = (stringContent) => CryptoJS.SHA512(stringContent).toString(CryptoJS.enc.Hex);
    const keys = Object.keys(params).sort();
    const arr = [];
    for (const key of keys) {
      arr.push(`${SHA256(key)}_${SHA512(params[key])}`);
    }
 
    const part1 = SHA256(arr.toString());
    const part2 = `${SHA256('')}_${SHA512('')}`;
    return SHA512(`${part1}${part2}`);
  }
 
})(axios, JSZip, saveAs, CryptoJS, ImageDownloader);
