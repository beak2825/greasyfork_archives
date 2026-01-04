// ==UserScript==
// @name           ThisVid Download Button
// @namespace      https://thisvid.com/
// @version        2.0.1
// @description    Adds a download buttons to ThisVid video pages.
// @author         persistentScripter
// @license        MIT
// @include        http*://thisvid.com/*
// @require        https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/419534/ThisVid%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/419534/ThisVid%20Download%20Button.meta.js
// ==/UserScript==

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const snakeCase = (str) => {
  str = str.replace(/\W+/g, ' ').toLowerCase().split(' ').join('_');

  return str;
};

// Downloads a video via fetch() so we can save the file with the appropriate file name.
let getVid = async (fileURL) => {
  let controller = new AbortController();
  let {signal} = controller;

  const {title} = document;

  document.title = `[↓] ${title.replace(/\[↓\]/g, '')}`;

  let fileName = snakeCase(title.replace(/ThisVid\.com|at ThisVid tube/, '').trim());

  let resp = await fetch(fileURL, {
    method: 'GET',
    redirect: 'follow',
    signal,
  });

  // First request will just be a redirect. Catch it, abort, and continue.
  if (resp.redirected) {
    controller.abort();

    controller = new AbortController();
    signal = controller.signal;

    resp = await fetch(resp.url, {
      method: 'GET',
      signal,
    });
  }

  let blob = await resp.blob();

  try {
    url = window.URL.createObjectURL(blob);
  } catch (e) {
    url = resp.url;

    return url;
  }

  const a = document.createElement('a');

  document.title = `[✓] ${title.replace(/\[✓\]/g, '')}`;

  a.style.display = 'none';
  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);

  a.click();

  window.URL.revokeObjectURL(url);

  return true;
};

const filterPrivateVideos = () => {
  let priv = Array.from(document.querySelectorAll('.icon-private'));

  for (let i = 0, len = priv.length; i < len; i++) {
    let item = priv[i];

    let container = item.parentNode.parentNode.parentNode;
    let vid = item.parentNode.parentNode;

    container.removeChild(vid);
  }
}

const addDownloadButton = async () => {
  let flagContainer = document.querySelector('#flagging_container');

  if (!flagContainer) return;

  let video = document.querySelector('video');
  let fileURL;

  // Video element is now inserted into DOM after video starts playing, this simulates a play click and then pauses the video.
  if (!video) {
    let playButton = document.querySelector('#kt_player > div.fp-player > div.fp-ui > div.fp-controls.fade > a.fp-play');

    playButton.click();

    await wait(500);

    video = document.querySelector('video');
  }

  video.pause();

  fileURL = video.src;

  let li = document.createElement('li');
  let a = document.createElement('a');
  let span = document.createElement('span');

  li.classList.add('share_button');
  li.appendChild(a);

  a.classList.add('__dl');
  a.href = fileURL;

  Object.assign(span.style, {
    color: '#fff',
    fontSize: '32px',
  });

  a.innerHTML += `
    <span class="tooltip">download</span>
  `;

  span.innerText = '↓';

  a.appendChild(span);

  a.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await getVid(fileURL);
    } catch (e) {
      let {title} = document;

      document.title = `[✗] ${title.replace(/\[✗\]/g, '')}`;

      window.open(fileURL);
    }
  });

  flagContainer.appendChild(li);
}

const sortVideos = () => {
  let els = Array.from(
    document.querySelectorAll('body > div.wrapper > div > div > section > div > a > span.thumb > span.percent')
  );
  let group = [];
  let globalContainer = null;

  if (!els.length) {
    els = Array.from(
      document.querySelectorAll('body > div.wrapper > div > div > section > div > div > a > span.thumb > span.percent')
    );
  }

  if (!els.length) return;

  for (let i = 0, len = els.length; i < len; i++) {
    let el = els[i];
    let int = parseInt(el.innerText.split('%')[0]);

    el = el.parentNode.parentNode;
    let container = el.parentNode;

    if (i === 0) {
      globalContainer = container;
    }

    try {
      container.removeChild(el);
    } catch (e) {
      console.log('fail', {el, container});
      continue;
    }

    group.push({
      el,
      int,
    });
  }

  group = _.orderBy(group, 'int', 'desc');

  for (let i = 0, len = group.length; i < len; i++) {
    let {el} = group[i];

    globalContainer.appendChild(el);
  }
}

window.addEventListener('load', () => {
  setTimeout(filterPrivateVideos, 100);
  setTimeout(addDownloadButton, 100);
  setTimeout(sortVideos, 200);
});
