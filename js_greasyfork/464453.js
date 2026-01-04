// ==UserScript==
// @name        Kemono.party Image Full Size Autoloader
// @name:zh-TW Kemono.party自動載入完整圖片
// @description Auto load full size image in kemono.party
// @description:zh-tw 在Kemono.party的Post自動載入完整大小的圖片
// @match     https://kemono.party/*/user/*/post/*
// @version     1.0.0
// @namespace   andyching168.scripts
// @author      andyching168
// @license     MIT License
// @run-at      document-start
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/464453/Kemonoparty%20Image%20Full%20Size%20Autoloader.user.js
// @updateURL https://update.greasyfork.org/scripts/464453/Kemonoparty%20Image%20Full%20Size%20Autoloader.meta.js
// ==/UserScript==

var G=0;

setTimeout(R, 500);
function R() {
    G=document.querySelector("#page > div > div.post__files").childElementCount


for (var i = 1; i <= G; i++) {
          document.querySelector("#page > div > div.post__files > div:nth-child("+i+") > a > img").src=document.querySelector("#page > div > div.post__files > div:nth-child("+i+") > a").href;
}document.body.insertAdjacentHTML(
  "beforeend",
  '<style>.post__files .fileThumb img { max-height: 100vh }</style>'
);
document.QuerySelectorAll(".post__files a.fileThumb > img").forEach(img => {
  img.src = img.parentNode.href;
});
}