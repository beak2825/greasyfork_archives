// ==UserScript==
// @name         快手下载
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  下载快手视频
// @author       delamingo
// @run-at       document-start
// @license      MIT License
// @grant        GM_invokeFn
// @include      *://*.kuaishou.com/*
// @inject-into  page
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.7.2/jquery.min.js
// @dev          9999
// @downloadURL https://update.greasyfork.org/scripts/436392/%E5%BF%AB%E6%89%8B%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/436392/%E5%BF%AB%E6%89%8B%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

const metaCache = {};

//hook fetch
const fetchListKeys = ['brilliantData', 'visionSearchPhoto', 'brilliantTypeData', 'gameLiveCardList', 'visionProfilePhotoList']
const originFetch = fetch
unsafeWindow.fetch = async (url, request) => {
  const response = await originFetch(url, request)
  if (url && url.indexOf('graphql') > -1) {
    try {
      const text = await response.text()
      response.text = () => { return new Promise((resolve) => { resolve(text) }) }
      const res = JSON.parse(text)
      for (i in fetchListKeys) {
        const key = fetchListKeys[i];
        if (res?.data[key] && res.data[key].feeds && res.data[key].feeds.length > 0) {
          const feeds = res.data[key].feeds;
          for (var i = 0; i < feeds.length; i++) {
            var itemData = feeds[i].photo;
            itemData.author = feeds[i].author
            metaCache[itemData.id] = itemData
          }
          // console.log(feeds)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  return response
}

//hook xhr
const xhrListKeys = ['hotPhotoInfos', 'inspiredAds']
var origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
  this.addEventListener('load', function() {
    if (this.responseType && this.responseType !== "text") return;
    const res = JSON.parse(this.responseText)
    for (i in xhrListKeys) {
      const key = xhrListKeys[i];
      if (res?.data && typeof res.data === 'object' && 
          key in res.data && res.data[key].length > 0) {
        const feeds = res.data[key];
        for (var i = 0; i < feeds.length; i++) {
          const url = new URL(feeds[i].coverThumbnailUrls[0].url);
          const id = url.searchParams.get('clientCacheKey')?.replace('.jpg', '');
          // console.log(id, feeds[i])
          feeds[i].id = id;
          metaCache[id] = feeds[i];
        }
        // console.log(feeds)
      }
    }
  });
  // console.log(arguments)
  origOpen.apply(this, arguments);
};

(function () {

  var getItemByMeta = (meta, pselector='', pclass='') => {
    const id = `mona-${md5(meta.id)}`
    if ($(`#${id}`).length > 0) return null;
    const dom = $(`<div id='${id}' style="z-index:100"></div>`);
    const url = meta.photoUrl;
    meta.title = meta.caption;
    meta.cover = meta.coverUrl;
    meta.filename = `${meta.id}.mp4`;
    let pdom = null;
    if (pselector) pdom = $(pselector)
    if (pdom.length > 0 && pclass) {
      const ps = pdom.parentsUntil(pclass);
      if (ps.length > 0) pdom = $(ps[ps.length - 1])
    }
    return { id, url, dom, pdom, meta }
  };

  var pageParsers = {
    detail: async () => {
      const url = new URL(window.location.href);
      const video_id = url.pathname.replace("/short-video/", '');
      if (video_id in metaCache) {
        const item = getItemByMeta(metaCache[video_id], '.kwai-player-container-video')
        return item ? [item] : [];
      }
      return [];
    },
    list: async () => {
      const items = []
      for (const [id, meta] of Object.entries(metaCache)) {
        const pselector = `img[src*='clientCacheKey=${id}']`
        const item = getItemByMeta(meta, pselector, '.video-card')
        if (item) items.push(item);
      }
      return items
    },
    cc: async () => {
      const items = [];
      for (const [id, meta] of Object.entries(metaCache)) {
        const pselector = `.cc-player-poster[style*='clientCacheKey=${id}']`
        const item = getItemByMeta(meta, pselector, '.common-video-item')
        if (!item) continue;
        item.url = meta.mainMvUrls[0].url;
        item.meta.cover = meta.coverThumbnailUrls[0].url;
        if (item) items.push(item);
      }
      return items
    }
  }

  var getPageParser = () => {
    const url = new URL(window.location.href);
    const paths = url.pathname.split('/');
    const path = paths[1];
    if (path === "short-video") {
      return pageParsers.detail;
    } else if (!path || ["search", "brilliant", "profile"].includes(path)) {
      return pageParsers.list;
    } else if (url.host === 'cc.e.kuaishou.com' && 
              ["/inspiration/ads", "/inspiration/hot"].includes(url.pathname)) {
      return pageParsers.cc;
    } else {
      throw 999;
    }
  }

  var parser = {
    parseItems: async () => {
      const pr = getPageParser()
      if (!pr) return []
      return pr()
    }
  }

  GM_invokeFn("regParser", parser)
})()
