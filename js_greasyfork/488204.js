// ==UserScript==
// @name         Spotify 跳转至豆瓣
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在 Spotify 的专辑菜单中新增“转至豆瓣”按钮。Quickly navigate to Douban from Spotify.
// @author       You
// @match        open.spotify.com/*
// @match        spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488204/Spotify%20%E8%B7%B3%E8%BD%AC%E8%87%B3%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/488204/Spotify%20%E8%B7%B3%E8%BD%AC%E8%87%B3%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 监听 body 下元素的变动
  new MutationObserver(observer).observe(document.body, { childList: true });
  function observer(record) {
    /** @type {HTMLElement | undefined} 新增元素*/
    const newNode = record?.[0]?.addedNodes?.[0]?.firstElementChild;
    // 判断新增元素是否为专辑菜单
    if (
      newNode &&
      newNode.id === "context-menu" &&
      // 超过6项的菜单为歌曲菜单。专辑菜单为6项或5项。
      (newNode.firstElementChild.children.length == 6 ||
        newNode.firstElementChild.children.length == 5)
      // 确保含有 "转至艺人电台" 的图标（无必要）
      // possibleNode.querySelector(
      //   'path[d="M5.624 3.886A4.748 4.748 0 0 0 3.25 8c0 1.758.955 3.293 2.375 4.114l.75-1.3a3.249 3.249 0 0 1 0-5.63l-.75-1.298zm4.001 1.299.75-1.3A4.748 4.748 0 0 1 12.75 8a4.748 4.748 0 0 1-2.375 4.114l-.75-1.3a3.249 3.249 0 0 0 0-5.63zM8 6.545a1.455 1.455 0 1 0 0 2.91 1.455 1.455 0 0 0 0-2.91z"]'
      // )
    ) {
      // 取得专辑信息
      let album, artist;
      const menuBtn = document.querySelector("button[data-context-menu-open]");
      if (location.pathname.startsWith("/album/")) {
        // 若为专辑页
        album = document
          .querySelector(`span[data-testid="entityTitle"]`)
          .firstElementChild.textContent;
        artist = document
          .querySelector(`a[data-testid="creator-link"]`)
          .textContent;
      } else if (location.pathname.includes("/discography/")) {
        // 若为专辑目录页
        album =
          menuBtn.parentElement.parentElement.firstElementChild
            .firstElementChild.textContent;
        artist =
          menuBtn.parentElement.parentElement.parentElement.parentElement
            .firstElementChild.firstElementChild.firstElementChild.textContent;
      } else return;

      // 作为参考的按钮（加入播放队列）
      const referenceItem = newNode.firstElementChild.children[1];
      /** @type {HTMLElement} */
      const newItem = referenceItem.cloneNode(true);

      // 替换图标和名字
      newItem.firstElementChild.firstElementChild.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" class="Svg-sc-ytk21e-0 ewCuAY" viewBox="0 0 296.37 296.37"><path d="M271.558,11.076 C281.148,11.076 288.924,18.852 288.924,28.442 L288.924,271.558 C288.924,281.148 281.148,288.924 271.558,288.924 L28.442,288.924 C18.852,288.924 11.076,281.148 11.076,271.558 L11.076,28.442 C11.076,18.852 18.852,11.076 28.442,11.076 z M51.754,51.621 L51.754,74.027 L241.892,74.027 L241.892,51.621 z M63.785,92.621 L63.785,184.008 L80.134,184.008 L99.988,225.702 L46.072,225.702 L46.072,247.681 L246.958,247.681 L246.958,225.702 L191.668,225.702 L211.787,184.008 L229.593,184.008 L229.593,92.621 z M200.65,115.105 L200.65,162.301 L91.575,162.301 L91.575,115.105 z M167.218,225.702 L124.996,225.702 L105.358,184.008 L187.337,184.008 z"></path></svg>`;
      newItem.firstElementChild.children[1].innerHTML = "转至豆瓣";
      // 处理点击事件
      newItem.addEventListener("click", () => {
        if (album && artist) {
          // 在豆瓣上搜索
          window.open(
            `https://www.douban.com/search?cat=1003&q=${album} ${artist}`
          );
        }
        // 再次单击菜单键关闭专辑菜单
        menuBtn.click();
      });

      // 在参考按钮后加入新按钮
      referenceItem.after(newItem);
    }
  }
})();