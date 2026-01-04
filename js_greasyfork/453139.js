// ==UserScript==
// @name        Danbooru image downloader with tags
// @namespace   Violentmonkey Scripts
// @match       https://danbooru.donmai.us/posts/*
// @grant       none
// @version     1.0
// @author      N
// @description 이미지 리네임 & 다운로드
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453139/Danbooru%20image%20downloader%20with%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/453139/Danbooru%20image%20downloader%20with%20tags.meta.js
// ==/UserScript==
(async function() {
    async function toDataURL(url) {
        const blob = await fetch(url).then(res => res.blob());
        return URL.createObjectURL(blob);
    }
    var img = document.querySelector("picture > img");
    var ognlFilePath = img.src;
    var splitted = ognlFilePath.split("/");
    var fileExt = splitted[splitted.length-1].split(".")[1]
    var tags = Array.prototype.slice.call(document.querySelectorAll(".general-tag-list .search-tag")).map(a => a.textContent).join(", ");
    var author = document.querySelector(".artist-tag-list .search-tag").innerText;

    var fullName = author + ", " + tags;

    document.querySelector(".fit-width").onclick = async () => {
      const a = document.createElement("a");
      a.href = await toDataURL(ognlFilePath);
      a.download = fullName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
})();

