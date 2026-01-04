// ==UserScript==
// @name               Nei.st Block 404
// @name:zh-CN         Nei.st 没有 404
// @include            http*://nei.st/*
// @copyright          2020, Handle
// @version            0.0.1
// @description        Block 404 info on nei.st
// @description:zh-CN  禁用 Nei.st 的赏味期限制
// @author             Handle
// @namespace          https://nei.st/
// @supportURL         https://nei.st/
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/403445/Neist%20Block%20404.user.js
// @updateURL https://update.greasyfork.org/scripts/403445/Neist%20Block%20404.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const styleClassName = '_nei_st_block_404_style_'

  const insertStyle = () => {
    const styleDOM = document.createElement('style')
    styleDOM.classList.add(styleClassName)
    styleDOM.innerHTML = `
    .site-header.headroom.headroom--top .nav-icon {
      fill: rgb(0,0,0,.84)!important;
    }
    .fullscreen_dek_below.css--lede-fullscreen-wrapper {
      display: none!important;
    }
    .page-title:not(#algolia-search-box), .site-header.headroom.headroom--top {
      color: rgba(0, 0, 0, 0.84)!important;
    }
    .entry-content>p, .entry-content>p:first-of-type {
      color: rgba(0,0,0,.54)!important;
    }
    .entry-content.aesop-entry-content {
      overflow: auto!important;
      max-height: fit-content!important;
    }
    .entry-content>p {
      color: rgba(0, 0, 0, 0.84)!important;
    }
    `
    if (!document.querySelector(`.${styleClassName}`)) {
      document.head.append(styleDOM)
    }
  }

  window.addEventListener('load', insertStyle)
  insertStyle()
})()
