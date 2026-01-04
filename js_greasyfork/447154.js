// ==UserScript==
// @name         qy下载
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  下载qy视频
// @author       xahon86482
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://*.iqiyi.com/*
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1021983
// @downloadURL https://update.greasyfork.org/scripts/447154/qy%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447154/qy%E4%B8%8B%E8%BD%BD.meta.js
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
    if (resp &&(url.indexOf('/dash') !== -1)) {
      metaCache.url = 'www.iqiyi.com';
      var videos = JSON.parse(resp)?.data?.program?.video;
      console.log('videos', videos)
      if (videos && videos.length > 0) {
        videos.forEach((item) => {
          if (item.m3u8) {
            metaCache.m3u8Data = item.m3u8;
          }
        })
      }
    }
  });

  var getItemByMeta = (meta, selector='', selClass='') => {
    var id = `aqy-${md5(meta.m3u8Data)}`
    if ($(`[${idKey}=${id}]`).length > 0 || !meta.m3u8Data) return null;
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
    var selector = `.iqp-player-videolayer-inner`;
    var item = getItemByMeta(metaCache, selector, '.iqp-player-videolayer')
    if (!item) return []
    return [item]
  }

  var parser = async function () {
    var url = window.location.href;
    if (url.indexOf('www.iqiyi.com') !== -1) {
      return cc();
    } else {
      throw [];
    }
  }

  if (mono?.init) mono.init({ parser });
})()
