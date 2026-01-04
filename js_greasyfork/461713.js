// ==UserScript==
// @name         fantiaの画像ビューアーで矢印キー移動できるようにする
// @namespace    https://ci7lus.github.io
// @version      0.2
// @description  fantiaの画像ビューアーで矢印キー移動できるようにします
// @author       ci7lus
// @match        https://fantia.jp/posts/*
// @grant        none
// @license      MIT
// @copyright    Copyright (c) 2023 ci7lus
// @downloadURL https://update.greasyfork.org/scripts/461713/fantia%E3%81%AE%E7%94%BB%E5%83%8F%E3%83%93%E3%83%A5%E3%83%BC%E3%82%A2%E3%83%BC%E3%81%A7%E7%9F%A2%E5%8D%B0%E3%82%AD%E3%83%BC%E7%A7%BB%E5%8B%95%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461713/fantia%E3%81%AE%E7%94%BB%E5%83%8F%E3%83%93%E3%83%A5%E3%83%BC%E3%82%A2%E3%83%BC%E3%81%A7%E7%9F%A2%E5%8D%B0%E3%82%AD%E3%83%BC%E7%A7%BB%E5%8B%95%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

;(function () {
  "use strict"
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowRight") {
      document
        .querySelector(
          "#image-slideshow > div > div > a.move-button.next.clickable.ng-scope"
        )
        ?.click()
    } else if (e.code === "ArrowLeft") {
      document
        .querySelector(
          "#image-slideshow > div > div > a.move-button.prev.clickable.ng-scope"
        )
        ?.click()
    } else if (e.code === "Escape") {
      document
        .querySelector(
          "#image-slideshow > div > div > div > a.btn.btn-dark.btn-sm"
        )
        ?.click()
    }
  })
})()
