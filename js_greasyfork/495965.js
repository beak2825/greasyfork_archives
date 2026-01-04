// ==UserScript==
// @name         Pixiv visited customizer
// @namespace    https://javelin.works/
// @version      0.1.1
// @description  Pixivの閲覧済み画像のサムネイルに枠をつけて強調します
// @author       sanadan <jecy00@gmail.com>
// @match        https://www.pixiv.net/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495965/Pixiv%20visited%20customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/495965/Pixiv%20visited%20customizer.meta.js
// ==/UserScript==

(function () {
  'use strict'

  document.head.insertAdjacentHTML('beforeend', `
<style>
a[href^="/artworks/"] > div:nth-child(1) {
  box-sizing: border-box;
  border: 2px solid white;
  border-radius: 8px;
  background-clip: padding-box;
}
a[href^="/artworks/"]:visited > div:nth-child(1) {
  border-color: green;
}
</style>
`)
})()
