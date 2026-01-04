// ==UserScript==
// @name         优酷下载
// @namespace    http://tampermonkey.net/
// @version      0.2.9
// @description  下载优酷视频
// @author       silob59998
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://*youku.*/*
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1021983
// @downloadURL https://update.greasyfork.org/scripts/443240/%E4%BC%98%E9%85%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443240/%E4%BC%98%E9%85%B7%E4%B8%8B%E8%BD%BD.meta.js
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

  const cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});

  var fetch_cna = () => {
    var quote_cna = (val) => {
      if (val.indexOf('%') === -1){
        return val
      }
      return  encodeURIComponent(val)
    }
    if (cookie.cna) {
      return quote_cna(cookie.cna)
    }
    return ''
  }

  var get_vid_from_url = (url) => {
    var b64p = /([a-zA-Z0-9=]+)/
    var p_list = [/youku\.com\/v_show\/id_([a-zA-Z0-9=]+)/,
      /player\.youku\.com\/player\.php\/sid\/([a-zA-Z0-9=]+)\/v\.swf/,
      /loader\.swf\?VideoIDS=([a-zA-Z0-9=]+)/,
      /player\.youku\.com\/embed\/([a-zA-Z0-9=]+)/]
    var hit;
    for (var p of p_list){
      hit = url.match(p)
      if (hit[1])
        return hit[1]
    }
  }

  var ckey = 'DIl58SLFxFNndSV1GFNnMQVYkx1PP5tKe1siZu/86PR1u/Wh1Ptd+WOZsHHWxysSfAOhNJpdVWsdVJNsfJ8Sxd8WKVvNfAS8aS8fAOzYARzPyPc3JvtnPHjTdKfESTdnuTW6ZPvk2pNDh4uFzotgdMEFkzQ5wZVXl2Pf1/Y6hLK0OnCNxBj3+nb0v72gZ6b0td+WOZsHHWxysSo/0y9D2K42SaB8Y/+aD2K42SaB8Y/+ahU+WOZsHcrxysooUeND'
  var utid = fetch_cna()
  var url = `https://ups.youku.com/ups/get.json?vid=${get_vid_from_url(window.location.href)}&ccode=0532`
  url += '&client_ip=192.168.1.1'
  url += '&utid=' + utid
  url += '&client_ts=' + new Date().getTime()
  url += '&ckey=' + encodeURIComponent(ckey)

  handleCallback = (resp) => {
    try {
      var streams = resp.data.stream.sort(function(a, b) {
        return b.size - a.size;
      });
    } catch {
      if (!url.includes('ccode=0502')) {
        url = url.replace('ccode=0532', 'ccode=0502')
        $.ajax({
          url: url,
          type: 'get',
          dataType: 'jsonp',  // 请求方式为jsonp
          jsonpCallback: "handleCallback",  // 自定义回调函数名
          data: {}
        });
      }
      return
    }

    const stream = streams[0];
    var m3u8data;
    var videos = []
    stream.segs.forEach((item) => {
      videos.push(item.cdn_url)
    })
    m3u8data = videos.join('\n')
    metaCache.m3u8Data = m3u8data;
    metaCache.url = '';
  }
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'jsonp',  // 请求方式为jsonp
    jsonpCallback: "handleCallback",  // 自定义回调函数名
    data: {}
  });

  var getItemByMeta = (meta, selector='', selClass='') => {
    var id = `yk-${md5(meta.m3u8Data)}`
    if ($(`[${idKey}=${id}]`).length > 0 || !metaCache.m3u8Data) return null;
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
    var selector = `#ykPlayer`;
    var item = getItemByMeta(metaCache, selector, '#player')

    if (!item) return items
    if (item) items.push(item);
    return items
  }

  var parser = async function () {
    var url = window.location.href;
    if (url.indexOf('v.youku.com/v_show/id_') !== -1 && Object.keys(metaCache).length > 0) {
      return cc();
    } else {
      throw [];
    }
  }

  if (mono?.init) mono.init({ parser });
})()
