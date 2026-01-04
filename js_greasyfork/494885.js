// ==UserScript==
// @name         Tweetdeck Gomamayo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add gomamayo button
// @author       You
// @match        https://twitter.com/i/tweetdeck*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494885/Tweetdeck%20Gomamayo.user.js
// @updateURL https://update.greasyfork.org/scripts/494885/Tweetdeck%20Gomamayo.meta.js
// ==/UserScript==

// パクツイのコードを引用
// https://greasyfork.org/ja/scripts/429573-tweetdeck-paku-tweet

(function () {
  let FLAG = true;
  function gomamayo(e) {
    if (!confirm("⁉️")) return; // この行の先頭の//を消せばツイート前に確認する
    let parent = e.target.closest(".js-tweet");
    // parent.querySelector(".js-icon-favorite").click(); // この行の先頭の//を消せばふぁぼする
    let tweet = parent.querySelectorAll(".tweet-text")[0].innerHTML;
    tweet = tweet
      .replace(/<img class="emoji" draggable="false" alt="([^"]*)" src="([^"]*)">/g, "$1")
      .replace(/<a href="([^"]*)" target="_blank" class="url-ext"[^>]*>[^<]*<\/a>/g, "$1")
      .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    let textarea = document.querySelector(".js-compose-text");
    if (textarea === null) {
      document.querySelector(".tweet-button").click();
      textarea = document.querySelector(".js-compose-text");
    }
    textarea.value = tweet + "⁉️";
    let event = document.createEvent("HTMLEvents");
    event.initEvent("change", false, false);
    textarea.dispatchEvent(event);
    if (!e.shiftKey) document.querySelector(".js-send-button").click();
  }

  function appendButton(node) {
    let target = node.querySelectorAll(".js-tweet-actions .tweet-action-item")[3];
    if (target === null || undefined) return;
    let src = document.createElement("li");
    src.className = "tweet-action-item pull-left margin-r--13 margin-l--1";
    let src_a = document.createElement("a");
    src_a.className = "tweet-action position-rel";
    src_a.href = "#";
    src_a.textContent = "⁉️";
    src.appendChild(src_a);
    let item = target.parentNode.insertBefore(src, target);
    item.querySelector("a").addEventListener("click", gomamayo);
  }

  while (FLAG) {
    if (document.querySelector(".application") !== null) {
      setTimeout(() => { }, 300);
      let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType == node.ELEMENT_NODE && node.classList.contains('js-stream-item')) {
              appendButton(node);
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      FLAG = false;
    }
  }
})();