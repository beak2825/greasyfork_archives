// ==UserScript==
// @name         bilibili、腾讯视频弹幕下载
// @namespace    https://github.com/LesslsMore/bili-utils
// @version      0.1.3
// @author       lesslsmore
// @description  bilibili、腾讯视频弹幕下载，支持各类视频弹幕下载，包括需要会员的视频以及需要大会员的番剧
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @match        *://*.bilibili.com/bangumi/*
// @match        *://*.bilibili.com/video/*
// @match        https://v.qq.com/x/cover/*
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/524107/bilibili%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524107/bilibili%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (saveAs) {
  'use strict';

  async function down_bili_danmu() {
    let url = window.location.href;
    let epMatch = url.match(/(ep\d+)/) || url.match(/(ss\d+)/);
    let bvMatch = url.match(/video\/(BV\w+)/);
    if (epMatch) {
      const id = epMatch[1];
      console.log(id);
      const { cid, title, long_title } = await fetchInfo(id);
      await downloadFile(cid, `${title} - ${long_title}`);
    } else if (bvMatch) {
      const bv = bvMatch[1];
      console.log(bv);
      const { cid, title, long_title } = await fetchVideoData(bv);
      await downloadFile(cid, `${title}`);
    }
  }
  async function getText(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error("请求失败:", error);
      throw error;
    }
  }
  async function fetchInfo(ep) {
    const data = await getText(`https://www.bilibili.com/bangumi/play/${ep}/`);
    const str = data.match(/const playurlSSRData = (\{.*?\}\n)/s)[1];
    const json = JSON.parse(str);
    console.log(json);
    const res = json.data;
    return {
      cid: res.result.play_view_business_info.episode_info.cid,
      long_title: res.result.supplement.ogv_episode_info.long_title,
      title: res.result.supplement.ogv_episode_info.index_title
    };
  }
  async function fetchVideoData(id) {
    const data = await getText(`https://www.bilibili.com/video/${id}/`);
    const str = data.match(/window\.__INITIAL_STATE__=(.*);\(function\(\){/)[1];
    const res = JSON.parse(str);
    console.log(res);
    return {
      cid: res.videoData.cid,
      long_title: res.videoData.title,
      title: res.videoData.title
    };
  }
  async function downloadFile(cid, title) {
    const url = `https://comment.bilibili.com/${cid}.xml`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }
      const blob = await response.blob();
      saveAs(blob, `${title}.xml`);
      console.log("文件下载完成");
    } catch (error) {
      console.error("下载失败:", error.message);
    }
  }
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : undefined)();
  function get_api_info(url, payload, response) {
    if (url.includes("https://pbaccess.video.qq.com/trpc.barrage.custom_barrage.CustomBarrage/GetDMStartUpConfig")) {
      console.log("vqq", url, response);
      const cloned = response.clone();
      cloned.json().then(async (data) => {
        console.log("Fetch响应内容:", data);
        if (data && data.data && data.data.segment_index) {
          console.log("Fetch请求内容:", payload);
          localStorage.setItem("payload", payload);
          console.log(data.data.segment_index);
          localStorage.setItem("segment_index", JSON.stringify(data.data.segment_index));
        }
      });
    }
  }
  async function down_vqq_danmu() {
    const payload = localStorage.getItem("payload");
    const segment_index = localStorage.getItem("segment_index");
    const vid = JSON.parse(payload).vid;
    await fetchAndMergeBarrages(JSON.parse(segment_index), vid);
  }
  async function fetchAndMergeBarrages(segmentsData, vid) {
    const baseUrl = `https://dm.video.qq.com/barrage/segment/${vid}/`;
    const allBarrages = [];
    const segmentNames = Object.values(segmentsData).map((s) => s.segment_name);
    for (let i = 0; i < segmentNames.length; i++) {
      const segmentName = segmentNames[i];
      console.log(`正在请求片段 ${i + 1}/${segmentNames.length}: ${segmentName}`);
      try {
        const response = await fetch(baseUrl + segmentName);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.barrage_list && Array.isArray(data.barrage_list)) {
          allBarrages.push(...data.barrage_list);
          console.log(`  成功获取 ${data.barrage_list.length} 条弹幕`);
        } else {
          console.log("  该片段没有弹幕数据");
        }
      } catch (error) {
        console.error(`请求片段 ${segmentName} 失败:`, error);
      }
    }
    const result = { barrage_list: allBarrages };
    console.log(`总共获取到 ${allBarrages.length} 条弹幕`);
    const xmlContent = convertToBilibiliXML(allBarrages);
    const blob = new Blob([xmlContent], {
      type: "application/xml;charset=utf-8"
    });
    saveAs(blob, `${vid}.xml`);
    return result;
  }
  function convertToBilibiliXML(barrageList) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<i>\n';
    barrageList.forEach((barrage) => {
      const timeOffset = parseInt(barrage.time_offset || "0") / 1e3;
      const time = timeOffset;
      const type = 1;
      const fontSize = 25;
      const color = 16777215;
      const timestamp = barrage.create_time || "0";
      const pool = 0;
      const userID = barrage.vuid || "";
      const rowID = barrage.id || "";
      const text = barrage.content || "";
      const escapedText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
      const pValue = `${time},${type},${fontSize},${color},${timestamp},${pool},${userID},${rowID}`;
      xml += `<d p="${pValue}">${escapedText}</d>
`;
    });
    xml += "</i>";
    return xml;
  }
  function interceptor() {
    const originalFetch = _unsafeWindow.fetch;
    _unsafeWindow.fetch = async function(input, init) {
      const response = await originalFetch(input, init);
      const payload = init == null ? undefined : init.body;
      const url = typeof input === "string" ? input : input.url;
      get_api_info(url, payload, response);
      return response;
    };
  }
  create_button();
  interceptor();
  function create_button() {
    const button = document.createElement("button");
    button.textContent = "下载弹幕";
    button.style.position = "fixed";
    button.style.left = "10px";
    button.style.top = "50%";
    button.style.transform = "translateY(-50%)";
    button.style.zIndex = "9999";
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#fb7299";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    button.addEventListener("click", async () => {
      const url = window.location.href;
      if (url.includes("bilibili")) {
        await down_bili_danmu();
      } else if (url.includes("v.qq.com")) {
        await down_vqq_danmu();
      }
    });
    document.body.appendChild(button);
  }

})(saveAs);