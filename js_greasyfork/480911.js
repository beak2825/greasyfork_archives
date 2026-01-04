// ==UserScript==
// @name         TikTok Download Button
// @description  Adds a download button to video element when it's loaded
// @version      0.2.0
// @author       skojaren
// @license      GNU GPLv3
// @supportURL   https://t.me/skojaren
// @namespace    https://greasyfork.org/users/980311
// @match        https://www.tiktok.com/@*
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/480911/TikTok%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/480911/TikTok%20Download%20Button.meta.js
// ==/UserScript==

const altVideoUrls = {};
const fragments = [
  'https://www.tiktok.com/api/post/item_list/',
  'https://www.tiktok.com/api/user/detail/',
];
const listKey = 'downloaded';
let user_id = '';
let username = '';

(() => {
  if (!GM_getValue(listKey)) GM_setValue(listKey, []);
  const loop = setInterval(() => {
    if (unsafeWindow.SIGI_STATE) {
      clearInterval(loop);
      const im = unsafeWindow.SIGI_STATE.ItemModule;
      for (let key in im) {
        if (!im.hasOwnProperty(key)) continue;
        altVideoUrls[im[key].id] = im[key].video.bitrateInfo.slice().sort((a, b) => b.Bitrate - a.Bitrate)[0].PlayAddr.UrlList[0];
      }
      return;
    }
  }, 100);
})();

const observer = new MutationObserver(mutations => {
  if (!/^https:\/\/www\.tiktok\.com\/@[0-9a-z_.]+$/.test(window.location.href)) return;
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeName !== 'VIDEO') return;
      if (!unsafeWindow.SIGI_STATE) return;
      const a = node.parentNode.parentNode.parentNode.parentNode.parentNode;
      const video_id = a.parentNode.parentNode.parentNode.parentNode.childNodes[1].firstChild.firstChild.href.split('/').pop();
      const user = Object.values(unsafeWindow.SIGI_STATE.UserModule.users)[0];
      if (!username) username = user.uniqueId;
      if (!user_id) user_id = user.id;
      const filename = `${username}-${user_id}-${video_id}.mp4`;
      const button = document.createElement('button');
      button.innerText = 'Download';
      button.style.backgroundColor = 'rgba(254, 44, 85, 0.8)';
      button.style.border = 'none';
      button.style.borderRadius = '0 0 0 6px';
      button.style.cursor = 'pointer';
      button.style.color = 'rgba(255, 255, 255, 1)';
      button.style.padding = '4px 6px';
      button.style.position = 'absolute';
      button.style.right = '0';
      button.style.top = '0';
      button.style.zIndex = '9';
      let videoUrl = node.src;
      if (altVideoUrls[video_id]) videoUrl = altVideoUrls[video_id];
      if (GM_getValue(listKey).includes(filename)) {
        button.innerText = 'Downloaded';
        button.onclick = () => {
          button.disabled = true;
          setTimeout(() => {
            GM_download({
              url: videoUrl,
              name: filename,
              headers: {
                'Referer': `https://www.tiktok.com/@${username}/video/${video_id}`,
                'User-Agent': navigator.userAgent
              },
              onload: () => {
                button.disabled = false;
              },
              onerror: () => {
                button.disabled = false;
              }
            });
          }, 1000);
        };
        button.onmouseout = () => null;
        button.onmouseover = () => null;
        button.title = `Already downloaded ${video_id} by @${username}`;
      } else {
        button.innerText = 'Download';
        button.onclick = () => {
          button.disabled = true;
          setTimeout(() => {
            GM_download({
              url: videoUrl,
              name: filename,
              headers: {
                'Referer': `https://www.tiktok.com/@${username}/video/${video_id}`,
                'User-Agent': navigator.userAgent
              },
              onload: () => {
                const list = GM_getValue(listKey);
                list.push(filename);
                GM_setValue(listKey, list);
                button.disabled = false;
                button.innerText = 'Downloaded';
              },
              onerror: () => {
                button.disabled = false;
                button.innerText = 'Download';
              }
            });
          }, 1000);
        };
        button.onmouseout = () => { button.style.backgroundColor = 'rgba(254, 44, 85, 0.8)'; };
        button.onmouseover = () => { button.style.backgroundColor = 'rgba(254, 44, 85, 1)'; };
      }
      button.type = 'button';
      if (a.parentNode.querySelector('button')) return;
      a.parentNode.appendChild(button);
    });
  });
});

if (/^https:\/\/www\.tiktok\.com\/@[0-9a-z_.]+$/.test(window.location.href)) {
  observer.observe(document.body, { childList: true, subtree: true });
}

((fetch) => {
  unsafeWindow.fetch = async (...args) => {
    const response = await fetch(...args);
    if (!response) return;
    if (!response.url.startsWith(fragments[1])) return response;
    await response
    .clone()
    .json()
    .then(body => {
      if (!body) return;
      if (!body.userInfo) return;
      user_id = body.userInfo.user.id;
      username = body.userInfo.user.uniqueId;
    })
    .catch(err => console.error(err));
    return response;
  };
})(unsafeWindow.fetch);

((fetch) => {
  window.fetch = async (...args) => {
    const response = await fetch(...args);
    if (!response) return;
    if (!response.url.startsWith(fragments[0])) return response;
    await response
    .clone()
    .json()
    .then(body => {
      if (!body) return;
      if (!body.itemList) return;
      body.itemList.forEach(item => {
        altVideoUrls[item.video.id] = item.video.bitrateInfo.slice().sort((a, b) => b.Bitrate - a.Bitrate)[0].PlayAddr.UrlList[0];
      });
    })
    .catch(err => console.error(err));
    return response;
  };
})(window.fetch);