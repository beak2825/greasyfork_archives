// ==UserScript==
// @name         咪咕视频下载
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  下载咪咕视频
// @author       fevimo6858
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://*miguvideo.com/*
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1021983
// @downloadURL https://update.greasyfork.org/scripts/448840/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/448840/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  var mono = window['mono-descargar'];
  var $ = mono.jQuery;
  var md5 = mono.md5;
  var filename = mono.filename;
  var onRequest = mono.onRequest;
  var errCode = mono.FAIL_TO_DEFAULT;
  var idKey = 'mono-dsg-id';

  var metaCache = {}

  onRequest(({url, resp, _body, method}) => {
    console.log('url', url)
    if (!resp || (url.indexOf('vod.miguvideo.com') === -1 || url.indexOf('.m3u8?') === -1)) return;
    var urlObj = new URL(url)
    var paths = urlObj.pathname.split('/');
    paths.pop();
    metaCache.url = urlObj.origin + (paths.join('/')) + '/';
    metaCache.m3u8Data = resp;
    console.log('metaCache', metaCache)
  });

  var getItemByMeta = (meta, selector='', selClass='') => {
    var id = `aqy-${md5(meta.m3u8Data)}`
    if ($(`[${idKey}=${id}]`).length > 0) return null;
    var $el = null;
    if (selector) $el = $(selector)
    if ($el.length > 0 && selClass) {
      var ps = $el.parentsUntil(selClass);
      if (ps.length > 0) $el = $(ps[ps.length - 1])
    }
    if ($el.length <= 0) return null;
    var container = $el[0];
    return { id, url: meta.url, container, meta: meta }
  }

  var cc = () => {
    var items = [];
    var selector = `.mg_player_wrapper`;
    var item = getItemByMeta(metaCache, selector, '.video-wrapper')
    if (!item) return items
    if (item) items.push(item);
    return items
  }

  var parser = async function () {
    var url = window.location.href;
    if (url.indexOf('mgs/website') !== -1) {
      return cc();
    } else {
      throw errCode;
    }
  }

  if (mono?.init) mono.init({ parser });
})()
