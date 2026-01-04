// ==UserScript==
// @name        Celeste 国内镜像
// @namespace   su226
// @match       https://gamebanana.com/mods/*
// @grant       none
// @version     1.0
// @author      su226
// @description 在 GameBanana 上显示国内镜像源下载地址
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/544222/Celeste%20%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/544222/Celeste%20%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F.meta.js
// ==/UserScript==

function waitForElement(selector) {
  return new Promise(resolve => {
    const node = document.querySelector(selector);
    if (node) {
      return resolve(node);
    }
    new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType != Node.ELEMENT_NODE) {
            continue;
          }
          if (node.matches(selector)) {
            observer.disconnect();
            return resolve(node);
          }
          const child = node.querySelector(selector);
          if (child) {
            observer.disconnect();
            return resolve(child);
          }
        }
      }
    }).observe(document, { childList: true, subtree: true });
  });
}

const style = `\
.su226-wrap {
  width: 100%;
}
.su226-grayscale {
  filter: grayscale(1);
}`;

(async () => {
  const gameId = document.querySelector("meta[property='gb:gameid']").content;
  if (gameId !== "6460") {
    return;
  }
  await waitForElement("#FilesModule");
  document.head.appendChild(document.createElement("style")).textContent = style;
  const links = document.querySelectorAll(".DownloadOptions > .GreenColor");
  for (const link of links) {
    const isFileInfoLink = link.hash.startsWith("#FileInfo_");
    const fileId = isFileInfoLink ? link.hash.slice(10) : link.pathname.slice(4);
    if (isFileInfoLink) {
      link.insertAdjacentHTML("beforebegin", "<div class='su226-wrap'></div>");
      link.insertAdjacentHTML("afterend", `<a class="DownloadLink GreyColor" href="${link.origin}/dl/${fileId}"><spriteicon class="MiscIcon SmallManualDownloadIcon su226-grayscale"></spriteicon><span>下载</span></a><a class="DownloadLink GreyColor" href="${link.href}"><spriteicon class="MiscIcon FileInfoIcon"></spriteicon><span>详情</span></a>`);
    } else {
      link.insertAdjacentHTML("afterend", `<a class="DownloadLink GreyColor" href="${link.href}"><spriteicon class="MiscIcon SmallManualDownloadIcon su226-grayscale"></spriteicon><span>下载</span></a>`);
    }
    link.href = `https://celeste.weg.fan/api/v2/download/gamebanana-files/${fileId}`;
    link.querySelector("span").textContent = "加速下载";
  }
})();
