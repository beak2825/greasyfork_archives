// ==UserScript==
// @name         快手视频高清下载
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  下载快手视频
// @author       xelicev963
// @run-at       document-start
// @license      MIT License
// @grant        GM_download
// @include      *://*kuaishou.com
// @include      *://*.kuaishou.com/*
// @inject-into  page
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1021408
// @downloadURL https://update.greasyfork.org/scripts/439195/%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E9%AB%98%E6%B8%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/439195/%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E9%AB%98%E6%B8%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function () {
  var mono = window['mono-descargar'];
  var $         = mono.jQuery;
  var md5       = mono.md5;
  var onRequest = mono.onRequest;
  var filename  = mono.filename;
  var errCode   = mono.FAIL_TO_DEFAULT;
  var idKey     = 'mono-dsg-id';

  var metaCache = {};

  onRequest(({url, resp}) => {
    if (!resp) return;
    if (url.startsWith('//')) url = `https:${url}`;
    var res;
    try {
      res = JSON.parse(resp);
    } catch (err) {
      return;
    }
    if (!res) return;
    if (url && url.indexOf('graphql') > -1) {
      try {
        for (var key of ['brilliantData', 'gameLiveCardList', 'visionSearchPhoto', 'brilliantTypeData', 'visionProfilePhotoList']) {
          if (res?.data[key] && res.data[key].feeds && res.data[key].feeds.length > 0) {
            var feeds = res.data[key].feeds;
            for (var i = 0; i < feeds.length; i++) {
              var itemData = feeds[i].photo;
              itemData.author = feeds[i].author;
              metaCache[itemData.id] = itemData;
            }
          }
        }
      } catch (e) {}
      return;
    }

    for (var key of ['hotPhotoInfos', 'inspiredAds']) {
      if (res?.data && typeof res.data === 'object' && 
          key in res.data && res.data[key].length > 0) {
        var feeds = res.data[key];
        for (var i = 0; i < feeds.length; i++) {
          var url = new URL(feeds[i].coverThumbnailUrls[0].url);
          var id = url.searchParams.get('clientCacheKey')?.replace('.jpg', '');
          feeds[i].id = id;
          metaCache[id] = feeds[i];
        }
      }
    }
  });

  var getItemByMeta = (meta, selector='', selClass='') => {
    var id = `ks-${md5(meta.id)}`
    if ($(`[${idKey}=${id}]`).length > 0) return null;
    var url = meta.photoUrl;
    meta.title = meta.caption;
    meta.cover = meta.coverUrl;
    meta.name = filename(meta.title || document?.title);
    var $el = null;
    if (selector) $el = $(selector)
    if ($el.length > 0 && selClass) {
      var ps = $el.parentsUntil(selClass);
      if (ps.length > 0) $el = $(ps[ps.length - 1])
    }
    if ($el.length <= 0) return null;
    var container = $el[0];
    return { id, url, container, meta }
  };

  var detail = async () => {
    var url = new URL(window.location.href);
    var video_id = url.pathname.replace("/short-video/", '');
    if (video_id in metaCache) {
      var item = getItemByMeta(metaCache[video_id], '.kwai-player-container-video')
      return item ? [item] : [];
    }
    return [];
  }

  var list = async () => {
    var items = []
    for (var [id, meta] of Object.entries(metaCache)) {
      var selector = `img[src*='clientCacheKey=${id}']`
      var item = getItemByMeta(meta, selector, '.video-card')
      if (item) items.push(item);
    }
    return items
  }

  var cc = async () => {
    var items = [];
    for (var [id, meta] of Object.entries(metaCache)) {
      var selector = `.cc-player-poster[style*='clientCacheKey=${id}']`;
      var item = getItemByMeta(meta, selector, '.common-video-item')
      if (!item) continue;
      item.url = meta.mainMvUrls[0].url;
      item.meta.cover = meta.coverThumbnailUrls[0].url;
      item.meta.title = `快手-${meta.firstIndustryName}-${meta.nickName}`;
      if (item) items.push(item);
    }
    return items
  }

  var parser = async function () {
    var url = new URL(window.location.href);
    var paths = url.pathname.split('/');
    var path = paths[1];
    if (path === "short-video") {
      return await detail();
    } else if (!path || ["search", "brilliant", "profile"].includes(path)) {
      return await list();
    } else if (url.host === 'cc.e.kuaishou.com' && 
              ["/inspiration/ads", "/inspiration/hot"].includes(url.pathname)) {
      return await cc();
    } else {
      throw errCode;
    }
  }

  if (mono?.init) mono.init({ parser });
})()
