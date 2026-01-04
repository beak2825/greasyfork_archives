// ==UserScript==
// @name         【免登录】【一键操作】国家中小学智慧教育平台电子课本教材下载【一键下载】【批量下载】
// @namespace    https://greasyfork.org/zh-CN/scripts/469898-smartedutextbookdownloader
// @version      1.8.2
// @description  在国家中小学智慧教育平台网站中添加电子课本下载按钮，在列表中无需跳转，无需登录，批量下载
// @author       @topjohncian
// @require      https://unpkg.com/idb@7/build/umd.js
// @require      https://unpkg.com/coco-message@2.0.3/coco-message.min.js
// @match        *://basic.smartedu.cn/*
// @connect      r1-ndr.ykt.cbern.com.cn
// @connect      r2-ndr.ykt.cbern.com.cn
// @connect      r3-ndr.ykt.cbern.com.cn
// @connect      s-file-1.ykt.cbern.com.cn
// @connect      s-file-2.ykt.cbern.com.cn
// @license      MIT
// @grant        window.onurlchange
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469898/%E3%80%90%E5%85%8D%E7%99%BB%E5%BD%95%E3%80%91%E3%80%90%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%E3%80%91%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E3%80%90%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E3%80%91%E3%80%90%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/469898/%E3%80%90%E5%85%8D%E7%99%BB%E5%BD%95%E3%80%91%E3%80%90%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%E3%80%91%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E3%80%90%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E3%80%91%E3%80%90%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E3%80%91.meta.js
// ==/UserScript==
// delete the below line
// import * as idb from "idb";
window.materialInfo = [];
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
async function onDownloadClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const target = event.target;
  const detailHost = [
    "https://s-file-1.ykt.cbern.com.cn",
    "https://s-file-2.ykt.cbern.com.cn",
  ];
  const downloadHost =
    "https://r1-ndr.ykt.cbern.com.cn,https://r2-ndr.ykt.cbern.com.cn,https://r3-ndr.ykt.cbern.com.cn".split(
      ","
    );
  const materialId = target.dataset.materialId;
  const fileName = target.dataset.materialTitle + ".pdf";
  //   alert("下载" + fileName + "\n" + target.dataset.materialId);
  const cancel = window.cocoMessage.loading(`正在下载 ${fileName}`);
  // @ts-expect-error
  const response = await GM.xmlHttpRequest({
    url: `${randomItem(
      detailHost
    )}/zxx/ndrv2/resources/tch_material/details/${materialId}.json`,
    method: "GET",
    responseType: "json",
  });
  const detail = JSON.parse(response.responseText);
  const pdfDetail =
    detail.ti_items.find((item) => item.ti_format === "pdf") ?? null;
  if (pdfDetail === null) {
    throw new Error("未找到pdf文件");
  }
  const downloadURL = pdfDetail.ti_storage.replace(
    /^cs_path:\${ref-path}/,
    randomItem(downloadHost)
  );
  // @ts-expect-error
  const blobResponse = await GM.xmlHttpRequest({
    url: downloadURL,
    method: "GET",
  });
  const blob = new Blob([blobResponse.response], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.target = "_blank";
  a.click();
  URL.revokeObjectURL(url);
  cancel();
  window.cocoMessage.success(`下载完成 ${fileName}`);
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const retryOperation = (operation, delay = 1000, retries = 60) =>
  new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });
async function tchMaterialHook() {
  // var script = document.createElement("script");
  // script.src = "https://cdn.jsdelivr.net/npm/idb@7/build/umd.js";
  // document.head.appendChild(script);
  // const { unProxy } = window.ah.proxy({
  //   onResponse: (response, handler) => {
  //     if (
  //       new URL(response.config.url.replace(/^(\/\/)/, "https://")).pathname ===
  //       "/proxy/cloud/v1/res_stats/actions/query"
  //     ) {
  //       window.materialInfo = JSON.parse(response.response);
  //     }
  //     handler.next(response);
  //   },
  // });
  const materialUlElement = document.querySelector(
    "#main-content > div.content > div.fish-spin-nested-loading.x-edu-nested-loading > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > ul"
  );
  if (materialUlElement === null) {
    throw new Error(
      "[SMARTEDU-DOWNLOADER] tchMaterialHook retries: not finding material ui element"
    );
  }
  const config = { attributes: true, childList: true, subtree: true };
  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    console.log(
      "[SMARTEDU-DOWNLOADER] Mutation Observer Updated",
      mutationList,
      observer
    );
    const needUpdate = mutationList
      .flatMap((mutation) => [...mutation.addedNodes, ...mutation.removedNodes])
      .every((element) => !(element instanceof HTMLButtonElement));
    if (needUpdate) {
      hook().then();
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(materialUlElement, config);
  hook().then();
  async function hook() {
    if (window.materialInfo.length === 0) {
      await initializeDB();
    }
    const materialSpanDivs = materialUlElement.querySelectorAll(
      "li > div:nth-child(2) >  div:nth-child(1)"
    );
    const versionLabelSpan = document.querySelector(
      "#main-content > div.content > div.fish-spin-nested-loading.x-edu-nested-loading > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) >  label.fish-radio-tag-wrapper-checked > span:nth-child(2)"
    );
    const versionLabel = versionLabelSpan?.innerText ?? "";
    materialSpanDivs.forEach((materialSpanDiv) => {
      materialSpanDiv.querySelector("button")?.remove();
    });
    for (const materialSpanDiv of materialSpanDivs) {
      const materialName = materialSpanDiv.querySelector("span").innerText;
      const materials = window.materialInfo.filter(
        (m) => m.title === materialName
      );
      const material =
        versionLabel !== ""
          ? materials.find((m) =>
              m.tag_list.some((tag) => tag.tag_name === versionLabel)
            ) ?? materials[0]
          : materials[0];
      const button = document.createElement("button");
      button.dataset.materialId = material.id;
      button.dataset.materialTitle = material.title;
      button.innerText = `下载 ${material.title}.pdf`;
      button.setAttribute("style", "z-index: 999;");
      button.onclick = onDownloadClick;
      materialSpanDiv.appendChild(button);
    }
  }
}
async function tchMaterialDetailHook() {
  const contentId = new URLSearchParams(location.search).get("contentId");
  if (contentId === null) {
    return;
  }
  const materialSpanDiv = document.querySelector(
    `#main-content > div.content > div:last-child > div > div > div:nth-child(1)`
  );
  const materialTitle = materialSpanDiv?.querySelector("h3")?.innerText ?? "";
  if (materialSpanDiv === null || materialTitle === "") {
    throw new Error(
      "[SMARTEDU-DOWNLOADER] tchMaterialDetailHook retries: not finding material ui element"
    );
  }
  // const material = window.materialInfo.find((m) => m.id === contentId);
  const button = document.createElement("button");
  button.dataset.materialId = contentId;
  button.dataset.materialTitle = materialTitle;
  button.innerText = `下载 ${materialTitle}.pdf`;
  button.setAttribute("style", "z-index: 999;");
  button.onclick = onDownloadClick;
  materialSpanDiv.appendChild(button);
}
// store to global
async function initializeDB() {
  const db = await idb.openDB("content-library_ncet-xedu");
  window.materialInfo = await db
    .transaction("NDR_TchMaterial", "readonly")
    .objectStore("NDR_TchMaterial")
    .getAll();
}
async function main() {
  "use strict";
  // hook list page
  if (new URL(location.href).pathname === "/tchMaterial") {
    retryOperation(tchMaterialHook);
  } else if (new URL(location.href).pathname === "/tchMaterial/detail") {
    // hook detail page
    retryOperation(tchMaterialDetailHook);
  }
}
(async function () {
  // feature is supported
  window.addEventListener("urlchange", (info) => {
    console.log(info);
    main();
  });
  await main();
})();
