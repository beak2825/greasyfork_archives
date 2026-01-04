// ==UserScript==
// @name         掘金广告去除
// @namespace    https://greasyfork.org/en/scripts/532890-%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4
// @version      0.2
// @description  掘金的广告越来越烦人了，悄悄把它隐藏起来
// @author       Allen-1998
// @match        *://juejin.cn/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533416/%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/533416/%E6%8E%98%E9%87%91%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const head = document.querySelector('head')
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.innerText = `
.top-banners-container,
.main-area.article-area > article > img {
  display: none !important;
}
.view-container .with-global-banner .index-nav-before,
.view-container .with-global-banner .team-content .list-header.sticky,
.view-container .with-global-banner .user-view .list-header.sticky,
.view-container .with-global-banner .view-nav {
  top: 5rem !important;
}
.header-with-banner,
.view-container .with-global-banner .index-nav-before.top,
.view-container .with-global-banner .team-content .list-header.sticky.top,
.view-container .with-global-banner .user-view .list-header.sticky.top,
.view-container .with-global-banner .view-nav.top {
  top: 0 !important;
}
`
  head.append(style)
})()
