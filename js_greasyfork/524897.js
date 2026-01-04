// ==UserScript==
// @name         Bilibili动态预览图片下载
// @namespace    BilibiliDynamicPreviewDownload
// @license      MIT
// @version      1.3.0
// @description  在B站个人空间的投稿 - 图文界面，提供右键直接下载动态中的图片，并记录已下载的动态ID，改变背景颜色来区别。（新支持新旧动态页面以及旧版专栏内图片）
// @author       Kaesinol
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://t.bilibili.com/*
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/524897/Bilibili%E5%8A%A8%E6%80%81%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524897/Bilibili%E5%8A%A8%E6%80%81%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ===== 数据存取兼容 =====
  const loadDownloadedDynamicIds = () => {
    const stored = GM_getValue("downloadedDynamicIds", null);
    if (!stored) return new Set();
    if (Array.isArray(stored)) return new Set(stored);
    if (typeof stored === "object") return new Set(Object.keys(stored));
    return new Set();
  };

  let downloadedDynamicIds = loadDownloadedDynamicIds();

  const saveDownloadedDynamicIds = () => {
    GM_setValue("downloadedDynamicIds", Array.from(downloadedDynamicIds));
  };

  // ===== API =====
  const fetchJsonData = async (dynamicId, ret = false) => {
    const apiUrl =
      "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=" +
      dynamicId;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(response.status);

    const jsonData = await response.json();
    if (ret) return jsonData;

    const cardData = JSON.parse(jsonData.data.card.card);
    const pictures =
      cardData.item?.pictures?.map((p) =>
        p.img_src.replace(/^http:/, "https:")
      ) ||
      cardData.origin_image_urls ||
      [];

    const info = jsonData.data.card.desc.user_profile.info;
    const fileName = `${info.uname} - ${info.uid} - ${dynamicId}`;

    if (pictures.length > 1)
      await createZipAndDownload(pictures, fileName);
    else
      await downloadFile(pictures[0], 0, fileName);

    downloadedDynamicIds.add(String(dynamicId));
    saveDownloadedDynamicIds();
    updateLinkColor(dynamicId);
  };

  // ===== ZIP（fflate）=====
  const createZipAndDownload = async (urls, fileName) => {
    const files = {};

    await Promise.all(
      urls.map(async (url, index) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error("fetch failed");

        const data = new Uint8Array(await res.arrayBuffer());
        const ext = getFileExtensionFromUrl(url)[1];
        files[`${fileName} - ${index + 1}.${ext}`] = data;
      })
    );

    const zipped = fflate.zipSync(files, { level: 6 });
    const blob = new Blob([zipped], { type: "application/zip" });

    GM_download({
      url: URL.createObjectURL(blob),
      name: `${fileName}.zip`,
      saveAs: false,
    });
  };

  const getFileExtensionFromUrl = (url) =>
    url.match(/\.([a-zA-Z0-9]+)$/);

  const downloadFile = async (url, index, fileName) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");

    const blob = await res.blob();
    const ext = getFileExtensionFromUrl(url)[1];

    GM_download({
      url: URL.createObjectURL(blob),
      name: `${fileName} - ${index + 1}.${ext}`,
      saveAs: false,
    });
  };

  // ===== DOM =====
  const handleEvent = (event, targetElement) => {
    event.preventDefault();
    event.stopPropagation();

    const link = targetElement.querySelector("a");
    const match = link?.href.match(/\/(\d+)\??/);
    if (match) fetchJsonData(match[1]);
  };

  const updateLinkColor = (dynamicId) => {
    const link = document.querySelector(`a[href*="${dynamicId}"]`);
    if (link) link.parentElement.style.backgroundColor = "green";
  };

  const observer = new MutationObserver(() => {
    document
      .querySelectorAll("div.opus-body div.item")
      .forEach((el) => {
        if (!el.hasAttribute("data-listener")) {
          el.addEventListener(
            "contextmenu",
            (e) => handleEvent(e, el),
            true
          );
          el.setAttribute("data-listener", "true");
        }

        const link = el.querySelector("a");
        const m = link?.href.match(/\/(\d+)\??/);
        if (m && downloadedDynamicIds.has(m[1])) {
          link.parentElement.style.backgroundColor = "green";
        }
      });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ===== 页面菜单 =====
  const getID = () => {
    const opus = location.pathname.match(/^\/opus\/(\d+)/);
    if (opus) return opus[1];
    const t = location.href.match(/^https?:\/\/t\.bilibili\.com\/(\d+)/);
    return t?.[1] || null;
  };

  const exportDownloadedDynamicIds = () => {
    const blob = new Blob(
      [JSON.stringify([...downloadedDynamicIds])],
      { type: "application/json" }
    );

    GM_download({
      url: URL.createObjectURL(blob),
      name: "downloadedDynamicIds.json",
      saveAs: true,
    });
  };

  const importDownloadedDynamicIds = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = () => {
      const reader = new FileReader();
      reader.onload = () => {
        JSON.parse(reader.result).forEach((id) =>
          downloadedDynamicIds.add(String(id))
        );
        saveDownloadedDynamicIds();
        alert("导入成功");
      };
      reader.readAsText(input.files[0]);
    };

    input.click();
  };

  GM_registerMenuCommand("导出已下载的动态ID", exportDownloadedDynamicIds);
  GM_registerMenuCommand("导入已下载的动态ID", importDownloadedDynamicIds);

  const dynamicId = getID();
  if (dynamicId) {
    GM_registerMenuCommand("下载本条动态图片", () =>
      fetchJsonData(dynamicId)
    );
  }

})();