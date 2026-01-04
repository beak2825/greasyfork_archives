// ==UserScript==
// @name         Download from Pixiv
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Download images from pixiv
// @author       Ange
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @resource     TOAST_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.js
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535458/Download%20from%20Pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/535458/Download%20from%20Pixiv.meta.js
// ==/UserScript==

let kemonoCreators = new Map();;

const qs = (q, el = document) => el?.querySelector(q);
const qsa = (q, el = document) => [...el?.querySelectorAll(q)];

const showToast = (text, isError = false) => {
  const isTextAnObject = text?.constructor === Object;
  const options = isTextAnObject ? text : {};
  text = isTextAnObject ? '' : text;

  const toast = Toastify({
    text,
    duration: 3000,
    gravity: "top",
    position: "left",
    newWindow: true,
    style: {
      background: isError ? "#dc3545" : "#28a745",
    },
    ...options,
  });

  toast.showToast();
  return toast;
};

const waitForElm = (selector, el = document) => {
  return new Promise((resolve, reject) => {
    if (qs(selector, el)) return resolve(qs(selector, el));

    const observer = new MutationObserver(() => {
      if (qs(selector, el)) {
        observer.disconnect();
        resolve(qs(selector, el));
      }
    });

    setTimeout(() => {
      observer.disconnect();
      reject(`${selector} not found`);
    }, 5000);

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

const fetchResponse = (url, options = {}) => {
  const { origin } = new URL(url);
  const requestOptions = {
    headers: {
      "Cache-Control": "no-cache",
    },
    ...options,
    url,
    method: options.method || 'GET',
    responseType: options.responseType || 'json',
    cookiePartition: {
      topLevelSite: origin,
    },
  };

  if (options.data) requestOptions.data = options.data;

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...requestOptions,
      onload: res => resolve(res),
      onerror: err => reject(err),
    });
  });
};

const defaultOptions = {
  headers: {},
  filename: 'images',
  useGoogle: true,
};

const download = async (images, options = defaultOptions) => {
  const downloadImage = async ({ src, title }) => {
    const updatedHeaders = { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', ...options.headers };
    if (!options.useGoogle) delete updatedHeaders['User-Agent'];
    const { response } = await fetchResponse(src, { responseType: 'arraybuffer', headers: updatedHeaders });
    return { file: response, title };
  };

  const promises = images.map(downloadImage);
  const imagesWithFile = await Promise.all(promises);

  const zip = new JSZip();
  const folder = zip.folder(`${options.filename}`);

  if (imagesWithFile.length) imagesWithFile.forEach(img => folder.file(img.title, img.file));

  const content = await zip.generateAsync({ type:'blob' });
  saveAs(content, `${options.filename}.zip`);
};

const addToFave = async illust_id => {
  try {
    const token = JSON.parse(__NEXT_DATA__.props.pageProps.serverSerializedPreloadedState).api.token;
    const response = await fetchResponse('https://www.pixiv.net/ajax/illusts/bookmarks/add', {
      method: 'POST',
      responseType: 'json',
      data: JSON.stringify({ illust_id, restrict: 0, comment: '', tags: [] }),
      headers: { 'content-type': 'application/json; charset=utf-8', 'Origin': 'https://www.pixiv.net', 'x-csrf-token': token },
    });
    response.status < 400 && !response.response.error ? showToast('Added to fave') : showToast('Failed to add to fave', true);
  } catch (e) {
    console.log(e);
    showToast('Failed to add to fave', true);
  }
};

const handlePixiv = async () => {
  const artist = qs('img[src^="https://i.pximg.net/user-profile/"], h2 img[src^="https://s.pximg.net/common/images"]')?.alt;
  const id = /\d+/.exec(window.location.href.split('/').at(-1))[0];
  const { response: json } = await fetchResponse(`https://www.pixiv.net/ajax/illust/${id}/pages?lang=en`);
  console.log(json);
  const images = json.body.map(img => ({ title: `[${artist}] ${img.urls.original.split('/').at(-1)}`, src: img.urls.original }));
  await download(images, { headers: { referer: 'https://www.pixiv.net/', Host: 'i.pximg.net' }, useGoogle: false, filename: `[${artist}] ${id}` });
  addToFave(id);
};

const getCreators = async () => {
  if (!!kemonoCreators.size) return kemonoCreators;
  const { response: creators } = await fetchResponse('https://kemono.su/api/v1/creators.txt').catch(() => ({ response: [] }));
  console.log(creators.filter(c => c.service === 'patreon'))
  kemonoCreators = creators.filter(c => c.service === 'patreon').reduce((acc, creator) => acc.set(creator.name.toLowerCase(), creator), new Map());
  return kemonoCreators;
};

const getPatreonUsername = async (delay = 0) => {
  try {
    await new Promise(r => setTimeout(r, delay)); // delay to update page
    const fig = await waitForElm('figcaption');
    removeRedirectUrl(fig);
    const patreonUrls = qsa('a[href^="https://www.patreon.com"], a[href^="https://patreon.com"]', fig).map(a => a.href);
    if (patreonUrls.length === 0) return [];

    const firstLink = patreonUrls[0];
    const isPost = firstLink.includes('patreon.com/posts/');

    if (isPost) {
      const { response } = await fetchResponse(patreonUrls[0], { responseType: 'document' });
      const anchor = qs('[data-tag="creator-header"] a', response);
      const creatorName = anchor?.href?.split('/')?.at(-1);
      const creatorNameUrl = anchor?.ariaLabel;
      if (creatorName && creatorNameUrl) return creatorName === creatorNameUrl ? [creatorNameUrl] : [creatorName, creatorNameUrl];
    }

    const { response, finalUrl } = await fetchResponse(firstLink, { responseType: 'document' });
    const creatorName = qs('h1, h2', response)?.innerText;
    const creatorNameUrl = finalUrl.split('patreon.com/').at(-1).split('/')[0].split('/')[0];
    return creatorName === creatorNameUrl ? [creatorNameUrl] : [creatorName, creatorNameUrl];
  } catch {
   return [];
  }
};

const handleDownloadButton = async () => {
  const followButton = await waitForElm('aside section button.charcoal-button');
  const existingButton = qs('button[data-download]');
  if (existingButton) {
    const button = qs('button[data-download]');
    existingButton.innerText = 'Download images';
    existingButton.removeAttribute('disabled');
    return;
  }
  const downloadButton = document.createElement('button')
  downloadButton.classList.add('charcoal-button');
  downloadButton.innerText = 'Download images';
  downloadButton.setAttribute('data-full-width', "true");
  downloadButton.setAttribute('data-size', "S");
  downloadButton.setAttribute('data-download', "true");
  downloadButton.setAttribute('style', 'margin-top: 1rem;');
  downloadButton.addEventListener('click', async () => {
    try {
      downloadButton.setAttribute('disabled', 'true');
      await handlePixiv();
      downloadButton.innerText = 'Downloaded';
    } catch {
      downloadButton.removeAttribute('disabled');
    }
  });
  followButton.after(downloadButton);
};

const handlePatreonButton = async (url) => {
  const downloadButton = await waitForElm('button[data-download]');
  if (!url) return;
  const patreonButton = document.createElement('button')
  patreonButton.classList.add('charcoal-button');
  patreonButton.innerText = 'Go to Kemono';
  patreonButton.setAttribute('data-full-width', "true");
  patreonButton.setAttribute('data-size', "S");
  patreonButton.setAttribute('data-patreon', "true");
  patreonButton.setAttribute('style', 'margin-top: 1rem;');
  patreonButton.addEventListener('click', () => window.open(url, '_blank'));
  downloadButton.after(patreonButton);
};

const removeRedirectUrl = (element = document) => {
  qsa('a', element).forEach(a => {
    if (a.href.includes('/jump.php?')) {
      a.href = decodeURIComponent(a.href).split('/jump.php?').at(-1);
    }
  });
};

const actions = async (creatorsPromise, delay = 0) => {
  const existingButton = qs('button[data-patreon]');
  if (existingButton) existingButton.remove();
  const [, usernames, creators] = await Promise.all([handleDownloadButton(), getPatreonUsername(delay), creatorsPromise]);
  console.log({ usernames, creators });
  if (!!usernames.length && creators) {
    const creator = kemonoCreators.get(usernames[0]?.toLowerCase()) || kemonoCreators.get(usernames[1]?.toLowerCase());
    if (creator) handlePatreonButton(`https://kemono.su/patreon/user/${creator.id}`);
  }
  removeRedirectUrl();
};

(async () => {
  'use strict';
  const creators = getCreators();

  if (window.location.href.includes('en/artworks')) await actions(creators);

  let lastUrl = window.location.href;

  const observer = new MutationObserver(async () => {
    const newUrl = window.location.href;
    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      if (newUrl.includes('en/artworks')) await actions(creators, 2000);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true
  });
})();
