// ==UserScript==
// @name         Free720p
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ニコニコ内の動画をyoutubeの動画に置き換える
// @author       You
// @run-at       document-end
// @match        https://www.nicovideo.jp/watch/sm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469917/Free720p.user.js
// @updateURL https://update.greasyfork.org/scripts/469917/Free720p.meta.js
// ==/UserScript==

function START() {
  let video = document.querySelector("#MainVideoPlayer > video");
  video.removeAttribute("crossOrigin");
  let yturl;

  document.getElementsByClassName("MainContainer")[0].insertAdjacentHTML(
    "beforebegin",
    `<input style='width: 650px;color: #1c1c1c;font-size: 13px;border: none;border-radius: 14px 0px 0px 0px;padding: 4px 12px 4px 7px;box-shadow: #0000006b 0px 0px 3px 0px;' id='url_input'><button style='    font-size: 13px;
    padding: 4px;
    border: #c9c9c9 1px solid;
    color: #8f8f8f;
    font-weight: bold;' id='url_button'>置換</button></input>`
  );

  document.getElementById("url_button").onclick = function (e) {
    yturl = document
      .getElementById("url_input")
      .value.split("=")[1]
      .slice(0, 11);
    video.src = `https://onion.tube/latest_version?id=${yturl}&itag=22`;
  };
}
const start = setInterval(() => {
  if (
    document.querySelector("#MainVideoPlayer > video").crossOrigin != undefined
  ) {
    START();
    clearInterval(start);
  }
}, 50);
console.log("📺Replnc v0.1\nCopyright (c) 2023 tanbatu.");
