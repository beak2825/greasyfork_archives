// ==UserScript==
// @name        Open membership video playlist
// @name:ja-JP  メン限動画プレイリストを開くやつ
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 2023/6/14 21:21:29
// @license MIT
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/468649/Open%20membership%20video%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/468649/Open%20membership%20video%20playlist.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutations) => {
  execute()
})

observer.observe(document, {
    characterData: true,
    subtree: true
});

function sleep(n){
  return new Promise(function(resolve){
    setTimeout(resolve, 100);
  });
}
let lastLoc = ""
let registered = false
async function execute() {
  if(lastLoc !== location.pathname) {
    lastLoc = location.pathname
    if(location.pathname.startsWith("/@") || location.pathname.startsWith("/channel")) {
      GM_registerMenuCommand("Open membership playlist", () => {
        GM_xmlhttpRequest({
          method: "GET",
          url: location.href,
          onload: function(response) {
            console.log(response)
            const channelId = /<link.+?rel=\"canonical\".+?href=".+UC(.+?)">/.exec(response.responseText)[1];
            window.open("https://www.youtube.com/playlist?list=UUMO" + channelId)
          }
        });
      })
    } else {
      GM_unregisterMenuCommand("Open membership playlist")
    }
  }
}

execute()