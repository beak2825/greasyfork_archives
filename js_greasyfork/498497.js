// ==UserScript==
// @name        ニコニコ動画(Re:仮)説明文linkify
// @namespace   net.ghippos.nicovideo.rekari.linkify
// @match       https://www.nicovideo.jp/watch_tmp/*
// @grant       none
// @version     1.1
// @author      mohemohe
// @description 2024/6/21 13:43:27
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/498497/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%E8%AA%AC%E6%98%8E%E6%96%87linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/498497/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%E8%AA%AC%E6%98%8E%E6%96%87linkify.meta.js
// ==/UserScript==

const linkify = async (description) => {
  for (const node of description.childNodes) {
    const content = node.textContent;
    if (!content) {
      continue;
    }
    const links = content.match(/([ns]m\d+)/g);
    if (links) {
      let replacedContent = content;
      const replaces = {};
      for (const link of links) {
        const exists = await fetch(`https://www.nicovideo.jp/api/watch/tmp/${link}?_frontendId=6&_frontendVersion=0.0.0`);
        replacedContent = replacedContent.replace(link, `<a href="https://www.nicovideo.jp/watch_tmp/${link}" style="color: #0969da; text-decoration: underline">${link}${exists.status == 200 ? "[公開中]" : "[非公開]"}</a>`);
      }
      const span = document.createElement("span");
      span.innerHTML = replacedContent;
      node.parentNode.replaceChild(span, node);
    }
  }
};

// NOTE: document.bodyでMutationObserverを試したけど他のサイトと違ってなんか動かなかった
const awaiter = setInterval(async () => {
  const description = document.querySelector("main p");
  if (description) {
    clearInterval(awaiter);
    await linkify(description);
  }
}, 100);
