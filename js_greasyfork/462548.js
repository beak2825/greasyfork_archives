// ==UserScript==
// @name         ChatGPT heartbeat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  减少 ChatGPT 官方网页需要频繁刷新的简单办法
// @author       https://v2ex.com/t/926890
// @match        https://chat.openai.com/chat*
// @icon         https://chat.openai.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462548/ChatGPT%20heartbeat.user.js
// @updateURL https://update.greasyfork.org/scripts/462548/ChatGPT%20heartbeat.meta.js
// ==/UserScript==

/*
  需要保持非常久的，可以额外尝试在 chrome://discards 里禁用 `Auto Discardable`，
  或者用 https://github.com/WorldLanguages/DoNotDiscard
  否则就算保持了 Cookies 有效，Chrome 也有可能自动休眠标签页。
*/
(function () {
  var count = 0;
  var iframe = document.createElement("iframe");
  iframe.id = "heartbeat";
  iframe.style = "display:none";
  iframe.name = "heartbeat";
  iframe.src = "https://chat.openai.com/robots.txt";
  var fn = function () {
    setTimeout(function () {
      if (count++ % 60 === 59) {
        iframe.src = "https://chat.openai.com/404";
      } else if (iframe.src === "https://chat.openai.com/robots.txt") {
        iframe.contentWindow.location.reload(true);
      } else {
        iframe.src = "https://chat.openai.com/robots.txt";
      }
    }, Math.floor(Math.random() * 5) * 1000 + 5000);
  };
  if (iframe.attachEvent) {
    iframe.attachEvent("onload", fn);
  } else {
    iframe.onload = fn;
  }
  document.head.insertBefore(iframe, document.head.firstChild);
})();
