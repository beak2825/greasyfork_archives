// ==UserScript==
// @name         🔥🔥🔥抖音短视频下载🔥🔥🔥
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  下载抖音短视频
// @author       抖音兔不迟到
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://*douyin.com
// @include      *://*.douyin.com/*
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1098708
// @downloadURL https://update.greasyfork.org/scripts/439697/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E6%8A%96%E9%9F%B3%E7%9F%AD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/439697/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E6%8A%96%E9%9F%B3%E7%9F%AD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

var _META_URL_ = "https://www.douyin.com/web/api/v2/aweme/iteminfo/?item_ids=";

(function () {
  var mono = window['mono-descargar'];
  var useDefaultErr = mono.FAIL_TO_DEFAULT;
  var $             = mono.jQuery;
  var md5           = mono.md5;
  var onRequest     = mono.onRequest;

  var itemCache = {}

  var parseItem = (item) => {
    var key = item.video?.origin_cover?.uri;
    if (!key) return;
    itemCache[key] = item;
    itemCache[key].video_id = itemCache[key].aweme_id;
    itemCache[key].title = itemCache[key].desc;
    itemCache[key].cover = itemCache[key].video?.origin_cover?.url_list[0];
    itemCache[key].url = itemCache[key].video?.play_addr?.url_list[0];
  }

  onRequest(({url, resp}) => {
    if (!resp) return;
    if (url.includes("general/search/single")) {
      var json = JSON.parse(resp);
      if (!json?.data?.length) return;
      for (var mixItem of json.data) {
        if (mixItem.aweme_mix_info?.mix_items?.length) {
          for (var item of mixItem.aweme_mix_info?.mix_items) {
            parseItem(item);
          }
        } else if (mixItem.aweme_info) {
          parseItem(mixItem.aweme_info);
        }
      }
    }
  });

  var filename = (title) => {
    const name = title.replace(' ', '').replace(/[/\\?%*:|"<>]/g, '-');
    return `${name}.mp4`;
  }

  var updateItems = async (items) => {
    if (items.length <= 0) return;
    var resp = await fetch(_META_URL_ + items.map(im => im.meta.video_id).join(','));
    try {
      var json = await resp.json();
    } catch (e) {
      return
    }

    metas = {}
    for (var i in json.item_list) {
      metas[json.item_list[i].aweme_id] = json.item_list[i]
    }

    for (var i in items) {
      meta = metas[items[i].meta.video_id]
      let url;
      if (items[i].video) url = items[i].video.children[0].src;
      if (!meta) continue;
      meta.title = meta.desc;
      meta.cover = meta.video.cover.url_list[0];
      meta.name = filename(meta.title);
      items[i].url = url || meta.video.play_addr.url_list[0].replace("playwm", "play");
      items[i].meta = Object.assign(meta, items[i].meta);
    }
    return items
  }

  var getItemByDetailUrl = (detail_url) => {
    var url = new URL(detail_url);
    var video_id = url.pathname.slice("/video/".length);
    var id = `dy-${md5(video_id)}`;
    if ($(`[mono-dsg-id=${id}]`).length > 0) return null;
    var meta = { video_id }
    var position = { x: 0, y: 0 };
    return { id, url:"", meta, position };
  }

  var getItemsByATag = async () => {
    var items = [];
    var a = $(`a[href*="/video/"]`);
    if (a.length <= 0) return;
    for (var i = 0; i < a.length; i++) {
      var item = getItemByDetailUrl(a[i].href);
      if (!item) continue;
      item.container = a[i].parentNode;
      item.container.style.position = 'relative';
      item.zIndex = 12;
      items.push(item);
      // 每次返回N个，分多次
      if (items.length >= 10) break;
    }

    if (items.length > 0) {
      const res = await updateItems(items);
      if (!res) return
    }
    return items;
  }

  var getItemsBySearchRes = () => {
    var items = [];
    var containers = $(`.player-info`);
    if (containers.length <= 0) return;

    for (var i = 0; i < containers.length; i++) {
      let key;
      var container = containers[i];
      var $ele = $(container);
      try {
        var img = $ele.find('.imgBackground img')[0];
        var url = new URL(img.src.startsWith('//') ? 'https:' + img.src : img.src);
        if (url && url.pathname.includes('~')) {
          key = url.pathname.substring(1, url.pathname.indexOf('~'));
        }
      } catch (e) {
        console.log('err', e);
        continue;
      }
      // console.log('itemCache', itemCache[key])
      if (!key || !itemCache[key]) continue;

      var meta = itemCache[key];
      var id = `dy-${md5(meta.video_id)}`;
      var url = meta.url;
      meta.name = filename(meta.title);
      var position = { x: 10, y: 10 };
      var item = { id, url, container, meta, position, zIndex: 12}
      items.push(item);
      // 每次返回N个，分多次
      if (items.length >= 10) break;
    }

    return items;
  }

  var pageParsers = {
    detail: async () => {
      var item = getItemByDetailUrl(window.location.href);
      if (!item) return [];
      video = $('video');
      if (video.length <= 0) return [];
      item.container = video[0].parentNode;
      item.zIndex = 12;
      item.video = video[0];
      const flag = await updateItems([item]);
      if (!flag) return
      return [item];
    },
    user: async () => {
      return getItemsByATag()
    },
    list: async () => {
      let items = await getItemsByATag();
      if (!items) return
      items = items.concat(getItemsBySearchRes());
      return items.filter(x => x);
    }
  }

  var getPageParser = () => {
    var url = new URL(window.location.href);
    var path = url.pathname.split('/')[1];
    if (path === "video") {
      return pageParsers.detail;
    } else if (path === "user") {
      return pageParsers.user;
    } else if (["discover", "search", "channel", "hot"].includes(path)) {
      return pageParsers.list;
    } else {
      throw useDefaultErr;
    }
  }

  var parser = async function () {
    var pr = getPageParser()
    const res = await pr();
    if (!res || res.length < 1) throw useDefaultErr;
    return res
  }

  if (mono?.init) mono.init({
    parser,
    interval: 100,
  });
})()