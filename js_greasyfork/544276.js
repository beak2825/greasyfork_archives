// ==UserScript==
// @name        Curseforge 直接下载
// @namespace   su226
// @include     https://www.curseforge.com/*
// @include     https://legacy.curseforge.com/*
// @grant       none
// @version     1.1
// @author      su226
// @description 跳过下载时的 5 秒等待，适用于新旧 Curseforge。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/544276/Curseforge%20%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/544276/Curseforge%20%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function observeSelector(selector, callback) {
  for (const el of document.querySelectorAll(selector)) {
    callback(el);
  }
  new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType != Node.ELEMENT_NODE) {
          continue;
        }
        if (node.matches(selector)) {
          callback(node);
        }
        for (const el of node.querySelectorAll(selector)) {
          callback(el);
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });
}

async function downloadOld(href) {
  if (href.match(/\/\d+$/)) {
    location.href = href + "/file";
    return;
  }
  try {
    const response = await fetch(href);
    const content = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const downloadLink = doc.querySelector(".alink").href;
    location.href = downloadLink;
  } catch (e) {
    // 下载一段时间内下载过的文件会直接跳转 edge.forgecdn.net，导致触发 CORS 拦截
    console.exception(e);
    location.href = href;
  }
}

async function downloadNew(href) {
  try {
    const response = await fetch(href);
    const content = await response.text();
    const projectId = content.match(/\\"project\\":{\\"id\\":(\d+)/)[1];
    const fileId = href.match(/\d+$/);
    location.href = `https://www.curseforge.com/api/v1/mods/${projectId}/files/${fileId}/download`;
  } catch (e) {
    // 这个纯粹是兜底
    console.exception(e);
    location.href = href;
  }
}

if (location.host.indexOf("legacy") !== -1) {
  observeSelector("a", el => {
    if (!el.href.match(/\/download($|\/)/) || el.href.indexOf("?client=y") !== -1) {
      return;
    }
    console.log(el);
    el.addEventListener("click", e => {
      e.preventDefault();
      downloadOld(el.href);
    });
  });
} else {
  observeSelector(".download-cta", el => {
    console.log(el);
    el.addEventListener("click", e => {
      e.preventDefault();
      downloadNew(el.href);
    })
  });
  observeSelector(".kebab-menu a", el => {
    if (el.href.indexOf("/download/") === -1) {
      return;
    }
    console.log(el);
    el.addEventListener("click", e => {
      e.preventDefault();
      downloadNew(el.href);
    })
  });
  observeSelector(".project-download-modal .download-btn", el => {
    console.log(el);
    el.addEventListener("click", e => {
      e.preventDefault();
      downloadNew(el.href);
    });
  });
  observeSelector(".download-button", el => {
    console.log(el);
    el.addEventListener("click", e => {
      e.preventDefault();
      downloadNew(el.href);
    });
  });
}
