// ==UserScript==
// @name 强行支持discourse
// @namespace    http://sample.net/
// @version      0.1
// @description  强行覆盖discourse不支持限制，修改自英文搜索结果@Fuir
// @author       jing_2hang1105
// @match        *://foro.iminecrafting.com/*
// @match        *://discuss.bevry.me/*
// @match        *://discuss.huggingface.co/*
// @match        *://discourse.slicer.org/*
// @match        *://forum.torproject.net/*
// @match        *://forum.koishi.xyz/*
// @include       *://*
// @icon         https://www.google.com/s2/favicons?domain=www.discourse.org
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/479575/%E5%BC%BA%E8%A1%8C%E6%94%AF%E6%8C%81discourse.user.js
// @updateURL https://update.greasyfork.org/scripts/479575/%E5%BC%BA%E8%A1%8C%E6%94%AF%E6%8C%81discourse.meta.js
// ==/UserScript==

Object.defineProperty(unsafeWindow, 'unsupportedBrowser', {
  value: false,
  writable: false
});