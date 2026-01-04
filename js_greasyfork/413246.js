// ==UserScript==
// @name         DouyinDownloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download douyin video without watermark
// @author       blvd20
// @include      https://www.iesdouyin.com/*
// @grant GM_download
// @downloadURL https://update.greasyfork.org/scripts/413246/DouyinDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/413246/DouyinDownloader.meta.js
// ==/UserScript==

const MobileUA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";

function main() {
  const match = location.href.match(/share\/video\/(\d*)/);
  const id = match[1];
  if (!id) return;

  fetch("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + id)
    .then((res) => res.json())
    .then((json) => {
      console.log("[DouyinDownloader]", json);
      const info = json.item_list[0];
      const url = info.video.play_addr.url_list[0].replace("playwm", "play");
      const file = (info.desc || id) + ".mp4";
      addDownloadButton(url, file);
    });
}

function addDownloadButton(url, file) {

  const buttonEl = document.createElement("button");
  buttonEl.textContent = "Download";
  document.body.appendChild(buttonEl);

  buttonEl.style.position = 'fixed'
  buttonEl.style.zIndex = '10000'
  buttonEl.style.top = '0'
  buttonEl.style.left = '0'
  buttonEl.style.width = '100%'
  buttonEl.style.height = '60px'

  buttonEl.addEventListener("click", () => {
    GM_download({
      url: url,
      headers: {
        "user-agent": MobileUA,
      },
      name: file,
    });
  });
}

main();
