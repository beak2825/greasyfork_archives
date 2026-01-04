// ==UserScript==
// @name         巨量下载
// @namespace    http://tampermonkey.net/
// @version      2.2.4
// @description  巨量广告视频下载
// @author       hayasol657
// @run-at       document-start
// @license      MIT License
// @grant        GM_download
// @include      *://cc.oceanengine.com/*
// @inject-into  page
// @require      https://greasyfork.org/scripts/440006-mono/code/mono.js?version=1026867
// @downloadURL https://update.greasyfork.org/scripts/439198/%E5%B7%A8%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/439198/%E5%B7%A8%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  var mono = window['mono-descargar'];
  var failover = mono.FAIL_TO_DEFAULT;
  var $ = mono.jQuery;
  var md5 = mono.md5;
  var onRequest = mono.onRequest;
  var filename = mono.filename;

  var metaCache = {};
  var metaDict = {};
  var metaMap = { materials: 'material', items: 'douyin' };
  onRequest(({url, resp}) => {
    if (!resp) return;
    if (url.indexOf(`creative_radar_api/v1/video/info`) !== -1) {
      var data = JSON.parse(resp).data
      if (Object.keys(data).length > 0) {
        metaCache = data;
      }
      return
    }
    for (const key of Object.keys(metaMap)) {
      var prefix = `creative_radar_api/v1/${metaMap[key]}`;
      if (!url.includes(`${prefix}/info`) &&
          !url.includes(`${prefix}/list`)) continue;
      var res = JSON.parse(resp);
      if (res?.data && typeof res.data === 'object' && 'vid' in res.data) {
        res.data = { [key]: [res.data] };
      }
      if (res?.data && typeof res.data === 'object' &&
          key in res.data && res.data[key].length > 0) {
        const feeds = res.data[key];
        for (var i = 0; i < feeds.length; i++) {
          const id = feeds[i].vid;
          if (metaDict[id]) continue;
          feeds[i].id = id;
          metaDict[id] = feeds[i];
        }
      }
    }
  });

  var updateItems = async (items) => {
    if (items.length <= 0) return;
    return new Promise((resolve, reject) => {
      var videos = items.map((im) => {
        return {vid: im.meta.vid, mid: `${im.meta.material_id}`}
      })
      $.ajax({
        url: "https://cc.oceanengine.com/creative_radar_api/v1/video/info",
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({ "video_infos": videos, "water_mark": 'ad' }),
        success: function (data) {
          if (data?.data && Object.keys(data?.data).length > 0) {
            items.forEach(item => {
              item.url = data.data[item.meta.material_id].video_url;
              item.meta.video = data.data[item.meta.material_id];
              item.meta.cover = data.data[item.meta.material_id].cover_url;
              item.meta.title = item.meta.bestTitle || item.meta.item_title;
              item.meta.name = filename(item.meta.title || document?.title);
            });
          }
          resolve(items)
        },
        error: function (error) {
          reject(error)
        },
      });
    });
  }

  var getItemByMeta = (meta) => {
    if (!meta || !meta.id) return null;
    if ($(`[mono-dsg-id=${meta.id}]`).length > 0) return null;
    return { id: meta.id, url: "", meta };
  }

  var detail = async (style) => {
    const mid = Object.keys(metaDict)[0];
    const realMid = Object.keys(metaCache)[0];
    const item = getItemByMeta(metaDict[mid])
    if (item) {
      item.meta.material_id = realMid;
      var $el = $(`.${style}`).find(".cc-video-player");
      if ($el.length > 0) {
        await updateItems([item]);
        if (!item.url) return []
        item.container = $el[0];
        item.mid = mid;
        return [item];
      }
    }
    return [];
  }

  var list = async () => {
    const items = []
    for (const [id, meta] of Object.entries(metaDict)) {
      const imgUrl = new URL(meta.head_image_uri);
      const item = getItemByMeta(meta);
      if (item) {
        var $el = $(`.poster-image[style*='${imgUrl.pathname}']`).parent();
        if ($el.length > 0) {
          item.container = $el[0];
          item.mid = meta.material_id
          items.push(item);
        }
      }
      if (items.length >= 10) break;
    }

    if (items.length > 0) {
      await updateItems(items);
    }

    return items.filter(item => item.url);
  }

  var parser = async function () {
    var url = new URL(window.location.href);
    var lists = [
      "/inspiration/creative-radar/video",
      "/inspiration/douyin/content"
    ];
    var ccdetail = "/inspiration/creative-radar/detail/";
    var dydetail = "/inspiration/douyin-detail/";
    if (lists.includes(url.pathname)) {
      return await list();
    } else if (url.pathname.indexOf(ccdetail) > -1) {
      return await detail('radar-detail-preview-box');
    } else if (url.pathname.indexOf(dydetail) > -1) {
      return await detail('creative-douyin-detail-info');
    } else {
      throw failover;
    }
  }

  if (mono?.init) mono.init({ parser });
})()
