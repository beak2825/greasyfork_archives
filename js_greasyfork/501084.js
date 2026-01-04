// ==UserScript==
// @name         YT按鈕shorts轉watch
// @namespace    https://greasyfork.org/zh-TW/users/4839-leadra
// @version      1.1.5
// @description  YouTube按鈕+快速鍵，shorts切換網址watch，快速鍵[W]在原視窗開啟；按鈕[GO]左鍵在原視窗開啟、右鍵在新視窗開啟
// @author       Leadra
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501084/YT%E6%8C%89%E9%88%95shorts%E8%BD%89watch.user.js
// @updateURL https://update.greasyfork.org/scripts/501084/YT%E6%8C%89%E9%88%95shorts%E8%BD%89watch.meta.js
// ==/UserScript==
/*原作者
@dietrich_wambach(1155795)
https://greasyfork.org/zh-TW/scripts/474490-unshort-youtube
@Meriel Varen(876245)
https://greasyfork.org/zh-TW/scripts/487271-better-youtube-shorts
*/

'use strict';

const video = document.querySelector('video');
const watchUrl = document.URL.replace("shorts/", "watch?v=");

var containerObserver = new MutationObserver(function() {
    var container_contents = document.querySelector("#actions");
    if (container_contents !== null) {
        var unshort_button = document.querySelector("#unshort-button");
        if (unshort_button === null) {
            var new_button = document.createElement("button");
            new_button.setAttribute("id", "unshort-button");
            new_button.setAttribute("style", "color: var(--yt-spec-text-primary); background-color: rgba(255,0,0,0.3); border-radius: 18em; padding-top: 10px; padding-bottom: 10px; padding-left: 12px; padding-right: 12px; margin: 5px; border-width: 0px; cursor: pointer; ");
            new_button.setAttribute("aria-label", "Unshort the video");
            new_button.setAttribute("title", "Unshort the video");
            new_button.innerText = "[W]";
            container_contents.appendChild(new_button);
          //原視窗
          new_button.addEventListener("click", function (e) {
          window.location.href = watchUrl;
          });
          //新開視窗
          new_button.addEventListener("auxclick", function (e) {
          video.pause();
          window.open(watchUrl, "_blank");
          });
        }
    }
});
containerObserver.observe(document, { subtree: true, childList: true });

document.addEventListener("keydown", function (e) {
      //if (e.shiftKey ){}
        if (e.key.toUpperCase() === "W") {
          //尚未完全載入前click可優先執行
          //const shortsPlayer = document.querySelector('#shorts-player');
          //shortsPlayer.click();
          video.pause();
            //window.open(watchUrl, "_blank");
            window.location.href = watchUrl;
        }
      });