// ==UserScript==
// @name         xigua视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1.19
// @description  下载xigua视频
// @author       kemalo1101
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://*ixigua.com/*
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1042513
// @downloadURL https://update.greasyfork.org/scripts/443760/xigua%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443760/xigua%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  var mono = window['mono-descargar'];
  var $ = mono.jQuery;
  var md5 = mono.md5;
  var filename = mono.filename;
  var onRequest = mono.onRequest;
  var idKey = 'mono-dsg-id';
  var dash = null;


  var metaCache = {}

  var origOpen = XMLHttpRequest.prototype.open;

  onRequest(({url, resp, _body, method}) => {
    if (resp && typeof url === 'string' && (url.indexOf('v9-xg-web') !== -1 || url.indexOf('v3-xg-web') !== -1)) {
      if (url.indexOf('media-audio') !== -1) {
        metaCache.dataType = "merge"
        metaCache.data = 'https:' + url.split('&range=')[0];
      } else if (url.indexOf('media-video-avc1') !== -1) {
        metaCache.url = 'https:' + url.split('&range=')[0];
      } else if (url.indexOf('.mpd') !== -1) {
        var urlObj = new URL('https:' + url)
        var paths = urlObj.pathname.split('/');
        paths.pop();
        metaCache.data = {
          mpd:resp,
          url:urlObj.origin + (paths.join('/')) + '/'
        };
        metaCache.dataType = 'mpd';
      } else if (url.indexOf('video/tos/') !== -1) {
        metaCache.url = 'https:' + url
        metaCache.dataType = 'download'
      }
    }
  });

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if ((url.indexOf('v9-xg-web') !== -1 || url.indexOf('v3-xg-web') !== -1) && url.indexOf('video/tos') !== -1) {
      metaCache.dataType = 'merge';
      if (url.indexOf('media-audio') !== -1) {
        metaCache.data = 'https:' + url.split('&range=')[0];
      } else if (url.indexOf('media-video-avc1') !== -1) {
        metaCache.url = 'https:' + url.split('&range=')[0];
      }
    }
    origOpen.call(this, method, url, ...rest);
  };

  var getItemByMeta = (meta) => {
    var id = `xigua-${md5(meta.data)}`
    var item, selector, selClass;

    if (meta.dataType === 'mpd') {
      if (!dash?.config?.DASHPlugin?.dashOpts?.drm?.clearKeys) {
        const keys = Object.keys(window)
        for (let key of keys) {
          if (key.startsWith('dash_')) {
            dash = window[key]
          }
        }
      }

      if (!dash.config?.DASHPlugin?.dashOpts?.drm?.clearKeys || !metaCache?.data?.mpd || !metaCache?.data?.url) return null
      meta.data.key = dash.config?.DASHPlugin?.dashOpts?.drm?.clearKeys
      item = { id, url: meta.data.url, meta: meta }
      selector = `.teleplayPage__playerSection__left`;
      selClass = '.teleplayPage__playerSection';
    } else if (meta.dataType === 'merge') {
      if (!meta.data || !meta.url) return null;
      item = { id, url: meta.url, meta: meta };
      selector = `.playerContainer__wrapper`;
      selClass = '.playerSection__left';
    } else if (meta.dataType === 'download') {
      if (!meta.url) return null;
      item = { id, url: meta.url, meta: meta };
      selector = `.playerContainer__wrapper`;
      selClass = '.playerSection__left';
    } else {
      return null
    }

    // 按钮
    if ($(`[${idKey}=${id}]`).length > 0) return null;
    var $el = null;
    if (selector) $el = $(selector)
    if ($el.length > 0 && selClass) {
      var ps = $el.parentsUntil(selClass);
      if (ps.length > 0) $el = $(ps[ps.length - 1])
    }
    if ($el.length <= 0) return null;
    var container = $el[0];
    if (item) {
      item.container = container
      return item
    }
    return null
  }

  var cc = () => {
    var items = [];
    var item = getItemByMeta(metaCache)
    if (!item) return []
    items.push(item);
    return items
  }

  var parser = async function () {
    var url = window.location.href;
    if (url.indexOf('.ixigua.com') !== -1 && Object.keys(metaCache).length > 0) {
      return cc();
    } else {
      return [];
    }
  }

  if (mono?.init) mono.init({ parser });
})()