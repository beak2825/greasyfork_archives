// ==UserScript==
// @name         腾讯视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1.14
// @description  下载腾讯视频
// @author       feyaha9619
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://v.qq.com/*
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1021983
// @downloadURL https://update.greasyfork.org/scripts/443172/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443172/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  var mono = window['mono-descargar'];
  var $ = mono.jQuery;
  var md5 = mono.md5;
  var onRequest = mono.onRequest;
  var idKey = 'mono-dsg-id';

  var metaCache = {}

  onRequest(({url, resp, _body, method}) => {
    if (!resp || typeof url !== 'string' || !(url.indexOf('qq.com/proxyhttp') !== -1 && resp.indexOf('vinfo') !== -1)) return;
    var data = typeof resp == "string" ? JSON.parse(resp) : resp;
    var vinfo = JSON.parse(data.vinfo);
    console.log('vinfo', vinfo)
    vinfo.vl.vi.forEach((item) => {
      var url = item.ul.ui[item.ul.ui.length-1].url;
      var baseUrl = url.split('?')[0]
      if (item?.ul?.m3u8) {
        metaCache.url = baseUrl;
        metaCache.m3u8Data = item.ul.m3u8;
      }
    });
  });

  var getContainer = (selector, selClass) => {
    var $el = null;
    if (selector) $el = $(selector)
    if ($el.length > 0 && selClass) {
      var ps = $el.parentsUntil(selClass);
      if (ps.length > 0) $el = $(ps[ps.length - 1])
    }
    if ($el.length <= 0) return null;
    return $el[0];
  }

  var getItemByMeta = (meta, selector='', selClass='') => {
    var id = `tx-${md5(meta.m3u8Data)}`
    if ($(`[${idKey}=${id}]`).length > 0) return {item:null, exist: true};
    var container = getContainer(selector, selClass)
    if (!meta.m3u8Data) return {item:null, exist: false}
    return {item:{ id, url: meta.url, container, meta: meta }, exist: false}
  }

  var cc = () => {
    var items = [];
    var selector = `.player__container`;
    var sel = '.container-main__left';

    var {item, exist} = getItemByMeta(metaCache, selector, sel)
    if (item && !exist) {
      items.push(item);
    } else if (!item && !exist) {
      var container = getContainer(selector, sel)
      if (!container) return []
      var url = $("video").attr("src");
      var id = `tx-${md5(url)}`;
      if (url && url.startsWith('http') && ($(`[${idKey}=${id}]`).length <= 0)) items.push({id, container, url})
    }
    return items
  }

  var parser = async function () {
    var url = window.location.href;
    if ((url.indexOf('/x/cover/') !== -1 || url.indexOf('/x/page/') !== -1)) {
      return cc();
    } else {
      return [];
    }
  }

  if (mono?.init) mono.init({ parser });
})()
